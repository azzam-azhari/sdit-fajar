# Vercel & Supabase Setup

Dokumen ini berisi informasi terkait pengaturan (setup) layanan infrastruktur proyek SDIT Fajar.

## Identifier Layanan
- **GitHub**: `azzam-azhari`
- **Supabase Project**: `sditfajar`
- **Vercel Project**: `sditfajar`

## Panduan Environment Variables
Pastikan Anda telah mengatur *Environment Variables* di Vercel agar terhubung dengan Supabase. Nilai berikut harus dimasukkan ke menu konfigurasi di dashboard Vercel (`Settings > Environment Variables`):

```env
# URL dan Anon Key untuk Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]

# Service Role Key untuk operasi Server Action yang membutuhkan akses admin
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

> **Perhatian**: Kunci `SUPABASE_SERVICE_ROLE_KEY` bersifat sangat rahasia. Jangan pernah memasukkannya ke variabel dengan awalan `NEXT_PUBLIC_` karena akan terekspos ke sisi *client/browser*.
