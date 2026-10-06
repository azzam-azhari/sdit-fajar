# Catatan Keputusan Teknis (Q&A)

Berikut adalah daftar pertanyaan klarifikasi teknis yang telah dijawab dan diputuskan oleh pengguna/yayasan, yang menjadi acuan tambahan bagi Agent:

### 1. Lokasi Instalasi Next.js
**Pertanyaan:** Apakah inisialisasi Next.js (`create-next-app`) dilakukan di *root folder* proyek atau di dalam sub-folder tertentu?
**Keputusan:** Instalasi Next.js dilakukan **langsung di root folder** proyek ini (`c:\Users\muhaz\OneDrive\Desktop\sdit-fajar`).

### 2. Mode Pengembangan Supabase (Local vs Remote)
**Pertanyaan:** Untuk tahap development lokal, apakah menggunakan Supabase CLI (Docker/lokal) atau terhubung langsung ke remote project Supabase?
**Keputusan:** Pengembangan (development) akan terhubung **langsung ke remote Supabase** (project `sditfajar`), tidak menggunakan Supabase CLI lokal.

### 3. Package Manager
**Pertanyaan:** Apakah proyek ini secara spesifik menggunakan `npm`, `pnpm`, atau `bun`?
**Keputusan:** Proyek ini **wajib menggunakan `npm`** sebagai package manager utama.

### 4. Konfigurasi Awal Shadcn UI
**Pertanyaan:** Apakah agent diizinkan langsung mengonfigurasi Shadcn UI dan Tailwind CSS sesuai panduan tema (Zinc/Slate & Deep Blue)?
**Keputusan:** **Ya, diizinkan**. Agent bebas melakukan konfigurasi awal dan meng-install komponen dasar (seperti button, input, card) yang diperlukan secara otomatis.
