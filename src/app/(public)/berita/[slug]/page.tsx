import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";

const ARTICLE_DB: Record<
  string,
  {
    title: string;
    category: "Prestasi" | "Kegiatan" | "Pengumuman" | "Akademik";
    date: string;
    author: string;
    content: string[];
    tags: string[];
  }
> = {
  "murid-raih-juara-1-mhq-depok": {
    title: "Murid SDIT Fajar Raih Juara 1 MHQ Tingkat Kota Depok",
    category: "Prestasi",
    date: "24 Oktober 2026",
    author: "Ustadz Salman (Humas SDIT Fajar)",
    tags: ["Prestasi", "Tahfidz", "MHQ 2026", "Kota Depok"],
    content: [
      "Alhamdulillah, puji syukur ke hadirat Allah SWT, prestasi membanggakan kembali diukir oleh murid SDIT Fajar. Ananda Rayyan Al-Ghifari, murid kelas 5B, berhasil meraih Juara 1 dalam ajang Musabaqah Hifdzil Qur'an (MHQ) Tingkat SD/MI se-Kota Depok yang diselenggarakan pada hari Sabtu kemarin di Masjid Agung Balaikota Depok.",
      "Perlombaan yang diikuti oleh lebih dari 60 peserta dari berbagai sekolah dasar Islam unggulan ini menguji ketepatan tajwid, fashahah (kefasihan makhraj), kelancaran hafalan, dan adab tilawah pada kategori 2 Juz (Juz 30 dan 29).",
      "Dewan juri mengapresiasi ketenangan ananda Rayyan saat menjawab soal sambung ayat tanpa jeda keraguan serta irama bacaan tartil yang sangat merdu sesuai kaidah riwayat Hafsh 'an 'Ashim.",
      "Ustadz Hafizh Al-Bantani selaku Koordinator Tahfidz SDIT Fajar menyampaikan bahwa keberhasilan ini merupakan buah dari kedisiplinan program talaqqi harian serta dukungan murajaah intensif yang terjalin erat antara sekolah dan orang tua di rumah.",
      "Semoga capaian gemilang ini menjadi pemantik semangat bagi seluruh murid SDIT Fajar untuk semakin istiqamah bersama Al-Qur'an dan menjadi teladan akhlak mulia di mana pun berada. Aamiin Ya Rabbal 'Alamin.",
    ],
  },
  "market-day-edukasi-wirausaha-islami": {
    title: "Market Day Edukasi: Menumbuhkan Jiwa Wirausaha Islami",
    category: "Kegiatan",
    date: "18 Oktober 2026",
    author: "Tim Kesiswaan",
    tags: ["Kegiatan", "Market Day", "Wirausaha", "Adab Muamalah"],
    content: [
      "Suasana lapangan utama SDIT Fajar tampak berbeda pada Kamis pagi. Ratusan murid kelas 4 dan 5 mengenakan celemek warna-warni sembari menata stan dagangan mereka dalam gelaran Market Day Edukasi 2026 bertajuk 'Jujur Berdagang, Berkah Berniaga'.",
      "Kegiatan tahunan ini merupakan implementasi nyata Projek Penguatan Profil Pelajar Pancasila (P5) yang diintegrasikan dengan materi Fiqih Muamalah. Murid diajarkan cara menghitung modal dasar, menentukan harga jual yang adil, serta mempraktikkan akad jual beli syar'i secara santun.",
      "Aneka produk kreasi murid dijajakan mulai dari camilan sehat tradisional, jus buah segar, kerajinan tangan origami, hingga pembatas buku kaligrafi. Para pembeli yang terdiri dari adik kelas 1-3 dan para guru menggunakan kupon transaksi khusus yang disediakan panitia.",
      "Kepala Sekolah SDIT Fajar menegaskan bahwa tujuan utama acara ini bukan semata-mata mencari keuntungan materi, melainkan menanamkan nilai kejujuran, sportivitas, keramahan, dan pemahaman bahwa perniagaan adalah salah satu sunnah utama yang dicontohkan Rasulullah SAW.",
    ],
  },
};

// Fallback generic article if slug not found in static dictionary
function getArticleData(slug: string) {
  if (ARTICLE_DB[slug]) return ARTICLE_DB[slug];
  return {
    title: "Kabar Agenda & Aktivitas Pembelajaran Murid SDIT Fajar",
    category: "Kegiatan" as const,
    date: "10 Oktober 2026",
    author: "Tim Humas & Kesiswaan",
    tags: ["Sekolah", "Akademik", "Murid"],
    content: [
      "SDIT Fajar terus berikhtiar menghadirkan atmosfer pembelajaran yang menyenangkan, menantang nalar kritis, dan berakar pada nilai-nilai ketakwaan kepada Allah SWT.",
      "Melalui berbagai aktivitas terprogram di kelas maupun di luar ruangan, setiap murid mendapatkan ruang untuk mengaktualisasikan minat dan bakat terbaiknya secara optimal.",
      "Terima kasih atas kepercayaan dan dukungan yang tak terhingga dari seluruh wali murid dan mitra sekolah yang senantiasa membersamai langkah kami mencetak generasi Qur'ani yang tangguh.",
    ],
  };
}

export function generateStaticParams() {
  return Object.keys(ARTICLE_DB).map((slug) => ({
    slug,
  }));
}

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleData(slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* Back Button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/berita" className="flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Semua Berita</span>
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-border/80 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={article.category}
            variant={article.category === "Prestasi" ? "success" : "info"}
          />
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {article.date}
          </span>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="h-3.5 w-3.5" /> {article.author}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {article.title}
        </h1>
      </header>

      {/* Article Body Content */}
      <article className="space-y-4 text-xs sm:text-sm md:text-base text-foreground/90 leading-relaxed">
        {article.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Tags & Share */}
      <footer className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium mr-1">Tags:</span>
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Share2 className="h-3.5 w-3.5 mr-1" /> Bagikan
          </Button>
        </div>
      </footer>

      {/* Next Article Suggestion */}
      <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Berita Lainnya
          </span>
          <h4 className="text-sm font-bold text-foreground mt-0.5">
            Market Day Edukasi: Menumbuhkan Jiwa Wirausaha Islami
          </h4>
        </div>
        <Button asChild size="sm" className="shrink-0 text-xs bg-primary text-primary-foreground">
          <Link href="/berita/market-day-edukasi-wirausaha-islami">
            Baca Berita Ini
          </Link>
        </Button>
      </div>

    </div>
  );
}
