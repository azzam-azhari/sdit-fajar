# Rencana Eksekusi Pembangunan LMS SDIT Fajar

## Status Awal

- Repository saat ini berisi dokumentasi dan belum memiliki aplikasi Next.js, `package.json`, source code, migration Supabase, atau konfigurasi deployment.
- Dokumen ini menjadi urutan kerja operasional. Sumber kebenaran produk tetap berada di folder `docs/`.
- Pengerjaan wajib berurutan. Fase berikutnya tidak dimulai sebelum gate fase sebelumnya lulus.
- Jika implementasi membutuhkan role, route, tabel, kolom, enum, bucket, atau environment baru, dokumentasi terkait wajib diperbarui lebih dahulu.

## Hasil Akhir yang Ditargetkan

Satu aplikasi web LMS SDIT Fajar yang mencakup:

- website publik tanpa login;
- pendaftaran murid baru;
- autentikasi dan dashboard internal untuk tujuh role final;
- administrasi user dan data akademik;
- import CSV oleh `super_admin`;
- materi, tugas, pengumpulan, penilaian, jadwal, dan progres;
- absensi guru dan siswa sesuai aturan waktu sekolah;
- pengumuman dan chat real-time;
- marketplace konten pembelajaran;
- invoice dan pembayaran Midtrans yang hanya dimulai oleh `wali_murid`;
- receipt pembayaran yang terlindungi;
- keamanan RLS, audit log, pengujian, deployment, backup, dan monitoring.

## Aturan Eksekusi yang Tidak Boleh Dilanggar

1. Role database hanya:
   - `super_admin`;
   - `admin_sekolah`;
   - `kepala_sekolah`;
   - `guru`;
   - `wali_kelas`;
   - `murid`;
   - `wali_murid`.
2. Semua halaman publik dapat diakses tanpa login; seluruh `/dashboard/*` wajib login.
3. Keamanan tidak boleh bergantung pada menu tersembunyi atau validasi client. Setiap mutasi wajib memeriksa session, role, relasi data, validasi Zod, dan RLS.
4. `SUPABASE_SERVICE_ROLE_KEY` dan `MIDTRANS_SERVER_KEY` hanya boleh digunakan di server.
5. Setiap file/gambar yang berhasil diunggah wajib memiliki URL atau storage path pada tabel domain terkait.
6. Tema tetap claymorphism, bento grid, primary biru cerah, rounded besar, shadow lembut, dan Bahasa Indonesia.
7. Semua halaman data wajib memiliki loading, empty, error, success feedback/toast, breadcrumb, serta tampilan responsif.
8. Status payment `paid` hanya boleh berasal dari webhook Midtrans dengan signature valid dan proses idempotent.
9. Payment global hanya boleh diaktifkan oleh `super_admin` setelah environment, RLS, webhook, dan pengujian tervalidasi.
10. Jangan membuat fitur di luar scope seperti video conference, AI grading otomatis, presensi QR, payroll, inventaris, atau akuntansi penuh.

## Strategi Pengerjaan

- Kerjakan satu irisan fitur secara utuh: schema/RLS -> validasi -> server action/API -> UI -> state -> test -> dokumentasi.
- Gunakan data mock hanya untuk membangun tampilan. Jangan membuat API atau model sementara yang bertentangan dengan skema final.
- Prioritaskan Server Component untuk data awal dan React Query hanya untuk interaksi client yang memang membutuhkannya.
- Setiap akhir fase menjalankan lint, typecheck, test yang tersedia, dan build.
- Setiap perubahan sensitif harus menghasilkan audit log.
- Payment tetap `disabled` sampai Fase 7 dinyatakan lulus.

## Urutan Ketergantungan

```text
Fase 0 Dokumentasi dan kontrak
  -> Fase 1 Fondasi aplikasi dan frontend publik
  -> Fase 2 Supabase, auth, session, dan storage
  -> Fase 3 Database, relasi, RLS, dan seed
  -> Fase 4 Admin akademik, pendaftaran, konten, dan import
  -> Fase 5 Dashboard role, LMS, jadwal, nilai, dan absensi
  -> Fase 6 Pengumuman, chat, dan marketplace
  -> Fase 7 Payment Midtrans dan receipt
  -> Fase 8 Hardening, deployment, dan operasional
```

---

## Fase 0 - Finalisasi Dokumentasi dan Kontrak

### Tujuan

Menghilangkan ketidakjelasan sebelum membuat source code agar tidak terjadi route, schema, permission, atau flow yang saling bertentangan.

### Tahap Pengerjaan

- [ ] Jadikan `docs/00` sampai `docs/22`, `docs/99-agent-instructions.md`, dan `AGENTS.md` sebagai sumber kebenaran.
- [ ] Kunci konstanta tujuh role dan mapping redirect dashboard.
- [ ] Buat matriks route -> role -> data -> action -> tabel -> RLS -> acceptance test.
- [ ] Pastikan seluruh route yang akan dibuat sudah tercatat di `docs/03-daftar-halaman.md`.
- [ ] Pastikan seluruh tabel/kolom/enum/index sudah tercatat di `docs/08-skema-database-supabase.md`.
- [ ] Gunakan `classrooms.homeroom_teacher_id` untuk wali kelas; jangan menambah `homeroom_assignments` tanpa update docs.
- [ ] Tetapkan bahwa tabel `grades` dipakai setelah nilai submission dasar stabil; nilai tugas MVP berasal dari `assignment_submissions.score`.
- [ ] Tetapkan notifikasi MVP berasal dari pengumuman/data utama. Tabel `notifications` tidak dibuat sebelum skema final diperbarui.
- [ ] Identifikasi gap schema untuk galeri, FAQ, konten halaman publik, dan form kontak. Gunakan konten statis yang terdokumentasi sampai tabelnya resmi ditambahkan ke docs.
- [ ] Pastikan halaman admin payment hanya menampilkan kewenangannya: invoice dan flag modul yang telah diizinkan; konfigurasi provider dan aktivasi global tetap milik `super_admin`.
- [ ] Tetapkan format password awal murid dari data biodata: normalisasi `birth_place` + `ddmmyyyy`, dibuat server-side, di-hash oleh auth provider, dan wajib diganti saat login pertama.
- [ ] Definisikan template CSV, versi template, header, tipe data, aturan duplikasi, relasi, ukuran file, dan perilaku transaksi per entitas sebelum membuat import.
- [ ] Buat backlog per fase dan tandai setiap item dengan acceptance criteria terkait.

### Output

- Kontrak role, route, schema, permission, API, storage, env, dan acceptance criteria konsisten.
- Tidak ada keputusan implementasi penting yang hanya tersimpan di percakapan atau kode.

### Gate Fase 0

- [ ] Tidak ada role di luar daftar final.
- [ ] Tidak ada route rencana yang belum terdokumentasi.
- [ ] Tidak ada tabel/kolom rencana yang belum terdokumentasi.
- [ ] Semua gap memiliki keputusan: update docs terlebih dahulu atau tetap menjadi konten statis/TODO eksplisit.

---

## Fase 1 - Fondasi Aplikasi dan Frontend Website Publik

### Tujuan

Membuat aplikasi Next.js yang stabil, design system final, dan seluruh route publik dengan tampilan responsif. Integrasi data dinamis dilanjutkan setelah Supabase siap.

### 1.1 Bootstrap Proyek

- [ ] Inisialisasi Next.js App Router dengan TypeScript.
- [ ] Pasang dan konfigurasi Tailwind CSS, Shadcn UI/Radix, Lucide atau Hugeicons, React Hook Form, Zod, React Query, dan Recharts.
- [ ] Buat alias import `@/` dan struktur folder sesuai `docs/21-standar-kode.md`.
- [ ] Siapkan script `dev`, `lint`, `typecheck`, `test`, dan `build`.
- [ ] Buat `env.example` tanpa nilai secret dan pastikan `.env.local` diabaikan Git.
- [ ] Konfigurasi formatter/linter, error boundary, not-found, dan pola typed action result.

### 1.2 Design System

- [ ] Buat token warna final: primary, primary-dark, primary-soft, secondary, success, warning, danger, surface, dan text.
- [ ] Buat primitive clay card, bento card, button, input, select, modal, table, badge, skeleton, empty state, dan error state.
- [ ] Buat `PublicNavbar`, `PublicFooter`, floating WhatsApp, dan layout publik.
- [ ] Pastikan grid 1 kolom mobile, 2 kolom tablet, dan 12 kolom desktop.
- [ ] Pastikan aksesibilitas: label form, keyboard focus, kontras, alt text, dan status tidak bergantung pada warna saja.

### 1.3 Halaman Publik

- [ ] `/` dengan hero, CTA pendaftaran, berita, visi-misi, statistik, manajemen ringkas, testimoni, FAQ, dan preview marketplace.
- [ ] `/profil`.
- [ ] `/profil/sejarah`.
- [ ] `/profil/manajemen`.
- [ ] `/kurikulum`.
- [ ] `/ekstrakurikuler`.
- [ ] `/berita` dengan pagination UI.
- [ ] `/berita/[slug]`.
- [ ] `/kontak`.
- [ ] `/pendaftaran` dengan form dan preview upload; submit backend di Fase 4.
- [ ] `/marketplace` untuk katalog published; data dinamis di Fase 6.
- [ ] Dukungan Bahasa Inggris hanya untuk konten publik terpilih; Bahasa Indonesia tetap default.

### 1.4 Kualitas Frontend Publik

- [ ] Metadata SEO, Open Graph, canonical production, sitemap, dan robots.
- [ ] Navbar/footer responsif dan active link.
- [ ] Floating WhatsApp tidak menutupi aksi utama di mobile.
- [ ] Optimasi image, font, layout shift, dan performa awal.
- [ ] Test navigasi guest, responsive viewport, accessibility dasar, dan 404.

### Output

- Aplikasi dapat dijalankan lokal.
- Seluruh halaman publik tersedia tanpa login dan mengikuti tema final.
- Komponen reusable siap digunakan dashboard.

### Gate Fase 1

- [ ] `lint`, `typecheck`, dan `build` lulus.
- [ ] Route publik dapat dibuka tanpa session.
- [ ] Tidak ada secret atau data pribadi asli dalam source code.
- [ ] Tampilan mobile, tablet, dan desktop tervalidasi.

---

## Fase 2 - Setup Supabase, Auth, Session, dan Storage

### Tujuan

Menyiapkan platform backend dan fondasi autentikasi tanpa membuka akses internal secara tidak sah.

### 2.1 Project dan Environment Supabase

- [ ] Buat project Supabase development/staging.
- [ ] Isi env lokal: site URL, Supabase URL, anon key, dan service role key server-only.
- [ ] Buat browser client, server client, admin client, dan middleware/proxy session.
- [ ] Pastikan admin client tidak dapat diimport Client Component.
- [ ] Tambahkan endpoint health sesuai route yang telah didokumentasikan.

### 2.2 Auth dan Session

- [ ] Implementasikan `/login` dengan input `identifier` dan password.
- [ ] Implementasikan optional `/forgot-password` dan `/reset-password` hanya bila dipilih dari route docs.
- [ ] Buat `requireUser`, `requireRole`, `getCurrentProfile`, permission helper, dan redirect map.
- [ ] Lindungi semua `/dashboard/*`; guest diarahkan ke `/login`.
- [ ] Jadikan `/login` guest-only; user aktif diarahkan ke dashboard rolenya.
- [ ] Tolak user dengan `profiles.is_active = false`.
- [ ] Implementasikan login murid memakai NIS sebagai `login_identifier`.
- [ ] Buat akun wali murid terpisah dengan identifier sendiri, bukan kredensial anak.
- [ ] Buat password awal murid di server dari tempat lahir + tanggal lahir `ddmmyyyy`.
- [ ] Set `must_change_password = true` dan wajibkan pergantian password pada login pertama.
- [ ] Jangan pernah menyimpan atau mencatat password awal dalam plaintext.

### 2.3 Storage

- [ ] Buat bucket `images`, `lms-files`, `registration-files`, dan `marketplace-files`; `payment-files` hanya digunakan sesuai scope terdokumentasi.
- [ ] Tetapkan bucket akademik, pendaftaran, marketplace, dan payment sebagai private.
- [ ] Implementasikan validasi MIME, extension, ukuran, nama file, dan path di client serta server.
- [ ] Tolak file executable/script dan file tanpa extension.
- [ ] Buat signed URL berumur pendek setelah authorization.
- [ ] Buat strategi replace file: simpan file baru dan referensinya lebih dahulu, lalu hapus file lama dengan aman.
- [ ] Siapkan pencatatan URL/path ke tabel domain; upload belum dianggap berhasil sebelum pencatatan database berhasil.

### Output

- Koneksi Supabase terpisah dengan benar untuk browser, server, dan admin.
- Auth/session/guard dasar tersedia.
- Bucket dan policy storage siap digunakan.

### Gate Fase 2

- [ ] Guest tidak dapat membuka dashboard.
- [ ] User tidak dapat membuka dashboard role lain.
- [ ] Secret tidak masuk bundle client.
- [ ] File invalid/terlalu besar ditolak server.
- [ ] File private tidak dapat dibuka tanpa signed URL dan relasi yang sah.

---

## Fase 3 - Database, Relasi, RLS, Audit, dan Seed

### Tujuan

Membangun seluruh sumber data resmi dengan migration yang dapat diaudit dan policy yang mencegah kebocoran antar-user.

### 3.1 Migration Dasar

- [ ] Buat migration enum final sesuai `docs/08-skema-database-supabase.md`.
- [ ] Buat tabel secara berurutan berdasarkan foreign key:
  1. `profiles`, `school_settings`;
  2. `academic_years`, `semesters`, `school_period_settings`;
  3. `students`, `parents`, `teachers`, `parent_students`;
  4. `classes`, `classrooms`, `class_students`, `subjects`, `teaching_assignments`, `schedules`;
  5. pendaftaran dan dokumennya;
  6. attendance;
  7. materials, assignments, submissions, grades;
  8. announcements dan news;
  9. chat;
  10. marketplace;
  11. payment;
  12. audit dan import batches.
- [ ] Tambahkan foreign key, unique constraint, check constraint, default, timestamp, dan index yang didokumentasikan.
- [ ] Tambahkan trigger profile dari Auth serta trigger `updated_at` bila digunakan.
- [ ] Pastikan migration dapat dijalankan pada database kosong dan memiliki strategi rollback/forward-fix.

### 3.2 RLS dan Authorization

- [ ] Aktifkan RLS pada seluruh tabel internal.
- [ ] Buat helper `current_profile_id()` dan `current_user_role()` secara aman.
- [ ] Policy profile mencegah user mengubah role sendiri dan mencegah admin sekolah mengubah super admin.
- [ ] Policy siswa/wali murid memakai relasi `parent_students`.
- [ ] Policy guru memakai `teaching_assignments`; policy wali kelas memakai `classrooms.homeroom_teacher_id`.
- [ ] Policy materi/tugas/nilai/submission membatasi kelas, mapel, pemilik, dan status publish.
- [ ] Policy pendaftaran, dokumen, dan import melindungi data/file sensitif.
- [ ] Policy attendance memeriksa role/relasi; aturan hari dan waktu tetap divalidasi server.
- [ ] Policy chat hanya memberi akses kepada anggota thread.
- [ ] Policy marketplace membatasi order dan file pada pemilik yang telah membayar.
- [ ] Policy payment membatasi invoice/transaction/receipt pada wali murid terkait serta role administratif yang sah.
- [ ] Policy konten publik hanya mengizinkan guest membaca data published.

### 3.3 Audit dan Seed

- [ ] Buat helper audit log untuk seluruh mutasi sensitif yang diwajibkan docs.
- [ ] Seed tahun ajaran 2026/2027, semester, kelas 1-6, mapel, dan ekstrakurikuler sesuai docs.
- [ ] Seed akun demo tujuh role dengan domain development dan tanpa data pribadi nyata.
- [ ] Seed relasi guru-kelas-mapel, wali kelas, siswa-wali, materi, tugas, invoice sandbox, dan attendance hari kerja.
- [ ] Jangan menaruh password atau key asli di migration/seed.

### 3.4 Pengujian RLS

- [ ] Uji guest, setiap role, user nonaktif, relasi anak salah, kelas salah, mapel salah, dan thread non-member.
- [ ] Uji baca, buat, ubah, hapus pada setiap tabel sesuai matrix permission.
- [ ] Uji percobaan akses langsung ke database/API, bukan hanya melalui UI.

### Output

- Schema lengkap, migration versioned, policy RLS, index, audit helper, dan seed development.

### Gate Fase 3

- [ ] Migration database kosong berhasil.
- [ ] Semua tabel internal memiliki RLS.
- [ ] Test negatif membuktikan data lintas anak/kelas/thread/invoice tidak bocor.
- [ ] Seed hanya memakai data demo.
- [ ] Schema implementasi sama dengan dokumentasi.

---

## Fase 4 - Admin Akademik, Pendaftaran, Konten Publik, dan Import CSV

### Tujuan

Memberikan data master yang valid untuk seluruh modul LMS berikutnya.

### 4.1 Dashboard Shell dan Manajemen User

- [ ] Buat `DashboardShell`, sidebar berbasis role, topbar, avatar, breadcrumb, dan mobile menu.
- [ ] Buat dashboard awal `super_admin` dan `admin_sekolah`.
- [ ] Implementasikan CRUD user dengan admin client server-only.
- [ ] Cegah `admin_sekolah` membuat/mengubah/menghapus `super_admin`.
- [ ] Implementasikan aktif/nonaktif user, reset kredensial yang aman, dan audit log.
- [ ] Implementasikan pengelolaan assignment role final tanpa membuat role baru.

### 4.2 Data Master Akademik

- [ ] CRUD tahun ajaran dan semester dengan aturan periode aktif.
- [ ] CRUD bulan/tahun aktif operasional pada `school_period_settings`.
- [ ] CRUD kelas, rombel, mapel, siswa, guru, dan wali murid.
- [ ] Kelola relasi siswa-rombel, wali murid-anak, guru-mapel-rombel, dan wali kelas.
- [ ] Validasi seluruh input dengan Zod dan tampilkan error per field.
- [ ] Tampilkan search, filter, sorting, pagination, row action, dan empty state pada tabel.

### 4.3 Pendaftaran Murid Baru

- [ ] Hubungkan form publik `/pendaftaran` ke server action/endpoint terbatas.
- [ ] Validasi biodata dan dokumen di server.
- [ ] Simpan application sebelum/bersama dokumen secara konsisten.
- [ ] Simpan `file_url`/`file_path` dan metadata setiap dokumen.
- [ ] Berikan status submitted, review, approved, atau rejected sesuai enum.
- [ ] Saat approved, super admin membuat akun murid dan akun wali murid terpisah beserta relasinya.
- [ ] Set password awal murid dan `must_change_password` tanpa menyimpan plaintext.

### 4.4 Import CSV Super Admin

- [ ] Sediakan template CSV resmi yang dapat diunduh dari route terdokumentasi.
- [ ] Dukung entitas yang sudah didefinisikan, dimulai dari siswa, guru, wali murid, kelas, dan relasi.
- [ ] Validasi encoding, header/version, ukuran, tipe, enum role, duplikasi, dan foreign key di server.
- [ ] Tampilkan preview serta error per baris sebelum commit.
- [ ] Commit hanya setelah validasi penuh dan gunakan transaksi agar baris invalid tidak ikut tersimpan.
- [ ] Simpan file sumber private, URL/path, jumlah sukses/gagal, error, dan `import_batches`.
- [ ] Catat audit log dan jangan mengekspos detail error database ke user.

### 4.5 Konten Publik Operasional

- [ ] Hubungkan `school_settings` dan pastikan hanya `super_admin` dapat mengubah identitas/kontak utama.
- [ ] Admin sekolah mengelola berita dan konten publik operasional yang telah memiliki model data resmi.
- [ ] Berita draft tidak tampil ke guest; published dapat dibuka via slug dan pagination.
- [ ] Simpan cover URL/path saat upload.
- [ ] Galeri/FAQ/konten dinamis lain tetap statis sampai schema resminya ditambahkan ke docs dan migration.

### Output

- Data master, relasi, pendaftaran, konten publik, dan import siap dipakai modul LMS.

### Gate Fase 4

- [ ] CRUD mengikuti role guard dan RLS.
- [ ] Pendaftaran guest tidak membuka akses baca data pendaftar lain.
- [ ] Semua upload memiliki referensi database.
- [ ] Import invalid tidak melakukan partial commit dan hasilnya tercatat.
- [ ] Admin sekolah tidak dapat mengubah identitas utama atau super admin.

---

## Fase 5 - Dashboard Role, LMS, Jadwal, Nilai, dan Absensi

### Tujuan

Menyelesaikan fungsi akademik inti dari guru sampai murid, wali kelas, kepala sekolah, dan wali murid.

### 5.1 Dashboard Per Role

- [ ] Dashboard kepala sekolah: total siswa/guru, aktivitas, penyelesaian tugas, laporan kelas, dan attendance.
- [ ] Dashboard guru: kelas/mapel, jadwal, materi, tugas aktif, dan submission perlu dinilai.
- [ ] Dashboard wali kelas: siswa binaan, tugas, nilai, progres, pengumuman, dan attendance.
- [ ] Dashboard murid: jadwal hari ini, materi, tugas, nilai, pengumuman, dan attendance sendiri.
- [ ] Dashboard wali murid: pilihan anak, tugas, materi, nilai, pengumuman, attendance, dan status payment saat fitur aktif.
- [ ] Semua card aman ketika data kosong dan semua query difilter menurut role/relasi.

### 5.2 Materi

- [ ] Guru/wali kelas yang memiliki assignment mengajar dapat CRUD materi untuk kelas/mapelnya.
- [ ] Dukung teks, file, dan external URL; simpan URL/path upload.
- [ ] Draft hanya terlihat role berwenang; published terlihat siswa kelas terkait dan wali murid terkait.
- [ ] Sediakan list, detail/edit, filter kelas/mapel/status, loading, empty, error, dan toast.

### 5.3 Tugas, Submission, dan Nilai

- [ ] Guru membuat tugas untuk assignment mengajarnya dengan deadline, max score, late rule, dan status.
- [ ] Validasi deadline publish dan score di server.
- [ ] Murid hanya melihat tugas kelasnya dan hanya mengirim submission miliknya.
- [ ] Terapkan satu submission per murid per tugas.
- [ ] Status `late` ditentukan server berdasarkan deadline; submission ditolak bila late tidak diizinkan.
- [ ] Guru melihat pengumpulan tugasnya dan memberi nilai/feedback.
- [ ] Murid hanya melihat nilainya; wali murid hanya nilai anak; wali kelas dan kepala sekolah mengikuti permission.
- [ ] Gunakan score submission untuk MVP, lalu aktifkan gradebook `grades` untuk rekap semester sesuai kebutuhan terdokumentasi.

### 5.4 Jadwal dan Absensi

- [ ] Admin membuat jadwal kelas/mapel/guru pada periode aktif.
- [ ] Guru melihat jadwal mengajar; siswa/wali murid melihat jadwal kelas/anak.
- [ ] Absensi guru menyediakan sesi check-in 07.30 dan check-out 14.30 Senin-Jumat.
- [ ] Gunakan waktu server sebagai sumber kebenaran dan cegah duplikasi tanggal+sesi.
- [ ] Weekend guru tertutup secara default dan hanya kepala sekolah dapat mengubah flag periode aktif.
- [ ] Absensi siswa dibuat per jadwal pelajaran Senin-Jumat.
- [ ] Tolak absensi siswa Sabtu-Minggu di server, walaupun request dikirim langsung.
- [ ] Guru hanya mencatat kelas/mapel assignment; wali kelas hanya kelas binaannya.
- [ ] Buat rekap guru/siswa sesuai role, termasuk kebutuhan rekap bulanan kepala sekolah.

### Output

- Siklus akademik materi -> tugas -> submission -> nilai berjalan end-to-end.
- Jadwal dan attendance mengikuti periode, hari, waktu server, dan relasi.

### Gate Fase 5

- [ ] Acceptance materi dan tugas lulus untuk draft/published/kelas lain.
- [ ] Tidak ada siswa yang dapat membaca submission/nilai siswa lain.
- [ ] Guru tidak dapat mengelola kelas/mapel di luar assignment.
- [ ] Aturan 07.30/14.30 dan larangan weekend siswa teruji di server.
- [ ] Dashboard tujuh role memiliki state lengkap dan tidak error saat data kosong.

---

## Fase 6 - Pengumuman, Chat Real-time, dan Marketplace

### Tujuan

Menambahkan komunikasi resmi, komunikasi internal real-time, dan katalog konten tanpa melemahkan RLS.

### 6.1 Pengumuman

- [ ] Super admin dapat menargetkan semua user atau role tertentu.
- [ ] Admin/kepala sekolah/guru/wali kelas hanya menargetkan audience sesuai permission.
- [ ] Simpan target eksplisit: all, role, class, atau student.
- [ ] Draft tidak tampil kepada audience; published muncul di dashboard terkait.
- [ ] Validasi target di server dan catat audit log.

### 6.2 Chat Real-time

- [ ] Buat list thread dan detail thread pada route terdokumentasi.
- [ ] Hanya user login yang dapat membuka chat.
- [ ] Hanya anggota `chat_thread_members` yang dapat membaca dan mengirim pesan.
- [ ] Ambil `sender_id` dari session, bukan input client.
- [ ] Simpan pesan ke database sebelum event Realtime menjadi tampilan sumber baru.
- [ ] Subscription harus tunduk pada RLS dan dibersihkan saat pindah thread/logout.
- [ ] Sediakan empty, reconnect/error, loading history, composer validation, dan indikator terkirim.

### 6.3 Marketplace

- [ ] Admin/super admin mengelola produk sesuai permission.
- [ ] Katalog hanya menampilkan produk published kepada guest.
- [ ] Simpan cover dan file digital sebagai URL/path; file digital tetap private.
- [ ] Checkout hanya tersedia setelah login sebagai `wali_murid`.
- [ ] Wali murid memilih anak bila dibutuhkan dan hanya membuat order miliknya.
- [ ] Buat order dan item menggunakan snapshot harga server, bukan total dari client.
- [ ] Hubungkan order ke invoice marketplace.
- [ ] Jangan berikan signed URL file sampai transaksi valid berstatus paid.

### Output

- Pengumuman tepat sasaran, chat real-time terlindungi membership, dan marketplace siap dihubungkan ke payment.

### Gate Fase 6

- [ ] Non-member tidak dapat membaca/mengirim pesan lewat UI maupun request langsung.
- [ ] Realtime tidak menjadi bypass RLS.
- [ ] Role selain `wali_murid` tidak dapat checkout.
- [ ] Guest hanya melihat produk published.
- [ ] File digital tidak dapat diakses sebelum payment valid.

---

## Fase 7 - Payment Midtrans Terkontrol dan Receipt

### Tujuan

Mengaktifkan pembayaran secara aman setelah semua relasi wali-anak, invoice, storage, dan security guard stabil.

### 7.1 Prasyarat Mutlak

- [ ] `PAYMENT_ENABLED=false` selama development awal.
- [ ] Gunakan Midtrans sandbox.
- [ ] Pastikan `MIDTRANS_SERVER_KEY` hanya tersedia di environment server.
- [ ] Pastikan config database tidak menyimpan server key.
- [ ] Selesaikan test RLS invoice, transaction, receipt, parent-child, dan marketplace order.

### 7.2 Konfigurasi dan Invoice

- [ ] Super admin mengelola provider, environment, merchant ID, client key, logo, dan aktivasi global.
- [ ] Admin sekolah hanya mengelola invoice dan flag modul yang telah diizinkan global.
- [ ] Admin CRUD invoice SPP, iuran ekstrakurikuler, pendaftaran semester ganjil/genap, marketplace, dan jenis lainnya.
- [ ] Validasi bulan/tahun aktif, student/parent, nominal, jatuh tempo, jenis, dan reminder offsets.
- [ ] Catat semua perubahan setting dan invoice dalam audit log.

### 7.3 Pembuatan Transaksi

- [ ] Endpoint/action transaksi hanya menerima session role `wali_murid`.
- [ ] Validasi relasi wali-anak, invoice bukan draft, status belum paid, dan belum ada transaksi aktif.
- [ ] Validasi seluruh flag: env, global database, dan modul terkait.
- [ ] Buat order ID, nominal, deskripsi, dan customer reference di server.
- [ ] Jangan percaya nominal, status, parent ID, atau order ID dari client.
- [ ] Simpan Snap token/redirect URL dan status pending secara aman.

### 7.4 Webhook Midtrans

- [ ] Buat `POST /api/midtrans/webhook`.
- [ ] Verifikasi signature menggunakan server key.
- [ ] Cocokkan order ID dan gross amount dengan data server.
- [ ] Terapkan idempotensi untuk callback duplikat.
- [ ] Validasi transition status dan tolak perubahan tidak sah.
- [ ] Hanya callback valid yang dapat mengubah status menjadi `paid`.
- [ ] Simpan payload dengan perlindungan data sensitif dan catat audit log.

### 7.5 Receipt dan Riwayat

- [ ] Buat snapshot receipt server-side setelah payment valid.
- [ ] Receipt memuat logo sekolah/Midtrans, waktu, invoice, siswa, kelas, nominal, status, dan data bank bila memang tersedia.
- [ ] Jangan menebak data bank yang tidak dikirim provider; simpan `null`.
- [ ] Wali murid melihat riwayat semua pembayaran anak yang terhubung dalam tabel.
- [ ] Receipt hanya dapat dibuka/diunduh wali murid terkait dan dapat dibuka di tab baru.
- [ ] Uji bahwa akun wali murid lain, siswa, guru, dan guest menerima penolakan.

### 7.6 Gate Aktivasi Production

- [ ] Sandbox end-to-end berhasil untuk success, pending, failed, expired, cancelled, duplicate callback, invalid signature, dan nominal mismatch.
- [ ] Environment production lengkap dan diperiksa tanpa mencetak secret.
- [ ] URL webhook production HTTPS benar.
- [ ] RLS dan server guard direview ulang.
- [ ] Backup, monitoring error, dan prosedur rollback tersedia.
- [ ] `super_admin` menyetujui dan mengaktifkan global payment.

### Output

- Invoice, transaksi sandbox, webhook, riwayat, dan receipt berjalan end-to-end dengan aktivasi production terkunci.

### Gate Fase 7

- [ ] Role selain `wali_murid` tidak dapat memulai pembayaran.
- [ ] Tombol bayar mati jika salah satu flag false.
- [ ] Webhook invalid/duplikat tidak mengubah data secara salah.
- [ ] Receipt tidak bocor ke wali murid lain.
- [ ] Secret tidak berada di client, database, log, atau repository.

---

## Fase 8 - Hardening, UAT, Deployment, dan Operasional

### Tujuan

Memastikan seluruh fitur aman, stabil, dapat dipulihkan, dan siap digunakan sekolah.

### 8.1 Quality Gate Otomatis

- [ ] `npm run lint` lulus.
- [ ] `npm run typecheck` lulus.
- [ ] Unit test validasi, permission helper, attendance rule, dan payment state transition lulus.
- [ ] Integration test server action/API/RLS lulus.
- [ ] End-to-end test flow kritis lulus.
- [ ] `npm run build` lulus tanpa TypeScript error.

### 8.2 Security dan Data Review

- [ ] Audit env dan bundle untuk memastikan tidak ada secret client.
- [ ] Uji IDOR pada student, submission, grade, thread, invoice, receipt, dan file.
- [ ] Uji semua role dengan request langsung dan session salah.
- [ ] Review RLS seluruh tabel internal dan storage bucket.
- [ ] Uji rate/abuse protection pada login, pendaftaran, upload, chat, import, dan webhook sesuai kebutuhan.
- [ ] Pastikan error user aman dan detail teknis hanya masuk server log.
- [ ] Pastikan audit log tersedia untuk aksi sensitif.

### 8.3 UAT Berdasarkan Role

- [ ] `super_admin`: user, role final, settings, audit, import, pengumuman, dan payment global.
- [ ] `admin_sekolah`: master akademik, konten operasional, periode, invoice, dan laporan.
- [ ] `kepala_sekolah`: laporan read-only, monitoring, rekap, dan weekend attendance.
- [ ] `guru`: kelas/mapel sendiri, materi, tugas, submission, nilai, dan attendance.
- [ ] `wali_kelas`: kelas binaan, progres, pengumuman, dan attendance kelas.
- [ ] `murid`: login NIS, ganti password pertama, materi, tugas, nilai, jadwal, dan attendance sendiri.
- [ ] `wali_murid`: anak terhubung, progres, payment, marketplace, dan receipt.
- [ ] Guest: seluruh halaman publik, berita, pendaftaran, dan katalog published tanpa akses internal.

### 8.4 Uji Nonfungsional

- [ ] Responsif pada mobile/tablet/desktop.
- [ ] Accessibility keyboard, label, focus, kontras, dan screen reader dasar.
- [ ] SEO halaman publik, metadata, sitemap, robots, dan canonical.
- [ ] Performa query/index, pagination, image, dan bundle.
- [ ] Kondisi jaringan lambat, data kosong, error server, dan retry.

### 8.5 Staging dan Production

- [ ] Siapkan environment staging terpisah dan jalankan migration.
- [ ] Buat bucket/policy, seed demo, dan smoke test staging.
- [ ] Backup database dan storage sebelum production migration.
- [ ] Jalankan migration production dan verifikasi schema version.
- [ ] Isi env production dan domain/site URL.
- [ ] Jalankan smoke test public, login semua role, dashboard, upload, pendaftaran, import, LMS, attendance, chat, marketplace, dan receipt.
- [ ] Pertahankan payment disabled sampai checklist Fase 7 dan persetujuan super admin selesai.
- [ ] Siapkan rollback plan, forward-fix migration, dan changelog release.

### 8.6 Operasional Setelah Go-live

- [ ] Aktifkan monitoring error runtime dan endpoint health.
- [ ] Pantau audit log, webhook failure, storage orphan, dan job pengingat bila tersedia.
- [ ] Jadwalkan backup database/storage serta uji restore.
- [ ] Review dependency dan security patch berkala.
- [ ] Catat bug, keputusan scope, perubahan route/schema/env, dan release notes.
- [ ] Lakukan evaluasi pasca-rilis tanpa menambah scope diam-diam.

### Output

- Aplikasi production yang telah melewati acceptance criteria, UAT, security review, backup, monitoring, dan smoke test.

### Gate Selesai Proyek

- [ ] Seluruh acceptance criteria di `docs/19-testing-acceptance-criteria.md` lulus.
- [ ] Tidak ada TypeScript/lint/build error.
- [ ] Tidak ada kebocoran data lintas role atau relasi.
- [ ] Semua upload memiliki URL/path di database.
- [ ] Seluruh halaman data memiliki loading/empty/error/success state.
- [ ] Dokumentasi sama dengan implementasi production.
- [ ] Payment hanya aktif setelah persetujuan `super_admin` dan seluruh gate keamanan lulus.

---

## Checklist Definition of Done per Fitur

Setiap fitur hanya boleh ditandai selesai jika semua poin berikut terpenuhi:

- [ ] Fitur dan route ada di scope/docs.
- [ ] Schema dan relasi terdokumentasi.
- [ ] Migration/index/constraint tersedia bila dibutuhkan.
- [ ] RLS aktif dan test positif/negatif tersedia.
- [ ] Session, role, permission, dan relasi dicek server-side.
- [ ] Input divalidasi Zod.
- [ ] Mutasi sensitif masuk audit log.
- [ ] Upload menyimpan URL/path dan file private memakai signed URL.
- [ ] UI mengikuti tema final dan Bahasa Indonesia.
- [ ] Loading, empty, error, submit disabled, dan toast tersedia.
- [ ] Unit/integration/E2E test yang relevan lulus.
- [ ] Lint, typecheck, dan build lulus.
- [ ] Docs diperbarui jika ada perubahan scope, route, schema, storage, API, atau env.

## Prioritas Eksekusi

### Prioritas 1 - Fondasi Aman

Fase 0 sampai Fase 3. Tidak ada modul bisnis yang boleh dianggap siap sebelum auth, schema, RLS, dan storage policy lulus.

### Prioritas 2 - Operasional Sekolah

Fase 4 dan Fase 5. Data master, pendaftaran, import, LMS, serta attendance harus stabil sebelum komunikasi dan transaksi.

### Prioritas 3 - Komunikasi dan Komersial

Fase 6 dan Fase 7. Chat, marketplace, dan payment dikerjakan setelah relasi serta permission terbukti aman.

### Prioritas 4 - Produksi

Fase 8. Deployment dilakukan setelah acceptance criteria, UAT, security review, backup, dan rollback plan tersedia.

