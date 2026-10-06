---
description: SOP investigasi error, pencarian root cause, penjelasan masalah, hingga perbaikan minimal yang presisi
---

# Workflow: Investigasi & Perbaikan Bug (`/bug-fix`)

Gunakan panduan standar operasional (SOP) ini saat menangani laporan bug, runtime error, query gagal, atau inkonsistensi data.

---

## Prinsip Utama: Anti "Membabi Buta"
> [!WARNING]
> **DILARANG LANGSUNG MENGEDIT KODE SECARA MEMBABI BUTA!**
> Perbaikan yang dilakukan tanpa memahami akar masalah sering kali menciptakan bug baru yang lebih berbahaya. Ikuti protokol investigasi di bawah ini secara disiplin.

---

## Langkah 1: Root Cause Analysis (Temukan Akar Masalah)
1. **Analisis Pesan Error & Stack Trace**:
   - Di mana file dan baris spesifik tempat error muncul?
   - Apakah error terjadi di sisi client (browser console) atau server (Next.js/Supabase log)?
2. **Telusuri Aliran Data (Data Flow Tracing)**:
   - Apakah input dari pengguna valid sesuai Zod schema?
   - Apakah sesi Supabase Auth aktif dan memiliki role yang sesuai?
   - Apakah query database terkena blokade PostgreSQL Row Level Security (RLS)?
   - Apakah tipe data di TypeScript tidak sinkron dengan data aktual dari Supabase?

---

## Langkah 2: Jelaskan Penyebabnya Secara Transparan
Sebelum mengedit file, sampaikan penjelasan ringkas kepada pengguna:
1. **Apa yang sebenarnya terjadi?**
2. **Mengapa error tersebut bisa muncul?** (kondisi pemicu/edge case).
3. **Bagian mana yang menjadi sumber masalah?** (sebutkan file dan fungsi terkait).

---

## Langkah 3: Rencanakan Perbaikan Minimal (*Minimal Diff*)
- Pilih solusi perbaikan yang paling presisi dan minim dampak samping:
  - ❌ Hindari merombak arsitektur besar hanya untuk memperbaiki bug kecil.
  - Perbaiki kondisi batas (*null check*, validasi tipe, atau penanganan state async).
- Pastikan perbaikan tidak mematikan fitur lain di sekitarnya.

---

## Langkah 4: Terapkan Perbaikan Presisi
1. Buka file target dan lakukan pengeditan hanya pada baris yang bermasalah.
2. Tambahkan pengaman (*guard clause* atau error boundary) jika memungkinkan untuk mencegah bug serupa terulang di masa mendatang.

---

## Langkah 5: Verifikasi & Uji Perbaikan
1. Periksa apakah compiler TypeScript bersih (`tsc --noEmit`).
2. Uji alur yang sebelumnya gagal untuk memastikan masalah teratasi.
3. Uji skenario normal untuk memastikan tidak terjadi efek samping (*regression*).
