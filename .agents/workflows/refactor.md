---
description: Prosedur refactoring aman tanpa merusak perilaku lama atau memicu regresi
---

# Workflow: Refactoring Aman (`/refactor`)

Gunakan panduan standar operasional (SOP) ini saat melakukan restrukturisasi kode, pembersihan logika, atau modularisasi komponen tanpa mengubah fungsionalitas sistem.

---

## Prinsip Dasar: "Perilaku Lama Tetap Utuh"
Tujuan utama refactoring adalah meningkatkan keterbacaan, efisiensi, dan *maintainability* kode tanpa mengubah antarmuka publik atau merusak perilaku lama (*zero behavioral regression*).

---

## Langkah 1: Audit & Pahami Perilaku Existing
1. Baca seluruh file yang akan di-refactor beserta file-file yang mengimpornya.
2. Identifikasi kontrak fungsi/komponen:
   - Apa saja props yang diterima?
   - Apa return value yang diharapkan pemanggil?
   - Apakah ada side-effect (seperti `revalidatePath`, mutasi store Zustand, atau query invalidation)?
3. **Dilarang memulai refactoring sebelum memahami 100% cara kerja kode lama.**

---

## Langkah 2: Kunci Kontrak dengan TypeScript
1. Pastikan seluruh types dan interfaces yang terkait sudah didefinisikan secara eksplisit di `@/types/`.
2. Jika ada tipe `any` pada kode lama, gantilah dengan interface yang tepat terlebih dahulu sebelum mengubah implementasi logika.

---

## Langkah 3: Eksekusi Perubahan Secara Bertahap (Incremental)
- ❌ **Dilarang Menulis Ulang Total Sekaligus (*Big-Bang Rewrite*)**: Risiko merusak perilaku tersembunyi sangat tinggi.
- Terapkan langkah kecil berurutan:
  1. **Ekstraksi Komponen/Fungsi**: Pindahkan blok UI atau logic rumit ke sub-komponen terpisah di `src/components/common/` atau helper di `@/lib/`.
  2. **Gunakan Kembali (*Reuse*)**: Gantikan elemen HTML mentah dengan komponen Shadcn atau komponen umum yang sudah ada.
  3. **Penyederhanaan Logika**: Ringkas percabangan kondisi (*early return pattern*).

---

## Langkah 4: Jaga Backward Compatibility
1. **Signature Pertahankan**: Jangan mengubah nama prop atau urutan parameter fungsi publik jika tidak mendesak.
2. Jika ada penambahan opsi baru, jadikan prop tersebut opsional (`propName?: Type`).
3. Jika mengganti nama fungsi/komponen, buat alias transisi atau perbarui seluruh tempat pemanggilnya secara serentak.

---

## Langkah 5: Verifikasi Bebas Regresi
1. **Validasi Tampilan**: Pastikan styling Tailwind CSS 4, batas garis tipis, dan tema Zebra Cross pada tabel tidak berubah atau bergeser.
2. **Validasi Tipe Data**: Jalankan pemeriksaan compiler TypeScript (`tsc --noEmit`) untuk memastikan tidak ada import error atau type mismatch.
3. **Validasi State**: Pastikan form submit, validasi Zod, dan toast Sonner tetap berfungsi normal seperti semula.
