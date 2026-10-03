# Design System & UI Guidelines — SDIT Fajar

## 1. Filosofi Desain: Minimalist Craft & Design Engineering
Desain antarmuka SDIT Fajar mengadopsi pendekatan **Minimalist Craft & Design Engineering** yang terinspirasi dari arsitektur visual **[jakub.kr](https://jakub.kr/)**.

### Prinsip Utama:
- **Zero Claymorphism & Zero Heavy Bento Clutter**: Dilarang menggunakan elemen 3D gelembung clay, bayangan tebal bengkak, atau bento-grid berlebihan yang mengorbankan kerapian data.
- **Precision & Craftsmanship**: Garis tepi presisi tipis (*subtle crisp micro-borders*), jarak dan *whitespace* yang terukur, serta hirarki visual yang matang.
- **Data-First & High Legibility**: Karena platform ini mengelola data akademik, nilai, dan tagihan keuangan, kejelasan pembacaan (*legibility*) adalah prioritas mutlak.
- **Editorial & Modern**: Tipografi rapi dipadukan dengan aksen monospaced untuk kode/angka dan aksen serif italic halus untuk penekanan teks penting.

---

## 2. Komponen & Library UI Resmi
- **Foundation Primitives:** Shadcn UI (terbangun di atas Radix UI).
- **CSS Framework:** Tailwind CSS 4.
- **Icon Ecosystem:**
  - **Lucide React (`lucide-react`)**: Digunakan untuk ikon utilitas sistem (aksi tabel, tombol navigasi, status).
  - **Hugeicons React (`@hugeicons/react`)**: Digunakan untuk navigasi menu utama, kartu fitur, dan aksen visual tematik.
- **Theme Support:** Mode Terang (*Light*) & Gelap (*Dark*) didukung penuh via `next-themes`.

---

## 3. Palet Warna (Color Tokens)
Menggunakan palet netral monokromatik presisi dengan sentuhan aksen biru profesional:

### Light Mode:
- **Background Utama:** `#FCFCFC` / `#FFFFFF` (bersih, tidak kekuningan)
- **Surface / Card Background:** `#F8FAFC` atau `#FFFFFF` dengan `border border-border/80`
- **Text Primary (Foreground):** `#09090B` / `#18181B` (kontras tajam)
- **Text Secondary / Muted:** `#71717A` / `#64748B`
- **Border / Divider:** `#E4E4E7` / `#E2E8F0` (garis 1px tajam)
- **Brand / Primary Accent:** Deep Blue `#2563EB` / `#1D4ED8` (digunakan secara bijak sebagai titik fokus, tombol aksi utama, dan active state)

### Dark Mode:
- **Background Utama:** `#09090B` / `#101010` (deep charcoal, bukan hitam legam 100%)
- **Surface / Card Background:** `#18181B` / `#141416` dengan `border border-border/60`
- **Text Primary:** `#F4F4F5` / `#FAFAFA`
- **Text Secondary / Muted:** `#A1A1AA`
- **Border / Divider:** `#27272A` / `#334155`

---

## 4. Tipografi (Typography)
- **Font Utama (Sans):** Inter Variable atau Plus Jakarta Sans (`font-sans`).
- **Font Angka / Data / Kode:** Monospaced (`font-mono`, misal JetBrains Mono atau Berkeley Mono) untuk NIS, nominal Rupiah, nomor invoice, dan kode registrasi.
- **Hirarki Tipografi:**
  - H1: `text-2xl font-semibold tracking-tight text-foreground`
  - H2: `text-xl font-medium tracking-tight text-foreground`
  - H3: `text-base font-medium text-foreground`
  - Body: `text-sm leading-relaxed text-muted-foreground`
  - Caption/Badge: `text-xs font-mono font-medium tracking-wide`

---

## 5. Standar UI Tabel: Zebra Cross (Wajib)
Semua tabel data (daftar siswa, nilai, absensi, pembayaran SPP) **wajib menggunakan gaya Zebra Cross** (belang-selang) untuk memudahkan mata pengguna melacak baris horizontal:

### Spesifikasi Tabel Zebra:
```tsx
// Contoh Pola Tabel Zebra Cross di SDIT Fajar
<div className="w-full overflow-x-auto rounded-lg border border-border">
  <table className="w-full text-left text-sm">
    <thead className="border-b border-border bg-muted/60 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <tr>
        <th className="px-4 py-3">NIS</th>
        <th className="px-4 py-3">Nama Siswa</th>
        <th className="px-4 py-3">Kelas</th>
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3 text-right">Aksi</th>
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
          <td className="px-4 py-2.5 font-mono text-xs font-medium">{item.nis}</td>
          <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
          <td className="px-4 py-2.5 text-muted-foreground">{item.class}</td>
          <td className="px-4 py-2.5"><Badge>{item.status}</Badge></td>
          <td className="px-4 py-2.5 text-right"><ActionButtons /></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 6. Pola Kartu & Komponen (Card & Containers)
- **Struktur Kartu:** `rounded-xl border border-border/80 bg-card p-5 transition-all duration-200`
- **Hover Micro-Interaction:** 
  - Tidak ada lonjakan bayangan 3D tebal.
  - Gunakan `hover:border-foreground/20` atau `hover:shadow-sm` yang sangat halus.
  - Jika kartu interaktif/bisa diklik, ikon panah (chevron) bergeser halus: `group-hover:translate-x-0.5 transition-transform duration-200`.

---

## 7. Form, Input & Tombol
- **Input Fields:**
  - `rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`
  - Focus state: `focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none`
- **Buttons (Shadcn Variants):**
  - **Default/Primary:** `bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-medium`
  - **Outline:** `border border-border bg-background hover:bg-muted hover:text-foreground`
  - **Ghost:** `hover:bg-muted hover:text-foreground`
  - **Ukuran:** Ringkas & presisi (`h-9 px-4 text-xs font-medium`).

---

## 8. Aturan Bahasa Antarmuka
- Seluruh antarmuka publik dan dashboard menggunakan **Bahasa Indonesia** yang formal, baku, dan ramah lingkungan pendidikan Islam terpadu (contoh: *Beranda*, *Tagihan SPP*, *Halaqah Tahfidz*, *Buku Nilai*, *Keluar*).
