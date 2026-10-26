# Database Schema & API Contract Reference — SDIT Fajar

Dokumen ini adalah referensi lengkap untuk skema database Supabase PostgreSQL, daftar enum resmi, model data domain, dan kontrak Server Actions di SDIT Fajar yang diselaraskan 100% dengan dokumen acuan resmi [08-skema-database-supabase.md](file:///c:/Users/muhaz/OneDrive/Desktop/sdit-fajar/docs/PRD/08-skema-database-supabase.md).

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

-- Status Konten & Akademik
create type publish_status as enum ('draft', 'published', 'archived');
create type assignment_status as enum ('draft', 'published', 'closed');
create type submission_status as enum ('not_submitted', 'submitted', 'late', 'graded');
create type registration_status as enum ('submitted', 'under_review', 'approved', 'rejected');
create type document_verification_status as enum ('pending', 'valid', 'invalid');
create type attendance_status as enum ('present', 'late', 'absent', 'excused');
create type tahfidz_predicate as enum ('mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul');
create type admission_wave_status as enum ('draft', 'open', 'closed', 'archived');

-- Status Pembayaran & Keuangan (Catatan: Modul Payment Ditunda / Deferred)
create type payment_status as enum ('draft', 'unpaid', 'pending', 'paid', 'expired', 'failed', 'cancelled');
create type invoice_type as enum (
  'spp',
  'iuran_ekstrakurikuler',
  'pendaftaran_semester_ganjil',
  'pendaftaran_semester_genap',
  'marketplace',
  'lainnya'
);
create type order_status as enum ('draft', 'pending', 'confirmed', 'fulfilled', 'cancelled');
```

---

## 2. Entitas & Tabel Database Utama (Baku Sesuai PRD 08)

### A. Pengguna & Jabatan
- **`profiles`**: Profil pengguna yang terhubung 1-to-1 dengan `auth.users.id`.
  - Kolom: `id (uuid PK)`, `name (text)`, `email (text)`, `login_identifier (text unique, NIS untuk murid)`, `role (app_role)`, `avatar_url (text)`, `phone (text)`, `is_active (boolean)`, `must_change_password (boolean)`, `created_at`, `updated_at`.
- **`positions`**: Master data jabatan khusus di bawah role `guru`.
  - Kolom: `id (uuid PK)`, `code (text unique)`, `name (text)`, `category (text)`, `description (text)`, `is_active (boolean)`.
  - Jabatan bawaan: `kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`.
- **`teachers`**: Data pelengkap tenaga pendidik.
  - Kolom: `id (uuid PK)`, `profile_id (uuid FK profiles.id)`, `nip (text)`, `nuptk (text)`, `bio (text)`, `is_active (boolean)`.
- **`teacher_positions`**: Tabel pivot relasi guru dengan satu atau lebih jabatan.
  - Kolom: `id (uuid PK)`, `teacher_id (uuid FK teachers.id)`, `position_id (uuid FK positions.id)`, `classroom_id (uuid FK classrooms.id, nullable)`, `academic_year_id (uuid FK academic_years.id)`.

### B. Master Akademik, Kelas & Jadwal
- **`academic_years`**: Tahun ajaran (`id (uuid PK)`, `name (contoh '2026/2027')`, `start_date`, `end_date`, `is_active`).
- **`semesters`**: Semester (`id (uuid PK)`, `academic_year_id (uuid FK academic_years.id)`, `name (Semester 1 / 2)`, `start_date`, `end_date`, `is_active`).
- **`school_period_settings`**: Penentuan bulan dan tahun aktif operasional untuk presensi dan akademik.
- **`classes`**: Master tingkat kelas (`id (uuid PK)`, `name (contoh '1')`, `grade_level (int 1-6)`).
- **`classrooms`**: Rombongan belajar per tahun ajaran (`id (uuid PK)`, `class_id (uuid FK classes.id)`, `academic_year_id (uuid FK academic_years.id)`, `name (contoh '1A - 2026/2027')`, `homeroom_teacher_id (uuid FK teachers.id)`).
- **`class_students`**: Penempatan santri pada rombel (`id`, `classroom_id FK classrooms`, `student_id FK students`, `status`).
- **`subjects`**: Master mata pelajaran (`id (uuid PK)`, `name`, `code`, `grade_level`).
- **`teaching_assignments`**: Penugasan guru mengajar mapel di rombel (`id`, `teacher_id FK teachers`, `classroom_id FK classrooms`, `subject_id FK subjects`, `academic_year_id`).
- **`schedules`**: Jadwal pelajaran harian (`id`, `teaching_assignment_id`, `day_of_week (1-5)`, `start_time`, `end_time`).

### C. Siswa, Wali Murid & PPDB Staging
- **`admission_waves`**: Gelombang pendaftaran PPDB (Gelombang 1–3, kuota default 100 santri, target periode).
- **`student_registration_applications`**: Staging formulir pendaftaran calon santri baru.
  - Kolom: `id (uuid PK)`, `admission_wave_id (uuid FK admission_waves.id)`, `registration_number (text unique)`, `student_name`, `nik`, `nisn`, `gender`, `birth_place`, `birth_date`, `parent_name`, `parent_phone`, `parent_email`, `status (registration_status default 'submitted')`, `admin_notes`.
  - *Aturan Penting*: Data calon siswa di tabel ini **BELUM memiliki akun Auth** sampai disetujui (`status = 'approved'`) oleh admin panitia.
- **`student_registration_documents`**: Berkas fisik unggahan persyaratan pendaftaran (Pas Foto, Akta, KK, KTP, SKL TK, Surat Sehat).
  - Kolom: `id (uuid PK)`, `application_id (uuid FK student_registration_applications.id)`, `document_type`, `file_url`, `file_path`, `verification_status`.
- **`students`**: Data pokok santri aktif terdaftar.
  - Kolom: `id (uuid PK)`, `profile_id (uuid FK profiles.id)`, `nis (text unique)`, `nisn (text unique)`, `birth_place`, `birth_date`, `gender`, `enrollment_year`.
- **`parents`**: Data pokok orang tua/wali murid aktif.
  - Kolom: `id (uuid PK)`, `profile_id (uuid FK profiles.id)`, `phone_wa (text unique)`, `relationship (text)`.
- **`parent_students`**: Relasi penghubung siswa dengan orang tua/wali.
  - Kolom: `id (uuid PK)`, `parent_id (uuid FK parents.id)`, `student_id (uuid FK students.id)`, `relationship_type`, `is_primary`.

### D. Pembelajaran, Kehadiran & Tahfidz
- **`teacher_attendances`**: Presensi harian guru.
  - Kolom: `id`, `teacher_id FK teachers`, `date`, `check_in_time (06.30-07.30)`, `check_out_time (>= 14.30)`, `status`, `is_weekend`.
- **`student_attendances`**: Presensi santri per jadwal mata pelajaran pada hari kerja (Senin–Jumat).
  - Kolom: `id`, `student_id FK students`, `schedule_id FK schedules`, `date`, `status ('present','late','absent','excused')`.
- **`tahfidz_records`**: Mutabaah setoran Al-Qur'an santri.
  - Kolom: `id`, `student_id FK students`, `teacher_id FK teachers`, `surah_number (1-114)`, `ayat_start`, `ayat_end`, `predicate (tahfidz_predicate)`, `notes`, `date`.
- **`materials`**: Modul dan materi ajar pembelajaran (`id`, `teaching_assignment_id`, `title`, `content`, `file_url`, `status`).
- **`assignments`**: Penugasan tugas murid (`id`, `teaching_assignment_id`, `title`, `description`, `due_at`, `status`).
- **`assignment_submissions`**: Pengumpulan tugas murid (`id`, `assignment_id`, `student_id`, `file_url`, `score (numeric)`, `feedback`, `is_late`).
- **`grades`**: Rekap nilai akhir semester / buku rapor santri.

### E. Marketplace Sekolah (Pemesanan & Reservasi Fisik)
- **`marketplace_products`**: Katalog buku pembelajaran dan atribut seragam sekolah (`id`, `title`, `description`, `price`, `stock`, `cover_url`, `status`).
- **`marketplace_orders`**: Pemesanan perlengkapan sekolah oleh akun `wali_murid` untuk diambil & diselesaikan di sekolah.
  - Kolom: `id`, `order_number unique`, `parent_id FK parents`, `student_id FK students`, `status ('pending','confirmed','fulfilled','cancelled')`, `total_amount`.
- **`marketplace_order_items`**: Rincian item produk yang dipesan (`id`, `order_id`, `product_id`, `quantity`, `unit_price`).

### F. Keuangan & Pembayaran (Status: Ditunda / Deferred)
- **`payment_invoices`**, **`payment_transactions`**, **`payment_receipts`**:
  - Arsitektur tabel pembayaran online Midtrans diarsipkan secara rapi di PRD 08 & PRD 13 sebagai cadangan fase lanjutan pasca-MVP.

### G. Informasi Sekolah, Berita & Audit
- **`school_settings`**: Konfigurasi identitas sekolah, alamat, kontak, dan logo (khusus diedit `super_admin`).
- **`news`**: Berita & kegiatan sekolah (`id`, `title`, `slug`, `content`, `cover_image_url`, `status`).
- **`announcements`**: Pengumuman terstruktur sekolah (`id`, `author_id`, `target_type ('all','role','class')`, `target_role`, `target_classroom_id`, `title`, `content`).
- **`audit_logs`**: Rekam jejak seluruh mutasi sensitif sistem.

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

1. **`super_admin` & `admin`**: Akses penuh ke seluruh tabel operasional sekolah.
2. **`guru`**: Hanya dapat mengelola materi, tugas, dan presensi untuk rombel/mapel yang ditugaskan padanya (`teaching_assignments`). Jabatan `wali_kelas` membuka akses rekap seluruh kelas binaannya di `classrooms`.
3. **`murid`**: Hanya membaca data profil, jadwal, tugas, nilai, dan mutabaah tahfidz miliknya sendiri.
4. **`wali_murid`**: Hanya dapat mengakses data perkembangan akademik, presensi, dan mutabaah anak yang terhubung melalui tabel `parent_students`.
