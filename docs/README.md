# Dokumentasi LMS SDIT Fajar

Folder ini adalah sumber kebenaran untuk vibe coding web LMS SDIT Fajar.
Agent wajib membaca dokumen ini sebelum membuat fitur, mengubah database, membuat route, atau mengubah desain.

## Tujuan Dokumentasi
- Mengurangi halusinasi agent.
- Menjaga standar produk LMS sekolah dasar.
- Menjaga konsistensi role, database, halaman, backend, frontend, dan UI.
- Menjadi acuan pengembangan bertahap dari website profil sekolah menjadi LMS sekolah.

## Urutan Baca Wajib untuk Agent
1. `99-agent-instructions.md`
2. `00-ringkasan-produk.md`
3. `01-role-permission.md`
4. `02-daftar-fitur-scope.md`
5. `03-daftar-halaman.md`
6. `04-tampilan-frontend.md`
7. `08-skema-database-supabase.md`
8. `10-backend.md`
9. `19-testing-acceptance-criteria.md`

## Standar Utama Produk
- Web LMS untuk SDIT Fajar berbasis Next.js App Router, TypeScript, Supabase, Tailwind CSS, dan Shadcn UI.
- Bahasa UI utama adalah Bahasa Indonesia.
- Role database wajib lowercase snake_case.
- Tema visual menggunakan claymorphism, bento grid, rounded besar, shadow lembut, dan primary biru cerah.
- Payment Midtrans tersedia sebagai fitur operasional terkontrol; aktivasi global hanya oleh `super_admin`, sedangkan pembayaran hanya oleh `wali_murid`.
- Halaman publik dapat diakses tanpa login; seluruh route internal wajib login.
- Semua upload harus memiliki URL/path yang disimpan di tabel terkait.

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
- `13-payment-midtrans-setup.md`: konfigurasi, aktivasi, transaksi, webhook, dan receipt Midtrans.
- `14-storage-upload.md`: bucket, upload, file validation.
- `15-konten-publik-sekolah.md`: landing page, profil sekolah, berita, galeri.
- `16-lms-akademik.md`: materi, tugas, nilai, jadwal, progres.
- `17-notifikasi-pengumuman.md`: pengumuman, notifikasi, dan chat internal real-time.
- `18-seed-data.md`: data awal role, kelas, mapel, user demo.
- `19-testing-acceptance-criteria.md`: checklist selesai fitur.
- `20-env-deployment.md`: environment variable dan deployment.
- `21-standar-kode.md`: struktur folder, naming, lint, TypeScript.
- `22-roadmap.md`: fase frontend, Supabase, database/RLS, fitur, payment, dan hardening.
- `99-agent-instructions.md`: instruksi keras untuk coding agent.
