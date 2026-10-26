-- ==============================================================================
-- FASE 3: MIGRATION 09 - REPAIR SUPABASE AUTH USERS & IDENTITIES
-- Memperbaiki kolom string token & boolean agar tidak bernilai NULL
-- (Kolom phone tetap NULL kecuali wali murid agar tidak melanggar users_phone_key)
-- ==============================================================================

set search_path = auth, public, extensions;

-- 1. Normalisasi token dan boolean pada auth.users (TIDAK menyentuh phone agar tetap NULL unik)
update auth.users
set
  confirmation_token         = coalesce(confirmation_token, ''),
  recovery_token             = coalesce(recovery_token, ''),
  email_change               = coalesce(email_change, ''),
  email_change_token_new     = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change               = coalesce(phone_change, ''),
  phone_change_token         = coalesce(phone_change_token, ''),
  reauthentication_token     = coalesce(reauthentication_token, ''),
  is_sso_user                = coalesce(is_sso_user, false),
  is_anonymous               = coalesce(is_anonymous, false),
  aud                        = coalesce(aud, 'authenticated'),
  role                       = coalesce(role, 'authenticated'),
  instance_id                = coalesce(instance_id, '00000000-0000-0000-0000-000000000000')
where id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000007'
);

-- 2. Pasang nomor telepon resmi khusus akun wali murid (karena unik)
update auth.users
set phone = '081234567890'
where id = '00000000-0000-0000-0000-000000000007';

-- 3. Pastikan identity_data memiliki payload JSON valid
update auth.identities
set identity_data = jsonb_build_object(
  'sub', user_id::text,
  'email', (select email from auth.users where auth.users.id = auth.identities.user_id),
  'email_verified', false,
  'phone_verified', false
)
where user_id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000007'
);
