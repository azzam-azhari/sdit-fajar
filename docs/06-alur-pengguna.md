# Alur Pengguna

## Alur Login
1. User membuka `/login`.
2. User mengisi email dan password.
3. Sistem melakukan autentikasi Supabase.
4. Sistem mengambil profile user.
5. Sistem membaca `role`.
6. User diarahkan ke dashboard sesuai role.
7. Jika role tidak dikenali, user diarahkan ke halaman error akses.

## Alur Super Admin Mengelola User
1. Super admin login.
2. Masuk ke `/dashboard/super-admin/users`.
3. Melihat daftar user.
4. Membuat user baru atau mengubah user.
5. Sistem menyimpan data ke Supabase Auth dan `profiles`.
6. Sistem mencatat audit log.

## Alur Admin Sekolah Membuat Tahun Ajaran
1. Admin sekolah login.
2. Masuk ke `/dashboard/admin/tahun-ajaran`.
3. Klik “Tambah Tahun Ajaran”.
4. Isi nama tahun ajaran, tanggal mulai, tanggal selesai.
5. Tandai aktif jika diperlukan.
6. Sistem memastikan hanya satu tahun ajaran aktif.
7. Data tersimpan.

## Alur Admin Sekolah Menyiapkan Kelas
1. Admin membuat tahun ajaran.
2. Admin membuat kelas, misalnya `1A`, `1B`, `2A`.
3. Admin membuat rombel untuk tahun ajaran aktif.
4. Admin menetapkan wali kelas.
5. Admin memasukkan siswa ke rombel.

## Alur Guru Membuat Materi
1. Guru login.
2. Masuk ke menu materi.
3. Klik “Buat Materi”.
4. Pilih kelas dan mapel yang memang diajar.
5. Isi judul, deskripsi, konten, file/link opsional.
6. Simpan sebagai draft atau publish.
7. Jika publish, siswa kelas tersebut bisa melihat materi.

## Alur Guru Membuat Tugas
1. Guru login.
2. Masuk ke menu tugas.
3. Klik “Buat Tugas”.
4. Pilih kelas dan mapel yang diajar.
5. Isi judul, deskripsi, deadline, lampiran opsional.
6. Publish tugas.
7. Sistem menampilkan tugas ke siswa sesuai kelas.

## Alur Siswa Mengumpulkan Tugas
1. Siswa login.
2. Masuk ke menu tugas.
3. Pilih tugas aktif.
4. Baca instruksi.
5. Isi jawaban atau upload file.
6. Klik “Kumpulkan”.
7. Sistem menyimpan submission.
8. Jika melewati deadline, status menjadi `late`.

## Alur Guru Menilai Tugas
1. Guru membuka detail tugas.
2. Guru membuka tab pengumpulan.
3. Guru memilih siswa.
4. Guru membaca jawaban atau attachment.
5. Guru memberi nilai dan feedback.
6. Status submission berubah menjadi `graded`.
7. Siswa dan orang tua bisa melihat nilai.

## Alur Wali Kelas Monitoring Kelas
1. Wali kelas login.
2. Masuk ke dashboard wali kelas.
3. Melihat daftar siswa kelas binaan.
4. Melihat tugas belum dikumpulkan.
5. Melihat ringkasan nilai.
6. Membuat pengumuman kelas jika diperlukan.

## Alur Orang Tua Melihat Progres Anak
1. Orang tua login.
2. Masuk ke dashboard orang tua.
3. Memilih anak jika memiliki lebih dari satu anak.
4. Melihat tugas, nilai, dan pengumuman.
5. Melihat status pembayaran jika payment sudah aktif.

## Alur Setup Payment SPP dan Daftar Ulang
1. Super admin/admin sekolah membuka setup payment.
2. Mengisi konfigurasi Midtrans sandbox.
3. Sistem menyimpan konfigurasi non-secret di database.
4. Secret tetap di environment variable.
5. Admin dapat membuat draft tagihan.
6. Tombol pembayaran tetap disabled sampai feature flag aktif.

## Prinsip Flow
- Setiap flow harus memvalidasi role.
- Setiap flow data siswa harus memvalidasi relasi user dengan siswa.
- Setiap mutasi harus punya feedback sukses/gagal.
- Setiap flow penting sebaiknya dicatat di audit log.
