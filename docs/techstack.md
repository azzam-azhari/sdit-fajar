# Tech Stack & System Architecture — SDIT Fajar

## 1. Core Framework & Runtime
- **Framework:** Next.js 16.2.7 (App Router dengan struktur folder `src/`)
- **UI Library:** React 19.2.4 & React DOM 19.2.4
- **Language:** TypeScript 5.x (Strict Mode aktif, zero `any`)
- **Node Runtime:** Node.js 20+ LTS

---

## 2. Styling & Design System
- **CSS Engine:** Tailwind CSS 4
- **Design Philosophy:** Minimalist Craft & Design Engineering (terinspirasi dari https://jakub.kr/)
  - Menekankan presisi batas (*crisp micro-borders*), hierarki tipografi bersih, kontras netral slate/zinc yang elegan.
  - Bebas dari elemen claymorphism atau bento 3D tebal yang berat.
- **Component Primitives:** Shadcn UI (terbangun di atas Radix UI primitives)
- **Icons:** 
  - Lucide React (`lucide-react`) untuk ikon sistem standar.
  - Hugeicons React (`@hugeicons/react`) untuk ikon fungsional dan aksen editorial.
- **Data Table:** TanStack React Table (`@tanstack/react-table`) dengan desain **Zebra Cross** (belang-selang sel baris tabel untuk kenyamanan membaca data siswa/keuangan).
- **Themes & Mode:** `next-themes` (Light mode bersih berlatar netral, Dark mode berlatar charcoal gelap presisi).

---

## 3. Backend, Database & Storage
- **Platform:** Supabase BaaS (Managed PostgreSQL 15+)
- **Supabase Client:** `@supabase/ssr` dan `@supabase/supabase-js`
- **Security:**
  - PostgreSQL Row Level Security (RLS) pada 100% tabel domain.
  - Validasi hak akses ganda: Middleware sesi + RLS DB + Server Action Guard.
  - Akses `SUPABASE_SERVICE_ROLE_KEY` hanya diperbolehkan pada server-side Route Handlers/Actions terisolasi.
- **File Storage:** Supabase Storage (Buckets: `avatars`, `documents`, `school-media`, `submissions`).

---

## 4. State Management & Data Fetching
- **Client Cache & Async Fetching:** TanStack React Query v5 (`@tanstack/react-query`) untuk query caching, invalidation, dan optimistic update di client-side.
- **Global UI State:** Zustand (state ringan untuk status sidebar, filter aktif, modal state).
- **URL Query State:** `nuqs` / `useSearchParams` untuk pagination dan filter tabel agar URL sinkron dan dapat dibagikan.

---

## 5. Form Handling & Validasi
- **Form Management:** React Hook Form (`react-hook-form`)
- **Schema Validation:** Zod (`zod` + `@hookform/resolvers/zod`)
- **Prinsip Validasi:** Shared schema Zod antara client-side (UX instant error) dan server-side Server Action (jaminan integritas data).

---

## 6. Layanan Pihak Ketiga (Integrations)
- **Payment Gateway:** Midtrans (Snap API via Popup Modal & Core API) untuk pembayaran SPP/iuran wali murid dengan verifikasi signature key pada Webhook Handler.
- **Peta Interaktif:** MapLibre GL (`maplibre-gl`) untuk visualisasi lokasi sekolah dan radius zonasi.
- **Visualisasi Data & Grafik:** Recharts (grafik statistik absensi, penerimaan SPP, dan perkembangan nilai).
- **Notifikasi Toast:** Sonner (toast notification minimalis dan elegan).

---

## 7. Arsitektur Struktur Folder
```text
.
├── .cursorrules              # Konfigurasi mutlak AI untuk editor (Cursor/Windsurf)
├── docs/                     # Seluruh berkas dokumentasi & konteks proyek
│   ├── AGENTS.md             # Universal Agent rules & safety boundaries
│   ├── ai-rules.md           # Aturan teknis AI coding assistant
│   ├── api.md                # Kontrak Server Actions, Webhook Midtrans, & Kuitansi
│   ├── database.md           # Skema database PostgreSQL Supabase & RLS
│   ├── design.md             # Design system (jakub.kr) & standar Zebra Cross table
│   ├── prd.md                # Visi produk, scope, 5 role resmi, & PPDB staging
│   ├── roadmap.md            # Tracker 7 fase pengerjaan proyek
│   ├── state.md              # Manajemen state (React Query, Zustand, URL)
│   ├── structure.md          # Peta folder & konvensi penamaan
│   ├── techstack.md          # Spesifikasi teknis & dependensi
│   ├── README.md             # Index dokumentasi proyek
│   ├── FILE-LIST.md          # Daftar sitemap file dokumentasi
│   ├── note.md               # Catatan fitur
│   ├── PRD/                  # 26 arsip spesifikasi teknis granular
│   └── luar-scope-projek/    # Hosting, domain, dan infrastruktur
├── public/                   # Asset statis publik (logo, favicon, banner)
├── src/
│   ├── actions/              # Next.js Server Actions (mutasi data terverifikasi)
│   ├── app/                  # Next.js App Router
│   │   ├── (admin)/          # Area terproteksi: Dashboard Super Admin, Admin, Guru
│   │   ├── (auth)/           # Halaman login staf, wali, & murid (NIS)
│   │   ├── (public)/         # Halaman publik (Landing, Profil, PPDB, Berita)
│   │   ├── _components/      # Komponen privat per route
│   │   └── api/              # Route Handlers (Webhook Midtrans, export PDF, cron)
│   ├── components/
│   │   ├── common/           # Komponen kustom aplikasi (PageHeader, ZebraTable, dll.)
│   │   └── ui/               # Komponen primitif Shadcn UI
│   ├── configs/              # Konfigurasi aplikasi (site, navigation, payment)
│   ├── constants/            # Enum, role list, konstanta hak akses
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   ├── supabase/         # Client & Server helper Supabase
│   │   └── utils.ts          # Utility functions (cn, formatters, currency)
│   ├── providers/            # React Query Provider, Theme Provider, Sonner
│   ├── stores/               # Zustand stores
│   ├── types/                # TypeScript interface & type definitions
│   └── validations/          # Zod validation schemas
├── package.json
└── tsconfig.json
```