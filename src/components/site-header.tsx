"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { Badge } from "@/components/ui/badge"

function formatPathTitle(pathname: string): { title: string; subtitle?: string } {
  if (pathname.includes("/dashboard/super-admin/users")) {
    return { title: "Manajemen Pengguna", subtitle: "Super Admin" }
  }
  if (pathname.includes("/dashboard/super-admin/roles")) {
    return { title: "Penugasan Jabatan Guru", subtitle: "Super Admin" }
  }
  if (pathname.includes("/dashboard/super-admin/audit-logs")) {
    return { title: "Audit Log Aktivitas", subtitle: "Super Admin" }
  }
  if (pathname.includes("/dashboard/super-admin/settings")) {
    return { title: "Pengaturan Identitas Sekolah", subtitle: "Super Admin" }
  }
  if (pathname.includes("/dashboard/super-admin/import")) {
    return { title: "Import Data Massal CSV", subtitle: "Super Admin" }
  }
  if (pathname === "/dashboard/super-admin") {
    return { title: "Dashboard Super Admin", subtitle: "Sistem & Kontrol Sentral" }
  }

  // Admin routes
  if (pathname.includes("/dashboard/admin/pendaftaran")) {
    return { title: "Verifikasi Pendaftaran PPDB", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/tahun-ajaran")) {
    return { title: "Tahun Ajaran & Periode", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/rombel")) {
    return { title: "Rombongan Belajar & Kelas", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/mapel")) {
    return { title: "Master Mata Pelajaran", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/penugasan")) {
    return { title: "Penugasan Mengajar Guru", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/siswa")) {
    return { title: "Data Pokok Murid", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/guru")) {
    return { title: "Data Pendidik & Tenaga Kependidikan", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/wali-murid")) {
    return { title: "Data Wali Murid & Relasi Anak", subtitle: "Admin Akademik" }
  }
  if (pathname.includes("/dashboard/admin/berita")) {
    return { title: "Manajemen Berita Sekolah", subtitle: "Admin Akademik" }
  }
  if (pathname === "/dashboard/admin") {
    return { title: "Dashboard Administrator", subtitle: "Operasional Akademik" }
  }

  return { title: "Portal Manajemen", subtitle: "SDIT Fajar" }
}

export function SiteHeader() {
  const pathname = usePathname()
  const { title, subtitle } = formatPathTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b rounded-t-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator
            orientation="vertical"
            className="mx-1 shrink-0 sm:mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {title}
            </h1>
            {subtitle && (
              <Badge variant="outline" className="hidden shrink-0 sm:inline-flex text-[10px] py-0 px-1.5 font-normal text-muted-foreground border-border/80">
                {subtitle}
              </Badge>
            )}
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
