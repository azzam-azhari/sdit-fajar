# Storage & Upload

## Provider Storage
Gunakan Supabase Storage.

## Bucket yang Disarankan

| Bucket | Akses | Fungsi |
|---|---|---|
| `images` | public atau signed | avatar, berita, galeri |
| `lms-files` | private disarankan | materi, tugas, submission |
| `payment-files` | private | bukti pembayaran manual jika nanti ada |

Jika ingin sederhana pada MVP, bucket `images` boleh tetap dipakai untuk gambar publik. Untuk file akademik, gunakan bucket private.

## Struktur Path

```text
images/
├── users/
├── berita/
├── gallery/
└── school/

lms-files/
├── materials/{classroomId}/{materialId}/
├── assignments/{assignmentId}/
└── submissions/{assignmentId}/{studentId}/
```

## Batas File

### Gambar
- Format: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Max size: 5 MB.

### Materi/Tugas
- Format: `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.jpg`, `.jpeg`, `.png`, `.webp`.
- Max size default: 10 MB.

### Submission Siswa
- Format: `.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`, `.webp`.
- Max size default: 10 MB.

## Larangan File
Tolak file:
- `.exe`
- `.sh`
- `.bat`
- `.cmd`
- `.js`
- `.php`
- `.html` jika tidak dibutuhkan
- file tanpa extension

## Alur Upload
1. User memilih file.
2. Client validasi extension dan ukuran.
3. Server Action validasi ulang.
4. Server membuat path aman.
5. File diupload ke Supabase Storage.
6. URL/path disimpan ke tabel domain.
7. Jika update file, file lama dihapus setelah file baru berhasil tersimpan.

## Metadata File
Untuk file penting, simpan metadata:
- original filename;
- storage path;
- mime type;
- size;
- uploaded by;
- uploaded at.

## Signed URL
Untuk file LMS private:
- siswa hanya bisa membuka file kelasnya;
- orang tua hanya file anaknya;
- guru hanya file kelas/mapel yang diajar;
- gunakan signed URL dengan masa berlaku terbatas.

## Error Message
- “Ukuran file terlalu besar.”
- “Format file tidak didukung.”
- “Gagal mengunggah file. Silakan coba lagi.”
- “File tidak ditemukan.”

## Checklist
- Bucket tersedia.
- Policy bucket sesuai.
- Server Action tidak expose service role ke client.
- File type divalidasi di client dan server.
- File lama dibersihkan saat update.
- File orphan dibersihkan berkala.
