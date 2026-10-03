# Tampilan Frontend

## Tema Utama
Tema visual LMS SDIT Fajar mengadopsi pendekatan **Minimalist Craft & Design Engineering** yang terinspirasi dari **[jakub.kr](https://jakub.kr/)**.

Karakter visual:
- presisi dan bersih (*clean & crisp*);
- garis batas tipis halus (*subtle micro-borders*);
- kontras teks tajam untuk kenyamanan membaca data akademik;
- whitespace yang terukur dan proporsional;
- transisi mikro yang halus (*subtle micro-animations*);
- profesional, modern, dan rapi untuk sekolah dasar Islam terpadu;
- **dilarang keras menggunakan tema Claymorphism (elemen 3D gelembung) atau Bento Grid berat**.

## Palet Warna
Gunakan token warna agar konsisten (Slate/Zinc neutral base dengan deep blue accent).

| Token | Nilai Hex | Fungsi |
|---|---|---|
| `background` | `#FCFCFC` / `#09090B` | latar belakang halaman utama |
| `card` | `#FFFFFF` / `#141416` | latar surface komponen card |
| `border` | `#E4E4E7` / `#27272A` | garis batas presisi 1px |
| `primary` | `#2563EB` | biru netral tombol aksi utama |
| `primary-hover` | `#1D4ED8` | hover tombol utama |
| `text-foreground` | `#09090B` / `#FAFAFA` | teks utama kontras tinggi |
| `text-muted` | `#71717A` / `#A1A1AA` | teks sekunder/keterangan |
| `success` | `#16A34A` | indikator sukses |
| `warning` | `#D97706` | indikator perhatian |
| `danger` | `#DC2626` | aksi destruktif & error |

## Standar Card & Kontainer
Gunakan struktur kartu yang ramping dan berbatas tegas:

```tsx
// Card Standar
className="rounded-xl border border-border/80 bg-card p-5 transition-all duration-200"

// Card Interaktif / Dapat Diklik
className="group rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
```

## Standar Tombol (Button)
Gunakan tombol dengan tinggi presisi dan sudut yang teratur:

```tsx
// Button Primary
className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"

// Button Outline
className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-xs font-medium text-foreground transition hover:bg-muted"
```

## Standar Tabel Data: Zebra Cross (Wajib)
Seluruh tabel data wajib menggunakan format **Zebra Cross** (belang-selang) untuk memudahkan penelusuran baris horizontal:

```tsx
<div className="w-full overflow-x-auto rounded-lg border border-border">
  <table className="w-full text-left text-sm">
    <thead className="border-b border-border bg-muted/60 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <tr>
        <th className="px-4 py-3">NIS</th>
        <th className="px-4 py-3">Nama</th>
        <th className="px-4 py-3">Kelas</th>
        <th className="px-4 py-3">Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border/60">
      {data.map((item, index) => (
        <tr 
          key={item.id}
          className={cn(
            "transition-colors hover:bg-muted/50",
            index % 2 === 0 ? "bg-background" : "bg-muted/25 dark:bg-muted/15"
          )}
        >
          <td className="px-4 py-2.5 font-mono text-xs">{item.nis}</td>
          <td className="px-4 py-2.5 font-medium">{item.name}</td>
          <td className="px-4 py-2.5 text-muted-foreground">{item.class}</td>
          <td className="px-4 py-2.5"><Badge>{item.status}</Badge></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Layout Dashboard
Dashboard wajib punya:
- sidebar collapsible dengan navigasi bersih;
- topbar dengan nama user, role, avatar, dan breadcrumb;
- card ringkasan statistik (StatCard);
- konten utama dengan tabel data Zebra Cross;
- responsive mobile drawer menu.
- Semua halaman internal wajib meminta login; halaman publik tidak boleh memaksa login.

## Layout Public Website
Website publik wajib punya:
- navbar responsive dengan logo dan tautan navigasi;
- menu desktop dan drawer mobile;
- tombol “Pendaftaran PPDB”;
- footer lengkap dengan kontak dan peta sekolah;
- tautan marketplace perlengkapan sekolah;
- floating WhatsApp button.

## Komponen Visual Wajib
- Stat card presisi.
- Zebra cross data table.
- Form card dengan validasi Zod.
- Empty state minimalis.
- Error state & skeleton pulse.
- Badge status ringkas.
- Avatar user.
- File upload dropzone.
- CSV import dropzone dengan link download template resmi.
- Payment receipt preview dengan tombol buka tab baru/unduh.
- Toast notification Sonner.

## Bahasa UI
Gunakan Bahasa Indonesia yang sopan, baku, dan ramah lingkungan pendidikan Islam.

## Larangan UI
- ❌ Dilarang menggunakan tema Claymorphism atau bayangan 3D tebal.
- ❌ Dilarang menggunakan Bento Grid berat tanpa fungsi jelas.
- ❌ Dilarang membuat tabel data polos tanpa format Zebra Cross.
- ❌ Dilarang menampilkan tombol bayar kepada role selain `wali_murid`.
- ❌ Dilarang menampilkan komponen chat internal (fitur telah ditiadakan).
