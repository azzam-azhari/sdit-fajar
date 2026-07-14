import { HandHeart, Leaf, MoonStar } from "lucide-react";

import { schoolIdentity } from "@/constants/public-data";

const focusAreas = [
  {
    icon: MoonStar,
    title: "Beriman dan Bertakwa",
    description: schoolIdentity.missions[0],
  },
  {
    icon: HandHeart,
    title: "Terampil dan Berakhlak",
    description: schoolIdentity.missions[1],
  },
  {
    icon: Leaf,
    title: "Cinta Lingkungan",
    description: schoolIdentity.missions[5],
  },
];

export function StatsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {focusAreas.map((area) => {
        const Icon = area.icon;
        return (
          <article key={area.title} className="clay-card p-6 text-center sm:p-7">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-slate-950">{area.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{area.description}</p>
          </article>
        );
      })}
    </div>
  );
}
