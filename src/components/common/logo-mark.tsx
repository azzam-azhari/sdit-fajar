import { BookOpenText, Sparkles } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoMarkProps = {
  compact?: boolean;
  className?: string;
};

export function LogoMark({ compact = false, className }: LogoMarkProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3 rounded-2xl", className)}
      aria-label="SDIT Fajar - Beranda"
    >
      <span className="relative grid size-12 shrink-0 place-items-center rounded-[1.15rem] bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-[0_10px_25px_rgba(14,165,233,0.3)] transition group-hover:-rotate-3">
        <BookOpenText className="size-6" aria-hidden="true" />
        <Sparkles className="absolute -right-1 -top-1 size-4 rounded-full bg-amber-300 p-0.5 text-amber-900" aria-hidden="true" />
      </span>
      {!compact && (
        <span>
          <span className="block font-[family-name:var(--font-heading)] text-base font-extrabold leading-tight text-slate-950">
            SDIT Fajar
          </span>
          <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-sky-600">
            Kota Depok
          </span>
        </span>
      )}
    </Link>
  );
}
