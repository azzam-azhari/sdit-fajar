import { z } from 'zod';

export const newsPostSchema = z.object({
  title: z.string().min(5, 'Judul berita minimal 5 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)'),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, 'Konten berita minimal 10 karakter'),
  cover_url: z.string().optional().nullable(),
  cover_path: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type NewsPostInput = z.infer<typeof newsPostSchema>;
