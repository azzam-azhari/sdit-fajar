# AI Coding Rules & System Instructions — SDIT Fajar

Dokumen ini adalah pedoman mutlak untuk asisten AI (Cursor, Windsurf, Antigravity, Claude Code) saat memproses instruksi atau menulis kode di repositori SDIT Fajar.

---

## 1. Aturan TypeScript & Kode
- **Zero `any`**: Jangan pernah menggunakan tipe data `any`. Buat type atau interface eksplisit di folder `@/types/`.
- **Strict Typing**: Gunakan generic types yang tepat pada React Query hooks, Server Actions, dan Supabase queries.
- **Naming Conventions**:
  - File komponen React: `kebab-case.tsx` (misal `zebra-data-table.tsx`, `student-card.tsx`).
  - File fungsi/utilitas/hooks: `camelCase.ts` (misal `useStudentQuery.ts`, `formatCurrency.ts`).
  - Server Actions: `kebab-case.action.ts` atau diletakkan di `src/actions/`.
  - Type definitions: `kebab-case.types.ts` atau di `src/types/`.
- **Bahasa**:
  - Nama variabel, fungsi, types, dan komentar kode: **Bahasa Inggris**.
  - Teks antarmuka UI, label, pesan error form, dan toast notification: **Bahasa Indonesia**.

---

## 2. Aturan Next.js 16 & React 19
- **Prioritaskan Server Components (RSC)**: Jadikan komponen sebagai Server Component secara default untuk performa maksimal.
- **Batasi `'use client'`**: Berikan direktif `'use client'` hanya pada daun terluar (*leaf components*) yang membutuhkan event listeners, hooks (`useState`, `useEffect`), atau browser APIs.
- **Data Fetching**:
  - Di Server Component: Fetch data langsung via Supabase Server Client (`createClient` dari `@/lib/supabase/server`).
  - Di Client Component: Gunakan TanStack React Query (`useQuery`, `useMutation`) dengan query keys yang terstruktur rapi.
- **Mutasi Data**: Selalu gunakan Next.js Server Actions di `src/actions/` dengan validasi Zod sebelum mengeksekusi query database.

---

## 3. Aturan Desain & Styling UI
- **Gaya Desain**: Minimalist Craft & Design Engineering (terinspirasi dari **[jakub.kr](https://jakub.kr/)**).
  - Garis batas tipis presisi (`border border-border/80`).
  - Whitespace yang bersih dan proporsional.
  - Micro-interactions halus (transisi 200ms).
- **LARANGAN KERAS**:
  - ❌ **Dilarang menggunakan tema Claymorphism** (elemen 3D menggelembung, warna pastel kartun tebal).
  - ❌ **Dilarang menggunakan Bento Grid berat** yang membuang ruang untuk visual tanpa fungsi.
- **Library Resmi**:
  - Tailwind CSS 4.
  - Shadcn UI & Radix UI primitives.
  - Icons: `lucide-react` & `@hugeicons/react`.
- **Standar Tabel Data**: **Wajib menggunakan format Zebra Cross** (baris selang-seling `even:bg-muted/25 dark:even:bg-muted/15`) dengan hover highlight halus.

---

## 4. Aturan Peran (Role) & Hak Akses
- **5 Role Database Resmi (DILARANG MENAMBAH/MENGUBAH ROLE)**:
  1. `super_admin`
  2. `admin`
  3. `guru`
  4. `murid`
  5. `wali_murid`
- **Jabatan (`positions`)**:
  - Jabatan (`kepala_sekolah`, `wali_kelas`, `bendahara`, `koordinator_tahfidz`, dll.) **BUKAN role database baru**, melainkan atribusi di bawah role `guru`.
  - Semua guru menggunakan route utama `/dashboard/guru`; fitur khusus jabatan dimunculkan secara dinamis (*Position-based feature toggles*).

---

## 5. Batasan Ruang Lingkup (Scope Boundaries)
- ❌ **FITUR CHAT INTERNAL DITIADAKAN**: Jangan pernah membuat tabel `chat_messages`, `chat_rooms`, atau komponen chat real-time. Komunikasi dilakukan melalui pengumuman terstruktur (*Announcements*).
- ❌ **Murid Tidak Boleh Melakukan Transaksi Pembayaran**: Pembayaran invoice SPP hanya dapat diakses dan diinisiasi oleh akun `wali_murid` yang terverifikasi terhubung dengan murid tersebut.

---

## 6. Aturan Keamanan & Database Supabase
- **RLS (Row Level Security)**: Wajib aktif pada semua tabel. Jangan berasumsi validasi frontend sudah cukup.
- **Rahasia Kunci**: `SUPABASE_SERVICE_ROLE_KEY` **dilarang keras** bocor ke client-side bundle atau public environment.
- **Validasi Ganda**: Seluruh input dari client wajib divalidasi dengan Zod di server sebelum dieksekusi ke Supabase.
- **Payment Midtrans**:
  - Konfigurasi server key & aktivasi global hanya boleh diatur oleh `super_admin`.
  - Webhook handler Midtrans wajib memvalidasi `signature_key` (SHA512 dari `order_id + status_code + gross_amount + ServerKey`) sebelum memperbarui status invoice menjadi `paid`.
