# Seed Data

## Roles
```ts
export const roles = [
  'super_admin',
  'admin',
  'guru',
  'murid',
  'wali_murid',
]
```

## Jabatan (Positions)
```ts
export const positions = [
  { code: 'kepala_sekolah', name: 'Kepala Sekolah', category: 'pimpinan' },
  { code: 'wakil_kepala', name: 'Wakil Kepala Sekolah', category: 'pimpinan' },
  { code: 'bendahara', name: 'Bendahara', category: 'administrasi' },
  { code: 'wali_kelas', name: 'Wali Kelas', category: 'akademik' },
  { code: 'koordinator_tahfidz', name: 'Koordinator Tahfidz', category: 'khas_sdit' },
  { code: 'pustakawan', name: 'Pustakawan', category: 'penunjang' },
  { code: 'operator', name: 'Operator Dapodik', category: 'administrasi' },
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

| Role | Nama | Email Demo | Jabatan |
|---|---|---|---|
| `super_admin` | Super Admin SDIT Fajar | `superadmin@sditfajar.sch.id` | - |
| `admin` | Admin Sekolah | `admin@sditfajar.sch.id` | - |
| `guru` | Kepala Sekolah | `kepsek@sditfajar.sch.id` | `kepala_sekolah` |
| `guru` | Ustadz Ahmad | `ustahmad@sditfajar.sch.id` | - |
| `guru` | Ustadzah Siti | `ustsiti@sditfajar.sch.id` | `wali_kelas` |
| `murid` | Ahmad Fajar | `ahmad.fajar@sditfajar.sch.id` | - |
| `wali_murid` | Bapak Wali Ahmad | `wali@sditfajar.sch.id` | - |

## Data Demo Akademik
- Tahun ajaran aktif: 2026/2027.
- Semester aktif: Semester 1.
- Kelas demo: 3.
- Wali kelas demo: Ustadzah Siti (guru jabatan `wali_kelas`).
- Guru Matematika demo: Ustadz Ahmad.
- Kepala sekolah demo: Kepala Sekolah (guru jabatan `kepala_sekolah`).
- Siswa demo: Ahmad Fajar.
- Wali murid demo: Bapak Wali Ahmad.

## Materi Demo
Judul:
- "Bilangan Cacah Sampai 10.000"
- "Adab Menuntut Ilmu"
- "Mengenal Energi di Sekitar Kita"

## Tugas Demo
Judul:
- "Latihan Matematika Bab 1"
- "Hafalan Surat Pendek"
- "Pengamatan Lingkungan Rumah"

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
