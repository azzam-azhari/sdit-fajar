"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CheckCircle2,
  GraduationCap,
  History,
  School,
  ShieldCheck,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

export type SectionCardIconName =
  | "check-circle-2"
  | "graduation-cap"
  | "history"
  | "school"
  | "shield-check"
  | "user-check"
  | "users"

const sectionCardIcons: Record<SectionCardIconName, LucideIcon> = {
  "check-circle-2": CheckCircle2,
  "graduation-cap": GraduationCap,
  history: History,
  school: School,
  "shield-check": ShieldCheck,
  "user-check": UserCheck,
  users: Users,
}

export interface MetricCardItem {
  description: string
  title: string
  badgeText?: string
  footerTitle?: string
  footerSubtitle?: string
  icon?: SectionCardIconName
}

interface SectionCardsProps {
  cards?: MetricCardItem[]
}

const defaultCards: MetricCardItem[] = [
  {
    description: "Total Murid Aktif",
    title: "180 Siswa",
    badgeText: "6 Rombel",
    footerTitle: "Tingkat Kelas 1 - 6",
    footerSubtitle: "Tahun Ajaran 2026/2027",
    icon: "graduation-cap",
  },
  {
    description: "Tenaga Pendidik",
    title: "18 Guru",
    badgeText: "Aktif 100%",
    footerTitle: "Wali Kelas & Guru Mapel",
    footerSubtitle: "Kurikulum Islam Terpadu",
    icon: "users",
  },
  {
    description: "Pendaftaran PPDB",
    title: "68 / 100",
    badgeText: "Sisa 32 Kursi",
    footerTitle: "Gelombang 1 & 2",
    footerSubtitle: "Pendaftar dalam verifikasi",
    icon: "check-circle-2",
  },
  {
    description: "Rombongan Belajar",
    title: "6 Rombel",
    badgeText: "Kapasitas Penuh",
    footerTitle: "Rata-rata 30 murid/rombel",
    footerSubtitle: "Gedung Utama SDIT Fajar",
    icon: "school",
  },
]

export function SectionCards({ cards = defaultCards }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-0 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((item, idx) => {
        const IconComponent = sectionCardIcons[item.icon ?? "graduation-cap"]

        return (
          <Card key={idx} className="@container/card border-border/80">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-medium">{item.description}</CardDescription>
                <IconComponent className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {item.title}
              </CardTitle>
              {item.badgeText && (
                <CardAction>
                  <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[11px]">
                    {item.badgeText}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            {(item.footerTitle || item.footerSubtitle) && (
              <CardFooter className="flex-col items-start gap-1 text-xs">
                {item.footerTitle && (
                  <div className="line-clamp-1 font-medium text-foreground">
                    {item.footerTitle}
                  </div>
                )}
                {item.footerSubtitle && (
                  <div className="text-muted-foreground text-[11px]">
                    {item.footerSubtitle}
                  </div>
                )}
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}
