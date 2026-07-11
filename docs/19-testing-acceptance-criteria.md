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

## Login
Acceptance:
- User bisa login dengan email dan password.
- User diarahkan sesuai role.
- User nonaktif tidak bisa masuk dashboard.
- User yang belum login tidak bisa membuka `/dashboard/*`.
- User yang sudah login tidak diarahkan ke `/login` lagi.

## Role Guard
Acceptance:
- Siswa tidak bisa membuka dashboard admin/guru.
- Orang tua hanya melihat data anaknya.
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
- Orang tua bisa melihat materi anak.

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
- Orang tua bisa melihat nilai anak.

## Dashboard
Acceptance:
- Dashboard tampil berbeda sesuai role.
- Card ringkasan tidak error saat data kosong.
- Menu sidebar sesuai role.
- Breadcrumb tampil di halaman dashboard.

## Payment Setup
Acceptance:
- Halaman payment settings tersedia.
- Config non-secret bisa disimpan.
- Server key hanya di env.
- Tombol bayar disabled saat flag false.
- Invoice demo/draft bisa dibuat tanpa charge.
- Webhook skeleton tidak update status tanpa signature valid.

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
