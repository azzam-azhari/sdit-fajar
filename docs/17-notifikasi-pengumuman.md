# Notifikasi & Pengumuman

## Tujuan
Memberi informasi penting kepada user tanpa membuat fitur chat kompleks.

## Pengumuman
Pengumuman adalah konten resmi dari sekolah/guru/wali kelas.

Target pengumuman:
- semua user;
- role tertentu;
- kelas tertentu;
- siswa tertentu.

## Role Pembuat
- `super_admin`: semua target.
- `admin_sekolah`: semua target.
- `kepala_sekolah`: semua target atau role tertentu.
- `guru`: kelas/mapel yang diajar.
- `wali_kelas`: kelas binaan.

## Field Pengumuman
- title;
- content;
- target_type;
- target_role;
- classroom_id;
- student_id;
- created_by;
- status;
- published_at.

## Notifikasi MVP
Notifikasi bisa dibuat sederhana dari event berikut:
- tugas baru dipublish;
- materi baru dipublish;
- nilai sudah diberikan;
- pengumuman baru;
- invoice payment dibuat jika payment aktif nanti.

## Tabel Opsional `notifications`

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | target profile |
| `title` | text |  |
| `message` | text |  |
| `type` | text | assignment/material/grade/announcement/payment |
| `entity_type` | text | nullable |
| `entity_id` | uuid | nullable |
| `is_read` | boolean | default false |
| `created_at` | timestamptz |  |

## Prinsip Notifikasi
- Notifikasi bukan pengganti query utama.
- Jika notifikasi hilang, data utama tetap harus bisa dibuka dari menu.
- Jangan gunakan notifikasi untuk data sensitif yang panjang.
- Untuk MVP, boleh mulai dari pengumuman saja.

## UI Notifikasi
- Badge jumlah belum dibaca.
- Dropdown notifikasi di topbar.
- Halaman semua notifikasi opsional.
- Empty state: “Belum ada notifikasi.”

## Larangan
- Jangan membuat chat real-time saat ini.
- Jangan membuat push notification browser sebelum diminta.
- Jangan membuat WhatsApp broadcast otomatis tanpa izin eksplisit.
