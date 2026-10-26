import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";

export const metadata = {
  title: "Marketplace & Buku Sekolah — SDIT Fajar",
  description:
    "Katalog resmi buku panduan tahfidz, seragam sekolah, modul kurikulum, dan perlengkapan santri SDIT Fajar.",
};

interface ProductItem {
  id: string;
  name: string;
  category: "Buku & Modul" | "Seragam" | "Perlengkapan" | "Digital";
  price: number;
  stock: number;
  type: "Fisik (Pick-up)" | "Digital (Download)";
  desc: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: "PROD-001",
    name: "Mushaf Tahfidz Al-Qur'an 3 Juz Terpadu (Juz 30, 29, 28)",
    category: "Buku & Modul",
    price: 95000,
    stock: 120,
    type: "Fisik (Pick-up)",
    desc: "Mushaf rasm Utsmani dengan blok warna tajwid, kolom mutabaah ziyadah, dan terjemahan per kata terbitan SDIT Fajar.",
  },
  {
    id: "PROD-002",
    name: "Buku Panduan Adab & Mutabaah Ibadah Harian Santri",
    category: "Buku & Modul",
    price: 45000,
    stock: 85,
    type: "Fisik (Pick-up)",
    desc: "Buku pencatatan shalat fardhu, dhuha, tadarus Al-Qur'an, adab makan, dan bakti orang tua untuk 1 tahun ajaran.",
  },
  {
    id: "PROD-003",
    name: "Seragam Batik Khas SDIT Fajar (Kemeja/Gamis)",
    category: "Seragam",
    price: 175000,
    stock: 45,
    type: "Fisik (Pick-up)",
    desc: "Batik resmi motif ornamen islami dengan bahan katun prima adem berstandar mutu sekolah terpadu.",
  },
  {
    id: "PROD-004",
    name: "Setelan Olahraga & Kaos Panahan Santri",
    category: "Seragam",
    price: 140000,
    stock: 60,
    type: "Fisik (Pick-up)",
    desc: "Bahan kaos dry-fit nyaman menyerap keringat dengan desain longgar syar'i untuk aktivitas kesiswaan.",
  },
  {
    id: "PROD-005",
    name: "Modul Digital: Kumpulan Doa Sehari-Hari & Dzikir Pagi Petang (E-Book PDF)",
    category: "Digital",
    price: 25000,
    stock: 999,
    type: "Digital (Download)",
    desc: "E-Book panduan doa shahihah hisnul muslim berformat PDF interaktif siap unduh langsung di portal wali murid.",
  },
  {
    id: "PROD-006",
    name: "Rompi Kepanduan Pramuka SIT Lengkap Badge Atribut",
    category: "Perlengkapan",
    price: 85000,
    stock: 35,
    type: "Fisik (Pick-up)",
    desc: "Rompi resmi kegiatan outdoor Pramuka SIT dengan saku fungsional dan bordir lambang satuan komunitas.",
  },
];

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      <PageHeader
        title="Marketplace & Perlengkapan Sekolah"
        badge="Etalase Resmi"
        description="Penyediaan buku panduan tahfidz, seragam, modul ajar, dan atribut resmi SDIT Fajar untuk kemudahan santri dan wali murid."
      />

      {/* Info Alur Fulfillment */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Info className="h-5 w-5" />
          <span>Ketentuan Pembelian & Pengambilan Produk:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground leading-relaxed">
          <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Package className="h-4 w-4 text-primary" />
              <span>Produk Fisik (Buku & Seragam)</span>
            </div>
            <p>
              Pemesanan diinisiasi oleh wali murid via portal pembayaran, kemudian barang diambil langsung di Koperasi Sekolah SDIT Fajar (Pick-up mandiri) dengan menunjukkan bukti pembayaran.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Download className="h-4 w-4 text-primary" />
              <span>Produk Digital (E-Book & Modul)</span>
            </div>
            <p>
              Setelah pembayaran berhasil diverifikasi melalui sistem Midtrans, tautan unduhan berkas PDF akan otomatis aktif di dashboard akun wali murid.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Katalog Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="group rounded-xl border border-border/80 bg-card p-5 space-y-4 transition-all hover:border-foreground/20 hover:shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <StatusBadge status={product.category} variant="neutral" />
                <span className="font-mono text-[11px] text-muted-foreground">
                  {product.type}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                {product.name}
              </h3>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {product.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Harga Resmi:</span>
                <span className="font-mono text-base font-bold text-primary">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Kode: {product.id}</span>
                <span>Stok: {product.stock} unit</span>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold h-8"
                >
                  <Link href="/login" className="flex items-center justify-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Masuk untuk Memesan</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
