# Daftar Fitur & Scope

## MVP Fase 1 - Fondasi Website dan Admin
Fitur yang sudah atau perlu ada sebagai fondasi:
- Landing page sekolah.
- Profil sekolah.
- Manajemen sekolah.
- Sejarah sekolah.
- Kurikulum.
- Ekstrakurikuler.
- Kontak.
- Berita sekolah dengan pagination dan detail.
- Login dashboard.
- Dashboard admin.
- Manajemen user dasar.
- Upload gambar ke Supabase Storage.
- Role dasar.

## MVP Fase 2 - Fondasi LMS
Fitur wajib LMS awal:
- Manajemen tahun ajaran dan semester.
- Manajemen kelas.
- Manajemen rombel.
- Manajemen mata pelajaran.
- Relasi siswa ke kelas.
- Relasi orang tua ke siswa.
- Relasi guru ke mapel dan kelas.
- Dashboard per role.
- Materi pembelajaran.
- Tugas.
- Pengumpulan tugas.
- Penilaian dan feedback.
- Pengumuman sekolah/kelas.
- Laporan nilai sederhana.

## MVP Fase 3 - Monitoring Akademik
- Jadwal pelajaran.
- Kalender akademik.
- Progres belajar siswa.
- Rekap nilai per mapel.
- Rekap tugas belum dikumpulkan.
- Dashboard kepala sekolah.
- Dashboard wali kelas.
- Dashboard orang tua.
- Rekap absensi guru
- Rekap absensi siswa

## Setup Payment - Belum Aktif Operasional
Fitur payment hanya disiapkan struktur dan konfigurasi:
- Konfigurasi Midtrans sandbox/production.
- Tabel tagihan SPP.
- Tabel tagihan daftar ulang.
- Tabel transaksi pembayaran.
- Status pembayaran.
- Placeholder tombol bayar yang masih disabled atau feature-flagged.

Tidak boleh melakukan charge nyata sampai:
- environment production sudah siap;
- Midtrans production key sudah divalidasi;
- flow callback/webhook sudah dites;
- owner mengaktifkan feature flag payment.

## Tidak Masuk Scope Saat Ini
- Video conference internal.
- Chat real-time.
- Marketplace materi.
- AI grading otomatis.
- Sistem presensi QR.
- Payroll guru.
- Inventaris sekolah.
- Akuntansi penuh.

## Aturan Scope untuk Agent
- Jangan membuat fitur di luar daftar tanpa instruksi eksplisit.
- Jika data atau aturan belum ada, buat TODO di kode, bukan mengarang aturan.
- Jika butuh tabel baru, perbarui `08-skema-database-supabase.md` terlebih dahulu.
- Jika butuh route baru, perbarui `03-daftar-halaman.md` terlebih dahulu.
