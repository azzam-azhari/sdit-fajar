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
create type chat_message_status as enum ('sent', 'deleted');
```

## `profiles`
Data domain untuk user Supabase Auth.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK, references `auth.users.id` |
| `name` | text | nama lengkap |
| `email` | text | email login |
| `login_identifier` | text | unique; NIS untuk murid, identifier resmi untuk role lain |
| `role` | app_role | role utama |
| `avatar_url` | text | opsional |
| `phone` | text | opsional |
| `is_active` | boolean | default true |
| `must_change_password` | boolean | default false; true untuk password awal |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | auto update |

## `school_settings`
Satu baris konfigurasi identitas sekolah dan konten kontak utama. Perubahan identitas/kontak hanya oleh `super_admin`.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `school_name` | text | nama sekolah |
| `logo_url` | text | URL/storage path logo sekolah |
| `address` | text | alamat resmi |
| `phone` | text | nomor telepon resmi |
| `whatsapp` | text | nomor WhatsApp resmi |
| `email` | text | email resmi |
| `maps_url` | text | URL peta |
| `social_links` | jsonb | URL sosial media |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `school_period_settings`
Periode operasional yang dipakai absensi, payment, dan modul terkait.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `academic_year_id` | uuid | references `academic_years.id` |
| `semester_id` | uuid | references `semesters.id`, nullable |
| `active_month` | int | 1-12 |
| `active_year` | int | tahun kalender |
| `teacher_weekend_attendance_enabled` | boolean | default false; dikendalikan kepala sekolah |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

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
Relasi wali murid ke siswa.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `parent_id` | uuid | references `parents.id` |
| `student_id` | uuid | references `students.id` |
| `relationship` | text | ayah/ibu/wali |
| `is_primary` | boolean | default false |
| `created_at` | timestamptz |  |

## `student_registration_applications`
Pendaftaran murid baru dari halaman publik. Data sensitif hanya dapat dibaca role yang berwenang.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `student_name` | text | nama calon murid |
| `birth_place` | text | tempat lahir |
| `birth_date` | date | tanggal lahir |
| `gender` | text | jenis kelamin |
| `parent_name` | text | nama wali pendaftar |
| `parent_phone` | text | nomor kontak |
| `parent_email` | text | email kontak |
| `address` | text | alamat |
| `status` | registration_status | default submitted |
| `reviewed_by` | uuid | references `profiles.id`, nullable |
| `reviewed_at` | timestamptz | nullable |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## `student_registration_documents`
Setiap dokumen unggahan pendaftaran wajib disimpan sebagai URL/path yang terkait ke application.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `application_id` | uuid | references `student_registration_applications.id` |
| `document_type` | text | contoh kartu keluarga/akta |
| `file_url` | text | URL atau signed URL reference |
| `file_path` | text | path Supabase Storage |
| `original_filename` | text | nama asli |
| `mime_type` | text | tipe file |
| `file_size` | bigint | ukuran byte |
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
| `name` | text | contoh `1` |
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

## `teacher_attendances`
Absensi guru untuk sesi masuk dan pulang.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `teacher_id` | uuid | references `teachers.id` |
| `attendance_date` | date | tanggal absensi |
| `session` | text | `check_in` atau `check_out` |
| `recorded_at` | timestamptz | waktu server |
| `status` | attendance_status | present/late/absent/excused |
| `recorded_by` | uuid | references `profiles.id`, nullable untuk self-service |
| `notes` | text | opsional |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Rules:
- Sesi normal: check-in 07.30 dan check-out 14.30, Senin-Jumat.
- Sabtu-Minggu hanya boleh dibuat jika `school_period_settings.teacher_weekend_attendance_enabled = true`.
- Waktu final memakai server time; client tidak dipercaya.
- Satu guru hanya memiliki satu record per tanggal dan sesi.

## `student_attendances`
Absensi murid per jadwal pelajaran.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `student_id` | uuid | references `students.id` |
| `schedule_id` | uuid | references `schedules.id` |
| `classroom_id` | uuid | references `classrooms.id` |
| `attendance_date` | date | tanggal pembelajaran |
| `status` | attendance_status | present/late/absent/excused |
| `recorded_by` | uuid | references `profiles.id` |
| `notes` | text | opsional |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Rules:
- Hanya jadwal Senin-Jumat yang dapat menghasilkan absensi siswa.
- Guru hanya mencatat untuk assignment mengajarnya; wali kelas dapat mencatat kelas binaannya.
- Satu siswa hanya memiliki satu record per jadwal dan tanggal.

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

## Chat Real-time

### `chat_threads`
| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | judul thread |
| `created_by` | uuid | references `profiles.id` |
| `is_archived` | boolean | default false |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `chat_thread_members`
| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `thread_id` | uuid | references `chat_threads.id` |
| `profile_id` | uuid | references `profiles.id` |
| `joined_at` | timestamptz |  |
| `last_read_at` | timestamptz | nullable |

### `chat_messages`
| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `thread_id` | uuid | references `chat_threads.id` |
| `sender_id` | uuid | references `profiles.id` |
| `body` | text | wajib |
| `status` | chat_message_status | default sent |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Realtime hanya dipakai untuk thread yang dapat dibaca oleh RLS; database tetap menjadi sumber kebenaran.

## Marketplace Konten

### `marketplace_products`
| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | judul buku/konten |
| `slug` | text | unique |
| `description` | text | ringkasan |
| `cover_url` | text | URL/path cover |
| `file_url` | text | URL/path file digital, private disarankan |
| `file_path` | text | path Storage |
| `price` | numeric | nominal |
| `is_published` | boolean | default false |
| `created_by` | uuid | references `profiles.id` |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `marketplace_orders`
| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `parent_id` | uuid | references `parents.id` |
| `student_id` | uuid | references `students.id`, nullable |
| `status` | order_status | default draft |
| `total_amount` | numeric | total order |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `marketplace_order_items`
| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `order_id` | uuid | references `marketplace_orders.id` |
| `product_id` | uuid | references `marketplace_products.id` |
| `quantity` | int | default 1 |
| `unit_price` | numeric | snapshot harga |
| `created_at` | timestamptz |  |

## Payment Tables - Midtrans Terkontrol

### `payment_settings`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `provider` | text | default `midtrans` |
| `environment` | text | sandbox/production |
| `merchant_id` | text | dari Midtrans |
| `client_key` | text | boleh public sesuai Midtrans |
| `provider_logo_url` | text | URL/path logo Midtrans untuk receipt |
| `is_enabled` | boolean | default false |
| `is_spp_enabled` | boolean | default false |
| `is_iuran_enabled` | boolean | default false |
| `is_pendaftaran_semester_enabled` | boolean | default false |
| `is_marketplace_enabled` | boolean | default false |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Catatan:
- `server_key` tidak boleh disimpan di tabel.
- `server_key` wajib disimpan di environment variable server.

### `payment_invoices`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `student_id` | uuid | references `students.id`, nullable untuk invoice marketplace |
| `parent_id` | uuid | references `parents.id`, wajib untuk invoice marketplace |
| `marketplace_order_id` | uuid | references `marketplace_orders.id`, nullable |
| `academic_year_id` | uuid | references `academic_years.id` |
| `type` | payment_type | spp/iuran/pendaftaran semester/marketplace/lainnya |
| `billing_month` | int | 1-12 untuk SPP/iuran, nullable |
| `billing_year` | int | tahun tagihan, nullable |
| `title` | text | contoh SPP Juli 2026 |
| `amount` | numeric | nominal |
| `due_date` | date | nullable |
| `reminder_offsets` | int[] | default `{30,14,7,3,1}` hari sebelum jatuh tempo |
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
| `paid_at` | timestamptz | waktu settlement, nullable |
| `payer_bank_name` | text | nullable |
| `payer_bank_account_number` | text | nullable, data sensitif |
| `payer_bank_account_name` | text | nullable |
| `destination_bank_name` | text | nullable |
| `destination_bank_account_number` | text | nullable |
| `destination_bank_account_name` | text | nullable |
| `raw_payload` | jsonb | response/callback |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `payment_receipts`
Snapshot bukti pembayaran yang hanya dapat dibaca wali murid terkait setelah transaksi valid.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `invoice_id` | uuid | references `payment_invoices.id` |
| `transaction_id` | uuid | references `payment_transactions.id` |
| `student_id` | uuid | references `students.id` |
| `class_name` | text | snapshot kelas saat pembayaran |
| `school_logo_url` | text | URL/path logo sekolah |
| `midtrans_logo_url` | text | URL/path logo Midtrans |
| `paid_at` | timestamptz | tanggal dan jam pembayaran |
| `invoice_number` | text | nomor invoice |
| `student_name` | text | snapshot nama siswa |
| `amount` | numeric | jumlah pembayaran |
| `status` | payment_status | status pembayaran |
| `payer_bank_name` | text | nullable |
| `payer_bank_account_number` | text | nullable |
| `payer_bank_account_name` | text | nullable |
| `destination_bank_name` | text | nullable |
| `destination_bank_account_number` | text | nullable |
| `destination_bank_account_name` | text | nullable |
| `created_at` | timestamptz |  |

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

## `import_batches`
Riwayat import CSV untuk audit dan pelacakan hasil.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `imported_by` | uuid | references `profiles.id`, wajib `super_admin` |
| `entity_type` | text | students/teachers/parents/dll |
| `template_version` | text | versi template |
| `source_file_url` | text | URL/path CSV yang diunggah |
| `total_rows` | int | jumlah baris |
| `success_rows` | int | baris berhasil |
| `failed_rows` | int | baris gagal |
| `errors` | jsonb | error per baris |
| `created_at` | timestamptz |  |

## Index yang Disarankan
- `profiles(role)`
- `profiles(email)`
- `profiles(login_identifier)` unique
- `students(profile_id)`
- `teachers(profile_id)`
- `class_students(classroom_id, student_id)`
- `teaching_assignments(teacher_id, classroom_id, subject_id)`
- `materials(classroom_id, subject_id, status)`
- `assignments(classroom_id, subject_id, status, due_at)`
- `assignment_submissions(assignment_id, student_id)`
- `parent_students(parent_id, student_id)`
- `payment_invoices(student_id, status, type)`
- `payment_transactions(order_id)` unique
- `teacher_attendances(teacher_id, attendance_date, session)` unique
- `student_attendances(student_id, schedule_id, attendance_date)` unique
- `chat_thread_members(thread_id, profile_id)` unique
- `chat_messages(thread_id, created_at)`
- `marketplace_products(slug)` unique
- `payment_receipts(invoice_id, transaction_id)` unique
