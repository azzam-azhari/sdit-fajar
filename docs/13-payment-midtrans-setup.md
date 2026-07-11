# Payment Midtrans Setup

## Status Saat Ini
Payment SPP dan daftar ulang disiapkan untuk Midtrans, tetapi belum digunakan sebagai fitur aktif.

Tujuan tahap ini:
- menyiapkan struktur database;
- menyiapkan env;
- menyiapkan halaman konfigurasi;
- menyiapkan skeleton webhook;
- memastikan tidak ada transaksi aktif sebelum feature flag dinyalakan.

## Fitur Payment yang Disiapkan
- Setup provider Midtrans.
- Mode sandbox/production.
- Pengaturan client key dan merchant id.
- Server key via environment variable.
- Draft invoice SPP.
- Draft invoice daftar ulang.
- Status invoice.
- Skeleton webhook callback.

## Feature Flag
Payment harus dikontrol oleh dua lapis flag:

### Environment
```env
PAYMENT_ENABLED=false
MIDTRANS_ENVIRONMENT=sandbox
MIDTRANS_MERCHANT_ID=
MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

### Database
Tabel `payment_settings`:
- `is_enabled`
- `is_spp_enabled`
- `is_daftar_ulang_enabled`

Transaksi hanya boleh aktif jika:
- `PAYMENT_ENABLED=true` di env;
- `payment_settings.is_enabled=true`;
- modul terkait juga enabled.

## Halaman Setup
Route:
- `/dashboard/admin/payment/settings`
- `/dashboard/admin/payment/spp`
- `/dashboard/admin/payment/daftar-ulang`
- `/dashboard/orang-tua/payment`

Status UI saat belum aktif:
- tampilkan badge “Setup saja”.
- tombol “Bayar” disabled.
- tampilkan pesan “Fitur pembayaran belum diaktifkan oleh sekolah.”

## Payment Status
Gunakan enum:
- `draft`: tagihan dibuat tetapi belum ditampilkan untuk pembayaran aktif.
- `unpaid`: tagihan belum dibayar.
- `pending`: transaksi dibuat dan menunggu pembayaran.
- `paid`: pembayaran berhasil.
- `expired`: transaksi kedaluwarsa.
- `failed`: pembayaran gagal.
- `cancelled`: dibatalkan.

## Order ID Format
Saat fitur aktif nanti, gunakan format:

```text
SDITFAJAR-{PAYMENT_TYPE}-{INVOICE_ID_SHORT}-{TIMESTAMP}
```

Contoh:
```text
SDITFAJAR-SPP-8F31A2-202607101030
```

## Webhook Rules
Webhook `/api/midtrans/webhook` harus:
- menerima POST dari Midtrans;
- verify signature key;
- idempotent;
- menyimpan raw payload;
- update status transaksi;
- update invoice terkait;
- mencatat audit log.

## Larangan
- Jangan hardcode `MIDTRANS_SERVER_KEY`.
- Jangan expose server key ke client.
- Jangan membuat tombol bayar aktif jika flag false.
- Jangan mengubah invoice menjadi `paid` tanpa callback valid.
- Jangan menggunakan production key untuk development.

## Acceptance Setup
Payment setup dianggap selesai jika:
- env example berisi variable Midtrans;
- halaman setup bisa menyimpan config non-secret;
- server key hanya dibaca dari server env;
- tombol bayar belum aktif;
- webhook route tersedia sebagai skeleton aman;
- dokumentasi menjelaskan bahwa transaksi belum dipakai.
