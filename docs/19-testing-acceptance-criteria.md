# Testing & Acceptance Criteria

## Prinsip Selesai Fitur
Fitur dianggap selesai jika:
- sesuai scope;
- UI mengikuti tema;
- role guard berjalan;
- RLS/backend guard tersedia;
- form tervalidasi;
- loading/empty/error state ada;
- toast feedback ada;
- tidak ada TypeScript error;
- tidak ada lint error;
- build berhasil.

## Checklist Global
- `npm run lint` berhasil.
- `npm run build` berhasil.
- Tidak ada env secret di client.
- Tidak ada role hardcoded yang tidak sesuai docs.
- Tidak ada route baru tanpa dokumentasi.
- Tidak ada tabel baru tanpa dokumentasi.
- Tidak ada unggahan tanpa URL/path pada tabel domain terkait.

## Login
Acceptance:
- Murid bisa login dengan NIS dan password awal `tempatddmmyyyy` berdasarkan biodata.
- Password awal wajib diganti pada login pertama dan tidak tersimpan plaintext.
- Wali murid dapat login memakai identifier akun wali murid yang dibuat super admin.
- User diarahkan sesuai role.
- User nonaktif tidak bisa masuk dashboard.
- User yang belum login tidak bisa membuka `/dashboard/*`.
- User yang sudah login tidak diarahkan ke `/login` lagi.

## Role Guard
Acceptance:
- Siswa tidak bisa membuka dashboard admin/guru.
- Wali murid hanya melihat data anaknya.
- Guru hanya melihat kelas/mapel yang diajar.
- Wali kelas hanya melihat kelas binaannya.
- Kepala sekolah bisa melihat laporan read-only.
- Admin sekolah tidak bisa mengubah super admin.

## Materi
Acceptance:
- Guru bisa membuat materi untuk kelas/mapel yang diajar.
- Materi draft tidak terlihat oleh siswa.
- Materi published terlihat oleh siswa kelas terkait.
- Siswa kelas lain tidak bisa melihat materi.
- Wali murid bisa melihat materi anak.

## Tugas
Acceptance:
- Guru bisa membuat tugas.
- Tugas draft tidak terlihat oleh siswa.
- Tugas published terlihat oleh siswa kelas terkait.
- Siswa bisa mengumpulkan tugas.
- Status late muncul jika submit setelah deadline.
- Guru bisa melihat daftar pengumpulan.
- Guru bisa memberi nilai dan feedback.
- Siswa bisa melihat nilai miliknya sendiri.
- Wali murid bisa melihat nilai anak.

## Dashboard
Acceptance:
- Dashboard tampil berbeda sesuai role.
- Card ringkasan tidak error saat data kosong.
- Menu sidebar sesuai role.
- Breadcrumb tampil di halaman dashboard.

## Pendaftaran dan Import
Acceptance:
- Halaman `/pendaftaran` dapat diakses tanpa login.
- Form dan dokumen tervalidasi server-side.
- URL/path setiap dokumen tersimpan di tabel pendaftaran.
- Super admin dapat mengunduh template CSV dan mengimpor data.
- Baris invalid tidak ikut commit dan hasil import tercatat.

## Absensi
Acceptance:
- Absensi guru memiliki sesi 07.30 dan 14.30 pada Senin-Jumat.
- Weekend guru tertutup secara default dan hanya dapat dibuka kepala sekolah.
- Absensi siswa hanya dapat dibuat per jadwal pelajaran Senin-Jumat.
- Sabtu-Minggu tidak menghasilkan absensi siswa.
- User hanya melihat absensi sesuai role/relasi.

## Chat Real-time
Acceptance:
- Hanya anggota thread yang dapat membaca/mengirim pesan.
- Pesan tersimpan di database dan event realtime tidak melewati RLS.
- User guest tidak dapat membuka chat.

## Marketplace
Acceptance:
- Katalog published dapat dibaca publik tanpa login.
- Checkout hanya tersedia untuk `wali_murid`.
- File digital hanya dapat diakses setelah payment valid.

## Payment Midtrans
Acceptance:
- Global activation hanya tersedia untuk super admin.
- Admin dapat membuat, mengubah, dan menghapus invoice.
- Admin dapat mengatur pengingat jatuh tempo pada 30/14/7/3/1 hari atau jadwal yang diizinkan.
- Jenis SPP, iuran, pendaftaran semester, marketplace, dan tagihan lain tersedia.
- Pembayaran hanya bisa dimulai dari akun wali murid.
- Halaman payment settings tersedia.
- Config non-secret bisa disimpan.
- Server key hanya di env.
- Tombol bayar tidak aktif saat salah satu flag false.
- Webhook tidak update status tanpa signature valid dan tidak memproses callback ganda.
- Receipt memuat logo, waktu, invoice, siswa, kelas, nominal, status, dan data bank bila tersedia.
- Receipt hanya dapat dibuka/diunduh wali murid terkait di tab baru.

## Upload File
Acceptance:
- File valid bisa diupload.
- File invalid ditolak.
- File terlalu besar ditolak.
- URL/path tersimpan ke database.
- File lama dihapus saat replace jika aman.

## Public Website
Acceptance:
- Navbar responsive.
- Footer lengkap.
- Floating WhatsApp tampil.
- Landing page punya hero, berita, visi misi, statistik, testimoni, FAQ.
- Berita punya pagination.
- Detail berita bisa dibuka via slug.
- Metadata SEO tersedia.
