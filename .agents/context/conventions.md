# UI Primitives, Icons, & Design Conventions — SDIT Fajar

Dokumen ini adalah referensi praktis untuk katalog komponen primitif Shadcn UI, ekosistem ikon, dan pola desain visual di SDIT Fajar.

---

## 1. Filosofi Desain: Minimalist Craft & Design Engineering

Gaya desain mengacu pada standar visual **[jakub.kr](https://jakub.kr/)**:
- **Micro-borders 1px**: `border border-border/80` yang tajam dan presisi.
- **Data-First**: Keterbacaan data numerik, nilai, dan tagihan adalah fokus utama.
- **Zero Claymorphism**: Tidak ada efek 3D cembung/gelembung kartun.
- **Zero Heavy Bento**: Tidak ada grid kotak-kotak beraneka ukuran yang membuang ruang.
- **Micro-transitions**: Durasi transisi halus 200ms (`transition-all duration-200`).

---

## 2. Ekosistem Ikon Resmi

| Kategori Ikon | Library | Contoh Penggunaan |
|---|---|---|
| **Utilitas Sistem & Aksi** | `lucide-react` | `Search`, `Plus`, `Trash2`, `Edit`, `Check`, `X`, `ChevronDown`, `Download`, `Upload`, `Printer` |
| **Navigasi & Aksentual** | `@hugeicons/react` | Menu navigasi sidebar, header modul dashboard, kartu fitur beranda publik |

---

## 3. Katalog Komponen Primitif Shadcn UI (`src/components/ui/`)

Gunakan komponen primitif Shadcn berikut sebelum membuat elemen kustom:

- **Button**: `import { Button } from '@/components/ui/button'` (variants: `default`, `outline`, `ghost`, `destructive`, `secondary`).
- **Input**: `import { Input } from '@/components/ui/input'`
- **Dialog / Modal**: `import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'`
- **Sheet (Drawer)**: `import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'`
- **Dropdown Menu**: `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'`
- **Table**: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'`
- **Badge**: `import { Badge } from '@/components/ui/badge'`
- **Card**: `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'`
- **Select**: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'`
- **Tabs**: `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'`
- **Skeleton**: `import { Skeleton } from '@/components/ui/skeleton'`

---

## 4. Komponen Reusable SDIT Fajar (`src/components/common/`)

| Nama Komponen | Lokasi File | Fungsi & Karakteristik |
|---|---|---|
| **`ZebraDataTable`** | `@/components/common/zebra-data-table.tsx` | Tabel data wajib baris belang-selang (`even:bg-muted/25`), search, filter, pagination |
| **`PageHeader`** | `@/components/common/page-header.tsx` | Judul halaman, breadcrumb, deskripsi singkat, tombol aksi kanan |
| **`StatCard`** | `@/components/common/stat-card.tsx` | Kartu metrik ringkasan dashboard (angka, ikon, tren naik/turun) |
| **`StatusBadge`** | `@/components/common/status-badge.tsx` | Badge status berwarna semantik (`active`, `paid`, `pending`, `graded`) |
| **`EmptyState`** | `@/components/common/empty-state.tsx` | Placeholder informatif ketika data query kosong |
| **`DatePicker`** | `@/components/common/date-picker.tsx` | Pemilih tanggal berbasis popover kalender |

---

## 5. Pola Tabel Wajib: Zebra Cross Table

Seluruh tampilan data banyak baris wajib mengikuti spesifikasi:
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
          <td className="px-4 py-2.5 font-mono text-xs font-medium">{item.nis}</td>
          <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
          <td className="px-4 py-2.5 text-muted-foreground">{item.class}</td>
          <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 6. Token Tipografi & Warna

- **Font Sans**: Inter Variable / Plus Jakarta Sans untuk seluruh teks umum.
- **Font Mono**: JetBrains Mono untuk NIS, nomor invoice, tanggal, dan nominal Rupiah (`font-mono text-xs`).
- **Semantic Colors**:
  - Primary Accent: Deep Blue `#2563EB` (hover: `#1D4ED8`)
  - Success: Emerald Green `#16A34A`
  - Warning: Amber `#D97706`
  - Danger/Destructive: Crimson Red `#DC2626`
  - Muted: Slate `#71717A` (light) / `#A1A1AA` (dark)
