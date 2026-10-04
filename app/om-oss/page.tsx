import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { PositioningSection } from "@/components/home/positioning-section";
import { ProcessSection } from "@/components/home/process-section";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";

export const metadata: Metadata = pageMetadata({ title: "Om oss", description: "Om IT Kompass AS og hvordan vi jobber som leverandøruavhengig IT- og telecompartner.", path: "/om-oss" });

const values = [
  { title: "Nøytral rådgivning", text: "Vi starter med hva virksomheten skal oppnå og vurderer leverandører ut fra det." },
  { title: "Helheten samlet", text: "WiFi, fiber, mobil, support og nettsider kan håndteres gjennom samme kontaktperson." },
  { title: "Forberedt for drift", text: "Løsningene skal være forståelige og enkle å følge opp også etter at prosjektet er ferdig." },
  { title: "Tydelig retning", text: "Vi gjør det lettere å vite hva som bør gjøres først, og hvorfor." },
];

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/om-oss", label: "Om oss" }]} eyebrow="Om oss" title="Én partner når IT og telecom skal henge sammen." body="IT Kompass AS er en nøytral partner for små og mellomstore bedrifter. Vi finner riktig løsning uavhengig av leverandør og følger opp helheten." />

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal="fade">Hvorfor kompass</p>
            <p data-reveal className="mt-6 font-display text-[clamp(1.7rem,2.8vw,2.4rem)] leading-[1.2] font-medium tracking-[-.02em] text-ink">Kompasset er signaturen vår. Retningen kommer fra behovet ditt.</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <li key={value.title} data-reveal style={{ ["--d" as string]: `${index * 0.07}s` }} className="surface-card p-7">
                <span className="tabular text-xs font-semibold tracking-[.16em] text-brand">0{index + 1}</span>
                <h2 className="card-title mt-4 text-[19px] text-ink">{value.title}</h2>
                <p className="mt-2 text-[15px] leading-[1.6] text-muted">{value.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PositioningSection />
      <ProcessSection />

      <section className="pb-[clamp(5rem,9vw,8.5rem)]">
        <div className="container-shell">
          <div data-reveal className="surface-card flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Arbeidsmåte</p>
              <h2 className="section-title mt-5 text-[clamp(1.9rem,3.2vw,2.6rem)] text-ink">Vi skal være en partner du kan ringe før problemet blir stort.</h2>
              <p className="lead mt-5">Ryddig kommunikasjon, tydelig ansvar og løsninger som ikke gjør virksomheten mer avhengig av teknologien enn den trenger å være.</p>
            </div>
            <Link href="/kontakt" className={`${buttonVariants({ size: "lg" })} shrink-0 self-start lg:self-center`}>Ta kontakt <Arrow /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
