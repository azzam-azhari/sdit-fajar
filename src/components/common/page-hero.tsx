import { ArrowDownRight } from "lucide-react";
import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export function PageHero({ eyebrow, title, description, image, imageAlt = "" }: PageHeroProps) {
  return (
    <section className="page-shell pt-10 sm:pt-14">
      <div className="clay-card relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-sky-200/55 blur-3xl" />
        <div className="absolute -bottom-28 left-1/4 size-64 rounded-full bg-cyan-100/70 blur-3xl" />
        <div className={image ? "relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]" : "relative max-w-3xl"}>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">
              {eyebrow}
              <ArrowDownRight className="size-4" aria-hidden="true" />
            </span>
            <h1 className="text-balance mt-5 text-4xl font-extrabold leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
          </div>
          {image && (
            <div className="relative min-h-72 overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_22px_50px_rgba(14,165,233,0.2)] sm:min-h-80">
              <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
