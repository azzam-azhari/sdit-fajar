import { MessageCircleMore } from "lucide-react";

import { siteConfig } from "@/constants/public-data";

export function FloatingWhatsapp() {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 p-3.5 font-extrabold text-white shadow-[0_14px_35px_rgba(16,185,129,0.35)] transition hover:-translate-y-1 hover:bg-emerald-600 sm:bottom-6 sm:right-6 sm:px-5"
      aria-label="Hubungi SDIT Fajar melalui WhatsApp"
    >
      <MessageCircleMore className="size-6" />
      <span className="hidden sm:inline">Tanya Sekolah</span>
    </a>
  );
}
