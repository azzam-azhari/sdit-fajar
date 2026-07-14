# Environment & Deployment

## Environment Variable Wajib

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Environment Variable Payment Setup

```env
PAYMENT_ENABLED=false
MIDTRANS_ENVIRONMENT=sandbox
MIDTRANS_MERCHANT_ID=
MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

## Catatan Env
- `.env.local` tidak boleh di-commit.
- Secret tidak boleh memakai prefix `NEXT_PUBLIC_`.
- `SUPABASE_SERVICE_ROLE_KEY` hanya untuk server.
- `MIDTRANS_SERVER_KEY` hanya untuk server.
- Gunakan sandbox Midtrans untuk development; production hanya diaktifkan super admin setelah checklist go-live.
- Password awal murid dibentuk server dari `tempat` + `ddmmyyyy`; jangan simpan password plaintext atau prefix rahasia di client.

## Setup Local
1. Install dependency.
2. Buat `.env.local` dari `env.example`.
3. Isi Supabase URL dan anon key.
4. Isi service role key hanya untuk server operation.
5. Jalankan migration SQL.
6. Buat bucket storage.
7. Jalankan development server.

```bash
npm install
npm run dev
```

## Build Check
Sebelum deploy:

```bash
npm run lint
npm run build
```

## Deployment Checklist
- Env production lengkap.
- Migration production sudah dijalankan.
- Bucket storage tersedia.
- RLS aktif.
- Storage policy sudah sesuai.
- Domain production masuk konfigurasi image remote patterns jika perlu.
- `NEXT_PUBLIC_SITE_URL` memakai domain production.
- Payment tetap disabled jika belum go-live.
- Login tiap role dites.
- Upload file dites.
- Public website dites.
- Pendaftaran, import CSV, absensi, chat, marketplace, dan receipt dites.
- RLS diuji untuk setiap role dan relasi anak/kelas/thread/invoice.

## Smoke Test Production
- Buka `/`.
- Buka `/berita`.
- Buka `/login`.
- Login admin.
- Login guru.
- Login siswa.
- Cek dashboard role.
- Cek create materi/tugas di staging.
- Cek upload gambar.
- Cek payment settings tetap setup/disabled.

## Backup
- Backup database Supabase berkala.
- Backup bucket storage penting.
- Simpan migration SQL di repository.
- Catat changelog setiap perubahan schema.

## Monitoring
Rekomendasi:
- monitoring error runtime;
- log server action penting;
- audit log untuk aksi sensitif;
- review dependency berkala.
