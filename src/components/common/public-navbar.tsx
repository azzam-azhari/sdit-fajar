import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { PublicNavDesktop } from "@/components/common/public-nav-desktop";
import { PublicNavMobile } from "@/components/common/public-nav-mobile";

function PublicNavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          <div className="space-y-1 hidden sm:block">
            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            <div className="h-3 w-40 bg-muted/60 animate-pulse rounded" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded-md hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

function PublicNavbarContent() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="Logo SDIT Fajar"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          {/* Teks nama sekolah disembunyikan di lg agar tidak overflow dan tampil penuh di xl */}
          <div className="hidden sm:flex lg:hidden xl:flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground leading-none">
              SDIT FAJAR
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-0.5">
              Sekolah Islam Terpadu
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Client Component) */}
        <PublicNavDesktop />

        {/* Right Actions: Theme Toggle, Auth / PPDB CTA & Mobile Trigger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop & Tablet Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
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
              className="text-xs font-semibold h-9 px-3.5 xl:px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              <Link href="/pendaftaran" className="flex items-center gap-1.5">
                <span>Daftar PPDB</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation Sheet (Client Component) */}
          <PublicNavMobile />
        </div>
      </div>
    </header>
  );
}

export function PublicNavbar() {
  return (
    <React.Suspense fallback={<PublicNavbarSkeleton />}>
      <PublicNavbarContent />
    </React.Suspense>
  );
}
