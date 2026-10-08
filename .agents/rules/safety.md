---
trigger: always_on
description: Rambu pengaman sistem, file terproteksi, batasan modifikasi data, dan pencegahan kebocoran kredensial — SDIT Fajar
---

# Safety & System Guardrails — SDIT Fajar

Dokumen ini adalah rambu pengaman (*safety boundaries*) yang membatasi tindakan AI Agent agar tidak merusak sistem, membocorkan kredensial sensitif, atau menghapus berkas penting tanpa izin eksplisit.

---

## 1. Berkas Sensitif yang Dilarang Disentuh Tanpa Instruksi Eksplisit

Agent **DILARANG MENGUBAH ATAU MENGHAPUS** berkas-berkas berikut kecuali pengguna memberikan instruksi eksplisit:

1. **Environment Variables**:
   - `.env`, `.env.local`, `.env.production`
   - Jangan pernah menghapus atau menimpa nilai environment variable yang sudah berjalan.
2. **Konfigurasi Build & Runtime**:
   - `next.config.ts`
   - `tsconfig.json`
   - `components.json`
   - `middleware.ts`
   - `package.json` / `package-lock.json`
3. **Migrasi Database & Skema Supabase**:
   - Direktori `supabase/migrations/` atau berkas migrasi SQL aktif.
   - Jangan menjalankan destructive commands (`DROP TABLE`, `TRUNCATE`, `DROP COLUMN`) tanpa izin manual.

---

## 2. Larangan Kebocoran Kredensial (Zero-Leakage Secrets)

> [!CAUTION]
> **KUNCI RAHASIA HANYA BOLEH DI SERVER**:
> - `SUPABASE_SERVICE_ROLE_KEY`
> - `MIDTRANS_SERVER_KEY`
> 
> Kedua kunci di atas **DILARANG KERAS** dibocorkan ke client component, bundle JavaScript browser, variabel dengan prefix `NEXT_PUBLIC_`, atau dikirimkan melalui payload API ke client.

- Pembayaran: Konfigurasi server key & aktivasi global hanya boleh diakses melalui server-side logic oleh role `super_admin`.
- Upload Berkas: Seluruh berkas/gambar yang diunggah ke storage harus menyimpan URL/path aman pada tabel domain database terkait, bukan menyimpan file mentah di disk lokal.

---

## 3. Batasan Domain & Hak Akses (Scope Enforcements)

1. **Batas 5 Role Resmi**:
   - Dilarang membuat, menghapus, atau merekayasa enum `app_role` di luar:
     `super_admin`, `admin`, `guru`, `murid`, `wali_murid`.
   - Jabatan guru (`kepala_sekolah`, `wali_kelas`, dll.) adalah data jabatan di bawah role `guru`, bukan role database baru.
2. **Pintu Pembayaran SPP / Tagihan**:
   - Tombol bayar dan pemanggilan Midtrans Snap Popup Modal **HANYA boleh diakses oleh role `wali_murid`** untuk anak yang terhubung via `parent_students`.
   - Murid dilarang memiliki tombol bayar atau akses inisiasi transaksi.
3. **Peniadaan Fitur Chat**:
   - Fitur chat internal / pesan real-time telah **ditiadakan**. Jangan pernah membuat tabel, komponen UI, atau rute pesan instan.

---

## 4. Keamanan Database: Penegakan Row Level Security (RLS)

- **RLS Wajib Aktif 100%**: Setiap tabel baru yang dibuat di Supabase wajib memiliki statement `alter table [nama_tabel] enable row level security;` beserta policies yang ketat.
- **Validasi Ganda**: Jangan mengandalkan proteksi antarmuka (seperti menyembunyikan tombol di UI) sebagai benteng keamanan. Semua mutasi wajib divalidasi ulang di Server Action dengan pemeriksaan sesi Supabase Auth.
