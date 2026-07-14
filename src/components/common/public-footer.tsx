import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { LogoMark } from "@/components/common/logo-mark";
import { schoolIdentity } from "@/constants/public-data";

const footerLinks = [
  { href: "/profil", label: "Profil Sekolah" },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/berita", label: "Berita" },
  { href: "/pendaftaran", label: "Pendaftaran" },
  { href: "/marketplace", label: "Marketplace" },
];

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-sky-100 bg-white/88 pt-16 backdrop-blur-xl">
      <div className="page-shell grid gap-10 pb-12 lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <LogoMark />
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            {schoolIdentity.description}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-extrabold text-sky-700">
            <AtSign className="size-5" aria-hidden="true" />
            Media sosial {schoolIdentity.socialHandle}
          </div>
        </div>

        <div>
          <h2 className="text-base font-extrabold text-slate-950">Tautan Cepat</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-bold text-slate-600">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-sky-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 space-y-3 text-sm text-slate-600">
            <a href={`mailto:${schoolIdentity.email}`} className="flex items-center gap-3 hover:text-sky-700">
              <Mail className="size-4 text-sky-500" />
              {schoolIdentity.email}
            </a>
            {schoolIdentity.contacts.map((contact) => (
              <a key={contact.name} href={`tel:+${schoolIdentity.whatsappNumber}`} className="flex items-start gap-3 hover:text-sky-700">
                <Phone className="mt-0.5 size-4 shrink-0 text-sky-500" />
                <span><span className="block font-bold text-slate-700">{contact.name}</span>{contact.phone}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-extrabold text-slate-950">Temukan Kami</h2>
          <p className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-600">
            <MapPin className="mt-0.5 size-4 shrink-0 text-sky-500" />
            {schoolIdentity.address}
          </p>
          <div className="mt-5 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-[0_16px_35px_rgba(14,165,233,0.14)]">
            <iframe
              src={schoolIdentity.mapEmbedUrl}
              title="Peta lokasi SDIT Fajar"
              width="100%"
              height="210"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block border-0"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-sky-100 py-5 text-center text-xs font-semibold text-slate-500">
        {schoolIdentity.copyright}
      </div>
    </footer>
  );
}
