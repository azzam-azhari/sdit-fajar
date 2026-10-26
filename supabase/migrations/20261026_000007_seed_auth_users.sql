-- ==============================================================================
-- FASE 3: MIGRATION 07 - SEED SUPABASE AUTH USERS & IDENTITIES
-- Mengaktifkan 7 Akun Demo di Supabase Auth (GoTrue) agar bisa langsung login
-- Kata Sandi Resmi Demo: Password123!
-- ==============================================================================

set search_path = public, extensions, auth;

do $$
declare
  v_superadmin_id uuid := '00000000-0000-0000-0000-000000000001';
  v_admin_id      uuid := '00000000-0000-0000-0000-000000000002';
  v_kepsek_id     uuid := '00000000-0000-0000-0000-000000000003';
  v_ustahmad_id   uuid := '00000000-0000-0000-0000-000000000004';
  v_ustsiti_id    uuid := '00000000-0000-0000-0000-000000000005';
  v_student_id    uuid := '00000000-0000-0000-0000-000000000006';
  v_parent_id     uuid := '00000000-0000-0000-0000-000000000007';

  v_encrypted_pw  text;
begin
  -- 1. Generate hash bcrypt yang valid untuk 'Password123!' langsung di database
  v_encrypted_pw := crypt('Password123!', gen_salt('bf', 10));

  -- 2. Insert / Update ke tabel auth.users
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
    is_sso_user,
    is_anonymous,
    created_at,
    updated_at
  ) values
    (
      v_superadmin_id,
      '00000000-0000-0000-0000-000000000000',
      'superadmin@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Super Admin SDIT Fajar"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    ),
    (
      v_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Admin Sekolah"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    ),
    (
      v_kepsek_id,
      '00000000-0000-0000-0000-000000000000',
      'kepsek@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Kepala Sekolah SDIT Fajar"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    ),
    (
      v_ustahmad_id,
      '00000000-0000-0000-0000-000000000000',
      'ustahmad@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Ustadz Ahmad Fauzi"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    ),
    (
      v_ustsiti_id,
      '00000000-0000-0000-0000-000000000000',
      'ustsiti@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Ustadzah Siti Aminah"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    ),
    (
      v_student_id,
      '00000000-0000-0000-0000-000000000000',
      'ahmad.fajar@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Ahmad Fajar"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    ),
    (
      v_parent_id,
      '00000000-0000-0000-0000-000000000000',
      'wali@sditfajar.sch.id',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Bapak Hendra Gunawan"}'::jsonb,
      'authenticated',
      'authenticated',
      false,
      false,
      now(),
      now()
    )
  on conflict (id) do update set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    role = 'authenticated',
    aud = 'authenticated',
    confirmation_token = '',
    recovery_token = '',
    email_change = '',
    email_change_token_new = '',
    email_change_token_current = '',
    phone = '',
    phone_change = '',
    phone_change_token = '',
    reauthentication_token = '',
    is_sso_user = false,
    is_anonymous = false,
    updated_at = now();

  -- 3. Bersihkan identitas lama untuk 7 user ini agar tidak bentrok constraint
  delete from auth.identities where user_id in (
    v_superadmin_id,
    v_admin_id,
    v_kepsek_id,
    v_ustahmad_id,
    v_ustsiti_id,
    v_student_id,
    v_parent_id
  );

  -- 4. Insert ke tabel auth.identities (id kolom bertipe UUID)
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values
    (
      v_superadmin_id,
      v_superadmin_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_superadmin_id, 'superadmin@sditfajar.sch.id')::jsonb,
      'email',
      v_superadmin_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_admin_id,
      v_admin_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_admin_id, 'admin@sditfajar.sch.id')::jsonb,
      'email',
      v_admin_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_kepsek_id,
      v_kepsek_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_kepsek_id, 'kepsek@sditfajar.sch.id')::jsonb,
      'email',
      v_kepsek_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_ustahmad_id,
      v_ustahmad_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_ustahmad_id, 'ustahmad@sditfajar.sch.id')::jsonb,
      'email',
      v_ustahmad_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_ustsiti_id,
      v_ustsiti_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_ustsiti_id, 'ustsiti@sditfajar.sch.id')::jsonb,
      'email',
      v_ustsiti_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_student_id,
      v_student_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_student_id, 'ahmad.fajar@sditfajar.sch.id')::jsonb,
      'email',
      v_student_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_parent_id,
      v_parent_id,
      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_parent_id, 'wali@sditfajar.sch.id')::jsonb,
      'email',
      v_parent_id::text,
      now(),
      now(),
      now()
    );

  -- 5. Sinkronkan dengan tabel public.profiles
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
    role = excluded.role,
    is_active = true;

end $$;
