# Konten Publik Sekolah

## Tujuan
Website publik SDIT Fajar berfungsi sebagai profil sekolah, media informasi, publikasi berita, marketplace konten, dan pintu masuk pendaftaran. Seluruh halaman publik dapat diakses tanpa login.

## Beranda `/`
Section wajib:
- Hero section.
- CTA daftar ke `/pendaftaran`.
- Berita terbaru.
- Berita sekolah.
- Motto, visi, misi.
- Manajemen sekolah ringkas.
- Statistik sekolah dengan animasi count-up.
- Testimoni.
- FAQ accordion.
- Preview katalog marketplace.

## Navbar
Fitur wajib:
- logo SDIT Fajar;
- menu desktop;
- menu mobile;
- dropdown Profil;
- active link;
- blur/shadow saat scroll;
- tombol “Daftar” ke `/pendaftaran`.
- menu Marketplace.

Menu rekomendasi:
- Beranda;
- Profil;
- Kurikulum;
- Ekstrakurikuler;
- Berita;
- Kontak;
- Login.

## Footer
Fitur wajib:
- deskripsi sekolah;
- embed Google Maps;
- kontak WhatsApp;
- email;
- Instagram;
- TikTok;
- YouTube;
- link cepat;
- form pencarian footer jika masih dipakai.

## Floating WhatsApp
- Tampil di semua halaman publik.
- Posisi kanan bawah.
- Jangan menutup tombol penting di mobile.
- Link menggunakan nomor resmi sekolah.

## Profil Sekolah `/profil`
Konten:
- deskripsi SDIT Fajar;
- motto;
- visi;
- misi;
- gallery masonry;
- value sekolah.

## Sejarah Sekolah `/profil/sejarah`
Konten:
- timeline sejarah berdirinya SDIT Fajar;
- milestone penting;
- foto lama/baru jika tersedia.

## Manajemen Sekolah `/profil/manajemen`
Konten:
- kepala sekolah;
- guru;
- staf;
- foto;
- jabatan;
- deskripsi singkat opsional.

## Kurikulum `/kurikulum`
Konten:
- program unggulan;
- morning activity;
- konsep pembelajaran;
- integrasi nilai Islam;
- pembelajaran akademik dan karakter.

## Ekstrakurikuler `/ekstrakurikuler`
Daftar awal:
- Pramuka;
- Memanah;
- Taekwondo;
- Tahfidz;
- Futsal.

## Kontak `/kontak`
Konten:
- form kontak UI;
- alamat sekolah;
- WhatsApp;
- email;
- Google Maps;
- social media.

## Pendaftaran `/pendaftaran`
- Banner informasi Gelombang aktif (Gelombang 1, 2, atau 3 per semester): tanggal pembukaan/penutupan, target kuota 100 murid, jumlah yang sudah daftar (auto-count), kuota tersisa, dan jadwal tes observasi.
- Form pendaftaran murid baru multi-step (*stepper*):
  - Step 1: Pilihan Gelombang aktif.
  - Step 2: Biodata Calon Murid (NIK, NISN, nama, tempat/tanggal lahir, jenis kelamin, anak ke-, jumlah saudara, kebutuhan khusus, asal TK).
  - Step 3: Biodata Orang Tua / Wali (Nama Ayah/Ibu, NIK, pekerjaan, nomor WhatsApp aktif).
  - Step 4: Unggah 7 berkas persyaratan (Pas Foto 3x4, Akta Kelahiran, KK, KTP Ortu, Ijazah/SKL TK, Surat Keterangan Sehat, Piagam Prestasi) ke Supabase Storage bucket privat `registration-files`.
  - Step 5: Pernyataan keabsahan data & submit.
- Popup Modal Pasca-Submit:
  - Muncul seketika setelah formulir berhasil disimpan dengan menampilkan nomor registrasi resmi (contoh: `PPDB-2026-G1-0024`).
  - Tombol CTA langsung menuju WhatsApp Panitia PPDB: `https://wa.me/6287737860657?text=...` dengan template pesan: *"Saya sudah mendaftar online, bagaimana informasi pembayarannya?"*.
  - Opsi cetak bukti pendaftaran online (`@media print`).
- Halaman dapat diisi publik tanpa login; proses review dan seleksi dilakukan oleh Admin dan Super Admin di dashboard.

## Marketplace `/marketplace`
- Katalog buku/konten pembelajaran yang dikelola sekolah.
- Cover dan file digital menggunakan URL/path Storage.
- Katalog dapat dilihat publik tanpa login.
- Checkout dan akses file setelah bayar hanya melalui akun `wali_murid`.

## Pengelolaan Konten
- Admin sekolah mengelola berita, galeri, FAQ, dan konten operasional.
- Super admin mengubah identitas sekolah, logo, alamat, nomor telepon, WhatsApp, email, peta, dan social links.
- Semua gambar/dokumen konten memiliki URL/path yang tersimpan di tabel.

## Bahasa Publik
Bahasa Indonesia adalah default. Halaman atau konten terpilih boleh menyediakan Bahasa Inggris untuk publikasi; dashboard dan pesan keamanan tetap Bahasa Indonesia.

## Berita `/berita`
Fitur:
- list berita;
- pagination;
- search opsional;
- filter kategori opsional;
- card berita dengan cover image;
- detail berita di `/berita/[slug]`.

## Integrasi Eksternal
- Google Form pendaftaran hanya opsi legacy jika diaktifkan eksplisit; alur utama menggunakan `/pendaftaran` dan tabel internal.
- WhatsApp.
- Google Maps.
- YouTube.
- Instagram.
- TikTok.

## SEO
Setiap halaman publik wajib punya:
- title;
- description;
- Open Graph image jika ada;
- canonical URL jika production;
- metadata yang sesuai halaman.

## Copywriting
Bahasa harus:
- sopan;
- ramah;
- mudah dipahami orang tua;
- tidak terlalu teknis;
- menggambarkan sekolah dasar Islam terpadu secara positif.
