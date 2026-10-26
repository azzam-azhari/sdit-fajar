'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/auth-helpers';
import { ActionResult } from '@/types/action.types';
import { revalidatePath } from 'next/cache';
import {
  schoolSettingsSchema,
  createStaffUserSchema,
  assignTeacherPositionSchema,
  SchoolSettingsInput,
  CreateStaffUserInput,
  AssignTeacherPositionInput,
} from '@/validations/super-admin.schema';

/**
 * 1. PENGATURAN IDENTITAS SEKOLAH (school_settings)
 */
export async function updateSchoolSettingsAction(
  input: SchoolSettingsInput
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['super_admin']);
  const parsed = schoolSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data pengaturan sekolah tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from('school_settings').select('id').limit(1).maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('school_settings')
      .update({
        school_name: parsed.data.school_name,
        address: parsed.data.address,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email,
        maps_url: parsed.data.maps_url || null,
      })
      .eq('id', existing.id);

    if (error) {
      return { success: false, error: error.message, code: 'SERVER_ERROR' };
    }
  } else {
    const { error } = await supabase.from('school_settings').insert({
      school_name: parsed.data.school_name,
      address: parsed.data.address,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      maps_url: parsed.data.maps_url || null,
    });

    if (error) {
      return { success: false, error: error.message, code: 'SERVER_ERROR' };
    }
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update_school_settings',
    entity_type: 'school_settings',
    metadata: parsed.data,
  });

  revalidatePath('/dashboard/super-admin/settings');
  revalidatePath('/kontak');
  return { success: true, data: undefined, message: 'Identitas sekolah berhasil diperbarui.' };
}

/**
 * 2. MANAJEMEN PENGGUNA (USERS)
 */
export async function toggleUserActiveStatusAction(
  targetUserId: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  const { user: currentUser } = await requireRole(['super_admin']);

  // Jangan izinkan super admin menonaktifkan akun sendiri
  if (currentUser.id === targetUserId) {
    return {
      success: false,
      error: 'Anda tidak dapat menonaktifkan akun Super Admin Anda sendiri.',
      code: 'FORBIDDEN',
    };
  }

  const adminClient = createAdminClient();

  // Cek apakah target adalah super_admin lain
  const { data: targetProfile, error: targetError } = await adminClient
    .from('profiles')
    .select('role, name, email')
    .eq('id', targetUserId)
    .single();

  if (targetError || !targetProfile) {
    return { success: false, error: 'Profil pengguna tidak ditemukan.', code: 'NOT_FOUND' };
  }

  if (targetProfile.role === 'super_admin') {
    return {
      success: false,
      error: 'Akun sesama Super Admin tidak dapat dinonaktifkan.',
      code: 'FORBIDDEN',
    };
  }

  const { error } = await adminClient
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', targetUserId);

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  // Catat audit log
  await adminClient.from('audit_logs').insert({
    actor_id: currentUser.id,
    action: isActive ? 'activate_user' : 'deactivate_user',
    entity_type: 'profiles',
    entity_id: targetUserId,
    metadata: { target_name: targetProfile.name, target_email: targetProfile.email },
  });

  revalidatePath('/dashboard/super-admin/users');
  return {
    success: true,
    data: undefined,
    message: `Akun ${targetProfile.name} berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
  };
}

export async function resetUserPasswordAction(
  targetUserId: string
): Promise<ActionResult<{ temporaryPassword: string }>> {
  const { user: currentUser } = await requireRole(['super_admin']);
  const adminClient = createAdminClient();

  const { data: targetProfile, error: targetError } = await adminClient
    .from('profiles')
    .select('id, name, email, role, login_identifier')
    .eq('id', targetUserId)
    .single();

  if (targetError || !targetProfile) {
    return { success: false, error: 'Profil pengguna tidak ditemukan.', code: 'NOT_FOUND' };
  }

  // Tentukan password reset bawaan yang aman
  const temporaryPassword = `SDITFajar${Math.floor(100000 + Math.random() * 900000)}!`;

  // Update password auth Supabase
  const { error: authError } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: temporaryPassword,
  });

  if (authError) {
    return { success: false, error: authError.message, code: 'SERVER_ERROR' };
  }

  // Wajibkan ganti password saat login
  await adminClient
    .from('profiles')
    .update({ must_change_password: true })
    .eq('id', targetUserId);

  // Catat audit log
  await adminClient.from('audit_logs').insert({
    actor_id: currentUser.id,
    action: 'reset_user_password',
    entity_type: 'profiles',
    entity_id: targetUserId,
    metadata: { target_name: targetProfile.name, role: targetProfile.role },
  });

  revalidatePath('/dashboard/super-admin/users');
  return {
    success: true,
    data: { temporaryPassword },
    message: `Password akun ${targetProfile.name} berhasil direset.`,
  };
}

export async function createStaffUserAction(
  input: CreateStaffUserInput
): Promise<ActionResult<{ userId: string; defaultPassword: string }>> {
  const { user: currentUser } = await requireRole(['super_admin']);
  const parsed = createStaffUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data staf tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const adminClient = createAdminClient();
  const defaultPassword = `FajarStaf${Math.floor(1000 + Math.random() * 9000)}!`;

  // 1. Buat akun Supabase Auth
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: defaultPassword,
    email_confirm: true,
    user_metadata: {
      name: parsed.data.name,
      role: parsed.data.role,
      login_identifier: parsed.data.email,
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || 'Gagal membuat akun autentikasi pengguna.',
      code: 'SERVER_ERROR',
    };
  }

  const newUserId = authData.user.id;

  // 2. Buat profil
  const { error: profileError } = await adminClient.from('profiles').insert({
    id: newUserId,
    name: parsed.data.name,
    email: parsed.data.email,
    login_identifier: parsed.data.email,
    role: parsed.data.role,
    phone: parsed.data.phone || null,
    is_active: true,
    must_change_password: true,
  });

  if (profileError) {
    // Rollback user auth jika profile gagal
    await adminClient.auth.admin.deleteUser(newUserId);
    return { success: false, error: profileError.message, code: 'SERVER_ERROR' };
  }

  // 3. Jika rolenya guru, buat entitas teachers
  if (parsed.data.role === 'guru') {
    const { error: teacherError } = await adminClient.from('teachers').insert({
      profile_id: newUserId,
      nip: parsed.data.nip || null,
      nuptk: parsed.data.nuptk || null,
      bio: parsed.data.bio || null,
      is_active: true,
    });

    if (teacherError) {
      await adminClient.from('profiles').delete().eq('id', newUserId);
      await adminClient.auth.admin.deleteUser(newUserId);
      return { success: false, error: teacherError.message, code: 'SERVER_ERROR' };
    }
  }

  // Catat audit log
  await adminClient.from('audit_logs').insert({
    actor_id: currentUser.id,
    action: 'create_staff_user',
    entity_type: 'profiles',
    entity_id: newUserId,
    metadata: { name: parsed.data.name, role: parsed.data.role, email: parsed.data.email },
  });

  revalidatePath('/dashboard/super-admin/users');
  revalidatePath('/dashboard/admin/guru');
  return {
    success: true,
    data: { userId: newUserId, defaultPassword },
    message: `Pengguna ${parsed.data.name} (${parsed.data.role}) berhasil ditambahkan.`,
  };
}

/**
 * 3. PENUGASAN JABATAN GURU (teacher_positions)
 */
export async function assignTeacherPositionAction(
  input: AssignTeacherPositionInput
): Promise<ActionResult<{ id: string }>> {
  const { user: currentUser } = await requireRole(['super_admin']);
  const parsed = assignTeacherPositionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data penugasan jabatan tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teacher_positions')
    .insert({
      teacher_id: parsed.data.teacher_id,
      position_id: parsed.data.position_id,
      classroom_id: parsed.data.classroom_id || null,
      academic_year_id: parsed.data.academic_year_id || null,
      is_active: true,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menetapkan jabatan guru.', code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: currentUser.id,
    action: 'assign_teacher_position',
    entity_type: 'teacher_positions',
    entity_id: data.id,
    metadata: parsed.data,
  });

  revalidatePath('/dashboard/super-admin/roles');
  return { success: true, data: { id: data.id }, message: 'Jabatan guru berhasil ditetapkan.' };
}

export async function toggleTeacherPositionAction(
  positionAssignmentId: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['super_admin']);
  const supabase = await createClient();

  const { error } = await supabase
    .from('teacher_positions')
    .update({ is_active: isActive })
    .eq('id', positionAssignmentId);

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: isActive ? 'activate_teacher_position' : 'deactivate_teacher_position',
    entity_type: 'teacher_positions',
    entity_id: positionAssignmentId,
  });

  revalidatePath('/dashboard/super-admin/roles');
  return { success: true, data: undefined, message: 'Status penugasan jabatan guru berhasil diubah.' };
}
