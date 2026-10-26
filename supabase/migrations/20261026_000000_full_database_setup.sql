-- ==============================================================================
-- FASE 3: MIGRATION 01 - POSTGRESQL ENUMS & BASE TIMESTAMP HELPERS
-- Sesuai Dokumen PRD 08 (Skema Database) & PRD 09 (RLS & Keamanan Data)
-- ==============================================================================

-- 1. Inisialisasi Ekstensi pgcrypto untuk UUID (jika belum aktif)
create extension if not exists "pgcrypto";

-- 2. PostgreSQL Enums Resmi (12 Enum Aplikasi SDIT Fajar)
do $$
begin
  -- app_role: 5 role mutlak aplikasi
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum (
      'super_admin',
      'admin',
      'guru',
      'murid',
      'wali_murid'
    );
  end if;

  -- publish_status
  if not exists (select 1 from pg_type where typname = 'publish_status') then
    create type publish_status as enum ('draft', 'published', 'archived');
  end if;

  -- assignment_status
  if not exists (select 1 from pg_type where typname = 'assignment_status') then
    create type assignment_status as enum ('draft', 'published', 'closed');
  end if;

  -- submission_status
  if not exists (select 1 from pg_type where typname = 'submission_status') then
    create type submission_status as enum ('not_submitted', 'submitted', 'late', 'graded');
  end if;

  -- payment_status
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('draft', 'unpaid', 'pending', 'paid', 'expired', 'failed', 'cancelled');
  end if;

  -- payment_type
  if not exists (select 1 from pg_type where typname = 'payment_type') then
    create type payment_type as enum (
      'spp',
      'iuran_ekstrakurikuler',
      'pendaftaran_semester_ganjil',
      'pendaftaran_semester_genap',
      'marketplace',
      'lainnya'
    );
  end if;

  -- registration_status (PPDB)
  if not exists (select 1 from pg_type where typname = 'registration_status') then
    create type registration_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected');
  end if;

  -- admission_wave_status (Gelombang PPDB)
  if not exists (select 1 from pg_type where typname = 'admission_wave_status') then
    create type admission_wave_status as enum ('draft', 'open', 'closed', 'archived');
  end if;

  -- document_verification_status
  if not exists (select 1 from pg_type where typname = 'document_verification_status') then
    create type document_verification_status as enum ('pending', 'valid', 'invalid');
  end if;

  -- attendance_status
  if not exists (select 1 from pg_type where typname = 'attendance_status') then
    create type attendance_status as enum ('present', 'late', 'absent', 'excused');
  end if;

  -- order_status (Marketplace)
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('draft', 'pending_payment', 'paid', 'cancelled', 'fulfilled');
  end if;

  -- tahfidz_predicate
  if not exists (select 1 from pg_type where typname = 'tahfidz_predicate') then
    create type tahfidz_predicate as enum ('mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul');
  end if;
end $$;

-- 3. Trigger Function untuk otomatisasi updated_at (tidak bergantung tabel manapun)
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 4. Helper Base Auth Function (hanya memanggil auth.uid(), tidak butuh tabel domain)
create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;
-- ==============================================================================
-- FASE 3: MIGRATION 02 - CORE USERS, SCHOOL SETTINGS & ACADEMIC STRUCTURE
-- Sesuai Dokumen PRD 08 (Skema Database Supabase)
-- ==============================================================================

-- 1. profiles: Data domain untuk user Supabase Auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  login_identifier text not null unique,
  role app_role not null,
  avatar_url text,
  phone text,
  is_active boolean not null default true,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_login_identifier on public.profiles(login_identifier);

-- Trigger auto updated_at
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 2. school_settings: Satu baris konfigurasi identitas sekolah
create table if not exists public.school_settings (
  id uuid primary key default gen_random_uuid(),
  school_name text not null default 'SDIT Fajar',
  logo_url text,
  address text,
  phone text,
  whatsapp text,
  email text,
  maps_url text,
  social_links jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_school_settings_updated_at on public.school_settings;
create trigger set_school_settings_updated_at
  before update on public.school_settings
  for each row execute function public.handle_updated_at();

-- 3. audit_logs: Pencatatan jejak rekam mutasi sensitif
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- Prosedur helper pencatatan audit log
create or replace function public.log_audit_event(
  p_action text,
  p_entity_type text,
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_log_id uuid;
begin
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata)
  returning id into v_log_id;
  
  return v_log_id;
end;
$$;

-- 4. academic_years: Tahun Ajaran
create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, -- contoh '2026/2027'
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_academic_years_updated_at on public.academic_years;
create trigger set_academic_years_updated_at
  before update on public.academic_years
  for each row execute function public.handle_updated_at();

-- 5. semesters: Semester per tahun ajaran
create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  name text not null, -- 'Semester 1' / 'Semester 2'
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_semester_year_name unique (academic_year_id, name)
);

drop trigger if exists set_semesters_updated_at on public.semesters;
create trigger set_semesters_updated_at
  before update on public.semesters
  for each row execute function public.handle_updated_at();

-- 6. school_period_settings: Periode operasional modul absensi & penagihan
create table if not exists public.school_period_settings (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  semester_id uuid references public.semesters(id) on delete set null,
  active_month int not null check (active_month between 1 and 12),
  active_year int not null,
  teacher_weekend_attendance_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_school_period_settings_updated_at on public.school_period_settings;
create trigger set_school_period_settings_updated_at
  before update on public.school_period_settings
  for each row execute function public.handle_updated_at();

-- 7. classes: Master Tingkat Jenjang Kelas (1-6)
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, -- contoh '1', '2', '3'
  grade_level int not null check (grade_level between 1 and 6),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_classes_updated_at on public.classes;
create trigger set_classes_updated_at
  before update on public.classes
  for each row execute function public.handle_updated_at();

-- 8. positions: Master data jabatan fungsional guru/staf
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- snake_case: kepala_sekolah, wali_kelas, dll.
  name text not null, -- Label UI: Kepala Sekolah, Wali Kelas
  category text not null, -- pimpinan/administrasi/akademik/penunjang/khas_sdit
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_positions_updated_at on public.positions;
create trigger set_positions_updated_at
  before update on public.positions
  for each row execute function public.handle_updated_at();

-- 9. teachers: Data Pokok Guru
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  nip text unique,
  nuptk text unique,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teachers_profile on public.teachers(profile_id);

drop trigger if exists set_teachers_updated_at on public.teachers;
create trigger set_teachers_updated_at
  before update on public.teachers
  for each row execute function public.handle_updated_at();

-- 10. students: Data Pokok Murid Aktif
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  nis text not null unique,
  nisn text unique,
  gender text check (gender in ('male', 'female', 'L', 'P')),
  birth_place text,
  birth_date date,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_students_profile on public.students(profile_id);
create index if not exists idx_students_nis on public.students(nis);

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
  before update on public.students
  for each row execute function public.handle_updated_at();

-- 11. parents: Data Pokok Wali Murid
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  occupation text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_parents_profile on public.parents(profile_id);

drop trigger if exists set_parents_updated_at on public.parents;
create trigger set_parents_updated_at
  before update on public.parents
  for each row execute function public.handle_updated_at();

-- 12. parent_students: Relasi Wali Murid ke Siswa (Many-to-Many)
create table if not exists public.parent_students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  relationship text not null default 'wali', -- ayah/ibu/wali
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint uq_parent_student unique (parent_id, student_id)
);

create index if not exists idx_parent_students_parent on public.parent_students(parent_id);
create index if not exists idx_parent_students_student on public.parent_students(student_id);

-- 13. classrooms: Rombongan Belajar per Tahun Ajaran
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete restrict,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  name text not null, -- contoh '1A - 2026/2027', '3 Khadijah'
  homeroom_teacher_id uuid references public.teachers(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_classroom_name_year unique (academic_year_id, name)
);

create index if not exists idx_classrooms_year on public.classrooms(academic_year_id);
create index if not exists idx_classrooms_homeroom on public.classrooms(homeroom_teacher_id);

drop trigger if exists set_classrooms_updated_at on public.classrooms;
create trigger set_classrooms_updated_at
  before update on public.classrooms
  for each row execute function public.handle_updated_at();

-- 14. teacher_positions: Pivot penugasan jabatan guru
create table if not exists public.teacher_positions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  position_id uuid not null references public.positions(id) on delete cascade,
  classroom_id uuid references public.classrooms(id) on delete cascade,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teacher_positions_lookup on public.teacher_positions(teacher_id, position_id);

drop trigger if exists set_teacher_positions_updated_at on public.teacher_positions;
create trigger set_teacher_positions_updated_at
  before update on public.teacher_positions
  for each row execute function public.handle_updated_at();

-- 15. class_students: Pivot Penempatan Siswa dalam Rombel
create table if not exists public.class_students (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  joined_at date not null default current_date,
  left_at date,
  status text not null default 'active', -- active, moved, graduated
  created_at timestamptz not null default now(),
  constraint uq_class_student unique (classroom_id, student_id)
);

create index if not exists idx_class_students_classroom on public.class_students(classroom_id);
create index if not exists idx_class_students_student on public.class_students(student_id);

-- 16. subjects: Master Mata Pelajaran Kurikulum
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  grade_level int check (grade_level between 1 and 6),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_subjects_updated_at on public.subjects;
create trigger set_subjects_updated_at
  before update on public.subjects
  for each row execute function public.handle_updated_at();

-- 17. teaching_assignments: Relasi Guru, Mapel, Rombel, & Semester
create table if not exists public.teaching_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  semester_id uuid not null references public.semesters(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint uq_teaching_assignment unique (teacher_id, subject_id, classroom_id, semester_id)
);

create index if not exists idx_teaching_assignments_lookup on public.teaching_assignments(teacher_id, classroom_id, subject_id);

-- 18. schedules: Jadwal Pelajaran Mingguan
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  day_of_week int not null check (day_of_week between 1 and 7), -- 1: Senin s.d. 7: Ahad
  start_time time not null,
  end_time time not null,
  room text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_schedules_classroom on public.schedules(classroom_id);
create index if not exists idx_schedules_teacher on public.schedules(teacher_id);

drop trigger if exists set_schedules_updated_at on public.schedules;
create trigger set_schedules_updated_at
  before update on public.schedules
  for each row execute function public.handle_updated_at();
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
-- ==============================================================================
-- FASE 3: MIGRATION 04 - PAYMENT GATEWAY (MIDTRANS) & MARKETPLACE TABLES
-- Sesuai Dokumen PRD 08, 13 (Payment Midtrans), dan Dokumen Safety
-- ==============================================================================

-- 1. payment_settings: Konfigurasi Provider Pembayaran (Server Key disimpan di .env, BUKAN di tabel)
create table if not exists public.payment_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'midtrans',
  environment text not null default 'sandbox' check (environment in ('sandbox', 'production')),
  merchant_id text,
  client_key text,
  provider_logo_url text,
  is_enabled boolean not null default false,
  is_spp_enabled boolean not null default false,
  is_iuran_enabled boolean not null default false,
  is_pendaftaran_semester_enabled boolean not null default false,
  is_marketplace_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_payment_settings_updated_at on public.payment_settings;
create trigger set_payment_settings_updated_at
  before update on public.payment_settings
  for each row execute function public.handle_updated_at();

-- 2. marketplace_products: Etalase Produk/Buku/Modul Terbitan Sekolah
create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_url text,
  file_url text,
  file_path text, -- storage path di bucket 'marketplace-files'
  price numeric not null default 0 check (price >= 0),
  is_published boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_marketplace_products_slug on public.marketplace_products(slug);
create index if not exists idx_marketplace_products_published on public.marketplace_products(is_published);

drop trigger if exists set_marketplace_products_updated_at on public.marketplace_products;
create trigger set_marketplace_products_updated_at
  before update on public.marketplace_products
  for each row execute function public.handle_updated_at();

-- 3. marketplace_orders: Pesanan Pembelian oleh Wali Murid
create table if not exists public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  student_id uuid references public.students(id) on delete set null,
  status order_status not null default 'draft',
  total_amount numeric not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_marketplace_orders_parent on public.marketplace_orders(parent_id);

drop trigger if exists set_marketplace_orders_updated_at on public.marketplace_orders;
create trigger set_marketplace_orders_updated_at
  before update on public.marketplace_orders
  for each row execute function public.handle_updated_at();

-- 4. marketplace_order_items: Rincian Produk dalam Pesanan
create table if not exists public.marketplace_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.marketplace_orders(id) on delete cascade,
  product_id uuid not null references public.marketplace_products(id) on delete restrict,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  constraint uq_order_product unique (order_id, product_id)
);

create index if not exists idx_order_items_order on public.marketplace_order_items(order_id);

-- 5. payment_invoices: Tagihan SPP, Iuran, & Transaksi Pembayaran Sekolah
create table if not exists public.payment_invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  parent_id uuid references public.parents(id) on delete cascade,
  marketplace_order_id uuid references public.marketplace_orders(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  type payment_type not null,
  billing_month int check (billing_month between 1 and 12),
  billing_year int,
  title text not null, -- contoh: 'SPP Juli 2026'
  amount numeric not null check (amount > 0),
  due_date date,
  reminder_offsets int[] not null default '{30,14,7,3,1}'::int[],
  status payment_status not null default 'draft',
  notes text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoices_student_status on public.payment_invoices(student_id, status, type);
create index if not exists idx_invoices_parent on public.payment_invoices(parent_id);
create index if not exists idx_invoices_year on public.payment_invoices(academic_year_id);

drop trigger if exists set_payment_invoices_updated_at on public.payment_invoices;
create trigger set_payment_invoices_updated_at
  before update on public.payment_invoices
  for each row execute function public.handle_updated_at();

-- 6. payment_transactions: Pencatatan Transaksi Midtrans Snap
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.payment_invoices(id) on delete cascade,
  provider text not null default 'midtrans',
  order_id text not null unique, -- order_id yang dikirim ke Midtrans
  transaction_id text, -- ID transaksi resmi dari Midtrans
  snap_token text,
  redirect_url text,
  gross_amount numeric not null check (gross_amount > 0),
  status payment_status not null default 'pending',
  paid_at timestamptz,
  payer_bank_name text,
  payer_bank_account_number text,
  payer_bank_account_name text,
  destination_bank_name text,
  destination_bank_account_number text,
  destination_bank_account_name text,
  raw_payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payment_transactions_order on public.payment_transactions(order_id);
create index if not exists idx_payment_transactions_invoice on public.payment_transactions(invoice_id);

drop trigger if exists set_payment_transactions_updated_at on public.payment_transactions;
create trigger set_payment_transactions_updated_at
  before update on public.payment_transactions
  for each row execute function public.handle_updated_at();

-- 7. payment_receipts: Snapshot Bukti Pembayaran Resmi (Print-friendly)
create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.payment_invoices(id) on delete cascade,
  transaction_id uuid not null references public.payment_transactions(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  class_name text,
  school_logo_url text,
  midtrans_logo_url text,
  paid_at timestamptz not null default now(),
  invoice_number text not null,
  student_name text not null,
  amount numeric not null check (amount > 0),
  status payment_status not null default 'paid',
  payer_bank_name text,
  payer_bank_account_number text,
  payer_bank_account_name text,
  destination_bank_name text,
  destination_bank_account_number text,
  destination_bank_account_name text,
  created_at timestamptz not null default now(),
  constraint uq_receipt_invoice_transaction unique (invoice_id, transaction_id)
);

create index if not exists idx_receipts_invoice on public.payment_receipts(invoice_id);
create index if not exists idx_receipts_student on public.payment_receipts(student_id);
-- ==============================================================================
-- FASE 3: MIGRATION 05 - SECURITY HELPER FUNCTIONS, ENABLE RLS & POLICIES
-- Sesuai Dokumen PRD 09 (RLS & Keamanan Data) & Safety Guardrails
-- ==============================================================================

-- ==============================================================================
-- 1. SECURITY HELPER FUNCTIONS (Tabel profiles, teachers, positions sudah tercipta)
-- ==============================================================================

create or replace function public.current_user_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin' and is_active = true
  );
$$;

create or replace function public.is_admin_or_super()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super_admin', 'admin') and is_active = true
  );
$$;

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'guru' and is_active = true
  );
$$;

create or replace function public.is_student()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'murid' and is_active = true
  );
$$;

create or replace function public.is_parent()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'wali_murid' and is_active = true
  );
$$;

create or replace function public.has_teacher_position(pos_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.teachers t
    join public.teacher_positions tp on tp.teacher_id = t.id
    join public.positions p on p.id = tp.position_id
    where t.profile_id = auth.uid()
      and p.code = pos_code
      and tp.is_active = true
      and p.is_active = true
  );
$;

create or replace function public.get_current_parent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $
  select id from public.parents where profile_id = auth.uid() limit 1;
$;

create or replace function public.get_current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $
  select id from public.students where profile_id = auth.uid() limit 1;
$;

create or replace function public.get_my_children_profile_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $
  select s.profile_id
  from public.students s
  join public.parent_students ps on ps.student_id = s.id
  join public.parents p on p.id = ps.parent_id
  where p.profile_id = auth.uid();
$;

grant execute on function public.get_current_parent_id() to authenticated;
grant execute on function public.get_current_student_id() to authenticated;
grant execute on function public.get_my_children_profile_ids() to authenticated;

-- ==============================================================================
-- 2. PENEGAKAN RLS 100% PADA SELURUH TABEL INTERNAL
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.school_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.academic_years enable row level security;
alter table public.semesters enable row level security;
alter table public.school_period_settings enable row level security;
alter table public.classes enable row level security;
alter table public.positions enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.parents enable row level security;
alter table public.parent_students enable row level security;
alter table public.classrooms enable row level security;
alter table public.teacher_positions enable row level security;
alter table public.class_students enable row level security;
alter table public.subjects enable row level security;
alter table public.teaching_assignments enable row level security;
alter table public.schedules enable row level security;
alter table public.admission_waves enable row level security;
alter table public.student_registration_applications enable row level security;
alter table public.student_registration_documents enable row level security;
alter table public.teacher_attendances enable row level security;
alter table public.student_attendances enable row level security;
alter table public.materials enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.grades enable row level security;
alter table public.announcements enable row level security;
alter table public.news_posts enable row level security;
alter table public.tahfidz_records enable row level security;
alter table public.import_batches enable row level security;
alter table public.payment_settings enable row level security;
alter table public.marketplace_products enable row level security;
alter table public.marketplace_orders enable row level security;
alter table public.marketplace_order_items enable row level security;
alter table public.payment_invoices enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.payment_receipts enable row level security;

-- ==============================================================================
-- 3. POLICIES: PROFILES & SCHOOL SETTINGS
-- ==============================================================================

drop policy if exists "Profiles read policy" on public.profiles;
create policy "Profiles read policy"
  on public.profiles for select
  to authenticated
  using (
    id = (select auth.uid())
    or public.is_admin_or_super()
    or public.is_teacher()
    or id in (select public.get_my_children_profile_ids())
  );

drop policy if exists "Profiles update policy" on public.profiles;
create policy "Profiles update policy"
  on public.profiles for update
  to authenticated
  using (
    public.is_super_admin()
    or (public.is_admin_or_super() and role <> 'super_admin')
    or (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()))
  )
  with check (
    public.is_super_admin()
    or (public.is_admin_or_super() and role <> 'super_admin')
    or (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()))
  );

drop policy if exists "School settings public read" on public.school_settings;
create policy "School settings public read"
  on public.school_settings for select
  to public
  using (true);

drop policy if exists "School settings super admin only write" on public.school_settings;
create policy "School settings super admin only write"
  on public.school_settings for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

drop policy if exists "Audit logs super admin read only" on public.audit_logs;
create policy "Audit logs super admin read only"
  on public.audit_logs for select
  to authenticated
  using (public.is_super_admin());

drop policy if exists "Audit logs insert policy" on public.audit_logs;
create policy "Audit logs insert policy"
  on public.audit_logs for insert
  to authenticated
  with check (actor_id = auth.uid() or actor_id is null);

-- ==============================================================================
-- 4. POLICIES: ACADEMIC CORE & REFERENCE
-- ==============================================================================

-- academic_years, semesters, school_period_settings, classes, positions, subjects, classrooms, schedules

-- academic_years
drop policy if exists "Academic years read" on public.academic_years;
create policy "Academic years read" on public.academic_years for select to authenticated using (true);
drop policy if exists "Academic years admin write" on public.academic_years;
create policy "Academic years admin write" on public.academic_years for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- semesters
drop policy if exists "Semesters read" on public.semesters;
create policy "Semesters read" on public.semesters for select to authenticated using (true);
drop policy if exists "Semesters admin write" on public.semesters;
create policy "Semesters admin write" on public.semesters for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- school_period_settings
drop policy if exists "Period settings read" on public.school_period_settings;
create policy "Period settings read" on public.school_period_settings for select to authenticated using (true);
drop policy if exists "Period settings write" on public.school_period_settings;
create policy "Period settings write" on public.school_period_settings for all to authenticated using (public.is_admin_or_super() or public.has_teacher_position('kepala_sekolah')) with check (public.is_admin_or_super() or public.has_teacher_position('kepala_sekolah'));

-- classes
drop policy if exists "Classes read" on public.classes;
create policy "Classes read" on public.classes for select to authenticated using (true);
drop policy if exists "Classes admin write" on public.classes;
create policy "Classes admin write" on public.classes for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- positions
drop policy if exists "Positions read" on public.positions;
create policy "Positions read" on public.positions for select to authenticated using (true);
drop policy if exists "Positions admin write" on public.positions;
create policy "Positions admin write" on public.positions for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- classrooms
drop policy if exists "Classrooms read" on public.classrooms;
create policy "Classrooms read" on public.classrooms for select to authenticated using (true);
drop policy if exists "Classrooms admin write" on public.classrooms;
create policy "Classrooms admin write" on public.classrooms for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- subjects
drop policy if exists "Subjects read" on public.subjects;
create policy "Subjects read" on public.subjects for select to authenticated using (true);
drop policy if exists "Subjects admin write" on public.subjects;
create policy "Subjects admin write" on public.subjects for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- schedules
drop policy if exists "Schedules read" on public.schedules;
create policy "Schedules read" on public.schedules for select to authenticated using (true);
drop policy if exists "Schedules admin write" on public.schedules;
create policy "Schedules admin write" on public.schedules for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- ==============================================================================
-- 5. POLICIES: TEACHERS, STUDENTS, PARENTS & RELATIONS
-- ==============================================================================

-- teachers
drop policy if exists "Teachers read" on public.teachers;
create policy "Teachers read" on public.teachers for select to authenticated using (true);
drop policy if exists "Teachers admin write" on public.teachers;
create policy "Teachers admin write" on public.teachers for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- teacher_positions
drop policy if exists "Teacher positions read" on public.teacher_positions;
create policy "Teacher positions read" on public.teacher_positions for select to authenticated using (true);
drop policy if exists "Teacher positions admin write" on public.teacher_positions;
create policy "Teacher positions admin write" on public.teacher_positions for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- students (Strict access protection)
drop policy if exists "Students read policy" on public.students;
create policy "Students read policy"
  on public.students for select
  to authenticated
  using (
    profile_id = (select auth.uid())
    or public.is_admin_or_super()
    or public.has_teacher_position('kepala_sekolah')
    or id in (
      select ps.student_id from public.parent_students ps
      where ps.parent_id = public.get_current_parent_id()
    )
    or exists (
      select 1 from public.class_students cs
      join public.teaching_assignments ta on ta.classroom_id = cs.classroom_id
      join public.teachers t on t.id = ta.teacher_id
      where cs.student_id = public.students.id and t.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.class_students cs
      join public.classrooms c on c.id = cs.classroom_id
      join public.teachers t on t.id = c.homeroom_teacher_id
      where cs.student_id = public.students.id and t.profile_id = auth.uid()
    )
  );

drop policy if exists "Students admin write" on public.students;
create policy "Students admin write"
  on public.students for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- parents
drop policy if exists "Parents read policy" on public.parents;
create policy "Parents read policy"
  on public.parents for select
  to authenticated
  using (profile_id = auth.uid() or public.is_admin_or_super());

drop policy if exists "Parents admin write" on public.parents;
create policy "Parents admin write"
  on public.parents for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- parent_students
drop policy if exists "Parent students read policy" on public.parent_students;
create policy "Parent students read policy"
  on public.parent_students for select
  to authenticated
  using (
    public.is_admin_or_super()
    or parent_id = public.get_current_parent_id()
    or student_id = public.get_current_student_id()
    or public.is_teacher()
  );

drop policy if exists "Parent students admin write" on public.parent_students;
create policy "Parent students admin write"
  on public.parent_students for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- class_students
drop policy if exists "Class students read" on public.class_students;
create policy "Class students read" on public.class_students for select to authenticated using (true);
drop policy if exists "Class students admin write" on public.class_students;
create policy "Class students admin write" on public.class_students for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- teaching_assignments
drop policy if exists "Teaching assignments read" on public.teaching_assignments;
create policy "Teaching assignments read" on public.teaching_assignments for select to authenticated using (true);
drop policy if exists "Teaching assignments admin write" on public.teaching_assignments;
create policy "Teaching assignments admin write" on public.teaching_assignments for all to authenticated using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- ==============================================================================
-- 6. POLICIES: PPDB (GELOMBANG, PENDAFTARAN & DOKUMEN)
-- ==============================================================================

-- admission_waves
drop policy if exists "Admission waves public read" on public.admission_waves;
create policy "Admission waves public read"
  on public.admission_waves for select
  to public
  using ((status = 'open' and is_active = true) or public.is_admin_or_super());

drop policy if exists "Admission waves admin write" on public.admission_waves;
create policy "Admission waves admin write"
  on public.admission_waves for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- student_registration_applications
drop policy if exists "Registration apps public insert" on public.student_registration_applications;
create policy "Registration apps public insert"
  on public.student_registration_applications for insert
  to public
  with check (
    exists (
      select 1 from public.admission_waves w
      where w.id = admission_wave_id and w.status = 'open' and w.is_active = true
    )
  );

drop policy if exists "Registration apps admin read" on public.student_registration_applications;
create policy "Registration apps admin read"
  on public.student_registration_applications for select
  to authenticated
  using (public.is_admin_or_super());

drop policy if exists "Registration apps admin write" on public.student_registration_applications;
create policy "Registration apps admin write"
  on public.student_registration_applications for update
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- student_registration_documents
drop policy if exists "Registration docs public insert" on public.student_registration_documents;
create policy "Registration docs public insert"
  on public.student_registration_documents for insert
  to public
  with check (
    exists (
      select 1 from public.student_registration_applications a
      join public.admission_waves w on w.id = a.admission_wave_id
      where a.id = application_id and w.status = 'open' and w.is_active = true
    )
  );

drop policy if exists "Registration docs admin read and write" on public.student_registration_documents;
create policy "Registration docs admin read and write"
  on public.student_registration_documents for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- ==============================================================================
-- 7. POLICIES: LMS (MATERIALS, ASSIGNMENTS, SUBMISSIONS & GRADES)
-- ==============================================================================

-- materials
drop policy if exists "Materials read policy" on public.materials;
create policy "Materials read policy"
  on public.materials for select
  to authenticated
  using (
    public.is_admin_or_super()
    or public.has_teacher_position('kepala_sekolah')
    or exists (select 1 from public.teachers t where t.id = materials.teacher_id and t.profile_id = auth.uid())
    or exists (select 1 from public.classrooms c join public.teachers t on t.id = c.homeroom_teacher_id where c.id = materials.classroom_id and t.profile_id = auth.uid())
    or (
      status = 'published' and (
        exists (
          select 1 from public.class_students cs
          join public.students s on s.id = cs.student_id
          where cs.classroom_id = materials.classroom_id and s.profile_id = auth.uid()
        )
        or exists (
          select 1 from public.parent_students ps
          join public.parents p on p.id = ps.parent_id
          join public.class_students cs on cs.student_id = ps.student_id
          where cs.classroom_id = materials.classroom_id and p.profile_id = auth.uid()
        )
      )
    )
  );

drop policy if exists "Materials manage policy" on public.materials;
create policy "Materials manage policy"
  on public.materials for all
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = materials.teacher_id and t.profile_id = auth.uid())
  )
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = materials.teacher_id and t.profile_id = auth.uid())
  );

-- assignments
drop policy if exists "Assignments read policy" on public.assignments;
create policy "Assignments read policy"
  on public.assignments for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = assignments.teacher_id and t.profile_id = auth.uid())
    or exists (select 1 from public.classrooms c join public.teachers t on t.id = c.homeroom_teacher_id where c.id = assignments.classroom_id and t.profile_id = auth.uid())
    or (
      status in ('published', 'closed') and (
        exists (
          select 1 from public.class_students cs
          join public.students s on s.id = cs.student_id
          where cs.classroom_id = assignments.classroom_id and s.profile_id = auth.uid()
        )
        or exists (
          select 1 from public.parent_students ps
          join public.parents p on p.id = ps.parent_id
          join public.class_students cs on cs.student_id = ps.student_id
          where cs.classroom_id = assignments.classroom_id and p.profile_id = auth.uid()
        )
      )
    )
  );

drop policy if exists "Assignments manage policy" on public.assignments;
create policy "Assignments manage policy"
  on public.assignments for all
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = assignments.teacher_id and t.profile_id = auth.uid())
  )
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = assignments.teacher_id and t.profile_id = auth.uid())
  );

-- assignment_submissions
drop policy if exists "Submissions read policy" on public.assignment_submissions;
create policy "Submissions read policy"
  on public.assignment_submissions for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.students s where s.id = assignment_submissions.student_id and s.profile_id = auth.uid())
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = assignment_submissions.student_id and p.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.assignments a
      join public.teachers t on t.id = a.teacher_id
      where a.id = assignment_submissions.assignment_id and t.profile_id = auth.uid()
    )
  );

drop policy if exists "Submissions student submit policy" on public.assignment_submissions;
create policy "Submissions student submit policy"
  on public.assignment_submissions for insert
  to authenticated
  with check (
    exists (select 1 from public.students s where s.id = student_id and s.profile_id = auth.uid())
  );

drop policy if exists "Submissions update policy" on public.assignment_submissions;
create policy "Submissions update policy"
  on public.assignment_submissions for update
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.students s where s.id = assignment_submissions.student_id and s.profile_id = auth.uid())
    or exists (
      select 1 from public.assignments a
      join public.teachers t on t.id = a.teacher_id
      where a.id = assignment_submissions.assignment_id and t.profile_id = auth.uid()
    )
  )
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.students s where s.id = assignment_submissions.student_id and s.profile_id = auth.uid())
    or exists (
      select 1 from public.assignments a
      join public.teachers t on t.id = a.teacher_id
      where a.id = assignment_submissions.assignment_id and t.profile_id = auth.uid()
    )
  );

-- grades
drop policy if exists "Grades read policy" on public.grades;
create policy "Grades read policy"
  on public.grades for select
  to authenticated
  using (
    public.is_admin_or_super()
    or public.has_teacher_position('kepala_sekolah')
    or exists (select 1 from public.students s where s.id = grades.student_id and s.profile_id = auth.uid())
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = grades.student_id and p.profile_id = auth.uid()
    )
    or exists (select 1 from public.teachers t where t.id = grades.teacher_id and t.profile_id = auth.uid())
    or exists (select 1 from public.classrooms c join public.teachers t on t.id = c.homeroom_teacher_id where c.id = grades.classroom_id and t.profile_id = auth.uid())
  );

drop policy if exists "Grades manage policy" on public.grades;
create policy "Grades manage policy"
  on public.grades for all
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = grades.teacher_id and t.profile_id = auth.uid())
  )
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = grades.teacher_id and t.profile_id = auth.uid())
  );

-- ==============================================================================
-- 8. POLICIES: ATTENDANCE, TAHFIDZ, ANNOUNCEMENTS & NEWS
-- ==============================================================================

-- teacher_attendances
drop policy if exists "Teacher attendances read" on public.teacher_attendances;
create policy "Teacher attendances read"
  on public.teacher_attendances for select
  to authenticated
  using (
    public.is_admin_or_super()
    or public.has_teacher_position('kepala_sekolah')
    or exists (select 1 from public.teachers t where t.id = teacher_attendances.teacher_id and t.profile_id = auth.uid())
  );

drop policy if exists "Teacher attendances write" on public.teacher_attendances;
create policy "Teacher attendances write"
  on public.teacher_attendances for insert
  to authenticated
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = teacher_id and t.profile_id = auth.uid())
  );

drop policy if exists "Teacher attendances update" on public.teacher_attendances;
create policy "Teacher attendances update"
  on public.teacher_attendances for update
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = teacher_attendances.teacher_id and t.profile_id = auth.uid())
  )
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.teachers t where t.id = teacher_attendances.teacher_id and t.profile_id = auth.uid())
  );

-- student_attendances
drop policy if exists "Student attendances read" on public.student_attendances;
create policy "Student attendances read"
  on public.student_attendances for select
  to authenticated
  using (
    public.is_admin_or_super()
    or public.has_teacher_position('kepala_sekolah')
    or exists (select 1 from public.students s where s.id = student_attendances.student_id and s.profile_id = auth.uid())
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = student_attendances.student_id and p.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.schedules sch
      join public.teachers t on t.id = sch.teacher_id
      where sch.id = student_attendances.schedule_id and t.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.classrooms c
      join public.teachers t on t.id = c.homeroom_teacher_id
      where c.id = student_attendances.classroom_id and t.profile_id = auth.uid()
    )
  );

drop policy if exists "Student attendances write" on public.student_attendances;
create policy "Student attendances write"
  on public.student_attendances for all
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (
      select 1 from public.schedules sch
      join public.teachers t on t.id = sch.teacher_id
      where sch.id = student_attendances.schedule_id and t.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.classrooms c
      join public.teachers t on t.id = c.homeroom_teacher_id
      where c.id = student_attendances.classroom_id and t.profile_id = auth.uid()
    )
  )
  with check (
    public.is_admin_or_super()
    or exists (
      select 1 from public.schedules sch
      join public.teachers t on t.id = sch.teacher_id
      where sch.id = student_attendances.schedule_id and t.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.classrooms c
      join public.teachers t on t.id = c.homeroom_teacher_id
      where c.id = student_attendances.classroom_id and t.profile_id = auth.uid()
    )
  );

-- tahfidz_records
drop policy if exists "Tahfidz records read" on public.tahfidz_records;
create policy "Tahfidz records read"
  on public.tahfidz_records for select
  to authenticated
  using (
    public.is_admin_or_super()
    or public.has_teacher_position('koordinator_tahfidz')
    or teacher_id = auth.uid()
    or exists (select 1 from public.students s where s.id = tahfidz_records.student_id and s.profile_id = auth.uid())
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = tahfidz_records.student_id and p.profile_id = auth.uid()
    )
  );

drop policy if exists "Tahfidz records write" on public.tahfidz_records;
create policy "Tahfidz records write"
  on public.tahfidz_records for all
  to authenticated
  using (public.is_admin_or_super() or public.is_teacher())
  with check (public.is_admin_or_super() or public.is_teacher());

-- announcements
drop policy if exists "Announcements read" on public.announcements;
create policy "Announcements read"
  on public.announcements for select
  to authenticated
  using (
    public.is_admin_or_super()
    or (
      status = 'published' and (
        target_type = 'all'
        or (target_type = 'role' and target_role = public.current_user_role())
        or (
          target_type = 'class' and exists (
            select 1 from public.class_students cs
            join public.students s on s.id = cs.student_id
            where cs.classroom_id = announcements.classroom_id and s.profile_id = auth.uid()
          )
        )
        or (
          target_type = 'student' and exists (
            select 1 from public.students s
            where s.id = announcements.student_id and s.profile_id = auth.uid()
          )
        )
      )
    )
  );

drop policy if exists "Announcements admin write" on public.announcements;
create policy "Announcements admin write"
  on public.announcements for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- news_posts
drop policy if exists "News posts public read" on public.news_posts;
create policy "News posts public read"
  on public.news_posts for select
  to public
  using (status = 'published' or public.is_admin_or_super());

drop policy if exists "News posts admin write" on public.news_posts;
create policy "News posts admin write"
  on public.news_posts for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- import_batches
drop policy if exists "Import batches super admin only" on public.import_batches;
create policy "Import batches super admin only"
  on public.import_batches for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- ==============================================================================
-- 9. POLICIES: BILLING & MARKETPLACE
-- ==============================================================================

-- payment_settings
drop policy if exists "Payment settings super admin only" on public.payment_settings;
create policy "Payment settings super admin only"
  on public.payment_settings for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- marketplace_products
drop policy if exists "Marketplace products public read" on public.marketplace_products;
create policy "Marketplace products public read"
  on public.marketplace_products for select
  to public
  using (is_published = true or public.is_admin_or_super());

drop policy if exists "Marketplace products admin write" on public.marketplace_products;
create policy "Marketplace products admin write"
  on public.marketplace_products for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- marketplace_orders
drop policy if exists "Marketplace orders read" on public.marketplace_orders;
create policy "Marketplace orders read"
  on public.marketplace_orders for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.parents p where p.id = marketplace_orders.parent_id and p.profile_id = auth.uid())
  );

drop policy if exists "Marketplace orders parent create" on public.marketplace_orders;
create policy "Marketplace orders parent create"
  on public.marketplace_orders for insert
  to authenticated
  with check (
    public.is_admin_or_super()
    or exists (select 1 from public.parents p where p.id = parent_id and p.profile_id = auth.uid())
  );

drop policy if exists "Marketplace orders admin update" on public.marketplace_orders;
create policy "Marketplace orders admin update"
  on public.marketplace_orders for update
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- marketplace_order_items
drop policy if exists "Marketplace order items read" on public.marketplace_order_items;
create policy "Marketplace order items read"
  on public.marketplace_order_items for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (
      select 1 from public.marketplace_orders o
      join public.parents p on p.id = o.parent_id
      where o.id = marketplace_order_items.order_id and p.profile_id = auth.uid()
    )
  );

drop policy if exists "Marketplace order items insert" on public.marketplace_order_items;
create policy "Marketplace order items insert"
  on public.marketplace_order_items for insert
  to authenticated
  with check (
    public.is_admin_or_super()
    or exists (
      select 1 from public.marketplace_orders o
      join public.parents p on p.id = o.parent_id
      where o.id = order_id and p.profile_id = auth.uid()
    )
  );

-- payment_invoices (Wali Murid membaca & membayar, Murid membaca saja)
drop policy if exists "Invoices read policy" on public.payment_invoices;
create policy "Invoices read policy"
  on public.payment_invoices for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (select 1 from public.students s where s.id = payment_invoices.student_id and s.profile_id = auth.uid())
    or exists (select 1 from public.parents p where p.id = payment_invoices.parent_id and p.profile_id = auth.uid())
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = payment_invoices.student_id and p.profile_id = auth.uid()
    )
  );

drop policy if exists "Invoices admin write" on public.payment_invoices;
create policy "Invoices admin write"
  on public.payment_invoices for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());

-- payment_transactions
drop policy if exists "Transactions read policy" on public.payment_transactions;
create policy "Transactions read policy"
  on public.payment_transactions for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (
      select 1 from public.payment_invoices inv
      join public.parents p on p.id = inv.parent_id
      where inv.id = payment_transactions.invoice_id and p.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.payment_invoices inv
      join public.parent_students ps on ps.student_id = inv.student_id
      join public.parents p on p.id = ps.parent_id
      where inv.id = payment_transactions.invoice_id and p.profile_id = auth.uid()
    )
  );

drop policy if exists "Transactions parent insert" on public.payment_transactions;
create policy "Transactions parent insert"
  on public.payment_transactions for insert
  to authenticated
  with check (
    public.is_admin_or_super()
    or exists (
      select 1 from public.payment_invoices inv
      join public.parents p on p.id = inv.parent_id
      where inv.id = invoice_id and p.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.payment_invoices inv
      join public.parent_students ps on ps.student_id = inv.student_id
      join public.parents p on p.id = ps.parent_id
      where inv.id = invoice_id and p.profile_id = auth.uid()
    )
  );

-- payment_receipts
drop policy if exists "Receipts read policy" on public.payment_receipts;
create policy "Receipts read policy"
  on public.payment_receipts for select
  to authenticated
  using (
    public.is_admin_or_super()
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = payment_receipts.student_id and p.profile_id = auth.uid()
    )
  );

drop policy if exists "Receipts admin manage" on public.payment_receipts;
create policy "Receipts admin manage"
  on public.payment_receipts for all
  to authenticated
  using (public.is_admin_or_super())
  with check (public.is_admin_or_super());
-- ==============================================================================
-- FASE 3: MIGRATION 06 - SEED DATA PENGEMBANGAN TAHUN AJARAN 2026/2027
-- Sesuai Dokumen PRD 18 (Seed Data) & Konstitusi Sistem (Tanpa PII/Secret Nyata)
-- ==============================================================================

do $$
declare
  -- Deterministic UUIDs untuk testing yang konsisten
  v_superadmin_id uuid := '00000000-0000-0000-0000-000000000001';
  v_admin_id      uuid := '00000000-0000-0000-0000-000000000002';
  v_kepsek_id     uuid := '00000000-0000-0000-0000-000000000003';
  v_ustahmad_id   uuid := '00000000-0000-0000-0000-000000000004';
  v_ustsiti_id    uuid := '00000000-0000-0000-0000-000000000005';
  v_student_id    uuid := '00000000-0000-0000-0000-000000000006';
  v_parent_id     uuid := '00000000-0000-0000-0000-000000000007';

  -- Entity IDs
  v_year_id       uuid;
  v_sem1_id       uuid;
  v_sem2_id       uuid;
  v_class3_id     uuid;
  v_classroom_id  uuid;
  v_subj_mtk_id   uuid;
  v_subj_pai_id   uuid;
  v_subj_tfz_id   uuid;
  v_teacher_kepsek_id uuid;
  v_teacher_ahmad_id  uuid;
  v_teacher_siti_id   uuid;
  v_student_ahmad_id  uuid;
  v_parent_record_id  uuid;
  v_pos_kepsek_id     uuid;
  v_pos_wali_id       uuid;
  v_pos_tahfidz_id    uuid;
  v_schedule_id       uuid;
  v_invoice_id        uuid;
begin

  -- 1. SEED IDENTITAS SEKOLAH (school_settings)
  if not exists (select 1 from public.school_settings) then
    insert into public.school_settings (
      school_name,
      address,
      phone,
      whatsapp,
      email,
      maps_url,
      social_links
    ) values (
      'SDIT Fajar',
      'Jl. Merpati No. 12, Kebayoran Baru, Jakarta Selatan',
      '021-7654321',
      '6287737860657',
      'info@sditfajar.sch.id',
      'https://maps.google.com/?q=SDIT+Fajar',
      '{"instagram": "https://instagram.com/sditfajar", "youtube": "https://youtube.com/@sditfajar"}'::jsonb
    );
  end if;

  -- 2. SEED 7 JABATAN GURU RESMI (positions)
  insert into public.positions (code, name, category, description)
  values
    ('kepala_sekolah', 'Kepala Sekolah', 'pimpinan', 'Pimpinan unit satuan pendidikan'),
    ('wakil_kepala', 'Wakil Kepala Sekolah', 'pimpinan', 'Wakil pimpinan bidang kurikulum & kesiswaan'),
    ('bendahara', 'Bendahara Sekolah', 'administrasi', 'Pengelola administrasi keuangan dan SPP'),
    ('wali_kelas', 'Wali Kelas', 'akademik', 'Pembimbing utama rombongan belajar'),
    ('koordinator_tahfidz', 'Koordinator Tahfidz', 'khas_sdit', 'Pembina program hafalan Al-Qur''an & tahsin'),
    ('pustakawan', 'Pustakawan', 'penunjang', 'Pengelola sumber belajar perpustakaan sekolah'),
    ('operator', 'Operator Dapodik', 'administrasi', 'Pengelola data pokok pendidikan')
  on conflict (code) do update set
    name = excluded.name,
    category = excluded.category;

  select id into v_pos_kepsek_id from public.positions where code = 'kepala_sekolah';
  select id into v_pos_wali_id from public.positions where code = 'wali_kelas';
  select id into v_pos_tahfidz_id from public.positions where code = 'koordinator_tahfidz';

  -- 3. SEED TAHUN AJARAN & SEMESTER
  insert into public.academic_years (name, start_date, end_date, is_active)
  values ('2026/2027', '2026-07-01', '2027-06-30', true)
  on conflict (name) do update set is_active = true
  returning id into v_year_id;

  insert into public.semesters (academic_year_id, name, start_date, end_date, is_active)
  values
    (v_year_id, 'Semester 1', '2026-07-01', '2026-12-31', true),
    (v_year_id, 'Semester 2', '2027-01-01', '2027-06-30', false)
  on conflict (academic_year_id, name) do update set is_active = excluded.is_active;

  select id into v_sem1_id from public.semesters where academic_year_id = v_year_id and name = 'Semester 1';
  select id into v_sem2_id from public.semesters where academic_year_id = v_year_id and name = 'Semester 2';

  -- Periode operasional aktif
  if not exists (select 1 from public.school_period_settings where academic_year_id = v_year_id) then
    insert into public.school_period_settings (
      academic_year_id,
      semester_id,
      active_month,
      active_year,
      teacher_weekend_attendance_enabled
    ) values (
      v_year_id,
      v_sem1_id,
      7,
      2026,
      false
    );
  end if;

  -- 4. SEED KELAS 1-6 (classes)
  insert into public.classes (name, grade_level, description)
  values
    ('1', 1, 'Jenjang Kelas 1 Sekolah Dasar'),
    ('2', 2, 'Jenjang Kelas 2 Sekolah Dasar'),
    ('3', 3, 'Jenjang Kelas 3 Sekolah Dasar'),
    ('4', 4, 'Jenjang Kelas 4 Sekolah Dasar'),
    ('5', 5, 'Jenjang Kelas 5 Sekolah Dasar'),
    ('6', 6, 'Jenjang Kelas 6 Sekolah Dasar')
  on conflict (name) do nothing;

  select id into v_class3_id from public.classes where grade_level = 3;

  -- 5. SEED MATA PELAJARAN (subjects)
  insert into public.subjects (name, code, grade_level)
  values
    ('Pendidikan Agama Islam', 'PAI', 3),
    ('Bahasa Indonesia', 'BIND', 3),
    ('Matematika', 'MTK', 3),
    ('IPAS', 'IPAS', 3),
    ('Pendidikan Pancasila', 'PPKN', 3),
    ('Bahasa Inggris', 'ENG', 3),
    ('PJOK', 'PJOK', 3),
    ('Seni Budaya', 'SB', 3),
    ('Tahfidz Al-Qur''an', 'TFZ', 3),
    ('Akidah Akhlak', 'AA', 3),
    ('Fiqih', 'FQH', 3),
    ('Bahasa Arab', 'ARB', 3),
    ('Teknologi Informasi', 'TI', 3)
  on conflict (code) do nothing;

  select id into v_subj_mtk_id from public.subjects where code = 'MTK';
  select id into v_subj_pai_id from public.subjects where code = 'PAI';
  select id into v_subj_tfz_id from public.subjects where code = 'TFZ';

  -- 6. SEED AKUN DEMO AUTH.USERS & AUTH.IDENTITIES (Supabase GoTrue)
  -- Normalisasi string phone kosong jika ada dari percobaan sebelumnya
  update auth.users set phone = null where phone = '';

  -- Kata sandi resmi: Password123!
  insert into auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role,
    aud,
    phone,
    is_sso_user,
    is_anonymous,
    created_at,
    updated_at
  ) values
    (v_superadmin_id, '00000000-0000-0000-0000-000000000000', 'superadmin@sditfajar.sch.id', crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Super Admin SDIT Fajar"}'::jsonb, 'authenticated', 'authenticated', null,           false, false, now(), now()),
    (v_admin_id,      '00000000-0000-0000-0000-000000000000', 'admin@sditfajar.sch.id',      crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Admin Sekolah"}'::jsonb,       'authenticated', 'authenticated', null,           false, false, now(), now()),
    (v_kepsek_id,     '00000000-0000-0000-0000-000000000000', 'kepsek@sditfajar.sch.id',     crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Kepala Sekolah SDIT Fajar"}'::jsonb, 'authenticated', 'authenticated', null,           false, false, now(), now()),
    (v_ustahmad_id,   '00000000-0000-0000-0000-000000000000', 'ustahmad@sditfajar.sch.id',   crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Ustadz Ahmad Fauzi"}'::jsonb,  'authenticated', 'authenticated', null,           false, false, now(), now()),
    (v_ustsiti_id,    '00000000-0000-0000-0000-000000000000', 'ustsiti@sditfajar.sch.id',    crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Ustadzah Siti Aminah"}'::jsonb, 'authenticated', 'authenticated', null,           false, false, now(), now()),
    (v_student_id,    '00000000-0000-0000-0000-000000000000', 'ahmad.fajar@sditfajar.sch.id',crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Ahmad Fajar"}'::jsonb,          'authenticated', 'authenticated', null,           false, false, now(), now()),
    (v_parent_id,     '00000000-0000-0000-0000-000000000000', 'wali@sditfajar.sch.id',       crypt('Password123!', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Bapak Hendra Gunawan"}'::jsonb, 'authenticated', 'authenticated', '081234567890', false, false, now(), now())
  on conflict (id) do update set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    role = 'authenticated',
    aud = 'authenticated',
    phone = excluded.phone,
    confirmation_token = '',
    recovery_token = '',
    email_change = '',
    email_change_token_new = '',
    email_change_token_current = '',
    phone_change = '',
    phone_change_token = '',
    reauthentication_token = '',
    is_sso_user = false,
    is_anonymous = false,
    updated_at = now();

  -- Bersihkan & pasang identitas auth (diperlukan untuk GoTrue signInWithPassword)
  delete from auth.identities where user_id in (v_superadmin_id, v_admin_id, v_kepsek_id, v_ustahmad_id, v_ustsiti_id, v_student_id, v_parent_id);
  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values
    (v_superadmin_id, v_superadmin_id, format('{"sub":"%s","email":"%s"}', v_superadmin_id, 'superadmin@sditfajar.sch.id')::jsonb, 'email', v_superadmin_id::text, now(), now(), now()),
    (v_admin_id,      v_admin_id,      format('{"sub":"%s","email":"%s"}', v_admin_id, 'admin@sditfajar.sch.id')::jsonb,           'email', v_admin_id::text,      now(), now(), now()),
    (v_kepsek_id,     v_kepsek_id,     format('{"sub":"%s","email":"%s"}', v_kepsek_id, 'kepsek@sditfajar.sch.id')::jsonb,        'email', v_kepsek_id::text,     now(), now(), now()),
    (v_ustahmad_id,   v_ustahmad_id,   format('{"sub":"%s","email":"%s"}', v_ustahmad_id, 'ustahmad@sditfajar.sch.id')::jsonb,    'email', v_ustahmad_id::text,   now(), now(), now()),
    (v_ustsiti_id,    v_ustsiti_id,    format('{"sub":"%s","email":"%s"}', v_ustsiti_id, 'ustsiti@sditfajar.sch.id')::jsonb,      'email', v_ustsiti_id::text,    now(), now(), now()),
    (v_student_id,    v_student_id,    format('{"sub":"%s","email":"%s"}', v_student_id, 'ahmad.fajar@sditfajar.sch.id')::jsonb,  'email', v_student_id::text,    now(), now(), now()),
    (v_parent_id,     v_parent_id,     format('{"sub":"%s","email":"%s"}', v_parent_id, 'wali@sditfajar.sch.id')::jsonb,          'email', v_parent_id::text,     now(), now(), now());

  -- 7. SEED PROFILES DOMAIN
  insert into public.profiles (id, name, email, login_identifier, role, is_active, must_change_password)
  values
    (v_superadmin_id, 'Super Admin SDIT Fajar', 'superadmin@sditfajar.sch.id', 'superadmin', 'super_admin', true, false),
    (v_admin_id,      'Admin Sekolah',          'admin@sditfajar.sch.id',      'admin',      'admin',       true, false),
    (v_kepsek_id,     'Kepala Sekolah SDIT Fajar', 'kepsek@sditfajar.sch.id',  'kepsek',     'guru',        true, false),
    (v_ustahmad_id,   'Ustadz Ahmad Fauzi',     'ustahmad@sditfajar.sch.id',   'ustahmad',   'guru',        true, false),
    (v_ustsiti_id,    'Ustadzah Siti Aminah',   'ustsiti@sditfajar.sch.id',    'ustsiti',    'guru',        true, false),
    (v_student_id,    'Ahmad Fajar',            'ahmad.fajar@sditfajar.sch.id','202603001',  'murid',       true, true),
    (v_parent_id,     'Bapak Hendra Gunawan',   'wali@sditfajar.sch.id',       '081234567890','wali_murid', true, true)
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    login_identifier = excluded.login_identifier,
    role = excluded.role;

  -- 8. SEED TEACHERS
  insert into public.teachers (profile_id, nip, nuptk, bio)
  values
    (v_kepsek_id,   '197801012002121001', '89347582910001', 'Kepala Sekolah SDIT Fajar'),
    (v_ustahmad_id, '198505122010011002', '34958201930002', 'Guru Matematika & PJOK'),
    (v_ustsiti_id,  '199008202015022003', '75839201840003', 'Guru Tematik & Wali Kelas')
  on conflict (profile_id) do nothing;

  select id into v_teacher_kepsek_id from public.teachers where profile_id = v_kepsek_id;
  select id into v_teacher_ahmad_id from public.teachers where profile_id = v_ustahmad_id;
  select id into v_teacher_siti_id from public.teachers where profile_id = v_ustsiti_id;

  -- 9. SEED STUDENTS & PARENTS
  insert into public.students (profile_id, nis, nisn, gender, birth_place, birth_date, address)
  values (v_student_id, '202603001', '0123456789', 'L', 'Jakarta Selatan', '2017-05-15', 'Jl. Fatmawati No. 45, Jakarta Selatan')
  on conflict (profile_id) do nothing;

  select id into v_student_ahmad_id from public.students where profile_id = v_student_id;

  insert into public.parents (profile_id, occupation, address)
  values (v_parent_id, 'Wiraswasta', 'Jl. Fatmawati No. 45, Jakarta Selatan')
  on conflict (profile_id) do nothing;

  select id into v_parent_record_id from public.parents where profile_id = v_parent_id;

  -- Relasi Wali Murid ke Siswa (parent_students)
  insert into public.parent_students (parent_id, student_id, relationship, is_primary)
  values (v_parent_record_id, v_student_ahmad_id, 'ayah', true)
  on conflict (parent_id, student_id) do nothing;

  -- 10. SEED ROMBEL (classrooms)
  insert into public.classrooms (class_id, academic_year_id, name, homeroom_teacher_id)
  values (v_class3_id, v_year_id, '3 Khadijah', v_teacher_siti_id)
  on conflict (academic_year_id, name) do update set
    homeroom_teacher_id = excluded.homeroom_teacher_id
  returning id into v_classroom_id;

  -- Penempatan siswa ke kelas (class_students)
  insert into public.class_students (classroom_id, student_id, joined_at, status)
  values (v_classroom_id, v_student_ahmad_id, '2026-07-15', 'active')
  on conflict (classroom_id, student_id) do nothing;

  -- 11. SEED PENUGASAN JABATAN GURU (teacher_positions)
  insert into public.teacher_positions (teacher_id, position_id, classroom_id, academic_year_id)
  values
    (v_teacher_kepsek_id, v_pos_kepsek_id, null, v_year_id),
    (v_teacher_siti_id, v_pos_wali_id, v_classroom_id, v_year_id)
  on conflict do nothing;

  -- 12. SEED PENUGASAN MENGAJAR (teaching_assignments) & JADWAL
  insert into public.teaching_assignments (teacher_id, subject_id, classroom_id, semester_id)
  values
    (v_teacher_ahmad_id, v_subj_mtk_id, v_classroom_id, v_sem1_id),
    (v_teacher_siti_id,  v_subj_pai_id, v_classroom_id, v_sem1_id)
  on conflict (teacher_id, subject_id, classroom_id, semester_id) do nothing;

  insert into public.schedules (classroom_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
  values
    (v_classroom_id, v_subj_mtk_id, v_teacher_ahmad_id, 1, '08:00', '09:30', 'Ruang Kelas 3 Khadijah')
  on conflict do nothing
  returning id into v_schedule_id;

  -- 13. SEED MATERI DEMO (materials)
  insert into public.materials (
    title,
    slug,
    description,
    content,
    subject_id,
    classroom_id,
    teacher_id,
    semester_id,
    status,
    published_at
  ) values (
    'Bilangan Cacah Sampai 10.000',
    'bilangan-cacah-sampai-10000',
    'Memahami nilai tempat, membandingkan bilangan, dan operasi dasar berhitung.',
    'Materi pembelajaran matematika bab 1 untuk kelas 3 semester ganjil.',
    v_subj_mtk_id,
    v_classroom_id,
    v_teacher_ahmad_id,
    v_sem1_id,
    'published',
    now()
  ) on conflict do nothing;

  -- 14. SEED TUGAS DEMO (assignments)
  insert into public.assignments (
    title,
    description,
    instructions,
    subject_id,
    classroom_id,
    teacher_id,
    semester_id,
    due_at,
    status,
    max_score
  ) values (
    'Latihan Matematika Bab 1',
    'Kerjakan latihan soal mengenai penjumlahan dan pengurangan bersusun di buku tugas.',
    'Kumpulkan foto hasil pengerjaan atau lembar jawaban sebelum batas waktu deadline.',
    v_subj_mtk_id,
    v_classroom_id,
    v_teacher_ahmad_id,
    v_sem1_id,
    now() + interval '7 days',
    'published',
    100
  ) on conflict do nothing;

  -- 15. SEED MUTABAAH TAHFIDZ (tahfidz_records)
  insert into public.tahfidz_records (
    student_id,
    teacher_id,
    surah_number,
    ayat_start,
    ayat_end,
    predicate,
    record_date,
    notes
  ) values (
    v_student_ahmad_id,
    v_ustsiti_id,
    78, -- An-Naba'
    1,
    20,
    'mumtaz',
    current_date,
    'Makharijul huruf sangat fasih, tajwid tertib dan lancar.'
  ) on conflict do nothing;

  -- 16. SEED PAYMENT SETTINGS & INVOICES
  if not exists (select 1 from public.payment_settings) then
    insert into public.payment_settings (
      provider,
      environment,
      merchant_id,
      client_key,
      is_enabled,
      is_spp_enabled,
      is_iuran_enabled
    ) values (
      'midtrans',
      'sandbox',
      'G123456789',
      'SB-Mid-client-demoKey987654321',
      false, -- Dinonaktifkan default sampai super admin mengonfigurasi
      false,
      false
    );
  end if;

  insert into public.payment_invoices (
    student_id,
    parent_id,
    academic_year_id,
    type,
    billing_month,
    billing_year,
    title,
    amount,
    due_date,
    status,
    created_by
  ) values (
    v_student_ahmad_id,
    v_parent_record_id,
    v_year_id,
    'spp',
    7,
    2026,
    'SPP Juli 2026 - Ahmad Fajar',
    450000,
    '2026-07-20',
    'unpaid',
    v_admin_id
  ) on conflict do nothing;

  -- 17. SEED GELOMBANG PPDB AKTIF
  insert into public.admission_waves (
    academic_year_id,
    semester_id,
    wave_number,
    title,
    description,
    start_date,
    end_date,
    quota,
    registration_fee,
    observation_date,
    announcement_date,
    status,
    is_active
  ) values (
    v_year_id,
    v_sem1_id,
    1,
    'Gelombang 1 - Jalur Prestasi & Reguler',
    'Penerimaan Peserta Didik Baru Tahun Ajaran 2026/2027 Gelombang Perdana.',
    '2026-01-05',
    '2026-04-30',
    100,
    250000,
    '2026-05-10',
    '2026-05-15',
    'open',
    true
  ) on conflict (academic_year_id, wave_number) do nothing;

end $$;
