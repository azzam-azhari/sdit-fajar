import { z } from 'zod';

export const academicYearSchema = z.object({
  name: z.string().min(4, 'Nama tahun ajaran minimal 4 karakter (misal: 2026/2027)'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal awal YYYY-MM-DD'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal akhir YYYY-MM-DD'),
  is_active: z.boolean().default(false),
});

export const semesterSchema = z.object({
  academic_year_id: z.string().uuid('ID Tahun Ajaran tidak valid'),
  name: z.string().min(3, 'Nama semester minimal 3 karakter (misal: Ganjil / Genap)'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal awal YYYY-MM-DD'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal akhir YYYY-MM-DD'),
  is_active: z.boolean().default(false),
});

export const schoolPeriodSettingsSchema = z.object({
  academic_year_id: z.string().uuid('ID Tahun Ajaran tidak valid'),
  semester_id: z.string().uuid('ID Semester tidak valid').nullable().optional(),
  active_month: z.number().int().min(1).max(12, 'Bulan aktif harus antara 1 sampai 12'),
  active_year: z.number().int().min(2020).max(2050, 'Tahun aktif tidak valid'),
  teacher_weekend_attendance_enabled: z.boolean().default(false),
});

export const classLevelSchema = z.object({
  name: z.string().min(1, 'Nama tingkat kelas wajib diisi (misal: Kelas 1)'),
  grade_level: z.number().int().min(1).max(12, 'Tingkat kelas 1 - 12'),
  description: z.string().optional().nullable(),
});

export const classroomSchema = z.object({
  class_id: z.string().uuid('Tingkat kelas wajib dipilih'),
  academic_year_id: z.string().uuid('Tahun ajaran wajib dipilih'),
  name: z.string().min(2, 'Nama rombel minimal 2 karakter (misal: 1-A Abu Bakar)'),
  homeroom_teacher_id: z.string().uuid('ID Wali Kelas tidak valid').optional().nullable(),
  is_active: z.boolean().default(true),
});

export const subjectSchema = z.object({
  name: z.string().min(2, 'Nama mata pelajaran minimal 2 karakter'),
  code: z.string().min(2, 'Kode mapel minimal 2 karakter').optional().nullable(),
  grade_level: z.number().int().min(1).max(12).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const teachingAssignmentSchema = z.object({
  teacher_id: z.string().uuid('Guru pengampu wajib dipilih'),
  subject_id: z.string().uuid('Mata pelajaran wajib dipilih'),
  classroom_id: z.string().uuid('Rombel wajib dipilih'),
  semester_id: z.string().uuid('Semester wajib dipilih'),
});

export const studentBiodataSchema = z.object({
  nis: z.string().min(4, 'NIS minimal 4 karakter'),
  nisn: z.string().optional().nullable(),
  gender: z.enum(['L', 'P', 'male', 'female'], { message: 'Jenis kelamin wajib dipilih' }),
  birth_place: z.string().min(2, 'Tempat lahir wajib diisi'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir YYYY-MM-DD'),
  address: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type AcademicYearInput = z.infer<typeof academicYearSchema>;
export type SemesterInput = z.infer<typeof semesterSchema>;
export type SchoolPeriodSettingsInput = z.infer<typeof schoolPeriodSettingsSchema>;
export type ClassLevelInput = z.infer<typeof classLevelSchema>;
export type ClassroomInput = z.infer<typeof classroomSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type TeachingAssignmentInput = z.infer<typeof teachingAssignmentSchema>;
export type StudentBiodataInput = z.infer<typeof studentBiodataSchema>;
