import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";

export const metadata = {
  title: "Sejarah Sekolah — SDIT Fajar",
  description:
    "Perjalanan sejarah pendirian dan tonggak capaian SDIT Fajar sejak tahun 2015 hingga saat ini.",
};

const MILESTONES = [
  {
    year: "2015",
    title: "Pendirian Yayasan & Gagasan Awal",
    desc: "Didirikan oleh para tokoh pendidik dan da'i di Cilodong Depok yang bertekad menghadirkan sekolah dasar Islam terpadu bermutu tinggi dengan biaya yang terjangkau oleh masyarakat.",
  },
  {
    year: "2016",
    title: "Angkatan Pertama (2 Rombel Perdana)",
    desc: "Memulai kegiatan belajar mengajar dengan 48 murid perdana. Gedung pertama beroperasi dengan 4 ruang kelas dan mushola sekolah sederhana.",
  },
  {
    year: "2019",
    title: "Akreditasi A & Perluasan Gedung Baru",
    desc: "Berhasil meraih predikat Terakreditasi A (Unggul) dari BAN-SM serta peresmian gedung pembelajaran tahap dua, laboratorium komputer, dan perpustakaan.",
  },
  {
    year: "2022",
    title: "Penerapan Kurikulum Merdeka & Sistem Tahfidz Terpadu",
    desc: "Menjadi salah satu sekolah penggerak implementasi Kurikulum Merdeka di Kota Depok dengan standarisasi mutabaah tahfidz terstruktur min. 3 Juz.",
  },
  {
    year: "2026",
    title: "Digitalisasi Sistem & Peluncuran Portal Terpadu",
    desc: "Mengimplementasikan platform manajemen sekolah digital, pembayaran terpadu Midtrans, PPDB daring transparan berkuota 100 murid, dan marketplace buku sekolah.",
  },
];

export default function SejarahPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

      <PageHeader
        title="Sejarah & Linimasa Sekolah"
        badge="Sejarah"
        description="Merekam jejak langkah dan dedikasi panjang SDIT Fajar dalam melahirkan generasi pecinta Al-Qur'an dan pembelajar sejati."
      >
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/profil">Profil & Visi Misi</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/profil/manajemen">Manajemen Sekolah</Link>
        </Button>
      </PageHeader>

      {/* Kisah Awal */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Bermula dari Niat Luhur Membina Ummat
        </h2>
        <div className="space-y-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
          <p>
            Kelahiran SDIT Fajar berawal dari kegelisahan bersama para pendidik muslim di Depok terhadap minimnya lembaga pendidikan dasar yang mampu memadukan antara kekuatan hafalan Al-Qur&apos;an dengan penguasaan kurikulum umum berstandar nasional secara seimbang.
          </p>
          <p>
            Dengan izin Allah Subhanahu wa Ta&apos;ala serta dukungan wakaf dan gotong royong para muhsinin, pada tahun 2015 dimulailah pembangunan sarana belajar pertama di kawasan Cilodong. Sejak itu, SDIT Fajar terus berbenah secara berkelanjutan meningkatkan kualitas pendidik, sarana pembelajaran, hingga sistem administrasi modern.
          </p>
        </div>
      </section>

      {/* Linimasa Milestone */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Jejak Langkah
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
            Linimasa Capaian (2015 – 2026)
          </h2>
        </div>

        <div className="relative border-l-2 border-border/80 pl-6 ml-3 space-y-8">
          {MILESTONES.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background group-hover:scale-125 transition-transform">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {item.year}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Kenali jajaran pimpinan dan dewan pengajar kami.
        </p>
        <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
          <Link href="/profil/manajemen" className="flex items-center gap-1.5">
            <span>Lihat Profil Manajemen Sekolah</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}
