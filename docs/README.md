# Dokumentasi LMS SDIT Fajar

Folder ini adalah sumber kebenaran untuk vibe coding web LMS SDIT Fajar.
Agent wajib membaca dokumen ini sebelum membuat fitur, mengubah database, membuat route, atau mengubah desain.

## Tujuan Dokumentasi
- Mengurangi halusinasi agent.
- Menjaga standar produk LMS sekolah dasar.
- Menjaga konsistensi role, database, halaman, backend, frontend, dan UI.
- Menjadi acuan pengembangan bertahap dari website profil sekolah menjadi LMS sekolah.

## Urutan Baca Wajib untuk Agent
1. `00-ringkasan-produk.md`
2. `01-role-permission.md`
3. `02-daftar-fitur-scope.md`
4. `03-daftar-halaman.md`
5. `04-tampilan-frontend.md`
6. `06-alur-pengguna.md`
7. `07-alur-database.md`
8. `08-skema-database-supabase.md`
9. `10-backend.md`
10. `99-agent-instructions.md`

## Standar Utama Produk
- Web LMS untuk SDIT Fajar berbasis Next.js App Router, TypeScript, Supabase, Tailwind CSS, dan Shadcn UI.
- Bahasa UI utama adalah Bahasa Indonesia.
- Role database wajib lowercase snake_case.
- Tema visual menggunakan claymorphism, bento grid, rounded besar, shadow lembut, dan primary biru cerah.
- Payment SPP dan daftar ulang dengan Midtrans disiapkan sebagai pondasi, tetapi belum diaktifkan sebagai fitur operasional.

## Daftar File
- `00-ringkasan-produk.md`: visi produk, target pengguna, prinsip produk.
- `01-role-permission.md`: role lowercase, hak akses, matrix permission.
- `02-daftar-fitur-scope.md`: MVP, backlog, dan fitur yang dilarang dibuat sekarang.
- `03-daftar-halaman.md`: route publik, auth, dashboard, LMS, pembayaran.
- `04-tampilan-frontend.md`: tema claymorphism, bento grid, warna, layout.
- `05-komponen-ui.md`: standar komponen reusable.
- `06-alur-pengguna.md`: flow utama per role.
- `07-alur-database.md`: alur data dan relasi antar modul.
- `08-skema-database-supabase.md`: tabel, kolom, enum, relasi.
- `09-rls-dan-keamanan-data.md`: RLS, policy, akses data.
- `10-backend.md`: pola backend, server action, route handler, validasi.
- `11-api-contract.md`: kontrak API internal.
- `12-auth-session.md`: auth, session, redirect, protected route.
- `13-payment-midtrans-setup.md`: setup Midtrans nonaktif untuk SPP dan daftar ulang.
- `14-storage-upload.md`: bucket, upload, file validation.
- `15-konten-publik-sekolah.md`: landing page, profil sekolah, berita, galeri.
- `16-lms-akademik.md`: materi, tugas, nilai, jadwal, progres.
- `17-notifikasi-pengumuman.md`: pengumuman dan notifikasi internal.
- `18-seed-data.md`: data awal role, kelas, mapel, user demo.
- `19-testing-acceptance-criteria.md`: checklist selesai fitur.
- `20-env-deployment.md`: environment variable dan deployment.
- `21-standar-kode.md`: struktur folder, naming, lint, TypeScript.
- `22-roadmap.md`: urutan pengembangan yang disarankan.
- `99-agent-instructions.md`: instruksi keras untuk coding agent.
