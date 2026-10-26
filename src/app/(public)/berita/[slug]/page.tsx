import * as React from "react";
import Link from "next/link";
import { connection } from "next/server";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { createClient } from "@/lib/supabase/server";

const STATIC_ARTICLES: Record<
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

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const supabase = await createClient();

  // Cek apakah ada di database
  const { data: dbPost } = await supabase
    .from("news_posts")
    .select(`
      id,
      title,
      slug,
      content,
      published_at,
      profiles (
        name
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  let articleData: {
    title: string;
    category: "Prestasi" | "Kegiatan" | "Pengumuman" | "Akademik";
    date: string;
    author: string;
    content: string[];
    tags: string[];
  };

  if (dbPost) {
    const profileData = dbPost.profiles as unknown;
    const authorName = Array.isArray(profileData)
      ? (profileData[0] as { name?: string })?.name
      : (profileData as { name?: string })?.name;

    articleData = {
      title: dbPost.title,
      category: "Kegiatan",
      date: dbPost.published_at
        ? new Date(dbPost.published_at).toLocaleDateString("id-ID", { dateStyle: "full" })
        : "Terbaru",
      author: authorName || "Humas SDIT Fajar",
      content: dbPost.content.split(/\n\n+/),
      tags: ["SDIT Fajar", "Warta Resmi", "Pendidikan"],
    };
  } else if (STATIC_ARTICLES[slug]) {
    articleData = STATIC_ARTICLES[slug];
  } else {
    articleData = {
      title: "Warta Resmi Kegiatan Pembelajaran SDIT Fajar",
      category: "Kegiatan",
      date: "26 Oktober 2026",
      author: "Humas SDIT Fajar",
      content: [
        "SDIT Fajar terus berikhtiar menyelenggarakan pendidikan dasar Islam terpadu yang memadukan keunggulan adab, kelancaran tahfidz Al-Qur'an, dan literasi sains modern.",
        "Informasi detail seputar warta ini dapat diperoleh melalui kantor tata usaha atau kontak layanan resmi sekolah.",
      ],
      tags: ["Sekolah", "Akademik", "SDIT Fajar"],
    };
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/berita" className="flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Indeks Berita</span>
          </Link>
        </Button>
      </div>

      <article className="space-y-6">
        <header className="space-y-4 pb-6 border-b border-border/80">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={articleData.category} variant="info" />
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {articleData.date}
            </span>
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {articleData.author}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {articleData.title}
          </h1>
        </header>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed text-sm">
          {articleData.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <footer className="pt-6 border-t border-border/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Topik:</span>
              {articleData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs text-muted-foreground font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Salin Tautan</span>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}
