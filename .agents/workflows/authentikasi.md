---
description: SOP alur autentikasi Supabase, login NIS murid, login WhatsApp wali, dan proteksi middleware
---

# Workflow: Autentikasi & Manajemen Sesi (`/authentikasi`)

Gunakan panduan standar operasional (SOP) ini saat mengimplementasikan atau memperbaiki alur login, logout, proteksi rute, dan sesi otentikasi di repositori SDIT Fajar.

---

## 1. Pintu Masuk Tunggal (`/login`) & Mekanisme Kredensial

Aplikasi SDIT Fajar menggunakan **satu halaman login terpadu di `/login`** (tidak ada rute terpisah seperti `/login-murid`). Halaman login menyediakan tab/selector identifier yang memudahkan pengguna:

1. **Login Murid (Role: `murid`)**:
   - **Identifier Input**: **NIS** (Nomor Induk Siswa).
   - **Password Awal**: `tempatddmmyyyy` (dari biodata tanggal lahir, huruf kecil tanpa spasi + 8 digit tanggal lahir, contoh: `jakartaselatan30122015`).
   - **Pemeriksaan Login Pertama**:
     - Jika `must_change_password === true`: Redirect langsung ke `/ganti-password`.
     - Jika sudah diganti: Redirect ke `/dashboard/murid`.
2. **Login Wali Murid (Role: `wali_murid`)**:
   - **Identifier Input**: **Nomor WhatsApp / HP Aktif** yang didaftarkan saat PPDB / di-import Super Admin.
   - **Password Awal**: Nomor WhatsApp / HP yang sama.
   - **Pemeriksaan Login Pertama**: Wajib mengganti password baru pada login pertama via `/ganti-password`.
   - **Redirect Berhasil**: Menuju `/dashboard/wali-murid`.
3. **Login Guru & Staf (Role: `guru`, `admin`, `super_admin`)**:
   - **Identifier Input**: Email atau Username resmi sekolah.
   - **Password**: Password resmi masing-masing.
   - **Redirect Sesuai Role**:
     - `super_admin` $\rightarrow$ `/dashboard/super-admin`
     - `admin` $\rightarrow$ `/dashboard/admin`
     - `guru` $\rightarrow$ `/dashboard/guru`

---

## 2. Strategi Backend: Pola Sintetis Email Internal

Supabase Auth secara bawaan menggunakan provider Email/Password. Untuk mendukung login menggunakan NIS (murid) dan Nomor WhatsApp (wali murid) tanpa memerlukan SMS Gateway berbayar, sistem backend menggunakan pola **Email Sintetis Internal**:

- **Akun Murid**: Dibuatkan akun Supabase Auth dengan email format:
  `${nis}@siswa.sditfajar.sch.id`
- **Akun Wali Murid**: Dibuatkan akun Supabase Auth dengan email format:
  `${nomor_wa}@wali.sditfajar.sch.id`

> [!NOTE]
> **Transparansi Pengguna**: Di antarmuka form `/login`, murid cukup mengetik **NIS** dan wali murid cukup mengetik **Nomor WhatsApp**. Server Action `loginAction` akan secara otomatis memetakan identifier tersebut ke format email sintetis sebelum memanggil `supabase.auth.signInWithPassword()`.

---

## 3. Proteksi Rute (Middleware & Server Guard)

1. **Rute Publik (Bebas Diakses Guest Tanpa Login)**:
   - `/`, `/profil`, `/profil/sejarah`, `/profil/manajemen`, `/kurikulum`, `/ekstrakurikuler`, `/berita`, `/berita/[slug]`, `/kontak`, `/pendaftaran`, `/marketplace`.
2. **Rute Khusus Tamu (Guest Only)**:
   - `/login`. Jika pengguna yang sudah memiliki sesi aktif membuka rute ini, middleware otomatis mengarahkannya ke dashboard perannya masing-masing.
3. **Rute Terproteksi (`/dashboard/*` & `/ganti-password`)**:
   - Jika belum login $\rightarrow$ Redirect ke `/login`.
   - Jika akun `is_active === false` $\rightarrow$ Redirect ke `/login?pesan=akun_dinonaktifkan`.
   - Jika pengguna memiliki `must_change_password === true` dan mencoba membuka rute dashboard $\rightarrow$ Paksa redirect ke `/ganti-password`.
   - Jika role tidak cocok dengan rute $\rightarrow$ Tampilkan error `403 Tidak punya akses` atau redirect ke dashboard yang sesuai.

---

## 4. Helper Penjagaan Hak Akses di Server (`@/lib/supabase/auth-guard.ts`)

Selalu gunakan helper server-side untuk memastikan otorisasi aman:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppRole } from '@/types/auth.types';

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, role, is_active, must_change_password')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    redirect('/login?pesan=akun_dinonaktifkan');
  }

  if (profile.must_change_password) {
    redirect('/ganti-password');
  }

  return { user, profile };
}

export async function requireRole(allowedRoles: AppRole[]) {
  const { user, profile } = await requireUser();

  if (!allowedRoles.includes(profile.role as AppRole)) {
    redirect('/unauthorized');
  }

  return { user, profile };
}
```
