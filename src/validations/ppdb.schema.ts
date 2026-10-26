import { z } from 'zod';

export const publicRegistrationSchema = z.object({
  admission_wave_id: z.string().uuid('Pilih gelombang pendaftaran yang valid'),
  student_name: z.string().min(3, 'Nama calon murid minimal 3 karakter'),
  nik: z.string().regex(/^\d{16}$/, 'NIK wajib 16 digit angka'),
  gender: z.enum(['L', 'P'], { message: 'Jenis kelamin wajib dipilih' }),
  birth_place: z.string().min(2, 'Tempat lahir wajib diisi'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir YYYY-MM-DD'),
  address: z.string().min(5, 'Alamat lengkap tempat tinggal wajib diisi minimal 5 karakter'),

  father_name: z.string().min(3, 'Nama ayah kandung wajib diisi'),
  father_phone: z.string().min(9, 'Nomor WhatsApp ayah minimal 9 digit'),
  father_occupation: z.string().optional().nullable().or(z.literal('')),

  mother_name: z.string().min(3, 'Nama ibu kandung wajib diisi'),
  mother_phone: z.string().optional().nullable().or(z.literal('')),

  // Anti-Spam: Honeypot field (wajib kosong di sisi client & server)
  hp_tambahan: z.string().max(0, 'Spam terdeteksi').optional().or(z.literal('')),
  // Anti-Spam: Timestamp saat form dimuat
  form_started_at: z.number().optional(),
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
