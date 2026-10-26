-- ==============================================================================
-- FASE 3: MIGRATION 03 - PPDB STAGING, LMS, ATTENDANCE, TAHFIDZ & CONTENT
-- Sesuai Dokumen PRD 08, 16 (LMS), 17 (Pengumuman), 23 (PPDB)
-- ==============================================================================

-- 1. admission_waves: Gelombang Penerimaan Peserta Didik Baru (PPDB)
create table if not exists public.admission_waves (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  semester_id uuid references public.semesters(id) on delete set null,
  wave_number int not null check (wave_number between 1 and 10),
  title text not null, -- contoh 'Gelombang 1 - Jalur Prestasi'
  description text,
  start_date date not null,
  end_date date not null,
  quota int not null default 100,
  registration_fee numeric not null default 0,
  observation_date date,
  announcement_date date,
  status admission_wave_status not null default 'draft',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_admission_wave_year_num unique (academic_year_id, wave_number)
);

create index if not exists idx_admission_waves_active on public.admission_waves(is_active, status);

drop trigger if exists set_admission_waves_updated_at on public.admission_waves;
create trigger set_admission_waves_updated_at
  before update on public.admission_waves
  for each row execute function public.handle_updated_at();

-- 2. student_registration_applications: Staging Pendaftaran Murid Baru
create table if not exists public.student_registration_applications (
  id uuid primary key default gen_random_uuid(),
  admission_wave_id uuid not null references public.admission_waves(id) on delete restrict,
  registration_number text not null unique, -- contoh PPDB-2026-G1-0001
  student_name text not null,
  nik text,
  nisn text,
  gender text check (gender in ('male', 'female', 'L', 'P')),
  birth_place text,
  birth_date date,
  child_number int,
  total_siblings int,
  special_needs text,
  previous_school text,
  parent_name text not null,
  father_name text,
  father_nik text,
  father_occupation text,
  father_phone text,
  mother_name text,
  mother_nik text,
  mother_occupation text,
  mother_phone text,
  parent_phone text not null,
  parent_email text,
  address text,
  status registration_status not null default 'submitted',
  observation_score numeric,
  admin_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_registration_wave on public.student_registration_applications(admission_wave_id);
create index if not exists idx_registration_status on public.student_registration_applications(status);
create index if not exists idx_registration_number on public.student_registration_applications(registration_number);

drop trigger if exists set_student_registration_applications_updated_at on public.student_registration_applications;
create trigger set_student_registration_applications_updated_at
  before update on public.student_registration_applications
  for each row execute function public.handle_updated_at();

-- 3. student_registration_documents: Berkas Persyaratan PPDB (private bucket)
create table if not exists public.student_registration_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.student_registration_applications(id) on delete cascade,
  document_type text not null, -- pas_foto, akta_kelahiran, kartu_keluarga, ktp_ortu, ijazah_tk, dll.
  file_url text,
  file_path text not null, -- path pada bucket 'registration-files'
  original_filename text,
  mime_type text,
  file_size bigint,
  verification_status document_verification_status not null default 'pending',
  admin_feedback text,
  created_at timestamptz not null default now()
);

create index if not exists idx_reg_docs_application on public.student_registration_documents(application_id);

-- 4. teacher_attendances: Presensi Guru (Check-In & Check-Out)
create table if not exists public.teacher_attendances (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  attendance_date date not null,
  session text not null check (session in ('check_in', 'check_out')),
  recorded_at timestamptz not null default now(),
  status attendance_status not null default 'present',
  recorded_by uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_teacher_attendance unique (teacher_id, attendance_date, session)
);

create index if not exists idx_teacher_attendance_date on public.teacher_attendances(attendance_date, session);

drop trigger if exists set_teacher_attendances_updated_at on public.teacher_attendances;
create trigger set_teacher_attendances_updated_at
  before update on public.teacher_attendances
  for each row execute function public.handle_updated_at();

-- 5. student_attendances: Presensi Murid per Jadwal Pelajaran
create table if not exists public.student_attendances (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  attendance_date date not null,
  status attendance_status not null default 'present',
  recorded_by uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_student_attendance unique (student_id, schedule_id, attendance_date)
);

create index if not exists idx_student_attendance_lookup on public.student_attendances(classroom_id, attendance_date);
create index if not exists idx_student_attendance_student on public.student_attendances(student_id);

drop trigger if exists set_student_attendances_updated_at on public.student_attendances;
create trigger set_student_attendances_updated_at
  before update on public.student_attendances
  for each row execute function public.handle_updated_at();

-- 6. materials: Modul & Materi Ajar Digital
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  description text,
  content text,
  file_url text,
  file_path text, -- storage path di bucket 'lms-files'
  external_url text,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  semester_id uuid not null references public.semesters(id) on delete cascade,
  status publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_materials_lookup on public.materials(classroom_id, subject_id, status);

drop trigger if exists set_materials_updated_at on public.materials;
create trigger set_materials_updated_at
  before update on public.materials
  for each row execute function public.handle_updated_at();

-- 7. assignments: Tugas & Evaluasi Siswa
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  instructions text,
  file_url text,
  file_path text, -- storage path di bucket 'lms-files'
  subject_id uuid not null references public.subjects(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  semester_id uuid not null references public.semesters(id) on delete cascade,
  due_at timestamptz,
  status assignment_status not null default 'draft',
  allow_late_submission boolean not null default true,
  max_score numeric not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_assignments_lookup on public.assignments(classroom_id, subject_id, status, due_at);

drop trigger if exists set_assignments_updated_at on public.assignments;
create trigger set_assignments_updated_at
  before update on public.assignments
  for each row execute function public.handle_updated_at();

-- 8. assignment_submissions: Pengumpulan Tugas oleh Murid
create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  answer_text text,
  file_url text,
  file_path text, -- storage path di bucket 'lms-files'
  submitted_at timestamptz,
  status submission_status not null default 'not_submitted',
  score numeric check (score between 0 and 100),
  feedback text,
  graded_by uuid references public.teachers(id) on delete set null,
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_assignment_student unique (assignment_id, student_id)
);

create index if not exists idx_assignment_submissions_assignment on public.assignment_submissions(assignment_id);
create index if not exists idx_assignment_submissions_student on public.assignment_submissions(student_id);

drop trigger if exists set_assignment_submissions_updated_at on public.assignment_submissions;
create trigger set_assignment_submissions_updated_at
  before update on public.assignment_submissions
  for each row execute function public.handle_updated_at();

-- 9. grades: Rekapitulasi Nilai Akademik
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  semester_id uuid not null references public.semesters(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  score numeric not null check (score between 0 and 100),
  grade_type text not null default 'manual', -- assignment, mid, final, manual
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_grades_lookup on public.grades(student_id, classroom_id, subject_id);

drop trigger if exists set_grades_updated_at on public.grades;
create trigger set_grades_updated_at
  before update on public.grades
  for each row execute function public.handle_updated_at();

-- 10. announcements: Pengumuman Terarah Sekolah
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  target_type text not null default 'all' check (target_type in ('all', 'role', 'class', 'student')),
  target_role app_role,
  classroom_id uuid references public.classrooms(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  status publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_announcements_target on public.announcements(target_type, target_role, status);

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
  before update on public.announcements
  for each row execute function public.handle_updated_at();

-- 11. news_posts: Berita & Publikasi Sekolah Publik
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_url text,
  cover_path text,
  author_id uuid not null references public.profiles(id) on delete cascade,
  status publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_posts_slug on public.news_posts(slug);
create index if not exists idx_news_posts_status on public.news_posts(status, published_at desc);

drop trigger if exists set_news_posts_updated_at on public.news_posts;
create trigger set_news_posts_updated_at
  before update on public.news_posts
  for each row execute function public.handle_updated_at();

-- 12. tahfidz_records: Mutabaah Hafalan Al-Qur'an & Tahsin
create table if not exists public.tahfidz_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  surah_number int not null check (surah_number between 1 and 114),
  ayat_start int not null check (ayat_start >= 1),
  ayat_end int not null check (ayat_end >= ayat_start),
  predicate tahfidz_predicate not null default 'jayyid',
  record_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tahfidz_student on public.tahfidz_records(student_id, record_date desc);

drop trigger if exists set_tahfidz_records_updated_at on public.tahfidz_records;
create trigger set_tahfidz_records_updated_at
  before update on public.tahfidz_records
  for each row execute function public.handle_updated_at();

-- 13. import_batches: Riwayat Eksekusi Batch CSV Import
create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  imported_by uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null, -- students, teachers, parents
  template_version text not null default 'v1.0',
  source_file_url text,
  total_rows int not null default 0,
  success_rows int not null default 0,
  failed_rows int not null default 0,
  errors jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_import_batches_actor on public.import_batches(imported_by, created_at desc);
