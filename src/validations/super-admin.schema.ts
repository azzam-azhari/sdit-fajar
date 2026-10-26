import { z } from 'zod';

export const schoolSettingsSchema = z.object({
  school_name: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  address: z.string().min(5, 'Alamat sekolah wajib diisi'),
  phone: z.string().min(6, 'Nomor telepon resmi minimal 6 karakter'),
  whatsapp: z.string().min(9, 'Nomor WhatsApp resmi minimal 9 karakter'),
  email: z.string().email('Format email tidak valid'),
  maps_url: z.string().url('Format URL maps tidak valid').optional().nullable().or(z.literal('')),
});

export const createStaffUserSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(9, 'Nomor WhatsApp/HP minimal 9 karakter').optional().nullable(),
  role: z.enum(['admin', 'guru'], { message: 'Role staf hanya boleh Admin atau Guru' }),
  nip: z.string().optional().nullable(),
  nuptk: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const assignTeacherPositionSchema = z.object({
  teacher_id: z.string().uuid('ID Guru tidak valid'),
  position_id: z.string().uuid('ID Jabatan tidak valid'),
  classroom_id: z.string().uuid('ID Rombel tidak valid').optional().nullable(),
  academic_year_id: z.string().uuid('ID Tahun Ajaran tidak valid').optional().nullable(),
});

export type SchoolSettingsInput = z.infer<typeof schoolSettingsSchema>;
export type CreateStaffUserInput = z.infer<typeof createStaffUserSchema>;
export type AssignTeacherPositionInput = z.infer<typeof assignTeacherPositionSchema>;
