-- ==============================================================================
-- FASE 3: MIGRATION 10 - FIX RLS INFINITE RECURSION ON PROFILES & PARENT_STUDENTS
-- Memperbaiki error PostgreSQL 42P17 (infinite recursion detected in policy for relation "parent_students")
-- Memastikan seluruh 5 role resmi (super_admin, admin, guru, murid, wali_murid)
-- dapat membaca profil masing-masing dan diarahkan ke dashboard role yang sesuai.
-- ==============================================================================

set search_path = public, auth, extensions;

-- 1. Helper function: Mendapatkan parent.id milik auth.uid() tanpa memicu RLS rekursif
create or replace function public.get_current_parent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.parents where profile_id = auth.uid() limit 1;
$$;

-- 2. Helper function: Mendapatkan student.id milik auth.uid() tanpa memicu RLS rekursif
create or replace function public.get_current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.students where profile_id = auth.uid() limit 1;
$$;

-- 3. Helper function: Mendapatkan daftar profile_id anak untuk wali murid aktif
create or replace function public.get_my_children_profile_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select s.profile_id
  from public.students s
  join public.parent_students ps on ps.student_id = s.id
  join public.parents p on p.id = ps.parent_id
  where p.profile_id = auth.uid();
$$;

-- Berikan hak eksekusi helper functions ke role authenticated
grant execute on function public.get_current_parent_id() to authenticated;
grant execute on function public.get_current_student_id() to authenticated;
grant execute on function public.get_my_children_profile_ids() to authenticated;

-- 4. Perbaiki Policy pada public.parent_students (Putus siklus rekursi ke students)
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

-- 5. Perbaiki Policy pada public.profiles (Akses profil pengguna aman, terisolasi, dan bebas rekursi)
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

-- 6. Perbaiki Policy pada public.students (Gunakan get_current_parent_id agar tidak nested subquery melingkar)
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
      where cs.student_id = public.students.id and t.profile_id = (select auth.uid())
    )
    or exists (
      select 1 from public.class_students cs
      join public.classrooms c on c.id = cs.classroom_id
      join public.teachers t on t.id = c.homeroom_teacher_id
      where cs.student_id = public.students.id and t.profile_id = (select auth.uid())
    )
  );
