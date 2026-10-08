# Daftar Halaman & Route

## Prinsip Routing
- Menggunakan Next.js App Router dengan struktur folder `src/app/`.
- Route group menggunakan `(public)`, `(auth)`, dan `(dashboard)` atau `(admin)`.
- Nama route group tidak muncul di URL browser.
- Semua halaman dashboard wajib protected via middleware dan server-side auth guard.
- Dashboard default diarahkan otomatis berdasarkan role user.
- Semua guru memakai `/dashboard/guru`; fitur tambahan muncul dinamis berdasarkan jabatan (*position-based UI toggles*).

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
| `/kontak` | Kontak & Peta Lokasi | wajib |
| `/pendaftaran` | Pendaftaran murid baru (PPDB Online) | wajib |
| `/marketplace` | Marketplace buku & konten pembelajaran | wajib |

## Auth Pages

| Route | Halaman | Akses |
|---|---|---|
| `/login` | Login tunggal (NIS untuk murid, No HP/Email untuk role lain) | guest only |
| `/ganti-password` | Penggantian password wajib (login perdana / `must_change_password`) | protected (user aktif) |
| `/forgot-password` | Lupa Password | optional |
| `/reset-password` | Reset Password | optional |

## Dashboard Redirect

| Role | Redirect Setelah Login |
|---|---|
| `super_admin` | `/dashboard/super-admin` |
| `admin` | `/dashboard/admin` |
| `guru` | `/dashboard/guru` |
| `murid` | `/dashboard/murid` |
| `wali_murid` | `/dashboard/wali-murid` |

## Super Admin Pages

| Route | Halaman |
|---|---|
| `/dashboard/super-admin` | Ringkasan teknis |
| `/dashboard/super-admin/users` | Semua user |
| `/dashboard/super-admin/roles` | Role dan permission |
| `/dashboard/super-admin/settings` | Pengaturan identitas sekolah (`school_settings`) |
| `/dashboard/super-admin/audit-logs` | Audit log aktivitas sensitif |
| `/dashboard/super-admin/import` | Import data massal CSV |
| `/dashboard/super-admin/import/template` | Download template CSV |
| `/dashboard/super-admin/pengumuman` | Pengumuman seluruh user/role |
| `/dashboard/super-admin/payment` | Aktivasi global payment Midtrans |

## Admin Pages

| Route | Halaman |
|---|---|
| `/dashboard/admin` | Ringkasan administrasi |
| `/dashboard/admin/users` | User sekolah |
| `/dashboard/admin/pendaftaran` | Verifikasi & persetujuan formulir pendaftaran PPDB |
| `/dashboard/admin/siswa` | Data pokok siswa |
| `/dashboard/admin/wali-murid` | Data wali murid & penautan anak |
| `/dashboard/admin/guru` | Data guru & jabatan |
| `/dashboard/admin/kelas` | Data tingkat kelas |
| `/dashboard/admin/rombel` | Rombongan belajar & penetapan wali kelas |
| `/dashboard/admin/mapel` | Master mata pelajaran |
| `/dashboard/admin/tahun-ajaran` | Tahun ajaran, semester & periode aktif |
| `/dashboard/admin/berita` | Kelola berita sekolah |
| `/dashboard/admin/pengumuman` | Kelola pengumuman sekolah |
| `/dashboard/admin/payment/settings` | Setup Midtrans (client config) |
| `/dashboard/admin/payment/spp` | Setup tagihan SPP |
| `/dashboard/admin/payment/daftar-ulang` | Setup daftar ulang semester |
| `/dashboard/admin/management-user` | Manajemen user operasional |
| `/dashboard/admin/konten-publik` | Konten publik operasional |
| `/dashboard/admin/absensi` | Rekap absensi sekolah |
| `/dashboard/admin/payment/invoices` | Kelola seluruh invoice |
| `/dashboard/admin/payment/modules` | Aktif/nonaktif modul payment yang diizinkan |

## Guru Pages

Semua guru (termasuk kepala sekolah, wali kelas, koordinator tahfidz, dan jabatan lainnya) menggunakan basis route `/dashboard/guru`. Fitur tambahan muncul berdasarkan jabatan (*position-based UI*).

| Route | Halaman | Jabatan / Akses |
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
| `/dashboard/guru/tugas/[assignmentId]/pengumpulan` | Pengumpulan tugas siswa | semua guru |
| `/dashboard/guru/nilai` | Input dan rekap nilai | semua guru |
| `/dashboard/guru/pengumuman` | Pengumuman kelas/mapel | semua guru |
| `/dashboard/guru/absensi` | Presensi mengajar (masuk & pulang) | semua guru |
| `/dashboard/guru/tahfidz` | Mutabaah setoran ayat tahfidz | guru tahfidz / pengampu |
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

## Murid Pages

| Route | Halaman |
|---|---|
| `/dashboard/murid` | Dashboard murid |
| `/dashboard/murid/jadwal` | Jadwal pelajaran |
| `/dashboard/murid/materi` | Materi pembelajaran |
| `/dashboard/murid/materi/[materialId]` | Detail materi |
| `/dashboard/murid/tugas` | Daftar tugas |
| `/dashboard/murid/tugas/[assignmentId]` | Detail dan kumpulkan tugas |
| `/dashboard/murid/nilai` | Nilai saya & e-raport |
| `/dashboard/murid/tahfidz` | Capaian mutabaah tahfidz saya |
| `/dashboard/murid/pengumuman` | Pengumuman |
| `/dashboard/murid/absensi` | Riwayat presensi (read-only) |

## Wali Murid Pages

| Route | Halaman |
|---|---|
| `/dashboard/wali-murid` | Dashboard wali murid |
| `/dashboard/wali-murid/anak` | Data anak terhubung |
| `/dashboard/wali-murid/anak/[studentId]` | Detail perkembangan anak |
| `/dashboard/wali-murid/tugas` | Tugas anak |
| `/dashboard/wali-murid/nilai` | Nilai anak & e-raport |
| `/dashboard/wali-murid/tahfidz` | Mutabaah setoran tahfidz anak |
| `/dashboard/wali-murid/pengumuman` | Pengumuman |
| `/dashboard/wali-murid/absensi` | Riwayat absensi anak |
| `/dashboard/wali-murid/payment` | Riwayat tagihan & pembayaran anak |
| `/dashboard/wali-murid/payment/[invoiceId]` | Detail invoice dan popup bayar Midtrans |
| `/dashboard/wali-murid/payment/[invoiceId]/receipt` | Bukti pembayaran resmi (web print-friendly) |
| `/dashboard/wali-murid/marketplace` | Pembelian buku & konten sekolah |

## Shared Internal Pages

*(Catatan: Fitur dan rute `/dashboard/chat` telah ditiadakan dari sistem).*

## Standar Page State
Setiap halaman data wajib memiliki:
- loading state (skeleton);
- empty state;
- error state;
- success toast untuk mutasi (Sonner);
- breadcrumb di dashboard;
- guard akses role dan jabatan di tingkat server;
- untuk bukti pembayaran, halaman receipt dapat dibuka melalui tab baru dan hanya dapat diakses oleh `wali_murid` yang memiliki relasi resmi dengan anak/invoice terkait.
