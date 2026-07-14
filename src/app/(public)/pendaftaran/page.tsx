import type { Metadata } from "next";
import { CheckCircle2, ClipboardCheck, FileUp, MessageCircleMore, UserRoundCheck } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { RegistrationForm } from "@/components/common/registration-form";
import { SectionHeading } from "@/components/common/section-heading";

export const metadata: Metadata = {
  title: "Pendaftaran Murid Baru",
  description: "Informasi dan formulir pendaftaran murid baru SDIT Fajar tahun ajaran 2026/2027.",
};

const steps = [
  { icon: ClipboardCheck, number: "01", title: "Isi data", text: "Lengkapi data calon murid dan orang tua/wali sesuai dokumen resmi." },
  { icon: FileUp, number: "02", title: "Siapkan dokumen", text: "Lampirkan Kartu Keluarga dan Akta Kelahiran dalam format yang didukung." },
  { icon: UserRoundCheck, number: "03", title: "Verifikasi sekolah", text: "Tim penerimaan memeriksa kelengkapan dan menghubungi keluarga untuk tahap berikutnya." },
  { icon: MessageCircleMore, number: "04", title: "Informasi lanjutan", text: "Keluarga menerima jadwal kegiatan, hasil review, dan petunjuk administrasi." },
];

export default function RegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Penerimaan Murid Baru"
        title="Mulai perjalanan belajar bersama SDIT Fajar"
        description="Isi data dengan teliti, siapkan dokumen, dan tim kami akan membantu keluarga melalui setiap tahap pendaftaran tahun ajaran 2026/2027."
      />

      <section className="page-shell section-space">
        <SectionHeading eyebrow="Alur Pendaftaran" title="Empat langkah yang mudah diikuti" description="Halaman pendaftaran dapat diakses tanpa login. Data baru akan tersimpan setelah layanan backend private dan validasi server tersedia." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="clay-card relative p-6">
                <span className="absolute right-5 top-4 text-4xl font-extrabold text-sky-100">{step.number}</span>
                <span className="grid size-13 place-items-center rounded-2xl bg-sky-100 text-sky-600"><Icon className="size-6" /></span>
                <h2 className="mt-5 text-xl font-extrabold text-slate-950">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {["Dapat diakses tanpa login", "Dokumen divalidasi", "Review oleh petugas berwenang"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-extrabold text-emerald-800"><CheckCircle2 className="size-5 shrink-0 text-emerald-500" />{item}</div>)}
        </div>
        <RegistrationForm />
      </section>
    </>
  );
}
