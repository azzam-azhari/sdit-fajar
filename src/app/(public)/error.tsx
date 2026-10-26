"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to console or error reporter
    console.error("Public Route Error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
        <AlertCircle className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Terjadi Kendala Memuat Halaman
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Mohon maaf, halaman yang Anda tuju sedang mengalami kendala teknis.
          Silakan coba muat ulang atau kembali ke beranda utama.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          onClick={() => reset()}
          size="sm"
          className="text-xs font-semibold bg-primary text-primary-foreground flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Coba Muat Ulang</span>
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/" className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
