-- ==============================================================================
-- FASE 3: MIGRATION 05 - STORAGE BUCKETS & STORAGE POLICIES
-- Sesuai Dokumen PRD 14 (Storage & Upload) dan Konstitusi Sistem
-- ==============================================================================

-- 1. Inisialisasi 4 Buckets Resmi ke storage.buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'images',
    'images',
    true, -- Bucket gambar/avatar/banner publik
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'lms-files',
    'lms-files',
    false, -- Privat: Akses via Signed URL
    10485760, -- 10 MB
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  ),
  (
    'registration-files',
    'registration-files',
    false, -- Privat: Dokumen PPDB via Signed URL
    5242880, -- 5 MB
    array['application/pdf', 'image/jpeg', 'image/png']
  ),
  (
    'marketplace-files',
    'marketplace-files',
    false, -- Privat: E-book/modul via Signed URL pasca bayar
    52428800, -- 50 MB
    array['application/pdf', 'application/epub+zip']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Kebijakan RLS Storage Objects (storage.objects)
-- Catatan: RLS sudah aktif secara default pada storage.objects di Supabase.
-- Dilarang menjalankan 'alter table storage.objects enable row level security;' karena tabel ini milik internal supabase_storage_admin.

-- Bersihkan policy lama jika ada (idempotent)
drop policy if exists "Public Access for Images" on storage.objects;
drop policy if exists "Authenticated Upload for Images" on storage.objects;
drop policy if exists "Authenticated Access for LMS Files" on storage.objects;
drop policy if exists "Authenticated Upload for LMS Files" on storage.objects;
drop policy if exists "Authenticated users can read images" on storage.objects;
drop policy if exists "Staff can manage images" on storage.objects;
drop policy if exists "LMS participants can read class files" on storage.objects;
drop policy if exists "Teachers can upload lms files" on storage.objects;
drop policy if exists "Admin only for registration files" on storage.objects;
drop policy if exists "Marketplace files access" on storage.objects;

-- Policy 1: Siapapun (publik) dapat melihat asset gambar di bucket 'images'
create policy "Public Access for Images"
  on storage.objects for select
  to public
  using (bucket_id = 'images');

-- Policy 2: Pengguna login dapat mengunggah gambar ke bucket 'images'
create policy "Authenticated Upload for Images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

-- Policy 3: Akses berkas privat lms-files untuk pengguna terotentikasi
create policy "Authenticated Access for LMS Files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lms-files');

-- Policy 4: Pengguna terotentikasi dapat mengunggah berkas ke lms-files
create policy "Authenticated Upload for LMS Files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lms-files');

-- Catatan untuk bucket privat 'registration-files' dan 'marketplace-files':
-- Berkas di kedua bucket ini tidak memiliki public/authenticated direct policy
-- dan HANYA dapat diakses melalui Signed URL berumur pendek yang dihasilkan
-- oleh Next.js Server Actions (src/lib/supabase/storage.ts).
