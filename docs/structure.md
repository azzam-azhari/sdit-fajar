# Application Directory & File Structure — SDIT Fajar

Dokumen ini memetakan tata letak folder dan berkas proyek Next.js 16 App Router agar asisten AI dan developer selalu meletakkan kode baru di lokasi yang tepat.

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
│   ├── roadmap.md                     # Pelacak progres & checklist 7 fase pengerjaan
│   ├── README.md                      # Index dokumentasi & ringkasan arsitektur
│   ├── FILE-LIST.md                   # Sitemap seluruh file dokumentasi
│   ├── note.md                        # Catatan ringkas scope produk
│   ├── PRD/                           # 26 file arsip spesifikasi teknis granular
│   │   ├── 00-ringkasan-produk.md
│   │   ├── 01-role-permission.md
│   │   ├── 02-daftar-fitur-scope.md
│   │   ├── ...
│   │   └── 99-agent-instructions.md
│   └── luar-scope-projek/             # Infrastruktur hosting, domain, & deployment
├── public/                            # Asset statis publik
│   ├── icons/
│   ├── images/
│   └── logo/                          # Logo resmi SDIT Fajar
├── src/
│   ├── actions/                       # Next.js Server Actions (Mutasi database aman)
│   │   ├── auth.actions.ts
│   │   ├── student.actions.ts
│   │   ├── attendance.actions.ts
│   │   ├── tahfidz.actions.ts
│   │   └── payment.actions.ts
│   ├── app/                           # Next.js App Router
│   │   ├── (public)/                  # Route Group Publik (Tanpa Login)
│   │   │   ├── page.tsx               # Landing Page Profil Sekolah
│   │   │   ├── tentang/page.tsx       # Profil & Visi Misi
│   │   │   ├── berita/                # Daftar & Detail Berita/Artikel
│   │   │   ├── ppdb/page.tsx          # Pendaftaran Siswa Baru
│   │   │   └── kontak/page.tsx        # Kontak & Peta Lokasi
│   │   ├── (auth)/                    # Route Group Autentikasi
│   │   │   ├── login/page.tsx         # Login Staf & Wali Murid
│   │   │   ├── login-murid/page.tsx   # Login Murid via NIS
│   │   │   └── ganti-password/        # Halaman ganti password wajib (login perdana)
│   │   ├── (admin)/dashboard/         # Route Group Dashboard Terproteksi
│   │   │   ├── layout.tsx             # Shell Dashboard (Sidebar + Header + Breadcrumb)
│   │   │   ├── super-admin/           # Dashboard Super Admin (Settings, Audit, Payment Key)
│   │   │   ├── admin/                 # Dashboard Admin (Master Data, Invoice, Publikasi)
│   │   │   ├── guru/                  # Dashboard Guru (LMS, Absensi, Nilai, Tahfidz)
│   │   │   ├── murid/                 # Dashboard Murid (Jadwal, Materi, Raport)
│   │   │   └── wali/                  # Dashboard Wali Murid (Info Anak & Bayar SPP)
│   │   ├── api/                       # Route Handlers
│   │   │   └── webhooks/
│   │   │       └── midtrans/route.ts  # Webhook verifikasi transaksi Midtrans
│   │   ├── layout.tsx                 # Root Layout (Fonts, ThemeProvider, Sonner)
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
│   ├── providers/                     # QueryClientProvider, ThemeProvider
│   ├── stores/                        # Zustand stores (UI state)
│   ├── types/                         # TypeScript interfaces & types
│   │   ├── action.types.ts
│   │   ├── database.types.ts          # Supabase generated types
│   │   └── domain.types.ts
│   └── validations/                   # Zod schemas (student.schema.ts, invoice.schema.ts)
├── middleware.ts                      # Proteksi rute & pengecekan sesi cookie
├── package.json
└── tsconfig.json
```

---

## 2. Aturan Penamaan File & Berkas (Strict)
1. **Komponen React (`.tsx`)**: Menggunakan format `kebab-case.tsx` (contoh: `zebra-data-table.tsx`, `student-modal.tsx`).
2. **Server Actions (`.ts`)**: Berakhiran `.actions.ts` atau berada di dalam folder `src/actions/` (contoh: `student.actions.ts`).
3. **Zod Validation (`.ts`)**: Berakhiran `.schema.ts` (contoh: `student.schema.ts`).
4. **Custom Hooks (`.ts`)**: Dimulai dengan prefiks `use` dan format `camelCase.ts` (contoh: `useZebraTable.ts`).
5. **Types / Interfaces (`.ts`)**: Berakhiran `.types.ts` (contoh: `academic.types.ts`).
