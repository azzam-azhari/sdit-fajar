# Application Directory & File Structure — SDIT Fajar

Dokumen ini memetakan tata letak folder dan berkas proyek Next.js 16 App Router agar asisten AI dan developer selalu meletakkan kode baru di lokasi yang tepat sesuai arsitektur resmi.

---

## 1. Peta Direktori Utama

```text
sdit-fajar/
├── .cursorrules                       # Aturan mutlak AI saat prompting
├── docs/                              # Sumber kebenaran dokumentasi & konteks proyek (Single Source of Truth)
│   ├── AGENTS.md                      # Aturan universal agen & batasan operasional
│   ├── ai-rules.md                    # Aturan teknis AI coding assistant
│   ├── prd.md                         # Product Requirements Document (Visi, Scope, & 5 Role Resmi)
│   ├── techstack.md                   # Spesifikasi teknologi, versi dependensi, & arsitektur
│   ├── design.md                      # Design System (Minimalist Craft, Palet, & Zebra Cross Table)
│   ├── database.md                    # Skema Supabase PostgreSQL, Relasi, & RLS Policies
│   ├── api.md                         # Kontrak Server Actions, Webhook Midtrans, & Kuitansi
│   ├── state.md                       # Manajemen State (React Query, Zustand, & URL State)
│   ├── structure.md                   # Peta folder ini & konvensi penamaan berkas
│   ├── roadmap.md                     # Pelacak progres & checklist pengerjaan
│   ├── README.md                      # Index dokumentasi & ringkasan arsitektur
│   ├── FILE-LIST.md                   # Sitemap seluruh file dokumentasi
│   ├── note.md                        # Catatan ringkas scope produk
│   ├── PRD/                           # Arsip spesifikasi teknis granular (00 s.d. 22, eksekusi, periode)
│   │   ├── 00-ringkasan-produk.md
│   │   ├── 01-role-permission.md
│   │   ├── 03-daftar-halaman.md
│   │   ├── 08-skema-database-supabase.md
│   │   ├── ...
│   │   └── eksekusi.md
│   └── luar-scope-projek/             # Catatan hosting, domain, & keputusan teknis
├── public/                            # Asset statis publik
│   ├── icons/
│   ├── images/
│   └── logo/                          # Logo resmi SDIT Fajar
├── src/
│   ├── actions/                       # Next.js Server Actions (Mutasi database aman & terverifikasi)
│   │   ├── auth.actions.ts            # Login, logout, ganti password
│   │   ├── student.actions.ts         # Mutasi siswa & rombel
│   │   ├── attendance.actions.ts      # Presensi guru & presensi siswa
│   │   ├── tahfidz.actions.ts         # Mutabaah setoran ayat tahfidz
│   │   ├── registration.actions.ts    # Form PPDB online & verifikasi admin
│   │   ├── marketplace.actions.ts     # Order produk marketplace
│   │   └── payment.actions.ts         # Inisiasi Snap token Midtrans & receipt
│   ├── app/                           # Next.js App Router
│   │   ├── (public)/                  # Route Group Publik (Tanpa Login)
│   │   │   ├── page.tsx               # Landing Page Beranda Sekolah
│   │   │   ├── profil/                # Profil, Sejarah, & Manajemen Sekolah
│   │   │   │   ├── page.tsx
│   │   │   │   ├── sejarah/page.tsx
│   │   │   │   └── manajemen/page.tsx
│   │   │   ├── kurikulum/page.tsx     # Kurikulum & Program Unggulan
│   │   │   ├── ekstrakurikuler/page.tsx # Kegiatan Ekstrakurikuler
│   │   │   ├── berita/                # Daftar & Detail Berita/Artikel
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── pendaftaran/page.tsx   # Pendaftaran Murid Baru (PPDB Online)
│   │   │   ├── marketplace/page.tsx   # Katalog Buku & Konten Sekolah
│   │   │   └── kontak/page.tsx        # Kontak & Peta Lokasi MapLibre
│   │   ├── (auth)/                    # Route Group Autentikasi
│   │   │   ├── login/page.tsx         # Login Tunggal (NIS / No HP / Email)
│   │   │   ├── ganti-password/page.tsx # Ganti Password Wajib (Login Perdana)
│   │   │   ├── forgot-password/page.tsx # Lupa Password (Opsional)
│   │   │   └── reset-password/page.tsx  # Reset Password (Opsional)
│   │   ├── (admin)/dashboard/         # Route Group Dashboard Terproteksi
│   │   │   ├── layout.tsx             # Shell Dashboard (Sidebar + Header + Breadcrumb)
│   │   │   ├── super-admin/           # Dashboard Super Admin (Settings, Audit, Payment Key)
│   │   │   ├── admin/                 # Dashboard Admin (Master Data, PPDB, Invoices)
│   │   │   ├── guru/                  # Dashboard Guru (LMS, Absensi, Nilai, Tahfidz)
│   │   │   ├── murid/                 # Dashboard Murid (Jadwal, Materi, Nilai, Tahfidz)
│   │   │   └── wali-murid/            # Dashboard Wali Murid (Anak, Bayar SPP, Receipt)
│   │   ├── api/                       # Route Handlers
│   │   │   └── webhooks/
│   │   │       └── midtrans/route.ts  # Webhook verifikasi transaksi Midtrans (SHA512)
│   │   ├── layout.tsx                 # Root Layout (Fonts, ThemeProvider, Sonner Toaster)
│   │   └── globals.css                # Tailwind CSS 4 Core Styles
│   ├── components/
│   │   ├── common/                    # Komponen Reusable SDIT Fajar
│   │   │   ├── zebra-data-table.tsx   # Komponen Tabel Wajib Zebra Cross
│   │   │   ├── page-header.tsx        # Header Halaman Presisi
│   │   │   ├── status-badge.tsx       # Badge Status Minimalis
│   │   │   ├── empty-state.tsx        # Placeholder Data Kosong
│   │   │   └── date-picker.tsx        # Pemilih Tanggal
│   │   └── ui/                        # Primitif Shadcn UI (button, dialog, input, dropdown)
│   ├── configs/                       # Konfigurasi aplikasi & query keys
│   ├── constants/                     # Daftar peran, enum, dan menu navigasi
│   ├── hooks/                         # Custom React Hooks
│   ├── lib/
│   │   ├── supabase/                  # Helper client & server Supabase SSR
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server component / action client
│   │   │   └── middleware.ts          # Auth session updater middleware
│   │   └── utils.ts                   # Helper `cn()` & format mata uang / tanggal
│   ├── providers/                     # QueryClientProvider, ThemeProvider, Sonner
│   ├── stores/                        # Zustand stores (UI state ringan)
│   ├── types/                         # TypeScript interfaces & domain types (zero any)
│   │   ├── action.types.ts            # ActionResult<T>
│   │   ├── database.types.ts          # Supabase generated types
│   │   └── domain.types.ts            # Domain entity types
│   └── validations/                   # Zod schemas (student.schema.ts, invoice.schema.ts, dll.)
├── middleware.ts                      # Proteksi rute & verifikasi sesi cookie Supabase
├── package.json
└── tsconfig.json
```

---

## 2. Aturan Penamaan File & Berkas (Strict)
1. **Komponen React (`.tsx`)**: Menggunakan format `kebab-case.tsx` (contoh: `zebra-data-table.tsx`, `student-modal.tsx`).
2. **Server Actions (`.ts`)**: Berakhiran `.actions.ts` dan berada di dalam `src/actions/` (contoh: `student.actions.ts`).
3. **Zod Validation (`.ts`)**: Berakhiran `.schema.ts` di folder `src/validations/` (contoh: `student.schema.ts`).
4. **Custom Hooks (`.ts`)**: Dimulai dengan prefiks `use` dan format `camelCase.ts` di `src/hooks/` (contoh: `useZebraTable.ts`).
5. **Types / Interfaces (`.ts`)**: Berakhiran `.types.ts` di `src/types/` (contoh: `academic.types.ts`).
