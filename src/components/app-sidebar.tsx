"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings2,
  FileSpreadsheet,
  History,
  UserCheck,
  CalendarDays,
  School,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Newspaper,
  Globe,
  KeyRound,
  GraduationCap as SchoolLogoIcon,
} from "lucide-react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    role?: string
    avatar?: string | null
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Tentukan role berdasarkan prop atau URL path
  const currentRole = user?.role || (pathname.includes("/super-admin") ? "super_admin" : "admin")

  const currentUser = {
    name: user?.name || (currentRole === "super_admin" ? "Super Admin" : "Administrator"),
    email: user?.email || (currentRole === "super_admin" ? "super_admin@sdit-fajar.sch.id" : "admin@sdit-fajar.sch.id"),
    avatar: user?.avatar || null,
    role: currentRole,
  }

  // Navigasi Super Admin
  const superAdminNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard/super-admin",
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: "Manajemen Pengguna",
      url: "/dashboard/super-admin/users",
      icon: <Users className="size-4" />,
    },
    {
      title: "Jabatan Guru",
      url: "/dashboard/super-admin/roles",
      icon: <ShieldCheck className="size-4" />,
    },
    {
      title: "Identitas Sekolah",
      url: "/dashboard/super-admin/settings",
      icon: <Settings2 className="size-4" />,
    },
    {
      title: "Audit Log",
      url: "/dashboard/super-admin/audit-logs",
      icon: <History className="size-4" />,
    },
    {
      title: "Import CSV Massal",
      url: "/dashboard/super-admin/import",
      icon: <FileSpreadsheet className="size-4" />,
    },
  ]

  const superAdminNavDocs = [
    {
      name: "Verifikasi PPDB",
      url: "/dashboard/admin/pendaftaran",
      icon: <UserCheck className="size-4" />,
    },
    {
      name: "Rombel & Kelas",
      url: "/dashboard/admin/rombel",
      icon: <School className="size-4" />,
    },
    {
      name: "Data Murid",
      url: "/dashboard/admin/siswa",
      icon: <GraduationCap className="size-4" />,
    },
    {
      name: "Berita Sekolah",
      url: "/dashboard/admin/berita",
      icon: <Newspaper className="size-4" />,
    },
  ]

  // Navigasi Admin Sekolah
  const adminNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: "Verifikasi PPDB",
      url: "/dashboard/admin/pendaftaran",
      icon: <UserCheck className="size-4" />,
    },
    {
      title: "Tahun Ajaran & Periode",
      url: "/dashboard/admin/tahun-ajaran",
      icon: <CalendarDays className="size-4" />,
    },
    {
      title: "Rombel & Kelas",
      url: "/dashboard/admin/rombel",
      icon: <School className="size-4" />,
    },
    {
      title: "Mata Pelajaran",
      url: "/dashboard/admin/mapel",
      icon: <BookOpen className="size-4" />,
    },
    {
      title: "Penugasan Mengajar",
      url: "/dashboard/admin/penugasan",
      icon: <ShieldCheck className="size-4" />,
    },
    {
      title: "Berita Sekolah",
      url: "/dashboard/admin/berita",
      icon: <Newspaper className="size-4" />,
    },
  ]

  const adminNavDocs = [
    {
      name: "Data Pokok Murid",
      url: "/dashboard/admin/siswa",
      icon: <GraduationCap className="size-4" />,
    },
    {
      name: "Data Tenaga Pendidik",
      url: "/dashboard/admin/guru",
      icon: <Users className="size-4" />,
    },
    {
      name: "Data Wali Murid",
      url: "/dashboard/admin/wali-murid",
      icon: <HeartHandshake className="size-4" />,
    },
  ]

  const teacherNavMain = [
    { title: "Dashboard", url: "/dashboard/guru", icon: <LayoutDashboard className="size-4" /> },
    { title: "Materi", url: "/dashboard/guru/materi", icon: <BookOpen className="size-4" /> },
    { title: "Tugas & Penilaian", url: "/dashboard/guru/tugas", icon: <ShieldCheck className="size-4" /> },
    { title: "Buku Nilai", url: "/dashboard/guru/nilai", icon: <GraduationCap className="size-4" /> },
    { title: "Presensi Guru", url: "/dashboard/guru/presensi", icon: <CalendarDays className="size-4" /> },
    { title: "Presensi Murid", url: "/dashboard/guru/presensi-siswa", icon: <UserCheck className="size-4" /> },
  ]
  const studentNavMain = [
    { title: "Dashboard", url: "/dashboard/murid", icon: <LayoutDashboard className="size-4" /> },
    { title: "Jadwal", url: "/dashboard/murid/jadwal", icon: <CalendarDays className="size-4" /> },
    { title: "Materi", url: "/dashboard/murid/materi", icon: <BookOpen className="size-4" /> },
    { title: "Tugas Saya", url: "/dashboard/murid/tugas", icon: <ShieldCheck className="size-4" /> },
    { title: "Nilai Saya", url: "/dashboard/murid/nilai", icon: <GraduationCap className="size-4" /> },
  ]
  const parentNavMain = [
    { title: "Dashboard", url: "/dashboard/wali-murid", icon: <LayoutDashboard className="size-4" /> },
    { title: "Data Anak", url: "/dashboard/wali-murid/anak", icon: <GraduationCap className="size-4" /> },
    { title: "Tugas Anak", url: "/dashboard/wali-murid/tugas", icon: <ShieldCheck className="size-4" /> },
    { title: "Nilai Anak", url: "/dashboard/wali-murid/nilai", icon: <BookOpen className="size-4" /> },
    { title: "Presensi Anak", url: "/dashboard/wali-murid/absensi", icon: <CalendarDays className="size-4" /> },
  ]

  const navSecondary = [
    {
      title: "Website Sekolah",
      url: "/",
      icon: <Globe className="size-4" />,
    },
    {
      title: "Ganti Password",
      url: "/ganti-password",
      icon: <KeyRound className="size-4" />,
    },
  ]

  const isSuperAdmin = currentRole === "super_admin"
  const isTeacher = currentRole === "guru"
  const isStudent = currentRole === "murid"
  const isParent = currentRole === "wali_murid"
  const homeUrl = isSuperAdmin ? "/dashboard/super-admin" : isTeacher ? "/dashboard/guru" : isStudent ? "/dashboard/murid" : isParent ? "/dashboard/wali-murid" : "/dashboard/admin"
  const mainNavigation = isSuperAdmin ? superAdminNavMain : isTeacher ? teacherNavMain : isStudent ? studentNavMain : isParent ? parentNavMain : adminNavMain

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={homeUrl}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <SchoolLogoIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">SDIT Fajar</span>
                  <span className="truncate text-[11px] text-muted-foreground font-mono">
                    {isSuperAdmin ? "Super Admin Portal" : isTeacher ? "Portal Guru" : isStudent ? "Portal Murid" : isParent ? "Portal Wali Murid" : "Admin Akademik"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainNavigation} />
        {!(isTeacher || isStudent || isParent) && <NavDocuments
          label={isSuperAdmin ? "Akses Cepat Akademik" : "Data Pokok Sekolah"}
          items={isSuperAdmin ? superAdminNavDocs : adminNavDocs}
        />}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
