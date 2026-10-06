# Database Schema & API Contract Reference — SDIT Fajar

Dokumen ini adalah referensi lengkap untuk skema database Supabase PostgreSQL, daftar enum resmi, model data domain, dan kontrak Server Actions di SDIT Fajar.

---

## 1. PostgreSQL Enums Resmi

```sql
-- 5 Role Resmi Sistem
create type app_role as enum (
  'super_admin',
  'admin',
  'guru',
  'murid',
  'wali_murid'
);

-- Enum Status Konten & Akademik
create type publish_status as enum ('draft', 'published', 'archived');
create type assignment_status as enum ('draft', 'published', 'closed');
create type submission_status as enum ('not_submitted', 'submitted', 'late', 'graded');
create type registration_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected');
create type attendance_status as enum ('present', 'late', 'absent', 'excused');
create type tahfidz_predicate as enum ('mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul');

-- Enum Pembayaran & Keuangan
create type payment_status as enum ('draft', 'unpaid', 'pending', 'paid', 'expired', 'failed', 'cancelled');
create type payment_type as enum (
  'spp',
  'iuran_ekstrakurikuler',
  'pendaftaran_semester_ganjil',
  'pendaftaran_semester_genap',
  'marketplace',
  'lainnya'
);
create type order_status as enum ('draft', 'pending_payment', 'paid', 'cancelled', 'fulfilled');
```

---

## 2. Entitas & Tabel Database Utama

### A. Pengguna & Jabatan
- **`profiles`**: Profil pengguna yang terhubung dengan `auth.users.id`.
  - Kolom: `id (uuid PK)`, `name (text)`, `email (text)`, `login_identifier (text unique, NIS untuk murid)`, `role (app_role)`, `avatar_url (text)`, `phone (text)`, `is_active (boolean)`, `must_change_password (boolean)`, `created_at`, `updated_at`.
- **`positions`**: Master data jabatan khusus di bawah role `guru`.
  - Kolom: `id (uuid PK)`, `code (text unique)`, `name (text)`, `description (text)`.
  - Nilai bawaan: `kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`.
- **`teacher_positions`**: Tabel pivot relasi guru dengan satu atau lebih jabatan.
  - Kolom: `teacher_id (uuid FK profiles.id)`, `position_id (uuid FK positions.id)`.

### B. Akademik & Jadwal
- **`academic_years`**: Tahun ajaran dan semester (`id`, `name`, `semester`, `is_active`).
- **`classes`**: Rombel kelas (`id`, `name`, `grade_level`, `academic_year_id`, `homeroom_teacher_id FK profiles.id`).
- **`subject_courses`**: Mata pelajaran (`id`, `code`, `name`, `description`).
- **`class_subjects`**: Pemetaan pengajar di rombel kelas (`id`, `class_id`, `subject_id`, `teacher_id FK profiles.id`).
- **`schedules`**: Jadwal pelajaran harian (`id`, `class_subject_id`, `day_of_week`, `start_time`, `end_time`).

### C. Siswa, Wali Murid & PPDB
- **`registrations`**: Staging data formulir calon siswa PPDB Online.
  - Kolom: `id (uuid PK)`, `registration_number (text unique)`, `full_name`, `gender`, `birth_place`, `birth_date`, `parent_name`, `parent_phone`, `parent_email`, `status (registration_status default 'submitted')`, `document_urls (jsonb)`, `notes`.
  - *Aturan*: Calon siswa di tabel ini **TIDAK memiliki akun login** sampai disetujui (`approved`) oleh admin.
- **`students`**: Data pokok siswa aktif terdaftar.
  - Kolom: `id (uuid PK references profiles.id)`, `nis (text unique)`, `nisn (text unique)`, `class_id (uuid FK classes)`, `birth_place`, `birth_date`, `gender`, `enrollment_year`.
- **`guardians`**: Data orang tua/wali murid aktif.
  - Kolom: `id (uuid PK references profiles.id)`, `relationship (text)`, `occupation (text)`, `address (text)`.
- **`student_guardians`**: Pivot relasi multi-anak ke wali murid.
  - Kolom: `student_id (uuid FK students.id)`, `guardian_id (uuid FK guardians.id)`, `is_primary (boolean)`.

### D. Pembelajaran, Kehadiran, & Tahfidz
- **`attendance_records`**: Presensi harian siswa dan guru (`id`, `user_id FK profiles`, `class_id`, `date`, `status`, `notes`).
- **`tahfidz_records`**: Mutabaah setoran Al-Qur'an (`id`, `student_id FK students`, `teacher_id FK profiles`, `surah_number`, `ayat_start`, `ayat_end`, `predicate`, `date`, `notes`).
- **`assignments`**: Penugasan siswa (`id`, `class_subject_id`, `title`, `description`, `due_date`, `attachment_url`).
- **`assignment_submissions`**: Pengumpulan tugas murid (`id`, `assignment_id`, `student_id`, `file_url`, `score`, `feedback`, `status`).
- **`student_grades`**: Rekap nilai rapor semesteran (`id`, `student_id`, `class_subject_id`, `formative_score`, `summative_score`, `final_score`).

### E. Keuangan & Pembayaran Midtrans
- **`invoices`**: Tagihan SPP, formulir, atau kegiatan sekolah.
  - Kolom: `id (uuid PK)`, `invoice_number (text unique)`, `student_id (uuid FK students)`, `payment_type`, `amount (numeric)`, `due_date`, `status (payment_status default 'unpaid')`.
- **`payments`**: Transaksi pembayaran Midtrans Snap Popup.
  - Kolom: `id (uuid PK)`, `invoice_id (uuid FK invoices)`, `guardian_id (uuid FK guardians)`, `order_id (text unique)`, `snap_token`, `payment_method`, `gross_amount`, `paid_at`, `midtrans_response (jsonb)`.
- **`payment_receipts`**: Kuitansi resmi siap cetak (`id`, `receipt_number unique`, `invoice_id`, `payment_id`, `issued_at`).

### F. Informasi Sekolah & Pengaturan
- **`school_settings`**: Konfigurasi identitas sekolah, alamat, kontak, dan logo (khusus diedit `super_admin`).
- **`news_articles`**: Berita & kegiatan sekolah (`id`, `title`, `slug`, `content`, `cover_image_url`, `status`).
- **`announcements`**: Pengumuman terstruktur berbasis target role.

---

## 3. Kontrak Server Actions (`src/types/action.types.ts`)

```typescript
export type ActionSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ActionError = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'NOT_FOUND' | 'SERVER_ERROR';
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;
```

---

## 4. Matriks Akses Row Level Security (RLS)

1. **`super_admin` & `admin`**: Akses penuh ke seluruh tabel operasional (hanya `super_admin` yang dapat mengubah `school_settings` dan konfigurasi Midtrans).
2. **`guru`**: Hanya dapat mengakses rombel/kelas yang diampu (`class_subjects.teacher_id = auth.uid()`). Jabatan `wali_kelas` membuka akses rekap seluruh kelas asuhannya.
3. **`murid`**: Hanya membaca data profil, jadwal, tugas, dan nilai dirinya sendiri (`student_id = auth.uid()`). Dilarang mengakses rute pembayaran.
4. **`wali_murid`**: Hanya dapat mengakses data siswa dan tagihan anak yang terhubung via `student_guardians.guardian_id = auth.uid()`.
