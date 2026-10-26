import * as React from "react";
import Link from "next/link";
import { Calendar, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";

export const metadata = {
  title: "Berita & Pengumuman — SDIT Fajar",
  description:
    "Kabar terkini seputar kegiatan murid, prestasi akademik, agenda sekolah, dan pengumuman resmi SDIT Fajar.",
};

interface ArticleItem {
  slug: string;
  title: string;
  category: "Prestasi" | "Kegiatan" | "Pengumuman" | "Akademik";
  date: string;
  author: string;
  excerpt: string;
}

const ARTICLES: ArticleItem[] = [
  {
    slug: "murid-raih-juara-1-mhq-depok",
    title: "Murid SDIT Fajar Raih Juara 1 MHQ Tingkat Kota Depok",
    category: "Prestasi",
    date: "24 Oktober 2026",
    author: "Humas SDIT Fajar",
    excerpt:
      "Ananda Rayyan Al-Ghifari murid kelas 5 berhasil menyabet medali emas pada ajang Musabaqah Hifdzil Qur'an kategori 2 Juz antar SD/MI tingkat Kota Depok.",
  },
  {
    slug: "market-day-edukasi-wirausaha-islami",
    title: "Market Day Edukasi: Menumbuhkan Jiwa Wirausaha Islami",
    category: "Kegiatan",
    date: "18 Oktober 2026",
    author: "Tim Kesiswaan",
    excerpt:
      "Murid kelas 4 dan 5 mempraktikkan muamalah jual beli syar'i secara langsung dalam kegiatan Market Day sekolah yang berlangsung meriah di lapangan utama.",
  },
  {
    slug: "sosialisasi-program-adab-ibadah",
    title: "Sosialisasi Program Pembiasaan Adab & Shalat Dhuha",
    category: "Pengumuman",
    date: "10 Oktober 2026",
    author: "Kurikulum Diniyah",
    excerpt:
      "Pertemuan komite sekolah dan wali murid menyepakati penguatan mutabaah ibadah harian murid di rumah dan integrasi pencatatan digital.",
  },
  {
    slug: "pelatihan-robotik-dasar-murid-inovatif",
    title: "Pelatihan Robotik Dasar: Mengasah Nalar Teknologi Generasi Muda",
    category: "Akademik",
    date: "28 September 2026",
    author: "Laboratorium Sains",
    excerpt:
      "Eksplorasi pembuatan sensor otomatis dan perakitan robot mini sederhana oleh tim ekstrakurikuler robotic binaan Ustadz Dedi Kurniawan.",
  },
  {
    slug: "wisuda-tasmi-juz-30-angkatan-viii",
    title: "Pelepasan & Ujian Tasmi' Juz 30 Bil-Ghoib Angkatan VIII",
    category: "Prestasi",
    date: "15 September 2026",
    author: "Koordinator Tahfidz",
    excerpt:
      "Sebanyak 42 murid kelas 2 dan 3 sukses menyelesaikan ujian tasmi' sekali duduk satu juz penuh disaksikan orang tua dan guru penguji.",
  },
  {
    slug: "donor-darah-dan-bakti-sosial-komite",
    title: "Aksi Nyata Kepedulian: Donor Darah & Santunan Yatim Komite",
    category: "Kegiatan",
    date: "02 September 2026",
    author: "Komite Sekolah",
    excerpt:
      "Bekerja sama dengan PMI Kota Depok, keluarga besar SDIT Fajar mengumpulkan puluhan kantong darah dan menyalurkan paket sembako untuk warga sekitar.",
  },
];

export default function BeritaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

      <PageHeader
        title="Berita & Informasi Sekolah"
        badge="Warta Fajar"
        description="Informasi resmi seputar agenda akademik, prestasi murid, dokumentasi kegiatan, dan pengumuman yayasan."
      />

      {/* Filter Kategori & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/80 pb-4">

        {/* Kategori Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <Button
            variant="default"
            size="sm"
            className="text-xs h-8 px-3 bg-primary text-primary-foreground"
          >
            Semua
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8 px-3 text-muted-foreground">
            Prestasi
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8 px-3 text-muted-foreground">
            Kegiatan
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8 px-3 text-muted-foreground">
            Akademik
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8 px-3 text-muted-foreground">
            Pengumuman
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari judul berita..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-input bg-background shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

      </div>

      {/* Grid Berita */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((article) => {
          const badgeVariant =
            article.category === "Prestasi"
              ? "success"
              : article.category === "Pengumuman"
                ? "warning"
                : "info";

          return (
            <article
              key={article.slug}
              className="group rounded-xl border border-border/80 bg-card p-5 space-y-3 transition-all hover:border-foreground/20 hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <StatusBadge status={article.category} variant={badgeVariant} />
                  <span className="font-mono text-[11px] flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/berita/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Oleh: {article.author}
                </span>
                <Link
                  href={`/berita/${article.slug}`}
                  className="font-semibold text-primary inline-flex items-center gap-1 group-hover:underline"
                >
                  <span>Baca</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination UI */}
      <div className="flex items-center justify-center gap-2 pt-6 border-t border-border/80">
        <Button variant="outline" size="sm" className="text-xs h-8 px-3" disabled>
          Sebelumnya
        </Button>
        <Button variant="default" size="sm" className="text-xs h-8 w-8 bg-primary text-primary-foreground p-0">
          1
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-8 w-8 p-0">
          2
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-8 px-3">
          Selanjutnya
        </Button>
      </div>

    </div>
  );
}
