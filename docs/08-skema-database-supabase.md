# Skema Database Supabase

## Konvensi
- Database menggunakan PostgreSQL di Supabase.
- Nama tabel menggunakan plural snake_case.
- Nama kolom menggunakan snake_case.
- Role disimpan lowercase snake_case.
- Semua tabel utama punya `created_at` dan `updated_at`.
- Gunakan `uuid` sebagai primary key kecuali ada alasan khusus.

## Enum

```sql
create type app_role as enum (
  'super_admin',
  'admin_sekolah',
  'kepala_sekolah',
  'guru',
  'wali_kelas',
  'siswa',
  'orang_tua'
);

create type publish_status as enum ('draft', 'published', 'archived');
create type assignment_status as enum ('draft', 'published', 'closed');
create type submission_status as enum ('not_submitted', 'submitted', 'late', 'graded');
create type payment_status as enum ('draft', 'unpaid', 'pending', 'paid', 'expired', 'failed', 'cancelled');
create type payment_type as enum ('spp', 'daftar_ulang');
```

## `profiles`
Data domain untuk user Supabase Auth.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK, references `auth.users.id` |
| `name` | text | nama lengkap |
| `email` | text | email login |
| `role` | app_role | role utama |
| `avatar_url` | text | opsional |
| `phone` | text | opsional |
| `is_active` | boolean | default true |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | auto update |

## `students`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | references `profiles.id` |
| `nis` | text | nomor induk siswa |
| `nisn` | text | opsional |
| `gender` | text | `male`/`female` atau sesuai kebutuhan |
| `birth_place` | text | opsional |
| `birth_date` | date | opsional |
| `address` | text | opsional |
| `is_active` | boolean | default true |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `parents`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | references `profiles.id` |
| `occupation` | text | opsional |
| `address` | text | opsional |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `parent_students`
Relasi orang tua ke siswa.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `parent_id` | uuid | references `parents.id` |
| `student_id` | uuid | references `students.id` |
| `relationship` | text | ayah/ibu/wali |
| `is_primary` | boolean | default false |
| `created_at` | timestamptz |  |

## `teachers`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | references `profiles.id` |
| `nip` | text | opsional |
| `nuptk` | text | opsional |
| `bio` | text | opsional |
| `is_active` | boolean | default true |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `academic_years`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | contoh `2026/2027` |
| `start_date` | date |  |
| `end_date` | date |  |
| `is_active` | boolean | hanya satu aktif |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `semesters`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `academic_year_id` | uuid | references `academic_years.id` |
| `name` | text | Semester 1 / Semester 2 |
| `start_date` | date |  |
| `end_date` | date |  |
| `is_active` | boolean | hanya satu aktif per tahun ajaran |

## `classes`
Master kelas.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | contoh `1A` |
| `grade_level` | int | 1-6 |
| `description` | text | opsional |
| `is_active` | boolean | default true |

## `classrooms`
Rombongan belajar per tahun ajaran.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `class_id` | uuid | references `classes.id` |
| `academic_year_id` | uuid | references `academic_years.id` |
| `name` | text | contoh `1A - 2026/2027` |
| `homeroom_teacher_id` | uuid | references `teachers.id`, nullable |
| `is_active` | boolean | default true |

## `class_students`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `classroom_id` | uuid | references `classrooms.id` |
| `student_id` | uuid | references `students.id` |
| `joined_at` | date |  |
| `left_at` | date | nullable |
| `status` | text | active/moved/graduated |

## `subjects`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | nama mapel |
| `code` | text | opsional |
| `grade_level` | int | nullable jika umum |
| `is_active` | boolean | default true |

## `teaching_assignments`
Relasi guru, mapel, dan rombel.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `teacher_id` | uuid | references `teachers.id` |
| `subject_id` | uuid | references `subjects.id` |
| `classroom_id` | uuid | references `classrooms.id` |
| `semester_id` | uuid | references `semesters.id` |
| `created_at` | timestamptz |  |

## `schedules`
Jadwal pelajaran.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `classroom_id` | uuid | references `classrooms.id` |
| `subject_id` | uuid | references `subjects.id` |
| `teacher_id` | uuid | references `teachers.id` |
| `day_of_week` | int | 1-7 |
| `start_time` | time |  |
| `end_time` | time |  |
| `room` | text | opsional |

## `materials`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | wajib |
| `slug` | text | optional unique per class/subject |
| `description` | text | opsional |
| `content` | text | opsional |
| `file_url` | text | opsional |
| `file_path` | text | opsional |
| `external_url` | text | opsional |
| `subject_id` | uuid | references `subjects.id` |
| `classroom_id` | uuid | references `classrooms.id` |
| `teacher_id` | uuid | references `teachers.id` |
| `semester_id` | uuid | references `semesters.id` |
| `status` | publish_status | default draft |
| `published_at` | timestamptz | nullable |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `assignments`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | wajib |
| `description` | text | wajib |
| `instructions` | text | opsional |
| `file_url` | text | opsional |
| `file_path` | text | opsional |
| `subject_id` | uuid | references `subjects.id` |
| `classroom_id` | uuid | references `classrooms.id` |
| `teacher_id` | uuid | references `teachers.id` |
| `semester_id` | uuid | references `semesters.id` |
| `due_at` | timestamptz | deadline |
| `status` | assignment_status | default draft |
| `allow_late_submission` | boolean | default true |
| `max_score` | numeric | default 100 |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `assignment_submissions`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `assignment_id` | uuid | references `assignments.id` |
| `student_id` | uuid | references `students.id` |
| `answer_text` | text | opsional |
| `file_url` | text | opsional |
| `file_path` | text | opsional |
| `submitted_at` | timestamptz | nullable |
| `status` | submission_status | default `not_submitted` |
| `score` | numeric | nullable |
| `feedback` | text | nullable |
| `graded_by` | uuid | references `teachers.id` |
| `graded_at` | timestamptz | nullable |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Unique constraint:
- satu siswa hanya boleh punya satu submission per assignment.

## `grades`
Untuk rekap manual/semester jika dibutuhkan.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `student_id` | uuid | references `students.id` |
| `subject_id` | uuid | references `subjects.id` |
| `classroom_id` | uuid | references `classrooms.id` |
| `semester_id` | uuid | references `semesters.id` |
| `teacher_id` | uuid | references `teachers.id` |
| `score` | numeric | 0-100 |
| `grade_type` | text | assignment/mid/final/manual |
| `description` | text | opsional |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `announcements`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | wajib |
| `content` | text | wajib |
| `target_type` | text | all/role/class/student |
| `target_role` | app_role | nullable |
| `classroom_id` | uuid | nullable |
| `student_id` | uuid | nullable |
| `created_by` | uuid | references `profiles.id` |
| `status` | publish_status | default draft |
| `published_at` | timestamptz | nullable |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `news_posts`
Untuk berita publik sekolah.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | wajib |
| `slug` | text | unique |
| `excerpt` | text | ringkasan |
| `content` | text | isi berita |
| `cover_url` | text | opsional |
| `cover_path` | text | opsional |
| `author_id` | uuid | references `profiles.id` |
| `status` | publish_status | draft/published/archived |
| `published_at` | timestamptz | nullable |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## Payment Tables - Setup Saja

### `payment_settings`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `provider` | text | default `midtrans` |
| `environment` | text | sandbox/production |
| `merchant_id` | text | dari Midtrans |
| `client_key` | text | boleh public sesuai Midtrans |
| `is_enabled` | boolean | default false |
| `is_spp_enabled` | boolean | default false |
| `is_daftar_ulang_enabled` | boolean | default false |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Catatan:
- `server_key` tidak boleh disimpan di tabel.
- `server_key` wajib disimpan di environment variable server.

### `payment_invoices`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `student_id` | uuid | references `students.id` |
| `academic_year_id` | uuid | references `academic_years.id` |
| `type` | payment_type | spp/daftar_ulang |
| `title` | text | contoh SPP Juli 2026 |
| `amount` | numeric | nominal |
| `due_date` | date | nullable |
| `status` | payment_status | default draft |
| `notes` | text | opsional |
| `created_by` | uuid | references `profiles.id` |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `payment_transactions`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `invoice_id` | uuid | references `payment_invoices.id` |
| `provider` | text | midtrans |
| `order_id` | text | unique |
| `transaction_id` | text | nullable |
| `snap_token` | text | nullable |
| `redirect_url` | text | nullable |
| `gross_amount` | numeric |  |
| `status` | payment_status | pending/paid/failed/etc |
| `raw_payload` | jsonb | response/callback |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `audit_logs`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `actor_id` | uuid | references `profiles.id` |
| `action` | text | contoh `user.create` |
| `entity_type` | text | contoh `profiles` |
| `entity_id` | uuid | nullable |
| `metadata` | jsonb | detail perubahan |
| `created_at` | timestamptz | default now |

## Index yang Disarankan
- `profiles(role)`
- `profiles(email)`
- `students(profile_id)`
- `teachers(profile_id)`
- `class_students(classroom_id, student_id)`
- `teaching_assignments(teacher_id, classroom_id, subject_id)`
- `materials(classroom_id, subject_id, status)`
- `assignments(classroom_id, subject_id, status, due_at)`
- `assignment_submissions(assignment_id, student_id)`
- `parent_students(parent_id, student_id)`
- `payment_invoices(student_id, status, type)`
