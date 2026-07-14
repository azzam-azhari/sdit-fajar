import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Clock3, Newspaper, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsCard } from "@/components/common/news-card";
import { Button } from "@/components/ui/button";
import { newsPosts } from "@/constants/public-data";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);

  if (!post) return { title: "Berita Tidak Ditemukan" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.image ? { images: [{ url: post.image, alt: post.title }] } : {}),
      type: "article",
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const relatedPosts = newsPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article className="page-shell pt-10 sm:pt-14">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="-ml-3 mb-5">
            <Link href="/berita"><ArrowLeft className="size-4" /> Kembali ke Berita</Link>
          </Button>
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sky-700">{post.category}</span>
          <h1 className="text-balance mt-5 text-4xl font-extrabold leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
            {post.publishedAt && <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-sky-500" />{post.publishedAt}</span>}
            {post.readingTime && <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-sky-500" />{post.readingTime}</span>}
            <span className="inline-flex items-center gap-2"><Share2 className="size-4 text-sky-500" />Kabar SDIT Fajar</span>
          </div>
        </div>

        <div className="relative mx-auto mt-10 min-h-[22rem] max-w-6xl overflow-hidden rounded-[2.2rem] border-4 border-white shadow-[0_24px_60px_rgba(14,165,233,0.2)] sm:min-h-[34rem]">
          {post.image ? (
            <Image src={post.image} alt={`Dokumentasi ${post.title}`} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
          ) : (
            <div className="grid min-h-[22rem] place-items-center bg-gradient-to-br from-sky-100 via-white to-amber-100 sm:min-h-[34rem]">
              <Newspaper className="size-28 text-sky-400" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="clay-card mx-auto -mt-10 max-w-4xl px-6 py-10 sm:px-12 sm:py-14 lg:relative">
          <div className="space-y-6 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-10 rounded-2xl bg-sky-50 p-6 text-center">
            <p className="font-extrabold text-sky-800">Terima kasih telah mengikuti kabar SDIT Fajar.</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Mari terus mendampingi setiap langkah baik anak di sekolah dan di rumah.</p>
          </div>
        </div>
      </article>

      <section className="page-shell section-space">
        <div className="flex items-end justify-between gap-5">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-600">Baca Juga</p><h2 className="mt-2 text-3xl font-extrabold text-slate-950">Cerita lainnya</h2></div>
          <Button asChild variant="secondary" className="hidden sm:inline-flex"><Link href="/berita">Semua Berita</Link></Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{relatedPosts.map((item) => <NewsCard key={item.slug} post={item} />)}</div>
      </section>
    </>
  );
}
