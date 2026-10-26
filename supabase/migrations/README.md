# Panduan Eksekusi SQL Migrasi Database — SDIT Fajar

Panduan ini mengatur tata cara menempelkan dan menjalankan berkas migrasi SQL ke project Supabase Anda melalui **Supabase Web Dashboard (SQL Editor)** dengan **Opsi B (Eksekusi Bertahap / Modular)**.

---

## 1. Urutan Running Berkas SQL (Wajib Berurutan)

Jalankan ke-8 berkas berikut **satu per satu secara berurutan** dari nomor `01` sampai `08`. Jangan melompati urutan karena setiap berkas memiliki ketergantungan relasional (*Foreign Key* & *Dependencies*) ke berkas sebelumnya:

| Urutan | Nama Berkas | Komponen / Fungsi Utama |
|:---:|---|---|
| **1** | `20261026_000001_create_enums_and_helpers.sql` | Ekstensi `pgcrypto`, 12 tipe Enum resmi, dan fungsi `handle_updated_at()`. |
| **2** | `20261026_000002_create_core_tables.sql` | Tabel `profiles`, setting sekolah, tahun akademik, semester, kelas, mapel, guru, murid, dan wali murid. |
| **3** | `20261026_000003_create_academic_lms_tables.sql` | Tabel PPDB (`registrations`), LMS (materi, tugas, submission), absensi, target & mutabaah tahfidz, pengumuman, dan artikel. |
| **4** | `20261026_000004_create_payment_marketplace_tables.sql` | Tabel konfigurasi Midtrans, invoice SPP/iuran, log transaksi pembayaran, produk, dan pesanan marketplace seragam/buku. |
| **5** | `20261026_000005_create_storage_buckets.sql` | Inisialisasi 4 Supabase Storage Bucket (`images`, `lms-files`, `registration-files`, `marketplace-files`) dan storage policies. |
| **6** | `20261026_000006_enable_rls_and_policies.sql` | Fungsi helper otorisasi role, aktivasi Row Level Security (RLS) pada 24 tabel, dan seluruh security policies. |
| **7** | `20261026_000007_seed_auth_users.sql` | Inisialisasi 7 akun demo di sistem otentikasi Supabase GoTrue (`auth.users` & `auth.identities`) dengan password bcrypt. |
| **8** | `20261026_000008_seed_development_data.sql` | Inisialisasi data awal pengembangan (jabatan guru, rombel kelas 3-A, jadwal pelajaran, tagihan invoice demo, dan gelombang PPDB). |
| **9** | `20261026_000009_repair_auth_users.sql` | Sinkronisasi field boolean `is_sso_user` & `is_anonymous` Supabase GoTrue agar login tidak menghasilkan error schema 500. |
| **10** | `20261026_000010_fix_rls_infinite_recursion.sql` | Perbaikan error PostgreSQL 42P17 (infinite recursion RLS) pada tabel `parent_students` & `profiles` agar login langsung mengarah ke dashboard role. |

---

## 2. Langkah-demi-Langkah di Supabase Web Dashboard

1. **Buka Supabase Dashboard**:
   - Masuk ke [https://supabase.com/dashboard](https://supabase.com/dashboard) dan pilih project SDIT Fajar Anda.
2. **Masuk ke SQL Editor**:
   - Di menu navigasi samping kiri, klik ikon **SQL Editor** (atau tekan shortcut keyboard).
   - Klik tombol **`+ New Query`** di pojok kanan atas.
3. **Tempelkan & Jalankan (Ulangi untuk Berkas 01 s/d 08)**:
   - Buka berkas `20261026_000001_create_enums_and_helpers.sql` di text editor lokal Anda (VS Code/Cursor).
   - Salin (*Copy*) seluruh isinya (`Ctrl + A` lalu `Ctrl + C`).
   - Tempel (*Paste*) ke dalam kolom query Supabase SQL Editor.
   - Klik tombol hijau **`Run`** (atau tekan `Ctrl + Enter`).
   - Pastikan muncul notifikasi **`Success. No rows returned`** (atau ringkasan status sukses).
4. **Lanjutkan ke Berkas Berikutnya**:
   - Buat tab baru (`+ New query`) atau bersihkan editor, lalu salin berkas `20261026_000002_create_core_tables.sql` dan klik **Run**.
   - Teruskan langkah ini secara disiplin sampai berkas `20261026_000008_seed_development_data.sql`.

---

## 3. Daftar Akun Demo Siap Pakai

Setelah berkas `07` dan `08` berhasil dijalankan, 7 akun pengguna demo berikut otomatis aktif dan dapat langsung digunakan untuk login di website:

> **Kata Sandi Resmi Seluruh Akun Demo**: `Password123!`

| Role Aplikasi | Nama Lengkap Akun | Email Login | Login Identifier (NIS / WA) | Keterangan Akses |
|---|---|---|---|---|
| `super_admin` | Super Admin SDIT Fajar | `superadmin@sditfajar.sch.id` | `superadmin` | Akses penuh seluruh sistem & konfigurasi Midtrans |
| `admin` | Admin Sekolah | `admin@sditfajar.sch.id` | `admin` | Manajemen master data, verifikasi PPDB, buat invoice |
| `guru` | Kepala Sekolah SDIT Fajar | `kepsek@sditfajar.sch.id` | `kepsek` | Dashboard Guru (Jabatan: Kepala Sekolah) |
| `guru` | Ustadz Ahmad Fauzi | `ustahmad@sditfajar.sch.id` | `ustahmad` | Dashboard Guru (Wali Kelas 3-A, Guru Matematika) |
| `guru` | Ustadzah Siti Aminah | `ustsiti@sditfajar.sch.id` | `ustsiti` | Dashboard Guru (Koordinator Tahfidz, Guru PAI) |
| `murid` | Ahmad Fajar | `ahmad.fajar@sditfajar.sch.id` | `202603001` (NIS) | Dashboard Murid (LMS, Jadwal, Nilai, Read-Only SPP) |
| `wali_murid` | Bapak Hendra Gunawan | `wali@sditfajar.sch.id` | `081234567890` (WA) | Dashboard Wali (Bayar SPP via Snap Midtrans, Raport) |

---

## 4. Checklist Verifikasi Pasca Eksekusi

Buka menu-menu berikut di Supabase Dashboard untuk memastikan migrasi 100% sempurna:

- [ ] **Table Editor**: Terdapat 24 tabel pada skema `public` (mulai dari `academic_years`, `classrooms`, `profiles`, `students`, hingga `registrations`).
- [ ] **Authentication > Users**: Terdaftar 7 pengguna dengan status email terkonfirmasi (*Confirmed*).
- [ ] **Authentication > Policies**: Status RLS berlabel hijau (*RLS Enabled*) pada seluruh 24 tabel publik.
- [ ] **Storage**: Terdapat 4 bucket:
  - `images` (Public)
  - `lms-files` (Private)
  - `registration-files` (Private)
  - `marketplace-files` (Private)
