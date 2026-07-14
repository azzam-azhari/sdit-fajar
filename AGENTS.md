# AGENTS.md

Sebelum mengerjakan task apa pun, baca folder `docs/`.

## Urutan Baca Wajib
1. `docs/99-agent-instructions.md`
2. `docs/00-ringkasan-produk.md`
3. `docs/01-role-permission.md`
4. `docs/02-daftar-fitur-scope.md`
5. `docs/03-daftar-halaman.md`
6. `docs/04-tampilan-frontend.md`
7. `docs/08-skema-database-supabase.md`
8. `docs/10-backend.md`
9. `docs/19-testing-acceptance-criteria.md`

## Aturan Keras
- Jangan membuat role baru.
- Jangan membuat route baru tanpa update docs.
- Jangan membuat tabel/kolom baru tanpa update docs.
- Jangan mengubah tema visual tanpa instruksi eksplisit.
- Payment Midtrans boleh diaktifkan hanya oleh `super_admin` setelah konfigurasi, signature webhook, RLS, dan environment server tervalidasi.
- Jangan expose secret ke client.
- Jangan mengandalkan frontend untuk security.

## Role Database Final
- `super_admin`
- `admin_sekolah`
- `kepala_sekolah`
- `guru`
- `wali_kelas`
- `murid`
- `wali_murid`

## Tema UI Final
- Claymorphism.
- Bento grid.
- Primary biru cerah.
- Bahasa Indonesia.

## Scope Tambahan dari `note.md`
- Halaman publik dapat diakses tanpa login; seluruh halaman internal wajib login.
- Fitur pendaftaran murid, absensi guru/siswa, chat real-time, marketplace konten, import CSV, dan payment Midtrans termasuk scope.
- Login murid menggunakan NIS dan password awal berbentuk `tempatddmmyyyy` dari biodata; password wajib diganti pada login pertama.
- Akun `wali_murid` dibuat terpisah dan hanya role tersebut yang dapat memulai pembayaran serta melihat bukti pembayaran anak yang terhubung.
- Semua file/gambar yang diunggah wajib memiliki URL atau storage path yang disimpan pada tabel domain terkait.
- Super admin mengelola identitas/kontak sekolah, konfigurasi payment, import data, dan pengumuman ke semua user atau role tertentu.
- Admin sekolah mengelola konten publik operasional dan invoice, tetapi tidak dapat mengubah identitas/kontak utama sekolah atau melewati aktivasi global payment super admin.
