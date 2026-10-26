'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  loginSchema,
  changePasswordSchema,
  LoginInput,
  ChangePasswordInput,
} from '@/validations/auth.schema';
import { ActionResult } from '@/types/action.types';
import { ROLE_DASHBOARD_PATH, UserRole } from '@/constants/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function formatRoleName(role: string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin Sekolah';
    case 'guru':
      return 'Guru / Pendidik';
    case 'murid':
      return 'Murid';
    case 'wali_murid':
      return 'Wali Murid';
    default:
      return role;
  }
}

function getRoleTab(role: string): { tabKey: 'murid' | 'wali_murid' | 'staf'; tabLabel: string } {
  if (role === 'murid') {
    return { tabKey: 'murid', tabLabel: 'Murid' };
  }
  if (role === 'wali_murid') {
    return { tabKey: 'wali_murid', tabLabel: 'Wali Murid' };
  }
  return { tabKey: 'staf', tabLabel: 'Staf / Guru' };
}

/**
 * Server Action untuk autentikasi pengguna dengan multi-identifier (NIS, No WA, atau Email)
 */
export async function loginAction(
  input: LoginInput
): Promise<ActionResult<{ redirectTo: string }>> {
  // 1. Validasi Skema Zod
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    const firstErrorMessage =
      Object.values(validation.error.flatten().fieldErrors)[0]?.[0] ||
      'Data yang dimasukkan tidak memenuhi format yang ditentukan.';
    return {
      success: false,
      title: 'Format Data Tidak Sesuai',
      error: firstErrorMessage,
      fieldErrors: validation.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const { identifier, password, roleType } = validation.data;
  const cleanId = identifier.trim();

  try {
    const adminSupabase = createAdminClient();

    // 2. Cari data profile berdasarkan kategori tab terpilih
    let profileQuery = adminSupabase.from('profiles').select('*');

    if (roleType === 'murid') {
      profileQuery = profileQuery
        .eq('role', 'murid')
        .eq('login_identifier', cleanId);
    } else if (roleType === 'wali_murid') {
      profileQuery = profileQuery
        .eq('role', 'wali_murid')
        .or(`login_identifier.eq.${cleanId},phone.eq.${cleanId}`);
    } else {
      profileQuery = profileQuery
        .in('role', ['super_admin', 'admin', 'guru'])
        .or(`email.ilike.${cleanId},login_identifier.eq.${cleanId}`);
    }

    const { data: profiles, error: profileError } = await profileQuery.limit(1);

    if (profileError) {
      console.error('[Auth Debug] Database query profiles error:', profileError);
      return {
        success: false,
        title: 'Kendala Database',
        error: `Gagal membaca basis data sekolah: ${profileError.message}`,
        code: 'SERVER_ERROR',
      };
    }

    // 3. Jika tidak ditemukan di tab aktif, lakukan Smart Role Lookup lintas kategori
    if (!profiles || profiles.length === 0) {
      const { data: crossProfiles } = await adminSupabase
        .from('profiles')
        .select('name, role, login_identifier, email, phone')
        .or(`login_identifier.eq.${cleanId},email.ilike.${cleanId},phone.eq.${cleanId}`)
        .limit(1);

      if (crossProfiles && crossProfiles.length > 0) {
        const found = crossProfiles[0];
        const { tabLabel } = getRoleTab(found.role);
        return {
          success: false,
          title: 'Kategori Tab Tidak Sesuai',
          error: `Akun "${cleanId}" terdaftar sebagai ${formatRoleName(found.role)} (${found.name}). Silakan beralih ke tab "${tabLabel}" di atas untuk masuk.`,
          code: 'ROLE_MISMATCH',
        };
      }

      // Jika benar-benar tidak ditemukan di kategori manapun
      if (roleType === 'murid') {
        return {
          success: false,
          title: 'Akun Murid Tidak Ditemukan',
          error: `Nomor Induk Siswa (NIS) "${cleanId}" tidak terdaftar di pangkalan data SDIT Fajar. Periksa kembali pengetikan NIS Anda.`,
          code: 'NOT_FOUND',
        };
      } else if (roleType === 'wali_murid') {
        return {
          success: false,
          title: 'Akun Wali Tidak Ditemukan',
          error: `Nomor WhatsApp / telepon "${cleanId}" tidak ditemukan. Pastikan menggunakan nomor aktif yang didaftarkan saat PPDB.`,
          code: 'NOT_FOUND',
        };
      } else {
        return {
          success: false,
          title: 'Akun Staf Tidak Terdaftar',
          error: `Email atau pengenal "${cleanId}" tidak terdaftar sebagai staf atau dewan guru resmi SDIT Fajar.`,
          code: 'NOT_FOUND',
        };
      }
    }

    const profile = profiles[0];

    // 4. Verifikasi status akun aktif
    if (!profile.is_active) {
      console.warn('[Auth Debug] Akun terblokir/nonaktif:', { email: profile.email, name: profile.name });
      return {
        success: false,
        title: 'Akun Dinonaktifkan',
        error: `Akun atas nama ${profile.name} berstatus tidak aktif. Silakan hubungi Administrator Sekolah atau Bagian Tata Usaha untuk pengaktifan kembali.`,
        code: 'ACCOUNT_INACTIVE',
      };
    }

    // 5. Autentikasi ke Supabase Auth dengan email profil terdaftar
    const serverSupabase = await createClient();
    const { error: authError } = await serverSupabase.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (authError) {
      console.error('[Auth Debug] Supabase signInWithPassword gagal:', {
        email: profile.email,
        errorMessage: authError.message,
        errorStatus: authError.status,
      });

      // Status 500 atau pesan database error
      if (authError.status && authError.status >= 500) {
        return {
          success: false,
          title: 'Kendala Server Otentikasi',
          error: `Terjadi kendala pada layanan otentikasi database (status ${authError.status}). Silakan laporkan kepada administrator sistem.`,
          code: 'SERVER_ERROR',
        };
      }

      // Kata sandi salah (400 atau invalid credentials)
      if (
        authError.status === 400 ||
        authError.message.toLowerCase().includes('invalid login credentials')
      ) {
        if (roleType === 'murid') {
          return {
            success: false,
            title: 'Kata Sandi Murid Salah',
            error: 'Kata sandi yang Anda masukkan tidak sesuai.',
            hint: 'Format kata sandi awal: tempatddmmyyyy (tempat lahir huruf kecil tanpa spasi + 8 digit tgl lahir, contoh: jakartaselatan30122015).',
            code: 'WRONG_PASSWORD',
          };
        } else if (roleType === 'wali_murid') {
          return {
            success: false,
            title: 'Kata Sandi Wali Salah',
            error: 'Kata sandi yang Anda masukkan tidak sesuai.',
            hint: 'Kata sandi awal adalah nomor WhatsApp aktif yang didaftarkan saat pendaftaran PPDB.',
            code: 'WRONG_PASSWORD',
          };
        } else {
          return {
            success: false,
            title: 'Kata Sandi Staf Salah',
            error: 'Kata sandi yang Anda masukkan tidak sesuai. Periksa kembali ejaan huruf besar, huruf kecil, dan simbol.',
            code: 'WRONG_PASSWORD',
          };
        }
      }

      return {
        success: false,
        title: 'Gagal Masuk',
        error: authError.message || 'Identitas akun atau kata sandi tidak sesuai.',
        code: 'UNAUTHORIZED',
      };
    }

    // 6. Tentukan alur redirect
    let redirectTo: string;
    if (profile.must_change_password) {
      redirectTo = '/ganti-password';
    } else {
      const userRole = profile.role as UserRole;
      redirectTo = ROLE_DASHBOARD_PATH[userRole] || '/dashboard';
    }

    console.log('[Auth Debug] Login berhasil:', {
      email: profile.email,
      role: profile.role,
      redirectTo,
    });

    revalidatePath('/', 'layout');
    return {
      success: true,
      data: { redirectTo },
      message: 'Berhasil masuk ke akun Anda.',
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat proses masuk.';
    return {
      success: false,
      title: 'Kendala Sistem',
      error: errorMessage,
      code: 'SERVER_ERROR',
    };
  }
}

/**
 * Server Action untuk kewajiban ganti password perdana (must_change_password = true)
 */
export async function changePasswordAction(
  input: ChangePasswordInput
): Promise<ActionResult<{ redirectTo: string }>> {
  const validation = changePasswordSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: 'Data kata sandi baru tidak memenuhi syarat keamanan.',
      fieldErrors: validation.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const { newPassword } = validation.data;

  try {
    const serverSupabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await serverSupabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Sesi Anda telah berakhir. Silakan login kembali.',
        code: 'UNAUTHORIZED',
      };
    }

    // 1. Update password di Supabase Auth
    const { error: updateAuthError } = await serverSupabase.auth.updateUser({
      password: newPassword,
    });

    if (updateAuthError) {
      return {
        success: false,
        error: updateAuthError.message || 'Gagal memperbarui kata sandi.',
        code: 'SERVER_ERROR',
      };
    }

    // 2. Set must_change_password = false di tabel profiles via admin client
    const adminSupabase = createAdminClient();
    const { data: updatedProfile, error: updateProfileError } = await adminSupabase
      .from('profiles')
      .update({
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('role')
      .single();

    if (updateProfileError) {
      return {
        success: false,
        error: 'Gagal memperbarui status keamanan akun.',
        code: 'SERVER_ERROR',
      };
    }

    const userRole = (updatedProfile?.role as UserRole) || 'murid';
    const redirectTo = ROLE_DASHBOARD_PATH[userRole] || '/dashboard';

    revalidatePath('/', 'layout');
    return {
      success: true,
      data: { redirectTo },
      message: 'Kata sandi berhasil diperbarui. Selamat datang di SDIT Fajar.',
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mengganti kata sandi.';
    return {
      success: false,
      error: errorMessage,
      code: 'SERVER_ERROR',
    };
  }
}

/**
 * Server Action untuk keluar akun (Logout)
 */
export async function logoutAction(): Promise<void> {
  const serverSupabase = await createClient();
  await serverSupabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
