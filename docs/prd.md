# Product Requirements Document (PRD) — SDIT Fajar

## 1. Visi Produk
Sistem Informasi Manajemen & Learning Management System (LMS) Sekolah Islam Terpadu Fajar berbasis web yang modern, cepat, dan presisi. Platform ini menghubungkan manajemen sekolah, tenaga pendidik, murid, dan orang tua/wali murid dalam satu ekosistem digital yang aman, transparan, dan terstruktur.

---

## 2. Hak Akses & Peran (Role & Positions)
> **PENTING (Aturan Keras):** Dilarang membuat role baru di luar 5 role resmi di database.

### Role Utama (`app_role`):
1. **`super_admin`**: Pemilik kontrol tertinggi (pengaturan identitas sekolah, konfigurasi payment gateway Midtrans, audit log, manajemen staf & database).
2. **`admin`**: Manajemen operasional harian sekolah (verifikasi data pendaftaran, kelola invoice, publikasi konten berita/agenda, kelola inventaris).
3. **`guru`**: Tenaga pendidik yang mengampu modul pembelajaran, absensi, input nilai, dan monitoring tahfidz.
4. **`murid`**: Siswa sekolah (melihat jadwal, materi belajar, tugas, riwayat absensi, capaian tahfidz, dan kartu raport digital).
5. **`wali_murid`**: Orang tua siswa (melihat perkembangan anak, riwayat absensi, tagihan SPP, dan melakukan pembayaran via Midtrans).

### Jabatan Khusus di Bawah Role `guru` (`positions`):
Bukan role terpisah di database, melainkan atribusi jabatan dinamis yang membuka fitur tambahan pada `/dashboard/guru`:
- `kepala_sekolah`: Monitoring menyeluruh performa akademik dan persetujuan kebijakan.
- `wakil_kepala`: Koordinasi kurikulum dan kesiswaan.
- `bendahara`: Verifikasi kas dan rekapitulasi keuangan.
- `wali_kelas`: Pengesahan absensi kelas harian, rekap raport kelas, catatan perkembangan wali murid.
- `koordinator_tahfidz`: Pengelolaan kurikulum juz, mutabaah halaqah, dan evaluasi hafalan Qur'an.
- `pustakawan`: Manajemen sirkulasi buku dan e-library.
- `operator`: Manajemen teknis data pokok pendidikan.

---

## 3. Fitur Utama (Core Features)

### A. Portal Publik & Informasi Sekolah
- **Landing Page Profil**: Beranda sekolah, visi misi, fasilitas, keunggulan kurikulum terpadu (Kemenag + Diknas + Tahfidz).
- **Berita & Pengumuman**: Artikel kegiatan, agenda sekolah, majalah dinding digital.
- **PPDB Online (Penerimaan Peserta Didik Baru)**: Formulir pendaftaran calon siswa masuk ke tabel staging `registrations`. Data baru dimigrasikan ke tabel `students` dan dibuatkan akun login setelah diverifikasi dan diterima admin.
- **Peta Lokasi & Kontak**: Peta interaktif MapLibre GL dan formulir narahubung resmi.

### B. Otentikasi & Manajemen Pengguna
- **Login Khusus Murid**: Login menggunakan **NIS** (Nomor Induk Siswa) dan password default terstruktur (`tempatddmmyyyy` dari data lahir). Wajib mengganti password pada saat login pertama kali (`must_change_password`).
- **Login Staf & Wali**: Menggunakan Email / Username resmi dengan pengamanan sesi Supabase Auth.
- **Relasi Wali-Anak**: Akun wali murid terhubung ke satu atau lebih data murid secara multi-relasi.

### C. Akademik & LMS Terpadu
- **Jadwal Pelajaran & Kalender Akademik**: Pemetaan jadwal per kelas dan mata pelajaran.
- **Manajemen Materi & Tugas**: Guru mengunggah materi ajar (PDF/link), memberikan penugasan, dan menilai submission murid.
- **Presensi Digital (Absensi)**: Pencatatan kehadiran harian siswa dan guru (Hadir, Sakit, Izin, Alpa) dengan rekap otomatis mingguan/bulanan.
- **Buku Nilai & E-Raport**: Input nilai formatif/sumatif, perhitungan nilai akhir, dan cetak raport PDF berstandar sekolah.
- **Modul Khusus Tahfidz & Tahsin**: Pencatatan mutabaah harian (Surah, Ayat, Status Kelancaran: Mumtaz, Jayyid Jiddan, Jayyid, Maqbul).

### D. Keuangan & Pembayaran SPP (Midtrans)
- **Generasi Invoice Otomatis**: Invoice SPP bulanan, uang gedung, dan iuran kegiatan.
- **Portal Pembayaran Wali Murid**: Akses eksklusif untuk wali murid memulai pembayaran via **Midtrans Snap Popup Modal** (tetap di dashboard).
- **Sinkronisasi Otomatis Webhook**: Update status pembayaran real-time via webhook aman (signature key validation).
- **Kuitansi Resmi & Riwayat Pembayaran**: Halaman kuitansi web siap cetak/simpan PDF (`@media print`) dan rekap status lunas/tertunggak.

### E. Marketplace Perlengkapan Sekolah
- Katalog seragam, buku paket, dan atribut sekolah.
- Alur pemesanan tertib dengan integrasi penagihan invoice.

---

## 4. Batasan Ruang Lingkup (Out of Scope)
- ❌ **Fitur Chat Internal / Chat Real-time**: **Ditiadakan** dari aplikasi. Komunikasi resmi difasilitasi melalui pengumuman satu arah dan notifikasi dashboard.
- ❌ **Forum Diskusi Terbuka Bebas**: Tidak disediakan forum terbuka tanpa moderasi.
- ❌ **Multi-Tenancy Eksternal**: Sistem khusus dirancang eksklusif untuk lingkungan Yayasan/Sekolah SDIT Fajar.
- ❌ **Pintu Pembayaran Murid**: Murid **tidak dapat** melakukan transaksi pembayaran; hanya akun `wali_murid` yang memiliki otorisasi pembayaran.

---

## 5. Metrik Keberhasilan (Success Metrics)
1. **Ketahanan Keamanan**: Zero-leakage data murid dan wali murid via penegakan Row Level Security (RLS) PostgreSQL.
2. **Kecepatan & Responsivitas**: Core Web Vitals optimal dengan First Contentful Paint < 1.2s dan time to interactive yang cepat.
3. **Akurasi Keuangan**: Selisih 0% antara data status invoice di Supabase dan status transaksi di Midtrans.
4. **Kemudahan Akses**: Desain antarmuka presisi, minimalis, dan mudah dibaca oleh guru, murid, maupun wali murid di perangkat mobile maupun desktop.
