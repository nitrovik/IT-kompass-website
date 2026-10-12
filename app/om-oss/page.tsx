import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { PositioningSection } from "@/components/home/positioning-section";
import { ProcessSection } from "@/components/home/process-section";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";

export const metadata: Metadata = pageMetadata({ title: "Om oss", description: "Hvem IT Kompass AS er, og hvordan vi jobber for bedrifter.", path: "/om-oss" });

const values = [
  { title: "Behovet først", text: "Vi spør hva dere skal få til før vi foreslår noe." },
  { title: "Fast kontaktperson", text: "Dere får én tildelt person som følger dere opp hver gang." },
  { title: "Enkelt å følge opp", text: "Oppsettet skal være forståelig også etter at vi er ferdige." },
  { title: "Klar prioritering", text: "Dere får vite hva som bør gjøres først, og hvorfor." },
];

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/om-oss", label: "Om oss" }]} eyebrow="Om oss" title="Én kontakt for IT og telecom." body="IT Kompass AS hjelper små og mellomstore bedrifter med IT og telecom. Vi jobber på stedet i Viken og digitalt i hele Norge." />

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal="fade">Hvorfor kompass</p>
            <p data-reveal className="mt-6 font-display text-[clamp(1.7rem,2.8vw,2.4rem)] leading-[1.2] font-medium tracking-[-.02em] text-ink">Behovet ditt bestemmer retningen. Derfor heter vi IT Kompass.</p>
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
              <h2 className="section-title mt-5 text-[clamp(1.9rem,3.2vw,2.6rem)] text-ink">Ring før problemet blir stort.</h2>
              <p className="lead mt-5">Du får klare svar og vet hvem som har ansvaret.</p>
            </div>
            <Link href="/kontakt" className={`${buttonVariants({ size: "lg" })} shrink-0 self-start lg:self-center`}>Ta kontakt <Arrow /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
