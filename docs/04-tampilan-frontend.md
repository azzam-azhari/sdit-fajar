# Tampilan Frontend

## Tema Utama
Tema visual LMS SDIT Fajar menggunakan claymorphism dengan panduan bento grid dan primary biru cerah.

Karakter visual:
- lembut;
- modern;
- rounded besar;
- shadow halus;
- card terlihat seperti clay/soft 3D;
- layout berbasis grid modular;
- friendly untuk sekolah dasar;
- tetap profesional untuk admin dan guru.

## Palet Warna
Gunakan token warna agar konsisten.

| Token | Rekomendasi | Fungsi |
|---|---|---|
| `primary` | `#0EA5E9` | biru cerah utama |
| `primary-dark` | `#0284C7` | hover button |
| `primary-soft` | `#E0F2FE` | background card ringan |
| `secondary` | `#38BDF8` | aksen biru muda |
| `success` | `#22C55E` | sukses |
| `warning` | `#F59E0B` | peringatan |
| `danger` | `#EF4444` | error/destructive |
| `surface` | `#FFFFFF` | card utama |
| `surface-soft` | `#F8FAFC` | background dashboard |
| `text-main` | `#0F172A` | teks utama |
| `text-muted` | `#64748B` | teks sekunder |

## Claymorphism Style
Gunakan pola berikut untuk card utama:

```tsx
className="rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
```

Card interaktif:

```tsx
className="rounded-[1.75rem] border border-sky-100 bg-white/85 p-6 shadow-[0_18px_40px_rgba(14,165,233,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(14,165,233,0.18)]"
```

Button utama:

```tsx
className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)] transition hover:bg-sky-600"
```

## Bento Grid Guideline
Bento grid digunakan untuk dashboard dan landing page.

Aturan:
- Pakai grid 12 kolom di desktop.
- Pakai 2 kolom di tablet.
- Pakai 1 kolom di mobile.
- Card penting boleh span 2x ukuran card biasa.
- Hindari terlalu banyak card kecil di satu layar.

Contoh layout dashboard:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
  <section className="xl:col-span-8">...</section>
  <aside className="xl:col-span-4">...</aside>
  <section className="xl:col-span-3">...</section>
  <section className="xl:col-span-3">...</section>
  <section className="xl:col-span-6">...</section>
</div>
```

## Layout Dashboard
Dashboard wajib punya:
- sidebar collapsible;
- topbar dengan nama user, role, dan avatar;
- breadcrumb;
- card ringkasan;
- konten utama;
- responsive mobile menu.

## Layout Public Website
Website publik wajib punya:
- navbar responsive;
- menu desktop;
- menu mobile;
- dropdown profil;
- active link;
- efek blur/shadow saat scroll;
- tombol “Daftar” ke Google Form;
- footer lengkap;
- floating WhatsApp button.

## Komponen Visual Wajib
- Stat card.
- Bento card.
- Data table.
- Form card.
- Empty state.
- Error state.
- Loading skeleton.
- Badge status.
- Avatar user.
- File upload dropzone.
- Confirmation dialog.
- Toast notification.

## Bahasa UI
Gunakan Bahasa Indonesia yang sopan dan sederhana.

Contoh microcopy:
- “Belum ada tugas untuk saat ini.”
- “Tugas berhasil dikumpulkan.”
- “Nilai belum tersedia.”
- “Materi berhasil diterbitkan.”
- “Silakan hubungi admin sekolah jika data tidak sesuai.”

## Aksesibilitas
- Semua tombol harus punya label jelas.
- Gunakan kontras warna yang cukup.
- Form wajib memiliki label.
- Error form wajib muncul dekat field terkait.
- Jangan mengandalkan warna saja untuk menyampaikan status.

## Larangan UI
- Jangan memakai warna random di luar token.
- Jangan membuat desain terlalu gelap untuk halaman siswa SD.
- Jangan memakai animasi berlebihan.
- Jangan membuat halaman dashboard tanpa empty/loading/error state.
