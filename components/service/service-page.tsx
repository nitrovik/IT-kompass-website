import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/content/services";
import { buttonVariants } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function ServicePage({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <main id="main">
      <PageHero eyebrow={service.shortTitle} title={service.title} body={service.description} cta={{ href: "/kontakt", label: "Ta kontakt" }} secondaryCta={{ href: "/finn-riktig-losning", label: "Finn riktig løsning" }} />

      <section className="section-pad">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-tile text-brand" aria-hidden="true"><Icon size={26} /></span>
            <p className="mt-6 text-2xl leading-[1.4] font-semibold tracking-[-.02em] text-ink">{service.intro}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.detailed.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="surface-card h-full p-6">
                  <h2 className="text-lg font-bold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-soft">
        <div className="container-shell">
          <SectionHeading eyebrow="Leveransen" title="Dette kan vi hjelpe deg med." align="left" />
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {service.bullets.map((item) => (
              <li key={item} className="surface-card flex items-center gap-3 p-5 font-semibold text-ink">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sky text-brand" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow="Slik jobber vi" title="Fra behov til en løsning som er i drift." align="left" />
          <ol className="relative mt-10 grid gap-3 sm:grid-cols-5">
            <span className="absolute top-[42px] right-[10%] left-[10%] hidden h-px bg-[linear-gradient(90deg,rgba(39,167,255,.1),rgba(39,167,255,.45),rgba(39,167,255,.1))] sm:block" aria-hidden="true" />
            {service.process.map((step, index) => (
              <li key={step} className="relative rounded-2xl border border-line bg-white p-5">
                <span className="relative z-10 grid size-11 place-items-center rounded-[13px] border border-line bg-white text-sm font-extrabold text-brand">0{index + 1}</span>
                <span className="mt-5 block text-sm font-bold text-ink">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/finn-riktig-losning" className={buttonVariants({ size: "lg" })}>Finn riktig løsning <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/tjenester" className={buttonVariants({ variant: "secondary", size: "lg" })}>Se alle tjenester</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
