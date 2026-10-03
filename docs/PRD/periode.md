# Periode Pembelajaran & Kalender Akademik

## 1. Prinsip Utama
SDIT Fajar menerapkan kalender akademik yang mengacu pada **Kalender Pendidikan Nasional** (Kemendikbudristek dan Dinas Pendidikan setempat) yang diselaraskan dengan **Standar Mutu Kekhasan Sekolah Islam Terpadu (JSIT)**.

- Siklus tahun ajaran resmi berjalan dari **bulan Juli sampai dengan bulan Juni** tahun berikutnya.
- Pembelajaran formal terbagi dalam **2 semester** (Semester Ganjil dan Semester Genap).
- Seluruh data operasional LMS (kelas, rombel, materi, tugas, nilai, absensi, dan penagihan SPP) terikat pada entitas periode ini.

---

## 2. Struktur Periode Akademik

### A. Tahun Ajaran (`academic_years`)
- **Format Penamaan**: `YYYY/YYYY` (contoh: `2026/2027`).
- **Rentang Waktu**: `1 Juli` s.d. `30 Juni` tahun berikutnya.
- **Aturan Status**: Hanya ada **1 tahun ajaran aktif** (`is_active = true`) pada satu waktu di sistem.
- **Keterikatan Data**: Menjadi induk bagi rombongan belajar (`classrooms`), penugasan guru (`teaching_assignments`), jabatan guru per tahun ajaran (`teacher_positions`), serta rekapitulasi invoice tahunan.

### B. Semester (`semesters`)
Setiap tahun ajaran memiliki tepat dua semester:

| Semester | Rentang Waktu | Fokus Kegiatan Akademik |
|---|---|---|
| **Semester 1 (Ganjil)** | 1 Juli – 31 Desember | Masa Pengenalan Lingkungan Sekolah (MPLS), Pembelajaran reguler, Penilaian Tengah Semester (PTS/STS), Penilaian Akhir Semester (PAS/SAS), Pembagian Rapor Ganjil, Libur Akhir Semester. |
| **Semester 2 (Genap)** | 1 Januari – 30 Juni | Pembelajaran reguler, Ujian Sekolah/Asesmen Akhir Jenjang (Kelas 6), Penilaian Akhir Tahun (PAT/SAT), Wisuda/Pelepasan Kelas 6, Rapor Kenaikan Kelas, Libur Akhir Tahun Ajaran. |

- **Aturan Status**: Hanya ada **1 semester aktif** (`is_active = true`) per tahun ajaran.

---

## 3. Penyesuaian Khas SDIT (JSIT & Kalender Hijriah)

Meskipun kalender formal menggunakan penanggalan Masehi (Juli–Juni), SDIT Fajar mengakomodasi agenda keislaman dan kalender Hijriah:

1. **Bulan Suci Ramadhan & Hari Raya Islam**:
   - Libur Awal Ramadhan (1-3 hari pertama).
   - Penyesuaian jam belajar selama bulan Ramadhan (durasi jam pelajaran diperpendek).
   - Program Pesantren Kilat / Semarak Ramadhan.
   - Libur Hari Raya Idul Fitri (H-7 s.d. H+7 Syawal).
   - Libur Hari Raya Idul Adha & Hari Tasyrik (pelaksanaan qurban sekolah).
2. **Agenda Khas Keislaman & JSIT**:
   - **Tasmi' Al-Qur'an & Imtihan Tahfidz**: Dilaksanakan berkala menjelang evaluasi tengah/akhir semester.
   - **Mabit (Malam Bina Iman dan Taqwa)**: Dilaksanakan terjadwal untuk penguatan ibadah dan ruhiyah siswa.
   - **Mukhayyam / Kemah Ukhuwah**: Agenda tahunan kepramukaan SIT.

---

## 4. Integrasi dengan Skema Database LMS

### A. Entitas `academic_years`
```sql
create table academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,        -- contoh: '2026/2027'
  start_date date not null,         -- '2026-07-01'
  end_date date not null,           -- '2027-06-30'
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### B. Entitas `semesters`
```sql
create table semesters (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid references academic_years(id) on delete cascade,
  name text not null,               -- 'Semester 1' / 'Semester 2'
  start_date date not null,
  end_date date not null,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### C. Entitas Operasional `school_period_settings`
Mengendalikan siklus operasional bulanan berjalan:
- `active_month` (1-12) & `active_year`: Bulan dan tahun operasional yang sedang berjalan.
  - Tagihan SPP bulan pertama tahun ajaran baru selalu dimulai di **Bulan 7 (Juli)**.
  - Bulan 1-6 mengacu pada semester genap tahun kalender berikutnya.
- `teacher_weekend_attendance_enabled`: Saklar izin absensi akhir pekan (Sabtu/Minggu) yang dapat diaktifkan oleh guru jabatan `kepala_sekolah` jika terdapat agenda khusus (seperti mabit, rapat kerja, atau perkemahan).

---

## 5. Alur Pergantian Periode & Mutasi Siswa

1. **Pergantian Semester (Ganjil ke Genap)**:
   - Data rombel (`classrooms`), wali kelas, dan keanggotaan siswa tidak berubah.
   - Hanya mengubah status `semesters.is_active` dari Semester 1 ke Semester 2.
   - Materi dan tugas baru akan terikat pada Semester 2, sedangkan materi/tugas Semester 1 tetap dapat diakses sebagai arsip baca riwayat.

2. **Pergantian Tahun Ajaran Baru (Kenaikan Kelas & Kelulusan)**:
   - Dilakukan oleh `admin` atau `super_admin` pada akhir bulan Juni / awal bulan Juli.
   - Membuat entitas `academic_years` baru dan mengaktifkannya.
   - Menjalankan mutasi kelas:
     - Siswa kelas 6 yang lulus diberi status `graduated` pada `class_students`.
     - Siswa kelas 1-5 naik kelas ke rombel baru tahun ajaran baru.
     - Siswa baru (hasil PPDB) dimasukkan ke rombel kelas 1 baru.
   - Data nilai, absensi, dan transaksi tahun ajaran sebelumnya terkunci sebagai data historis (*read-only*).

---

## 6. Aturan CRUD Periode & Guardrails Keamanan Data

Periode akademik dapat dikelola melalui operasi CRUD di dashboard oleh `super_admin` dan `admin`, dengan batasan keamanan ketat berikut:

### A. Create (Tambah Periode)
- **Kewenangan**: `super_admin` dan `admin`.
- **Validasi**:
  - Format nama tahun ajaran unik (contoh: `2026/2027`).
  - `start_date` wajib lebih awal dari `end_date`.
  - Otomatis membuat draf 2 semester (`Semester 1` dan `Semester 2`) di bawah tahun ajaran terkait.

### B. Read (Akses & Tampilan Arsip)
- **Akses Pengguna**: Semua role dapat membaca data periode aktif (`is_active = true`).
- **Selector/Switcher Periode**:
  - Dashboard Admin dan Guru menyediakan dropdown pemilih tahun ajaran.
  - Membuka tahun ajaran lampau secara otomatis mengaktifkan mode **Read-Only (Arsip)** untuk melihat riwayat nilai, rapor, absensi, atau invoice tanpa opsi modifikasi.

### C. Update (Ubah Periode & Status Aktif)
- **Perubahan Tanggal/Deskripsi**:
  - Tanggal `start_date` dan `end_date` dapat disesuaikan jika terjadi pergeseran kalender dinas pendidikan atau libur hari raya.
- **Eksklusivitas Status Aktif (`is_active`)**:
  - Sistem menjamin hanya **1 Tahun Ajaran** yang aktif pada satu waktu.
  - Mengaktifkan tahun ajaran baru otomatis mengubah tahun ajaran sebelumnya menjadi `is_active = false`.
  - Mengaktifkan semester baru (Semester 2) otomatis menonaktifkan semester sebelumnya (Semester 1).

### D. Delete (Hapus Periode) — Restrict on Delete
- **Prinsip Utama**: Database dan Server Action **melarang keras (RESTRICT)** penghapusan tahun ajaran atau semester yang sudah memiliki data anak/relasi.
- **Kondisi Penghapusan**:
  - **Boleh Dihapus**: Hanya jika periode baru saja dibuat karena kesalahan pengetikan dan **belum memiliki relasi data sama sekali** (tidak ada rombel, jadwal, materi, tugas, nilai, absensi, atau invoice).
  - **Dilarang Dihapus**: Jika telah memiliki minimal 1 relasi data akademik atau transaksi keuangan. Sistem wajib menolak dan menampilkan pesan:
    > *"Tahun ajaran tidak dapat dihapus karena sudah memiliki data akademik atau transaksi terkait. Silakan nonaktifkan atau arsipkan tahun ajaran."*
- **Siklus Hidup Periode (Lifecycle)**:
  - `draft`: Periode yang sedang dipersiapkan untuk masa depan.
  - `active`: Periode yang sedang berjalan saat ini.
  - `archived` / `closed`: Periode masa lalu yang terkunci permanen sebagai data arsip historis.