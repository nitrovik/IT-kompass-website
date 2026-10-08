import Link from "next/link";
import { vatNote, type WebsitePackage } from "@/content/packages";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

export function PackageCard({ pack, index }: { pack: WebsitePackage; index: number }) {
  const dark = pack.featured;
  const { setup, monthly, custom, terms } = pack.price;
  const label = dark ? "text-on-navy" : "text-muted";
  return (
    <article data-reveal style={{ ["--d" as string]: `${index * 0.08}s` }}
      className={cn("relative flex h-full flex-col rounded-[28px] p-8", dark ? "navy-slab on-dark shadow-[0_40px_80px_-40px_rgba(7,26,49,.9)] lg:-my-4 lg:py-12" : "surface-card")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={cn("card-title text-[28px]", dark ? "text-white" : "text-ink")}>{pack.name}</h3>
        {dark ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9fdcff] ring-1 ring-white/15">Mest fleksibel</span> : null}
      </div>
      <p className={cn("mt-4 text-[15px] leading-[1.65]", label)}>{pack.description}</p>
      <ul className={cn("mt-8 grid gap-3.5 border-t pt-7", dark ? "border-white/12" : "border-line")}>
        {pack.features.map((feature) => (
          <li key={feature} className={cn("flex gap-3 text-[15px]", dark ? "text-white" : "text-body")}>
            <svg className={cn("mt-1 shrink-0", dark ? "text-[#7fd0ff]" : "text-brand")} width="14" height="14" viewBox="0 0 12 12" aria-hidden="true"><path d="m2 6.3 2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Pris: etablering, per måned og vilkår – eller pris ut fra behov */}
      <div className={cn("mt-auto pt-10", dark ? "text-white" : "text-ink")}>
        {custom ? (
          <>
            <p className="font-display text-[24px] font-semibold tracking-[-.01em]">{custom}</p>
            <Link href="/kontakt" className={cn("group mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold", dark ? "text-[#9fdcff]" : "text-brand")}>
              <span className="link-underline">Be om tilbud</span> <Arrow size={14} />
            </Link>
          </>
        ) : (
          <>
            {setup ? (
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-[32px] font-semibold tracking-[-.02em]">{setup}</span>
                <span className={cn("text-[15px]", label)}>i etablering</span>
              </p>
            ) : null}
            {monthly ? (
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-[22px] font-semibold tracking-[-.01em]">{monthly}</span>
                <span className={cn("text-[15px]", label)}>per måned</span>
              </p>
            ) : null}
            <p className={cn("mt-1 text-[13px]", label)}>Prisene er {vatNote}</p>
          </>
        )}
        {terms ? <p className={cn("mt-3 text-[14px]", label)}>{terms}</p> : null}
      </div>
    </article>
  );
}
