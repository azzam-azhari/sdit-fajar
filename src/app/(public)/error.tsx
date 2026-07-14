"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-shell py-20">
      <div className="clay-card mx-auto max-w-xl p-8 text-center sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-500">
          <AlertCircle className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-slate-950">Halaman belum dapat ditampilkan</h1>
        <p className="mt-3 leading-7 text-slate-600">Silakan coba kembali. Jika kendala berlanjut, hubungi admin sekolah.</p>
        <Button type="button" onClick={reset} className="mt-7">
          <RefreshCw className="size-4" /> Coba Lagi
        </Button>
      </div>
    </div>
  );
}
