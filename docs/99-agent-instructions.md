# Agent Instructions

## Instruksi Utama
Agent wajib membaca folder `docs/` sebelum coding.
Dokumen ini adalah aturan tertinggi untuk mencegah halusinasi implementasi.

## Prioritas Dokumen
1. `docs/00-ringkasan-produk.md`
2. `docs/01-role-permission.md`
3. `docs/02-daftar-fitur-scope.md`
4. `docs/03-daftar-halaman.md`
5. `docs/04-tampilan-frontend.md`
6. `docs/07-alur-database.md`
7. `docs/08-skema-database-supabase.md`
8. `docs/10-backend.md`
9. `docs/19-testing-acceptance-criteria.md`

## Role Wajib
Jangan membuat role selain:
- `super_admin`
- `admin_sekolah`
- `kepala_sekolah`
- `guru`
- `wali_kelas`
- `murid`
- `wali_murid`

Label UI boleh manusiawi, tetapi value database wajib sama seperti daftar di atas.

## Tema Wajib
Gunakan:
- claymorphism;
- bento grid;
- primary biru cerah;
- rounded besar;
- shadow lembut;
- UI Bahasa Indonesia.

Jangan mengubah tema ke desain lain tanpa instruksi eksplisit.

## Aturan Sebelum Membuat Fitur
Sebelum membuat fitur, cek:
- apakah fitur ada di `02-daftar-fitur-scope.md`;
- apakah route ada di `03-daftar-halaman.md`;
- apakah data model ada di `08-skema-database-supabase.md`;
- apakah role permission jelas di `01-role-permission.md`;
- apakah acceptance criteria ada di `19-testing-acceptance-criteria.md`.

Jika belum ada:
- jangan mengarang diam-diam;
- update docs terlebih dahulu atau buat TODO eksplisit.

## Aturan Backend
- Semua mutasi harus cek auth.
- Semua mutasi harus cek role.
- Semua input harus validasi Zod.
- Semua operasi data sensitif harus server-side.
- Service role key tidak boleh masuk client.
- Query harus menghormati RLS dan relasi data.

## Aturan Frontend
- Semua halaman dashboard punya loading state.
- Semua halaman dashboard punya empty state.
- Semua halaman dashboard punya error state.
- Semua form punya validasi dan toast.
- Sidebar menu harus mengikuti role.
- Jangan hanya mengandalkan hidden menu untuk security.

## Aturan Database
- Jangan membuat tabel baru tanpa memperbarui `08-skema-database-supabase.md`.
- Jangan membuat field baru tanpa dokumentasi.
- Jangan mengubah enum role tanpa dokumentasi.
- Gunakan snake_case.
- Gunakan UUID untuk tabel utama.
- Aktifkan RLS untuk tabel internal.

## Aturan Payment
- Payment SPP, daftar ulang, iuran, pendaftaran semester, dan produk marketplace dapat diaktifkan oleh `super_admin` setelah pemeriksaan keamanan dan webhook lulus.
- Tombol bayar hanya aktif untuk `wali_murid` dan hanya jika flag environment, database, dan modul payment terkait aktif.
- `admin_sekolah` mengelola invoice dan modul yang telah diizinkan, tetapi tidak dapat melewati aktivasi global super admin.
- Status `paid` hanya boleh berasal dari callback Midtrans yang signature-nya valid dan idempotent.
- `MIDTRANS_SERVER_KEY` tidak boleh disimpan di database atau dikirim ke client.

## Scope Fitur yang Disetujui
- Pendaftaran murid baru.
- Absensi guru pada 07.30 dan 14.30 Senin-Jumat, dengan akhir pekan opsional oleh kepala sekolah.
- Absensi siswa per jadwal pelajaran, tanpa absensi pembelajaran Sabtu-Minggu.
- Chat real-time terbatas pada anggota thread.
- Marketplace konten pembelajaran dengan checkout akun `wali_murid`.
- Import data CSV oleh super admin dengan template resmi.

## Larangan Fitur
Jangan membuat fitur berikut kecuali diminta eksplisit:
- video conference internal;
- AI grading otomatis;
- payroll;
- inventaris;

## Ketika Ragu
Jika informasi tidak ada di docs:
- pilih solusi paling sederhana;
- jangan membuat asumsi besar;
- tulis TODO di kode;
- jangan menambah scope diam-diam.

## Definition of Done
Task selesai jika:
- sesuai docs;
- role guard aman;
- validasi ada;
- UI sesuai tema;
- empty/loading/error state ada;
- lint/build lolos;
- dokumentasi diperbarui jika ada perubahan scope, route, database, atau env.
