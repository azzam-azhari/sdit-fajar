# Panduan Keahlian & Buku Pedoman Eksekusi Agen — SDIT Fajar

Dokumen ini adalah katalog keahlian resmi (*Skills Registry & Playbook*) bagi AI Coding Assistant (Antigravity, Cursor, Windsurf, Claude Code) saat merancang, menulis, dan memelihara kode di repositori SDIT Fajar. Dokumen ini menjadi pedoman operasional praktis yang diselaraskan secara penuh dengan seluruh dokumen perancangan di folder `docs/` dan aturan konstitusi di `.agents/rules/`.

---

## 1. Aturan Mutlak Batasan Fitur (Strict Out-of-Scope)

> [!CAUTION]
> **TIDAK ADA TINDAKAN UNTUK FITUR PEMBAYARAN DAN FITUR CHAT**:
> 1. **Fitur Chat Internal Ditiadakan**: Dilarang keras membuat tabel, komponen, atau rute pesan instan/obrolan real-time. Komunikasi sekolah dilakukan melalui pengumuman terstruktur (*announcements*).
> 2. **Fitur Pembayaran Tidak Ada Tindakan**: Tidak ada pengerjaan integrasi payment gateway Midtrans, pembuatan alur transaksi pembayaran SPP, tombol bayar, atau pemanggilan Snap modal. Seluruh tindakan yang berkaitan dengan eksekusi pembayaran ditiadakan dari lingkup pengerjaan agen saat ini.

---

## 2. Ringkasan 10 Keahlian Utama Agen

| No | Nama Keahlian | Pemicu Penggunaan | Luaran yang Dihasilkan |
|---|---|---|---|
| **1** | **Desain Antarmuka Minimalis & Rekayasa Tabel Zebra Cross** | Pembuatan halaman publik, dashboard, tabel data, form, modal | Komponen UI berbasis Shadcn & Tailwind CSS 4 dengan baris selang-seling presisi |
| **2** | **Autentikasi Supabase SSR & Penjagaan Hak Akses Peran** | Login NIS murid, login WhatsApp wali, middleware guard, role redirect | Sesi SSR aman, helper proteksi server, dan pemaksaan ganti password perdana |
| **3** | **Skema Basis Data PostgreSQL & Penerapan Kebijakan RLS** | Pembuatan tabel, penambahan kolom, perumusan Row Level Security | File migrasi DDL terurut, isolasi data 100% RLS aktif, dan pencatatan audit log |
| **4** | **Mutasi Data Server Actions & Validasi Skema Zod** | Pengiriman form, pembuatan data baru, update status, penghapusan | Fungsi Server Action bertipe ketat (`ActionResult<T>`) dengan pesan error Bahasa Indonesia |
| **5** | **Pengelolaan PPDB Bergelombang & Alur Verifikasi Calon Siswa** | Formulir pendaftaran publik, seleksi berkas admin, promosi murid | Alur tabel perantara (*staging*) `registrations` menjadi siswa aktif `students` |
| **6** | **Sistem Akademik LMS & Aturan Presensi Jam Server** | Pembagian materi, penugasan, penilaian murid, presensi guru & siswa | Siklus pembelajaran digital end-to-end dengan validasi waktu server (Senin–Jumat) |
| **7** | **Pencatatan Mutabaah Tahfidz & Tahsin Al-Qur'an** | Setoran hafalan harian oleh guru, rekap capaian juz murid | Formulir mutabaah dengan predikat kelancaran dan tabel rekapitulasi capaian hafalan |
| **8** | **Pengelolaan Berkas Privat Supabase Storage & Tautan Aman** | Unggah dokumen berkas pendaftaran, modul materi, tugas, cover | Berkas tersimpan di bucket privat dengan signed URL berumur pendek dan tautan DB |
| **9** | **Pengumuman Terstruktur & Manajemen Konten Informasi Sekolah** | Berita publik, profil sekolah, siaran informasi per peran | Konten terpublikasi tepat sasaran berdasarkan peran atau rombongan kelas |
| **10** | **Standar Kualitas Kode, Pemeriksaan Tipe Data & Uji Keamanan** | Sebelum komit kode, verifikasi integritas, pengujian celah data | Kode lolos `npm run typecheck` tanpa tipe `any`, lulus linter, dan teruji RLS negatif |

---

## 3. Rincian Pedoman Eksekusi per Keahlian

---

### Keahlian 1: Desain Antarmuka Minimalis & Rekayasa Tabel Zebra Cross
**Tujuan**: Menghasilkan tampilan antarmuka yang bersih, elegan, dan fungsional sesuai filosofi **Minimalist Craft & Design Engineering** ([jakub.kr](https://jakub.kr/)).

#### Pedoman Teknis:
1. **Aturan Visual**:
   - Gunakan garis batas tipis tajam (*micro-borders* 1px): `border border-border/80`.
   - Gunakan transisi halus 200ms: `transition-all duration-200`.
   - ❌ **Dilarang keras efek Claymorphism** (elemen 3D cembung, bayangan bengkak).
   - ❌ **Dilarang keras Bento Grid berat** yang membuang ruang layar tanpa nilai data.
2. **Kewajiban Format Tabel Zebra Cross**:
   - Seluruh tabel data wajib menggunakan gaya belang-selang: baris genap menggunakan `bg-background` dan baris ganjil menggunakan `bg-muted/25 dark:bg-muted/15`.
   - Seluruh data angka, NIS, tanggal, dan kode wajib menggunakan kelas `font-mono text-xs`.
3. **Komponen Reusable Wajib**:
   - Gunakan `ZebraDataTable` (`@/components/common/zebra-data-table`).
   - Sediakan 4 status visual wajib: **Loading** (`Skeleton`), **Empty State** (`EmptyState`), **Error Message**, dan **Toast Feedback** (`sonner`).

#### Contoh Kode Standar:
```tsx
// src/components/common/zebra-data-table.tsx
import { cn } from '@/lib/utils';

interface KolomTabel<T> {
  kunci: keyof T | string;
  judul: string;
  perataan?: 'kiri' | 'tengah' | 'kanan';
  render?: (baris: T, indeks: number) => React.ReactNode;
}

interface ZebraDataTableProps<T> {
  data: T[];
  kolom: KolomTabel<T>[];
  pesanKosong?: string;
}

export function ZebraDataTable<T extends { id: string | number }>({
  data,
  kolom,
  pesanKosong = 'Belum ada data yang tersedia.',
}: ZebraDataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-lg border border-border/80 bg-card p-4 text-sm text-muted-foreground">
        {pesanKosong}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border/80 bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border/80 bg-muted/60 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <tr>
            {kolom.map((item, idx) => (
              <th key={idx} className="px-4 py-3">
                {item.judul}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {data.map((baris, indeks) => (
            <tr
              key={baris.id}
              className={cn(
                'transition-colors hover:bg-muted/50',
                indeks % 2 === 0 ? 'bg-background' : 'bg-muted/25 dark:bg-muted/15'
              )}
            >
              {kolom.map((item, colIdx) => (
                <td key={colIdx} className="px-4 py-2.5 text-foreground">
                  {item.render ? item.render(baris, indeks) : String(baris[item.kunci as keyof T] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Keahlian 2: Autentikasi Supabase SSR & Penjagaan Hak Akses Peran
**Tujuan**: Mengelola login terpusat, pengalihan peran secara aman, dan isolasi sesi internal.

#### Pedoman Teknis:
1. **Mekanisme Kredensial**:
   - **Murid**: Login menggunakan **NIS** (`login_identifier`) dan password awal format biodata `tempatddmmyyyy` (contoh: `jakarta15082015`).
   - **Wali Murid**: Login menggunakan Nomor WhatsApp/HP yang didaftarkan.
   - **Guru & Staf**: Login menggunakan Email atau Username resmi.
2. **Kewajiban Pergantian Password**:
   - Pengguna dengan kolom `must_change_password === true` wajib diarahkan otomatis ke halaman `/ganti-password` dan diblokir dari membuka halaman dashboard lain sebelum mengubah password.
3. **Pemisahan Klien Supabase**:
   - `client.ts`: Digunakan di Client Component menggunakan kunci anonim (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - `server.ts`: Digunakan di Server Component & Server Action dengan pengelolaan cookie sesi.
   - `admin.ts`: Menggunakan `SUPABASE_SERVICE_ROLE_KEY` khusus server untuk administrasi pengguna (dilarang bocor ke browser).

#### Contoh Helper Penjagaan Hak Akses:
```typescript
// src/lib/supabase/auth-guard.ts
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppRole } from '@/types/auth.types';

export async function periksaPenggunaWajib() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('id, name, role, is_active, must_change_password')
    .eq('id', user.id)
    .single();

  if (!profil || !profil.is_active) {
    redirect('/login?pesan=akun_dinonaktifkan');
  }

  if (profil.must_change_password) {
    redirect('/ganti-password');
  }

  return { user, profil };
}

export async function periksaPeranWajib(peranDiizinkan: AppRole[]) {
  const { user, profil } = await periksaPenggunaWajib();

  if (!peranDiizinkan.includes(profil.role as AppRole)) {
    redirect('/unauthorized');
  }

  return { user, profil };
}
```

---

### Keahlian 3: Skema Basis Data PostgreSQL & Kebijakan Keamanan RLS
**Tujuan**: Memastikan integritas data dan menegakkan kebijakan PostgreSQL Row Level Security (RLS) 100% pada seluruh tabel internal.

#### Pedoman Teknis:
1. **5 Peran Resmi Database (`app_role`)**:
   - `super_admin`, `admin`, `guru`, `murid`, `wali_murid`.
   - Dilarang membuat nilai peran baru.
2. **7 Jabatan Guru Resmi (`positions`)**:
   - `kepala_sekolah`, `wakil_kepala`, `bendahara`, `wali_kelas`, `koordinator_tahfidz`, `pustakawan`, `operator`.
   - Jabatan adalah data baris di tabel `positions` dengan relasi pivot `teacher_positions`, bukan peran database baru.
3. **Penegakan RLS**:
   - Setiap tabel baru wajib menyertakan perintah: `alter table [nama_tabel] enable row level security;`.
   - Gunakan fungsi keamanan bawaan PostgreSQL: `auth.uid()`.
   - Batasi data murid hanya untuk murid terkait dan wali murid yang terhubung di tabel `parent_students`.

#### Contoh Skema & Kebijakan RLS:
```sql
-- Mengaktifkan RLS pada tabel mutabaah tahfidz
alter table public.tahfidz_records enable row level security;

-- Kebijakan: Guru tahfidz dapat menginput mutabaah
create policy "Guru dapat menambah setoran tahfidz"
  on public.tahfidz_records
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('guru', 'super_admin', 'admin')
    )
  );

-- Kebijakan: Murid dan wali murid hanya bisa membaca setoran milik anaknya
create policy "Murid dan wali dapat melihat riwayat setoran tahfidz terkait"
  on public.tahfidz_records
  for select
  to authenticated
  using (
    student_id in (
      -- Jika user adalah murid itu sendiri
      select students.id from public.students where students.profile_id = auth.uid()
      union
      -- Jika user adalah wali murid dari murid tersebut
      select parent_students.student_id from public.parent_students
      join public.parents on parents.id = parent_students.parent_id
      where parents.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('guru', 'admin', 'super_admin')
    )
  );
```

---

### Keahlian 4: Mutasi Data Server Actions & Validasi Skema Zod
**Tujuan**: Menjalankan operasi penambahan, perubahan, dan penghapusan data secara aman melalui Next.js Server Actions dengan penanganan tipe data yang ketat.

#### Pedoman Teknis:
1. **Format Standar Hasil Mutasi (`ActionResult<T>`)**:
   - Seluruh Server Action wajib mengembalikan objek terstandar dengan properti `success`, `data`, `error`, dan `code`.
2. **Validasi Ganda**:
   - Validasi payload input menggunakan skema Zod (`safeParse`).
   - Tampilkan pesan error berbahasa Indonesia yang sopan dan jelas.
3. **Penyegaran Cache**:
   - Panggil `revalidatePath(...)` setelah operasi mutasi berhasil dilakukan.
4. **Pencegahan Tipe Sembrono**:
   - ❌ **Dilarang keras menggunakan tipe `any`**. Turunkan tipe input langsung dari skema menggunakan `z.infer`.

#### Contoh Template Server Action:
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ActionResult } from '@/types/action.types';

// 1. Skema Validasi Zod
export const skemaSetoranTahfidz = z.object({
  idSiswa: z.string().uuid('ID siswa tidak valid'),
  nomorSurah: z.number().int().min(1, 'Nomor surah minimal 1').max(114, 'Nomor surah maksimal 114'),
  ayatMulai: z.number().int().min(1, 'Ayat mulai minimal 1'),
  ayatSelesai: z.number().int().min(1, 'Ayat selesai minimal 1'),
  predikat: z.enum(['mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul'], {
    errorMap: () => ({ message: 'Predikat kelancaran wajib dipilih' }),
  }),
  catatan: z.string().optional(),
});

export type InputSetoranTahfidz = z.infer<typeof skemaSetoranTahfidz>;

// 2. Fungsi Server Action
export async function simpanSetoranTahfidzAction(
  input: InputSetoranTahfidz
): Promise<ActionResult<{ id: string }>> {
  // Verifikasi Autentikasi Sesi
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Silakan login terlebih dahulu.', code: 'UNAUTHORIZED' };
  }

  // Validasi Input
  const hasilValidasi = skemaSetoranTahfidz.safeParse(input);
  if (!hasilValidasi.success) {
    return {
      success: false,
      error: 'Data yang dikirim tidak valid.',
      fieldErrors: hasilValidasi.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  // Eksekusi Simpan Data ke Supabase
  const { data, error } = await supabase
    .from('tahfidz_records')
    .insert({
      student_id: hasilValidasi.data.idSiswa,
      teacher_id: user.id,
      surah_number: hasilValidasi.data.nomorSurah,
      ayat_start: hasilValidasi.data.ayatMulai,
      ayat_end: hasilValidasi.data.ayatSelesai,
      predicate: hasilValidasi.data.predikat,
      notes: hasilValidasi.data.catatan,
      date: new Date().toISOString().split('T')[0],
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: 'Gagal menyimpan data setoran: ' + error.message, code: 'SERVER_ERROR' };
  }

  revalidatePath('/dashboard/guru/tahfidz');
  return { success: true, data: { id: data.id }, message: 'Setoran tahfidz berhasil disimpan.' };
}
```

---

### Keahlian 5: Pengelolaan PPDB Bergelombang & Alur Verifikasi Calon Siswa
**Tujuan**: Mengatur pendaftaran murid baru melalui tabel perantara (*staging*), sistem kuota multi-gelombang, seleksi berkas, hingga pembuatan akun otomatis.

#### Pedoman Alur Bisnis PPDB:
1. **Tabel Perantara (`registrations`)**:
   - Formulir publik mengisi data ke tabel `registrations`.
   - Calon murid dan orang tua di tabel ini **TIDAK langsung dibuatkan akun auth**.
2. **Sistem Gelombang (Gelombang 1, 2, 3)**:
   - Kuota default: 100 murid per tahun ajaran.
   - Perhitungan kuota tersisa dan jumlah pendaftar dihitung secara dinamis.
3. **Verifikasi & Promosi Murid**:
   - Admin memeriksa kelengkapan berkas fisik/unggah (akta, kartu keluarga, pas foto).
   - Mengubah status pendaftaran: `submitted` -> `under_review` -> `approved` / `rejected`.
   - Saat status berubah menjadi `approved`:
     1. Data disalin ke tabel `students`.
     2. Dibuatkan akun login murid dengan identitas NIS dan password tanggal lahir.
     3. Dibuatkan akun wali murid dan dihubungkan pada tabel `parent_students`.

---

### Keahlian 6: Sistem Akademik LMS & Aturan Presensi Jam Server
**Tujuan**: Menjalankan operasional harian sekolah meliputi pembagian materi ajar, penugasan tugas murid, serta presensi kehadiran yang divalidasi oleh waktu server.

#### Pedoman Presensi & Waktu Server:
1. **Presensi Guru**:
   - Sesi Masuk: Pukul 06.30 – 07.30 WIB (Senin – Jumat).
   - Sesi Pulang: Mulai pukul 14.30 WIB ke atas (Senin – Jumat).
   - Presensi akhir pekan (Sabtu & Minggu) tertutup secara default, dan hanya dapat dibuka jika guru berjabatan `kepala_sekolah` mengaktifkan opsi akhir pekan.
2. **Presensi Siswa**:
   - Dicatat per sesi mata pelajaran oleh guru pengampu atau wali kelas.
   - **Aturan Tegas**: Presensi siswa pada hari Sabtu dan Minggu **ditolak secara mutlak di tingkat server** (bukan sekadar menonaktifkan tombol di antarmuka).

#### Contoh Logika Server Presensi Siswa:
```typescript
// src/actions/attendance.actions.ts
'use server';

export async function catatPresensiSiswaAction(input: InputPresensiSiswa) {
  const waktuServer = new Date();
  const hariKe = waktuServer.getDay(); // 0 = Minggu, 6 = Sabtu

  // Tolak presensi siswa pada akhir pekan
  if (hariKe === 0 || hariKe === 6) {
    return {
      success: false,
      error: 'Presensi siswa tidak diizinkan pada hari Sabtu dan Minggu.',
      code: 'FORBIDDEN',
    };
  }

  // Lanjutkan penyimpanan presensi ke tabel student_attendances...
}
```

---

### Keahlian 7: Pencatatan Mutabaah Tahfidz & Tahsin Al-Qur'an
**Tujuan**: Mengelola buku catatan mutabaah hafalan Qur'an harian dan pemantauan capaian juz murid.

#### Komponen Penilaian Hafalan:
- **Identitas Setoran**: Nomor Surah (1–114), Ayat Mulai, Ayat Selesai, dan Tanggal Setoran.
- **Predikat Kelancaran**:
  - `mumtaz`: Sangat Lancar / Sempurna.
  - `jayyid_jiddan`: Baik Sekali.
  - `jayyid`: Cukup Baik.
  - `maqbul`: Cukup / Perlu Mengulang.
- **Pelaporan**: Rekapitulasi disajikan menggunakan tabel Zebra Cross dengan filter nama murid dan tingkatan kelas.

---

### Keahlian 8: Pengelolaan Berkas Privat Supabase Storage & Tautan Aman
**Tujuan**: Menyimpan berkas digital sekolah secara terisolasi tanpa risiko akses publik yang tidak sah.

#### Pedoman Storage:
1. **4 Bucket Resmi Privat**:
   - `images`: Foto profil, foto kegiatan berita, cover modul.
   - `lms-files`: Modul materi pembelajaran dan berkas tugas murid.
   - `registration-files`: Berkas kartu keluarga, akta kelahiran pendaftar PPDB.
   - `marketplace-files`: Berkas buku panduan atau modul digital sekolah.
2. **Aturan Akses**:
   - Seluruh bucket berstatus **Private**.
   - Akses pembacaan berkas wajib menggunakan **Signed URL** berumur pendek (misal kedaluwarsa dalam 60 detik) setelah hak akses peran terverifikasi.
3. **Integritas Basis Data**:
   - Setiap berkas yang berhasil diunggah wajib mencatatkan jalur penyimpanan (`storage_path` atau URL) ke kolom tabel yang bersangkutan. Dilarang meninggalkan berkas tanpa relasi di database (*orphan file*).

---

### Keahlian 9: Pengumuman Terstruktur & Manajemen Konten Informasi Sekolah
**Tujuan**: Menyebarkan informasi resmi secara terkontrol tanpa menggunakan fitur percakapan langsung.

#### Pedoman Komunikasi:
1. **Hirarki Sasaran Pengumuman**:
   - `super_admin`: Dapat menargetkan ke seluruh sekolah (`all`), peran tertentu (`role`), atau rombel kelas.
   - `kepala_sekolah`: Dapat menargetkan seluruh civitas akademika atau guru.
   - `wali_kelas`: Hanya dapat menargetkan rombel kelas binaannya.
2. **Pengelolaan Konten Publik**:
   - Admin sekolah mengelola berita kegiatan, artikel kurikulum, dan agenda sekolah.
   - Identitas pokok sekolah (`school_settings`), kontak telepon, dan alamat yayasan hanya dapat diubah oleh peran `super_admin`.

---

### Keahlian 10: Standar Kualitas Kode, Pemeriksaan Tipe Data & Uji Keamanan
**Tujuan**: Memastikan kode yang dihasilkan bersih, tidak memiliki regresi (*bug free*), dan lulus kriteria penerimaan proyek.

#### Prosedur Verifikasi Sebelum Menyelesaikan Tugas:
1. **Pemeriksaan Kompilasi TypeScript**:
   - Jalankan `npm run typecheck` (atau `npx tsc --noEmit`).
   - Pastikan **nol error** dan tidak ada tipe data `any`.
2. **Pemeriksaan Format Linter**:
   - Jalankan `npm run lint` untuk memastikan tidak ada import mati atau pelanggaran sintaksis.
3. **Uji Negatif Hak Akses**:
   - Pastikan murid A tidak bisa membaca tugas/nilai murid B.
   - Pastikan wali murid A tidak bisa melihat data anak dari wali murid B.
   - Pastikan rute internal `/dashboard/*` langsung mengarahkan tamu tak dikenal ke `/login`.
4. **Pemeriksaan Bahasa Antarmuka**:
   - Pastikan seluruh teks antarmuka, tombol, judul modal, dan pesan toast menggunakan **Bahasa Indonesia** yang santun dan baku.

---

## 4. Matriks Hubungan Keahlian dan Peran Pengguna

| Peran Pengguna (`app_role`) | Akses Halaman Utama | Keahlian Agen yang Dominan Digunakan |
|---|---|---|
| **Tamu (*Guest*)** | `/`, `/profil`, `/berita`, `/kurikulum`, `/pendaftaran`, `/kontak` | Keahlian 1 (UI Minimalis), Keahlian 5 (PPDB Staging) |
| **`super_admin`** | `/dashboard/super-admin/*` | Keahlian 2 (Auth), Keahlian 3 (RLS & Audit), Keahlian 9 (Pengumuman & Pengaturan) |
| **`admin`** | `/dashboard/admin/*` | Keahlian 3 (Data Master), Keahlian 5 (Verifikasi PPDB), Keahlian 9 (Konten) |
| **`guru`** | `/dashboard/guru/*` | Keahlian 6 (LMS & Presensi), Keahlian 7 (Tahfidz), Keahlian 8 (Storage Berkas) |
| **`murid`** | `/dashboard/murid/*` | Keahlian 1 (Zebra Table), Keahlian 6 (Tugas & Nilai), Keahlian 7 (Riwayat Hafalan) |
| **`wali_murid`** | `/dashboard/wali-murid/*` | Keahlian 1 (Selector Anak), Keahlian 6 (Pantau Nilai/Absensi), Keahlian 7 (Pantau Hafalan) |

---

## 5. Protokol Anti-Halusinasi Agen

Jika saat pengerjaan kode ditemukan situasi yang belum tercantum pada spesifikasi:
1. **Dilarang Berasumsi**: Jangan menambahkan peran baru, jangan membuat tabel baru tanpa dicatat di dokumen perancangan, dan jangan membuat fitur yang telah dilarang.
2. **Konsultasikan ke `docs/`**: Periksa kembali `docs/PRD/` sebagai sumber kebenaran tunggal (*Single Source of Truth*).
3. **Tanyakan kepada Pengguna**: Jika ada logika bisnis yang ambigu, tanyakan langsung kepada pengguna atau buat catatan `TODO` eksplisit sebelum menulis implementasi coba-coba.
