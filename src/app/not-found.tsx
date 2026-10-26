import Link from "next/link";
import { GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <GraduationCap className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Error 404 • Halaman Tidak Ditemukan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Afwan, Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Tautan yang Anda tuju mungkin telah dipindahkan, diubah alamatnya, atau sedang tidak tersedia saat ini.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button asChild size="sm" className="text-xs font-semibold bg-primary text-primary-foreground">
          <Link href="/" className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/pendaftaran">Informasi PPDB</Link>
        </Button>
      </div>
    </div>
  );
}
