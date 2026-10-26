"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  useSidebar,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
} from "@/components/ui/sidebar"

export function SidebarAutoClose() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile, setOpen } = useSidebar()
  const previousPathnameRef = React.useRef(pathname)
  const isInitialRenderRef = React.useRef(true)

  const handleClose = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    } else if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      setOpen(false)
      // Jaga cookie desktop agar tetap bernilai true saat layar diperlebar atau diputar
      document.cookie = `${SIDEBAR_COOKIE_NAME}=true; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }, [isMobile, setOpenMobile, setOpen])

  // Menutup sidebar saat berpindah rute (pathname berubah), abaikan render pertama
  React.useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false
      previousPathnameRef.current = pathname
      return
    }

    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname
      handleClose()
    }
  }, [pathname, handleClose])

  // Menangani klik pada tautan menu (termasuk klik ke tautan halaman yang sedang aktif)
  React.useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      // Cek apakah klik berada di dalam tautan menu sidebar (SidebarMenuButton / SidebarMenuSubButton)
      const link = target.closest<HTMLAnchorElement>(
        'a[data-slot="sidebar-menu-button"], [data-slot="sidebar-menu-button"] a, a[data-slot="sidebar-menu-sub-button"], [data-slot="sidebar-menu-sub-button"] a'
      )

      if (link) {
        handleClose()
      }
    }

    document.addEventListener("click", handleDocumentClick)
    return () => document.removeEventListener("click", handleDocumentClick)
  }, [handleClose])

  // Pulihkan status sidebar terbuka saat orientasi diputar atau layar diperlebar ke desktop (>= 1024px)
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mql = window.matchMedia("(min-width: 1024px)")
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(true)
      }
    }

    mql.addEventListener("change", handleMediaChange)
    return () => mql.removeEventListener("change", handleMediaChange)
  }, [setOpen])

  return null
}
