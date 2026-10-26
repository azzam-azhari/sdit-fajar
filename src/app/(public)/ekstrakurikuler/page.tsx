import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Target,
  Trophy,
  Cpu,
  PenTool,
  HeartPulse,
  Languages,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";

export const metadata = {
  title: "Ekstrakurikuler — SDIT Fajar",
  description:
    "Ragam kegiatan ekstrakurikuler kepanduan Pramuka SIT, panahan, robotic, kaligrafi, dan olahraga santri SDIT Fajar.",
};

const EKSTRAKURIKULER = [
  {
    name: "Pramuka SIT (Satuan Komunitas)",
    category: "Wajib",
    icon: Compass,
    schedule: "Jumat, 13.30 – 15.00 WIB",
    target: "Kelas 1 – 6",
    desc: "Membina kedisiplinan, ketangkasan fisik, kemandirian berkemah, dan jiwa tolong-menolong berlandaskan Dasa Darma Pramuka SIT.",
  },
  {
    name: "Panahan Sunnah (Archery)",
    category: "Olahraga Sunnah",
    icon: Target,
    schedule: "Sabtu, 08.00 – 10.00 WIB",
    target: "Kelas 3 – 6",
    desc: "Melatih fokus konsentrasi, kekuatan fisik, kesabaran, dan ketenangan jiwa sesuai sunnah olahraga yang dianjurkan Rasulullah SAW.",
  },
  {
    name: "Robotic & Koding Dasar",
    category: "Sains & Teknologi",
    icon: Cpu,
    schedule: "Sabtu, 10.00 – 11.30 WIB",
    target: "Kelas 4 – 6",
    desc: "Mengenalkan logika algoritma pemrograman visual (Scratch/Blockly) dan merakit robotika cerdas pengikut garis (Line Follower).",
  },
  {
    name: "Futsal Santri",
    category: "Olahraga Prestasi",
    icon: Trophy,
    schedule: "Selasa & Kamis, 16.00 – 17.30 WIB",
    target: "Kelas 3 – 6",
    desc: "Melatih kekompakan tim, ketahanan fisik, sportivitas islami, dan persiapan turnamen olahraga antar sekolah se-Jabodetabek.",
  },
  {
    name: "Khat & Kaligrafi Al-Qur'an",
    category: "Seni Islami",
    icon: PenTool,
    schedule: "Rabu, 15.30 – 17.00 WIB",
    target: "Kelas 2 – 6",
    desc: "Mengasah keindahan tulisan tangan Arab dengan kaidah Khat Naskhi dan Riq'ah, melatih kehalusan budi pekerti dan ketelitian.",
  },
  {
    name: "Dokter Kecil (UKS)",
    category: "Kesehatan & Sosial",
    icon: HeartPulse,
    schedule: "Senin, 15.30 – 16.30 WIB",
    target: "Kelas 4 – 5",
    desc: "Pelatihan pertolongan pertama pada kecelakaan (P3K), pola hidup bersih dan sehat (PHBS), serta duta kesehatan lingkungan kelas.",
  },
  {
    name: "English & Arabic Young Club",
    category: "Bahasa Asing",
    icon: Languages,
    schedule: "Kamis, 15.30 – 16.45 WIB",
    target: "Kelas 3 – 6",
    desc: "Permainan peran (role play), storytelling kisah nabi dalam bahasa Inggris/Arab, dan pembiasaan percakapan sehari-hari santri.",
  },
];

export default function EkstrakurikulerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      <PageHeader
        title="Ekstrakurikuler & Minat Bakat"
        badge="Kesiswaan"
        description="Wadah pengembangan potensi jasmani, kreativitas seni islami, teknologi, dan kepemimpinan santri di luar jam intrakurikuler."
      >
        <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
          <Link href="/pendaftaran">Daftar Santri Baru</Link>
        </Button>
      </PageHeader>

      {/* Grid Ekstrakurikuler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EKSTRAKURIKULER.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-border/80 bg-card p-6 space-y-4 transition-all hover:border-foreground/20 hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <StatusBadge
                    status={item.category}
                    variant={item.category === "Wajib" ? "info" : "neutral"}
                  />
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {item.name}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-1 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{item.schedule}</span>
                </div>
                <div>Sasaran: {item.target}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prestasi Ekstrakurikuler */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Jejak Prestasi Santri SDIT Fajar
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          Melalui pembinaan ekstrakurikuler intensif, santri SDIT Fajar telah berhasil menorehkan prestasi gemilang, di antaranya: Juara 1 Lomba Panahan Tradisional Pelajar se-Jawa Barat (2025), Juara 2 Lomba Robotic Line Follower Tingkat SD (2024), dan Regu Teladan Jambore Pramuka SIT Nasional (2024).
        </p>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Ingin membaca kabar prestasi dan kegiatan terbaru santri?
        </p>
        <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
          <Link href="/berita" className="flex items-center gap-1.5">
            <span>Buka Berita & Agenda</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}
