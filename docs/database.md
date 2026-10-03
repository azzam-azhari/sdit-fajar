# Database Schema & Data Models — SDIT Fajar

## 1. Konvensi Database
- **Engine:** PostgreSQL 15+ di Supabase.
- **Penamaan:**
  - Nama tabel: `plural_snake_case` (misal: `students`, `invoices`, `attendance_records`).
  - Nama kolom: `snake_case` (misal: `created_at`, `login_identifier`, `academic_year_id`).
  - Primary Key: `id uuid default gen_random_uuid()`.
  - Timestamp: Semua tabel utama memiliki `created_at timestamptz default now()` dan `updated_at timestamptz default now()`.
- **Fitur Chat Ditiadakan:** Tidak ada tabel `chat_messages` atau `chat_rooms`.

---

## 2. PostgreSQL Enums Resmi
```sql
-- Role resmi aplikasi (5 role mutlak)
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

## 3. Entitas & Tabel Utama

### A. Pengguna & Otorisasi
- **`profiles`**: Menghubungkan user Supabase Auth (`auth.users.id`) dengan data aplikasi.
  - Kolom: `id (uuid PK)`, `name (text)`, `email (text)`, `login_identifier (text unique - NIS untuk murid)`, `role (app_role)`, `avatar_url (text)`, `phone (text)`, `is_active (boolean)`, `must_change_password (boolean)`.
- **`positions`**: Jabatan dinamis di bawah role `guru`.
  - Kolom: `id (uuid PK)`, `code (text unique)`, `name (text)`, `description (text)`.
  - Jabatan bawaan: `kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`.
- **`teacher_positions`**: Pivot relasi guru dengan satu atau lebih jabatan.
  - Kolom: `teacher_id (uuid FK profiles)`, `position_id (uuid FK positions)`.

### B. Struktur Akademik & Kelas
- **`academic_years`**: Tahun ajaran (misal 2026/2027) dan semester (Ganjil/Genap), `is_active (boolean)`.
- **`classes`**: Rombel kelas (misal Kelas 1A, 2B), `grade_level (int)`, `academic_year_id (uuid FK)`, `homeroom_teacher_id (uuid FK profiles - Wali Kelas)`.
- **`subject_courses`**: Daftar mata pelajaran (Pendidikan Agama Islam, Tematik, Bahasa Arab, Tahfidz, Matematika, dll.).
- **`class_subjects`**: Pemetaan mata pelajaran di tiap kelas beserta guru pengampunya (`teacher_id`).
- **`schedules`**: Jadwal tatap muka (hari, jam mulai, jam selesai, kelas, mata pelajaran).

### C. Siswa, Wali Murid & PPDB
- **`registrations`**: Staging data pendaftaran calon siswa baru (PPDB Online).
  - Kolom: `id (uuid PK)`, `registration_number (text unique)`, `full_name (text)`, `gender (text)`, `birth_place (text)`, `birth_date (date)`, `parent_name (text)`, `parent_phone (text)`, `parent_email (text)`, `status (registration_status default 'submitted')`, `document_urls (jsonb)`, `notes (text)`.
  - Alur: Data calon siswa disimpan di sini dan **hanya dipromosikan ke tabel `students` serta dibuatkan akun login** setelah diverifikasi dan dinyatakan diterima oleh admin.
- **`students`**: Data pokok siswa aktif.
  - Kolom: `id (uuid PK, references profiles.id)`, `nis (text unique)`, `nisn (text unique)`, `class_id (uuid FK classes)`, `birth_place (text)`, `birth_date (date)`, `gender (text)`, `enrollment_year (int)`.
- **`guardians`**: Data orang tua/wali murid.
  - Kolom: `id (uuid PK, references profiles.id)`, `relationship (text - ayah/ibu/wali)`, `occupation (text)`, `address (text)`.
- **`student_guardians`**: Relasi Many-to-Many antara siswa dan wali murid.
  - Kolom: `student_id (uuid FK students)`, `guardian_id (uuid FK guardians)`, `is_primary (boolean)`.

### D. Pembelajaran, Kehadiran & Tahfidz
- **`attendance_records`**: Catatan presensi harian siswa & guru.
  - Kolom: `id (uuid PK)`, `user_id (uuid FK profiles)`, `class_id (uuid FK classes, nullable)`, `date (date)`, `status (attendance_status)`, `notes (text)`.
- **`tahfidz_records`**: Buku kendali mutabaah hafalan Al-Qur'an.
  - Kolom: `id (uuid PK)`, `student_id (uuid FK students)`, `teacher_id (uuid FK profiles)`, `surah_number (int)`, `ayat_start (int)`, `ayat_end (int)`, `predicate (tahfidz_predicate)`, `date (date)`, `notes (text)`.
- **`assignments`**: Tugas yang diberikan guru (`teacher_id`, `class_subject_id`, `title`, `description`, `due_date`, `attachment_url`).
- **`assignment_submissions`**: Pengumpulan tugas murid (`assignment_id`, `student_id`, `file_url`, `score (numeric)`, `feedback (text)`, `status (submission_status)`).
- **`student_grades`**: Rekapitulasi nilai formatif, sumatif, PTS, dan PAS per semester untuk e-raport.

### E. Keuangan, Midtrans Snap Modal & Kuitansi Web
- **`invoices`**: Tagihan pembayaran SPP dan iuran sekolah.
  - Kolom: `id (uuid PK)`, `invoice_number (text unique)`, `student_id (uuid FK students)`, `payment_type (payment_type)`, `amount (numeric)`, `due_date (date)`, `status (payment_status)`, `academic_year_id (uuid FK)`.
- **`payments`**: Transaksi pembayaran via **Midtrans Snap Modal** (popup di dashboard).
  - Kolom: `id (uuid PK)`, `invoice_id (uuid FK invoices)`, `guardian_id (uuid FK guardians)`, `order_id (text unique)`, `snap_token (text)`, `payment_method (text)`, `transaction_status (text)`, `gross_amount (numeric)`, `paid_at (timestamptz)`, `midtrans_response (jsonb)`.
- **`payment_receipts`**: Data kuitansi resmi pembayaran (diakses via web kuitansi print-friendly `@media print`).
  - Kolom: `id (uuid PK)`, `receipt_number (text unique)`, `invoice_id (uuid FK invoices)`, `payment_id (uuid FK payments)`, `issued_at (timestamptz)`.

### F. Publikasi & Informasi Sekolah
- **`school_settings`**: Konfigurasi tunggal identitas sekolah, alamat, kontak, dan logo (hanya diubah `super_admin`).
- **`news_articles`**: Berita & kegiatan sekolah (`title`, `slug`, `content`, `cover_image_url`, `status (publish_status)`).
- **`announcements`**: Pengumuman terstruktur untuk seluruh sekolah atau role spesifik.

---

## 4. Pola Row Level Security (RLS) Wajib
1. **`super_admin` & `admin`**: Akses penuh ke seluruh tabel operasional (dengan pembatasan bahwa `admin` tidak bisa mengubah konfigurasi sensitif di `school_settings` dan API keys Midtrans).
2. **`guru`**:
   - Hanya dapat membaca dan menginput data kelas/mata pelajaran yang mereka ampu (`class_subjects.teacher_id = auth.uid()`).
   - Khusus guru dengan jabatan `wali_kelas`, dapat melihat seluruh absensi dan raport murid di kelasnya.
3. **`murid`**:
   - Hanya dapat membaca (`SELECT`) jadwal kelasnya, materi belajarnya, tugas, dan capaian nilainya sendiri (`student_id = auth.uid()`).
   - Dilarang mengakses data pembayaran secara langsung.
4. **`wali_murid`**:
   - Hanya dapat membaca dan membayar tagihan anak-anak yang terdaftar pada tabel pivot `student_guardians` di mana `guardian_id = auth.uid()`.
