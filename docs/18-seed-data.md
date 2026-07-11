# Seed Data

## Roles
```ts
export const roles = [
  'super_admin',
  'admin_sekolah',
  'kepala_sekolah',
  'guru',
  'wali_kelas',
  'siswa',
  'orang_tua',
]
```

## Tahun Ajaran
- 2026/2027

## Semester
- Semester 1
- Semester 2

## Kelas
- 1A
- 1B
- 2A
- 2B
- 3A
- 3B
- 4A
- 4B
- 5A
- 5B
- 6A
- 6B

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
| `super_admin` | Super Admin SDIT Fajar | `superadmin@example.test` |
| `admin_sekolah` | Admin Sekolah | `admin@example.test` |
| `kepala_sekolah` | Kepala Sekolah | `kepsek@example.test` |
| `guru` | Ustadz Ahmad | `guru@example.test` |
| `wali_kelas` | Ustadzah Siti | `walikelas@example.test` |
| `siswa` | Ahmad Fajar | `siswa@example.test` |
| `orang_tua` | Bapak Wali Ahmad | `ortu@example.test` |

## Data Demo Akademik
- Tahun ajaran aktif: 2026/2027.
- Semester aktif: Semester 1.
- Kelas demo: 4A.
- Wali kelas demo: Ustadzah Siti.
- Guru Matematika demo: Ustadz Ahmad.
- Siswa demo: Ahmad Fajar.
- Orang tua demo: Bapak Wali Ahmad.

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
Karena payment belum aktif, data demo harus berstatus `draft`.

Invoice contoh:
- SPP Juli 2026, status `draft`.
- Daftar Ulang 2026/2027, status `draft`.

## Larangan Seed Data
- Jangan memakai data pribadi asli siswa/guru/orang tua.
- Jangan menyimpan password asli di dokumentasi.
- Jangan menyimpan Midtrans key asli di seed.
