import { Check } from "lucide-react";
import type { websitePackages } from "@/content/projects";
import { cn } from "@/lib/utils";

type Package = (typeof websitePackages)[number];

export function PackageCard({ pack }: { pack: Package }) {
  return (
    <article className={cn("relative flex h-full flex-col rounded-[22px] border bg-white p-7", pack.featured ? "border-brand/40 shadow-[0_24px_60px_rgba(10,110,209,.14)]" : "border-line shadow-card")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-extrabold tracking-[-.02em] text-ink">{pack.name}</h3>
        {pack.featured ? <span className="rounded-full bg-tile px-3 py-1 text-xs font-bold text-brand">Mest fleksibel</span> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{pack.description}</p>
      <ul className="mt-6 grid gap-3 border-t border-line pt-6">
        {pack.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-body"><Check size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />{feature}</li>)}
      </ul>
      <p className="mt-auto pt-8 text-xl font-extrabold text-ink">{pack.price}</p>
    </article>
  );
}
