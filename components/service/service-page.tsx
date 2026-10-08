import Link from "next/link";
import type { Service } from "@/content/services";
import { services } from "@/content/services";
import { serviceIcons } from "@/components/icons/service-icons";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ProcessTrack } from "@/components/home/process-track";
import { WizardCta } from "@/components/home/wizard-cta";
import { WebsitePackages } from "@/components/service/website-packages";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

export function ServicePage({ service }: { service: Service }) {
  const Icon = serviceIcons[service.slug];
  const others = services.filter((item) => item.slug !== service.slug);
  // Nettsidepakkene med priser vises bare på «Nettsider og drift»
  const showPackages = service.slug === "nettsider";
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ href: "/tjenester", label: "Tjenester" }, { href: `/tjenester/${service.slug}`, label: service.shortTitle }]}
        eyebrow={service.shortTitle}
        title={service.title}
        body={service.description}
        cta={{ href: "/kontakt", label: "Ta kontakt" }}
        secondaryCta={{ href: `/finn-riktig-losning?behov=${encodeURIComponent(service.slug === "nettsider" ? "Nettsider" : service.shortTitle)}`, label: "Finn riktig løsning" }}
        aside={
          <span className="relative hidden size-36 place-items-center rounded-[36px] border border-white bg-white/70 text-brand shadow-[0_30px_60px_-30px_rgba(14,39,71,.5)] backdrop-blur lg:grid" data-inview="true" aria-hidden="true">
            <span className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_50%_35%,rgba(42,166,255,.25),transparent_70%)]" />
            <Icon size={58} className="relative" />
          </span>
        }
      />

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal="fade">Hva du får</p>
            <p data-reveal className="mt-6 font-display text-[clamp(1.6rem,2.6vw,2.15rem)] leading-[1.25] font-medium tracking-[-.02em] text-ink">{service.intro}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.detailed.map((item, index) => (
              <article key={item.title} data-reveal style={{ ["--d" as string]: `${index * 0.07}s` }} className="surface-card p-7">
                <span className="tabular text-xs font-semibold tracking-[.16em] text-brand">0{index + 1}</span>
                <h2 className="card-title mt-4 text-[19px] text-ink">{item.title}</h2>
                <p className="mt-2 text-[15px] leading-[1.6] text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-soft">
        <div className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <SectionHeading eyebrow="Leveransen" title="Dette kan vi hjelpe deg med." align="left" />
          <ul className="grid content-start gap-3 self-end">
            {service.bullets.map((item, index) => (
              <li key={item} data-reveal style={{ ["--d" as string]: `${index * 0.07}s` }} className="flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4 text-[16px] font-medium text-ink shadow-[0_1px_2px_rgba(14,39,71,.04)]">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tile text-brand" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 12 12"><path d="m2 6.3 2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow="Slik jobber vi" title="Fra behov til en løsning som er i drift." align="left" />
          <ProcessTrack steps={service.process.map((step, i) => ({ number: `0${i + 1}`, title: step }))} />
        </div>
      </section>

      {showPackages ? <WebsitePackages /> : null}

      <section className={cn("pb-[clamp(2rem,4vw,3rem)]", showPackages && "pt-[clamp(4rem,7vw,6rem)]")}>
        <div className="container-shell">
          <h2 className="eyebrow" data-reveal="fade">Andre tjenester</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((item, index) => {
              const OtherIcon = serviceIcons[item.slug];
              return (
                <li key={item.slug} data-reveal style={{ ["--d" as string]: `${index * 0.07}s` }}>
                  <SpotlightCard tilt={false} className="group flex items-center gap-4 p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-tile text-brand" aria-hidden="true"><OtherIcon /></span>
                    <Link href={`/tjenester/${item.slug}`} className="card-title flex-1 text-[17px] text-ink outline-none after:absolute after:inset-0 after:rounded-[24px] after:content-['']">{item.shortTitle}</Link>
                    <Arrow className="text-brand" />
                  </SpotlightCard>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <WizardCta />
    </main>
  );
}
