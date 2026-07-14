export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  publishedAt?: string;
  readingTime?: string;
  image?: string;
  featured?: boolean;
};

export type MarketplaceProduct = {
  slug: string;
  title: string;
  description: string;
  format: string;
  level: string;
  price: number;
  image: string;
  isPublished: boolean;
};

export type SchoolManagementMember = {
  name: string;
  role: string;
};

export const schoolIdentity = {
  name: "SDIT Fajar Kota Depok",
  shortName: "SDIT Fajar",
  description:
    "SDIT Fajar Kota Depok adalah lembaga pendidikan Islam terpadu yang berkomitmen mencetak generasi Qurani, cerdas, dan berakhlak mulia. Kami terus berupaya menghadirkan lingkungan belajar yang unggul, inspiratif, serta berlandaskan iman dan ilmu.",
  motto: "Jiwa pemimpin tumbuh dari lingkungan dan perkembangan interaksi sosial.",
  vision:
    "Terwujudnya peserta didik yang beriman dan bertakwa, terampil, serta cinta terhadap lingkungan.",
  missions: [
    "Menanamkan keimanan dan ketakwaan kepada peserta didik agar taat dalam beribadah.",
    "Membentuk peserta didik yang cerdas, kreatif, inovatif, dan berakhlak mulia.",
    "Mengoptimalkan proses pembelajaran dan bimbingan dalam mengembangkan bakat yang dimiliki peserta didik.",
    "Meningkatkan prestasi akademik dan nonakademik.",
    "Mewujudkan suasana kekeluargaan antarwarga sekolah.",
    "Mewujudkan budaya peduli terhadap lingkungan hidup.",
  ],
  address:
    "Jl. Jati III No. 40, RT 007/RW 007, Kelurahan Jatijajar, Kecamatan Tapos, Kota Depok.",
  email: "sditfajar@gmail.com",
  whatsappNumber: "6287737860657",
  whatsappDisplay: "0877-3786-0657",
  whatsappUrl:
    "https://wa.me/6287737860657?text=Assalamu%27alaikum%2C%20saya%20ingin%20bertanya%20tentang%20SDIT%20Fajar.",
  contacts: [
    { name: "M. Padil Riswandi", phone: "0877-3786-0657" },
    { name: "Viny Virzanah", phone: "0877-3786-0657" },
  ],
  socialHandle: "@sditfajar",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Jl.%20Jati%20III%20No.%2040%2C%20Jatijajar%2C%20Tapos%2C%20Kota%20Depok&output=embed",
  copyright: "© 2026 Dibuat dengan ❤️ oleh IT SDIT Fajar. All rights reserved.",
} as const;

export const siteConfig = {
  name: schoolIdentity.shortName,
  email: schoolIdentity.email,
  whatsappUrl: schoolIdentity.whatsappUrl,
  mapEmbedUrl: schoolIdentity.mapEmbedUrl,
};

export const schoolManagement: SchoolManagementMember[] = [
  { name: "Ummi Nining Juningsih, S.Ag.", role: "Kepala Sekolah" },
  { name: "Herlin Ruswanti, S.Pd., Gr.", role: "Guru BK" },
  { name: "Alfa Muhdina, S.Pd.", role: "Kedisiplinan" },
  { name: "Mia Nurdiana, S.Pd.", role: "Bendahara Sekolah" },
  { name: "Esa Pandu Imansyah", role: "Kesehatan" },
  { name: "Nurul Fitri, S.Pd., Gr.", role: "Kurikulum" },
  { name: "Nasrullah, S.Pd., Gr.", role: "Kesiswaan" },
  { name: "M. Padil Riswandi, S.E.", role: "OPS dan PJOK" },
  { name: "Viny Virzanah", role: "Ubudiyah dan Bahasa Arab" },
  { name: "Risma, S.Pd.", role: "Kesiswaan" },
  { name: "Rizky", role: "Perpustakaan dan Tata Usaha" },
  { name: "Wartiah", role: "Kebersihan" },
  { name: "Martalih", role: "Keamanan" },
  { name: "Diandra", role: "Bahasa Inggris" },
  { name: "Rifka Rahmawati", role: "Bahasa Sunda" },
  { name: "Risma", role: "Koordinator dan Guru Tilawati" },
];

export const newsPosts: NewsPost[] = [
  {
    slug: "informasi-resmi-sdit-fajar-kota-depok",
    title: "Informasi Resmi SDIT Fajar Kota Depok",
    excerpt: schoolIdentity.description,
    content: [
      schoolIdentity.description,
      `Motto: ${schoolIdentity.motto}`,
      `Visi: ${schoolIdentity.vision}`,
      `Alamat: ${schoolIdentity.address}`,
      `Kontak: M. Padil Riswandi dan Viny Virzanah melalui ${schoolIdentity.whatsappDisplay}, atau email ${schoolIdentity.email}.`,
    ],
    category: "Informasi Sekolah",
    featured: true,
  },
];

// Produk hanya diisi setelah sekolah memberikan data resmi.
export const marketplaceProducts: MarketplaceProduct[] = [];

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
