import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { SupportForm } from "@/components/forms/support-form";
import { StatusBoard } from "@/components/support/status-board";
import { SectionHeading } from "@/components/site/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";
import { site } from "@/config/site";
import { getStatusServices } from "@/lib/status";

export const metadata: Metadata = pageMetadata({ title: "Support", description: "Meld inn en IT-supportsak til IT Kompass AS.", path: "/support" });

const steps = [
  "Vi mottar saken og ser på prioriteten du har valgt.",
  "Vi tar kontakt hvis vi trenger mer informasjon.",
  "Vi løser saken eller avtaler videre oppfølging.",
];

export default async function SupportPage() {
  const status = await getStatusServices();
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/support", label: "Support" }]} eyebrow="Support" title="Når noe stopper, skal veien videre være kort." body="Meld inn saken med kategori, prioritet og beskrivelse. Legg gjerne ved et skjermbilde, så går det raskere å finne ut av det." />

      <section className="section-pad">
        <div className="container-shell grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div data-reveal className="surface-card p-6 sm:p-10">
            <h2 className="card-title text-[24px] text-ink">Meld inn en sak</h2>
            <p className="mt-2 text-[15px] text-muted">Felt merket med * må fylles ut.</p>
            <div className="mt-8"><SupportForm /></div>
          </div>
          <div className="grid content-start gap-5">
            {site.phone ? (
              <div data-reveal className="navy-slab on-dark rounded-[24px] p-7">
                <h2 className="card-title text-[20px] text-white">Haster det?</h2>
                <p className="mt-2 text-[15px] leading-6 text-on-navy">Ved kritiske feil kan du ringe oss direkte.</p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={`${buttonVariants({ variant: "light" })} mt-6`}>{site.phone} <Arrow /></a>
              </div>
            ) : null}
            {site.remoteHelpUrl ? (
              <div data-reveal className="surface-card p-7">
                <h2 className="card-title text-[20px] text-ink">Fjernhjelp</h2>
                <p className="mt-2 text-[15px] leading-6 text-muted">Når vi skal hjelpe deg på skjermen, laster du ned verktøyet her og gir oss koden som vises.</p>
                <a href={site.remoteHelpUrl} target="_blank" rel="noreferrer" className={`${buttonVariants()} mt-6`}>Last ned fjernhjelp <Arrow /></a>
              </div>
            ) : null}
            <div data-reveal style={{ ["--d" as string]: ".1s" }} className="surface-card p-7">
              <h2 className="card-title text-[20px] text-ink">Slik behandler vi saken</h2>
              <ol className="relative mt-6 grid gap-6">
                <span aria-hidden="true" className="absolute top-3 bottom-3 left-[13px] w-px bg-line" />
                {steps.map((step, i) => (
                  <li key={step} className="relative flex gap-4 text-[15px] leading-6 text-body">
                    <span className="tabular relative grid size-[27px] shrink-0 place-items-center rounded-full border border-line bg-white text-xs font-semibold text-brand">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {status ? (
        <section id="status" className="section-pad border-t border-line bg-soft">
          <div className="container-shell">
            <SectionHeading eyebrow="Driftsstatus" title="Status for tjenestene." align="left" />
            <div className="mt-10 max-w-3xl"><StatusBoard services={status} /></div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
