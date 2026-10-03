import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homePackages, homeWebsites } from "@/content/home";
import { SectionHeading } from "@/components/site/section-heading";
import { DeviceMockup } from "@/components/site/device-mockup";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function WebsitesSection() {
  return (
    <section className="section-pad bg-soft" aria-labelledby="nettsider-heading">
      <div className="container-shell">
        <SectionHeading id="nettsider-heading" eyebrow={homeWebsites.eyebrow} title={homeWebsites.title} body={homeWebsites.body} />
        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal className="h-full">
            <DeviceMockup className="h-full min-h-[300px] sm:min-h-[400px]" />
          </Reveal>
          <div className="grid gap-4">
            <div className="surface-card p-6 sm:p-7">
              <p className="eyebrow">{homeWebsites.packagesEyebrow}</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-.02em] text-ink">{homeWebsites.packagesTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{homeWebsites.packagesBody}</p>
              <ul className="mt-5 grid gap-2.5">
                {homePackages.map((pack) => (
                  <li key={pack.name} className={cn("flex items-center justify-between gap-4 rounded-2xl border px-4 py-3", pack.featured ? "border-brand/30 bg-tile" : "border-line bg-white")}>
                    <span>
                      <span className="block text-sm font-extrabold text-ink">{pack.name}</span>
                      <span className="block text-xs leading-5 text-muted">{pack.summary}</span>
                    </span>
                    <span className="shrink-0 text-xs font-bold text-body">{pack.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <SpotlightCard href="/kontakt" className="group p-6 sm:p-7" tilt={false}>
              <h3 className="text-[19px] font-bold text-ink">{homeWebsites.growth.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{homeWebsites.growth.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-brand">Snakk med oss <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </SpotlightCard>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/prosjekter" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">Se prosjekter og nettsidepakker <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
