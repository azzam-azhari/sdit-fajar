# Komponen UI

## Prinsip Komponen
- Komponen harus reusable dan typed.
- Gunakan Shadcn UI sebagai basis.
- Komponen domain diletakkan di `src/components/common` atau folder fitur terkait.
- Komponen dasar dari Shadcn tetap di `src/components/ui`.
- Jangan membuat komponen baru jika komponen lama masih bisa dikembangkan dan kembangkan komponent lama jika ada perubahan dalam implementasi.

## Komponen Layout

### `PublicNavbar`
Untuk halaman publik.

Fitur:
- logo sekolah;
- menu desktop;
- menu mobile;
- dropdown profil;
- active link;
- tombol daftar;
- blur saat scroll.

### `PublicFooter`
Fitur:
- deskripsi sekolah;
- kontak WhatsApp/email;
- link Instagram, TikTok, YouTube;
- embed Google Maps;
- pencarian footer jika masih diperlukan.

### `DashboardShell`
Wrapper semua halaman dashboard.

Props minimal:
```ts
type DashboardShellProps = {
  children: React.ReactNode
  role: UserRole
  title?: string
}
```

### `DashboardSidebar`
Sidebar menu berdasarkan role.

Aturan:
- Menu difilter berdasarkan role.
- Jangan hanya mengandalkan sidebar untuk security.
- Backend tetap wajib cek role.

## Komponen Data

### `DataTable`
Dipakai untuk user, siswa, guru, kelas, materi, tugas, dan tagihan.

Fitur:
- search;
- filter;
- pagination;
- sorting;
- row action;
- empty state.

### `StatusBadge`
Status umum:
- `draft`
- `published`
- `archived`
- `active`
- `inactive`
- `submitted`
- `late`
- `graded`
- `paid`
- `unpaid`
- `pending`
- `expired`
- `failed`
- `cancelled`

### `StatCard`
Untuk ringkasan dashboard.

Data minimal:
```ts
type StatCardProps = {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}
```

## Komponen LMS

### `MaterialCard`
Menampilkan materi.

Informasi:
- judul;
- mapel;
- kelas;
- guru;
- tanggal publish;
- attachment/link.

### `AssignmentCard`
Menampilkan tugas.

Informasi:
- judul;
- mapel;
- kelas;
- deadline;
- status;
- jumlah pengumpulan untuk guru;
- status pengumpulan untuk siswa.

### `SubmissionStatusBadge`
Status:
- `not_submitted` Belum dikumpulkan
- `submitted` Sudah dikumpulkan
- `late` Terlambat
- `graded` Dinilai

### `GradeSummaryCard`
Untuk siswa dan wali murid.

Informasi:
- mapel;
- nilai rata-rata;
- tugas selesai;
- feedback terbaru.

## Komponen Form

### `UserForm`
Field:
- nama;
- email;
- role;
- status aktif;
- avatar opsional.

### `StudentForm`
Field:
- nama;
- NIS;
- kelas;
- wali murid;
- status aktif.

### `TeacherForm`
Field:
- nama;
- NIP/NUPTK opsional;
- mapel;
- kelas yang diajar;
- status aktif.

### `MaterialForm`
Field:
- judul;
- deskripsi;
- mapel;
- kelas;
- konten;
- file/link;
- status.

### `AssignmentForm`
Field:
- judul;
- deskripsi;
- mapel;
- kelas;
- deadline;
- file opsional;
- status publish.

### `PaymentSettingsForm`
Untuk setup dan aktivasi Midtrans; aktivasi global hanya tampil untuk `super_admin`.

Field:
- environment: `sandbox` atau `production`;
- merchant id;
- client key;
- server key disimpan di env, bukan client;
- global/module payment flag.

### `PaymentInvoiceTable`
- filter jenis tagihan, bulan, tahun, dan status;
- aksi create/edit/delete untuk admin sekolah;
- aksi bayar hanya untuk `wali_murid`;
- tautan receipt hanya untuk wali murid terkait.

### `PaymentReceipt`
- logo sekolah dan logo Midtrans dari URL yang tersimpan;
- waktu pembayaran, nomor invoice, siswa, kelas, nominal, status;
- data bank pengirim dan tujuan jika tersedia;
- mode print/download dan buka di tab baru.

### `CsvImportPanel`
- pilihan entitas import;
- download template CSV resmi;
- preview baris dan error per baris;
- hasil import dan audit reference.

### `AttendancePanel`
- sesi guru masuk/pulang;
- jadwal siswa yang sedang berlangsung;
- status weekend berdasarkan pengaturan kepala sekolah.

### `ChatThread`
- daftar thread yang user boleh lihat;
- pesan realtime;
- composer dengan validasi dan indikator terkirim.

### `MarketplaceProductCard`
- cover, judul, ringkasan, harga, dan status;
- link file digital hanya setelah pembayaran terverifikasi.

## Feedback Component
Semua aksi mutasi harus memberi feedback:
- toast success;
- toast error;
- disable tombol saat submit;
- loading indicator.

## Empty State Copy
- User: “Belum ada data user.”
- Materi: “Belum ada materi untuk kelas ini.”
- Tugas: “Belum ada tugas aktif.”
- Nilai: “Nilai belum tersedia.”
- Pembayaran: “Fitur pembayaran belum diaktifkan oleh super admin.”
