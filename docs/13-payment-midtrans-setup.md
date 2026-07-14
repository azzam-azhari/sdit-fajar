# Payment Midtrans

## Status
Payment Midtrans termasuk fitur aktif terkontrol. Aktivasi global hanya dilakukan oleh `super_admin` setelah checklist keamanan, environment, signature webhook, RLS, dan pengujian sandbox/production lulus.

## Peran
- `super_admin`: mengatur provider, environment, key non-secret, global flag, dan go-live.
- `admin_sekolah`: membuat, mengubah, menghapus invoice serta mengaktifkan/menonaktifkan modul yang telah diizinkan super admin.
- `wali_murid`: satu-satunya role yang dapat memulai pembayaran dan checkout marketplace; hanya melihat invoice/receipt anak yang terhubung.
- Role lain: tidak dapat memulai transaksi.

## Jenis Tagihan
- SPP bulanan.
- Iuran ekstrakurikuler.
- Pendaftaran semester ganjil.
- Pendaftaran semester genap.
- Produk marketplace.
- Jenis lain yang disetujui sekolah.

## Flag Berlapis
Transaksi hanya boleh aktif jika semua kondisi benar:

```env
PAYMENT_ENABLED=false
MIDTRANS_ENVIRONMENT=sandbox
MIDTRANS_MERCHANT_ID=
MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

Dan database memiliki:
- `payment_settings.is_enabled = true`;
- flag modul terkait true;
- invoice bukan draft dan belum memiliki transaksi aktif;
- role user `wali_murid` serta relasi anak valid.

`MIDTRANS_SERVER_KEY` hanya di environment server. Jangan simpan di database atau kirim ke client.

## Alur Transaksi
1. Admin membuat invoice dengan bulan/tahun aktif, jenis, nominal, jatuh tempo, dan siswa/parent terkait.
2. Admin dapat mengatur pengingat sebelum jatuh tempo, misalnya 30, 14, 7, 3, dan 1 hari.
3. Wali murid membuka invoice anak.
4. Server memvalidasi role, relasi, flag, nominal, dan status invoice.
5. Server membuat order ID dan Snap transaction.
6. Midtrans memproses pembayaran.
7. Webhook memverifikasi signature, order ID, nominal, dan idempotency.
8. Sistem memperbarui transaksi/invoice dan membuat `payment_receipts` saat status valid.

## Receipt
Receipt dapat dibuka di tab baru dan diunduh oleh wali murid yang memiliki relasi. Isi minimal:
- logo sekolah;
- logo Midtrans;
- tanggal dan jam pembayaran;
- nomor invoice;
- nama siswa dan kelas;
- jumlah dan status pembayaran;
- nama bank, nomor rekening, dan nama rekening pengirim jika tersedia;
- bank tujuan, nomor rekening tujuan, dan nama rekening tujuan jika tersedia.

Logo dan file receipt selalu dirujuk melalui URL/path yang tersimpan di tabel. Data bank yang tidak dikirim Midtrans boleh nullable dan tidak boleh ditebak.

## Status
- `draft`, `unpaid`, `pending`, `paid`, `expired`, `failed`, `cancelled`.
- Perubahan ke `paid` hanya dari callback signature valid.
- Webhook idempotent dan menolak status transition yang tidak sah.

## Route
- `/dashboard/super-admin/payment`
- `/dashboard/admin/payment/settings`
- `/dashboard/admin/payment/invoices`
- `/dashboard/admin/payment/modules`
- `/dashboard/wali-murid/payment`
- `/dashboard/wali-murid/payment/[invoiceId]`
- `/dashboard/wali-murid/payment/[invoiceId]/receipt`
- `POST /api/midtrans/webhook`

## Acceptance
- Global payment hanya dapat diubah super admin.
- Admin dapat CRUD invoice sesuai permission.
- Tombol bayar tidak tampil aktif untuk role selain wali murid.
- Receipt membuka di tab baru, dapat diunduh, dan tidak bocor ke parent lain.
- Server key tidak pernah masuk client/database.
