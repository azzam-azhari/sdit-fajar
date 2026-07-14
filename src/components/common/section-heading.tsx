import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <span
        className={cn(
          "mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700",
          align === "center" && "mx-auto",
        )}
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl lg:text-[2.8rem]">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>}
    </div>
  );
}
