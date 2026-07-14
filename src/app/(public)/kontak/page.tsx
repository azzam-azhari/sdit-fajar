import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircleMore, Phone } from "lucide-react";

import { ContactForm } from "@/components/common/contact-form";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { schoolIdentity } from "@/constants/public-data";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Alamat, nomor WhatsApp, email, dan media sosial resmi ${schoolIdentity.name}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi SDIT Fajar Kota Depok"
        description="Gunakan alamat, nomor WhatsApp, dan email resmi berikut untuk memperoleh informasi sekolah."
      />

      <section className="page-shell section-space">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {schoolIdentity.contacts.map((contact) => (
            <a
              key={contact.name}
              href={schoolIdentity.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="clay-card-interactive p-6"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-sky-100 text-sky-600">
                <Phone className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-extrabold text-slate-950">{contact.name}</h2>
              <p className="mt-2 text-sm font-bold text-sky-700">{contact.phone}</p>
            </a>
          ))}
          <a href={`mailto:${schoolIdentity.email}`} className="clay-card-interactive p-6">
            <span className="grid size-12 place-items-center rounded-xl bg-sky-100 text-sky-600">
              <Mail className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-extrabold text-slate-950">Email</h2>
            <p className="mt-2 break-all text-sm font-bold text-sky-700">{schoolIdentity.email}</p>
          </a>
          <div className="clay-card p-6">
            <span className="grid size-12 place-items-center rounded-xl bg-sky-100 text-sky-600">
              <AtSign className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-extrabold text-slate-950">Media Sosial</h2>
            <p className="mt-2 text-sm font-bold text-sky-700">{schoolIdentity.socialHandle}</p>
          </div>
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Kirim Pesan"
              title="Sampaikan pertanyaan melalui email"
              description="Formulir akan menyiapkan email pada perangkat Anda. Untuk menghubungi sekolah melalui WhatsApp, gunakan tombol kontak resmi."
            />
            <a
              href={schoolIdentity.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-extrabold text-white shadow-[0_12px_30px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              <MessageCircleMore className="size-5" />
              WhatsApp {schoolIdentity.whatsappDisplay}
            </a>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <div className="clay-card mb-6 flex items-start gap-4 p-6">
          <MapPin className="mt-1 size-6 shrink-0 text-sky-500" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-extrabold text-slate-950">Alamat SDIT Fajar</h2>
            <p className="mt-2 leading-7 text-slate-600">{schoolIdentity.address}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_24px_60px_rgba(14,165,233,0.18)]">
          <iframe
            src={schoolIdentity.mapEmbedUrl}
            title="Peta SDIT Fajar"
            width="100%"
            height="460"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block border-0"
          />
        </div>
      </section>
    </>
  );
}
