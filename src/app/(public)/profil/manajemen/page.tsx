import type { Metadata } from "next";
import { BadgeCheck, UserRound } from "lucide-react";

import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { schoolIdentity, schoolManagement } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Manajemen Sekolah",
  description: `Data manajemen dan tenaga sekolah ${schoolIdentity.name}.`,
};

export default function ManagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Manajemen Sekolah"
        title="Manajemen dan tenaga sekolah SDIT Fajar"
        description="Daftar nama dan tanggung jawab ditampilkan berdasarkan informasi resmi yang diberikan sekolah."
      />

      <section className="page-shell section-space">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Warga Sekolah"
            title="Bersama menjalankan amanah pendidikan"
            description="Foto anggota manajemen belum tersedia. Setiap kartu menggunakan placeholder yang konsisten tanpa menambahkan informasi personal lain."
          />
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold text-sky-700">
            <BadgeCheck className="size-4" aria-hidden="true" />
            {schoolManagement.length} data terverifikasi
          </span>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {schoolManagement.map((member) => (
            <article key={`${member.name}-${member.role}`} className="clay-card-interactive flex min-h-64 flex-col p-6">
              <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-sky-100 to-cyan-50 text-sky-600 shadow-inner">
                <UserRound className="size-9" aria-hidden="true" />
              </div>
              <div className="mt-auto pt-8">
                <h2 className="text-lg font-extrabold leading-7 text-slate-950">{member.name}</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-sky-700">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Hubungi tim SDIT Fajar"
        description="Gunakan kontak resmi sekolah untuk memperoleh informasi sesuai kebutuhan Anda."
      />
    </>
  );
}
