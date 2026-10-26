"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  ArrowRight,
  LogIn,
  Home,
  School,
  BookOpen,
  Sparkles,
  Newspaper,
  ShoppingBag,
  Phone,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_LINKS, type NavLinkItem } from "@/constants/navigation";

interface PublicNavMobileProps {
  className?: string;
  links?: NavLinkItem[];
}

const NAV_ICONS: Record<string, React.ElementType> = {
  "/": Home,
  "/profil": School,
  "/kurikulum": BookOpen,
  "/ekstrakurikuler": Sparkles,
  "/berita": Newspaper,
  "/marketplace": ShoppingBag,
  "/kontak": Phone,
};

export function PublicNavMobile({
  className,
  links = PUBLIC_NAV_LINKS,
}: PublicNavMobileProps) {
  const [open, setOpen] = React.useState(false);
  const [profilOpen, setProfilOpen] = React.useState(true);
  const pathname = usePathname();

  const isLinkActive = React.useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <div className={cn("lg:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex h-full w-[310px] sm:w-[360px] flex-col p-0 bg-background text-foreground shadow-xl border-l border-border/80"
        >
          {/* Header Identitas Sekolah */}
          <SheetHeader className="p-4 sm:p-5 border-b border-border/70 text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/40">
                  <Image
                    src="/logo.png"
                    alt="Logo SDIT Fajar"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <SheetTitle className="text-base font-bold tracking-tight text-foreground leading-none">
                    SDIT FAJAR
                  </SheetTitle>
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-1">
                    Sekolah Islam Terpadu
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5"
              >
                Akreditasi A
              </Badge>
            </div>
          </SheetHeader>

          {/* Body Menu Berkelompok & Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <div className="space-y-1">
              <p className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Menu Utama
              </p>

              {links.map((item) => {
                const IconComponent = NAV_ICONS[item.href] || BookOpen;

                if (item.children && item.children.length > 0) {
                  const isParentActive =
                    isLinkActive(item.href) ||
                    item.children.some((child) => isLinkActive(child.href));

                  return (
                    <div key={item.href} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setProfilOpen((prev) => !prev)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                          isParentActive
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-foreground hover:bg-muted/70"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isParentActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            profilOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {profilOpen && (
                        <div className="ml-4 pl-3 border-l border-border/80 space-y-1 pt-0.5">
                          {item.children.map((child) => {
                            const isChildActive = isLinkActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-xs transition-colors",
                                  isChildActive
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                )}
                              >
                                <div className="font-medium text-foreground">
                                  {child.label}
                                </div>
                                {child.desc && (
                                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                    {child.desc}
                                  </div>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const active = isLinkActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <Separator className="bg-border/70" />

            {/* Hubungi Sekolah Langsung */}
            <div className="rounded-xl border border-border/70 bg-muted/40 p-3 space-y-1">
              <p className="text-[11px] font-semibold text-foreground">
                Pusat Bantuan & Informasi
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Jam operasional layanan TU: Senin – Jumat (07.30 – 15.00 WIB).
              </p>
            </div>
          </div>

          {/* Footer CTAs di Drawer Mobile */}
          <div className="border-t border-border/70 p-4 space-y-2 bg-muted/20">
            <Button
              asChild
              size="sm"
              className="w-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 justify-center h-10 shadow-xs"
            >
              <Link
                href="/pendaftaran"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5"
              >
                <span>Daftar PPDB Online</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium justify-center h-10 border-border/80"
            >
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk Portal (Siswa / Guru)</span>
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
