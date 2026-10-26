"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  href: string;
  label: string;
  children?: { href: string; label: string; desc?: string }[];
}

const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "Beranda" },
  {
    href: "/profil",
    label: "Profil",
    children: [
      {
        href: "/profil",
        label: "Tentang Sekolah",
        desc: "Visi, misi, dan falsafah pendidikan Islam",
      },
      {
        href: "/profil/sejarah",
        label: "Sejarah",
        desc: "Perjalanan pendirian dan milestone SDIT Fajar",
      },
      {
        href: "/profil/manajemen",
        label: "Manajemen & Pengajar",
        desc: "Dewan pembina, pimpinan, dan dewan asatidz",
      },
    ],
  },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/berita", label: "Berita" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/kontak", label: "Kontak" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profilDropdownOpen, setProfilDropdownOpen] = React.useState(false);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfilDropdownOpen(false);
  };

  const isProfilActive = pathname.startsWith("/profil");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground leading-none">
              SDIT FAJAR
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-0.5">
              Sekolah Islam Terpadu
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            if (link.children) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setProfilDropdownOpen(true)}
                  onMouseLeave={() => setProfilDropdownOpen(false)}
                >
                  <button
                    onClick={() => setProfilDropdownOpen((v) => !v)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      isProfilActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        profilDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profilDropdownOpen && (
                    <div className="absolute top-full left-0 w-64 pt-2 z-50">
                      <div className="rounded-xl border border-border/80 bg-card p-2 shadow-md">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeMenus}
                            className={cn(
                              "block rounded-lg p-2.5 text-xs transition-colors hover:bg-muted/70",
                              pathname === child.href && "bg-muted font-semibold text-primary"
                            )}
                          >
                            <div className="font-medium text-foreground">
                              {child.label}
                            </div>
                            {child.desc && (
                              <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                                {child.desc}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-medium h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              <span>Masuk</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="text-xs font-semibold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <Link href="/pendaftaran" className="flex items-center gap-1.5">
              <span>Daftar PPDB</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <div key={link.href} className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenus}
                        className={cn(
                          "block pl-6 pr-3 py-2 text-xs font-medium rounded-md transition-colors",
                          pathname === child.href
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={cn(
                    "block px-3 py-2 text-xs font-medium rounded-md transition-colors",
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Button
              asChild
              size="sm"
              className="w-full text-xs font-semibold bg-primary text-primary-foreground justify-center"
            >
              <Link href="/pendaftaran" className="flex items-center gap-1.5">
                <span>Daftar PPDB Online</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium justify-center"
            >
              <Link href="/login" className="flex items-center gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk Sistem (Siswa / Guru / Wali)</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
