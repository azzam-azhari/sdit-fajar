# Project Roadmap & Implementation Tracker — SDIT Fajar

Dokumen ini memantau perkembangan pengerjaan fitur aplikasi SDIT Fajar yang diselaraskan dengan rencana kerja operasional pada [eksekusi.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/eksekusi.md) dan catatan pengguna di [note.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/note.md).

---

## Ringkasan Fase Pengerjaan

| Fase | Fokus Utama | Status |
|---|---|---|
| **Fase 0** | Finalisasi Dokumentasi, Single Source of Truth & Kontrak | 🔄 Selesai / Konsisten |
| **Fase 1** | Fondasi Aplikasi, Design System (jakub.kr) & Frontend Publik | ⏳ Siap Dikerjakan |
| **Fase 2** | Supabase Auth SSR, Session, Storage Buckets, & Guard | ⏳ Antrean |
| **Fase 3** | Database PostgreSQL, Relasi Skema, RLS, & Seed Data | ⏳ Antrean |
| **Fase 4** | Admin Akademik, Verifikasi PPDB, Konten & Import CSV | ⏳ Antrean |
| **Fase 5** | Dashboard Role, LMS (Materi/Tugas/Nilai), Jadwal & Presensi | ⏳ Antrean |
| **Fase 6** | Pengumuman Sekolah, Modul Tahfidz, & Marketplace Sekolah | ⏳ Antrean |
| **Fase 7** | Billing SPP, Integrasi Midtrans Snap Modal & Kuitansi Cetak | ⏳ Antrean |
| **Fase 8** | Testing, Audit Keamanan RLS, Hardening, & Deployment | ⏳ Antrean |

---

## Detail Checklist Tiap Fase

### Fase 0: Finalisasi Dokumentasi & Kontrak
- [x] Sinkronisasi nama tabel, enum, dan relasi database dengan PRD 08.
- [x] Pembakuan rute publik (`/pendaftaran`, `/profil`, dll.) dan auth (`/login`, `/ganti-password`).
- [x] Pembakuan rute dashboard murid (`/dashboard/murid`) dan wali murid (`/dashboard/wali-murid`).
- [x] Pembakuan endpoint webhook Midtrans (`POST /api/webhooks/midtrans`).
- [x] Pembakuan format kredensial murid (NIS + `tempatddmmyyyy`) dan wali murid (No WhatsApp/HP).
- [x] Konfirmasi alur fulfillment marketplace (Pick-up sekolah & download digital langsung).

---

### Fase 1: Fondasi Aplikasi, Design System & Frontend Publik
- [ ] Inisialisasi dependensi inti di root proyek: Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- [ ] Setup Shadcn UI (Radix Primitives, Lucide Icons, Hugeicons React).
- [ ] Konfigurasi tema Minimalist Craft (terinspirasi dari [jakub.kr](https://jakub.kr/)), Light/Dark mode (`next-themes`).
- [ ] Pembuatan komponen wajib **`ZebraDataTable`**, `PageHeader`, `StatusBadge`, `EmptyState`.
- [ ] Pembangunan halaman publik: Beranda (`/`), Profil (`/profil`, `/sejarah`, `/manajemen`), Kurikulum (`/kurikulum`), Ekstrakurikuler (`/ekstrakurikuler`), Berita (`/berita`), Kontak (`/kontak`).
- [ ] Formulir publik PPDB Online (`/pendaftaran`) dan katalog publik Marketplace (`/marketplace`).

---

### Fase 2: Supabase Auth SSR, Session & Storage
- [ ] Setup Supabase Client SSR (`@supabase/ssr`) dan helper `src/lib/supabase/`.
- [ ] Setup Next.js Middleware (`src/middleware.ts`) untuk proteksi sesi dan role redirect.
- [ ] Implementasi form login tunggal (`/login`) untuk NIS (murid) dan No HP/Email (staf/wali).
- [ ] Alur ganti password wajib (`/ganti-password`) untuk login perdana (`must_change_password = true`).
- [ ] Konfigurasi Supabase Storage Buckets resmi: `images`, `lms-files`, `registration-files`, `marketplace-files`.

---

### Fase 3: Skema Database, Relasi, RLS & Seed Data
- [ ] Eksekusi migration tabel Supabase PostgreSQL sesuai [08-skema-database-supabase.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/08-skema-database-supabase.md).
- [ ] Penerapan Row Level Security (RLS) pada 100% tabel publik.
- [ ] Pengisian master data awal (`academic_years`, `semesters`, `classes`, `positions`, `subjects`).
- [ ] Pengisian seed data demo operasional untuk pengujian lingkungan pengembangan.

---

### Fase 4: Admin Akademik, Verifikasi PPDB & Import CSV
- [ ] Dashboard Super Admin: Kelola user, roles, identitas sekolah (`school_settings`), audit log.
- [ ] Fitur Import Data massal CSV oleh Super Admin (siswa, guru, wali murid) dengan template CSV.
- [ ] Dashboard Admin: Manajemen rombel (`classrooms`), tahun ajaran, dan penugasan guru (`teaching_assignments`).
- [ ] Halaman verifikasi dan persetujuan berkas pendaftaran PPDB (`/dashboard/admin/pendaftaran`).
- [ ] Promosi data calon siswa yang disetujui ke tabel `students` dan pembuatan akun login otomatis.

---

### Fase 5: Dashboard Role, LMS, Jadwal & Presensi
- [ ] Dashboard Guru (`/dashboard/guru`) dengan toggle dinamis berdasarkan jabatan (`positions`).
- [ ] Modul Presensi Guru (masuk 06.30-07.30, pulang >= 14.30) dan presensi mengajar.
- [ ] Modul Presensi Siswa pada jam pelajaran oleh guru/wali kelas (Sabtu-Minggu ditolak).
- [ ] Modul LMS: Pembuatan materi pembelajaran (`materials`) dan penugasan (`assignments`).
- [ ] Dashboard Murid (`/dashboard/murid`): Melihat jadwal, materi, kumpul tugas, dan rekap nilai.
- [ ] Dashboard Wali Murid (`/dashboard/wali-murid`): Memantau perkembangan, nilai, dan absensi anak.

---

### Fase 6: Pengumuman, Modul Tahfidz & Marketplace Sekolah
- [ ] Pengumuman terstruktur sekolah (`announcements`) bertarget per role, seluruh sekolah, atau kelas.
- [ ] **Modul Khusus Tahfidz & Tahsin**:
  - Mutabaah setoran ayat harian oleh guru tahfidz (`tahfidz_records`).
  - Rekapitulasi perkembangan hafalan pada dashboard murid dan wali murid.
- [ ] **Marketplace Sekolah**:
  - Pengelolaan katalog buku & atribut oleh admin sekolah.
  - Alur checkout belanja oleh akun `wali_murid` dengan invoice terintegrasi.

---

### Fase 7: Billing SPP, Midtrans Snap Modal & Kuitansi Cetak
- [ ] Aktivasi global payment Midtrans oleh `super_admin` (`payment_settings`).
- [ ] Admin sekolah mengelola tagihan (`payment_invoices`): SPP bulanan, iuran kegiatan, daftar ulang.
- [ ] Portal pembayaran wali murid: Inisiasi **Midtrans Snap Popup Modal** langsung di dashboard.
- [ ] Route Handler Webhook Midtrans (`POST /api/webhooks/midtrans`) dengan validasi SHA512 signature key.
- [ ] Pembaruan otomatis status invoice menjadi `paid` pasca callback valid yang idempotent.
- [ ] Halaman kuitansi pembayaran print-friendly formal (`/dashboard/wali-murid/payment/[invoiceId]/receipt`).

---

### Fase 8: Hardening, Audit Keamanan & Deployment
- [ ] Audit RLS: Verifikasi zero-leakage data antar-wali murid dan antar-murid.
- [ ] Testing performa, Core Web Vitals, dan audit aksesibilitas.
- [ ] Konfigurasi deployment ke remote Supabase & Vercel production.
