# Auth & Session

## Provider Auth
Gunakan Supabase Auth.

## Login
- User login memakai email dan password.
- Setelah login, sistem mengambil data `profiles`.
- Redirect berdasarkan role database.

## Logout
- Logout menghapus session Supabase.
- Hapus cookie tambahan seperti `user_profile` jika ada.
- Redirect ke `/login` atau `/`.

## Protected Route
Semua route `/dashboard/*` wajib protected.

Jika user belum login:
- redirect ke `/login`.

Jika user sudah login tetapi role tidak sesuai:
- tampilkan halaman `403 Tidak punya akses` atau redirect ke dashboard role-nya.

## Guest Route
Route `/login` adalah guest only.

Jika user sudah login dan membuka `/login`:
- redirect ke dashboard sesuai role.

## Mapping Redirect Role
```ts
export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  super_admin: '/dashboard/super-admin',
  admin_sekolah: '/dashboard/admin',
  kepala_sekolah: '/dashboard/kepala-sekolah',
  guru: '/dashboard/guru',
  wali_kelas: '/dashboard/wali-kelas',
  siswa: '/dashboard/siswa',
  orang_tua: '/dashboard/orang-tua',
}
```

## Session Data Minimal
Session client tidak boleh menyimpan data sensitif.

Data yang boleh disimpan untuk UI:
- user id;
- name;
- email;
- role;
- avatar url.

Jangan simpan:
- service role key;
- Midtrans server key;
- password;
- token sensitif yang tidak perlu.

## Role Guard
Buat helper:

```ts
export async function requireUser() {}
export async function requireRole(roles: UserRole[]) {}
export async function getCurrentProfile() {}
```

## Middleware / Proxy
Middleware/proxy bertugas untuk:
- menjaga route dashboard dari guest;
- redirect user yang sudah login dari `/login`;
- tidak melakukan query kompleks berlebihan.

Untuk permission detail, tetap lakukan di server action dan RLS.

## Error Auth
Pesan error login:
- “Email atau password salah.”
- “Akun Anda tidak aktif. Hubungi admin sekolah.”
- “Profil user tidak ditemukan. Hubungi admin sekolah.”

## Akun Nonaktif
Jika `profiles.is_active = false`:
- user tidak boleh mengakses dashboard;
- tampilkan pesan hubungi admin;
- opsional force logout.
