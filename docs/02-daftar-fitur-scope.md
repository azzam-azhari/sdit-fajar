# Daftar Fitur & Scope

## Fase 1 - Frontend dan Website Publik
- Landing page sekolah dan seluruh halaman publik tanpa login.
- Profil, sejarah, manajemen, kurikulum, ekstrakurikuler, kontak, dan berita.
- Form pendaftaran murid baru.
- Dukungan Bahasa Inggris untuk konten publik terpilih; Bahasa Indonesia tetap default.
- Login dashboard dan komponen loading, empty, error, toast, serta validasi.

## Fase 2 - Setup Supabase dan Auth
- Project Supabase: Auth, Database, Storage, dan Realtime.
- Profil user dan tujuh role final.
- Protected route untuk seluruh halaman internal.
- RLS untuk autentikasi, otorisasi, dan relasi data.
- Password awal murid `tempatddmmyyyy` dari biodata, wajib diganti saat login pertama.
- Import CSV oleh super admin dengan template CSV yang dapat diunduh.

## Fase 3 - Database dan Admin Akademik
- Migration, enum, index, tabel, relasi, dan RLS sesuai skema.
- Manajemen tahun ajaran, semester, bulan, dan tahun aktif operasional.
- Manajemen kelas, rombel, mata pelajaran, siswa, guru, dan wali murid.
- Relasi siswa-kelas, wali murid-siswa, dan guru-mapel-kelas.
- Dashboard per role dan pengelolaan konten publik.

## Fase 4 - LMS dan Absensi
- Materi pembelajaran.
- Tugas, pengumpulan tugas, penilaian, dan feedback.
- Jadwal pelajaran, kalender akademik, dan progres belajar.
- Absensi guru pada pukul 07.30 dan 14.30 setiap Senin-Jumat.
- Absensi guru Sabtu-Minggu hanya jika diaktifkan kepala sekolah.
- Absensi siswa pada setiap jadwal pelajaran; tidak ada absensi pembelajaran Sabtu-Minggu.
- Rekap absensi guru dan siswa.

## Fase 5 - Monitoring, Komunikasi, dan Marketplace
- Dashboard kepala sekolah dan wali kelas.
- Rekap nilai, tugas, kehadiran, dan progres.
- Chat real-time internal berbasis thread; hanya anggota thread yang dapat membaca/mengirim pesan.
- Marketplace buku atau konten pembelajaran yang dikelola sekolah.
- Checkout marketplace hanya melalui akun `wali_murid`.

## Fase 6 - Payment Midtrans Aktif
- Aktivasi global hanya oleh `super_admin`.
- Admin sekolah membuat, mengubah, dan menghapus invoice.
- SPP bulanan.
- Iuran ekstrakurikuler.
- Pendaftaran semester ganjil dan genap.
- Jenis tagihan lain yang disetujui sekolah.
- Pembayaran Midtrans hanya dari akun `wali_murid`.
- Riwayat pembayaran anak berbentuk tabel.
- Bukti pembayaran dapat dibuka di tab baru dan diunduh.
- Webhook dengan signature verification dan idempotensi.

## Aturan Payment
- Environment production, key, webhook, dan RLS wajib divalidasi sebelum aktivasi.
- Tombol bayar hanya aktif jika flag environment, konfigurasi database, dan modul terkait aktif.
- Status `paid` hanya boleh diubah oleh callback Midtrans yang valid.
- Server key tidak boleh disimpan di database atau client.

## Tidak Masuk Scope Saat Ini
- Video conference internal.
- AI grading otomatis.
- Sistem presensi QR.
- Payroll guru.
- Inventaris sekolah.
- Akuntansi penuh.

## Aturan Scope untuk Agent
- Jangan membuat fitur di luar daftar tanpa instruksi eksplisit.
- Jika butuh tabel atau kolom baru, perbarui `08-skema-database-supabase.md` terlebih dahulu.
- Jika butuh route baru, perbarui `03-daftar-halaman.md` terlebih dahulu.
- Semua upload harus menyimpan URL atau storage path ke tabel domain terkait.
