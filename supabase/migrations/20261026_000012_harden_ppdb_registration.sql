-- ==============================================================================
-- FASE 3: MIGRATION 12 - HARDEN PPDB REGISTRATION
-- Menambahkan kolom mother_phone, unique index (nik, wave), sequence nomor registrasi,
-- dan policy DELETE untuk admin & super admin.
-- ==============================================================================

-- 1. Tambah kolom mother_phone jika belum ada
alter table public.student_registration_applications
  add column if not exists mother_phone text;

-- 2. Unique index (nik, admission_wave_id) untuk mencegah pendaftaran ganda NIK pada gelombang yang sama
create unique index if not exists idx_reg_apps_nik_wave 
  on public.student_registration_applications(nik, admission_wave_id) 
  where nik is not null and nik != '';

-- 3. Sequence dan Function nomor registrasi PPDB-YYYY-XXXX (konkurensi aman, bukan max()+1)
create sequence if not exists public.seq_registration_number start with 1001;

create or replace function public.generate_registration_number()
returns text
language plpgsql
security definer
as $$
declare
  v_year text;
  v_seq bigint;
begin
  v_year := to_char(now(), 'YYYY');
  v_seq := nextval('public.seq_registration_number');
  return 'PPDB-' || v_year || '-' || lpad(v_seq::text, 4, '0');
end;
$$;

grant usage on sequence public.seq_registration_number to public, authenticated, service_role;
grant execute on function public.generate_registration_number() to public, authenticated, service_role;

-- 4. Policy DELETE untuk admin dan super admin
drop policy if exists "Registration apps admin delete" on public.student_registration_applications;
create policy "Registration apps admin delete"
  on public.student_registration_applications for delete
  to authenticated
  using (public.is_admin_or_super());
