# Daftar Halaman & Route

## Prinsip Routing
- Menggunakan Next.js App Router.
- Route group boleh memakai `(public)`, `(auth)`, dan `(dashboard)` atau `(admin)`.
- Nama route group tidak muncul di URL.
- Semua halaman dashboard wajib protected.
- Dashboard default diarahkan berdasarkan role.
- Semua guru pakai `/dashboard/guru`; fitur tambahan muncul berdasarkan jabatan (position-based UI).

## Public Pages

| Route | Halaman | Status |
|---|---|---|
| `/` | Beranda | wajib |
| `/profil` | Profil Sekolah | wajib |
| `/profil/sejarah` | Sejarah Sekolah | wajib |
| `/profil/manajemen` | Manajemen Sekolah | wajib |
| `/kurikulum` | Kurikulum | wajib |
| `/ekstrakurikuler` | Ekstrakurikuler | wajib |
| `/berita` | Daftar Berita | wajib |
| `/berita/[slug]` | Detail Berita | wajib |
| `/kontak` | Kontak | wajib |
| `/pendaftaran` | Pendaftaran murid baru | wajib |
| `/marketplace` | Marketplace konten pembelajaran | wajib |

## Auth Pages

| Route | Halaman | Akses |
|---|---|---|
| `/login` | Login dengan identifier/NIS | guest only |
| `/forgot-password` | Lupa Password | optional |
| `/reset-password` | Reset Password | optional |

## Dashboard Redirect

| Role | Redirect Setelah Login |
|---|---|
| `super_admin` | `/dashboard/super-admin` |
| `admin` | `/dashboard/admin` |
| `guru` | `/dashboard/guru` |
| `murid` | `/dashboard/siswa` |
| `wali_murid` | `/dashboard/wali-murid` |

## Super Admin Pages

| Route | Halaman |
|---|---|
| `/dashboard/super-admin` | Ringkasan teknis |
| `/dashboard/super-admin/users` | Semua user |
| `/dashboard/super-admin/roles` | Role dan permission |
| `/dashboard/super-admin/settings` | Pengaturan aplikasi |
| `/dashboard/super-admin/audit-logs` | Audit log |
| `/dashboard/super-admin/import` | Import data CSV |
| `/dashboard/super-admin/import/template` | Download template CSV |
| `/dashboard/super-admin/pengumuman` | Pengumuman seluruh user/role |
| `/dashboard/super-admin/payment` | Aktivasi global payment Midtrans |

## Admin Pages

| Route | Halaman |
|---|---|
| `/dashboard/admin` | Ringkasan administrasi |
| `/dashboard/admin/users` | User sekolah |
| `/dashboard/admin/siswa` | Data siswa |
| `/dashboard/admin/wali-murid` | Data wali murid |
| `/dashboard/admin/guru` | Data guru |
| `/dashboard/admin/kelas` | Data kelas |
| `/dashboard/admin/rombel` | Rombongan belajar |
| `/dashboard/admin/mapel` | Mata pelajaran |
| `/dashboard/admin/tahun-ajaran` | Tahun ajaran dan semester |
| `/dashboard/admin/berita` | Berita sekolah |
| `/dashboard/admin/pengumuman` | Pengumuman |
| `/dashboard/admin/payment/settings` | Setup Midtrans |
| `/dashboard/admin/payment/spp` | Setup tagihan SPP |
| `/dashboard/admin/payment/daftar-ulang` | Setup daftar ulang |
| `/dashboard/admin/management-user` | Manajemen user |
| `/dashboard/admin/konten-publik` | Konten publik operasional |
| `/dashboard/admin/absensi` | Rekap absensi sekolah |
| `/dashboard/admin/payment/invoices` | Kelola semua invoice |
| `/dashboard/admin/payment/modules` | Aktif/nonaktif modul payment |

## Guru Pages

Semua guru (termasuk kepala sekolah, wali kelas, dan jabatan lainnya) menggunakan route `/dashboard/guru`. Fitur tambahan muncul berdasarkan jabatan (position-based UI).

| Route | Halaman | Jabatan |
|---|---|---|
| `/dashboard/guru` | Dashboard guru | semua guru |
| `/dashboard/guru/kelas` | Kelas yang diajar | semua guru |
| `/dashboard/guru/kelas/[classId]` | Detail kelas | semua guru |
| `/dashboard/guru/mapel` | Mapel yang diajar | semua guru |
| `/dashboard/guru/materi` | Materi pembelajaran | semua guru |
| `/dashboard/guru/materi/create` | Buat materi | semua guru |
| `/dashboard/guru/materi/[materialId]` | Detail/edit materi | semua guru |
| `/dashboard/guru/tugas` | Daftar tugas | semua guru |
| `/dashboard/guru/tugas/create` | Buat tugas | semua guru |
| `/dashboard/guru/tugas/[assignmentId]` | Detail tugas | semua guru |
| `/dashboard/guru/tugas/[assignmentId]/pengumpulan` | Pengumpulan siswa | semua guru |
| `/dashboard/guru/nilai` | Input dan rekap nilai | semua guru |
| `/dashboard/guru/pengumuman` | Pengumuman kelas/mapel | semua guru |
| `/dashboard/guru/absensi` | Absensi mengajar | semua guru |
| `/dashboard/guru/monitoring` | Monitoring seluruh sekolah | jabatan `kepala_sekolah` |
| `/dashboard/guru/akademik` | Laporan akademik seluruh kelas | jabatan `kepala_sekolah` |
| `/dashboard/guru/aktivitas-guru` | Aktivitas guru | jabatan `kepala_sekolah` |
| `/dashboard/guru/monitoring-kelas` | Monitoring kelas | jabatan `kepala_sekolah` |
| `/dashboard/guru/absensi-guru` | Rekap absensi guru | jabatan `kepala_sekolah` |
| `/dashboard/guru/absensi-siswa` | Rekap absensi siswa | jabatan `kepala_sekolah` |
| `/dashboard/guru/pengaturan-absensi` | Pengaturan akhir pekan | jabatan `kepala_sekolah` |
| `/dashboard/guru/siswa-kelas` | Siswa kelas binaan | jabatan `wali_kelas` |
| `/dashboard/guru/progres-kelas` | Progres kelas | jabatan `wali_kelas` |
| `/dashboard/guru/monitoring-tugas` | Monitoring tugas kelas | jabatan `wali_kelas` |
| `/dashboard/guru/rekap-nilai` | Rekap nilai kelas | jabatan `wali_kelas` |
| `/dashboard/guru/pengumuman-kelas` | Pengumuman kelas binaan | jabatan `wali_kelas` |
| `/dashboard/guru/absensi-kelas` | Absensi kelas binaan | jabatan `wali_kelas` |

## Siswa Pages

| Route | Halaman |
|---|---|
| `/dashboard/siswa` | Dashboard siswa |
| `/dashboard/siswa/jadwal` | Jadwal pelajaran |
| `/dashboard/siswa/materi` | Materi |
| `/dashboard/siswa/materi/[materialId]` | Detail materi |
| `/dashboard/siswa/tugas` | Tugas |
| `/dashboard/siswa/tugas/[assignmentId]` | Detail dan kumpulkan tugas |
| `/dashboard/siswa/nilai` | Nilai saya |
| `/dashboard/siswa/pengumuman` | Pengumuman |
| `/dashboard/siswa/absensi` | Riwayat absensi |

## Wali Murid Pages

| Route | Halaman |
|---|---|
| `/dashboard/wali-murid` | Dashboard wali murid |
| `/dashboard/wali-murid/anak` | Data anak |
| `/dashboard/wali-murid/anak/[studentId]` | Detail anak |
| `/dashboard/wali-murid/tugas` | Tugas anak |
| `/dashboard/wali-murid/nilai` | Nilai anak |
| `/dashboard/wali-murid/pengumuman` | Pengumuman |
| `/dashboard/wali-murid/absensi` | Absensi anak |
| `/dashboard/wali-murid/payment` | Riwayat pembayaran anak |
| `/dashboard/wali-murid/payment/[invoiceId]` | Detail invoice dan bayar |
| `/dashboard/wali-murid/payment/[invoiceId]/receipt` | Bukti pembayaran |
| `/dashboard/wali-murid/marketplace` | Pembelian konten |

## Shared Internal Pages

*(Catatan: Fitur dan rute `/dashboard/chat` telah ditiadakan dari sistem).*

## Standar Page State
Setiap halaman data wajib memiliki:
- loading state;
- empty state;
- error state;
- success toast untuk mutasi;
- breadcrumb di dashboard;
- guard akses role dan jabatan.
- Untuk bukti pembayaran, halaman receipt dapat dibuka melalui tab baru dan hanya dapat diakses oleh `wali_murid` yang memiliki relasi dengan siswa/invoice.
