---
trigger: always_on
description: UI Style Guide & Frontend Design Guidelines untuk SDIT Fajar
---

# UI Style Guide & Frontend Design Guidelines — SDIT Fajar

Dokumen ini adalah pedoman mutlak untuk seluruh perancangan antarmuka, tata kelola komponen frontend, dan styling pada proyek SDIT Fajar. Seluruh AI agent dan developer wajib mematuhi panduan ini agar antarmuka sistem tetap konsisten, bersih (*clean*), terukur, dan mudah dirawat pada proyek skala besar.

---

## 1. Core Technology Stack Frontend

- **Framework**: Next.js 16 (App Router dengan folder `src/`)
- **UI Library**: React 19 (Server Components by default)
- **Language**: TypeScript 5.x (Strict mode aktif, larangan keras menggunakan `any`)
- **CSS Engine**: Tailwind CSS 4
- **Component Primitives**: **Shadcn UI** (dibangun di atas Radix UI primitives)
- **Icon Ecosystem**:
  - `lucide-react`: Ikon fungsionalitas sistem standar (tabel, tombol aksi, status).
  - `@hugeicons/react`: Ikon navigasi utama, menu dashboard, dan aksen editorial/fitur.
- **Data Table**: TanStack React Table (`@tanstack/react-table`) dengan styling wajib **Zebra Cross**.
- **State & Data Fetching**: TanStack React Query v5 (client cache), Zustand (state UI ringan), `nuqs` (URL query state).
- **Form & Validation**: React Hook Form (`react-hook-form`) + Zod (`zod`, `@hookform/resolvers/zod`).
- **Feedback & Utilities**: Sonner (toast notification), Recharts (visualisasi data/grafik), `next-themes` (Dark/Light mode).

---

## 2. Filosofi Desain: Minimalist Craft & Design Engineering

Gaya visual mengadopsi pendekatan **Minimalist Craft & Design Engineering** yang terinspirasi dari arsitektur visual **[jakub.kr](https://jakub.kr/)**.

### Prinsip Utama:
1. **Zero Claymorphism**: Dilarang keras menggunakan elemen 3D gelembung (*clay*), bayangan tebal bengkak, atau warna pastel kartun tebal.
2. **Zero Heavy Bento Clutter**: Dilarang menggunakan bento-grid berlebihan tanpa fungsi jelas yang membuang-buang ruang layar.
3. **Precision & Micro-Borders**: Mengutamakan garis batas tipis yang tajam (*subtle crisp micro-borders* `border border-border/80`), padding presisi, dan *whitespace* terukur.
4. **Data-First & High Legibility**: Karena sistem mengelola nilai, absensi, tagihan, dan data santri/siswa, keterbacaan data horizontal dan vertikal adalah prioritas tertinggi.
5. **Clean & Editorial Feel**: Memadukan font sans-serif modern dengan sentuhan font monospaced untuk data angka/kode administratif.

---

## 3. Aturan Komponen UI (Shadcn & Reusability)

> **PRINSIP EMAS**: Seluruh komponen UI harus berbasis **Shadcn UI**. Utamakan komponen **reusable** agar tidak memperbanyak dan menduplikasi kode.

### Struktur Penempatan Komponen:
```text
src/components/
├── ui/                 # Komponen primitif Shadcn UI murni (button, input, dialog, card, dll)
└── common/             # Komponen reusable lintas halaman aplikasi (ZebraTable, PageHeader, dll)

src/app/**/_components/ # Komponen privat yang HANYA digunakan pada route/halaman tertentu
```

### Pedoman Penggunaan & Pembuatan Komponen:
1. **Gunakan Primitif Shadcn**: Jangan pernah membuat elemen kustom mentah (seperti modal kustom dari `<div>` absolut) jika Shadcn UI sudah menyediakannya (`Dialog`, `Sheet`, `DropdownMenu`, `Popover`, `Select`, `Tooltip`, dll).
2. **Reuse Sebelum Create**: Sebelum membuat komponen baru, periksa apakah komponen serupa sudah ada di `src/components/common/`. Kembangkan atau tambahkan varian/props pada komponen yang sudah ada alih-alih membuat file baru.
3. **Strict Typing**: Semua props komponen wajib didefinisikan dengan TypeScript `interface` atau `type` eksplisit (bebas `any`).
4. **Server vs Client Components**:
   - Jadikan komponen sebagai **Server Component (RSC)** secara default.
   - Tambahkan direktif `'use client'` **hanya pada komponen daun (*leaf components*)** yang membutuhkan hooks (`useState`, `useEffect`), event listeners, atau browser APIs.
5. **Path Alias**: Selalu gunakan path alias `@/*` (contoh: `import { Button } from '@/components/ui/button'`). Dilarang menggunakan relative import panjang seperti `../../../../components/`.

---

## 4. Standar Wajib Tabel Data: Zebra Cross Table

Seluruh tabel data (daftar siswa, guru, tagihan SPP, nilai, mutabaah tahfidz, dan log audit) **wajib menggunakan format Zebra Cross** (baris selang-seling) untuk kemudahan penelusuran data horizontal.

### Spesifikasi Implementasi:
- Kontainer: `w-full overflow-x-auto rounded-lg border border-border`
- Header: `bg-muted/60 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border`
- Baris Selang-Seling:
  - Genap/Ganjil: `index % 2 === 0 ? "bg-background" : "bg-muted/25 dark:bg-muted/15"` atau utility `even:bg-muted/25 dark:even:bg-muted/15`
  - Hover state: `hover:bg-muted/50 transition-colors`
- Kolom Angka/Kode: Wajib menggunakan `font-mono text-xs` (NIS, tanggal, nomor invoice, nominal IDR).
- Komponen Acuan: Gunakan komponen reusable `ZebraDataTable` dari `@/components/common/zebra-data-table.tsx`.

---

## 5. Token Warna (Color Tokens) & Tema

Menggunakan palet warna netral monokromatik (Slate/Zinc) dengan aksen *Deep Blue* profesional:

### Palet Warna Token:
| Token Semantic | Light Mode | Dark Mode | Deskripsi & Penggunaan |
|---|---|---|---|
| `background` | `#FCFCFC` / `#FFFFFF` | `#09090B` / `#101010` | Latar belakang halaman utama |
| `card` | `#FFFFFF` / `#F8FAFC` | `#18181B` / `#141416` | Surface kontainer kartu & modal |
| `border` | `#E4E4E7` / `#E2E8F0` | `#27272A` / `#334155` | Garis batas tipis 1px presisi |
| `foreground` | `#09090B` / `#18181B` | `#F4F4F5` / `#FAFAFA` | Warna teks utama kontras tinggi |
| `muted-foreground` | `#71717A` / `#64748B` | `#A1A1AA` | Teks sekunder, label, keterangan |
| `primary` | `#2563EB` | `#3B82F6` | Deep Blue untuk tombol aksi utama & link aktif |
| `primary-hover` | `#1D4ED8` | `#2563EB` | State hover tombol primary |
| `success` | `#16A34A` | `#22C55E` | Status sukses / aktif / lunas |
| `warning` | `#D97706` | `#F59E0B` | Status perhatian / tenggat / pending |
| `danger / destructive` | `#DC2626` | `#EF4444` | Aksi destruktif, tagihan macet, error |

---

## 6. Tipografi (Typography)

- **Font Sans**: Inter Variable atau Plus Jakarta Sans (`font-sans`).
- **Font Monospace**: `font-mono` (JetBrains Mono / Berkeley Mono) untuk seluruh data NIS, kode invoice, nilai numerik, dan mata uang Rupiah.
- **Skala Ukuran Teks**:
  - **H1 (Page Title)**: `text-2xl font-semibold tracking-tight text-foreground`
  - **H2 (Section Title)**: `text-xl font-medium tracking-tight text-foreground`
  - **H3 (Card Title)**: `text-base font-medium text-foreground`
  - **Body / Content**: `text-sm leading-relaxed text-muted-foreground`
  - **Subtext / Helper**: `text-xs text-muted-foreground`
  - **Badges / Mono Labels**: `text-xs font-mono font-medium tracking-wide`

---

## 7. Pola Komponen Spesifik

### Card & Kontainer
- **Card Standar**:
  ```tsx
  className="rounded-xl border border-border/80 bg-card p-5 transition-all duration-200"
  ```
- **Interactive Card (Dapat diklik)**:
  ```tsx
  className="group rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
  ```
- **Aturan Card**: Hindari bayangan 3D tebal (*no heavy box-shadow*). Gunakan `hover:border-foreground/20` atau `hover:shadow-sm` yang sangat halus.

### Tombol (Button Variants via Shadcn)
- **Primary**: `bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-medium h-9 px-4 text-xs`
- **Outline**: `border border-border bg-background hover:bg-muted hover:text-foreground h-9 px-4 text-xs font-medium`
- **Ghost**: `hover:bg-muted hover:text-foreground h-9 px-3 text-xs font-medium`
- **Destructive**: `bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm h-9 px-4 text-xs font-medium`

### Form & Input
- Form dikelola dengan **React Hook Form** + **Zod resolver**.
- Input: `rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none`.
- Tampilkan error message per field secara jelas di bawah input (`text-xs text-destructive`).
- Tombol submit wajib di-*disable* dan menampilkan spinner loading saat proses pengiriman data sedang berlangsung.

### Feedback State (Wajib Disediakan)
1. **Empty State**: Tampilkan ilustrasi/ikon minimalis dan teks informatif saat data kosong (misal: "Belum ada materi untuk kelas ini").
2. **Loading State**: Gunakan skeleton pulse halus (`<Skeleton className="h-4 w-full" />`), hindari layar kosong.
3. **Error State**: Tampilkan pesan ramah pengguna jika fetch atau mutasi gagal.
4. **Toast Notification**: Gunakan Sonner untuk seluruh feedback mutasi (Create, Update, Delete).

---

## 8. Standar Bahasa & UI Copy

- Seluruh teks antarmuka publik dan dashboard wajib menggunakan **Bahasa Indonesia** yang baku, sopan, dan bernuansa islami terpadu:
  - Contoh: *Beranda*, *Tagihan SPP*, *Halaqah Tahfidz*, *Buku Nilai*, *Keluar*, *Simpan Perubahan*, *Pendaftaran PPDB*.
- Pesan Toast dan Form Error wajib dalam Bahasa Indonesia (contoh: *"Data siswa berhasil disimpan"*, *"NIS wajib diisi"*).
- Kode program, types, interface, variabel, dan komentar kode tetap menggunakan **Bahasa Inggris** yang bersih.

---

## 9. Larangan Desain & UI (UI Constraints)

- ❌ **Dilarang Claymorphism**: Tidak ada tombol membal 3D, border radius bengkak tak proporsional, atau bayangan tebal.
- ❌ **Dilarang Bento Grid berat**: Jangan membuat layout kotak-kotak beraneka ukuran yang membuang ruang data.
- ❌ **Dilarang Tabel Polos**: Jangan membuat tabel data tanpa styling baris Zebra Cross.
- ❌ **Dilarang Tombol Pembayaran untuk Selain Wali Murid**: Tombol bayar SPP hanya boleh muncul untuk role `wali_murid`.
- ❌ **Dilarang Fitur Chat Internal**: Fitur chat real-time ditiadakan dari sistem, jangan membuat komponen chat.
- ❌ **Dilarang Inline Styling Berlebihan**: Gunakan class utilitas Tailwind CSS dan token CSS variables Shadcn.
