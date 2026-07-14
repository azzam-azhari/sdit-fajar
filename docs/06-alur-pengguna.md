# Alur Pengguna

## Alur Login
1. User membuka `/login`.
2. User mengisi identifier terdaftar; murid menggunakan NIS.
3. User memasukkan password.
4. Sistem melakukan autentikasi Supabase dan mengambil profile.
5. Sistem membaca role dan memeriksa `is_active`.
6. User diarahkan ke dashboard sesuai role.
7. Murid dengan password awal diarahkan untuk mengganti password.

## Alur Super Admin Mengelola User dan Import
1. Super admin login dan membuka manajemen user/import.
2. Super admin mengunduh template CSV resmi.
3. Super admin mengisi data siswa, guru, wali murid, kelas, atau relasi sesuai template.
4. Sistem memvalidasi header, tipe data, relasi, duplikasi, dan role di server.
5. Sistem menampilkan preview serta error per baris sebelum commit.
6. Data valid disimpan dalam transaksi; URL/path file disimpan di tabel terkait.
7. Sistem mencatat batch import dan audit log.

## Alur Admin Sekolah Membuat Tahun Ajaran
1. Admin sekolah login.
2. Membuka `/dashboard/admin/tahun-ajaran`.
3. Mengisi tahun ajaran, semester, dan tanggal berlaku.
4. Menetapkan periode aktif serta bulan dan tahun operasional.
5. Sistem memastikan hanya satu periode aktif sesuai konteks.

## Alur Admin Menyiapkan Kelas
1. Admin membuat kelas dan rombel.
2. Admin menetapkan wali kelas.
3. Admin memasukkan siswa ke rombel.
4. Sistem menyimpan relasi dan menerapkan RLS pada data turunannya.

## Alur Guru Membuat Materi dan Tugas
1. Guru memilih kelas/mapel yang memang memiliki assignment.
2. Guru mengisi konten dan mengunggah file atau URL eksternal.
3. Sistem menyimpan URL/path file ke tabel materi/tugas.
4. Draft hanya terlihat oleh pembuat/admin; published terlihat oleh kelas terkait.
5. Siswa mengumpulkan tugas; status menjadi `late` bila melewati deadline dan late submission diizinkan.
6. Guru memberi nilai dan feedback; siswa dan wali murid melihat data sesuai relasi.

## Alur Wali Kelas Monitoring Kelas
1. Wali kelas login.
2. Melihat siswa kelas binaan, tugas, nilai, progres, dan absensi.
3. Membuat pengumuman untuk kelas binaan bila diperlukan.

## Alur Wali Murid Melihat Progres Anak
1. Wali murid login dengan akun yang dibuat super admin.
2. Memilih anak jika memiliki lebih dari satu anak terhubung.
3. Melihat tugas, materi, nilai, pengumuman, dan absensi anak.
4. Melihat status pembayaran serta riwayat pembayaran anak.

## Alur Aktivasi dan Pembayaran Midtrans
1. Super admin mengisi konfigurasi provider dan menyimpan config non-secret.
2. Secret tetap di environment server.
3. Super admin memvalidasi environment, webhook, RLS, dan checklist go-live.
4. Super admin mengaktifkan global payment.
5. Admin sekolah membuat, mengubah, menghapus invoice, dan mengaktifkan modul yang diizinkan.
6. Wali murid membayar invoice SPP, iuran, pendaftaran semester, tagihan lain, atau marketplace.
7. Webhook memvalidasi signature, memproses idempotent, dan mengubah status transaksi/invoice.
8. Sistem membuat receipt berisi snapshot pembayaran.
9. Wali murid membuka receipt di tab baru atau mengunduhnya.

## Alur Pendaftaran Murid Baru
1. Calon wali murid membuka `/pendaftaran` tanpa login.
2. Mengisi formulir dan mengunggah dokumen yang diminta.
3. Sistem menyimpan URL/path setiap dokumen ke tabel pendaftaran.
4. Admin memeriksa data; super admin menyetujui dan membuat akun murid/wali murid.
5. Sistem membuat identifier login dan password awal murid, lalu mewajibkan ganti password.

## Alur Absensi
1. Admin menetapkan bulan dan tahun aktif.
2. Guru mencatat masuk pukul 07.30 dan pulang pukul 14.30 pada Senin-Jumat.
3. Sabtu-Minggu hanya tersedia bila kepala sekolah mengaktifkan weekend attendance.
4. Guru/wali kelas mencatat kehadiran siswa pada setiap jadwal pelajaran aktif.
5. Sistem menolak absensi siswa untuk pembelajaran Sabtu-Minggu.
6. Kepala sekolah dan admin melihat rekap; user lain hanya melihat data sesuai relasi.

## Alur Pengumuman dan Chat
1. Super admin dapat menargetkan pengumuman ke semua user atau role tertentu.
2. Admin, kepala sekolah, guru, dan wali kelas menargetkan audience sesuai permission.
3. User membuka chat internal setelah login.
4. Sistem hanya menampilkan thread tempat user menjadi anggota.
5. Pesan divalidasi server-side, disimpan, lalu disebarkan via Supabase Realtime.

## Alur Marketplace
1. Pengunjung melihat katalog publik tanpa login.
2. Wali murid login untuk checkout dan memilih anak bila diperlukan.
3. Sistem membuat order dan invoice marketplace.
4. Setelah callback Midtrans valid, file digital tersedia melalui signed URL.

## Prinsip Flow
- Setiap flow memvalidasi auth, role, relasi, dan input dengan Zod.
- Setiap mutasi punya feedback sukses/gagal serta loading state.
- Setiap flow penting dicatat dalam audit log.
