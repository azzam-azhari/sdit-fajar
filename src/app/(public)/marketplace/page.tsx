import type { Metadata } from "next";
import { BadgeCheck, LockKeyhole, ShoppingBag, UserRoundCheck } from "lucide-react";

import { MarketplaceCard } from "@/components/common/marketplace-card";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { marketplaceProducts } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Marketplace Pembelajaran",
  description: "Katalog konten pembelajaran resmi SDIT Fajar untuk mendampingi belajar anak di rumah.",
};

const publishedProducts = marketplaceProducts.filter((product) => product.isPublished);

export default function MarketplacePage() {
  return (
    <>
      <PageHero
        eyebrow="Marketplace Pembelajaran"
        title="Marketplace konten pembelajaran"
        description="Katalog hanya menampilkan produk resmi yang telah dipublikasikan oleh sekolah."
      />

      <section className="page-shell section-space">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading eyebrow="Katalog Terbit" title="Belajar lebih dekat, kapan saja" description="Katalog published dapat dilihat semua pengunjung. Checkout dan akses file digital hanya tersedia melalui akun wali murid setelah pembayaran tervalidasi." />
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700"><BadgeCheck className="size-4" />{publishedProducts.length} produk tersedia</span>
        </div>

        {publishedProducts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{publishedProducts.map((product) => <MarketplaceCard key={product.slug} product={product} />)}</div>
        ) : (
          <div className="clay-card mt-10 p-10 text-center"><ShoppingBag className="mx-auto size-10 text-sky-300" /><h2 className="mt-4 text-xl font-extrabold">Belum ada produk terbit</h2><p className="mt-2 text-slate-600">Katalog pembelajaran sedang dipersiapkan.</p></div>
        )}
      </section>

      <section id="cara-membeli" className="border-y border-sky-100 bg-sky-50/70 py-20">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading eyebrow="Cara Membeli" title="Aman untuk akun dan file keluarga" description="Alur transaksi akan aktif pada fase payment setelah konfigurasi, RLS, webhook, dan environment server tervalidasi." />
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="clay-card p-6"><UserRoundCheck className="size-8 text-sky-500" /><p className="mt-5 text-xs font-extrabold text-sky-600">LANGKAH 1</p><h2 className="mt-2 text-lg font-extrabold">Masuk sebagai wali murid</h2><p className="mt-2 text-sm leading-7 text-slate-600">Checkout tidak tersedia untuk role lain.</p></article>
            <article className="clay-card p-6"><ShoppingBag className="size-8 text-sky-500" /><p className="mt-5 text-xs font-extrabold text-sky-600">LANGKAH 2</p><h2 className="mt-2 text-lg font-extrabold">Pilih konten</h2><p className="mt-2 text-sm leading-7 text-slate-600">Harga dan total order dihitung oleh server.</p></article>
            <article className="clay-card p-6"><LockKeyhole className="size-8 text-sky-500" /><p className="mt-5 text-xs font-extrabold text-sky-600">LANGKAH 3</p><h2 className="mt-2 text-lg font-extrabold">Akses setelah valid</h2><p className="mt-2 text-sm leading-7 text-slate-600">File private dibuka melalui signed URL setelah payment valid.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
