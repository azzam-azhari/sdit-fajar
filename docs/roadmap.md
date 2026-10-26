# Project Roadmap & Implementation Tracker — SDIT Fajar

Dokumen ini memadukan rencana kerja strategis ([22-roadmap.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/22-roadmap.md)), petunjuk operasional teknis ([eksekusi.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/eksekusi.md)), dan catatan ruang lingkup pengguna ([note.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/note.md)).

Urutan fase dirancang terstruktur secara berurutan (*sequential gates*) untuk:
1. Menjaga kejelasan dependensi sistem (arsitektur -> fondasi -> auth -> database/RLS -> modul bisnis -> payment -> deployment).
2. Mengurangi pemborosan token dan waktu pengembangan dengan memverifikasi setiap fase sebelum fase berikutnya dimulai.
3. Menjamin keamanan data tingkat tinggi dengan kebijakan PostgreSQL Row Level Security (RLS) aktif 100% dan zero-leakage secrets.

---

## Ringkasan Fase Pengerjaan

| Fase | Fokus Utama | Target Luaran | Status |
|---|---|---|---|
| **Fase 0** | Finalisasi Dokumentasi, Single Source of Truth & Kontrak | Spesifikasi, rute, skema, 5 role, kontrak API konsisten | 🔄 Selesai / Konsisten |
| **Fase 1** | Fondasi Aplikasi, Design System (jakub.kr) & Frontend Publik | Next.js 16, Tailwind 4, Shadcn, ZebraDataTable, web publik | 🔄 Selesai / Konsisten |
| **Fase 2** | Supabase Auth SSR, Session, Storage Buckets & Guard | Auth NIS/WhatsApp, middleware guard, 4 private bucket | ⏳ Siap Dikerjakan |
| **Fase 3** | Database PostgreSQL, Relasi Skema, RLS & Seed Data | Migration terurut, 100% RLS aktif, audit log, seed demo | ⏳ Antrean |
| **Fase 4** | Admin Akademik, Verifikasi PPDB, Konten & Import CSV | Dashboard admin, rombel, PPDB staging, batch CSV import | ⏳ Antrean |
| **Fase 5** | Dashboard Role, LMS (Materi/Tugas/Nilai), Jadwal & Presensi | Siklus LMS end-to-end, presensi server-time, gradebook | ⏳ Antrean |
| **Fase 6** | Pengumuman Sekolah, Modul Tahfidz & Marketplace | Broadcast targeted, mutabaah hafalan Quran, toko sekolah | ⏳ Antrean |
| **Fase 7** | Billing SPP, Integrasi Midtrans Snap Modal & Kuitansi Cetak | Invoice admin, popup Snap wali murid, webhook, receipt print | ⏳ Antrean |
| **Fase 8** | Testing, Audit Keamanan RLS, Hardening & Deployment | Quality gates, IDOR test, UAT role, deploy remote Supabase | ⏳ Antrean |

---

## Detail Pelaksanaan Tiap Fase

### Fase 0 — Finalisasi Dokumentasi, Single Source of Truth & Kontrak
**Status**: 🔄 Selesai / Konsisten

#### A. Target & Fokus Utama
- Mengunci 5 role database resmi (`app_role`): `super_admin`, `admin`, `guru`, `murid`, `wali_murid` (tanpa role liar lain).
- Mengunci 7 jabatan resmi di bawah role guru (`positions`): `kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`.
- Menyelaraskan seluruh route publik, auth, dan dashboard terproteksi sesuai [03-daftar-halaman.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/03-daftar-halaman.md).
- Menyelaraskan seluruh tabel, relasi, foreign key, enum, dan index sesuai [08-skema-database-supabase.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/08-skema-database-supabase.md).
- Memastikan fitur chat internal **DITIADAKAN** dari seluruh arsitektur sistem.
- Menetapkan aturan transaksi pembayaran: hanya role `wali_murid` yang memiliki wewenang membayar melalui Midtrans Snap.

#### B. Checklist Implementasi Teknis
- [x] Sinkronisasi nama tabel, enum, dan relasi database dengan PRD 08.
- [x] Pembakuan rute publik (`/`, `/profil`, `/kurikulum`, `/ekstrakurikuler`, `/berita`, `/kontak`, `/pendaftaran`, `/marketplace`).
- [x] Pembakuan rute auth (`/login`, `/ganti-password`).
- [x] Pembakuan rute dashboard: `/dashboard/super-admin`, `/dashboard/admin`, `/dashboard/guru`, `/dashboard/murid`, `/dashboard/wali-murid`.
- [x] Pembakuan endpoint webhook Midtrans (`POST /api/webhooks/midtrans`) dan kuitansi print CSS `@media print`.
- [x] Pembakuan format kredensial murid (NIS + password awal `tempatddmmyyyy` ter-hash) dan wali murid (nomor WhatsApp/HP).
- [x] Konfirmasi alur fulfillment marketplace (Pick-up sekolah & download digital langsung pasca bayar).
- [x] Penetapan alur staging pendaftaran PPDB (`registrations` -> verifikasi admin -> promosi ke `students`).

#### C. Deliverables (Luaran Resmi)
- Berkas dokumentasi di `docs/` dan `docs/PRD/` konsisten 100% tanpa kontradiksi.
- Peta `USER_ROLES`, redirect map, dan matriks hak akses per role telah final.
- Checklist dependensi dan prasyarat per modul terkunci.

#### D. Gate Fase 0
- [x] Tidak ada role atau jabatan di luar daftar resmi.
- [x] Tidak ada route atau endpoint rencana yang belum tercatat di docs.
- [x] Tidak ada tabel atau kolom rencana yang belum tercatat di skema database.

---

### Fase 1 — Fondasi Aplikasi, Design System & Frontend Publik
**Status**: 🔄 Selesai / Konsisten

#### A. Target & Fokus Utama
- Inisialisasi arsitektur Next.js 16 App Router di folder `src/` dengan TypeScript strict mode.
- Menerapkan filosofi **Minimalist Craft & Design Engineering** (terinspirasi dari [jakub.kr](https://jakub.kr/)): garis batas tipis tajam (*micro-borders* `border-border/80`), padding presisi, dan *whitespace* terukur.
- Larangan keras terhadap gaya *Claymorphism* (elemen 3D cembung, bayangan tebal) dan *Heavy Bento Grid* yang membuang ruang layar.
- Membangun seluruh halaman publik yang dapat diakses oleh *guest* tanpa perlu login, lengkap dengan dukungan responsif dan opsi dwibahasa (Inggris) pada halaman terpilih.

#### B. Checklist Implementasi Teknis
- [x] Inisialisasi dependensi inti di root proyek: Next.js 16.4.3, React 19.2.4, TypeScript 5.x, Tailwind CSS 4, Node.js 22 LTS.
- [x] Konfigurasi path alias `@/*` mengarah ke folder `src/`.
- [x] Setup komponen primitif Shadcn UI (Radix Primitives, `lucide-react`, template `dashboard-01`).
- [x] Setup tema Light & Dark mode menggunakan `next-themes` dan palet warna netral monokromatik dengan aksen *Deep Blue*.
- [x] Pembuatan komponen bersama wajib:
  - **`ZebraDataTable`** (`@/components/common/zebra-data-table.tsx`): Tabel belang-selang (`even:bg-muted/25 dark:even:bg-muted/15`) dengan kolom kode/angka `font-mono`.
  - `PageHeader`, `StatCard`, `StatusBadge`, `EmptyState`, `DatePicker`.
- [x] Pembangunan layout publik (`PublicNavbar`, `PublicFooter`, floating WhatsApp button non-intrusif).
- [x] Pembangunan seluruh halaman publik:
  - Beranda (`/`): Hero section, CTA PPDB, visi-misi, statistik santri/guru, cuplikan berita, profil ringkas manajemen, testimoni, FAQ, dan katalog marketplace unggulan.
  - Profil Sekolah (`/profil`, `/profil/sejarah`, `/profil/manajemen`).
  - Akademik & Kesiswaan (`/kurikulum`, `/ekstrakurikuler`).
  - Berita & Informasi (`/berita`, `/berita/[slug]`) dengan UI pagination.
  - Hubungi Kami (`/kontak`).
  - Formulir PPDB Online (`/pendaftaran`): Form biodata santri/wali dan preview unggah dokumen berkas.
  - Katalog Publik Marketplace (`/marketplace`): Etalase produk terbitan sekolah.
- [x] Implementasi metadata SEO, Open Graph tags, robots.txt, dan sitemap dinamis.
- [x] Penerapan state antarmuka lengkap: loading skeleton, empty state, error state, dan feedback form.

#### C. Deliverables (Luaran Resmi)
- Aplikasi dapat dijalankan lokal (`npm run dev`) secara lancar.
- Semua halaman publik dapat diakses penuh oleh tamu (*guest*) tanpa sesi login.
- Komponen reusable siap digunakan langsung untuk area dashboard internal.
- Layout responsif optimal di layar ponsel, tablet, dan desktop.

#### D. Gate Fase 1
- [x] Perintah `npm run lint`, `npm run typecheck`, dan `npm run build` lulus 100% tanpa error.
- [x] Seluruh route publik dapat diakses guest; aksesibilitas label form dan kontras warna tervalidasi.
- [x] Tidak ada kredensial, secret key, atau data pribadi nyata yang masuk ke repository.

---

### Fase 2 — Setup Supabase, Auth SSR, Session & Storage Buckets
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Membangun koneksi aman ke remote Supabase project menggunakan `@supabase/ssr`.
- Menerapkan sistem autentikasi tunggal terproteksi (`/login`):
  - Murid: Login menggunakan **NIS** (`login_identifier`) dan password awal format `tempatddmmyyyy`.
  - Staf/Guru/Admin: Login menggunakan Email/Username.
  - Wali Murid: Login menggunakan Nomor WhatsApp/HP aktif.
- Menegakkan kewajiban ganti password pada login pertama (`must_change_password = true`) via `/ganti-password`.
- Menyiapkan 4 Supabase Storage Buckets resmi dengan isolasi private.

#### B. Checklist Implementasi Teknis
- [ ] Konfigurasi Supabase Client SSR di `src/lib/supabase/`:
  - `client.ts` (Browser client menggunakan Anon Key).
  - `server.ts` (Server client dengan cookie store).
  - `admin.ts` (Admin client dengan Service Role Key, server-only).
- [ ] Setup Next.js Middleware (`src/middleware.ts`) untuk:
  - Refresh auth tokens & session cookies.
  - Role-based redirect guard (guest ditendang ke `/login`, user aktif diarahkan ke dashboard rolenya).
  - Blokir user dengan status `profiles.is_active = false`.
- [ ] Pembangunan halaman login tunggal (`/login`) dengan tab/selector identifier yang elegan.
- [ ] Pembangunan halaman ganti password wajib (`/ganti-password`).
- [ ] Pembuatan helper autentikasi server: `requireUser()`, `requireRole()`, `getCurrentProfile()`.
- [ ] Pembuatan 4 Storage Buckets resmi:
  1. `images` (banner, profil, cover buku/berita).
  2. `lms-files` (materi ajar, lampiran tugas, berkas submission murid).
  3. `registration-files` (akta kelahiran, kartu keluarga, ijazah pendaftar PPDB).
  4. `marketplace-files` (berkas digital produk/buku terproteksi).
- [ ] Implementasi validasi MIME type, ekstensi, dan batas ukuran file di sisi server.
- [ ] Implementasi signed URL berumur pendek untuk akses file privat.
- [ ] Aturan sinkronisasi: setiap file yang diunggah wajib mencatatkan storage path/URL ke kolom tabel domain terkait.

#### C. Deliverables (Luaran Resmi)
- Middleware proteksi sesi dan role redirect berfungsi secara presisi.
- Alur login NIS dan WhatsApp berjalan lancar; murid dipaksa mengubah password perdana.
- Storage bucket privat siap digunakan dengan generator signed URL terverifikasi.
- `SUPABASE_SERVICE_ROLE_KEY` terisolasi 100% di server (zero-leakage ke browser).

#### D. Gate Fase 2
- [ ] Tamu (*guest*) tidak dapat membuka rute `/dashboard/*`.
- [ ] Pengguna dengan satu role tidak dapat membuka rute dashboard milik role lain.
- [ ] Berkas privat di bucket tidak dapat diakses tanpa sesi yang berhak dan signed URL valid.

---

### Fase 3 — Skema Database PostgreSQL, Relasi, RLS & Seed Data
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Mengeksekusi migration DDL skema database PostgreSQL Supabase lengkap sesuai [08-skema-database-supabase.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/08-skema-database-supabase.md).
- Mengaktifkan Row Level Security (RLS) pada **100% tabel internal** dengan policies ketat tanpa celah kebocoran data (*zero data leakage*).
- Menyiapkan fungsi helper keamanan database (`current_profile_id()`, `current_user_role()`) dan pencatatan `audit_logs`.
- Mengisi data master dan seed data pengembangan untuk tahun ajaran 2026/2027 tanpa menyertakan data pribadi asli.

#### B. Checklist Implementasi Teknis
- [ ] Eksekusi migration enum resmi: `app_role`, `registration_status`, `payment_status`, `invoice_type`, `attendance_status`, dll.
- [ ] Pembuatan tabel terurut berdasar dependensi foreign key:
  1. `profiles`, `school_settings`, `audit_logs`.
  2. `academic_years`, `semesters`, `school_period_settings`.
  3. `teachers`, `teacher_positions`, `students`, `parents`, `parent_students`.
  4. `classes`, `classrooms`, `class_students`, `subjects`, `teaching_assignments`, `schedules`.
  5. `registrations`, `registration_documents`.
  6. `teacher_attendances`, `student_attendances`.
  7. `learning_materials`, `assignments`, `assignment_submissions`, `grades`.
  8. `announcements`, `news`.
  9. `tahfidz_records`.
  10. `marketplace_products`, `marketplace_orders`, `marketplace_order_items`.
  11. `payment_settings`, `payment_invoices`, `payment_transactions`, `payment_receipts`.
  12. `import_batches`.
- [ ] Penambahan index performa, unique constraint, dan foreign key constraints.
- [ ] Penegakan statement `alter table [nama_tabel] enable row level security;` pada seluruh tabel.
- [ ] Perumusan RLS policies:
  - Proteksi profil: user tidak dapat mengubah role sendiri; admin tidak dapat menurunkan super admin.
  - Relasi siswa-wali: akses data siswa dibatasi hanya untuk wali murid yang terhubung di `parent_students`.
  - Relasi guru: akses materi/nilai dibatasi berdasar `teaching_assignments` dan `classrooms.homeroom_teacher_id`.
  - Transaksi & invoice: hanya dapat dilihat oleh wali murid terkait dan staf keuangan.
- [ ] Pembuatan helper mutasi audit log untuk setiap perubahan sensitif.
- [ ] Pengisian seed data demo: tahun ajaran 2026/2027, kelas 1–6, mata pelajaran kurikulum Islam terpadu, akun dummy untuk 5 role dan 7 jabatan guru.
- [ ] Pengujian RLS negatif: percobaan akses data lintas akun/anak via query langsung.

#### C. Deliverables (Luaran Resmi)
- Migration SQL modular yang dapat dijalankan ulang secara bersih (*idempotent*).
- Seluruh tabel database terproteksi penuh oleh RLS policies.
- Lingkungan development memiliki data demo operasional siap uji.

#### D. Gate Fase 3
- [ ] Seluruh migrasi database sukses dijalankan pada schema Supabase.
- [ ] Uji RLS negatif membuktikan bahwa santri A tidak dapat melihat tugas/nilai santri B, dan wali murid A tidak dapat melihat invoice santri B.
- [ ] Tidak ada data kredensial asli yang tersimpan dalam seed database.

---

### Fase 4 — Admin Akademik, Verifikasi PPDB & Import CSV
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Membangun antarmuka dashboard untuk `super_admin` dan `admin` dengan navigasi sidebar dinamis.
- Manajemen data master akademik: rombongan belajar (`classrooms`), tahun ajaran, semester, mata pelajaran, dan penugasan mengajar (`teaching_assignments`).
- Alur verifikasi pendaftaran PPDB online: memproses calon santri dari tabel staging `registrations`, verifikasi berkas, persetujuan admin, hingga pembuatan akun otomatis murid & wali murid.
- Modul Batch Import CSV khusus `super_admin`: mengimpor data massal siswa, guru, wali murid dengan template resmi, validasi per baris, dan rollback transaksi jika ada baris korup.
- Pengelolaan identitas sekolah publik (`school_settings`) dan publikasi berita/kegiatan.

#### B. Checklist Implementasi Teknis
- [ ] Pembuatan `DashboardShell`, sidebar berbasis role, topbar navigasi, avatar profil, breadcrumb, dan drawer mobile.
- [ ] Dashboard Super Admin (`/dashboard/super-admin`):
  - Manajemen seluruh pengguna aplikasi (aktifkan/nonaktifkan akun, reset password aman).
  - Pengelolaan assignment jabatan guru (`teacher_positions`).
  - Pemantauan jejak rekam audit log (`audit_logs`).
  - Pengaturan identitas dan kontak resmi sekolah (`school_settings`).
- [ ] Fitur Import CSV Massal (`/dashboard/super-admin/import`):
  - Penyediaan template file CSV resmi untuk diunduh.
  - Validasi header, encoding, tipe data, foreign key, dan deteksi duplikasi.
  - Antarmuka preview baris data sebelum dieksekusi dengan penanda baris error.
  - Eksekusi import berbasis database transaction (menolak komit parsial jika ada kegagalan kritis).
  - Pencatatan riwayat pada `import_batches` dan `audit_logs`.
- [ ] Dashboard Admin Sekolah (`/dashboard/admin`):
  - CRUD tahun ajaran, semester, dan setting periode aktif operasional (`school_period_settings`).
  - CRUD kelas, rombel, mata pelajaran, data biodata siswa, guru, dan wali murid.
  - Penugasan wali kelas (`classrooms.homeroom_teacher_id`) dan guru mata pelajaran (`teaching_assignments`).
- [ ] Verifikasi Pendaftaran PPDB (`/dashboard/admin/pendaftaran`):
  - Tabel verifikasi calon santri menggunakan format **`ZebraDataTable`**.
  - Pemeriksaan kelengkapan berkas pendaftaran (akta, KK, pas foto) via signed URL.
  - Perubahan status pendaftaran: `submitted` -> `in_review` -> `approved` / `rejected`.
  - Tombol promosi santri disetujui: memindahkan data ke `students`, membuat akun Auth murid (NIS + password biodata) dan akun wali murid, serta mengaitkan relasi `parent_students`.
- [ ] Manajemen Konten Berita Sekolah (`/dashboard/admin/berita`): CRUD artikel, unggah foto cover, draft & publish toggle.

#### C. Deliverables (Luaran Resmi)
- Seluruh data master sekolah dapat dikelola secara penuh oleh admin berwenang.
- Alur PPDB staging berfungsi utuh dari pengisian formulir publik hingga promosi menjadi murid aktif.
- Modul import CSV dapat mengunggah ratusan data master secara aman tanpa merusak integritas database.

#### D. Gate Fase 4
- [ ] Seluruh mutasi data lolos validasi Zod schema di Server Actions dan terlindungi otentikasi sesi.
- [ ] Form pendaftaran tamu tidak membuka akses pembacaan data pendaftar lain.
- [ ] Import CSV baris rusak berhasil digagalkan dan menampilkan pesan error presisi per nomor baris.
- [ ] Admin sekolah tidak memiliki izin untuk mengubah identitas super admin atau konfigurasi payment global.

---

### Fase 5 — Dashboard Role, LMS Akademik, Jadwal & Presensi
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Membangun antarmuka dashboard personal untuk role `guru`, `murid`, dan `wali_murid`.
- Menerapkan *Position-based Feature Toggles* pada dashboard guru berdasarkan atribut `positions` (misal menu khusus kepala sekolah, wali kelas, atau koordinator tahfidz).
- Membangun siklus pembelajaran digital LMS: pembagian materi belajar, penugasan tugas dengan batas waktu, pengumpulan tugas santri, dan penilaian oleh guru.
- Menerapkan modul presensi kehadiran guru (masuk 06.30–07.30, pulang >= 14.30 Senin–Jumat, opsi akhir pekan oleh kepala sekolah).
- Menerapkan presensi santri per jadwal mata pelajaran pada hari kerja (Senin–Jumat) dengan penolakan keras akhir pekan di tingkat server.

#### B. Checklist Implementasi Teknis
- [ ] Dashboard Guru (`/dashboard/guru`):
  - Ringkasan kelas yang diampu, jadwal hari ini, materi aktif, dan tugas yang membutuhkan penilaian.
  - Tampilan dinamis jabatan `kepala_sekolah`: rekapitulasi kehadiran seluruh guru/santri dan laporan akademik lintas kelas.
  - Tampilan dinamis jabatan `wali_kelas`: monitoring progres nilai dan kehadiran siswa kelas binaannya.
- [ ] Dashboard Murid (`/dashboard/murid`):
  - Jadwal pelajaran harian, daftar materi yang bisa diakses, tenggat waktu tugas, dan rekapitulasi nilai pribadi.
- [ ] Dashboard Wali Murid (`/dashboard/wali-murid`):
  - Selector anak (jika memiliki lebih dari satu anak bersekolah di SDIT Fajar).
  - Pemantauan real-time nilai tugas, kehadiran di kelas, dan pengumuman sekolah anak.
- [ ] Modul Materi Pembelajaran (`/dashboard/guru/materi`):
  - CRUD materi belajar dengan opsi unggah berkas modul, teks panduan, atau link video.
  - Pembatasan visibilitas materi: hanya murid di kelas dan mata pelajaran terkait yang dapat membaca.
- [ ] Modul Tugas & Penilaian (`/dashboard/guru/tugas`):
  - Pembuatan tugas dengan batas waktu (*deadline*), instruksi, bobot skor maksimal, dan toleransi keterlambatan.
  - Antarmuka pengumpulan tugas murid: unggah file jawaban/teks (dibatasi 1 submission aktif per tugas).
  - Status keterlambatan (`is_late`) ditentukan secara otomatis oleh waktu server.
  - Antarmuka penilaian guru: pemberian nilai angka (0–100) dan catatan evaluasi/feedback santri.
  - Buku Nilai (*Gradebook*): Rekapitulasi nilai tugas dan nilai akhir semester.
- [ ] Modul Jadwal Pelajaran (`/dashboard/jadwal`): Penataan jadwal mingguan per rombel dan guru pengampu.
- [ ] Modul Presensi Guru (`/dashboard/guru/presensi`):
  - Check-in pagi (06.30–07.30 WIB) dan check-out sore (>= 14.30 WIB).
  - Validasi jam server mutlak; penolakan duplikasi presensi pada tanggal dan sesi yang sama.
  - Opsi aktivasi presensi akhir pekan (Sabtu/Minggu) yang hanya dapat dinyalakan oleh guru jabatan `kepala_sekolah`.
- [ ] Modul Presensi Siswa (`/dashboard/guru/presensi-siswa`):
  - Input presensi per sesi jam mata pelajaran oleh guru mapel atau wali kelas (Hadir, Izin, Sakit, Alpa).
  - Validasi server: absensi siswa hanya diizinkan pada hari kerja (Senin–Jumat); request akhir pekan ditolak otomatis.
  - Rekapitulasi presensi bulanan dengan tabel berformat **`ZebraDataTable`**.

#### C. Deliverables (Luaran Resmi)
- Siklus pembelajaran akademik (materi -> tugas -> pengumpulan -> nilai) berjalan mulus tanpa celah data.
- Presensi guru dan siswa tercatat akurat dengan validasi waktu server.
- Dashboard kelima role menyajikan informasi relevan tanpa error saat kondisi data kosong (*empty state*).

#### D. Gate Fase 5
- [ ] Murid A tidak dapat melihat berkas tugas atau nilai milik Murid B.
- [ ] Guru hanya dapat mengelola materi, tugas, dan presensi untuk rombel/mapel yang ditugaskan padanya.
- [ ] Aturan jam absensi guru (07.30 / 14.30) dan pemblokiran absensi siswa pada akhir pekan teruji ketat di sisi server.

---

### Fase 6 — Pengumuman Sekolah, Modul Tahfidz & Marketplace
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Sistem pengumuman terstruktur sekolah (*Announcements*) dengan target audiens spesifik (seluruh sekolah, role tertentu, atau rombel kelas tertentu).
- **Modul Khusus Tahfidz & Tahsin**: Buku mutabaah hafalan Qur'an santri, pencatatan setoran ayat harian oleh ustadz/guru tahfidz, dan rekapitulasi juz santri.
- **Marketplace Perlengkapan Sekolah**: Etalase buku materi, modul digital, dan seragam sekolah yang dikelola admin, dengan pemesanan khusus oleh akun `wali_murid`.
- Proteksi berkas digital: file e-book/modul digital tidak dapat diunduh sebelum transaksi dinyatakan lunas (*paid*).

#### B. Checklist Implementasi Teknis
- [ ] Modul Pengumuman Sekolah (`/dashboard/pengumuman`):
  - Pembuatan pengumuman oleh `super_admin` (target: semua user atau role tertentu).
  - Pembuatan pengumuman oleh kepala sekolah atau wali kelas (target: rombel kelas binaan).
  - Visibilitas pesan sesuai target audiens di halaman dashboard masing-masing.
- [ ] Modul Tahfidz & Tahsin (`/dashboard/guru/tahfidz`):
  - Formulir setoran hafalan harian santri: Nama Surah, Ayat Mulai, Ayat Selesai, Jumlah Halaman, dan Predikat Kelancaran (*Mumtaz*, *Jayyid Jiddan*, *Jayyid*, *Maqbul*).
  - Dashboard pemantauan perkembangan hafalan untuk `murid` dan `wali_murid` (progres juz dan riwayat setoran).
  - Tampilan rekapitulasi capaian hafalan seluruh santri untuk guru jabatan `koordinator_tahfidz` menggunakan **`ZebraDataTable`**.
- [ ] Modul Marketplace Sekolah (`/marketplace` & `/dashboard/marketplace`):
  - Pengelolaan katalog produk oleh admin: judul buku/atribut, deskripsi, harga, stok fisik, cover gambar, dan file digital (jika ada).
  - Etalase publik dapat dijelajahi oleh pengunjung umum (*guest*).
  - Alur Checkout: Pembelian hanya dapat diinisiasi oleh akun login role **`wali_murid`** (dengan pemilihan santri yang bersangkutan).
  - Pembuatan order dan item dengan *server-side price snapshot* (mencegah manipulasi harga dari client browser).
  - Integrasi order ke sistem penagihan (*invoice*) sekolah.
  - Pengambilan berkas digital privat menggunakan signed URL yang hanya diterbitkan setelah invoice berstatus `paid`.

#### C. Deliverables (Luaran Resmi)
- Pengumuman tersampaikan tepat sasaran sesuai hierarki hak akses.
- Buku mutabaah tahfidz digital berfungsi optimal menggantikan buku setoran konvensional.
- Marketplace perlengkapan sekolah siap memproses pemesanan dari wali murid secara teratur.

#### D. Gate Fase 6
- [ ] Riwayat setoran tahfidz tersimpan valid dan hanya dapat diakses oleh santri serta wali murid yang bersangkutan.
- [ ] Pengunjung umum dan akun selain `wali_murid` tidak dapat melakukan checkout pemesanan marketplace.
- [ ] Berkas unduhan digital produk marketplace terkunci rapat sebelum status pembayaran terverifikasi sah.

---

### Fase 7 — Billing SPP, Integrasi Midtrans Snap & Kuitansi Cetak
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Mengaktifkan integrasi payment gateway **Midtrans** (Snap API Popup Modal & Core API).
- Konfigurasi environment (Sandbox / Production), Server Key, Client Key, dan Merchant ID dikunci di tingkat server dan hanya dapat diaktifkan secara global oleh **`super_admin`**.
- Pengelolaan tagihan invoice oleh admin sekolah: SPP bulanan, uang kegiatan/ekstrakurikuler, daftar ulang semester ganjil/genap, dan pesanan marketplace.
- **Pintu Pembayaran Khusus Wali Murid**: Tombol bayar dan pemanggilan Midtrans Snap Modal **HANYA** dapat diakses oleh role `wali_murid` untuk anak yang terhubung. Santri dilarang memiliki tombol bayar.
- Route Handler Webhook Midtrans (`POST /api/webhooks/midtrans`) yang memverifikasi signature hash SHA512 dan menerapkan proses *idempotent*.
- Kuitansi pembayaran resmi print-friendly menggunakan standar styling CSS `@media print` (`window.print()`).

#### B. Checklist Implementasi Teknis
- [ ] Prasyarat Keamanan Pembayaran:
  - Set default `PAYMENT_ENABLED = false` di awal instalasi; aktivasi bertahap via database setting.
  - Kunci rahasia `MIDTRANS_SERVER_KEY` disimpan server-only di `.env.local` (dilarang masuk ke database atau client bundle).
- [ ] Dashboard Super Admin — Pengaturan Pembayaran (`/dashboard/super-admin/pembayaran`):
  - Pengaturan mode environment (Sandbox vs Production), Merchant ID, Client Key, dan toggle aktivasi global payment.
  - Setiap perubahan konfigurasi terekam otomatis pada `audit_logs`.
- [ ] Dashboard Admin — Manajemen Tagihan (`/dashboard/admin/tagihan`):
  - CRUD invoice tagihan santri (`payment_invoices`): SPP bulanan, daftar ulang, iuran kegiatan.
  - Penentuan nominal tagihan, tanggal jatuh tempo, bulan/tahun aktif buku, dan target santri.
  - Filter dan pencarian invoice dengan format **`ZebraDataTable`**.
- [ ] Portal Pembayaran Wali Murid (`/dashboard/wali-murid/tagihan`):
  - Daftar invoice aktif dan riwayat pembayaran untuk seluruh anak yang diasuh.
  - Tombol **"Bayar Sekarang"** yang memicu Server Action pembuatan transaksi Midtrans Snap token.
  - Integrasi library script Midtrans Snap JS di client browser untuk memunculkan modal popup di atas dashboard.
- [ ] Route Handler Webhook Midtrans (`src/app/api/webhooks/midtrans/route.ts`):
  - Validasi payload request dan verifikasi keaslian hash SHA512:
    `SHA512(order_id + status_code + gross_amount + ServerKey)`.
  - Penanganan idempotensi transaksi: callback ganda tidak mengubah saldo atau data berulang kali.
  - Pembaruan status transaksi (`settlement`/`capture` -> `paid`, `expire` -> `expired`, `deny`/`cancel` -> `failed`).
  - Pembaruan status invoice terkait menjadi `paid` pasca verifikasi sukses.
- [ ] Halaman Kuitansi Resmi (`/dashboard/wali-murid/pembayaran/[invoiceId]/kuitansi`):
  - Desain layout bersih formal standar print dengan `@media print`.
  - Memuat logo sekolah, logo Midtrans, nomor invoice, tanggal bayar, nama siswa, NIS, kelas, rincian pembayaran, nominal IDR (`font-mono`), status lunas, serta detail channel pembayaran yang valid.
  - Tombol aksi "Cetak Kuitansi" (`window.print()`) dan opsi buka di tab baru.
  - Proteksi akses kuitansi: hanya dapat dibuka oleh wali murid pemilik tagihan dan staf admin/keuangan sekolah.

#### C. Deliverables (Luaran Resmi)
- Alur transaksi pembayaran berjalan end-to-end pada Midtrans Sandbox.
- Callback webhook memproses status pembayaran secara otomatis, aman, dan tanpa celah manipulasi.
- Wali murid dapat langsung mengunduh dan mencetak kuitansi pembayaran resmi.

#### D. Gate Fase 7
- [ ] Tombol pembayaran hanya dapat dilihat dan ditekan oleh akun `wali_murid` untuk tagihan santri yang sah.
- [ ] Webhook palsu atau tanpa signature key SHA512 yang valid ditolak dengan HTTP 400/401.
- [ ] Status invoice `paid` hanya dapat berubah melalui webhook callback Midtrans yang sah.
- [ ] Kuitansi pembayaran santri A tidak dapat diakses oleh akun santri B atau wali murid B.

---

### Fase 8 — Hardening, Audit Keamanan, UAT & Deployment
**Status**: ⏳ Antrean

#### A. Target & Fokus Utama
- Menjalankan seluruh pengujian kualitas kode otomatis (*automated quality gates*).
- Audit keamanan mendalam terhadap kebijakan Supabase RLS, pencegahan eksploitasi IDOR (*Insecure Direct Object References*), dan verifikasi nol kebocoran data rahasia (*zero secret leak*).
- Uji Penerimaan Pengguna (*User Acceptance Testing* - UAT) untuk memastikan seluruh skenario operasional 5 role dan 7 jabatan guru terpenuhi.
- Menjalankan pengujian non-fungsional: responsivitas tampilan, performa query database, Core Web Vitals, dan aksesibilitas web.
- Migrasi database ke Remote Supabase Production, konfigurasi hosting di Vercel, setup prosedur cadangan (*backup*), serta rencana pemulihan (*rollback plan*).

#### B. Checklist Implementasi Teknis
- [ ] Quality Gate Otomatis:
  - `npm run lint` lulus tanpa peringatan kritis.
  - `npm run typecheck` lulus tanpa error kompilasi TypeScript (zero `any`).
  - Unit test dan integration test untuk Server Actions, helper permission, dan validasi Zod.
  - `npm run build` berhasil memproduksi bundle produksi yang optimal.
- [ ] Audit Keamanan & Data:
  - Audit seluruh environment variable: pastikan `SUPABASE_SERVICE_ROLE_KEY` dan `MIDTRANS_SERVER_KEY` tidak bocor ke client bundle.
  - Uji penetrasi IDOR pada entitas santri, submission tugas, nilai raport, invoice, berkas dokumen, dan kuitansi pembayaran.
  - Verifikasi RLS policies di Supabase dashboard untuk menjamin isolasi data multi-pengguna.
  - Pemasangan rate-limiting pada rute login, formulir pendaftaran PPDB, dan unggah berkas.
- [ ] Skenario UAT Komprehensif:
  - UAT Tamu: Penjelajahan halaman profil publik, berita, formulir pendaftaran PPDB, katalog marketplace.
  - UAT Super Admin: Pengelolaan pengguna, assign jabatan guru, audit log, konfigurasi sekolah, batch import CSV, aktivasi Midtrans global.
  - UAT Admin Sekolah: Setup tahun ajaran/semester aktif, verifikasi berkas PPDB dan promosi murid, pembuatan rombel, jadwal, invoice tagihan.
  - UAT Guru: Presensi kerja (07.30 / 14.30), upload materi ajar, pembuatan tugas, input nilai tugas, presensi siswa di kelas, input setoran tahfidz harian.
  - UAT Murid: Login NIS perdana dan paksaan ganti password, akses jadwal, materi belajar, unggah tugas, pantau nilai dan hafalan Qur'an.
  - UAT Wali Murid: Pemantauan multi-anak, progres hafalan tahfidz, pembayaran invoice via Snap popup Midtrans, unduh kuitansi cetak.
- [ ] Pengujian Non-Fungsional:
  - Evaluasi performa Core Web Vitals (LCP, FID, CLS) dan optimasi gambar publik.
  - Audit aksesibilitas antarmuka (kontras warna, navigasi keyboard, screen reader tags).
- [ ] Prosedur Deployment Produksi:
  - Eksekusi migrasi skema database ke project Remote Supabase Production.
  - Konfigurasi bucket storage dan storage security policies di production.
  - Konfigurasi environment variables di dashboard Vercel production.
  - Smoke testing menyeluruh pada domain production.
  - Penyusunan panduan operasional sekolah, prosedur backup database harian, dan dokumentasi changelog rilis.
  - Pembukaan aktivasi live payment Midtrans secara resmi dengan persetujuan Super Admin.

#### C. Deliverables (Luaran Resmi)
- Aplikasi web LMS SDIT Fajar berstatus live dan stabil di domain resmi sekolah.
- Seluruh acceptance criteria di [19-testing-acceptance-criteria.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/19-testing-acceptance-criteria.md) terpenuhi 100%.
- Dokumentasi pemeliharaan, panduan administrator, dan prosedur tanggap darurat (*disaster recovery*).

#### D. Gate Selesai Proyek (Project Completion Gate)
- [ ] Lulus pengujian otomatis (`lint`, `typecheck`, `build`).
- [ ] Lulus verifikasi keamanan RLS dan zero-leakage test.
- [ ] Lulus pengujian UAT oleh perwakilan seluruh role sekolah.
- [ ] Sistem siap pakai untuk tahun ajaran aktif 2026/2027.

---

## Prinsip & Prioritas Eksekusi Proyek

```text
Prioritas 1: Fondasi Aman (Fase 0 s/d Fase 3)
└── Setup proyek, design system, auth, storage, database migration, dan RLS policies.
    Modul operasional tidak boleh dibuat sebelum fondasi keamanan lulus 100%.

Prioritas 2: Operasional Sekolah (Fase 4 & Fase 5)
└── Master data akademik, verifikasi PPDB, import massal CSV, modul LMS, dan presensi.
    Kestabilan data akademik menjadi prasyarat modul komunikasi dan transaksi.

Prioritas 3: Komunikasi & Layanan (Fase 6 & Fase 7)
└── Pengumuman sekolah, mutabaah tahfidz, marketplace buku, dan billing SPP Midtrans.
    Dijalankan setelah relasi wali-anak terbukti kuat dan terisolasi.

Prioritas 4: Produksi & Go-Live (Fase 8)
└── Hardening, security audit, UAT menyeluruh, backup rutin, dan deployment produksi.
```

---

## Definisi Selesai (*Definition of Done*) per Fitur

Setiap fitur dalam checklist fase di atas hanya boleh diberi centang selesai `[x]` apabila memenuhi kriteria baku berikut:

1. **Kesesuaian Dokumen**: Sesuai 100% dengan spesifikasi di `docs/` dan aturan konstitusi `.agents/rules/`.
2. **Server-Side Security**: Hak akses dan peran pengguna diverifikasi di Server Actions / Middleware (tidak mengandalkan proteksi UI).
3. **Validasi Input**: Seluruh payload mutasi divalidasi dengan skema Zod (`safeParse`).
4. **Desain & UI**: Mengadopsi prinsip Minimalist Craft, Shadcn UI, dan tabel data wajib baris selang-seling **Zebra Cross**.
5. **State Antarmuka Lengkap**: Memiliki loading skeleton, penanganan data kosong (*empty state*), penanganan error ramah pengguna, dan notifikasi toast Sonner.
6. **Bebas Error Kompilasi**: Lolos `npm run typecheck` tanpa penggunaan tipe data `any`.
7. **Pencatatan Berkas & Audit**: Setiap unggahan berkas tercatat URL/path-nya di database, dan mutasi sensitif tercatat di `audit_logs`.
