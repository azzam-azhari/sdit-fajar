import type { Metadata } from "next";
import { BookHeart, Brain, HandHeart, Images, Leaf, MoonStar, Target } from "lucide-react";

import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { schoolIdentity } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Profil Sekolah",
  description: `Profil, motto, visi, dan misi ${schoolIdentity.name}.`,
};

const values = [
  { icon: MoonStar, title: "Beriman dan Bertakwa", description: schoolIdentity.missions[0] },
  { icon: Brain, title: "Cerdas dan Inovatif", description: schoolIdentity.missions[1] },
  { icon: HandHeart, title: "Kekeluargaan", description: schoolIdentity.missions[4] },
  { icon: Leaf, title: "Peduli Lingkungan", description: schoolIdentity.missions[5] },
];

export default function ProfilePage() {
  return (
    <>
      <PageHero
        eyebrow="Profil Sekolah"
        title="SDIT Fajar Kota Depok"
        description={schoolIdentity.description}
      />

      <section className="page-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Motto Sekolah"
            title={schoolIdentity.motto}
            description="Motto ini menjadi pengingat bahwa lingkungan dan interaksi sosial berperan penting dalam menumbuhkan jiwa kepemimpinan peserta didik."
          />
          <div className="clay-card p-7 sm:p-9">
            <p className="text-lg font-bold leading-9 text-slate-700">{schoolIdentity.description}</p>
            <div className="mt-7 rounded-2xl bg-sky-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-600">Alamat</p>
              <p className="mt-2 leading-7 text-slate-700">{schoolIdentity.address}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-sky-50/65 py-20">
        <div className="page-shell">
          <SectionHeading eyebrow="Arah Pendidikan" title="Nilai yang tercermin dalam visi dan misi" align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="clay-card-interactive p-6 text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                    <Icon className="size-7" />
                  </span>
                  <h2 className="mt-5 text-xl font-extrabold text-slate-950">{value.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-shell section-space">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {["Dokumentasi lingkungan sekolah", "Dokumentasi kegiatan pembelajaran", "Dokumentasi warga sekolah"].map((label) => (
            <div key={label} className="clay-card flex min-h-64 flex-col items-center justify-center bg-gradient-to-br from-white to-sky-50 p-8 text-center">
              <span className="grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-500">
                <Images className="size-8" aria-hidden="true" />
              </span>
              <p className="mt-5 font-extrabold text-slate-800">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Foto resmi belum tersedia.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="clay-card p-7 sm:p-9">
            <span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <Target className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-950">Visi</h2>
            <p className="mt-3 text-lg font-bold leading-8 text-slate-700">{schoolIdentity.vision}</p>
          </article>
          <article className="clay-card p-7 sm:p-9">
            <span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <BookHeart className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-950">Misi</h2>
            <ol className="mt-5 space-y-4">
              {schoolIdentity.missions.map((mission, index) => (
                <li key={mission} className="flex gap-4 leading-7 text-slate-600">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-100 text-sm font-extrabold text-sky-700">
                    {index + 1}
                  </span>
                  <span>{mission}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <CtaBand
        title="Kenali SDIT Fajar lebih dekat"
        description="Hubungi kontak resmi sekolah untuk memperoleh informasi yang dibutuhkan keluarga."
      />
    </>
  );
}
