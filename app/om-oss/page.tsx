import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Handshake, Network, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { FiberField } from "@/components/site/fiber-field";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Om oss",
  description: "Om IT Kompass AS og hvordan vi jobber som leverandøruavhengig IT- og telecompartner.",
  alternates: { canonical: "/om-oss" },
};

const values = [
  { icon: Handshake, title: "Nøytral rådgivning", text: "Vi starter med hva virksomheten skal oppnå og vurderer leverandører ut fra det." },
  { icon: Network, title: "Helheten samlet", text: "WiFi, fiber, mobil, support og nettsider kan håndteres gjennom samme kontaktperson." },
  { icon: ShieldCheck, title: "Forberedt for drift", text: "Løsningene skal være forståelige og enkle å følge opp også etter at prosjektet er ferdig." },
  { icon: Compass, title: "Tydelig retning", text: "Vi gjør det lettere å vite hva som bør gjøres først, og hvorfor." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Om oss" title="Én partner når IT og telecom skal henge sammen." body="IT Kompass AS er en nøytral partner for små og mellomstore bedrifter. Vi finner riktig løsning uavhengig av leverandør og følger opp helheten." />

      <section className="section-pad">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-tile text-brand" aria-hidden="true"><Compass size={26} /></span>
            <p className="mt-6 text-2xl leading-[1.4] font-semibold tracking-[-.02em] text-ink">Kompasset er signaturen vår. Retningen kommer fra behovet ditt.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <article className="surface-card h-full p-6">
                  <span className="grid size-11 place-items-center rounded-[13px] bg-tile text-brand" aria-hidden="true"><Icon size={20} /></span>
                  <h2 className="mt-5 text-lg font-bold text-ink">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[clamp(4.5rem,8vw,6.25rem)]">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#0b2748,#0a3b66)] p-8 text-white sm:p-12">
            <FiberField variant="banner" className="opacity-50" />
            <div className="relative z-10 max-w-3xl">
              <p className="eyebrow !text-[#8ccfff]">Arbeidsmåte</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-.03em] sm:text-4xl">Vi skal være en partner du kan ringe før problemet blir stort.</h2>
              <p className="mt-4 leading-7 text-on-navy">Det betyr ryddig kommunikasjon, tydelig ansvar og løsninger som ikke gjør virksomheten mer avhengig av teknologien enn den trenger å være.</p>
              <Link href="/kontakt" className={`${buttonVariants({ size: "lg" })} mt-7`}>Ta kontakt <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
