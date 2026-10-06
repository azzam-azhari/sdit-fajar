---
description: SOP alur autentikasi Supabase, login murid (NIS), login staf/wali, dan proteksi middleware
---

# Workflow: Autentikasi & Manajemen Sesi (`/authentikasi`)

Gunakan panduan standar operasional (SOP) ini saat mengimplementasikan atau memperbaiki alur login, logout, proteksi rute, dan sesi otentikasi.

---

## 1. Mekanisme Login Berdasarkan Role

1. **Login Murid (Siswa)**:
   - Menggunakan rute khusus: `/login-murid` atau form login NIS.
   - Identifier login: **NIS** (disimpan di `profiles.login_identifier`).
   - Format password bawaan: `tempatddmmyyyy` (dari biodata tanggal lahir).
   - **Pemeriksaan Login Pertama**:
     - Jika `must_change_password === true`: Redirect langsung ke halaman ganti password wajib (`/ganti-password`).
     - Jika sudah diganti: Redirect ke `/dashboard/siswa`.
2. **Login Staf & Wali Murid**:
   - Menggunakan rute: `/login`.
   - Menggunakan Email dan password resmi yang terdaftar di Supabase Auth.
   - Redirect sesuai pemetaan role:
     - `super_admin` -> `/dashboard/super-admin`
     - `admin` -> `/dashboard/admin`
     - `guru` -> `/dashboard/guru`
     - `wali_murid` -> `/dashboard/wali-murid`

---

## 2. Proteksi Rute (Middleware & Server Guard)

1. **Rute Publik (Guest Accessible)**:
   - `/`, `/tentang`, `/berita`, `/ppdb`, `/kontak`.
2. **Rute Guest Only**:
   - `/login`, `/login-murid`. Jika user yang sudah login mengakses rute ini, redirect otomatis ke dashboard perannya.
3. **Rute Terproteksi (`/dashboard/*`)**:
   - Jika belum login -> Redirect ke `/login`.
   - Jika akun `is_active === false` -> Tampilkan pesan: *"Akun Anda tidak aktif. Hubungi admin sekolah."*
   - Jika role tidak cocok -> Tampilkan error `403 Tidak punya akses` atau redirect ke dashboard yang sesuai.

---

## 3. Server-Side Guard Helpers (`@/lib/auth-guard.ts`)

Selalu gunakan helper server-side untuk memastikan authorization aman:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active || !allowedRoles.includes(profile.role)) {
    redirect('/unauthorized');
  }
  return profile;
}
```
