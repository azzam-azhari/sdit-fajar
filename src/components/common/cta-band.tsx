import { ArrowRight, MessageCircleMore } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { schoolIdentity } from "@/constants/public-data";

type CtaBandProps = {
  title?: string;
  description?: string;
};

export function CtaBand({
  title = "Ingin mengetahui lebih lanjut tentang SDIT Fajar?",
  description = `Hubungi M. Padil Riswandi atau Viny Virzanah melalui WhatsApp ${schoolIdentity.whatsappDisplay}.`,
}: CtaBandProps) {
  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-500 to-sky-700 px-6 py-10 text-white shadow-[0_24px_60px_rgba(14,165,233,0.3)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14">
        <div className="absolute -right-12 -top-20 size-56 rounded-full border-[32px] border-white/10" />
        <div className="relative max-w-2xl">
          <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="mt-3 leading-7 text-sky-50">{description}</p>
        </div>
        <div className="relative mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
          <Button asChild size="lg" className="bg-white text-sky-700 shadow-none hover:bg-sky-50">
            <Link href="/pendaftaran">
              Mulai Pendaftaran <ArrowRight className="size-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
            <a href={schoolIdentity.whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircleMore className="size-5" /> Tanya Kami
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
