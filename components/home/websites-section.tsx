import Link from "next/link";
import { homePackages, homeWebsites } from "@/content/home";
import { SectionHeading } from "@/components/site/section-heading";
import { DeviceMockup } from "@/components/site/device-mockup";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

const capabilities = ["Design", "Utvikling", "Hosting", "SEO", "Innhold"];

export function WebsitesSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-soft" aria-labelledby="nettsider-heading">
      <div className="container-shell">
        <SectionHeading id="nettsider-heading" eyebrow={homeWebsites.eyebrow} title={homeWebsites.title} body={homeWebsites.body} />

        <div className="mt-14 grid items-start gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div data-reveal="clip">
            <DeviceMockup className="aspect-[4/3] sm:aspect-[16/11]" />
          </div>
          <div data-reveal style={{ ["--d" as string]: ".15s" }} className="surface-card flex flex-col p-7 sm:p-8">
            <h3 className="card-title text-[22px] text-ink">{homeWebsites.growth.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-muted">{homeWebsites.growth.text}</p>
            <ul className="mt-7 grid gap-3" aria-label="Det som inngår">
              {capabilities.map((item, i) => (
                <li key={item} className="flex items-center justify-between border-b border-line pb-3 text-[15px] font-medium text-ink last:border-b-0">
                  {item}
                  <span className="tabular text-xs text-faint">0{i + 1}</span>
                </li>
              ))}
            </ul>
            <Link href="/kontakt" className="group mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold text-brand">
              <span className="link-underline">Snakk med oss om nettside</span> <Arrow />
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow" data-reveal="fade">{homeWebsites.packagesEyebrow}</p>
              <h3 data-reveal className="card-title mt-4 text-[28px] leading-tight text-ink sm:text-[32px]">{homeWebsites.packagesTitle}</h3>
            </div>
            <p data-reveal className="text-[15px] text-muted">{homeWebsites.packagesBody}</p>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {homePackages.map((pack, i) => (
              <li key={pack.name} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}
                className={cn("relative flex flex-col rounded-[24px] p-7", pack.featured ? "on-dark navy-slab text-white shadow-[0_30px_60px_-30px_rgba(7,26,49,.8)]" : "surface-card")}>
                <div className="flex items-center justify-between">
                  <span className={cn("card-title text-[24px]", pack.featured ? "text-white" : "text-ink")}>{pack.name}</span>
                  {pack.featured ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9fdcff] ring-1 ring-white/15">Mest fleksibel</span> : null}
                </div>
                <p className={cn("mt-4 text-[15px] leading-[1.6]", pack.featured ? "text-on-navy" : "text-muted")}>{pack.summary}</p>
                <div className={cn("mt-auto flex items-center justify-between border-t pt-5", pack.featured ? "border-white/12 mt-8" : "border-line mt-8")}>
                  <span className={cn("text-[15px] font-semibold", pack.featured ? "text-white" : "text-ink")}>{pack.price}</span>
                  <Link href="/prosjekter#pakker" className={cn("group inline-flex items-center gap-1.5 text-sm font-semibold", pack.featured ? "text-[#9fdcff]" : "text-brand")} aria-label={`Les mer om ${pack.name}`}>
                    Detaljer <Arrow size={14} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
