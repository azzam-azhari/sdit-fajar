import { z } from 'zod';

export const studentCsvRowSchema = z.object({
  nis: z.string().min(4, 'NIS minimal 4 digit angka').regex(/^\d+$/, 'NIS harus berupa angka'),
  name: z.string().min(3, 'Nama siswa minimal 3 karakter'),
  gender: z.enum(['L', 'P'], { message: 'Jenis kelamin harus L atau P' }),
  birth_place: z.string().min(2, 'Tempat lahir wajib diisi'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir YYYY-MM-DD'),
  address: z.string().optional().nullable().default(''),
  classroom_name: z.string().optional().nullable().default(''),
});

export const teacherCsvRowSchema = z.object({
  nip: z.string().min(5, 'NIP minimal 5 karakter'),
  name: z.string().min(3, 'Nama lengkap guru minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(9, 'Nomor WhatsApp/HP minimal 9 karakter'),
  nuptk: z.string().optional().nullable().default(''),
});

export const parentCsvRowSchema = z.object({
  parent_name: z.string().min(3, 'Nama orang tua minimal 3 karakter'),
  phone: z.string().min(9, 'Nomor WhatsApp minimal 9 karakter'),
  email: z.string().email('Format email tidak valid').optional().nullable().or(z.literal('')),
  relationship: z.enum(['Ayah', 'Ibu', 'Wali'], { message: 'Hubungan harus Ayah, Ibu, atau Wali' }),
  student_nis: z.string().min(4, 'NIS siswa terkait wajib diisi'),
});

export type StudentCsvRow = z.infer<typeof studentCsvRowSchema>;
export type TeacherCsvRow = z.infer<typeof teacherCsvRowSchema>;
export type ParentCsvRow = z.infer<typeof parentCsvRowSchema>;
