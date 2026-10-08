---
trigger: always_on
description: Standar gaya kode, konvensi penamaan, TypeScript strictness, dan sintaksis ekspor — SDIT Fajar
---

# Code Style & Naming Conventions — SDIT Fajar

Dokumen ini memuat standar penulisan kode, konvensi penamaan file dan simbol, derajat ketat TypeScript (*strictness*), serta sintaksis ekspor di proyek SDIT Fajar.

---

## 1. Konvensi Penamaan (Naming Conventions)

Patuhi konvensi penamaan berikut tanpa deviasi:

| Entitas | Konvensi Nama File | Konvensi Nama Simbol | Contoh |
|---|---|---|---|
| **Komponen React** | `kebab-case.tsx` | `PascalCase` | `student-card.tsx` -> `export function StudentCard()` |
| **Halaman & Layout** | `page.tsx`, `layout.tsx` | `PascalCase` (Default Export) | `export default function StudentsPage()` |
| **Server Actions** | `[domain].actions.ts` | `camelCaseAction` | `student.actions.ts` -> `createStudentAction()` |
| **Zod Schema** | `[domain].schema.ts` | `camelCaseSchema` | `student.schema.ts` -> `studentSchema` |
| **TypeScript Types** | `[domain].types.ts` | `PascalCase` | `student.types.ts` -> `type StudentItem` |
| **Custom Hooks** | `use[Nama].ts` | `use[Nama]` | `useZebraTable.ts` -> `export function useZebraTable()` |
| **Utility Functions** | `camelCase.ts` | `camelCase` | `formatCurrency.ts` -> `export function formatCurrency()` |
| **Zustand Store** | `use[Nama]Store.ts` | `use[Nama]Store` | `useSidebarStore.ts` -> `export const useSidebarStore` |
| **Database Tables** | `plural_snake_case` | - | `students`, `student_attendances`, `payment_invoices` |
| **Database Columns** | `snake_case` | - | `login_identifier`, `created_at`, `birth_date` |

---

## 2. Derajat Ketat TypeScript (Strict Mode)

- ❌ **Dilarang Keras Tipe `any`**: Jangan pernah menggunakan tipe data `any`.
- Gunakan `unknown` jika tipe data benar-benar belum dapat ditentukan, lalu persempit (*narrowing*) menggunakan type guards atau skema Zod.
- **Lokasi Type Definitions**: Seluruh tipe global, model database, dan domain diletakkan di `src/types/`.
- **Derived Types**: Turunkan tipe input dari Zod schema menggunakan `z.infer<typeof mySchema>` untuk menjamin konsistensi antara validasi runtime dan tipe compile-time.

```typescript
// Contoh di src/validations/student.schema.ts
export const studentSchema = z.object({
  nis: z.string().min(5, 'NIS minimal 5 karakter'),
  name: z.string().min(3, 'Nama lengkap wajib diisi'),
  classId: z.string().uuid('ID Kelas tidak valid'),
});

export type StudentInput = z.infer<typeof studentSchema>;
```

---

## 3. Preferensi Sintaksis & Ekspor

### A. Named Exports vs Default Exports
- **Komponen Umum, Utilitas, Hooks, & Actions**: Selalu gunakan **Named Exports** (`export function MyComponent()`). Ini mempermudah pencarian simbol dan refactoring otomatis.
- **Next.js Route Files**: Gunakan **Default Export** HANYA untuk file khusus Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).

### B. Path Alias Import
- Selalu gunakan path alias `@/*` yang merujuk ke folder `src/`.
- ❌ **Dilarang keras import relatif panjang**, seperti `../../../../components/ui/button`.

```typescript
// BENAR
import { Button } from '@/components/ui/button';
import { ZebraDataTable } from '@/components/common/zebra-data-table';
import { createStudentAction } from '@/actions/student.actions';

// SALAH
import { Button } from '../../../components/ui/button';
```

---

## 4. Standar Bahasa (Language Policy)

Pemisahan bahasa diterapkan secara tegas:
- **Teks Antarmuka (UI)**: **Bahasa Indonesia** baku, sopan, dan bernuansa sekolah Islam terpadu (contoh label form, placeholder, dialog, toast, teks tombol, dan pesan error validasi).
- **Kode Program**: **Bahasa Inggris** bersih untuk nama variabel, fungsi, types, interface, parameter, nama file, dan komentar kode.
