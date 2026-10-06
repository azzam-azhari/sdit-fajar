---
description: SOP bertahap pembuatan fitur baru dari validasi, UI modular, hingga integrasi data
---

# Workflow: Pembuatan Fitur Baru (`/new-feature`)

Gunakan panduan standar operasional (SOP) ini saat menambahkan halaman, modul, atau fitur baru di aplikasi SDIT Fajar.

---

## Langkah 1: Verifikasi Scope & Hak Akses
1. Buka `docs/PRD/02-daftar-fitur-scope.md` dan pastikan fitur berada di dalam scope resmi (bukan fitur dilarang seperti chat internal).
2. Periksa role mana saja yang diizinkan mengakses fitur tersebut di `docs/PRD/01-role-permission.md`.
3. Tentukan letak route halaman di `src/app/` (apakah publik, auth, atau di dalam grup dashboard role terkait).

---

## Langkah 2: Buat Skema Validasi Zod
1. Buat berkas baru di `src/validations/[nama-fitur].schema.ts`.
2. Tulis validasi dengan pesan error berbahasa Indonesia yang ramah pengguna.
3. Ekspor tipe input menggunakan `z.infer`.

```typescript
// src/validations/tahfidz.schema.ts
import { z } from 'zod';

export const tahfidzMutabaahSchema = z.object({
  studentId: z.string().uuid('Siswa wajib dipilih'),
  surahNumber: z.number().int().min(1).max(114, 'Nomor surah tidak valid'),
  ayatStart: z.number().int().min(1, 'Ayat awal minimal 1'),
  ayatEnd: z.number().int().min(1, 'Ayat akhir minimal 1'),
  predicate: z.enum(['mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul'], {
    errorMap: () => ({ message: 'Predikat kelancaran wajib dipilih' }),
  }),
  notes: z.string().optional(),
});

export type TahfidzMutabaahInput = z.infer<typeof tahfidzMutabaahSchema>;
```

---

## Langkah 3: Buat TypeScript Types
1. Jika memerlukan representasi data query database yang belum ada, definisikan di `src/types/[nama-fitur].types.ts`.
2. Pastikan bebas dari tipe `any`.

---

## Langkah 4: Rancang Komponen UI Modular
1. Gunakan komponen basis dari **Shadcn UI** (`src/components/ui/`).
2. Gunakan komponen reusable dari `src/components/common/` (`PageHeader`, `StatCard`, `StatusBadge`, `EmptyState`, dll).
3. Jika menampilkan data tabular, **WAJIB menggunakan Zebra Cross Table** (`ZebraDataTable`).
4. Pastikan form menggunakan `react-hook-form` + `@hookform/resolvers/zod`.
5. Terapkan prinsip visual **Minimalist Craft** (batas tipis `border border-border/80`, tanpa efek claymorphism/3D gelembung).

---

## Langkah 5: Hubungkan Data Layer & Server Action
1. Buat Server Action di `src/actions/[nama-fitur].actions.ts`.
2. Selalu cek sesi auth dan role di server:
   ```typescript
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return { success: false, error: 'Silakan login terlebih dahulu.', code: 'UNAUTHORIZED' };
   ```
3. Validasi payload dengan skema Zod `safeParse`.
4. Eksekusi query database ke Supabase.
5. Revalidasi cache rute dengan `revalidatePath(...)`.
6. Kembalikan respons terstandar `ActionResult<T>`.

---

## Langkah 6: Sediakan Feedback & Tampilan Status Lengkap
Pastikan antarmuka memiliki 4 state visual:
1. **Loading State**: Tampilkan `<Skeleton />` atau loading spinner.
2. **Empty State**: Tampilkan `<EmptyState message="..." />` saat data kosong.
3. **Error State**: Tampilkan pesan error informatif jika fetch/mutasi gagal.
4. **Toast Feedback**: Tampilkan notifikasi `toast.success` atau `toast.error` dari Sonner.

---

## Langkah 7: Verifikasi Linter & Typecheck
Sebelum menyelesaikan task:
1. Pastikan tidak ada tipe `any` atau warning TypeScript yang tertinggal.
2. Periksa konsistensi teks bahasa Indonesia pada antarmuka pengguna.
