import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/public';

export interface ArticleItem {
  slug: string;
  title: string;
  category: "Prestasi" | "Kegiatan" | "Pengumuman" | "Akademik";
  date: string;
  author: string;
  excerpt: string;
}

export interface DetailArticleItem {
  title: string;
  category: "Prestasi" | "Kegiatan" | "Pengumuman" | "Akademik";
  date: string;
  author: string;
  content: string[];
  tags: string[];
}

export const DEFAULT_ARTICLES: ArticleItem[] = [
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
];

export const STATIC_ARTICLES: Record<string, DetailArticleItem> = {
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

/**
 * Mengambil daftar berita publik terbit dengan caching Next.js 16.
 */
export async function getPublicNewsList(): Promise<ArticleItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('news');

  try {
    const supabase = createPublicClient();
    const { data: dbPosts, error } = await supabase
      .from('news_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        status,
        published_at,
        profiles (
          name
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !dbPosts || dbPosts.length === 0) {
      return DEFAULT_ARTICLES;
    }

    const formattedDb: ArticleItem[] = dbPosts.map((post) => {
      const profObj = post.profiles as unknown;
      const authorName = Array.isArray(profObj)
        ? (profObj[0] as { name?: string })?.name
        : (profObj as { name?: string })?.name;

      return {
        slug: post.slug,
        title: post.title,
        category: "Kegiatan",
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString("id-ID", { dateStyle: "medium" })
          : "Terbaru",
        author: authorName || "Humas SDIT Fajar",
        excerpt: post.excerpt || "Warta terbaru dari publikasi resmi SDIT Fajar.",
      };
    });

    const existingSlugs = new Set(formattedDb.map((p) => p.slug));
    return [
      ...formattedDb,
      ...DEFAULT_ARTICLES.filter((a) => !existingSlugs.has(a.slug)),
    ];
  } catch {
    return DEFAULT_ARTICLES;
  }
}

/**
 * Mengambil detail berita publik berdasarkan slug dengan caching Next.js 16.
 */
export async function getPublicNewsBySlug(slug: string): Promise<DetailArticleItem> {
  'use cache';
  cacheLife('hours');
  cacheTag('news', `news:${slug}`);

  try {
    const supabase = createPublicClient();
    const { data: dbPost, error } = await supabase
      .from('news_posts')
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
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (!error && dbPost) {
      const profileData = dbPost.profiles as unknown;
      const authorName = Array.isArray(profileData)
        ? (profileData[0] as { name?: string })?.name
        : (profileData as { name?: string })?.name;

      return {
        title: dbPost.title,
        category: "Kegiatan",
        date: dbPost.published_at
          ? new Date(dbPost.published_at).toLocaleDateString("id-ID", { dateStyle: "full" })
          : "Terbaru",
        author: authorName || "Humas SDIT Fajar",
        content: dbPost.content.split(/\n\n+/),
        tags: ["SDIT Fajar", "Warta Resmi", "Pendidikan"],
      };
    }
  } catch {
    // Fallback below
  }

  if (STATIC_ARTICLES[slug]) {
    return STATIC_ARTICLES[slug];
  }

  return {
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
