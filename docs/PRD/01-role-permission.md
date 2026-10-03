# Role & Permission

## Aturan Role Database
Semua role disimpan lowercase snake_case.

```ts
export const USER_ROLES = [
  'super_admin',
  'admin',
  'guru',
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

### `admin`
Admin operasional sekolah.

Boleh:
- mengelola data siswa, wali murid, guru, kelas, mapel, tahun ajaran;
- membuat pengumuman sekolah di setiap kelasnya atau seluruh kelas;
- melihat laporan administrasi;
- menyiapkan invoice SPP dan daftar ulang saat fitur pembayaran aktif;
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

### `guru`
Pengajar dan staf sekolah. Hak akses tambahan ditentukan oleh jabatan (position) yang dimiliki. Lihat bagian **Sistem Jabatan** di bawah.

Boleh (semua guru):
- melihat kelas dan mapel yang diajar;
- membuat materi;
- membuat tugas;
- memeriksa pengumpulan tugas;
- memberi nilai dan feedback;
- membuat pengumuman untuk kelas/mapel yang diajar.

Tidak boleh (semua guru):
- melihat nilai siswa di kelas yang tidak diajar (kecuali jabatan mengizinkan);
- mengubah data user;
- mengubah pembayaran.

### `murid`
Peserta didik.

Boleh:
- melihat dashboard siswa;
- melihat materi untuk kelasnya;
- melihat tugas untuk kelasnya;
- mengumpulkan tugas;
- melihat nilai miliknya sendiri;
- melihat pengumuman sekolah atau kelas;
- bisa edit data diri sebagai siswa;
- mencatat absensi pembelajaran sesuai jadwal pada hari sekolah.

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
- melihat tagihan SPP dan daftar ulang jika fitur pembayaran aktif;
- melihat seluruh riwayat pembayaran anak yang terhubung;
- memulai pembayaran Midtrans untuk invoice anak;
- membuka dan mengunduh bukti pembayaran di tab baru;
- membeli konten marketplace untuk anak atau akun keluarga.

Tidak boleh:
- melihat data anak lain yang tidak terhubung;
- mengubah data akademik;
- mengumpulkan tugas atas nama siswa kecuali fitur ini diizinkan eksplisit;
- memulai pembayaran atau checkout sebagai role lain.

## Sistem Jabatan (Positions)

Jabatan adalah atribut tambahan di bawah role `guru` yang menentukan hak akses spesifik. Satu guru bisa memiliki lebih dari satu jabatan. Jabatan disimpan di tabel `positions` dan relasinya di `teacher_positions`.

### Daftar Lengkap Jabatan Sekolah

#### Struktur Pimpinan
- Kepala Sekolah
- Wakil Kepala Sekolah (Kurikulum, Kesiswaan, Sarana Prasarana, Humas)

#### Administrasi & Keuangan
- Bendahara
- Kepala Tata Usaha / Staf TU
- Operator Dapodik

#### Akademik
- Wali Kelas
- Guru Mata Pelajaran (PAI, Bahasa Arab, Matematika, dll)
- Guru Tahfidz / Koordinator Tahfidz
- Guru Pendamping Khusus (inklusi)

#### Penunjang
- Pustakawan (Kepala Perpustakaan)
- Koordinator Ekstrakurikuler
- Guru BK / Konselor
- Koordinator Ibadah / Keagamaan
- Petugas UKS
- Koordinator Kebersihan

#### Non-guru (Staf)
- Satpam, Petugas Kebersihan, Driver, Penjaga Sekolah

#### Khas SDIT
- Koordinator Tahfidz
- Koordinator Kegiatan Keislaman (mentoring, pembiasaan ibadah)
- Murabbi / Pembina halaqah

### Jabatan Awal yang Berpengaruh pada Hak Akses LMS

Jabatan berikut diimplementasikan awal karena langsung mempengaruhi hak akses fitur LMS. Sisanya bisa ditambah nanti lewat tabel `positions` yang dinamis.

```ts
export const INITIAL_POSITIONS = [
  'kepala_sekolah',
  'wakil_kepala',
  'bendahara',
  'wali_kelas',
  'koordinator_tahfidz',
  'pustakawan',
  'operator',
] as const
```

| Kode | Label UI | Hak Akses Tambahan |
|---|---|---|
| `kepala_sekolah` | Kepala Sekolah | Monitoring seluruh sekolah, rekap absensi guru/siswa, toggle absensi akhir pekan, laporan akademik dan pembayaran |
| `wakil_kepala` | Wakil Kepala Sekolah | Monitoring kelas/mapel terkait bidangnya, melihat laporan akademik |
| `bendahara` | Bendahara | Melihat laporan keuangan/pembayaran |
| `wali_kelas` | Wali Kelas | Melihat data siswa kelas binaan, progres akademik kelas, pengumuman kelas, rekap tugas/nilai/kehadiran kelas, absensi kelas binaan |
| `koordinator_tahfidz` | Koordinator Tahfidz | Mengelola data tahfidz, monitoring progres hafalan |
| `pustakawan` | Pustakawan | Mengelola katalog perpustakaan/konten |
| `operator` | Operator Dapodik | Akses data operasional yang relevan |

### Permission Jabatan Detail

#### Jabatan `kepala_sekolah`
Boleh:
- melihat dashboard ringkasan sekolah;
- melihat laporan akademik seluruh kelas;
- melihat aktivitas guru dan siswa;
- melihat laporan pembayaran saat fitur aktif;
- membuat atau menyetujui pengumuman penting jika dibutuhkan;
- mengelola absensi guru dan rekap bulanan;
- mengaktifkan atau menonaktifkan absensi akhir pekan;
- melihat rekap absensi guru dan siswa.

Tidak boleh:
- menghapus data user;
- mengubah struktur kelas atau database;
- memberi nilai tugas kecuali juga punya assignment sebagai guru.

#### Jabatan `wali_kelas`
Boleh:
- melihat data siswa dalam kelas binaannya;
- melihat progres akademik kelas binaannya;
- membuat pengumuman kelas;
- membuat pengumuman wali murid;
- melihat ringkasan tugas, nilai, dan kehadiran kelas binaannya;
- membantu komunikasi ke wali murid;
- mencatat absensi kelas binaannya.

Tidak boleh:
- mengubah nilai mapel yang bukan miliknya kecuali diberi permission eksplisit;
- mengelola kelas lain.

Catatan:
- User dengan jabatan wali kelas juga bisa memiliki kemampuan guru biasa bila ia mengajar mapel.
- Implementasi memakai tabel `teacher_positions` plus tabel `teaching_assignments`.

## Matrix Permission Ringkas

| Modul | super_admin | admin | guru | murid | wali_murid |
|---|---:|---:|---:|---:|---:|
| Kelola user | yes | yes | no | no | no |
| Kelola kelas/mapel | yes | yes | no | no | no |
| Materi | all | manage public/admin | manage own | view own class | view child |
| Tugas | all | view | manage own | submit own | view child |
| Nilai | all | view | manage own subject | view own | view child |
| Pengumuman | all | manage all | manage own class | view | view |
| Payment & invoice | global config | invoice/module | no | no | pay/view child |
| Absensi guru | all | manage | self | no | no |
| Absensi siswa | all | manage | view/manage class ¹ | self | view child |
| Tahfidz | all | view | manage own halaqah | view own | view child |
| Marketplace | all | manage catalog | no | view | checkout |
| Import CSV | manage | no | no | no | no |
| Audit log | yes | optional view | no | no | no |
| Monitoring seluruh sekolah | yes | yes | hanya jabatan ² | no | no |
| Toggle absensi weekend | yes | no | hanya jabatan ² | no | no |
| Rekap absensi guru | yes | yes | hanya jabatan ² | no | no |
| Data siswa kelas binaan | yes | yes | hanya jabatan ³ | no | no |

¹ Guru dengan jabatan `wali_kelas` bisa mengelola absensi kelas binaannya.
² Hanya guru dengan jabatan `kepala_sekolah`.
³ Hanya guru dengan jabatan `wali_kelas`.

## Aturan Implementasi
- Jangan hanya menyembunyikan menu di frontend. Backend dan RLS tetap wajib menjaga akses data.
- Permission harus dicek di Server Action atau API route.
- Query data siswa wajib difilter berdasarkan role dan relasi.
- Untuk role ganda, prioritaskan tabel relasi, bukan membuat role baru.
- Jika seseorang juga menjadi admin dan wali murid, sediakan akun `wali_murid` terpisah yang memiliki relasi anak; jangan melakukan impersonasi atau memperluas akses admin secara diam-diam.
- Hanya `super_admin` yang boleh mengubah identitas dan kontak utama sekolah, konfigurasi provider Midtrans, serta aktivasi global payment.
- Permission jabatan dicek melalui relasi `teacher_positions`; jangan hardcode permission ke role `guru` secara umum jika fitur hanya untuk jabatan tertentu.
- Semua guru pakai `/dashboard/guru`; fitur tambahan muncul berdasarkan jabatan (position-based UI).
