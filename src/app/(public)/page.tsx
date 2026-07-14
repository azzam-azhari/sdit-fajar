import type { Metadata } from "next";
import {
  ArrowRight,
  BookHeart,
  CheckCircle2,
  ChevronDown,
  Leaf,
  LibraryBig,
  MessageCircleMore,
  MoonStar,
  Newspaper,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CtaBand } from "@/components/common/cta-band";
import { MarketplaceCard } from "@/components/common/marketplace-card";
import { NewsCard } from "@/components/common/news-card";
import { SectionHeading } from "@/components/common/section-heading";
import { StatsSection } from "@/components/common/stats-section";
import { Button } from "@/components/ui/button";
import {
  marketplaceProducts,
  newsPosts,
  schoolIdentity,
} from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Beranda",
  description: schoolIdentity.description,
};

const values = [
  {
    icon: MoonStar,
    title: "Keimanan dan Ketakwaan",
    description: schoolIdentity.missions[0],
    className: "lg:col-span-5",
  },
  {
    icon: BookHeart,
    title: "Cerdas dan Berakhlak",
    description: schoolIdentity.missions[1],
    className: "lg:col-span-7",
  },
  {
    icon: UsersRound,
    title: "Suasana Kekeluargaan",
    description: schoolIdentity.missions[4],
    className: "lg:col-span-7",
  },
  {
    icon: Leaf,
    title: "Peduli Lingkungan",
    description: schoolIdentity.missions[5],
    className: "lg:col-span-5",
  },
];

const faqs = [
  {
    question: "Di mana lokasi SDIT Fajar?",
    answer: schoolIdentity.address,
  },
  {
    question: "Siapa yang dapat dihubungi untuk informasi sekolah?",
    answer: `${schoolIdentity.contacts[0].name} dan ${schoolIdentity.contacts[1].name} dapat dihubungi melalui WhatsApp ${schoolIdentity.whatsappDisplay}.`,
  },
  {
    question: "Apa email resmi SDIT Fajar?",
    answer: schoolIdentity.email,
  },
  {
    question: "Bagaimana memulai pendaftaran murid baru?",
    answer:
      "Buka halaman Pendaftaran, lengkapi data calon murid dan orang tua atau wali, kemudian siapkan dokumen yang diminta.",
  },
];

function DecorativeCircles({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <span
        className={`absolute -top-14 size-40 rounded-full bg-sky-200/35 ${
          mirrored ? "-left-12" : "-right-12"
        }`}
      />
      <span
        className={`absolute bottom-5 size-20 rounded-full border-[12px] border-sky-100/55 ${
          mirrored ? "right-6" : "left-6"
        }`}
      />
      <span
        className={`absolute -bottom-10 size-28 rounded-full bg-cyan-100/45 ${
          mirrored ? "left-1/3" : "right-1/3"
        }`}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="page-shell pb-10 pt-10 sm:pt-14 lg:pb-16">
        <div className="clay-card relative overflow-hidden px-6 py-8 sm:px-10 sm:py-12 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-14 lg:py-14">
          <div className="absolute -left-24 -top-28 size-72 rounded-full bg-sky-200/55 blur-3xl" />
          <div className="absolute -bottom-32 right-1/3 size-72 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">
              <Sparkles className="size-4" />
              Penerimaan Murid Baru
            </span>
            <h1 className="text-balance mt-6 text-4xl font-extrabold leading-[1.06] text-slate-950 sm:text-5xl lg:text-[4rem]">
              Generasi Qurani, <span className="text-sky-500">cerdas</span>, dan berakhlak mulia.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              {schoolIdentity.description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/pendaftaran">
                  Daftar Sekarang <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={schoolIdentity.whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircleMore className="size-5" /> Hubungi Sekolah
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" /> Berlandaskan iman
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" /> Inspiratif
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" /> Peduli lingkungan
              </span>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.2rem] border-4 border-white bg-sky-100 shadow-[0_25px_60px_rgba(14,165,233,0.22)] sm:aspect-square">
              <Image
                src="/images/hero-sdit-fajar.png"
                alt="Ilustrasi lingkungan belajar Islami dengan gedung sekolah, buku terbuka, dan pepohonan"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/15 via-transparent to-white/10" />
            </div>

            <div
              className="float-soft absolute left-3 top-5 z-20 inline-flex items-center gap-2 rounded-2xl border border-white/90 bg-white/90 px-4 py-3 text-sm font-extrabold text-sky-700 shadow-[0_14px_35px_rgba(14,165,233,0.22)] backdrop-blur sm:-left-5 sm:top-10"
              aria-hidden="true"
            >
              <BookHeart className="size-5" />
              Qurani
            </div>

            <div
              className="float-soft absolute -right-1 top-[24%] z-20 grid size-14 place-items-center rounded-2xl border border-white/90 bg-amber-300 text-amber-900 shadow-[0_14px_35px_rgba(245,158,11,0.25)] sm:-right-5 sm:size-16 [animation-delay:1.2s]"
              aria-hidden="true"
            >
              <Sparkles className="size-7" />
            </div>

            <div
              className="float-soft absolute bottom-5 left-4 z-20 inline-flex items-center gap-2 rounded-2xl border border-white/90 bg-white/90 px-4 py-3 text-sm font-extrabold text-emerald-700 shadow-[0_14px_35px_rgba(16,185,129,0.22)] backdrop-blur sm:-left-5 sm:bottom-10 [animation-delay:2.1s]"
              aria-hidden="true"
            >
              <Leaf className="size-5" />
              Peduli lingkungan
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section-space">
        <SectionHeading
          eyebrow="Arah Pendidikan"
          title="Berlandaskan visi dan misi sekolah"
          description={schoolIdentity.vision}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className={`clay-card-interactive relative isolate overflow-hidden p-6 sm:p-8 ${value.className}`}
              >
                <DecorativeCircles mirrored={index % 2 === 1} />
                <span className="relative z-10 grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600 shadow-inner">
                  <Icon className="size-7" />
                </span>
                <h2 className="relative z-10 mt-6 text-2xl font-extrabold text-slate-950">{value.title}</h2>
                <p className="relative z-10 mt-3 max-w-xl leading-7 text-slate-600">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-sky-100 bg-sky-50/70 py-14 sm:py-16">
        <div className="page-shell">
          <StatsSection />
        </div>
      </section>

      <section className="page-shell section-space">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="clay-card relative min-h-[25rem] overflow-hidden bg-sky-100">
            <Image
              src="/images/lingkungan-pemimpin.png"
              alt="Ilustrasi peserta didik bekerja sama menanam dan merawat pohon di lingkungan sekolah"
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="scale-[1.04] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/10 via-transparent to-white/5" />
          </div>
          <div>
            <SectionHeading
              eyebrow="Motto, Visi, dan Misi"
              title="Lingkungan membentuk jiwa pemimpin"
              description={schoolIdentity.vision}
            />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {schoolIdentity.missions.slice(0, 2).map((mission, index) => (
                <article key={mission} className="clay-card p-5">
                  {index === 0 ? (
                    <MoonStar className="size-7 text-sky-500" />
                  ) : (
                    <UsersRound className="size-7 text-sky-500" />
                  )}
                  <h3 className="mt-4 font-extrabold text-slate-950">Misi {index + 1}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{mission}</p>
                </article>
              ))}
            </div>
            <Button asChild variant="secondary" className="mt-7">
              <Link href="/profil">
                Lihat Profil Lengkap <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Kabar Fajar"
            title="Berita resmi sekolah"
            description="Berita akan ditampilkan setelah data resmi diterbitkan oleh sekolah."
          />
          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/berita">
              Halaman Berita <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {newsPosts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {newsPosts.slice(0, 3).map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="clay-card mt-10 p-10 text-center">
            <Newspaper className="mx-auto size-10 text-sky-300" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-extrabold text-slate-950">Belum ada berita resmi</h3>
            <p className="mt-2 text-slate-600">Konten berita akan hadir setelah dipublikasikan oleh sekolah.</p>
          </div>
        )}
      </section>

      <section className="border-y border-sky-100 bg-white/65 py-20">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Komitmen Sekolah"
            title="Enam misi yang dijalankan bersama"
            description="Misi menjadi arah bagi proses pembelajaran, bimbingan, prestasi, kekeluargaan, dan kepedulian lingkungan."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {schoolIdentity.missions.map((mission, index) => (
              <article key={mission} className="clay-card relative isolate overflow-hidden p-7">
                <DecorativeCircles mirrored={index % 2 === 1} />
                <span className="relative z-10 grid size-11 place-items-center rounded-xl bg-sky-100 font-extrabold text-sky-700">
                  {index + 1}
                </span>
                <p className="relative z-10 mt-5 font-bold leading-8 text-slate-700">{mission}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell section-space">
        <SectionHeading
          eyebrow="Marketplace Pembelajaran"
          title="Konten resmi dari sekolah"
          description="Produk hanya akan ditampilkan setelah data katalog resmi diterbitkan. Pembelian tetap khusus melalui akun wali murid."
        />
        {marketplaceProducts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {marketplaceProducts.slice(0, 3).map((product) => (
              <MarketplaceCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="clay-card mt-10 p-10 text-center">
            <LibraryBig className="mx-auto size-10 text-sky-300" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-extrabold text-slate-950">Katalog sedang disiapkan</h3>
            <p className="mt-2 text-slate-600">Belum ada produk resmi yang dipublikasikan.</p>
          </div>
        )}
        <div className="mt-8 text-center">
          <Button asChild variant="secondary">
            <Link href="/marketplace">
              Lihat Marketplace <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Pertanyaan Umum"
            title="Informasi resmi untuk keluarga"
            description="Hubungi sekolah apabila informasi yang Anda cari belum tersedia pada halaman ini."
          />
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="clay-card group px-6 py-1 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-extrabold text-slate-900">
                  {faq.question}
                  <ChevronDown className="size-5 shrink-0 text-sky-500 transition group-open:rotate-180" />
                </summary>
                <p className="border-t border-sky-100 pb-6 pt-4 leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
