# Backend

## Stack Backend
- Next.js App Router.
- Server Actions untuk mutasi form internal.
- Route Handlers di `src/app/api` untuk webhook atau endpoint yang harus HTTP-based.
- Supabase sebagai database, auth, storage, dan realtime bila dibutuhkan.
- Zod untuk validasi input.

## Struktur Folder Backend

```text
src/
├── actions/
│   ├── auth-actions.ts
│   ├── storage-action.ts
│   └── audit-log-actions.ts
├── app/
│   ├── api/
│   │   ├── midtrans/
│   │   │   └── webhook/route.ts
│   │   └── health/route.ts
│   └── (dashboard)/
│       └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   └── middleware.ts
│   ├── auth/
│   │   ├── require-user.ts
│   │   ├── require-role.ts
│   │   └── permissions.ts
│   ├── midtrans/
│   │   ├── client.ts
│   │   └── verify-notification.ts
│   └── utils.ts
├── validations/
└── types/
```

## Supabase Client

### Browser Client
Dipakai di Client Component untuk operasi aman sesuai RLS.

### Server Client
Dipakai di Server Component dan Server Action untuk membaca session user.

### Admin Client
Dipakai hanya di server untuk operasi administratif seperti membuat user.

Aturan:
- Admin client tidak boleh diimport di Client Component.
- Service role key tidak boleh masuk bundle client.

## Pola Server Action
Setiap Server Action harus mengikuti urutan:
1. ambil session user;
2. cek role/permission;
3. validasi input dengan Zod;
4. eksekusi query Supabase;
5. catat audit log jika sensitif;
6. return hasil typed;
7. tampilkan toast di client.

Contoh pola response:

```ts
type ActionResult<T = null> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

## Kapan Pakai Server Action
Gunakan Server Action untuk:
- create/update/delete data dashboard;
- upload file dari form;
- membuat user;
- update role;
- submit tugas;
- nilai tugas.
- approve pendaftaran dan import CSV;
- mencatat absensi;
- membuat thread/pesan chat;
- membuat invoice dan memulai pembayaran setelah guard.

## Kapan Pakai Route Handler
Gunakan Route Handler untuk:
- Midtrans webhook;
- health check;
- endpoint yang dipanggil provider eksternal;
- download/signed URL jika butuh endpoint khusus.

## Validasi Zod
Semua input wajib punya schema di `src/validations`.

Contoh:

```ts
export const assignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  classroomId: z.string().uuid(),
  subjectId: z.string().uuid(),
  dueAt: z.string().datetime(),
  status: z.enum(['draft', 'published', 'closed']),
})
```

## Error Handling
- Jangan return raw database error ke user.
- Simpan error detail di server log.
- Return pesan aman seperti “Gagal menyimpan data. Silakan coba lagi.”
- Untuk validasi, tampilkan error per field.

## Realtime
Realtime dipakai untuk chat internal dan boleh dipakai untuk notifikasi.

Boleh digunakan untuk:
- pengumuman terbaru;
- status submission;
- notifikasi dashboard.

Untuk chat, subscription harus difilter berdasarkan thread membership dan tetap tunduk pada RLS.

Jangan gunakan realtime untuk:
- payment callback utama;
- logic security;
- sinkronisasi nilai penting tanpa fallback query.

## Backend Payment Aktif Terkontrol
- Super admin menyimpan konfigurasi non-secret dan mengaktifkan global payment.
- Admin sekolah mengelola invoice dan modul yang telah diizinkan.
- Hanya wali murid yang dapat meminta Snap transaction.
- Server memeriksa `PAYMENT_ENABLED`, setting database, flag modul, role, dan relasi siswa.
- Webhook memverifikasi signature, idempotency, nominal, order ID, dan status transition.
- Receipt dibuat server-side dari data transaksi tervalidasi; URL logo/file disimpan di tabel.
- Server key hanya dibaca di server environment.

## Import CSV
- Template CSV didefinisikan per entitas dan tersedia melalui route protected super admin.
- Parser server memvalidasi encoding, header, ukuran, tipe, duplikasi, dan relasi.
- Commit memakai transaksi; error per baris disimpan di `import_batches`.
- File CSV sumber disimpan sebagai URL/path private untuk audit.
