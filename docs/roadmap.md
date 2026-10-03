# Project Roadmap & Implementation Tracker — SDIT Fajar

Dokumen ini memantau perkembangan pengerjaan fitur aplikasi SDIT Fajar. AI dan pengembang dapat merujuk ke file ini (`@roadmap.md`) untuk mengetahui progres saat ini dan menentukan langkah selanjutnya.

---

## Ringkasan Fase Pengerjaan

| Fase | Fokus Utama | Status |
|---|---|---|
| **Fase 1** | Arsitektur Fondasi, Database Supabase, & Auth SSR | 🔄 Dalam Proses |
| **Fase 2** | Design System (Minimalist Craft), Layout Shell, & Zebra Table | ⏳ Antrean |
| **Fase 3** | Portal Publik & PPDB Online | ⏳ Antrean |
| **Fase 4** | Manajemen Master Data Sekolah (Super Admin & Admin) | ⏳ Antrean |
| **Fase 5** | Akademik, LMS, Presensi & Modul Tahfidz (Guru & Murid) | ⏳ Antrean |
| **Fase 6** | Billing SPP, Integrasi Midtrans, & Portal Wali Murid | ⏳ Antrean |
| **Fase 7** | Audit Keamanan, Optimasi Performa, & Deployment | ⏳ Antrean |

---

## Detail Checklist Tiap Fase

### Fase 1: Fondasi Proyek, Database & Autentikasi
- [x] Merancang struktur dokumen konteks Vibe Coding (`prd.md`, `techstack.md`, `design.md`, dll.)
- [ ] Inisialisasi dependensi inti: Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- [ ] Setup Shadcn UI dengan Radix Primitives, Lucide Icons, Hugeicons React.
- [ ] Setup Supabase Client SSR (`@supabase/ssr`) dan helper `src/lib/supabase/`.
- [ ] Migrasi skema database PostgreSQL Supabase (tabel `profiles`, `roles`, `classes`, dll. tanpa tabel chat).
- [ ] Penerapan Row Level Security (RLS) pada seluruh tabel database.
- [ ] Implementasi Next.js Middleware untuk proteksi rute berbasis sesi dan role.
- [ ] Alur login email untuk staf & wali murid.
- [ ] Alur login NIS dan penggantian password wajib untuk murid.

---

### Fase 2: Design System & Komponen Inti
- [ ] Konfigurasi palet warna netral Minimalist Craft (terinspirasi dari [jakub.kr](https://jakub.kr/)).
- [ ] Konfigurasi tema Light & Dark mode (`next-themes`).
- [ ] Pembuatan komponen wajib **`ZebraDataTable`** (alternating row color, sorting, pagination, compact density).
- [ ] Pembuatan komponen layout: `DashboardLayout`, `Sidebar`, `Navbar`, `PageHeader`.
- [ ] Setup notifikasi toast elegan menggunakan `Sonner`.

---

### Fase 3: Portal Publik & PPDB Online
- [ ] Halaman Beranda (Hero section minimalis, statistik sekolah, keunggulan).
- [ ] Halaman Profil Sekolah & Visi Misi.
- [ ] Modul Berita & Kegiatan Sekolah (Artikel publikasi dinamis).
- [ ] Halaman Kontak & Integrasi Peta interaktif (MapLibre GL).
- [ ] Formulir Pendaftaran Siswa Baru (PPDB) dengan upload berkas ke Supabase Storage (tabel staging `registrations`).
- [ ] Dashboard pelacakan status seleksi pendaftaran bagi calon wali murid.

---

### Fase 4: Master Data Sekolah (Dashboard Admin)
- [ ] Manajemen Tahun Ajaran & Semester aktif.
- [ ] Manajemen Rombongan Belajar (Kelas) & penetapan Wali Kelas.
- [ ] Manajemen Data Guru & atribusi Jabatan (`positions`).
- [ ] Manajemen Data Siswa (CRUD, import CSV massal, generasi password default).
- [ ] Promosi data calon siswa PPDB yang diterima dari `registrations` ke `students`.
- [ ] Manajemen Data Wali Murid & penautan relasi anak (`student_guardians`).
- [ ] Manajemen Mata Pelajaran (`subject_courses`) & pemetaan ke kelas.

---

### Fase 5: Akademik, LMS & Modul Tahfidz
- [ ] Modul Presensi Digital Harian (Guru & Siswa) dengan rekap otomatis.
- [ ] Modul Pembelajaran: Guru upload materi ajar dan tugas kelas.
- [ ] Modul Pengumpulan Tugas & Penilaian Siswa.
- [ ] **Modul Khusus Tahfidz & Tahsin**:
  - Mutabaah setoran ayat harian (Surah, Ayat, Predikat: Mumtaz, Jayyid, dll.).
  - Rekapitulasi target hafalan juz per semester.
- [ ] Modul Buku Nilai & Generasi E-Raport semesteran.

---

### Fase 6: Keuangan & Integrasi Midtrans
- [ ] Pembuatan & Pengiriman Invoice SPP Bulanan otomatis.
- [ ] Dashboard Keuangan Wali Murid: Melihat rincian tagihan anak.
- [ ] Inisiasi pembayaran via **Midtrans Snap Popup Modal** di portal wali murid.
- [ ] Route Handler Webhook Midtrans (`/api/webhooks/midtrans`) dengan validasi SHA512 signature key.
- [ ] Pembaruan otomatis status tagihan menjadi `paid` pasca verifikasi webhook.
- [ ] Halaman Kuitansi Pembayaran print-friendly `@media print`.

---

### Fase 7: Polish, Testing & Deployment
- [ ] Testing alur RLS: Memastikan tidak ada kebocoran data antar-wali atau antar-murid.
- [ ] Audit Lighthouse (Performa, Aksesibilitas, Best Practices, SEO).
- [ ] Optimasi caching data (TanStack Query + Next.js Server Cache).
- [ ] Deployment ke production environment.
