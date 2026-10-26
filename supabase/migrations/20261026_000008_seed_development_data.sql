-- ==============================================================================
-- FASE 3: MIGRATION 08 - SEED DATA PENGEMBANGAN TAHUN AJARAN 2026/2027
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
    (v_superadmin_id, v_superadmin_id, format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_superadmin_id, 'superadmin@sditfajar.sch.id')::jsonb, 'email', v_superadmin_id::text, now(), now(), now()),
    (v_admin_id,      v_admin_id,      format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_admin_id, 'admin@sditfajar.sch.id')::jsonb,           'email', v_admin_id::text,      now(), now(), now()),
    (v_kepsek_id,     v_kepsek_id,     format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_kepsek_id, 'kepsek@sditfajar.sch.id')::jsonb,        'email', v_kepsek_id::text,     now(), now(), now()),
    (v_ustahmad_id,   v_ustahmad_id,   format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_ustahmad_id, 'ustahmad@sditfajar.sch.id')::jsonb,    'email', v_ustahmad_id::text,   now(), now(), now()),
    (v_ustsiti_id,    v_ustsiti_id,    format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_ustsiti_id, 'ustsiti@sditfajar.sch.id')::jsonb,      'email', v_ustsiti_id::text,    now(), now(), now()),
    (v_student_id,    v_student_id,    format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_student_id, 'ahmad.fajar@sditfajar.sch.id')::jsonb,  'email', v_student_id::text,    now(), now(), now()),
    (v_parent_id,     v_parent_id,     format('{"sub":"%s","email":"%s","email_verified":false,"phone_verified":false}', v_parent_id, 'wali@sditfajar.sch.id')::jsonb,          'email', v_parent_id::text,     now(), now(), now());

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
