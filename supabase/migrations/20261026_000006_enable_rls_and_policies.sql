-- ==============================================================================
-- FASE 3: MIGRATION 06 - SECURITY HELPER FUNCTIONS, ENABLE RLS & POLICIES
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
$$;

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
    id = auth.uid()
    or public.is_admin_or_super()
    or exists (
      select 1 from public.students s
      where s.profile_id = public.profiles.id
      and exists (
        select 1 from public.parent_students ps
        join public.parents p on p.id = ps.parent_id
        where ps.student_id = s.id and p.profile_id = auth.uid()
      )
    )
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
    profile_id = auth.uid()
    or public.is_admin_or_super()
    or public.has_teacher_position('kepala_sekolah')
    or exists (
      select 1 from public.parent_students ps
      join public.parents p on p.id = ps.parent_id
      where ps.student_id = public.students.id and p.profile_id = auth.uid()
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
    or exists (
      select 1 from public.parents p
      where p.id = public.parent_students.parent_id and p.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.students s
      where s.id = public.parent_students.student_id and s.profile_id = auth.uid()
    )
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
