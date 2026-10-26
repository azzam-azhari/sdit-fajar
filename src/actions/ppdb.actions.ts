'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/auth-helpers';
import { ActionResult } from '@/types/action.types';
import { revalidatePath } from 'next/cache';
import { createSignedUrl } from '@/lib/supabase/storage';
import {
  publicRegistrationSchema,
  updateRegistrationStatusSchema,
  promoteRegistrationSchema,
  PublicRegistrationInput,
  UpdateRegistrationStatusInput,
  PromoteRegistrationInput,
} from '@/validations/ppdb.schema';

/**
 * 1. SUBMIT FORMULIR PENDAFTARAN OLEH TAMU (GUEST)
 */
export async function submitPublicRegistrationAction(
  input: PublicRegistrationInput
): Promise<ActionResult<{ registrationNumber: string }>> {
  const parsed = publicRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data formulir tidak lengkap atau format tidak sesuai.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  // Gunakan adminClient untuk insert ke student_registration_applications secara aman dari form tamu
  const adminClient = createAdminClient();

  // Cari gelombang aktif jika tidak dispesifikasikan
  let waveId = parsed.data.admission_wave_id;
  if (!waveId) {
    const { data: activeWave } = await adminClient
      .from('admission_waves')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (activeWave) {
      waveId = activeWave.id;
    } else {
      // Ambil gelombang apapun yang ada
      const { data: anyWave } = await adminClient
        .from('admission_waves')
        .select('id')
        .limit(1)
        .maybeSingle();
      waveId = anyWave?.id;
    }
  }

  if (!waveId) {
    return {
      success: false,
      error: 'Gelombang pendaftaran belum dibuka oleh sekolah.',
      code: 'NOT_FOUND',
    };
  }

  // Generate nomor registrasi berurutan
  const yearStr = new Date().getFullYear().toString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const registrationNumber = `PPDB-${yearStr}-${randomSuffix}`;

  const { data, error } = await adminClient
    .from('student_registration_applications')
    .insert({
      admission_wave_id: waveId,
      registration_number: registrationNumber,
      student_name: parsed.data.student_name,
      nik: parsed.data.nik || null,
      nisn: parsed.data.nisn || null,
      gender: parsed.data.gender,
      birth_place: parsed.data.birth_place,
      birth_date: parsed.data.birth_date,
      address: parsed.data.address,
      parent_name: parsed.data.parent_name,
      parent_phone: parsed.data.parent_phone,
      parent_email: parsed.data.parent_email || null,
      father_name: parsed.data.father_name || null,
      father_occupation: parsed.data.father_occupation || null,
      mother_name: parsed.data.mother_name || null,
      mother_occupation: parsed.data.mother_occupation || null,
      status: 'submitted',
    })
    .select('id')
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message || 'Gagal mengirimkan formulir pendaftaran.',
      code: 'SERVER_ERROR',
    };
  }

  revalidatePath('/dashboard/admin/pendaftaran');
  return {
    success: true,
    data: { registrationNumber },
    message: 'Formulir pendaftaran berhasil dikirim.',
  };
}

/**
 * 2. CEK STATUS PENDAFTARAN OLEH TAMU (GUEST - ISOLASI KETAT ANTI LEAKAGE)
 */
export async function checkRegistrationStatusAction(
  registrationNumber: string,
  parentPhone: string
): Promise<ActionResult<{
  studentName: string;
  registrationNumber: string;
  status: string;
  waveTitle: string;
  submittedAt: string;
  adminNotes: string | null;
}>> {
  const adminClient = createAdminClient();

  const cleanReg = registrationNumber.trim();
  const cleanPhone = parentPhone.trim();

  const { data, error } = await adminClient
    .from('student_registration_applications')
    .select(`
      registration_number,
      student_name,
      status,
      admin_notes,
      created_at,
      admission_waves (
        title
      )
    `)
    .eq('registration_number', cleanReg)
    .eq('parent_phone', cleanPhone)
    .maybeSingle();

  if (error || !data) {
    return {
      success: false,
      error: 'Data pendaftaran tidak ditemukan. Mohon pastikan Nomor Registrasi dan Nomor WhatsApp sesuai.',
      code: 'NOT_FOUND',
    };
  }

  const waveData = data.admission_waves as unknown;
  const waveTitle = Array.isArray(waveData)
    ? (waveData[0] as { title?: string })?.title
    : (waveData as { title?: string })?.title;
  const wave = waveTitle || 'Gelombang PPDB 2026/2027';

  return {
    success: true,
    data: {
      studentName: data.student_name,
      registrationNumber: data.registration_number,
      status: data.status,
      waveTitle: wave,
      submittedAt: data.created_at,
      adminNotes: data.admin_notes,
    },
  };
}

/**
 * 3. UPDATE STATUS PENDAFTARAN OLEH ADMIN
 */
export async function updateRegistrationStatusAction(
  input: UpdateRegistrationStatusInput
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = updateRegistrationStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data verifikasi tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('student_registration_applications')
    .update({
      status: parsed.data.status,
      admin_notes: parsed.data.admin_notes || null,
      observation_score: parsed.data.observation_score || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.application_id);

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update_ppdb_status',
    entity_type: 'student_registration_applications',
    entity_id: parsed.data.application_id,
    metadata: { status: parsed.data.status, notes: parsed.data.admin_notes },
  });

  revalidatePath('/dashboard/admin/pendaftaran');
  return { success: true, data: undefined, message: 'Status verifikasi pendaftaran berhasil diperbarui.' };
}

/**
 * 4. AMBIL SIGNED URL BERKAS PENDAFTARAN (5 MENIT)
 */
export async function getRegistrationDocumentSignedUrlAction(
  filePath: string
): Promise<ActionResult<{ signedUrl: string }>> {
  await requireRole(['admin', 'super_admin']);

  try {
    const signedUrl = await createSignedUrl('registration-files', filePath, 300);
    return { success: true, data: { signedUrl } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Gagal memuat dokumen pendaftaran.';
    return { success: false, error: errorMsg, code: 'SERVER_ERROR' };
  }
}

/**
 * 5. PROMOSI CALON MURID MENJADI SISWA AKTIF & GENERATE AKUN AUTH
 */
export async function promoteRegistrationToStudentAction(
  input: PromoteRegistrationInput
): Promise<ActionResult<{ studentId: string; nis: string }>> {
  const { user: currentUser } = await requireRole(['admin', 'super_admin']);
  const parsed = promoteRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data promosi tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const adminClient = createAdminClient();

  // 1. Ambil data aplikasi pendaftaran
  const { data: application, error: appError } = await adminClient
    .from('student_registration_applications')
    .select('*')
    .eq('id', parsed.data.application_id)
    .single();

  if (appError || !application) {
    return { success: false, error: 'Data pendaftaran tidak ditemukan.', code: 'NOT_FOUND' };
  }

  if (application.status === 'approved') {
    return { success: false, error: 'Pendaftar ini sudah pernah disetujui dan dipromosikan.', code: 'VALIDATION_ERROR' };
  }

  // Tentukan NIS
  let finalNis = parsed.data.nis?.trim();
  if (!finalNis) {
    const currentYear = new Date().getFullYear();
    const randomNis = Math.floor(1000 + Math.random() * 9000);
    finalNis = `${currentYear}${randomNis}`;
  }

  // Tentukan password awal murid: tempatlahir + ddmmyyyy
  const cleanPlace = (application.birth_place || 'fajar').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanDate = (application.birth_date || '2019-01-01').replace(/-/g, '');
  const initialStudentPassword = `${cleanPlace}${cleanDate}`;
  const syntheticEmail = `${finalNis}@siswa.sdit-fajar.sch.id`;

  let studentAuthId: string | null = null;
  let parentProfileId: string | null = null;

  try {
    // 2. Buat akun Auth Murid
    const { data: studentAuth, error: studentAuthErr } = await adminClient.auth.admin.createUser({
      email: syntheticEmail,
      password: initialStudentPassword,
      email_confirm: true,
      user_metadata: {
        name: application.student_name,
        role: 'murid',
        login_identifier: finalNis,
      },
    });

    if (studentAuthErr || !studentAuth.user) {
      throw new Error(`Gagal membuat akun murid: ${studentAuthErr?.message}`);
    }
    studentAuthId = studentAuth.user.id;

    // 3. Buat Profile Murid
    await adminClient.from('profiles').insert({
      id: studentAuthId,
      name: application.student_name,
      email: syntheticEmail,
      login_identifier: finalNis,
      role: 'murid',
      is_active: true,
      must_change_password: true,
    });

    // 4. Buat Record Students
    const { data: studentRecord, error: studentErr } = await adminClient
      .from('students')
      .insert({
        profile_id: studentAuthId,
        nis: finalNis,
        nisn: application.nisn || null,
        gender: application.gender,
        birth_place: application.birth_place,
        birth_date: application.birth_date,
        address: application.address,
        is_active: true,
      })
      .select('id')
      .single();

    if (studentErr || !studentRecord) {
      throw new Error(`Gagal menyimpan data pokok murid: ${studentErr?.message}`);
    }

    // 5. Cek / Buat Akun Wali Murid
    const parentPhone = application.parent_phone;
    const { data: existingParentProfile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('login_identifier', parentPhone)
      .eq('role', 'wali_murid')
      .maybeSingle();

    if (existingParentProfile) {
      parentProfileId = existingParentProfile.id;
    } else {
      const parentDefaultPassword = `WaliFajar${Math.floor(1000 + Math.random() * 9000)}!`;
      const parentEmail = application.parent_email || `${parentPhone}@wali.sdit-fajar.sch.id`;

      const { data: parentAuth, error: parentAuthErr } = await adminClient.auth.admin.createUser({
        email: parentEmail,
        password: parentDefaultPassword,
        email_confirm: true,
        user_metadata: {
          name: application.parent_name,
          role: 'wali_murid',
          login_identifier: parentPhone,
        },
      });

      if (parentAuthErr || !parentAuth.user) {
        throw new Error(`Gagal membuat akun wali murid: ${parentAuthErr?.message}`);
      }

      parentProfileId = parentAuth.user.id;

      await adminClient.from('profiles').insert({
        id: parentProfileId,
        name: application.parent_name,
        email: parentEmail,
        login_identifier: parentPhone,
        role: 'wali_murid',
        phone: parentPhone,
        is_active: true,
        must_change_password: true,
      });

      await adminClient.from('parents').insert({
        profile_id: parentProfileId,
        occupation: application.father_occupation || application.mother_occupation || null,
        address: application.address,
      });
    }

    // Ambil ID dari tabel parents
    const { data: parentRecord } = await adminClient
      .from('parents')
      .select('id')
      .eq('profile_id', parentProfileId)
      .single();

    if (parentRecord) {
      await adminClient.from('parent_students').insert({
        parent_id: parentRecord.id,
        student_id: studentRecord.id,
        relationship: 'Orang Tua',
        is_primary: true,
      });
    }

    // 6. Jika classroom_id dipilih, daftarkan siswa ke rombel
    if (parsed.data.classroom_id) {
      await adminClient.from('class_students').insert({
        classroom_id: parsed.data.classroom_id,
        student_id: studentRecord.id,
        status: 'active',
      });
    }

    // 7. Update status pendaftaran menjadi approved
    await adminClient
      .from('student_registration_applications')
      .update({
        status: 'approved',
        reviewed_by: currentUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', application.id);

    // 8. Catat audit log
    await adminClient.from('audit_logs').insert({
      actor_id: currentUser.id,
      action: 'promote_ppdb_to_student',
      entity_type: 'students',
      entity_id: studentRecord.id,
      metadata: {
        application_id: application.id,
        student_name: application.student_name,
        nis: finalNis,
      },
    });

    revalidatePath('/dashboard/admin/pendaftaran');
    revalidatePath('/dashboard/admin/siswa');

    return {
      success: true,
      data: { studentId: studentRecord.id, nis: finalNis },
      message: `Ananda ${application.student_name} berhasil dipromosikan menjadi murid aktif dengan NIS ${finalNis}.`,
    };
  } catch (err: unknown) {
    if (studentAuthId) {
      await adminClient.auth.admin.deleteUser(studentAuthId).catch(() => {});
    }
    const errText = err instanceof Error ? err.message : 'Kesalahan sistem';
    return {
      success: false,
      error: `Promosi murid digagalkan: ${errText}`,
      code: 'SERVER_ERROR',
    };
  }
}
