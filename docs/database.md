# Database Schema & Data Models — SDIT Fajar

Dokumen ini adalah ringkasan arsitektur database Supabase PostgreSQL 15+ yang diselaraskan 100% dengan dokumen spesifikasi teknis utama [08-skema-database-supabase.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/08-skema-database-supabase.md). Dokumen ini berfungsi sebagai acuan cepat (*cheat sheet*) model data dan relasi.

---

## 1. Konvensi Database
- **Platform:** PostgreSQL 15+ di Supabase BaaS.
- **Penamaan:**
  - Nama tabel: `plural_snake_case` (contoh: `students`, `payment_invoices`, `student_attendances`, `parent_students`).
  - Nama kolom: `snake_case` (contoh: `created_at`, `login_identifier`, `academic_year_id`).
  - Primary Key: `id uuid primary key default gen_random_uuid()`.
  - Timestamp: Semua tabel utama memiliki `created_at timestamptz default now()` dan `updated_at timestamptz default now()`.
- **Fitur Chat Ditiadakan:** Tidak ada tabel `chat_messages` atau `chat_rooms`.
- **Row Level Security (RLS):** Wajib aktif 100% pada seluruh tabel publik (`alter table [nama_tabel] enable row level security;`).

---

## 2. PostgreSQL Enums Resmi

```sql
-- Role resmi aplikasi (5 role mutlak di database)
create type app_role as enum (
  'super_admin',
  'admin',
  'guru',
  'murid',
  'wali_murid'
);

create type publish_status as enum ('draft', 'published', 'archived');
create type assignment_status as enum ('draft', 'published', 'closed');
create type submission_status as enum ('not_submitted', 'submitted', 'late', 'graded');
create type payment_status as enum ('draft', 'unpaid', 'pending', 'paid', 'expired', 'failed', 'cancelled');
create type payment_type as enum (
  'spp',
  'iuran_ekstrakurikuler',
  'pendaftaran_semester_ganjil',
  'pendaftaran_semester_genap',
  'marketplace',
  'lainnya'
);
create type registration_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected');
create type attendance_status as enum ('present', 'late', 'absent', 'excused');
create type order_status as enum ('draft', 'pending_payment', 'paid', 'cancelled', 'fulfilled');
create type tahfidz_predicate as enum ('mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul');
```

---

## 3. Entitas & Tabel Lengkap

### A. Pengguna & Otorisasi
- **`profiles`**: Menghubungkan user Supabase Auth (`auth.users.id`) dengan data domain aplikasi.
  - Kolom: `id (uuid PK)`, `name (text)`, `email (text)`, `login_identifier (text unique)`, `role (app_role)`, `avatar_url (text)`, `phone (text)`, `is_active (boolean default true)`, `must_change_password (boolean default false)`, `created_at`, `updated_at`.
  - **Ketentuan Login Identifier & Password Awal**:
    - **Murid**: `login_identifier` = NIS. Password default = `tempatddmmyyyy` (normalisasi tempat lahir huruf kecil tanpa spasi + 8 digit tanggal lahir, misal: `jakartaselatan30122015`), `must_change_password = true`.
    - **Wali Murid**: `login_identifier` = Nomor WhatsApp/HP aktif. Password default = Nomor WhatsApp/HP yang sama, `must_change_password = true`.
    - **Staf (Admin/Guru)**: Menggunakan email resmi dan password terdaftar.
- **`positions`**: Master data jabatan fungsional guru di bawah role `guru`.
  - Kolom: `id (uuid PK)`, `code (text unique)`, `name (text)`, `category (text)`, `description (text)`.
  - Jabatan standar: `kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`.
- **`teacher_positions`**: Pivot penugasan jabatan guru per tahun ajaran.
  - Kolom: `id (uuid PK)`, `teacher_id (uuid FK teachers.id)`, `position_id (uuid FK positions.id)`, `academic_year_id (uuid FK academic_years.id)`, `is_active (boolean)`.

### B. Konfigurasi Sekolah & Periode Operasional
- **`school_settings`**: Konfigurasi tunggal identitas sekolah (hanya dapat diubah `super_admin`).
  - Kolom: `id (uuid PK)`, `school_name (text)`, `logo_url (text)`, `address (text)`, `phone (text)`, `whatsapp (text)`, `email (text)`, `maps_url (text)`, `social_links (jsonb)`.
- **`school_period_settings`**: Periode aktif operasional untuk modul absensi, penagihan, dan LMS.
  - Kolom: `id (uuid PK)`, `academic_year_id (uuid FK academic_years.id)`, `semester_id (uuid FK semesters.id)`, `active_month (int 1-12)`, `active_year (int)`, `teacher_weekend_attendance_enabled (boolean default false)`.

### C. Siswa, Wali Murid & PPDB
- **`student_registration_applications`**: Staging pendaftaran calon siswa baru (PPDB Online tanpa akun Auth).
  - Kolom: `id (uuid PK)`, `registration_number (text unique)`, `student_name (text)`, `gender (text)`, `birth_place (text)`, `birth_date (date)`, `parent_name (text)`, `parent_phone (text)`, `parent_email (text)`, `address (text)`, `status (registration_status default 'submitted')`, `admin_notes (text)`.
  - Alur: Dipromosikan ke `students` & dibuatkan akun `profiles` hanya saat status `approved` oleh Admin/Super Admin.
- **`student_registration_documents`**: Berkas lampiran calon siswa (Akte, KK, dll.).
  - Kolom: `id (uuid PK)`, `application_id (uuid FK)`, `document_type (text)`, `file_url (text)`, `file_path (text)`.
- **`students`**: Data pokok siswa aktif.
  - Kolom: `id (uuid PK)`, `profile_id (uuid FK profiles.id)`, `nis (text unique)`, `nisn (text unique)`, `gender (text)`, `birth_place (text)`, `birth_date (date)`, `address (text)`, `is_active (boolean)`.
- **`parents`**: Data profil orang tua / wali murid.
  - Kolom: `id (uuid PK)`, `profile_id (uuid FK profiles.id)`, `full_name (text)`, `phone (text)`, `address (text)`, `job (text)`.
- **`parent_students`**: Pivot relasi Many-to-Many antara wali murid dan anak/siswa.
  - Kolom: `id (uuid PK)`, `parent_id (uuid FK parents.id)`, `student_id (uuid FK students.id)`, `relationship (text: ayah/ibu/wali)`, `is_primary (boolean default true)`.

### D. Struktur Akademik & Kelas
- **`teachers`**: Data pokok guru/tenaga pendidik.
  - Kolom: `id (uuid PK)`, `profile_id (uuid FK profiles.id)`, `nip (text unique)`, `specialization (text)`.
- **`academic_years`**: Tahun ajaran (contoh: 2026/2027), `is_active (boolean)`.
- **`semesters`**: Semester 1 (Ganjil) & Semester 2 (Genap) per tahun ajaran, `is_active (boolean)`.
- **`classes`**: Tingkat jenjang kelas (Tingkat 1 s.d. 6).
- **`classrooms`**: Rombongan belajar spesifik (contoh: 1A, 2B, 3 Khadijah) per tahun ajaran.
  - Kolom: `id (uuid PK)`, `academic_year_id (uuid FK)`, `class_id (uuid FK)`, `name (text)`, `homeroom_teacher_id (uuid FK teachers.id)`.
- **`class_students`**: Pivot penempatan siswa di rombel aktif.
  - Kolom: `id (uuid PK)`, `classroom_id (uuid FK classrooms.id)`, `student_id (uuid FK students.id)`, `is_active (boolean)`.
- **`subjects`**: Master mata pelajaran kurikulum (PAI, Tematik, Bahasa Arab, Tahfidz, dll.).
- **`teaching_assignments`**: Penugasan guru mengajar mata pelajaran tertentu di kelas tertentu.
  - Kolom: `id (uuid PK)`, `teacher_id (uuid FK)`, `classroom_id (uuid FK)`, `subject_id (uuid FK)`, `academic_year_id (uuid FK)`.
- **`schedules`**: Jadwal tatap muka harian (`day_of_week`, `start_time`, `end_time`, `room`).

### E. Presensi & Modul Pembelajaran (LMS)
- **`teacher_attendances`**: Presensi harian guru.
  - Kolom: `id (uuid PK)`, `teacher_id (uuid FK)`, `date (date)`, `check_in_at (timestamptz)`, `check_out_at (timestamptz)`, `status (attendance_status)`, `notes (text)`.
  - Aturan: Masuk (06.30 - 07.30 = `present`, > 07.30 = `late`). Pulang aktif >= 14.30. Akhir pekan hanya jika `teacher_weekend_attendance_enabled = true`.
- **`student_attendances`**: Presensi siswa pada setiap sesi pelajaran.
  - Kolom: `id (uuid PK)`, `schedule_id (uuid FK)`, `student_id (uuid FK)`, `date (date)`, `status (attendance_status)`, `recorded_by (uuid FK profiles.id)`.
  - Aturan: Dicatat oleh Guru / Wali Kelas. Akhir pekan (Sabtu-Minggu) otomatis ditolak sistem.
- **`materials`**: Materi pembelajaran ajar (`title`, `content`, `file_url`, `file_path`, `status: draft/published`).
- **`assignments`**: Tugas kelas yang diberikan guru (`due_at`, `allow_late_submission`, `max_score`, `status`).
- **`assignment_submissions`**: Pengumpulan tugas oleh murid (`answer_text`, `file_url`, `submitted_at`, `status: submitted/late/graded`, `score`, `feedback`).
- **`grades`**: Rekapitulasi nilai e-raport per semester (`formative_score`, `summative_score`, `final_score`, `letter_grade`).

### F. Modul Tahfidz & Tahsin (Buku Kendali Setoran)
- **`tahfidz_records`**: Mutabaah hafalan Al-Qur'an harian.
  - Kolom: `id (uuid PK)`, `student_id (uuid FK students.id)`, `teacher_id (uuid FK profiles.id)`, `surah_number (int 1-114)`, `ayat_start (int)`, `ayat_end (int)`, `predicate (tahfidz_predicate)`, `record_date (date)`, `notes (text)`.

### G. Marketplace Perlengkapan & Buku Sekolah
- **`marketplace_products`**: Katalog buku fisik, modul digital, dan perlengkapan.
  - Kolom: `id (uuid PK)`, `title (text)`, `slug (text unique)`, `description (text)`, `cover_url (text)`, `file_url (text nullable)`, `file_path (text nullable)`, `price (numeric)`, `is_published (boolean)`.
- **`marketplace_orders`**: Transaksi pemesanan (hanya diinisiasi akun `wali_murid`).
  - Kolom: `id (uuid PK)`, `parent_id (uuid FK parents.id)`, `student_id (uuid FK students.id nullable)`, `status (order_status)`, `total_amount (numeric)`.
- **`marketplace_order_items`**: Item dalam order (`product_id`, `quantity`, `unit_price`).
  - Aturan: Tanpa integrasi ongkir/kurir (Pick-up di sekolah untuk barang fisik; download langsung untuk file digital).

### H. Keuangan, Midtrans Snap Modal & Kuitansi
- **`payment_settings`**: Konfigurasi Midtrans publik dan modul yang aktif.
  - Kolom: `id (uuid PK)`, `provider (text)`, `environment (sandbox/production)`, `merchant_id (text)`, `client_key (text)`, `provider_logo_url (text)`, `is_enabled (boolean)`, `is_spp_enabled`, `is_iuran_enabled`, `is_pendaftaran_semester_enabled`, `is_marketplace_enabled`.
  - Catatan: `server_key` hanya disimpan di environment variable server (`MIDTRANS_SERVER_KEY`).
- **`payment_invoices`**: Tagihan SPP, iuran, daftar ulang semester, dan marketplace.
  - Kolom: `id (uuid PK)`, `student_id (uuid FK nullable)`, `parent_id (uuid FK)`, `marketplace_order_id (uuid FK nullable)`, `academic_year_id (uuid FK)`, `type (payment_type)`, `billing_month (int 1-12)`, `billing_year (int)`, `title (text)`, `amount (numeric)`, `due_date (date)`, `status (payment_status default 'draft')`.
- **`payment_transactions`**: Rekam transaksi Midtrans Snap.
  - Kolom: `id (uuid PK)`, `invoice_id (uuid FK payment_invoices.id)`, `order_id (text unique)`, `transaction_id (text)`, `snap_token (text)`, `gross_amount (numeric)`, `status (payment_status)`, `paid_at (timestamptz)`, `raw_payload (jsonb)`, rincian bank pengirim & tujuan.
- **`payment_receipts`**: Kuitansi resmi snapshot yang dapat dibuka di tab baru dan dicetak (`@media print`).
  - Kolom: `id (uuid PK)`, `invoice_id (uuid FK)`, `transaction_id (uuid FK)`, `student_id (uuid FK)`, `class_name (text)`, `school_logo_url (text)`, `midtrans_logo_url (text)`, `paid_at (timestamptz)`, `invoice_number (text)`, `student_name (text)`, `amount (numeric)`, `status (payment_status)`.

### I. Informasi Publik & Log Sistem
- **`news_posts`**: Artikel dan berita publik sekolah (`title`, `slug`, `content`, `cover_url`, `cover_path`, `author_id`, `status: draft/published/archived`, `published_at`).
- **`announcements`**: Pengumuman terstruktur sekolah (`target_type: all/role/class/student`, `target_role`, `classroom_id`, `student_id`, `created_by`, `status`).
- **`audit_logs`**: Rekam jejak seluruh aktivitas mutasi sensitif di sistem.
- **`import_batches`**: Log riwayat import data massal CSV oleh Super Admin.

---

## 4. Pola Row Level Security (RLS) Wajib
1. **`super_admin` & `admin`**: Akses penuh ke seluruh tabel operasional (dengan proteksi bahwa `admin` tidak bisa mengubah `payment_settings.is_enabled` global atau secret key).
2. **`guru`**:
   - Membaca dan menginput materi, tugas, dan nilai hanya pada kelas/mapel yang ditugaskan (`teaching_assignments.teacher_id = auth.uid()`).
   - Khusus guru dengan jabatan `wali_kelas`, dapat melihat seluruh rekap presensi dan raport kelas binaannya.
   - Guru pengampu tahfidz dapat mengelola mutabaah di `tahfidz_records`.
3. **`murid`**:
   - Membaca jadwal kelasnya, materi pembelajaran, tugas, nilai, dan rekap tahfidz miliknya sendiri (`student_id = auth.uid()`).
   - Akses presensi murid bersifat **read-only**.
   - Dilarang keras mengakses tombol atau fungsionalitas bayar tagihan.
4. **`wali_murid`**:
   - Membaca progres belajar, nilai, absensi, dan tahfidz dari anak-anak yang terhubung via `parent_students`.
   - Mengakses dan membayar tagihan `payment_invoices` serta membuka `payment_receipts` untuk anak yang terhubung.
