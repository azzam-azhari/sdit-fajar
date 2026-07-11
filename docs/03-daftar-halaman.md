# Daftar Halaman & Route

## Prinsip Routing
- Menggunakan Next.js App Router.
- Route group boleh memakai `(public)`, `(auth)`, dan `(dashboard)` atau `(admin)`.
- Nama route group tidak muncul di URL.
- Semua halaman dashboard wajib protected.
- Dashboard default diarahkan berdasarkan role.

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

## Auth Pages

| Route | Halaman | Akses |
|---|---|---|
| `/login` | Login | guest only |
| `/forgot-password` | Lupa Password | optional |
| `/reset-password` | Reset Password | optional |

## Dashboard Redirect

| Role | Redirect Setelah Login |
|---|---|
| `super_admin` | `/dashboard/super-admin` |
| `admin_sekolah` | `/dashboard/admin` |
| `kepala_sekolah` | `/dashboard/kepala-sekolah` |
| `guru` | `/dashboard/guru` |
| `wali_kelas` | `/dashboard/wali-kelas` |
| `siswa` | `/dashboard/siswa` |
| `orang_tua` | `/dashboard/orang-tua` |

## Super Admin Pages

| Route | Halaman |
|---|---|
| `/dashboard/super-admin` | Ringkasan teknis |
| `/dashboard/super-admin/users` | Semua user |
| `/dashboard/super-admin/roles` | Role dan permission |
| `/dashboard/super-admin/settings` | Pengaturan aplikasi |
| `/dashboard/super-admin/audit-logs` | Audit log |

## Admin Sekolah Pages

| Route | Halaman |
|---|---|
| `/dashboard/admin` | Ringkasan administrasi |
| `/dashboard/admin/users` | User sekolah |
| `/dashboard/admin/siswa` | Data siswa |
| `/dashboard/admin/orang-tua` | Data orang tua |
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

## Kepala Sekolah Pages

| Route | Halaman |
|---|---|
| `/dashboard/kepala-sekolah` | Dashboard kepala sekolah |
| `/dashboard/kepala-sekolah/akademik` | Laporan akademik |
| `/dashboard/kepala-sekolah/guru` | Aktivitas guru |
| `/dashboard/kepala-sekolah/kelas` | Monitoring kelas |
| `/dashboard/kepala-sekolah/pengumuman` | Pengumuman |

## Guru Pages

| Route | Halaman |
|---|---|
| `/dashboard/guru` | Dashboard guru |
| `/dashboard/guru/kelas` | Kelas yang diajar |
| `/dashboard/guru/kelas/[classId]` | Detail kelas |
| `/dashboard/guru/mapel` | Mapel yang diajar |
| `/dashboard/guru/materi` | Materi pembelajaran |
| `/dashboard/guru/materi/create` | Buat materi |
| `/dashboard/guru/materi/[materialId]` | Detail/edit materi |
| `/dashboard/guru/tugas` | Daftar tugas |
| `/dashboard/guru/tugas/create` | Buat tugas |
| `/dashboard/guru/tugas/[assignmentId]` | Detail tugas |
| `/dashboard/guru/tugas/[assignmentId]/pengumpulan` | Pengumpulan siswa |
| `/dashboard/guru/nilai` | Input dan rekap nilai |
| `/dashboard/guru/pengumuman` | Pengumuman kelas/mapel |

## Wali Kelas Pages

| Route | Halaman |
|---|---|
| `/dashboard/wali-kelas` | Dashboard wali kelas |
| `/dashboard/wali-kelas/siswa` | Siswa kelas binaan |
| `/dashboard/wali-kelas/progres` | Progres kelas |
| `/dashboard/wali-kelas/tugas` | Monitoring tugas kelas |
| `/dashboard/wali-kelas/nilai` | Rekap nilai kelas |
| `/dashboard/wali-kelas/pengumuman` | Pengumuman kelas |

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

## Orang Tua Pages

| Route | Halaman |
|---|---|
| `/dashboard/orang-tua` | Dashboard orang tua |
| `/dashboard/orang-tua/anak` | Data anak |
| `/dashboard/orang-tua/anak/[studentId]` | Detail anak |
| `/dashboard/orang-tua/tugas` | Tugas anak |
| `/dashboard/orang-tua/nilai` | Nilai anak |
| `/dashboard/orang-tua/pengumuman` | Pengumuman |
| `/dashboard/orang-tua/payment` | Status pembayaran anak |

## Standar Page State
Setiap halaman data wajib memiliki:
- loading state;
- empty state;
- error state;
- success toast untuk mutasi;
- breadcrumb di dashboard;
- guard akses role.
