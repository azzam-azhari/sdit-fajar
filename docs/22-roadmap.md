# Roadmap Pengembangan

## Fase 0 - Rapikan Fondasi
Target:
- dokumentasi final di folder `docs/`;
- role lowercase di constants/types;
- env example lengkap;
- auth dan redirect role stabil;
- layout dashboard siap.

Deliverable:
- `USER_ROLES` final;
- `ROLE_DASHBOARD_PATH` final;
- dashboard shell;
- role guard awal.

## Fase 1 - Admin Akademik
Target:
- tahun ajaran;
- semester;
- kelas;
- rombel;
- mapel;
- guru;
- siswa;
- orang tua;
- relasi orang tua-siswa;
- relasi guru-mapel-kelas.

Deliverable:
- CRUD admin sekolah;
- validasi Zod;
- RLS awal;
- seed data.

## Fase 2 - LMS Guru & Siswa
Target:
- materi;
- tugas;
- pengumpulan tugas;
- penilaian;
- dashboard siswa;
- dashboard guru.

Deliverable:
- materi published/draft;
- tugas published/draft/closed;
- upload file akademik;
- nilai submission.

## Fase 3 - Wali Kelas & Orang Tua
Target:
- dashboard wali kelas;
- dashboard orang tua;
- monitoring tugas dan nilai anak;
- pengumuman kelas.

Deliverable:
- akses berbasis relasi;
- orang tua melihat data anak;
- wali kelas monitoring kelas binaan.

## Fase 4 - Kepala Sekolah & Laporan
Target:
- dashboard kepala sekolah;
- laporan per kelas;
- aktivitas guru;
- progres tugas;
- ringkasan nilai.

Deliverable:
- chart Recharts;
- filter tahun ajaran/semester;
- export sederhana opsional.

## Fase 5 - Payment Setup
Target:
- payment settings;
- draft invoice SPP;
- draft invoice daftar ulang;
- Midtrans env;
- webhook skeleton.

Deliverable:
- setup siap tetapi disabled;
- dokumentasi go-live payment;
- tidak ada transaksi aktif.

## Fase 6 - Hardening
Target:
- audit log;
- RLS review;
- testing role;
- performance;
- backup;
- monitoring.

Deliverable:
- checklist security;
- smoke test;
- production readiness.
