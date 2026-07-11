# Ringkasan Produk

## Nama Produk
LMS SDIT Fajar

## Jenis Produk
Aplikasi web untuk website profil sekolah, publikasi konten, dashboard internal, dan Learning Management System untuk sekolah dasar Islam terpadu.

## Tujuan Produk
LMS SDIT Fajar dibuat untuk membantu sekolah mengelola:
- informasi publik sekolah;
- data siswa, guru, kelas, mata pelajaran, dan tahun ajaran;
- materi pembelajaran;
- jadwal pelajaran di setiap kelas;
- absensi kehadiran siswa di setiap jadwal pelajarannya;
- absensi kehadiran guru di setiap hari sekolah;
- tugas dan pengumpulan tugas;
- nilai dan progres akademik siswa;
- pengumuman sekolah dan pengumuman per kelas, yang muncul di dashboard murid dan wali murid;
- pondasi pembayaran SPP dan daftar ulang via Midtrans.

Menggantikan semua berkas berbentuk kertas di sekolah menjadi digital di website ini agar lebih mudah dikelola oleh guru dan siswa, sekolah juga bisa mempromosikan dirinya ke publik melalui website ini dengan menampilkan beberapa informasi tentang sekolah seperti prestasi dan kegiatan sekolah.

## Target Pengguna
Role tampilan boleh menggunakan label manusiawi, tetapi value database wajib lowercase snake_case.

| Label UI | Value Database |
|---|---|
| Super Admin | `super_admin` |
| Admin Sekolah | `admin_sekolah` |
| Kepala Sekolah | `kepala_sekolah` |
| Guru | `guru` |
| Wali Kelas | `wali_kelas` |
| Murid | `murid` |
| Wali Murid | `wali_murid` |

## Prinsip Produk
- Mudah digunakan guru, murid SD, dan wali murid.
- UI ramah anak, bersih, modern, dan tidak terlalu padat.
- Data akademik dan data anak harus aman.
- Akses user harus mengikuti role dan relasi data.
- Semua fitur harus punya empty state, loading state, error state, dan success feedback.
- Bahasa UI utama adalah Bahasa Indonesia.


## Stack Utama
- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Shadcn UI, Radix UI, Lucide/Hugeicons.
- Supabase Auth, Database, Storage, dan Realtime jika dibutuhkan.
- React Query untuk data client-side.
- Zod dan React Hook Form untuk validasi form.
- Recharts untuk visualisasi dashboard.

## Batasan Produk Saat Ini
- Payment SPP dan daftar ulang hanya disiapkan pondasinya.
- Midtrans belum digunakan untuk transaksi aktif sampai owner mengaktifkan fitur.
- Tidak membuat video conference internal.
- Tidak membuat marketplace konten.
- Tidak membuat chat real-time kecuali diminta eksplisit.
- Tidak membuat role baru tanpa memperbarui dokumentasi.
