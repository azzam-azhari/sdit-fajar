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
| `admin_sekolah` | `/dashboard/admin` |
| `kepala_sekolah` | `/dashboard/kepala-sekolah` |
| `guru` | `/dashboard/guru` |
| `wali_kelas` | `/dashboard/wali-kelas` |
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

## Admin Sekolah Pages

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

## Kepala Sekolah Pages

| Route | Halaman |
|---|---|
| `/dashboard/kepala-sekolah` | Dashboard kepala sekolah |
| `/dashboard/kepala-sekolah/akademik` | Laporan akademik |
| `/dashboard/kepala-sekolah/guru` | Aktivitas guru |
| `/dashboard/kepala-sekolah/kelas` | Monitoring kelas |
| `/dashboard/kepala-sekolah/pengumuman` | Pengumuman |
| `/dashboard/kepala-sekolah/absensi-guru` | Rekap absensi guru |
| `/dashboard/kepala-sekolah/absensi-siswa` | Rekap absensi siswa |
| `/dashboard/kepala-sekolah/pengaturan-absensi` | Pengaturan akhir pekan |

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
| `/dashboard/guru/absensi` | Absensi mengajar |

## Wali Kelas Pages

| Route | Halaman |
|---|---|
| `/dashboard/wali-kelas` | Dashboard wali kelas |
| `/dashboard/wali-kelas/siswa` | Siswa kelas binaan |
| `/dashboard/wali-kelas/progres` | Progres kelas |
| `/dashboard/wali-kelas/tugas` | Monitoring tugas kelas |
| `/dashboard/wali-kelas/nilai` | Rekap nilai kelas |
| `/dashboard/wali-kelas/pengumuman` | Pengumuman kelas |
| `/dashboard/wali-kelas/absensi` | Absensi kelas binaan |

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

| Route | Halaman | Akses |
|---|---|---|
| `/dashboard/chat` | Chat real-time internal | user yang diizinkan |
| `/dashboard/chat/[threadId]` | Detail thread chat | anggota thread |

## Standar Page State
Setiap halaman data wajib memiliki:
- loading state;
- empty state;
- error state;
- success toast untuk mutasi;
- breadcrumb di dashboard;
- guard akses role.
- Untuk bukti pembayaran, halaman receipt dapat dibuka melalui tab baru dan hanya dapat diakses oleh `wali_murid` yang memiliki relasi dengan siswa/invoice.
