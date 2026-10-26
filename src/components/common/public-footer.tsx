import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/80 bg-muted/20 dark:bg-zinc-950/40 text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-foreground">
                  SDIT FAJAR
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Sekolah Islam Terpadu
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mendidik generasi Qur’ani yang cerdas, beradab, berwawasan global,
              dan berpegang teguh pada nilai-nilai Al-Qur’an serta As-Sunnah.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>NPSN: 10814529 • Terakreditasi A</span>
            </div>
          </div>

          {/* Column 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Jelajahi
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/profil"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Profil & Visi Misi</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/sejarah"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Sejarah Sekolah</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/manajemen"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Pimpinan & Dewan Guru</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kurikulum"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Kurikulum Terpadu & Tahfidz</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ekstrakurikuler"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Ekstrakurikuler Santri</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Marketplace & Buku Sekolah</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Layanan PPDB & Siswa */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Layanan & PPDB
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/pendaftaran"
                  className="hover:text-primary transition-colors flex items-center gap-1 font-medium text-primary"
                >
                  <span>Pendaftaran Murid Baru (PPDB)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/pendaftaran/status"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Cek Status Pendaftaran</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Berita & Pengumuman Sekolah</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Portal Login Santri (NIS)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Portal Wali Murid & Pembayaran</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Alamat */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Hubungi Kami
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span className="leading-snug">
                  Jl. Cempaka No. 12, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16415
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-mono">(021) 7788-9900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>info@sditfajar.sch.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>Senin – Jumat: 07.00 – 16.00 WIB</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 SDIT Fajar. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/profil" className="hover:text-foreground transition-colors">
              Tentang Kami
            </Link>
            <Link href="/pendaftaran" className="hover:text-foreground transition-colors">
              Informasi PPDB
            </Link>
            <Link href="/kontak" className="hover:text-foreground transition-colors">
              Peta Lokasi
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
