# Roadmap Pengembangan

Urutan dibuat untuk mengurangi token terbuang, menjaga dependency jelas, dan memungkinkan setiap fase diverifikasi sebelum fase berikutnya.

## Fase 0 - Dokumentasi dan Kontrak
Target:
- finalisasi role `super_admin`, `admin_sekolah`, `kepala_sekolah`, `guru`, `wali_kelas`, `murid`, `wali_murid`;
- finalisasi route, schema, RLS, API contract, env, dan acceptance criteria;
- pastikan halaman publik tanpa login dan internal protected.

Deliverable:
- docs konsisten;
- `USER_ROLES` dan redirect map final;
- checklist dependency per fitur.

## Fase 1 - Frontend Website Publik
Target:
- landing page, profil, berita, kontak, pendaftaran, marketplace katalog;
- claymorphism, bento grid, responsive, Bahasa Indonesia;
- English content option pada halaman publik terpilih.

Deliverable:
- semua halaman publik dapat dibuka guest;
- loading/empty/error/accessibility state;
- form pendaftaran dengan upload preview.

## Fase 2 - Setup Supabase, Auth, dan Storage
Target:
- Supabase Auth, Database, Storage, Realtime;
- login NIS murid dan identifier wali murid;
- password awal berbasis biodata serta force change;
- bucket dan policy upload.

Deliverable:
- session/middleware/role guard;
- URL/path upload tersimpan di tabel;
- secret hanya server.

## Fase 3 - Database, Relasi, dan RLS
Target:
- migrations, enum, index, tabel, relasi;
- RLS profiles, akademik, pendaftaran, attendance, chat, marketplace, payment;
- helper authorization dan audit log.

Deliverable:
- migration dapat dijalankan ulang dengan aman;
- policy diuji untuk semua role dan relasi;
- seed development tanpa data pribadi asli.

## Fase 4 - Admin Akademik dan Import
Target:
- user, siswa, guru, wali murid, kelas, rombel, mapel;
- tahun ajaran, semester, bulan/tahun aktif;
- import CSV super admin dan template.

Deliverable:
- CRUD admin;
- preview/error per baris CSV;
- batch import dan audit log.

## Fase 5 - LMS dan Absensi
Target:
- materi, tugas, submission, nilai, jadwal;
- absensi guru 07.30/14.30 hari kerja;
- weekend guru opsional oleh kepala sekolah;
- absensi siswa per jadwal Senin-Jumat.

Deliverable:
- dashboard role;
- rekap akademik dan attendance;
- validasi server time dan relasi.

## Fase 6 - Pengumuman, Chat, dan Marketplace
Target:
- pengumuman super admin ke semua user/role;
- chat real-time internal berbasis thread;
- katalog, order, dan akses file marketplace.

Deliverable:
- Realtime tunduk pada RLS;
- hanya anggota thread dapat chat;
- file digital hanya tersedia setelah pembayaran valid.

## Fase 7 - Payment Midtrans
Target:
- konfigurasi provider oleh super admin;
- invoice oleh admin sekolah;
- SPP, iuran, pendaftaran semester, marketplace, dan tagihan lain;
- pembayaran hanya wali murid;
- webhook dan receipt.

Deliverable:
- sandbox end-to-end;
- production checklist;
- receipt lengkap dan terlindungi;
- aktivasi global tercatat di audit log.

## Fase 8 - Hardening dan Go-live
Target:
- lint, typecheck, build, RLS review, performance, backup, monitoring;
- uji role, upload, import, attendance, chat, marketplace, payment, dan public SEO.

Deliverable:
- acceptance criteria lulus;
- smoke test staging/production;
- rollback plan dan changelog migration;
- payment hanya live setelah persetujuan super admin.
