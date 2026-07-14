import type { Metadata } from "next";
import { Award, BookOpenCheck, BrainCircuit, Heart, Leaf, MoonStar, Sparkles, UsersRound } from "lucide-react";

import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { schoolIdentity } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Kurikulum",
  description: `Arah pembelajaran dan bimbingan ${schoolIdentity.name}.`,
};

const missionIcons = [MoonStar, BrainCircuit, Sparkles, Award, UsersRound, Leaf];

export default function CurriculumPage() {
  return (
    <>
      <PageHero
        eyebrow="Kurikulum"
        title="Pembelajaran dan bimbingan yang selaras dengan visi sekolah"
        description={schoolIdentity.vision}
      />

      <section className="page-shell section-space">
        <SectionHeading
          eyebrow="Arah Pembelajaran"
          title="Enam misi sebagai dasar pelaksanaan pendidikan"
          description="Informasi program, jadwal, target, dan kegiatan khusus hanya akan ditambahkan setelah data resmi tersedia."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {schoolIdentity.missions.map((mission, index) => {
            const Icon = missionIcons[index];
            return (
              <article key={mission} className="clay-card-interactive p-7">
                <span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-sky-600">Misi {index + 1}</p>
                <p className="mt-3 font-bold leading-8 text-slate-700">{mission}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-sky-100 bg-sky-50/70 py-20">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Prinsip Pembelajaran"
            title="Iman, keterampilan, dan kepedulian lingkungan"
            description="Ketiga arah ini diambil langsung dari visi SDIT Fajar."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="clay-card p-6">
              <BookOpenCheck className="size-8 text-sky-500" />
              <h2 className="mt-5 text-lg font-extrabold text-slate-950">Beriman</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">Keimanan dan ketakwaan ditanamkan agar peserta didik taat beribadah.</p>
            </article>
            <article className="clay-card p-6">
              <Heart className="size-8 text-sky-500" />
              <h2 className="mt-5 text-lg font-extrabold text-slate-950">Terampil</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">Pembelajaran dan bimbingan diarahkan untuk mengembangkan bakat peserta didik.</p>
            </article>
            <article className="clay-card p-6">
              <Leaf className="size-8 text-sky-500" />
              <h2 className="mt-5 text-lg font-extrabold text-slate-950">Peduli</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">Budaya sekolah diarahkan untuk peduli terhadap lingkungan hidup.</p>
            </article>
          </div>
        </div>
      </section>

      <CtaBand
        title="Informasi pembelajaran SDIT Fajar"
        description="Hubungi sekolah untuk memperoleh keterangan resmi mengenai kurikulum dan kegiatan pembelajaran."
      />
    </>
  );
}
