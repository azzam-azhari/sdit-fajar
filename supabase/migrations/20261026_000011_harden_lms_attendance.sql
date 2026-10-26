-- FASE 5: LMS, attendance integrity, and least-privilege policies.
-- All clock-dependent rules use the database server in Asia/Jakarta.

alter type public.attendance_status add value if not exists 'sick';

create or replace function public.current_teacher_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.teachers where profile_id = (select auth.uid()) and is_active = true limit 1;
$$;

create or replace function public.can_manage_teaching_scope(
  p_teacher_id uuid, p_subject_id uuid, p_classroom_id uuid, p_semester_id uuid
) returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin_or_super() or exists (
    select 1 from public.teaching_assignments ta
    where ta.teacher_id = p_teacher_id
      and ta.subject_id = p_subject_id
      and ta.classroom_id = p_classroom_id
      and ta.semester_id = p_semester_id
      and ta.teacher_id = public.current_teacher_id()
  );
$$;

create or replace function public.is_my_homeroom(p_classroom_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.classrooms c
    where c.id = p_classroom_id and c.homeroom_teacher_id = public.current_teacher_id()
  );
$$;

revoke all on function public.current_teacher_id() from public;
revoke all on function public.can_manage_teaching_scope(uuid, uuid, uuid, uuid) from public;
revoke all on function public.is_my_homeroom(uuid) from public;
grant execute on function public.current_teacher_id() to authenticated;
grant execute on function public.can_manage_teaching_scope(uuid, uuid, uuid, uuid) to authenticated;
grant execute on function public.is_my_homeroom(uuid) to authenticated;

create or replace function public.enforce_submission_integrity()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_assignment public.assignments%rowtype;
  v_is_student boolean;
begin
  select * into v_assignment from public.assignments where id = new.assignment_id;
  if not found then raise exception 'Tugas tidak ditemukan.'; end if;
  if v_assignment.due_at is null then raise exception 'Tugas belum memiliki batas waktu yang valid.'; end if;
  select exists (
    select 1 from public.students s where s.id = new.student_id and s.profile_id = (select auth.uid())
  ) into v_is_student;

  if tg_op = 'INSERT' or (v_is_student and new.submitted_at is distinct from old.submitted_at) then
    if v_assignment.status <> 'published' then raise exception 'Tugas belum tersedia untuk dikumpulkan.'; end if;
    if not exists (
      select 1 from public.class_students cs
      where cs.student_id = new.student_id and cs.classroom_id = v_assignment.classroom_id
        and cs.status = 'active' and cs.left_at is null
    ) then raise exception 'Murid bukan anggota rombel tugas ini.'; end if;
    if now() > v_assignment.due_at and not v_assignment.allow_late_submission then
      raise exception 'Batas waktu pengumpulan tugas telah berakhir.';
    end if;
    new.submitted_at := now();
    new.status := case when now() > v_assignment.due_at then 'late' else 'submitted' end;
  end if;

  if v_is_student and tg_op = 'UPDATE' and (
    new.score is distinct from old.score or new.feedback is distinct from old.feedback or
    new.graded_by is distinct from old.graded_by or new.graded_at is distinct from old.graded_at
  ) then raise exception 'Murid tidak dapat mengubah penilaian.'; end if;

  if new.score is not null then
    if new.score < 0 or new.score > least(100, v_assignment.max_score) then
      raise exception 'Nilai harus berada dalam rentang 0 sampai skor maksimum tugas.';
    end if;
    new.status := 'graded';
    if new.graded_at is null then new.graded_at := now(); end if;
  end if;
  return new;
end;
$$;

create or replace function public.enforce_teacher_attendance_integrity()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_local timestamp := now() at time zone 'Asia/Jakarta'; v_dow int;
begin
  v_dow := extract(isodow from v_local);
  if v_dow in (6, 7) and not exists (
    select 1 from public.school_period_settings where teacher_weekend_attendance_enabled = true
  ) then raise exception 'Presensi guru akhir pekan belum diaktifkan.'; end if;
  if new.session = 'check_in' and (v_local::time < time '06:30' or v_local::time > time '07:30') then
    raise exception 'Check-in hanya tersedia pukul 06.30–07.30 WIB.';
  end if;
  if new.session = 'check_out' and v_local::time < time '14:30' then
    raise exception 'Check-out tersedia mulai pukul 14.30 WIB.';
  end if;
  new.attendance_date := v_local::date;
  new.recorded_at := now();
  new.status := 'present';
  return new;
end;
$$;

create or replace function public.enforce_student_attendance_integrity()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_local_date date := (now() at time zone 'Asia/Jakarta')::date; v_schedule public.schedules%rowtype;
begin
  if extract(isodow from v_local_date) not between 1 and 5 then
    raise exception 'Presensi murid hanya dapat dicatat Senin sampai Jumat.';
  end if;
  select * into v_schedule from public.schedules where id = new.schedule_id;
  if not found or v_schedule.classroom_id <> new.classroom_id then raise exception 'Jadwal tidak sesuai rombel.'; end if;
  if v_schedule.day_of_week <> extract(isodow from v_local_date) then raise exception 'Jadwal tidak berlangsung hari ini.'; end if;
  if not exists (
    select 1 from public.class_students cs where cs.classroom_id = new.classroom_id
      and cs.student_id = new.student_id and cs.status = 'active' and cs.left_at is null
  ) then raise exception 'Murid bukan anggota rombel.'; end if;
  new.attendance_date := v_local_date;
  return new;
end;
$$;

drop trigger if exists enforce_assignment_submission_integrity on public.assignment_submissions;
create trigger enforce_assignment_submission_integrity before insert or update on public.assignment_submissions
for each row execute function public.enforce_submission_integrity();
drop trigger if exists enforce_teacher_attendance_integrity on public.teacher_attendances;
create trigger enforce_teacher_attendance_integrity before insert on public.teacher_attendances
for each row execute function public.enforce_teacher_attendance_integrity();
drop trigger if exists enforce_student_attendance_integrity on public.student_attendances;
create trigger enforce_student_attendance_integrity before insert or update on public.student_attendances
for each row execute function public.enforce_student_attendance_integrity();

-- A teacher may manage only their active teaching assignments; homeroom teachers read class data.
drop policy if exists "Materials manage policy" on public.materials;
create policy "Materials manage assigned teaching" on public.materials for all to authenticated
using ((select public.can_manage_teaching_scope(teacher_id, subject_id, classroom_id, semester_id)))
with check ((select public.can_manage_teaching_scope(teacher_id, subject_id, classroom_id, semester_id)));
drop policy if exists "Assignments manage policy" on public.assignments;
create policy "Assignments manage assigned teaching" on public.assignments for all to authenticated
using ((select public.can_manage_teaching_scope(teacher_id, subject_id, classroom_id, semester_id)))
with check ((select public.can_manage_teaching_scope(teacher_id, subject_id, classroom_id, semester_id)));

drop policy if exists "Submissions student submit policy" on public.assignment_submissions;
create policy "Submissions own assigned task insert" on public.assignment_submissions for insert to authenticated
with check (
  exists (select 1 from public.students s where s.id = student_id and s.profile_id = (select auth.uid()))
  and exists (select 1 from public.assignments a join public.class_students cs on cs.classroom_id = a.classroom_id
    where a.id = assignment_id and cs.student_id = assignment_submissions.student_id and cs.status = 'active' and cs.left_at is null)
);
drop policy if exists "Submissions update policy" on public.assignment_submissions;
create policy "Submissions owner or assigned teacher update" on public.assignment_submissions for update to authenticated
using (
  exists (select 1 from public.students s where s.id = student_id and s.profile_id = (select auth.uid())) or
  exists (select 1 from public.assignments a where a.id = assignment_id and
    (select public.can_manage_teaching_scope(a.teacher_id, a.subject_id, a.classroom_id, a.semester_id)))
)
with check (
  exists (select 1 from public.students s where s.id = student_id and s.profile_id = (select auth.uid())) or
  exists (select 1 from public.assignments a where a.id = assignment_id and
    (select public.can_manage_teaching_scope(a.teacher_id, a.subject_id, a.classroom_id, a.semester_id)))
);

drop policy if exists "Student attendances write" on public.student_attendances;
create policy "Student attendance assigned teacher or homeroom" on public.student_attendances for all to authenticated
using (
  public.is_admin_or_super() or (select public.is_my_homeroom(classroom_id)) or
  exists (select 1 from public.schedules sch join public.teaching_assignments ta on ta.teacher_id = sch.teacher_id
    where sch.id = schedule_id and ta.classroom_id = student_attendances.classroom_id and ta.subject_id = sch.subject_id
      and ta.teacher_id = public.current_teacher_id())
)
with check (
  public.is_admin_or_super() or (select public.is_my_homeroom(classroom_id)) or
  exists (select 1 from public.schedules sch join public.teaching_assignments ta on ta.teacher_id = sch.teacher_id
    where sch.id = schedule_id and ta.classroom_id = student_attendances.classroom_id and ta.subject_id = sch.subject_id
      and ta.teacher_id = public.current_teacher_id())
);

-- Private LMS files are accessed only through server-authorized signed URLs.
drop policy if exists "Authenticated Access for LMS Files" on storage.objects;
drop policy if exists "Authenticated Upload for LMS Files" on storage.objects;
