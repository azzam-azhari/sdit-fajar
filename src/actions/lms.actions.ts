'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadStorageFile } from '@/lib/supabase/storage';
import type { ActionResult } from '@/types/action.types';
import {
  assignmentSchema, finalGradeSchema, gradeSubmissionSchema, materialSchema,
  scheduleSchema, studentAttendanceSchema, submissionSchema,
  type AssignmentInput, type FinalGradeInput, type GradeSubmissionInput,
  type MaterialInput, type ScheduleInput, type StudentAttendanceInput, type SubmissionInput,
} from '@/validations/lms.schema';

type IdResult = ActionResult<{ id: string }>;

function validationError<T>(fieldErrors: Record<string, string[] | undefined>): ActionResult<T> {
  const normalized = Object.fromEntries(Object.entries(fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1])));
  return { success: false, error: 'Data yang dimasukkan tidak valid.', fieldErrors: normalized, code: 'VALIDATION_ERROR' };
}

async function currentTeacherId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('teachers').select('id').eq('profile_id', (await requireRole(['guru'])).user.id).maybeSingle();
  return data?.id ?? null;
}

async function writeAudit(action: string, entityType: string, entityId: string, metadata: Record<string, string | number | boolean | null>): Promise<void> {
  const { user } = await requireRole(['guru', 'admin', 'super_admin']);
  const supabase = await createClient();
  await supabase.from('audit_logs').insert({ actor_id: user.id, action, entity_type: entityType, entity_id: entityId, metadata });
}

async function uploadOptionalLmsFile(file: File | null, folder: string): Promise<{ file_path: string | null; file_url: string | null }> {
  if (!file || file.size === 0) return { file_path: null, file_url: null };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${randomUUID()}-${safeName}`;
  const uploaded = await uploadStorageFile('lms-files', path, await file.arrayBuffer(), file.name, file.type, file.size);
  return { file_path: uploaded.path, file_url: null };
}

export async function createMaterialAction(input: MaterialInput, file: File | null): Promise<IdResult> {
  await requireRole(['guru']);
  const parsed = materialSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
  const teacherId = await currentTeacherId();
  if (!teacherId) return { success: false, error: 'Profil guru tidak ditemukan.', code: 'FORBIDDEN' };
  const uploaded = await uploadOptionalLmsFile(file, `materials/${parsed.data.classroom_id}`);
  if (!parsed.data.content && !parsed.data.external_url && !uploaded.file_path) return { success: false, error: 'Isi, tautan, atau berkas materi wajib tersedia.', code: 'VALIDATION_ERROR' };
  const supabase = await createClient();
  const { data, error } = await supabase.from('materials').insert({ ...parsed.data, teacher_id: teacherId, ...uploaded, published_at: parsed.data.status === 'published' ? new Date().toISOString() : null }).select('id').single();
  if (error || !data) return { success: false, error: error?.message ?? 'Gagal menyimpan materi.', code: 'SERVER_ERROR' };
  await writeAudit('create_material', 'materials', data.id, { status: parsed.data.status });
  revalidatePath('/dashboard/guru'); revalidatePath('/dashboard/guru/materi'); revalidatePath('/dashboard/murid');
  return { success: true, data: { id: data.id }, message: 'Materi berhasil disimpan.' };
}

export async function createAssignmentAction(input: AssignmentInput, file: File | null): Promise<IdResult> {
  await requireRole(['guru']);
  const parsed = assignmentSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
  const teacherId = await currentTeacherId();
  if (!teacherId) return { success: false, error: 'Profil guru tidak ditemukan.', code: 'FORBIDDEN' };
  const uploaded = await uploadOptionalLmsFile(file, 'assignments');
  const supabase = await createClient();
  const { data, error } = await supabase.from('assignments').insert({ ...parsed.data, teacher_id: teacherId, ...uploaded }).select('id').single();
  if (error || !data) return { success: false, error: error?.message ?? 'Gagal membuat tugas.', code: 'SERVER_ERROR' };
  await writeAudit('create_assignment', 'assignments', data.id, { status: parsed.data.status, max_score: parsed.data.max_score });
  revalidatePath('/dashboard/guru'); revalidatePath('/dashboard/guru/tugas'); revalidatePath('/dashboard/murid');
  return { success: true, data: { id: data.id }, message: 'Tugas berhasil disimpan.' };
}

export async function submitAssignmentAction(input: SubmissionInput, file: File | null): Promise<IdResult> {
  const { user } = await requireRole(['murid']);
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success && !file) return validationError(parsed.error.flatten().fieldErrors);
  const assignmentId = input.assignment_id;
  const supabase = await createClient();
  const { data: student } = await supabase.from('students').select('id').eq('profile_id', user.id).single();
  if (!student) return { success: false, error: 'Profil murid tidak ditemukan.', code: 'FORBIDDEN' };
  const uploaded = await uploadOptionalLmsFile(file, `submissions/${assignmentId}/${student.id}`);
  const { data, error } = await supabase.from('assignment_submissions').upsert({ assignment_id: assignmentId, student_id: student.id, answer_text: input.answer_text?.trim() || null, ...uploaded }, { onConflict: 'assignment_id,student_id' }).select('id').single();
  if (error || !data) return { success: false, error: error?.message ?? 'Gagal mengumpulkan tugas.', code: 'SERVER_ERROR' };
  revalidatePath('/dashboard/murid'); revalidatePath(`/dashboard/murid/tugas/${assignmentId}`);
  return { success: true, data: { id: data.id }, message: 'Tugas berhasil dikumpulkan.' };
}

export async function gradeSubmissionAction(input: GradeSubmissionInput): Promise<ActionResult<void>> {
  await requireRole(['guru']);
  const parsed = gradeSubmissionSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
  const teacherId = await currentTeacherId();
  if (!teacherId) return { success: false, error: 'Profil guru tidak ditemukan.', code: 'FORBIDDEN' };
  const supabase = await createClient();
  const { error } = await supabase.from('assignment_submissions').update({ score: parsed.data.score, feedback: parsed.data.feedback ?? null, graded_by: teacherId, graded_at: new Date().toISOString() }).eq('id', parsed.data.submission_id);
  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' };
  await writeAudit('grade_submission', 'assignment_submissions', parsed.data.submission_id, { score: parsed.data.score });
  revalidatePath('/dashboard/guru/tugas'); revalidatePath('/dashboard/murid/nilai');
  return { success: true, data: undefined, message: 'Nilai dan umpan balik berhasil disimpan.' };
}

export async function saveFinalGradeAction(input: FinalGradeInput): Promise<IdResult> {
  await requireRole(['guru']);
  const parsed = finalGradeSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
  const teacherId = await currentTeacherId();
  if (!teacherId) return { success: false, error: 'Profil guru tidak ditemukan.', code: 'FORBIDDEN' };
  const supabase = await createClient();
  const { data, error } = await supabase.from('grades').insert({ ...parsed.data, teacher_id: teacherId, grade_type: 'final' }).select('id').single();
  if (error || !data) return { success: false, error: error?.message ?? 'Gagal menyimpan nilai akhir.', code: 'SERVER_ERROR' };
  await writeAudit('save_final_grade', 'grades', data.id, { score: parsed.data.score });
  revalidatePath('/dashboard/guru/nilai'); revalidatePath('/dashboard/murid/nilai');
  return { success: true, data: { id: data.id }, message: 'Nilai akhir semester berhasil disimpan.' };
}

export async function createScheduleAction(input: ScheduleInput): Promise<IdResult> {
  await requireRole(['admin', 'super_admin']);
  const parsed = scheduleSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
  const supabase = await createClient();
  const { data: assignment } = await supabase.from('teaching_assignments').select('id').match({ teacher_id: parsed.data.teacher_id, subject_id: parsed.data.subject_id, classroom_id: parsed.data.classroom_id, semester_id: parsed.data.semester_id }).maybeSingle();
  if (!assignment) return { success: false, error: 'Guru belum ditugaskan pada rombel, mapel, dan semester tersebut.', code: 'FORBIDDEN' };
  const { data, error } = await supabase.from('schedules').insert({ classroom_id: parsed.data.classroom_id, subject_id: parsed.data.subject_id, teacher_id: parsed.data.teacher_id, day_of_week: parsed.data.day_of_week, start_time: parsed.data.start_time, end_time: parsed.data.end_time, room: parsed.data.room ?? null }).select('id').single();
  if (error || !data) return { success: false, error: error?.message ?? 'Gagal menyimpan jadwal.', code: 'SERVER_ERROR' };
  revalidatePath('/dashboard/jadwal'); return { success: true, data: { id: data.id }, message: 'Jadwal berhasil disimpan.' };
}

export async function recordTeacherAttendanceAction(session: 'check_in' | 'check_out'): Promise<IdResult> {
  const { user } = await requireRole(['guru']); const teacherId = await currentTeacherId();
  if (!teacherId) return { success: false, error: 'Profil guru tidak ditemukan.', code: 'FORBIDDEN' };
  const supabase = await createClient();
  const { data, error } = await supabase.from('teacher_attendances').insert({ teacher_id: teacherId, attendance_date: '2000-01-01', session, recorded_by: user.id }).select('id').single();
  if (error || !data) return { success: false, error: error?.message ?? 'Presensi tidak dapat dicatat.', code: 'SERVER_ERROR' };
  await writeAudit(`teacher_${session}`, 'teacher_attendances', data.id, { session });
  revalidatePath('/dashboard/guru/presensi'); return { success: true, data: { id: data.id }, message: 'Presensi berhasil dicatat.' };
}

export async function recordStudentAttendanceAction(input: StudentAttendanceInput): Promise<ActionResult<void>> {
  const { user } = await requireRole(['guru']); const parsed = studentAttendanceSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
  const supabase = await createClient();
  const rows = parsed.data.records.map((record) => ({ ...record, schedule_id: parsed.data.schedule_id, classroom_id: parsed.data.classroom_id, attendance_date: '2000-01-01', recorded_by: user.id }));
  const { error } = await supabase.from('student_attendances').insert(rows);
  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' };
  await writeAudit('record_student_attendance', 'student_attendances', parsed.data.schedule_id, { count: rows.length });
  revalidatePath('/dashboard/guru/presensi-siswa'); return { success: true, data: undefined, message: 'Presensi murid berhasil dicatat.' };
}

export async function updateWeekendAttendanceAction(enabled: boolean): Promise<ActionResult<void>> {
  const { user } = await requireRole(['guru']); const supabase = await createClient();
  const { data: teacher } = await supabase.from('teachers').select('id').eq('profile_id', user.id).single();
  if (!teacher) return { success: false, error: 'Profil guru tidak ditemukan.', code: 'FORBIDDEN' };
  const { data: position } = await supabase.from('teacher_positions').select('id, positions!inner(code)').eq('teacher_id', teacher.id).eq('is_active', true).eq('positions.code', 'kepala_sekolah').maybeSingle();
  if (!position) return { success: false, error: 'Hanya kepala sekolah yang dapat mengubah presensi akhir pekan.', code: 'FORBIDDEN' };
  const admin = createAdminClient();
  const { error } = await admin.from('school_period_settings').update({ teacher_weekend_attendance_enabled: enabled }).eq('academic_year_id', (await admin.from('academic_years').select('id').eq('is_active', true).single()).data?.id ?? '');
  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' };
  await writeAudit('update_weekend_attendance', 'school_period_settings', teacher.id, { enabled });
  revalidatePath('/dashboard/guru/pengaturan-absensi'); return { success: true, data: undefined, message: 'Pengaturan presensi akhir pekan diperbarui.' };
}
