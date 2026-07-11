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
- `profiles.role = siswa`.
- Detail siswa disimpan di `students`.
- Siswa masuk rombel melalui `class_students`.

### Orang Tua
- `profiles.role = orang_tua`.
- Relasi orang tua ke siswa disimpan di `parent_students`.
- Satu orang tua bisa memiliki lebih dari satu anak.
- Satu siswa bisa memiliki lebih dari satu orang tua/wali jika diperlukan.

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
- siswa/orang tua tertentu.

## Alur Payment Setup
1. Admin membuat konfigurasi payment.
2. Midtrans secret disimpan di env.
3. Tabel `payment_settings` menyimpan status feature flag.
4. Admin membuat invoice SPP/daftar ulang.
5. Jika payment belum aktif, invoice hanya tampil sebagai draft/internal.
6. Jika payment aktif nanti, sistem membuat Snap transaction ke Midtrans.
7. Callback/webhook Midtrans memperbarui `payment_transactions` dan status invoice.

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
