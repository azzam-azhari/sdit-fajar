# Notifikasi & Pengumuman

## Tujuan
Memberi informasi penting kepada user dan menyediakan chat real-time internal yang terpisah dari pengumuman.

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

Super admin dapat memilih target semua user atau satu role tertentu. Target harus disimpan eksplisit dan tidak boleh bergantung pada filter frontend.

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
- payment berhasil/gagal;
- pesan chat baru pada thread yang diikuti.

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

## Chat Real-time
- Chat berada di route `/dashboard/chat` dan hanya untuk user login.
- Thread, anggota, dan pesan memiliki tabel serta RLS sendiri.
- Supabase Realtime hanya mengirim event dari thread yang user boleh baca.
- Chat tidak menggantikan pengumuman resmi dan tidak boleh dipakai untuk mengubah nilai/payment.

## Larangan
- Jangan membuat push notification browser sebelum diminta.
- Jangan membuat WhatsApp broadcast otomatis tanpa izin eksplisit.
