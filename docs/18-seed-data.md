# Seed Data

## Roles
```ts
export const roles = [
  'super_admin',
  'admin_sekolah',
  'kepala_sekolah',
  'guru',
  'wali_kelas',
  'murid',
  'wali_murid',
]
```

## Tahun Ajaran
- 2026/2027

## Semester
- Semester 1
- Semester 2

## Kelas
- 1
- 2
- 3
- 4
- 5
- 6

## Mata Pelajaran
- Pendidikan Agama Islam
- Bahasa Indonesia
- Matematika
- IPAS
- Pendidikan Pancasila
- Bahasa Inggris
- PJOK
- Seni Budaya
- Tahfidz
- Akidah Akhlak
- Fiqih
- Bahasa Arab
- Teknologi Informasi

## Ekstrakurikuler
- Pramuka
- Memanah
- Taekwondo
- Tahfidz
- Futsal

## User Demo
Gunakan email domain development, bukan data asli.

| Role | Nama | Email Demo |
|---|---|---|
| `super_admin` | Super Admin SDIT Fajar | `superadmin@sditfajar.sch.id` |
| `admin_sekolah` | Admin Sekolah | `admin@sditfajar.sch.id` |
| `kepala_sekolah` | Kepala Sekolah | `kepsek@sditfajar.sch.id` |
| `guru` | Ustadz Ahmad | `ustahmad@sditfajar.sch.id` |
| `wali_kelas` | Ustadzah Siti | `ustsiti@sditfajar.sch.id` |
| `murid` | Ahmad Fajar | `ahmad.fajar@sditfajar.sch.id` |
| `wali_murid` | Bapak Wali Ahmad | `wali@sditfajar.sch.id` |

## Data Demo Akademik
- Tahun ajaran aktif: 2026/2027.
- Semester aktif: Semester 1.
- Kelas demo: 3.
- Wali kelas demo: Ustadzah Siti.
- Guru Matematika demo: Ustadz Ahmad.
- Siswa demo: Ahmad Fajar.
- Wali murid demo: Bapak Wali Ahmad.

## Materi Demo
Judul:
- “Bilangan Cacah Sampai 10.000”
- “Adab Menuntut Ilmu”
- “Mengenal Energi di Sekitar Kita”

## Tugas Demo
Judul:
- “Latihan Matematika Bab 1”
- “Hafalan Surat Pendek”
- “Pengamatan Lingkungan Rumah”

## Payment Demo
Gunakan environment sandbox. Data demo invoice boleh `unpaid` dan transaksi `pending` hanya untuk simulasi webhook tervalidasi; jangan gunakan key production.

Invoice contoh:
- SPP Juli 2026, status `unpaid`.
- Pendaftaran Semester Ganjil 2026/2027, status `unpaid`.
- Iuran Ekstrakurikuler, status `unpaid`.

## Attendance Demo
- Sesi guru check-in 07.30 dan check-out 14.30 pada hari kerja.
- Tidak ada absensi siswa untuk Sabtu-Minggu.
- `teacher_weekend_attendance_enabled` default `false`.

## Larangan Seed Data
- Jangan memakai data pribadi asli siswa/guru/wali murid.
- Jangan menyimpan password asli di dokumentasi.
- Jangan menyimpan Midtrans key asli di seed.
