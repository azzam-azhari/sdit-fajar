import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Identitas akun minimal 3 karakter')
    .max(100, 'Identitas akun maksimal 100 karakter'),
  password: z
    .string()
    .min(6, 'Kata sandi minimal 6 karakter')
    .max(128, 'Kata sandi maksimal 128 karakter'),
  roleType: z.enum(['murid', 'wali_murid', 'staf']).default('murid'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Kata sandi baru minimal 8 karakter')
      .regex(/[A-Za-z]/, 'Kata sandi harus mengandung minimal 1 huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka'),
    confirmPassword: z.string().min(8, 'Konfirmasi kata sandi minimal 8 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
