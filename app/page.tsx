import Link from "next/link";
import { ArrowDown, ArrowUpRight, Compass, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { homeHero, homePositioning, homeServices, homeTrust } from "@/content/home";
import { HeroScene } from "@/components/home/hero-scene";
import { WordReveal } from "@/components/home/word-reveal";
import { ServiceCard } from "@/components/home/service-card";
import { ProcessSection } from "@/components/home/process-section";
import { Showcase } from "@/components/home/showcase";
import { PartnerStrip } from "@/components/home/partner-strip";
import { CompassScrollIndicator } from "@/components/home/compass-scroll-indicator";
import { SectionHeading } from "@/components/site/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { MagneticLink } from "@/components/ui/magnetic-link";

function JsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.legalName,
    url: site.url,
    description: site.description,
    identifier: { "@type": "PropertyValue", propertyID: "NO:ORGNR", value: site.orgNumber },
    areaServed: site.coverageArea || undefined,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}

export default function HomePage() {
  return (
    <main id="main">
      <JsonLd />
      <CompassScrollIndicator />
      <section className="relative min-h-[92vh] overflow-hidden pt-28 sm:pt-32">
        <HeroScene />
        <div className="grid-noise absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="fiber-bg absolute inset-0" aria-hidden="true" />
        <div className="container-shell relative z-10 flex min-h-[78vh] items-center pb-20">
          <div className="max-w-5xl">
            <div className="eyebrow">{homeHero.eyebrow}</div>
            <h1 className="display-text mt-6 max-w-4xl text-white"><WordReveal lines={homeHero.title} /></h1>
            <p className="body-lg mt-8 max-w-2xl">{homeHero.body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticLink href={homeHero.primaryCta.href}> {homeHero.primaryCta.label} <ArrowUpRight size={18} /></MagneticLink>
              <MagneticLink href={homeHero.secondaryCta.href} variant="outline">{homeHero.secondaryCta.label}</MagneticLink>
            </div>
            <div className="mt-12 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
              {homeServices.map((service) => <span key={service.title} className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">{service.title}</span>)}
            </div>
          </div>
        </div>
        <div className="container-shell absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center justify-between text-xs text-slate-500"><span>IT og telecom i én kontaktflate</span><span className="hidden items-center gap-2 sm:flex">Scroll for retning <ArrowDown size={14}/></span></div>
      </section>

      <section className="section-pad" aria-labelledby="tjenester-heading">
        <div className="container-shell">
          <SectionHeading eyebrow="Tjenester" title="Det du trenger for å holde virksomheten i gang." body="Fra trådløst nett og fiber til IT support og nettsider. Vi samler kompetansen og gjør veien til riktig løsning kortere." />
          <div id="tjenester-heading" className="sr-only">Tjenester</div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">{homeServices.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}</div>
        </div>
      </section>

      <section className="section-pad relative overflow-hidden bg-[#050f1b]" aria-labelledby="position-heading">
        <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <div className="eyebrow">{homePositioning.eyebrow}</div>
            <h2 id="position-heading" className="section-title mt-5">{homePositioning.title}</h2>
          </div>
          <div className="relative rounded-[1.6rem] border border-white/10 bg-[#0a192a] p-8 sm:p-10">
            <div className="absolute inset-0 rounded-[1.6rem] bg-[radial-gradient(circle_at_80%_20%,rgba(38,155,255,.12),transparent_35%)]" aria-hidden="true" />
            <p className="relative max-w-2xl text-xl leading-8 text-slate-200">{homePositioning.body}</p>
            <div className="relative mt-8 grid gap-3">
              {homePositioning.points.map((point) => <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[.025] p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#6EC5FF]"/><span className="text-sm text-slate-300">{point}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" aria-labelledby="process-heading">
        <div className="container-shell">
          <SectionHeading eyebrow="Slik jobber vi" title="En enkel prosess. Et tydelig ansvar." body="Vi tar oss av helheten fra behov til drift, med én kontaktflate når løsningen skal følges opp." />
          <h2 id="process-heading" className="sr-only">Slik jobber vi</h2>
          <ProcessSection />
        </div>
      </section>

      <section className="section-pad bg-[#07111f]" aria-labelledby="projects-heading">
        <div className="container-shell">
          <SectionHeading eyebrow="Utstillingsvindu" title="Nettsider vi selv ville ønsket å få levert." body="Nettsider og drift er en del av det vi leverer. Her viser vi ekte arbeid når prosjektene er klare til publisering." />
          <h2 id="projects-heading" className="sr-only">Utstillingsvindu</h2>
          <div className="mt-12"><Showcase /></div>
        </div>
      </section>

      <PartnerStrip />

      <section className="section-pad" aria-labelledby="trust-heading">
        <div className="container-shell">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(38,155,255,.12),rgba(9,23,39,.85)_50%)] p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <div><div className="eyebrow">Én vei videre</div><h2 id="trust-heading" className="section-title mt-5">Vet du ikke helt hva du trenger?</h2><p className="body-lg mt-5">Svar på noen få spørsmål. Vi bruker svarene til å peke ut en konkret retning og fylle ut en henvendelse for deg.</p></div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><Link href="/finn-riktig-losning" className={buttonVariants({ size: "lg" })}>Finn riktig løsning <ArrowUpRight size={18}/></Link><Link href="/kontakt" className={buttonVariants({ variant: "outline", size: "lg" })}>Kontakt oss</Link></div>
            </div>
            <div className="mt-10 grid gap-3 border-t border-white/8 pt-8 sm:grid-cols-3">{homeTrust.map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-3 text-sm text-slate-300"><Icon size={18} className="text-[#6EC5FF]"/>{label}</div>)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
