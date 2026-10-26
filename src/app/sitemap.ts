import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sditfajar.sch.id";
  const now = new Date();

  const publicRoutes = [
    "",
    "/profil",
    "/profil/sejarah",
    "/profil/manajemen",
    "/kurikulum",
    "/ekstrakurikuler",
    "/berita",
    "/pendaftaran",
    "/pendaftaran/status",
    "/marketplace",
    "/kontak",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/pendaftaran" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/pendaftaran" ? 0.9 : 0.7,
  }));
}
