# Alur Database

## Sumber Identitas User
Autentikasi user menggunakan Supabase Auth.
Data domain user disimpan di tabel `profiles`.

Alur:
1. User dibuat di Supabase Auth.
2. Trigger membuat baris `profiles`.
3. Admin melengkapi role dan metadata.
4. App menggunakan `auth.users.id` sebagai `profiles.id`.

## Relasi Role Akademik

### Siswa
- `profiles.role = murid`.
- Detail siswa disimpan di `students`.
- Siswa masuk rombel melalui `class_students`.

### Wali Murid
- `profiles.role = wali_murid`.
- Relasi wali murid ke siswa disimpan di `parent_students`.
- Satu wali murid bisa memiliki lebih dari satu anak.
- Satu siswa bisa memiliki lebih dari satu wali murid jika diperlukan.

### Guru
- `profiles.role = guru` atau `wali_kelas`.
- Detail guru disimpan di `teachers`.
- Relasi guru ke mapel dan kelas disimpan di `teaching_assignments`.

### Wali Kelas
- Wali kelas ditentukan di `homeroom_assignments` atau field `homeroom_teacher_id` pada rombel.
- Jangan membuat role tambahan seperti `guru_wali_kelas`.

## Alur Tahun Ajaran
1. Admin membuat `academic_years`.
2. Admin membuat `semesters` di bawah tahun ajaran.
3. Admin membuat kelas/rombel.
4. Admin memasukkan siswa ke rombel.
5. Semua materi, tugas, jadwal, dan nilai terkait ke semester aktif.

## Alur Materi
1. Guru membuat materi.
2. Sistem memvalidasi guru mengajar kelas/mapel tersebut.
3. Materi disimpan di `materials`.
4. File materi disimpan di Supabase Storage.
5. Siswa melihat materi berdasarkan rombel dan status `published`.

## Alur Tugas
1. Guru membuat `assignments`.
2. Tugas terkait ke kelas, mapel, guru, semester.
3. Siswa mengumpulkan tugas ke `assignment_submissions`.
4. Guru memberi nilai pada submission.
5. Nilai akhir bisa disalin atau direkap ke `grades` jika dibutuhkan.

## Alur Nilai
Terdapat dua pendekatan:

### Pendekatan A - Nilai dari Submission
Nilai tugas langsung dibaca dari `assignment_submissions.score`.
Cocok untuk MVP.

### Pendekatan B - Gradebook Terpisah
Nilai direkap di tabel `grades`.
Cocok untuk laporan semester.

Untuk MVP, gunakan pendekatan A terlebih dahulu.
Jika butuh rapor atau rekap semester, tambahkan `grades`.

## Alur Pengumuman
1. Admin/guru/wali kelas membuat pengumuman.
2. Pengumuman memiliki target audience.
3. Sistem menampilkan pengumuman berdasarkan role, kelas, atau user.

Target pengumuman:
- semua user;
- role tertentu;
- kelas tertentu;
- murid/wali murid tertentu.

## Alur Pendaftaran dan Import
1. Pendaftaran publik membuat `student_registration_applications` tanpa membuka data internal.
2. Setiap unggahan disimpan ke Storage dan URL/path dicatat di `student_registration_documents`.
3. Super admin menyetujui pendaftaran dan membuat profile/relasi akademik.
4. Super admin mengimpor data memakai template CSV.
5. Sistem menyimpan file sumber dan ringkasan hasil di `import_batches`.

## Alur Absensi
1. `school_period_settings` menentukan bulan, tahun, dan weekend attendance.
2. `teacher_attendances` menyimpan sesi `check_in` 07.30 dan `check_out` 14.30.
3. Sabtu-Minggu guru hanya boleh diabsen jika flag aktif oleh kepala sekolah.
4. `student_attendances` terkait `schedules` dan hanya dibuat untuk hari Senin-Jumat.
5. RLS membatasi pencatatan dan pembacaan berdasarkan role serta relasi kelas/mapel.

## Alur Chat
1. Super admin/admin membuat thread atau menambahkan anggota sesuai permission.
2. Anggota thread disimpan di `chat_thread_members`.
3. Pesan disimpan di `chat_messages`; Realtime hanya mengirim event dari data yang telah lolos RLS.

## Alur Marketplace
1. Konten dikelola di `marketplace_products` dengan cover/file URL atau path.
2. Wali murid membuat `marketplace_orders` dan itemnya.
3. Order menghasilkan `payment_invoices` bertipe `marketplace`.
4. Signed URL file baru dibuat setelah transaksi berstatus paid.

## Alur Payment Midtrans
1. Super admin membuat konfigurasi payment dan aktivasi global.
2. Midtrans secret disimpan di env.
3. Tabel `payment_settings` menyimpan status feature flag.
4. Admin sekolah membuat invoice SPP, iuran, pendaftaran semester, tagihan lain, atau marketplace.
5. Hanya `wali_murid` yang dapat membuat transaksi checkout.
6. Sistem membuat Snap transaction hanya bila env, setting, dan modul terkait aktif.
7. Callback/webhook memvalidasi signature dan memperbarui `payment_transactions` serta invoice secara idempotent.
8. Sistem membuat `payment_receipts` dengan URL logo dan snapshot data bank/transaksi.
9. Receipt hanya dapat diakses wali murid yang memiliki relasi dengan siswa.

## Alur Audit Log
Audit log disarankan untuk aksi sensitif:
- login admin;
- create/update/delete user;
- update role;
- create/update/delete invoice;
- update payment settings;
- delete submission;
- update nilai.

Field audit minimal:
- actor user id;
- action;
- entity type;
- entity id;
- metadata json;
- created at.
