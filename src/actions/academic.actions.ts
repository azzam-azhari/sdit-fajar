'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/auth-helpers';
import { ActionResult } from '@/types/action.types';
import { revalidatePath } from 'next/cache';
import {
  academicYearSchema,
  semesterSchema,
  schoolPeriodSettingsSchema,
  classroomSchema,
  subjectSchema,
  teachingAssignmentSchema,
  studentBiodataSchema,
  AcademicYearInput,
  SemesterInput,
  SchoolPeriodSettingsInput,
  ClassroomInput,
  SubjectInput,
  TeachingAssignmentInput,
  StudentBiodataInput,
} from '@/validations/academic.schema';

/**
 * 1. CRUD TAHUN AJARAN & SEMESTER
 */
export async function createAcademicYearAction(
  input: AcademicYearInput
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = academicYearSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tahun ajaran tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();

  if (parsed.data.is_active) {
    // Nonaktifkan tahun ajaran lainnya
    await supabase.from('academic_years').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  }

  const { data, error } = await supabase
    .from('academic_years')
    .insert({
      name: parsed.data.name,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
      is_active: parsed.data.is_active,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menambahkan tahun ajaran.', code: 'SERVER_ERROR' };
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'create_academic_year',
    entity_type: 'academic_years',
    entity_id: data.id,
    metadata: { name: parsed.data.name },
  });

  revalidatePath('/dashboard/admin/tahun-ajaran');
  return { success: true, data: { id: data.id }, message: 'Tahun ajaran berhasil dibuat.' };
}

export async function createSemesterAction(
  input: SemesterInput
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = semesterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data semester tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();

  if (parsed.data.is_active) {
    // Nonaktifkan semester lain pada tahun ajaran yang sama
    await supabase
      .from('semesters')
      .update({ is_active: false })
      .eq('academic_year_id', parsed.data.academic_year_id);
  }

  const { data, error } = await supabase
    .from('semesters')
    .insert({
      academic_year_id: parsed.data.academic_year_id,
      name: parsed.data.name,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
      is_active: parsed.data.is_active,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menambahkan semester.', code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'create_semester',
    entity_type: 'semesters',
    entity_id: data.id,
    metadata: { name: parsed.data.name },
  });

  revalidatePath('/dashboard/admin/tahun-ajaran');
  return { success: true, data: { id: data.id }, message: 'Semester berhasil ditambahkan.' };
}

export async function updateSchoolPeriodSettingsAction(
  input: SchoolPeriodSettingsInput
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = schoolPeriodSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data periode operasional tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();

  // Ambil record setting periode tunggal yang ada
  const { data: existing } = await supabase.from('school_period_settings').select('id').limit(1).maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('school_period_settings')
      .update({
        academic_year_id: parsed.data.academic_year_id,
        semester_id: parsed.data.semester_id || null,
        active_month: parsed.data.active_month,
        active_year: parsed.data.active_year,
        teacher_weekend_attendance_enabled: parsed.data.teacher_weekend_attendance_enabled,
      })
      .eq('id', existing.id);

    if (error) {
      return { success: false, error: error.message, code: 'SERVER_ERROR' };
    }
  } else {
    const { error } = await supabase.from('school_period_settings').insert({
      academic_year_id: parsed.data.academic_year_id,
      semester_id: parsed.data.semester_id || null,
      active_month: parsed.data.active_month,
      active_year: parsed.data.active_year,
      teacher_weekend_attendance_enabled: parsed.data.teacher_weekend_attendance_enabled,
    });

    if (error) {
      return { success: false, error: error.message, code: 'SERVER_ERROR' };
    }
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update_school_period_settings',
    entity_type: 'school_period_settings',
    metadata: parsed.data,
  });

  revalidatePath('/dashboard/admin/tahun-ajaran');
  return { success: true, data: undefined, message: 'Pengaturan periode aktif operasional berhasil disimpan.' };
}

/**
 * 2. CRUD ROMBEL & TINGKAT KELAS
 */
export async function createClassroomAction(
  input: ClassroomInput
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = classroomSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data rombel tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('classrooms')
    .insert({
      class_id: parsed.data.class_id,
      academic_year_id: parsed.data.academic_year_id,
      name: parsed.data.name,
      homeroom_teacher_id: parsed.data.homeroom_teacher_id || null,
      is_active: parsed.data.is_active,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal membuat rombel.', code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'create_classroom',
    entity_type: 'classrooms',
    entity_id: data.id,
    metadata: { name: parsed.data.name },
  });

  revalidatePath('/dashboard/admin/rombel');
  return { success: true, data: { id: data.id }, message: 'Rombongan belajar berhasil dibuat.' };
}

export async function updateClassroomAction(
  id: string,
  input: Partial<ClassroomInput>
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { error } = await supabase
    .from('classrooms')
    .update({
      ...(input.name ? { name: input.name } : {}),
      ...(input.class_id ? { class_id: input.class_id } : {}),
      ...(input.academic_year_id ? { academic_year_id: input.academic_year_id } : {}),
      ...(input.homeroom_teacher_id !== undefined ? { homeroom_teacher_id: input.homeroom_teacher_id || null } : {}),
      ...(input.is_active !== undefined ? { is_active: input.is_active } : {}),
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update_classroom',
    entity_type: 'classrooms',
    entity_id: id,
    metadata: input,
  });

  revalidatePath('/dashboard/admin/rombel');
  return { success: true, data: undefined, message: 'Data rombel berhasil diperbarui.' };
}

/**
 * 3. CRUD MATA PELAJARAN
 */
export async function createSubjectAction(
  input: SubjectInput
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = subjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data mata pelajaran tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      name: parsed.data.name,
      code: parsed.data.code || null,
      grade_level: parsed.data.grade_level || null,
      is_active: parsed.data.is_active,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menambahkan mata pelajaran.', code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'create_subject',
    entity_type: 'subjects',
    entity_id: data.id,
    metadata: { name: parsed.data.name },
  });

  revalidatePath('/dashboard/admin/mapel');
  return { success: true, data: { id: data.id }, message: 'Mata pelajaran berhasil ditambahkan.' };
}

export async function toggleSubjectStatusAction(
  id: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { error } = await supabase.from('subjects').update({ is_active: isActive }).eq('id', id);
  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  revalidatePath('/dashboard/admin/mapel');
  return { success: true, data: undefined, message: `Status mapel berhasil diubah menjadi ${isActive ? 'Aktif' : 'Nonaktif'}.` };
}

/**
 * 4. PENUGASAN MENGAJAR GURU (TEACHING ASSIGNMENTS)
 */
export async function createTeachingAssignmentAction(
  input: TeachingAssignmentInput
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = teachingAssignmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data penugasan mengajar tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teaching_assignments')
    .insert({
      teacher_id: parsed.data.teacher_id,
      subject_id: parsed.data.subject_id,
      classroom_id: parsed.data.classroom_id,
      semester_id: parsed.data.semester_id,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menetapkan penugasan mengajar.', code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'create_teaching_assignment',
    entity_type: 'teaching_assignments',
    entity_id: data.id,
    metadata: parsed.data,
  });

  revalidatePath('/dashboard/admin/penugasan');
  return { success: true, data: { id: data.id }, message: 'Penugasan mengajar guru berhasil ditetapkan.' };
}

export async function deleteTeachingAssignmentAction(
  id: string
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { error } = await supabase.from('teaching_assignments').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'delete_teaching_assignment',
    entity_type: 'teaching_assignments',
    entity_id: id,
  });

  revalidatePath('/dashboard/admin/penugasan');
  return { success: true, data: undefined, message: 'Penugasan mengajar berhasil dihapus.' };
}

/**
 * 5. UPDATE DATA BIODATA SISWA
 */
export async function updateStudentBiodataAction(
  studentId: string,
  input: StudentBiodataInput
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = studentBiodataSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data biodata murid tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('students')
    .update({
      nis: parsed.data.nis,
      nisn: parsed.data.nisn || null,
      gender: parsed.data.gender,
      birth_place: parsed.data.birth_place,
      birth_date: parsed.data.birth_date,
      address: parsed.data.address || null,
      is_active: parsed.data.is_active,
    })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update_student_biodata',
    entity_type: 'students',
    entity_id: studentId,
    metadata: parsed.data,
  });

  revalidatePath('/dashboard/admin/siswa');
  return { success: true, data: undefined, message: 'Biodata murid berhasil diperbarui.' };
}
