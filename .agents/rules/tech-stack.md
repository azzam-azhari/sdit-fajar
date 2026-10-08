---
trigger: always_on
description: Definisi Tech Stack resmi, package manager, dependensi, dan batasan instalasi library — SDIT Fajar
---

# Tech Stack & Library Constraints — SDIT Fajar

Dokumen ini adalah aturan konstitusi teknis mengenai platform, framework, runtime, package manager, serta batasan dependensi di repositori SDIT Fajar.

---

## 1. Core Runtime & Package Manager

- **Framework**: Next.js 16.2.7 (App Router dengan struktur folder `src/`)
- **UI Library**: React 19.2.4 & React DOM 19.2.4
- **Language**: TypeScript 5.x (Strict mode aktif, larangan keras menggunakan `any`)
- **Runtime**: Node.js 20+ LTS
- **Package Manager**: **`npm`** (Wajib digunakan, jangan gunakan pnpm atau bun).

> [!CAUTION]
> **ATURAN MUTLAK INSTALASI PACKAGE**:
> **DILARANG KERAS menginstal package baru (`npm install`) tanpa konfirmasi dan izin manual eksplisit dari pengguna.**
> Gunakan hanya library yang sudah terdaftar di `package.json` dan dokumentasi resmi.

---

## 2. Dependensi Frontend & UI Resmi

Hanya library berikut yang diizinkan untuk digunakan pada frontend SDIT Fajar:

| Kategori | Library Resmi | Catatan Penggunaan |
|---|---|---|
| **CSS Engine** | `tailwindcss` (Tailwind CSS 4) | Utamakan token CSS Shadcn dan utility classes |
| **Component Primitives** | **Shadcn UI** (Radix UI primitives) | Wajib sebagai basis komponen UI |
| **Icons** | `lucide-react` | Ikon fungsionalitas tabel, tombol aksi, dan status |
| **Icons (Editorial/Menu)** | `@hugeicons/react` | Navigasi menu utama, dashboard, dan kartu fitur |
| **Data Table** | `@tanstack/react-table` | Wajib format **Zebra Cross** (`even:bg-muted/25`) |
| **Client Cache & State** | `@tanstack/react-query` v5 | Caching async data client-side |
| **UI State Global** | `zustand` | State UI ringan (status sidebar, filter aktif, modal) |
| **URL State** | `nuqs` | Sinkronisasi pagination dan filter tabel ke URL |
| **Form Handling** | `react-hook-form` | Manajemen form dan dirty tracking |
| **Schema Validation** | `zod` + `@hookform/resolvers` | Validasi skema client dan server |
| **Toast Notifications** | `sonner` | Notifikasi feedback mutasi (sukses, error, info) |
| **Theme Management** | `next-themes` | Mode Terang (Light) & Mode Gelap (Dark) |
| **Visualisasi Data** | `recharts` | Grafik statistik absensi, SPP, dan nilai |
| **Peta Interaktif** | `maplibre-gl` | Peta lokasi sekolah dan radius zonasi |

---

## 3. Dependensi Backend & Database Resmi

- **Database & Auth**: `@supabase/ssr` dan `@supabase/supabase-js` (PostgreSQL 15+ Managed BaaS).
  - **Catatan Development**: Pengembangan dilakukan dengan terhubung **langsung ke Remote Supabase project** (bukan menggunakan Supabase CLI/Docker lokal).
- **Payment Gateway**: Midtrans (Snap API via Popup Modal & Core API).
- **File Storage**: Supabase Storage Buckets resmi (`images`, `lms-files`, `registration-files`, `marketplace-files` sesuai PRD 14).

---

## 4. Library yang DILARANG KERAS (Strict Blacklist)

Untuk menjaga performa dan mematuhi arsitektur sistem:
1. ❌ **Dilarang Server-Side PDF Engines Berat** (seperti `puppeteer`, `jspdf`, `playwright-pdf`, `@react-pdf/renderer` di server): Kuitansi pembayaran dan raport menggunakan halaman web bersih berstandar CSS `@media print` (`window.print()`).
2. ❌ **Dilarang Library Chat / WebSockets** (seperti `socket.io`, `pusher`, `ably`): Fitur chat internal **ditiadakan**.
3. ❌ **Dilarang State Manager Berat Berlebihan** (seperti `redux`, `mobx`): Gunakan Zustand dan React Query.
4. ❌ **Dilarang UI Framework Lain** (seperti `chakra-ui`, `mui`, `ant-design`, `bootstrap`): Seluruh tampilan wajib berbasis Shadcn UI + Tailwind CSS 4.
5. ❌ **Dilarang Styling Library CSS-in-JS Runtime** (seperti `styled-components`, `emotion`): Gunakan Tailwind CSS 4 murni.
