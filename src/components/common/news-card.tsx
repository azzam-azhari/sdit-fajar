import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { NewsPost } from "@/constants/public-data";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="clay-card-interactive group flex h-full flex-col overflow-hidden">
      <Link href={`/berita/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={`Dokumentasi ${post.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full place-items-center bg-gradient-to-br from-sky-100 via-white to-amber-100">
            <Newspaper className="size-14 text-sky-400 transition duration-500 group-hover:scale-110" aria-hidden="true" />
          </span>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-extrabold text-sky-700 shadow-sm backdrop-blur">
          {post.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        {post.publishedAt && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <CalendarDays className="size-4 text-sky-500" />
            {post.publishedAt}
          </div>
        )}
        <h3 className="mt-3 text-xl font-extrabold leading-snug text-slate-950">
          <Link href={`/berita/${post.slug}`} className="hover:text-sky-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <Link
          href={`/berita/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-sky-700"
          aria-label={`Baca berita: ${post.title}`}
        >
          Baca selengkapnya
          <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
