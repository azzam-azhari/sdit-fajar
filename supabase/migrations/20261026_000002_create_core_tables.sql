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
