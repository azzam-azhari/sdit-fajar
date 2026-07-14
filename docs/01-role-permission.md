# Role & Permission

## Aturan Role Database
Semua role disimpan lowercase snake_case.

```ts
export const USER_ROLES = [
  'super_admin',
  'admin_sekolah',
  'kepala_sekolah',
  'guru',
  'wali_kelas',
  'murid',
  'wali_murid',
] as const
```

## Definisi Role

### `super_admin`
Pemilik akses teknis tertinggi, biasanya IT sekolah atau developer internal.

Boleh:
- mengelola seluruh user;
- mengelola konfigurasi aplikasi;
- mengelola role dan permission;
- melihat seluruh data;
- mengakses audit log;
- melakukan maintenance teknis.

Tidak boleh:
- menyimpan secret di client;
- mengubah data akademik tanpa alasan operasional yang jelas.

### `admin_sekolah`
Admin operasional sekolah.

Boleh:
- mengelola data siswa, wali murid, guru, kelas, mapel, tahun ajaran;
- membuat pengumuman sekolah di setiap kelasnya atau seluruh kelas;
- melihat laporan administrasi;
- menyiapkan invoice SPP dan daftar ulang saat fitur pembayaran aktif.
- membuat pengumuman wali murid;
- membuat pengumuman murid;
- membuat jadwal pelajaran untuk kelas tertentu;
- melihat jadwal pelajaran;
- mengelola konten publik operasional, berita, galeri, dan halaman sekolah;
- membuat, mengubah, dan menghapus invoice;
- mengaktifkan atau menonaktifkan modul payment yang sudah diizinkan super admin;
- mengelola periode bulan dan tahun aktif untuk operasional.


Tidak boleh:
- mengubah konfigurasi teknis aplikasi;
- mengakses service role key;
- mengubah source code atau migration.

### `kepala_sekolah`
Role monitoring dan approval.

Boleh:
- melihat dashboard ringkasan sekolah;
- melihat laporan akademik seluruh kelas;
- melihat aktivitas guru dan siswa;
- melihat laporan pembayaran saat fitur aktif;
- membuat atau menyetujui pengumuman penting jika dibutuhkan.
- mengelola absensi guru dan rekap bulanan di setiap tanggal 23 setiap bulan.
- mengaktifkan atau menonaktifkan absensi akhir pekan;
- melihat rekap absensi guru dan siswa.

Tidak boleh:
- menghapus data user;
- mengubah struktur kelas atau database;
- memberi nilai tugas kecuali juga punya assignment sebagai guru.

### `guru`
Pengajar mata pelajaran.

Boleh:
- melihat kelas dan mapel yang diajar;
- membuat materi;
- membuat tugas;
- memeriksa pengumpulan tugas;
- memberi nilai dan feedback;
- membuat pengumuman untuk kelas/mapel yang diajar.

Tidak boleh:
- melihat nilai siswa di kelas yang tidak diajar;
- mengubah data user;
- mengubah pembayaran.

### `wali_kelas`
Guru dengan tanggung jawab kelas tertentu.

Boleh:
- melihat data siswa dalam kelas binaannya;
- melihat progres akademik kelas binaannya;
- membuat pengumuman kelas;
- membuat pengumuman wali murid;
- melihat ringkasan tugas, nilai, dan kehadiran kelas binaannya;
- membantu komunikasi ke wali murid.

Tidak boleh:
- mengubah nilai mapel yang bukan miliknya kecuali diberi permission eksplisit;
- mengelola kelas lain.

Catatan:
- User yang menjadi wali kelas juga bisa memiliki kemampuan `guru` bila ia mengajar mapel.
- Implementasi bisa memakai role utama `wali_kelas` plus tabel assignment mengajar.

### `murid`
Peserta didik.

Boleh:
- melihat dashboard siswa;
- melihat materi untuk kelasnya;
- melihat tugas untuk kelasnya;
- mengumpulkan tugas;
- melihat nilai miliknya sendiri;
- melihat pengumuman sekolah atau kelas.
- bisa edit data diri sebagai siswa
- mencatat absensi pembelajaran sesuai jadwal pada hari sekolah;

Tidak boleh:
- melihat nilai siswa lain;
- mengakses dashboard admin/guru;
- mengubah jawaban setelah deadline kecuali guru mengizinkan.

### `wali_murid`
Wali murid.

Boleh:
- melihat profil anak yang terhubung;
- melihat nilai dan progres anak;
- melihat tugas anak;
- melihat pengumuman;
- melihat tagihan SPP dan daftar ulang jika fitur pembayaran aktif.
- melihat seluruh riwayat pembayaran anak yang terhubung;
- memulai pembayaran Midtrans untuk invoice anak;
- membuka dan mengunduh bukti pembayaran di tab baru;
- membeli konten marketplace untuk anak atau akun keluarga.

Tidak boleh:
- melihat data anak lain yang tidak terhubung;
- mengubah data akademik;
- mengumpulkan tugas atas nama siswa kecuali fitur ini diizinkan eksplisit.
- memulai pembayaran atau checkout sebagai role lain.

## Matrix Permission Ringkas

| Modul | super_admin | admin_sekolah | kepala_sekolah | guru | wali_kelas | murid | wali_murid |
|---|---:|---:|---:|---:|---:|---:|---:|
| Kelola user | yes | yes | no | no | no | no | no |
| Kelola kelas/mapel | yes | yes | view | no | view own | no | no |
| Materi | all | manage public/admin | view | manage own | view class | view own class | view child |
| Tugas | all | view | view | manage own | view class | submit own | view child |
| Nilai | all | view | view all | manage own subject | view class | view own | view child |
| Pengumuman | all | manage all | manage optional | manage own class | manage own class | view | view |
| Payment & invoice | global config | invoice/module | view | no | no | no | pay/view child |
| Absensi guru | all | manage | view/review | self | view class | no | view child summary |
| Absensi siswa | all | manage | view/review | view class | manage class | self | view child |
| Chat | all | manage policy | view | participate | participate | participate | participate |
| Marketplace | all | manage catalog | view | no | view | view | checkout |
| Import CSV | manage | no | no | no | no | no | no |
| Audit log | yes | optional view | no | no | no | no | no |

## Aturan Implementasi
- Jangan hanya menyembunyikan menu di frontend. Backend dan RLS tetap wajib menjaga akses data.
- Permission harus dicek di Server Action atau API route.
- Query data siswa wajib difilter berdasarkan role dan relasi.
- Untuk role ganda, prioritaskan tabel relasi, bukan membuat role baru.
- Jika seseorang juga menjadi admin dan wali murid, sediakan akun `wali_murid` terpisah yang memiliki relasi anak; jangan melakukan impersonasi atau memperluas akses admin secara diam-diam.
- Hanya `super_admin` yang boleh mengubah identitas dan kontak utama sekolah, konfigurasi provider Midtrans, serta aktivasi global payment.
