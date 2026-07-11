# LMS Akademik

## Modul Akademik Utama
- Tahun ajaran.
- Semester.
- Kelas/rombel.
- Siswa.
- Guru.
- Mata pelajaran.
- Jadwal pelajaran.
- Materi.
- Tugas.
- Pengumpulan tugas.
- Nilai.
- Pengumuman.

## Materi Pembelajaran

### Field Utama
- judul;
- deskripsi;
- konten;
- file/link;
- kelas;
- mapel;
- guru;
- semester;
- status draft/published.

### Rules
- Materi draft hanya terlihat oleh pembuat dan admin.
- Materi published terlihat oleh siswa kelas terkait.
- Orang tua bisa melihat materi anak.
- Materi bisa berupa teks, file, link, atau kombinasi.

## Tugas

### Field Utama
- judul;
- deskripsi;
- instruksi;
- file lampiran;
- kelas;
- mapel;
- deadline;
- max score;
- allow late submission;
- status draft/published/closed.

### Rules
- Tugas draft tidak terlihat oleh siswa.
- Tugas published terlihat oleh siswa kelas terkait.
- Tugas melewati deadline tetap bisa dilihat.
- Jika telat dan masih boleh submit, status submission menjadi `late`.
- Jika sudah closed, siswa tidak bisa submit.

## Pengumpulan Tugas

### Field Utama
- assignment;
- student;
- answer text;
- file;
- submitted at;
- status;
- score;
- feedback.

### Rules
- Satu siswa satu submission per assignment.
- Submission bisa diupdate sebelum deadline jika diizinkan.
- Guru bisa melihat seluruh submission tugas miliknya.
- Siswa hanya melihat submission miliknya.
- Orang tua hanya melihat submission anak.

## Nilai

### MVP
Nilai berasal dari `assignment_submissions.score`.

### Lanjutan
Gunakan tabel `grades` untuk:
- nilai harian;
- nilai tengah semester;
- nilai akhir semester;
- nilai manual;
- rekap raport.

## Jadwal Pelajaran
Field:
- kelas;
- mapel;
- guru;
- hari;
- jam mulai;
- jam selesai;
- ruang.

Rules:
- Siswa melihat jadwal kelasnya.
- Orang tua melihat jadwal anaknya.
- Guru melihat jadwal mengajarnya.

## Dashboard Siswa
Menampilkan:
- salam/nama siswa;
- tugas aktif;
- materi terbaru;
- nilai terbaru;
- pengumuman;
- jadwal hari ini.

## Dashboard Guru
Menampilkan:
- kelas yang diajar;
- tugas aktif;
- submission perlu dinilai;
- materi terbaru;
- jadwal mengajar;
- pengumuman.

## Dashboard Wali Kelas
Menampilkan:
- jumlah siswa kelas binaan;
- tugas belum dikumpulkan;
- ringkasan nilai;
- pengumuman kelas;
- siswa yang perlu perhatian.

## Dashboard Kepala Sekolah
Menampilkan:
- total siswa;
- total guru;
- aktivitas materi/tugas;
- rata-rata penyelesaian tugas;
- laporan per kelas.

## Dashboard Orang Tua
Menampilkan:
- daftar anak;
- tugas anak;
- nilai terbaru;
- pengumuman;
- status pembayaran jika aktif.

## Status Standar
Assignment:
- `draft`
- `published`
- `closed`

Submission:
- `not_submitted`
- `submitted`
- `late`
- `graded`

Material:
- `draft`
- `published`
- `archived`
