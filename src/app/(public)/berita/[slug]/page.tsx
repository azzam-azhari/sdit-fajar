import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { getPublicNewsBySlug } from "@/lib/data/news";
import { ShareButton } from "../_components/share-button";

interface DetailBeritaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DetailBeritaPageProps) {
  const { slug } = await params;
  const article = await getPublicNewsBySlug(slug);
  return {
    title: `${article.title} — SDIT Fajar`,
    description: article.content[0] || "Warta resmi kegiatan dan prestasi SDIT Fajar.",
  };
}

export default async function DetailBeritaPage({
  params,
}: DetailBeritaPageProps) {
  const { slug } = await params;
  const articleData = await getPublicNewsBySlug(slug);

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

            <ShareButton title={articleData.title} />
          </div>
        </footer>
      </article>
    </div>
  );
}
