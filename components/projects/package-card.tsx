import type { websitePackages } from "@/content/projects";
import { cn } from "@/lib/utils";

type Package = (typeof websitePackages)[number];

export function PackageCard({ pack, index }: { pack: Package; index: number }) {
  const dark = pack.featured;
  return (
    <article data-reveal style={{ ["--d" as string]: `${index * 0.08}s` }}
      className={cn("relative flex h-full flex-col rounded-[28px] p-8", dark ? "navy-slab on-dark shadow-[0_40px_80px_-40px_rgba(7,26,49,.9)] lg:-my-4 lg:py-12" : "surface-card")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={cn("card-title text-[28px]", dark ? "text-white" : "text-ink")}>{pack.name}</h3>
        {dark ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9fdcff] ring-1 ring-white/15">Mest fleksibel</span> : null}
      </div>
      <p className={cn("mt-4 text-[15px] leading-[1.65]", dark ? "text-on-navy" : "text-muted")}>{pack.description}</p>
      <ul className={cn("mt-8 grid gap-3.5 border-t pt-7", dark ? "border-white/12" : "border-line")}>
        {pack.features.map((feature) => (
          <li key={feature} className={cn("flex gap-3 text-[15px]", dark ? "text-white" : "text-body")}>
            <svg className={cn("mt-1 shrink-0", dark ? "text-[#7fd0ff]" : "text-brand")} width="14" height="14" viewBox="0 0 12 12" aria-hidden="true"><path d="m2 6.3 2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {feature}
          </li>
        ))}
      </ul>
      <p className={cn("mt-auto pt-10 font-display text-[22px] font-semibold tracking-[-.01em]", dark ? "text-white" : "text-ink")}>{pack.price}</p>
    </article>
  );
}
