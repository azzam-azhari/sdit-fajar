Rencana fitur baru:
- fitur pendaftaran murid baru
- fitur pembayaran SPP dan daftar ulang via Midtrans
- fitur chat real-time
- fitur marketplace konten buku pembelajaran dll.
- beberapa halaman boleh menggunakan bahasa Inggris untuk memudahkan publikasi
- halaman publik sekolah bisa diakses tanpa login
- halaman internal sekolah wajib login
- absensi guru di setiap jam 07.30 pagi dan 14.30 (pulang) setiap hari Senin sampai Jumat, dan sabtu  dan minggu terbuka jika kepala sekolah mengaktifkan fitur tersebut
- absensi siswa di setiap jam masuk pelajaran, untuk hari sabtu dan minggu tidak ada absensi siswa dalam pembelajaran.

buat phase pengerjaan project:
- Phase 1 sampai berapa (sesuaikan): sisi frontend
- setup supabase
- setup database, table, rls, dan relasi tabel
- implementasi tabel dengan fitur yang sesuai dengan kebutuhan website
- dll (lengkapi phase agar hemat menggunakan token dan hasil maksimal dan pastikan tidak menyebabkan error dan pastikan semua berjalan lancar)


pastikan semua dokument atau gambar yang diupload menjadi link yang ditempel ke table database

pastikan login menggunakan :
nomor induk, dan passwordnya: tempat30122015 (tempattanggalbulantahun kelahiran sesuai biodata siswa yang di buat oleh super admin,)
dan sesuaikan login akun wali_murid

sediakan fitur import data pada super admin untuk import data siswa, guru, wali murid, dan lain-lain dan berikan template csv nya yang bisa di download.

pastikan rls aman untuk authentikasi dan otorisasi.

admin bisa mengubah bulan yang aktif dan tahun yang aktif untuk fitur absensi, pembayaran, dan lain-lain.

aktifkan fitur pembayaran dengan midtrans pada super admin.
admin bisa kelola pembayaran, membuat invoice, mengedit invoice, menghapus invoice, mengaktifkan fitur pembayaran, menonaktifkan fitur pembayaran.
pembayaran berupa SPP bulanan, iuran ekstrakurikuler, biaya pendaftaran semester ganjil dan genap, dll.
sedikit modify pada fitur pembayaran, yaitu ketika user sudah membayar spp/daftar ulang, wali murid bisa mendownload bukti pembayaran yang memuat data-data berikut:
- logo sekolah
- logo midtrans
- tanggal dan jam pembayaran
- nomor invoice
- nama siswa
- kelas
- jumlah pembayaran
- status pembayaran
- nama bank
- nomor rekening
- nama rekening
- bank tujuan
- nomor rekening tujuan
- nama rekening tujuan

aktifkan fitur untuk membayar hanya di akun wali_murid. yang bisa melihat semua pembayaran yang di tanggung siswa adalah wali murid (termasuk admin yang login menggunakan akun wali_murid terpisah)

wali murid dapan melihat riwayat pembayaran dengan table dan bisa open struk pembayaran di open new tab


alur pengumuman dari super admin ke semua user atau user dengan role tertentu

admin bisa mengelola konten pada public sekolah, termasuk mengubah alamat kontak, no telepon sekolah, dll. hanya bisa di ubah oleh super admin

benarkan nama semua role dengan ini:
| Murid | `murid` |
| Wali Murid | `wali_murid` |
