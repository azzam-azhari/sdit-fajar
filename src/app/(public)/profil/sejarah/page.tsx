import type { Metadata } from "next";
import { Archive, FileClock, Images, School } from "lucide-react";

import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { schoolIdentity } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Sejarah Sekolah",
  description: `Halaman sejarah resmi ${schoolIdentity.name}.`,
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Sejarah Sekolah"
        title="Jejak perjalanan SDIT Fajar"
        description="Informasi sejarah dan tonggak perkembangan sekolah sedang disiapkan berdasarkan arsip resmi SDIT Fajar."
      />

      <section className="page-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Arsip Resmi"
            title="Sejarah disusun dari sumber yang dapat dipertanggungjawabkan"
            description="Kami tidak menampilkan tahun, peristiwa, atau pencapaian yang belum dikonfirmasi oleh sekolah."
          />
          <div className="clay-card p-7 sm:p-9">
            <span className="grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <Archive className="size-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-950">Dokumentasi sedang disiapkan</h2>
            <p className="mt-3 leading-8 text-slate-600">
              Narasi sejarah, tahun berdiri, milestone, dan dokumentasi foto akan ditampilkan setelah data resmi tersedia.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: FileClock, title: "Linimasa", text: "Menunggu verifikasi tahun dan peristiwa resmi." },
            { icon: School, title: "Perkembangan Sekolah", text: "Menunggu data perkembangan yang telah disetujui sekolah." },
            { icon: Images, title: "Dokumentasi Foto", text: "Menunggu foto resmi beserta keterangan yang sesuai." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="clay-card p-6 text-center">
                <Icon className="mx-auto size-8 text-sky-500" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-extrabold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Informasi resmi SDIT Fajar"
        description="Hubungi sekolah apabila Anda memerlukan informasi yang belum tersedia pada halaman sejarah."
      />
    </>
  );
}
