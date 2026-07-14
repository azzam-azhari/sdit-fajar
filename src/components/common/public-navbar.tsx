"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoMark } from "@/components/common/logo-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Beranda" },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/berita", label: "Berita" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/kontak", label: "Kontak" },
];

const profileLinks = [
  { href: "/profil", label: "Profil Sekolah" },
  { href: "/profil/sejarah", label: "Sejarah" },
  { href: "/profil/manajemen", label: "Manajemen" },
];

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isProfileActive = pathname.startsWith("/profil");

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/78 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-2xl">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <LogoMark />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigasi utama">
          <div className="group relative">
            <button
              type="button"
              className={cn(
                "inline-flex h-11 items-center gap-1 rounded-xl px-3 text-sm font-extrabold transition hover:bg-sky-50 hover:text-sky-700",
                isProfileActive ? "bg-sky-50 text-sky-700" : "text-slate-600",
              )}
              aria-haspopup="true"
            >
              Profil
              <ChevronDown className="size-4 transition group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full w-56 translate-y-2 rounded-2xl border border-sky-100 bg-white p-2 opacity-0 shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {profileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-bold transition hover:bg-sky-50 hover:text-sky-700",
                    isCurrentPath(pathname, link.href) ? "bg-sky-50 text-sky-700" : "text-slate-600",
                  )}
                  aria-current={isCurrentPath(pathname, link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3 py-3 text-sm font-extrabold transition hover:bg-sky-50 hover:text-sky-700",
                isCurrentPath(pathname, link.href) ? "bg-sky-50 text-sky-700" : "text-slate-600",
              )}
              aria-current={isCurrentPath(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/pendaftaran">Daftar Sekarang</Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="xl:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-sky-100 bg-white px-4 pb-5 pt-3 xl:hidden"
          aria-label="Navigasi mobile"
        >
          <div className="mx-auto grid max-w-3xl gap-1">
            <p className="px-4 pb-1 pt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-sky-600">
              Profil
            </p>
            {profileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-bold",
                  isCurrentPath(pathname, link.href) ? "bg-sky-50 text-sky-700" : "text-slate-600",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-sky-100" />
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-bold",
                  isCurrentPath(pathname, link.href) ? "bg-sky-50 text-sky-700" : "text-slate-600",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-3 sm:hidden">
              <Link href="/pendaftaran" onClick={() => setIsOpen(false)}>
                Daftar Sekarang
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
