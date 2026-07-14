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

## Policy Konten Publik dan `school_settings`
- Konten published seperti berita, galeri, katalog marketplace, dan halaman publik dapat dibaca guest.
- Admin sekolah mengelola konten operasional yang ditugaskan.
- Hanya super admin yang dapat mengubah `school_settings`, termasuk logo, alamat, nomor telepon, WhatsApp, email, peta, dan social links.

## Policy Data Siswa
Siswa boleh membaca data dirinya sendiri.

Wali murid boleh membaca data anak yang terhubung melalui `parent_students`.

Guru boleh membaca data siswa pada kelas yang diajar.

Wali kelas boleh membaca data siswa pada kelas binaannya.

Kepala sekolah boleh membaca semua data siswa.

Admin sekolah dan super admin boleh mengelola data siswa.

## Policy Materi
- Materi `published` bisa dibaca siswa pada kelas terkait.
- Wali murid bisa membaca materi anaknya.
- Guru bisa mengelola materi yang dibuat olehnya.
- Wali kelas bisa melihat materi kelas binaannya.
- Admin/kepala sekolah bisa melihat semua materi.

## Policy Tugas
- Siswa hanya bisa membaca tugas untuk kelasnya.
- Siswa hanya bisa membuat/mengubah submission miliknya sendiri.
- Guru hanya bisa membuat tugas untuk kelas/mapel yang diajar.
- Guru hanya bisa menilai submission dari assignment miliknya.
- Wali murid hanya bisa melihat tugas/submission anaknya.

## Policy Nilai
- Siswa hanya melihat nilai sendiri.
- Wali murid hanya melihat nilai anak.
- Guru hanya melihat nilai kelas/mapel yang diajar.
- Wali kelas melihat nilai kelas binaan.
- Kepala sekolah melihat laporan semua kelas.

## Policy Pendaftaran dan Import
- Pendaftar publik hanya dapat membuat application dan upload dokumen melalui endpoint terbatas.
- Admin dapat membaca/review application sesuai permission.
- Super admin menyetujui application dan menjalankan import CSV.
- Hanya super admin yang dapat membaca `import_batches` dan template source file.
- Semua file pendaftaran private dan diakses signed URL setelah guard relasi.

## Policy Absensi
- Guru dapat membuat/update absensi dirinya sendiri pada sesi yang sedang terbuka.
- Guru hanya dapat mencatat absensi siswa dari kelas/mapel assignment-nya.
- Wali kelas dapat mencatat dan melihat siswa kelas binaannya.
- Kepala sekolah/admin dapat membaca rekap; kepala sekolah mengubah flag weekend.
- Siswa dan wali murid hanya membaca absensi diri/anak.
- Server memvalidasi hari, waktu sesi, periode aktif, dan duplikasi.

## Policy Chat
- User hanya dapat membaca `chat_threads` jika terdaftar di `chat_thread_members`.
- User hanya dapat mengirim pesan sebagai `sender_id = auth.uid()` pada thread yang diikutinya.
- Realtime tidak boleh menjadi bypass RLS.

## Policy Marketplace
- Katalog published dapat dibaca publik tanpa login.
- Admin/super admin mengelola produk.
- Wali murid hanya dapat membaca order miliknya dan file setelah payment paid.
- File produk tetap private; gunakan signed URL berumur pendek.

## Policy Payment
- Hanya super admin yang dapat mengubah credential/config provider dan aktivasi global.
- Admin sekolah dapat mengelola invoice dan modul yang telah diizinkan.
- Hanya `wali_murid` yang dapat membuat transaksi pembayaran dan checkout marketplace.
- Wali murid hanya membaca invoice, transaction, dan receipt untuk siswa yang terhubung.
- Admin tidak otomatis mendapat akses ke receipt anak tanpa profile `wali_murid` terpisah.
- Endpoint create transaction harus menolak jika flag environment/database/modul tidak aktif.
- Webhook tidak boleh menerima status `paid` tanpa signature valid dan idempotency check.

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
- create/update/delete registration/import batch;
- create/update attendance;
- create/delete chat thread/message;
- create/update marketplace product/order;
- create/update payment receipt;
- callback payment.

## Checklist Keamanan Tiap Fitur
- Apakah route dashboard protected?
- Apakah role dicek di server?
- Apakah RLS sudah aktif?
- Apakah query difilter sesuai relasi?
- Apakah input divalidasi dengan Zod?
- Apakah error tidak membocorkan secret?
- Apakah mutasi penting masuk audit log?
