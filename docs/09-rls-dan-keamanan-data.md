# RLS & Keamanan Data

## Prinsip Utama
- Semua tabel domain yang berisi data internal wajib mengaktifkan Row Level Security.
- Frontend tidak boleh menjadi satu-satunya penjaga akses.
- Service role key hanya boleh digunakan di server.
- Data siswa hanya boleh terlihat oleh pihak yang punya relasi sah.

## Helper Function yang Disarankan
Buat helper SQL untuk role dan profile.

```sql
create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

create or replace function public.current_user_role()
returns app_role
language sql
stable
security definer
as $$
  select role from public.profiles where id = auth.uid()
$$;
```

## Policy Umum `profiles`
- User bisa membaca profil sendiri.
- Super admin dan admin sekolah bisa membaca semua profil.
- User tidak boleh mengubah role sendiri.
- Super admin bisa mengubah semua profile.
- Admin sekolah bisa mengelola user operasional, kecuali super admin.

## Policy Data Siswa
Siswa boleh membaca data dirinya sendiri.

Orang tua boleh membaca data anak yang terhubung melalui `parent_students`.

Guru boleh membaca data siswa pada kelas yang diajar.

Wali kelas boleh membaca data siswa pada kelas binaannya.

Kepala sekolah boleh membaca semua data siswa.

Admin sekolah dan super admin boleh mengelola data siswa.

## Policy Materi
- Materi `published` bisa dibaca siswa pada kelas terkait.
- Orang tua bisa membaca materi anaknya.
- Guru bisa mengelola materi yang dibuat olehnya.
- Wali kelas bisa melihat materi kelas binaannya.
- Admin/kepala sekolah bisa melihat semua materi.

## Policy Tugas
- Siswa hanya bisa membaca tugas untuk kelasnya.
- Siswa hanya bisa membuat/mengubah submission miliknya sendiri.
- Guru hanya bisa membuat tugas untuk kelas/mapel yang diajar.
- Guru hanya bisa menilai submission dari assignment miliknya.
- Orang tua hanya bisa melihat tugas/submission anaknya.

## Policy Nilai
- Siswa hanya melihat nilai sendiri.
- Orang tua hanya melihat nilai anak.
- Guru hanya melihat nilai kelas/mapel yang diajar.
- Wali kelas melihat nilai kelas binaan.
- Kepala sekolah melihat laporan semua kelas.

## Policy Payment
Karena payment belum aktif:
- Admin dan super admin boleh melihat/mengelola setup.
- Orang tua hanya boleh melihat invoice anaknya jika invoice sudah bukan draft.
- Siswa tidak perlu melihat payment kecuali nanti diminta.
- Endpoint create transaction harus disabled jika `payment_settings.is_enabled = false`.

## File Upload Security
- Validasi tipe file di frontend dan backend.
- Batas ukuran file harus jelas.
- Jangan izinkan `.exe`, `.sh`, `.bat`, `.js`, atau file berbahaya.
- Simpan file di path berbasis domain, bukan path random tanpa struktur.
- Jika bucket private, gunakan signed URL.

## Secret Management
Tidak boleh muncul di client:
- `SUPABASE_SERVICE_ROLE_KEY`
- `MIDTRANS_SERVER_KEY`
- secret provider lain

Boleh public jika memang aman:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` jika dibutuhkan Snap client

## Audit Log
Aksi yang wajib dicatat:
- create/update/delete user;
- update role;
- create/update/delete kelas;
- create/update/delete tugas;
- update nilai;
- create/update payment setting;
- create/update invoice;
- callback payment.

## Checklist Keamanan Tiap Fitur
- Apakah route dashboard protected?
- Apakah role dicek di server?
- Apakah RLS sudah aktif?
- Apakah query difilter sesuai relasi?
- Apakah input divalidasi dengan Zod?
- Apakah error tidak membocorkan secret?
- Apakah mutasi penting masuk audit log?
