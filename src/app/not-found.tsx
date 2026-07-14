import { Home, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="page-shell grid min-h-screen place-items-center py-16">
      <div className="clay-card max-w-xl p-8 text-center sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-600"><SearchX className="size-8" /></span>
        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.16em] text-sky-600">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Halaman tidak ditemukan</h1>
        <p className="mt-4 leading-7 text-slate-600">Tautan yang Anda buka mungkin sudah berubah atau belum tersedia.</p>
        <Button asChild className="mt-7"><Link href="/"><Home className="size-4" /> Kembali ke Beranda</Link></Button>
      </div>
    </main>
  );
}
