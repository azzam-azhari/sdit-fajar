import type { Metadata } from "next";
import { BookOpen, CircleDot, Goal, Mountain, Shield } from "lucide-react";

import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { schoolIdentity } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Ekstrakurikuler",
  description: `Daftar kegiatan ekstrakurikuler ${schoolIdentity.name}.`,
};

const activities = [
  { title: "Pramuka", icon: Mountain },
  { title: "Memanah", icon: CircleDot },
  { title: "Taekwondo", icon: Shield },
  { title: "Tahfidz", icon: BookOpen },
  { title: "Futsal", icon: Goal },
];

export default function ExtracurricularPage() {
  return (
    <>
      <PageHero
        eyebrow="Ekstrakurikuler"
        title="Kegiatan pengembangan bakat peserta didik"
        description={schoolIdentity.missions[2]}
      />

      <section className="page-shell section-space">
        <SectionHeading
          eyebrow="Daftar Kegiatan"
          title="Pilihan ekstrakurikuler SDIT Fajar"
          description="Nama kegiatan mengikuti dokumentasi sekolah. Jadwal, pembina, jenjang, biaya, dan detail pelaksanaan belum ditampilkan karena data resmi belum tersedia."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <article key={activity.title} className="clay-card-interactive flex min-h-60 flex-col items-center justify-center p-7 text-center">
                <span className="grid size-16 place-items-center rounded-[1.5rem] bg-sky-100 text-sky-600 shadow-inner">
                  <Icon className="size-8" aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-2xl font-extrabold text-slate-950">{activity.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">Informasi kegiatan akan diperbarui setelah data resmi tersedia.</p>
              </article>
            );
          })}
          <article className="clay-card flex min-h-60 flex-col justify-center bg-sky-500 p-7 text-white sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-100">Informasi Resmi</p>
            <p className="mt-4 text-xl font-extrabold leading-8">Hubungi sekolah untuk mengetahui ketersediaan dan pelaksanaan kegiatan.</p>
          </article>
        </div>
      </section>

      <CtaBand
        title="Tanyakan kegiatan yang sesuai"
        description="Gunakan kontak resmi SDIT Fajar untuk informasi ekstrakurikuler terbaru."
      />
    </>
  );
}
