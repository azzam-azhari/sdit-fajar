import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NewsCard } from "@/components/common/news-card";
import { PageHero } from "@/components/common/page-hero";
import { Button } from "@/components/ui/button";
import { newsPosts } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita resmi SDIT Fajar Kota Depok.",
};

const PAGE_SIZE = 4;

type NewsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  if (newsPosts.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Kabar Fajar"
          title="Berita resmi sekolah"
          description="Halaman ini hanya menampilkan berita yang telah diterbitkan oleh SDIT Fajar."
        />
        <section className="page-shell section-space">
          <div className="clay-card p-10 text-center sm:p-14">
            <Newspaper className="mx-auto size-12 text-sky-300" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-extrabold text-slate-950">Belum ada berita resmi</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Berita akan ditampilkan setelah konten resmi sekolah tersedia dan dipublikasikan.
            </p>
          </div>
        </section>
      </>
    );
  }

  const query = await searchParams;
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const totalPages = Math.ceil(newsPosts.length / PAGE_SIZE);
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = newsPosts.slice(start, start + PAGE_SIZE);
  const featuredPost = newsPosts.find((post) => post.featured) ?? newsPosts[0];

  return (
    <>
      <PageHero
        eyebrow="Kabar Fajar"
        title="Berita resmi sekolah"
        description="Ikuti informasi yang telah diterbitkan oleh SDIT Fajar."
      />

      {currentPage === 1 && featuredPost && (
        <section className="page-shell pt-12">
          <article className="clay-card-interactive group overflow-hidden lg:grid lg:grid-cols-[1.15fr_0.85fr]">
            <Link href={`/berita/${featuredPost.slug}`} className="relative block min-h-80 overflow-hidden lg:min-h-[28rem]">
              {featuredPost.image ? (
                <>
                  <Image src={featuredPost.image} alt={`Dokumentasi ${featuredPost.title}`} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                </>
              ) : (
                <span className="grid h-full min-h-80 place-items-center bg-gradient-to-br from-sky-100 via-white to-amber-100 lg:min-h-[28rem]">
                  <Newspaper className="size-24 text-sky-400 transition duration-500 group-hover:scale-110" aria-hidden="true" />
                </span>
              )}
            </Link>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <span className="w-fit rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sky-700">Berita Utama</span>
              <h2 className="mt-5 text-balance text-3xl font-extrabold leading-tight text-slate-950">{featuredPost.title}</h2>
              <p className="mt-4 leading-8 text-slate-600">{featuredPost.excerpt}</p>
              {(featuredPost.publishedAt || featuredPost.readingTime) && (
                <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                  {featuredPost.publishedAt && <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-sky-500" />{featuredPost.publishedAt}</span>}
                  {featuredPost.readingTime && <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-sky-500" />{featuredPost.readingTime}</span>}
                </div>
              )}
              <Button asChild className="mt-7 w-fit">
                <Link href={`/berita/${featuredPost.slug}`}>Baca Berita <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
          </article>
        </section>
      )}

      <section className="page-shell section-space">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-600">Arsip Berita</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Kabar terbaru sekolah</h2>
          </div>
          <p className="text-sm font-bold text-slate-500">Halaman {currentPage} dari {totalPages}</p>
        </div>

        {pagePosts.length > 0 ? (
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pagePosts.map((post) => <NewsCard key={post.slug} post={post} />)}
          </div>
        ) : (
          <div className="clay-card mt-9 p-10 text-center text-slate-600">Belum ada berita untuk halaman ini.</div>
        )}

        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Navigasi halaman berita">
          <Button asChild variant="secondary" className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>
            <Link href={`/berita?page=${currentPage - 1}`} aria-disabled={currentPage === 1} tabIndex={currentPage === 1 ? -1 : undefined}>
              <ArrowLeft className="size-4" /> Sebelumnya
            </Link>
          </Button>
          <div className="hidden gap-2 sm:flex">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Link key={page} href={`/berita?page=${page}`} className={`grid size-11 place-items-center rounded-xl text-sm font-extrabold transition ${page === currentPage ? "bg-sky-500 text-white shadow-lg" : "bg-white text-slate-600 hover:bg-sky-50"}`} aria-current={page === currentPage ? "page" : undefined}>{page}</Link>
            ))}
          </div>
          <Button asChild variant="secondary" className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}>
            <Link href={`/berita?page=${currentPage + 1}`} aria-disabled={currentPage === totalPages} tabIndex={currentPage === totalPages ? -1 : undefined}>
              Berikutnya <ArrowRight className="size-4" />
            </Link>
          </Button>
        </nav>
      </section>
    </>
  );
}
