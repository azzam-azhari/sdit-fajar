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
