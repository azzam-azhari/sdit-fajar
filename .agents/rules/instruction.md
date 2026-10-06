---
trigger: always_on
description: Instruksi Utama & Pedoman Anti-Halusinasi AI Agent — SDIT Fajar
---

# Instruksi Utama & Pedoman Anti-Halusinasi — SDIT Fajar

Dokumen ini adalah aturan tertinggi (*Highest Authority*) untuk AI Agent (Antigravity, Cursor, Windsurf, Claude Code) saat menganalisis, merancang, atau menulis kode di repositori SDIT Fajar. Tujuannya adalah memastikan agent bekerja secara presisi tanpa berhalusinasi atau menyimpang dari arsitektur yang telah ditetapkan.

---

## 1. Golden Rule: Cek Dokumentasi `docs/` Dahulu (Single Source of Truth)

Sebelum membuat file baru, mengubah kode, menambah endpoint, atau menjawab pertanyaan arsitektur:
1. **Wajib Membaca Dokumentasi di `docs/`**: Folder `docs/` adalah satu-satunya sumber kebenaran (*Single Source of Truth*).
2. **Hirarki Dokumen Acuan**:
   - `docs/prd.md` — Visi produk, hak akses, 5 role resmi, dan batasan scope.
   - `docs/techstack.md` — Spesifikasi teknologi, runtime, dan dependensi resmi.
   - `docs/design.md` & `.agents/rules/styleguide.md` — UI style guide, Shadcn, Tailwind CSS 4, dan aturan tabel Zebra Cross.
   - `docs/database.md` & `docs/PRD/08-skema-database-supabase.md` — Skema tabel PostgreSQL Supabase, Enum resmi, dan relasi.
   - `docs/api.md` — Kontrak Server Actions, webhook Midtrans, dan kuitansi pembayaran.
   - `docs/structure.md` — Struktur folder dan konvensi penamaan file.
   - `docs/ai-rules.md` & `docs/AGENTS.md` — Batasan teknis dan kode etik agen.
   - `docs/PRD/` (26 berkas) — Detail granular per modul fungsional.
3. **Protokol Saat Ragu (*Anti-Guessing*)**:
   - Jika suatu fungsi, nama kolom, atau alur tidak ditemukan di `docs/`, **DILARANG MENGARANG/BERASUMSI**.
   - Tanyakan kepada pengguna atau cantumkan catatan `TODO` eksplisit berdasar opsi teraman.

---

## 2. Batasan Role & Hak Akses (Dilarang Halusinasi Role)

- **Hanya Ada 5 Role Database Resmi (`app_role`)**:
  1. `super_admin`
  2. `admin`
  3. `guru`
  4. `murid`
  5. `wali_murid`
- ❌ **Dilarang Keras**: Menambah role baru di database seperti `teacher`, `student`, `parent`, `staff`, `principal`, atau `user`.
- **Aturan Jabatan Guru (`positions`)**:
  - Jabatan (`kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`) **BUKAN role database**, melainkan atribut jabatan di bawah role `guru`.
  - Seluruh guru menggunakan rute dashboard yang sama: `/dashboard/guru`. Fitur spesifik jabatan diaktifkan secara dinamis (*Position-based feature toggles*).

---

## 3. Batasan Ruang Lingkup (Strict Out-of-Scope)

- ❌ **FITUR CHAT INTERNAL DITIADAKAN**:
  - Jangan pernah membuat tabel `chat_messages`, `chat_rooms`, rute chat, socket/real-time messaging, atau komponen UI chat.
  - Komunikasi sekolah dilakukan satu arah melalui pengumuman terstruktur (*Announcements*) dan notifikasi dashboard.
- ❌ **MURID DILARANG MEMBAYAR**:
  - Pembayaran invoice SPP/tagihan **hanya dapat diinisiasi oleh akun `wali_murid`** untuk anak yang terhubung via **Midtrans Snap Popup Modal**.
  - Murid hanya memiliki akses read-only terhadap tagihan dan riwayat pembayaran mereka.
- ❌ **Dilarang Menambah Fitur di Luar Scope**:
  - Jangan membuat fitur video conference mandiri, payroll gaji rumit, AI automatic grading, atau multi-tenancy sekolah lain kecuali ada instruksi eksplisit di dokumen.

---

## 4. Alur Bisnis Khusus yang Wajib Diikuti

### A. PPDB Staging Flow
- Formulir pendaftaran PPDB online masuk ke tabel staging terpisah: `registrations`.
- Calon siswa **TIDAK langsung** masuk ke tabel `students` atau dibuatkan akun Auth.
- Promosi ke tabel `students` dan pembuatan akun login hanya dilakukan setelah diverifikasi dan disetujui (`status = 'approved'`) oleh admin.

### B. Otentikasi & Password Murid
- Murid login menggunakan **NIS** (disimpan di kolom `login_identifier`).
- Password bawaan berformat terstruktur `tempatddmmyyyy` (dari biodata tanggal lahir).
- Murid wajib langsung diarahkan ke halaman ganti password saat login perdana (`must_change_password = true`).

### C. Pembayaran & Kuitansi (Midtrans)
- Konfigurasi environment & server key Midtrans hanya dapat diaktifkan secara global oleh `super_admin`.
- Status `paid` pada invoice hanya boleh diubah melalui webhook callback Midtrans resmi setelah memverifikasi hash SHA512 `signature_key`.
- Kuitansi pembayaran dicetak menggunakan halaman web bersih print-friendly dengan styling CSS `@media print` (tanpa library PDF engine berat di sisi server).

---

## 5. Standar Frontend & UI (Sesuai Style Guide)

- **Tech Stack**: Next.js 16 (App Router di `src/`), React 19, TypeScript strict mode, Tailwind CSS 4.
- **Komponen UI**:
  - **Wajib menggunakan Shadcn UI** sebagai basis primitif (`src/components/ui/`).
  - **Utamakan Komponen Reusable**: Gunakan dan kembangkan komponen di `src/components/common/` (`ZebraDataTable`, `PageHeader`, `StatCard`, `StatusBadge`, `EmptyState`, dll). Jangan membuat komponen baru jika komponen serupa dapat digunakan kembali.
- **Tabel Data Wajib Zebra Cross**:
  - Seluruh tabel data wajib menggunakan gaya belang-selang (`even:bg-muted/25 dark:even:bg-muted/15`) dengan batas tipis presisi.
- **Desain**:
  - Mengikuti prinsip **Minimalist Craft & Design Engineering** ([jakub.kr](https://jakub.kr/)).
  - ❌ **Dilarang Claymorphism** (elemen 3D menggelembung, shadow tebal).
  - ❌ **Dilarang Bento Grid berat** yang membuang ruang data.
- **Bahasa Antarmuka**:
  - Seluruh teks UI, label form, placeholder, dan notifikasi wajib menggunakan **Bahasa Indonesia** yang formal, sopan, dan bernuansa islami terpadu.
  - Kode program, types, interface, variabel, dan komentar kode tetap menggunakan **Bahasa Inggris**.

---

## 6. Standar Backend, Database & Keamanan

- **Zero `any`**: Dilarang keras menggunakan tipe `any` di TypeScript. Semua type/interface wajib diletakkan di `src/types/`.
- **Supabase RLS Wajib Aktif**: Seluruh tabel domain wajib mengaktifkan PostgreSQL Row Level Security (RLS). Jangan berasumsi validasi frontend sudah cukup.
- **Validasi Ganda**: Semua mutasi client wajib melewati Next.js Server Actions di `src/actions/` dengan validasi skema **Zod**.
- **Kerahasiaan Kunci**: `SUPABASE_SERVICE_ROLE_KEY` dan `MIDTRANS_SERVER_KEY` **dilarang keras** bocor ke client component atau bundle browser.
- **Naming Conventions**:
  - File komponen React: `kebab-case.tsx`
  - Server Actions: `[nama].actions.ts` di `src/actions/`
  - Schema Zod: `[nama].schema.ts` di `src/validations/`
  - Hooks: `use[Nama].ts` di `src/hooks/`
  - Import path: Selalu gunakan alias `@/*`.

---

## 7. Definition of Done (DoD) untuk Setiap Task

Suatu task hanya dianggap selesai jika:
1. Sesuai 100% dengan spesifikasi di `docs/`.
2. Role guard dan hak akses diverifikasi secara ketat di sisi server.
3. Seluruh input divalidasi dengan Zod schema.
4. UI mengadopsi Shadcn UI, komponen reusable, dan tabel Zebra Cross.
5. Tersedia feedback state lengkap: loading skeleton, empty state, error message, dan toast Sonner.
6. Lolos validasi TypeScript (tanpa error linter / compiler).
7. Dokumentasi di `docs/` diperbarui jika terdapat penambahan rute, tabel, atau environment variable baru.