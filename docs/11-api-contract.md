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
- `admin_sekolah`

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
- Admin sekolah tidak boleh membuat `super_admin`.
- Email harus unik.
- Role wajib dari enum yang didokumentasikan.

### `updateUserRoleAction`
Role:
- `super_admin` only untuk mengubah role sensitif.
- `admin_sekolah` boleh mengubah role operasional kecuali `super_admin`.

## Materi

### `createMaterialAction`
Role:
- `guru`
- `wali_kelas` jika memiliki assignment mengajar
- `super_admin`/`admin_sekolah` untuk bantuan administratif

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
- `wali_kelas` jika memiliki assignment mengajar

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
- `wali_kelas` hanya jika dia guru assignment terkait

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
- `admin_sekolah`
- `kepala_sekolah`
- `guru`
- `wali_kelas`

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
- Wali kelas hanya bisa target kelas binaan.
- Admin dan kepala sekolah bisa target semua.

## Pendaftaran dan Import

### `submitRegistrationAction`
Role: public guest.

Rules:
- validasi data pendaftar dan dokumen;
- setiap file disimpan ke Storage dan URL/path dicatat;
- tidak membuat akun sebelum review.

### `importCsvAction`
Role: `super_admin` only.

Rules:
- hanya template yang didukung;
- preview dan error per baris sebelum commit;
- simpan `import_batches` dan audit log.

## Absensi

### `recordTeacherAttendanceAction`
Role: `guru`, `wali_kelas` untuk diri sendiri; admin/kepala sekolah untuk review.

Rules:
- check-in 07.30 dan check-out 14.30 Senin-Jumat;
- weekend hanya saat flag aktif;
- gunakan server time dan cegah duplikasi.

### `recordStudentAttendanceAction`
Role: `guru`, `wali_kelas`.

Rules:
- wajib terkait schedule dan assignment/kelas;
- tolak Sabtu-Minggu;
- satu siswa per jadwal per tanggal.

## Chat

### `sendChatMessageAction`
Role: authenticated thread member.

Rules:
- `senderId` berasal dari session, bukan input bebas;
- body divalidasi;
- RLS wajib memeriksa membership.

## Payment dan Receipt

## Payment Setup

### `updatePaymentSettingsAction`
Role:
- `super_admin`
- `admin_sekolah`

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
- `isEnabled` hanya dapat diubah `super_admin`; admin sekolah hanya dapat mengubah flag modul yang diizinkan.
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

### `POST /api/midtrans/webhook`
Status:
- harus aktif terkontrol sesuai flag dan signature verification.

Rules:
- Harus verify signature.
- Harus idempotent.
- Tidak boleh percaya payload tanpa validasi.
- Update invoice hanya jika signature valid.
