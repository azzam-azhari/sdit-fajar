---
trigger: always_on
description: Pola struktur folder, alur data (data-flow), dan batasan arsitektur Server vs Client Component — SDIT Fajar
---

# Architecture & Boundary Guidelines — SDIT Fajar

Dokumen ini mengatur letak penempatan file, batasan logika Server vs Client, pola data-fetching, serta aturan struktur modular pada repositori SDIT Fajar.

---

## 1. Peta Struktur Folder Proyek (`src/`)

**Catatan Instalasi**: Instalasi Next.js (file `package.json`, `next.config.ts`, dll) wajib diletakkan **langsung di root folder** proyek ini (`c:\Users\muhaz\OneDrive\Desktop\sdit-fajar`), dengan pengaturan *source directory* yang mengarah ke `src/`.

Seluruh kode sumber wajib berada di dalam direktori `src/` dengan pengelompokan yang jelas:

```text
src/
├── actions/              # Next.js Server Actions (mutasi database aman & terverifikasi)
├── app/                  # Next.js App Router
│   ├── (admin)/          # Area terproteksi: Dashboard Super Admin, Admin, Guru
│   ├── (auth)/           # Halaman login staf, wali murid, & login murid (NIS)
│   ├── (public)/         # Halaman publik (Landing, Profil, PPDB, Berita, Kontak)
│   ├── _components/      # Komponen privat yang HANYA dipakai di route tertentu
│   ├── api/              # Route Handlers (Webhook Midtrans, cron, export)
│   ├── layout.tsx        # Root layout aplikasi
│   └── globals.css       # Tailwind CSS 4 core tokens & styles
├── components/
│   ├── common/           # Komponen reusable lintas modul (ZebraDataTable, PageHeader, StatCard)
│   └── ui/               # Komponen primitif Shadcn UI (button, dialog, input, dropdown, dll.)
├── configs/              # Konfigurasi statis aplikasi, query keys, dan payment keys
├── constants/            # Enum resmi, role definitions, opsi navigasi
├── hooks/                # Custom React hooks reusable (`useCamelCase.ts`)
├── lib/
│   ├── supabase/         # Client & Server Supabase SSR helper
│   └── utils.ts          # Utility functions (cn, currency format, date format)
├── providers/            # Client providers (React Query, ThemeProvider, Sonner Toaster)
├── stores/               # Zustand stores (UI state ringan)
├── types/                # Definisi TypeScript interface & domain types (zero `any`)
└── validations/          # Zod validation schemas (`*.schema.ts`)
```

---

## 2. Server vs Client Component Boundaries

Next.js 16 App Router membagi eksekusi menjadi dua dunia: Server dan Client. Patuhi batas ini dengan ketat:

### A. Server Components (RSC) — Default Pilihan
- **Gunakan RSC secara default** untuk seluruh halaman (`page.tsx`), layout (`layout.tsx`), dan wrapper kontainer.
- **Tanggung Jawab RSC**:
  1. Melakukan fetch data awal langsung ke Supabase Server Client (`createClient()` dari `@/lib/supabase/server`).
  2. Melakukan verifikasi sesi auth & role guard di tingkat server sebelum me-render halaman.
  3. Mengirimkan data yang sudah terfilter sebagai props ke Client Component daun (*leaf components*).
  4. Merender markup statis tanpa membebani bundle JavaScript browser.

### B. Client Components (`'use client'`)
- Tambahkan direktif `'use client'` **hanya pada komponen daun (*leaf components*)**.
- **Kapan Wajib Menggunakan `'use client'`**:
  1. Komponen yang menggunakan state lokal (`useState`, `useReducer`).
  2. Komponen yang menggunakan lifecycle/side-effects (`useEffect`).
  3. Komponen yang menangani interaksi pengguna langsung (`onClick`, `onChange`, `onSubmit`).
  4. Komponen yang menggunakan custom hooks atau library client (`useQuery`, `useForm`, `useTheme`, `nuqs`).
  5. Komponen UI interaktif dari Shadcn yang memerlukan event handler (seperti `Dialog`, `DropdownMenu`, `Sheet`, `Tabs`).

---

## 3. Aturan Struktur Modular Komponen (`@/components/`)

Pemisahan komponen dilakukan secara bertingkat untuk memaksimalkan *reusability* dan menghindari duplikasi:

1. **`src/components/ui/` (Primitif Shadcn)**:
   - Berisi komponen murni Shadcn UI.
   - Jangan menambahkan logika bisnis atau query database di folder ini.
2. **`src/components/common/` (Shared Reusable Domain Components)**:
   - Berisi komponen umum yang dipakai di banyak halaman/modul (misal: `zebra-data-table.tsx`, `page-header.tsx`, `stat-card.tsx`, `status-badge.tsx`, `empty-state.tsx`, `date-picker.tsx`).
   - Wajib dirancang fleksibel dengan props yang diketik ketat (*strictly typed*).
   - **Aturan**: Selalu kembangkan komponen di sini sebelum memutuskan membuat file baru.
3. **`src/app/**/_components/` (Route-Private Components)**:
   - Komponen privat yang spesifik hanya digunakan untuk satu halaman atau rute tertentu (misal form input mutabaah harian yang hanya ada di dashboard guru).

---

## 4. Alur Data (Data-Flow Architecture)

### A. Pengambilan Data (Data Fetching):
- **Initial Page Load**: Server Component mengambil data langsung via Supabase Server Client -> diteruskan ke Client Component.
- **Client-Side Filtering & Interactive Cache**: TanStack React Query (`useQuery`) digunakan untuk tabel interaktif, paginasi cepat, dan polling ringan.
- **URL Parameter Sync**: Gunakan `nuqs` untuk menyinkronkan parameter tabel (halaman, filter, pencarian) dengan URL browser.

### B. Mutasi Data (Data Mutations):
- **Wajib menggunakan Next.js Server Actions** di `src/actions/`.
- Dilarang membuat REST API internal di `src/app/api/` hanya untuk form submit internal.
- Setiap Server Action wajib:
  1. Memverifikasi sesi dan hak akses role (`auth.getUser()`).
  2. Memvalidasi payload input menggunakan skema Zod (`safeParse`).
  3. Mengeksekusi query database ke Supabase.
  4. Memanggil `revalidatePath` atau `revalidateTag` untuk memperbarui cache halaman.
  5. Mengembalikan tipe data baku `ActionResult<T>`.
