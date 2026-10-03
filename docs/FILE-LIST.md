# Daftar File Konteks & Dokumentasi SDIT Fajar

Seluruh berkas dokumentasi telah dikonsolidasikan ke dalam folder `docs/` sebagai sumber kebenaran tunggal (*Single Source of Truth*).

---

## 1. File Konteks Utama (Vibe Coding Foundation)
- `docs/prd.md` — Product Requirements Document (Visi, Scope, 5 Role Resmi, & PPDB Staging Flow)
- `docs/techstack.md` — Spesifikasi Teknologi, Dependensi Inti, & Arsitektur Direktori
- `docs/design.md` — Minimalist Craft (jakub.kr), Palet Warna Netral, & Standar Wajib Zebra Cross Table
- `docs/database.md` — Skema Supabase PostgreSQL, Relasi Tabel, Staging `registrations`, & RLS Policies
- `docs/api.md` — Kontrak Server Actions, Webhook Midtrans Snap Modal, & Kuitansi `@media print`
- `docs/state.md` — Manajemen State (React Query, Zustand, URL Query Params)
- `docs/structure.md` — Peta Struktur Folder & Konvensi Penamaan Berkas
- `docs/roadmap.md` — Pelacak Progres & Checklist 7 Fase Pengerjaan Proyek
- `docs/AGENTS.md` — Aturan Keamanan & Batasan Operasional Universal Agen
- `docs/ai-rules.md` — Aturan Teknis AI Coding Assistant (.cursorrules format)

---

## 2. Arsip Spesifikasi Teknis Granular (`docs/PRD/`)
- `docs/PRD/00-ringkasan-produk.md` — Visi, target pengguna, dan prinsip produk
- `docs/PRD/01-role-permission.md` — 5 Role resmi dan matriks hak akses
- `docs/PRD/02-daftar-fitur-scope.md` — MVP scope dan out-of-scope (chat ditiadakan)
- `docs/PRD/03-daftar-halaman.md` — Daftar lengkap route publik, auth, dan dashboard
- `docs/PRD/04-tampilan-frontend.md` — Konsep desain Minimalist Craft (jakub.kr) & layout
- `docs/PRD/05-komponen-ui.md` — Spesifikasi komponen Shadcn & ZebraDataTable
- `docs/PRD/06-alur-pengguna.md` — User flow per role dan modul tahfidz
- `docs/PRD/07-alur-database.md` — Alur data operasional dan relasi tabel
- `docs/PRD/08-skema-database-supabase.md` — DDL skema database PostgreSQL
- `docs/PRD/09-rls-dan-keamanan-data.md` — Kebijakan Row Level Security (RLS)
- `docs/PRD/10-backend.md` — Pola Server Actions dan proteksi middleware
- `docs/PRD/11-api-contract.md` — Kontrak tipe data request/response Server Actions
- `docs/PRD/12-auth-session.md` — Alur autentikasi email, NIS, dan cookie session
- `docs/PRD/13-payment-midtrans-setup.md` — Panduan integrasi Midtrans Snap & webhook
- `docs/PRD/14-storage-upload.md` — Kebijakan bucket Supabase Storage
- `docs/PRD/15-konten-publik-sekolah.md` — Spesifikasi landing page, berita, dan PPDB
- `docs/PRD/16-lms-akademik.md` — Modul kelas, materi, tugas, nilai, dan absensi
- `docs/PRD/17-notifikasi-pengumuman.md` — Pengumuman sekolah & toast Sonner
- `docs/PRD/18-seed-data.md` — Data awal demo sekolah, role, dan jabatan
- `docs/PRD/19-testing-acceptance-criteria.md` — Kriteria penerimaan fitur & testing
- `docs/PRD/20-env-deployment.md` — Manajemen environment variable
- `docs/PRD/21-standar-kode.md` — Pedoman penulisan kode TypeScript & styling
- `docs/PRD/22-roadmap.md` — Rencana tahapan pengerjaan sprint
- `docs/PRD/99-agent-instructions.md` — Instruksi keras dan batasan coding agent
- `docs/PRD/periode.md` — Kalender akademik sekolah dan siklus semester
- `docs/PRD/eksekusi.md` — Action plan eksekusi dan checklist gatekeeper

---

## 3. Dokumen Pendukung Lainnya
- `docs/README.md` — Ringkasan dan panduan membaca dokumentasi
- `docs/note.md` — Catatan scope fitur operasional
- `docs/luar-scope-projek/hosting-domain.md` — Identitas yayasan & konfigurasi domain
- `docs/.cursorrules` — Salinan aturan prompt Cursor AI