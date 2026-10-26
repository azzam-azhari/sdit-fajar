export interface NavChildItem {
  href: string;
  label: string;
  desc?: string;
}

export interface NavLinkItem {
  href: string;
  label: string;
  children?: NavChildItem[];
}

export const PUBLIC_NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "Beranda" },
  {
    href: "/profil",
    label: "Profil",
    children: [
      {
        href: "/profil",
        label: "Tentang Sekolah",
        desc: "Visi, misi, dan falsafah pendidikan Islam",
      },
      {
        href: "/profil/sejarah",
        label: "Sejarah",
        desc: "Perjalanan pendirian dan milestone SDIT Fajar",
      },
      {
        href: "/profil/manajemen",
        label: "Manajemen Sekolah",
        desc: "Dewan pembina, pimpinan, dan Dewan Guru",
      },
    ],
  },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/berita", label: "Berita" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/kontak", label: "Kontak" },
];
