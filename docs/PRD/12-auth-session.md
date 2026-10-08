# Auth & Session

## Provider Auth
Menggunakan Supabase Auth (SSR Client via `@supabase/ssr`).

## Kredensial Login Berdasarkan Role

### 1. Murid (`murid`)
- **Login Identifier**: NIS (Nomor Induk Siswa).
- **Password Awal**: `tempatddmmyyyy` yang di-generate dari data biodata kelahiran siswa.
  - Aturan normalisasi tempat lahir: **huruf kecil tanpa spasi dan karakter khusus** + 8 digit tanggal lahir (`DDMMYYYY`).
  - Contoh: Lahir di *"Jakarta Selatan, 30 Desember 2015"* $\rightarrow$ `jakartaselatan30122015`.
- **Status Ganti Password**: Kolom `must_change_password = true`.
- **Alur Login Perdana**: Begitu berhasil login pertama kali, sistem langsung mengarahkan murid ke halaman `/ganti-password` sebelum dapat mengakses dashboard `/dashboard/murid`.

### 2. Wali Murid (`wali_murid`)
- **Login Identifier**: **Nomor WhatsApp / HP aktif** wali murid (yang didaftarkan saat PPDB / di-import Super Admin).
- **Password Awal**: **Nomor WhatsApp / HP** yang sama.
- **Status Ganti Password**: Kolom `must_change_password = true`.
- **Alur Login Perdana**: Wajib mengganti password baru pada login pertama di halaman `/ganti-password`.

### 3. Tenaga Pendidik & Staf (`guru`, `admin`, `super_admin`)
- Menggunakan email resmi yang terdaftar dan password masing-masing.

---

## Alur Login & Redirect

1. User memasukkan identifier (NIS / No HP / Email) dan password di halaman `/login`.
2. Sistem mencari record `profiles` yang cocok dan melakukan autentikasi via Supabase Auth.
3. Sistem memeriksa `is_active`:
   - Jika `false`: Akses ditolak dengan pesan: *"Akun Anda tidak aktif. Hubungi admin sekolah."*
4. Sistem memeriksa `must_change_password`:
   - Jika `true`: Redirect ke halaman `/ganti-password`.
   - Jika `false`: Redirect ke dashboard sesuai role masing-masing.

## Mapping Redirect Role
```ts
export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  guru: '/dashboard/guru',
  murid: '/dashboard/murid',
  wali_murid: '/dashboard/wali-murid',
}
```

---

## Logout
- Logout menghapus session Supabase Auth (server & browser cookies).
- Redirect kembali ke `/login` atau `/`.

---

## Protected Route
Semua rute `/dashboard/*` dan `/ganti-password` wajib protected.

Jika user belum login:
- Redirect ke `/login`.

Jika user sudah login tetapi role tidak sesuai:
- Tampilkan halaman `403 Tidak punya akses` atau redirect ke dashboard role resminya.

## Guest Route
Rute `/login` adalah *guest only*.
Jika user yang sudah login membuka `/login`:
- Otomatis redirect ke dashboard sesuai rolenya masing-masing.

---

## Session Data Minimal
Session client tidak boleh menyimpan data sensitif.

Data yang boleh disimpan untuk UI:
- `user.id`;
- `name`;
- `email`;
- `role`;
- `avatar_url`.

**Dilarang Keras Disimpan di Client**:
- `SUPABASE_SERVICE_ROLE_KEY`;
- `MIDTRANS_SERVER_KEY`;
- Password plaintext / hash password.
- Flag `must_change_password` hanya digunakan sebagai pemicu redirect, bukan disimpan sembarangan di localStorage.

---

## Role Guard Helpers
Disediakan fungsi pembantu di `@/lib/supabase/`:

```ts
export async function requireUser() {}
export async function requireRole(roles: UserRole[]) {}
export async function getCurrentProfile() {}
```

---

## Middleware & Keamanan
Middleware Next.js (`src/middleware.ts`) bertugas:
- Melindungi rute dashboard dari pengunjung tanpa sesi (guest).
- Mengarahkan user yang sudah login saat membuka rute guest (`/login`).
- Tidak melakukan query database berat berulang kali di middleware; otorisasi granular tetap ditegakkan di Server Actions dan Row Level Security (RLS) PostgreSQL.

---

## Multi-Peran untuk Orang yang Sama
Database menganut prinsip **satu role per record `profiles`**. Jika seorang guru atau staf juga merupakan orang tua/wali murid di sekolah, Super Admin membuatkan akun `wali_murid` terpisah dengan relasi ke anak melalui tabel `parent_students`. Tidak ada role ganda atau manipulasi role pada satu akun.
