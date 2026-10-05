import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

type Cta = { href: string; label: string };
export type Crumb = { href: string; label: string };

/* Fibre som bøyer seg inn fra høyre. Statiske, med to rolige lysimpulser når toppen er synlig. */
function HeroFibers() {
  const strands = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return `M1240 ${40 + t * 300} C 1000 ${60 + t * 260}, 860 ${300 - t * 60}, 620 ${330 + t * 40} S 300 ${380 + t * 30}, -20 ${300 + t * 140}`;
  });
  return (
    <svg className="pointer-events-none absolute inset-0 size-full will-change-transform [mask-image:linear-gradient(180deg,transparent_35%,#000_85%)] md:[mask-image:none]" viewBox="0 0 1200 460" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ph-fade" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#3f7fbf" stopOpacity=".42" />
          <stop offset=".55" stopColor="#3f7fbf" stopOpacity=".16" />
          <stop offset="1" stopColor="#3f7fbf" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#ph-fade)" strokeLinecap="round">
        {strands.map((d, i) => <path key={d} d={d} strokeWidth={i % 3 === 0 ? 1.4 : 0.8} />)}
      </g>
      <g fill="none" strokeLinecap="round">
        {/* Glød som bred, svak strek under hver puls (ikke blurfilter) */}
        <path d={strands[2]} stroke="#2aa6ff" strokeOpacity=".22" strokeWidth="7" pathLength={1} className="page-pulse" />
        <path d={strands[2]} stroke="#2aa6ff" strokeWidth="2.2" pathLength={1} className="page-pulse" />
        <path d={strands[6]} stroke="#2aa6ff" strokeOpacity=".22" strokeWidth="6" pathLength={1} className="page-pulse [animation-delay:2.6s]" />
        <path d={strands[6]} stroke="#2aa6ff" strokeWidth="1.8" pathLength={1} className="page-pulse [animation-delay:2.6s]" />
      </g>
    </svg>
  );
}

function Breadcrumbs({ items }: { items: Crumb[] }) {
  const base = site.url.replace(/\/$/, "");
  const all = [{ href: "/", label: "Forside" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.label, item: `${base}${item.href === "/" ? "" : item.href}` })),
  };
  return (
    <nav aria-label="Brødsmulesti" className="hero-fade" style={{ ["--d" as string]: "0s" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        {all.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true" className="text-faint">/</span> : null}
            {i === all.length - 1 ? <span aria-current="page" className="text-ink">{item.label}</span> : <Link href={item.href} className="link-underline hover:text-ink">{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ eyebrow, title, body, cta, secondaryCta, crumbs = [], aside }: { eyebrow: string; title: string; body: string; cta?: Cta; secondaryCta?: Cta; crumbs?: Crumb[]; aside?: ReactNode }) {
  return (
    <section data-observe="toggle" className="hero-surface relative isolate overflow-hidden border-b border-line">
      <HeroFibers />
      <div className="container-shell relative pt-[calc(var(--header-h)+2.5rem)] pb-16 sm:pb-20 lg:pt-[calc(var(--header-h)+3.5rem)] lg:pb-24">
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-12 grid gap-10 lg:mt-16", aside && "lg:grid-cols-[1fr_auto] lg:items-end")}>
          <div className="max-w-3xl">
            <p className="eyebrow hero-fade" style={{ ["--d" as string]: ".05s" }}>{eyebrow}</p>
            <h1 className="page-title mt-5 text-ink">
              {title.split(" ").map((word, i, words) => (
                <span key={`${word}-${i}`}>
                  <span className="hero-word"><span style={{ ["--i" as string]: i }}>{word}</span></span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
            <p className="lead hero-fade mt-6 max-w-2xl" style={{ ["--d" as string]: ".45s" }}>{body}</p>
            {cta || secondaryCta ? (
              <div className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ["--d" as string]: ".6s" }}>
                {cta ? <Link href={cta.href} className={buttonVariants({ size: "lg" })}>{cta.label} <Arrow /></Link> : null}
                {secondaryCta ? <Link href={secondaryCta.href} className={buttonVariants({ variant: "secondary", size: "lg" })}>{secondaryCta.label}</Link> : null}
              </div>
            ) : null}
          </div>
          {aside ? <div className="hero-fade" style={{ ["--d" as string]: ".5s" }}>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
