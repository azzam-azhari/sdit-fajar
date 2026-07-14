import { BookOpen, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { formatRupiah, type MarketplaceProduct } from "@/constants/public-data";

export function MarketplaceCard({ product }: { product: MarketplaceProduct }) {
  return (
    <article className="clay-card-interactive group overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={`Sampul ${product.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/45 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-extrabold text-sky-700">
          {product.level}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-sky-600">
          <BookOpen className="size-4" />
          {product.format}
        </div>
        <h3 className="mt-3 text-xl font-extrabold text-slate-950">{product.title}</h3>
        <p className="mt-2 min-h-14 text-sm leading-7 text-slate-600">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-sky-100 pt-5">
          <div>
            <p className="text-xs font-bold text-slate-500">Harga</p>
            <p className="text-lg font-extrabold text-sky-700">{formatRupiah(product.price)}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700">
            <ShieldCheck className="size-4" />
            Wali Murid
          </span>
        </div>
      </div>
    </article>
  );
}
