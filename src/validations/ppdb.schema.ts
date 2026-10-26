import { z } from 'zod';

export const publicRegistrationSchema = z.object({
  admission_wave_id: z.string().uuid().optional().nullable().or(z.literal('')),
  student_name: z.string().min(3, 'Nama calon murid minimal 3 karakter'),
  nik: z.string().optional().nullable().or(z.literal('')),
  nisn: z.string().optional().nullable().or(z.literal('')),
  gender: z.enum(['L', 'P', 'male', 'female'], { message: 'Jenis kelamin wajib dipilih' }),
  birth_place: z.string().min(2, 'Tempat lahir wajib diisi'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir YYYY-MM-DD'),
  address: z.string().min(5, 'Alamat lengkap wajib diisi'),
  parent_name: z.string().min(3, 'Nama orang tua / wali wajib diisi'),
  parent_phone: z.string().min(9, 'Nomor WhatsApp / HP wajib diisi (minimal 9 digit)'),
  parent_email: z.string().email('Format email tidak valid').optional().nullable().or(z.literal('')),
  father_name: z.string().optional().nullable(),
  father_occupation: z.string().optional().nullable(),
  mother_name: z.string().optional().nullable(),
  mother_occupation: z.string().optional().nullable(),
});

export const updateRegistrationStatusSchema = z.object({
  application_id: z.string().uuid('ID Pendaftaran tidak valid'),
  status: z.enum(['submitted', 'under_review', 'approved', 'rejected'], { message: 'Status tidak valid' }),
  admin_notes: z.string().optional().nullable(),
  observation_score: z.number().optional().nullable(),
});

export const promoteRegistrationSchema = z.object({
  application_id: z.string().uuid('ID Pendaftaran tidak valid'),
  classroom_id: z.string().uuid('Rombel kelas wajib dipilih').optional().nullable(),
  nis: z.string().optional().nullable(),
});

export type PublicRegistrationInput = z.infer<typeof publicRegistrationSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type PromoteRegistrationInput = z.infer<typeof promoteRegistrationSchema>;
