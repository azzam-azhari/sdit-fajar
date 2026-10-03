# AGENTS.md

Sebelum mengerjakan task apa pun, baca seluruh file konteks utama dan arsip spesifikasi yang telah dikonsolidasikan di folder `docs/`.

## Urutan Baca Wajib
1. `docs/prd.md` — Visi produk, batasan scope, 5 role resmi, & PPDB staging.
2. `docs/techstack.md` — Spesifikasi teknis (Next.js 16, React 19, Tailwind CSS 4, Supabase SSR, Midtrans).
3. `docs/design.md` — Design system Minimalist Craft (jakub.kr) & standar wajib Zebra Cross data table.
4. `docs/database.md` — Skema database PostgreSQL Supabase, relasi tabel, & RLS policies.
5. `docs/api.md` — Kontrak Server Actions, Webhook Midtrans Snap Modal, & Kuitansi `@media print`.
6. `docs/structure.md` — Peta arsitektur folder & konvensi penamaan berkas.
7. `docs/roadmap.md` — Pelacak progres & checklist 7 fase pengerjaan.
8. `docs/state.md` — Manajemen state (React Query, Zustand, URL params).
9. `docs/ai-rules.md` — Aturan teknis AI coding assistant & boundaries.
10. `docs/PRD/` — 26 file arsip spesifikasi teknis granular untuk detail implementasi modul.

## Aturan Keras
- Jangan membuat role baru selain 5 role resmi (`super_admin`, `admin`, `guru`, `murid`, `wali_murid`).
- Jangan membuat route baru tanpa memperbarui dokumentasi.
- Jangan membuat tabel/kolom baru tanpa memperbarui dokumentasi.
- **Dilarang keras menggunakan tema Claymorphism atau Bento Grid**.
- **Tema Desain Final**: Minimalist Craft & Design Engineering (terinspirasi dari https://jakub.kr/), dengan Shadcn UI, Radix UI primitives, Tailwind CSS 4, Lucide React, Hugeicons React.
- **Tabel Data Wajib Zebra Cross**: Gunakan alternating background baris (`even:bg-muted/25`) pada seluruh tabel data.
- **Fitur Chat Internal Ditiadakan**: Tidak ada chat room atau pesan real-time dalam sistem ini.
- Payment Midtrans hanya boleh diaktifkan secara global oleh `super_admin` dan hanya boleh diinisiasi oleh role `wali_murid` untuk anak yang terhubung via Snap Popup Modal.
- Jangan expose secret (`SUPABASE_SERVICE_ROLE_KEY`) ke client.
- Jangan mengandalkan frontend untuk security (selalu amankan via Supabase RLS & Server Action guard).

## Role Database Final
- `super_admin`
- `admin`
- `guru`
- `murid`
- `wali_murid`

## Jabatan (Positions) di Bawah Role `guru`
Jabatan awal yang berpengaruh pada hak akses LMS:
- `kepala_sekolah`
- `wakil_kepala`
- `bendahara`
- `wali_kelas`
- `koordinator_tahfidz`
- `pustakawan`
- `operator`

Sisanya dinamis lewat tabel `positions`.

## Scope Tambahan
- Halaman publik dapat diakses tanpa login; seluruh halaman internal wajib login.
- Fitur pendaftaran murid (PPDB), absensi guru/siswa, modul tahfidz, import CSV, dan payment Midtrans termasuk scope.
- Alur PPDB menggunakan tabel staging terpisah `registrations`; data baru dipromosikan ke tabel `students` setelah diverifikasi dan diterima admin.
- Login murid menggunakan NIS dan password awal berbentuk `tempatddmmyyyy` dari biodata; password wajib diganti pada login pertama.
- Akun `wali_murid` dibuat terpisah dan hanya role tersebut yang dapat memulai pembayaran serta melihat bukti pembayaran anak yang terhubung.
- Kuitansi pembayaran dicetak via halaman web bersih berspesifikasi `@media print` CSS (bebas dependency server PDF engine).
- Semua file/gambar yang diunggah wajib memiliki URL atau storage path yang disimpan pada tabel domain terkait di Supabase Storage.
- Super admin mengelola identitas/kontak sekolah, konfigurasi payment, import data, dan pengumuman.
- Admin mengelola konten publik operasional dan invoice.
- Semua guru pakai `/dashboard/guru`; fitur tambahan muncul berdasarkan jabatan (*position-based UI*).
