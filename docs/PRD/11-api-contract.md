# API Contract

## Prinsip
API internal boleh berupa Server Action atau Route Handler.
Nama di dokumen ini adalah kontrak perilaku, bukan harus selalu endpoint HTTP.

## Auth

### Login
Route UI: `/login`

Input:
```ts
type LoginInput = {
  identifier: string
  password: string
}
```

Output sukses:
```ts
type LoginSuccess = {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  redirectTo: string
}
```

## User Management

### `createUserAction`
Role:
- `super_admin`
- `admin`

Input:
```ts
type CreateUserInput = {
  name: string
  email: string
  role: UserRole
  password?: string
  isActive: boolean
}
```

Rules:
- Admin tidak boleh membuat `super_admin`.
- Email harus unik.
- Role wajib dari enum yang didokumentasikan.

### `updateUserRoleAction`
Role:
- `super_admin` only untuk mengubah role sensitif.
- `admin` boleh mengubah role operasional kecuali `super_admin`.

## Materi

### `createMaterialAction`
Role:
- `guru`
- guru jabatan `wali_kelas` jika memiliki assignment mengajar
- `super_admin`/`admin` untuk bantuan administratif

Input:
```ts
type CreateMaterialInput = {
  title: string
  description?: string
  content?: string
  classroomId: string
  subjectId: string
  filePath?: string
  externalUrl?: string
  status: 'draft' | 'published'
}
```

Rules:
- Guru hanya bisa membuat materi untuk assignment mengajar miliknya.
- Materi `draft` tidak terlihat oleh siswa.
- Materi `published` terlihat oleh siswa di classroom terkait.

## Tugas

### `createAssignmentAction`
Role:
- `guru`
- guru jabatan `wali_kelas` jika memiliki assignment mengajar

Input:
```ts
type CreateAssignmentInput = {
  title: string
  description: string
  instructions?: string
  classroomId: string
  subjectId: string
  dueAt: string
  allowLateSubmission: boolean
  maxScore: number
  status: 'draft' | 'published'
}
```

Rules:
- `dueAt` wajib di masa depan saat publish.
- `maxScore` default 100.
- Hanya siswa kelas terkait yang dapat melihat.

### `submitAssignmentAction`
Role:
- `murid`

Input:
```ts
type SubmitAssignmentInput = {
  assignmentId: string
  answerText?: string
  filePath?: string
}
```

Rules:
- Siswa hanya bisa submit assignment dari kelasnya.
- Jika lewat deadline dan `allowLateSubmission=false`, submission ditolak.
- Jika lewat deadline dan `allowLateSubmission=true`, status menjadi `late`.

### `gradeSubmissionAction`
Role:
- `guru`
- guru jabatan `wali_kelas` hanya jika dia guru assignment terkait

Input:
```ts
type GradeSubmissionInput = {
  submissionId: string
  score: number
  feedback?: string
}
```

Rules:
- Score tidak boleh melebihi `assignment.max_score`.
- Hanya guru pembuat assignment atau guru assignment terkait yang boleh menilai.

## Pengumuman

### `createAnnouncementAction`
Role:
- `super_admin`
- `admin`
- guru jabatan `kepala_sekolah`
- `guru`
- guru jabatan `wali_kelas`

Input:
```ts
type CreateAnnouncementInput = {
  title: string
  content: string
  targetType: 'all' | 'role' | 'class' | 'student'
  targetRole?: UserRole
  classroomId?: string
  studentId?: string
  status: 'draft' | 'published'
}
```

Rules:
- Guru hanya bisa target kelas yang diajar.
- Guru jabatan `wali_kelas` hanya bisa target kelas binaan.
- Admin dan guru jabatan `kepala_sekolah` bisa target semua.

## PPDB (Gelombang Pendaftaran & Berkas)

### `getPublicAdmissionWavesAction`
Role: public guest / all roles.

Rules:
- mengambil daftar gelombang aktif (`is_active = true`, `status = 'open'`);
- menyertakan informasi tanggal pembukaan, tanggal penutupan, kuota (default 100 murid), jumlah terdaftar (*auto-count*), sisa kuota, dan jadwal observasi.

### `createAdmissionWaveAction`
Role: `admin`, `super_admin`.

Rules:
- validasi input dengan Zod (`academic_year_id`, `wave_number` 1-3, `title`, `start_date`, `end_date`, `quota` default 100);
- nomor gelombang unik per tahun ajaran;
- mencatat log audit pembuatan gelombang.

### `updateAdmissionWaveAction`
Role: `admin`, `super_admin`.

Rules:
- memperbarui informasi gelombang, kuota murid, rentang tanggal, jadwal tes observasi, atau status (`draft`, `open`, `closed`, `archived`);
- jika gelombang ditutup, form publik tidak menerima pendaftaran baru.

### `deleteAdmissionWaveAction`
Role: `admin`, `super_admin`.

Rules:
- RESTRICT: dilarang menghapus gelombang yang sudah memiliki pendaftar terdaftar (`student_registration_applications` > 0);
- jika sudah ada pendaftar, hanya boleh diubah statusnya menjadi `closed` atau `archived`.

### `submitRegistrationAction`
Role: public guest.

Rules:
- memvalidasi data calon siswa, data orang tua, dan kelengkapan 7 berkas persyaratan via Zod;
- memastikan gelombang tujuan berstatus `open` dan tanggal masih dalam rentang `start_date` s.d. `end_date`;
- mengunggah file ke Supabase Storage bucket privat `registration-files/{application_id}/`;
- menyimpan rekaman ke `student_registration_applications` dan `student_registration_documents`;
- pendaftar otomatis masuk ke hitungan pendaftar gelombang (*auto-count*) dan mengurangi sisa kuota;
- mengembalikan payload nomor registrasi resmi (contoh: `PPDB-2026-G1-0024`), nama siswa, dan URL WhatsApp panitia (`https://wa.me/6287737860657?text=...`) untuk memunculkan popup konfirmasi informasi pembayaran di frontend.

### `verifyRegistrationDocumentAction`
Role: `admin`, `super_admin`.

Rules:
- memverifikasi keabsahan dokumen per file (`valid` atau `invalid`);
- memberikan catatan revisi (`admin_feedback`) jika dokumen buram atau salah format.

### `updateRegistrationApplicationStatusAction`
Role: `admin`, `super_admin`.

Rules:
- mengubah status formulir pendaftar (`under_review`, `approved`, `rejected`);
- mencatat nilai observasi/tes pemetaan dan catatan admin (`admin_notes`);
- calon siswa `approved` siap dipromosikan ke data siswa aktif saat tahun ajaran baru.

### `promoteApplicantToStudentAction`
Role: `admin`, `super_admin`.

Rules:
- hanya untuk pendaftar berstatus `approved`;
- membuat data `students`, data `parents`, menautkan di `parent_students`;
- men-generate NIS dan akun profil auth dengan default password `tempatddmmyyyy`.

## Import Data Massal

### `importCsvAction`
Role: `super_admin` only.

Rules:
- hanya template yang didukung;
- preview dan error per baris sebelum commit;
- simpan `import_batches` dan audit log.

## Absensi

### `recordTeacherAttendanceAction`
Role: `guru`, guru jabatan `wali_kelas` untuk diri sendiri; admin/guru jabatan `kepala_sekolah` untuk review.

Rules:
- check-in 07.30 dan check-out 14.30 Senin-Jumat;
- weekend hanya saat flag aktif;
- gunakan server time dan cegah duplikasi.

### `recordStudentAttendanceAction`
Role: `guru`, guru jabatan `wali_kelas`.

Rules:
- wajib terkait schedule dan assignment/kelas;
- tolak Sabtu-Minggu;
- satu siswa per jadwal per tanggal.

## Modul Tahfidz

### `recordTahfidzMutabaahAction`
Role:
- `guru` (pengampu tahfidz)

Input:
```ts
type RecordTahfidzInput = {
  studentId: string
  surahNumber: number
  ayatStart: number
  ayatEnd: number
  predicate: 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul'
  recordDate: string
  notes?: string
}
```

Rules:
- guru hanya dapat mencatat mutabaah untuk siswa binaannya;
- validasi surah (1-114) dan nomor ayat.

*(Catatan: Fitur chat internal ditiadakan).*

## Payment dan Receipt

## Payment Setup

### `updatePaymentSettingsAction`
Role:
- `super_admin`
- `admin`

Input:
```ts
type UpdatePaymentSettingsInput = {
  provider: 'midtrans'
  environment: 'sandbox' | 'production'
  merchantId: string
  clientKey: string
  isEnabled: boolean
  isSppEnabled: boolean
  isIuranEnabled: boolean
  isPendaftaranSemesterEnabled: boolean
  isMarketplaceEnabled: boolean
}
```

Rules:
- `serverKey` tidak dikirim dari client form.
- `isEnabled` hanya dapat diubah `super_admin`; admin hanya dapat mengubah flag modul yang diizinkan.
- Jika env `PAYMENT_ENABLED` bukan `true`, transaksi tidak boleh aktif meski database enabled.

### `createPaymentTransactionAction`
Role: `wali_murid` only.

Rules:
- invoice wajib terkait anak;
- modul dan global payment harus aktif;
- nominal/order ID berasal dari server;
- hanya satu transaksi aktif per invoice.

### `getPaymentReceiptAction`
Role: `wali_murid` yang memiliki relasi ke invoice.

Rules:
- receipt hanya untuk transaksi valid/paid;
- output memuat logo, waktu, invoice, siswa, kelas, nominal, status, dan data bank jika tersedia;
- halaman dapat dibuka di tab baru/diunduh.

### `POST /api/webhooks/midtrans`
Status:
- harus aktif terkontrol sesuai flag dan signature verification.

Rules:
- Harus verify signature.
- Harus idempotent.
- Tidak boleh percaya payload tanpa validasi.
- Update invoice hanya jika signature valid.
