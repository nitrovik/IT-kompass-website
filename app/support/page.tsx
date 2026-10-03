import type { Metadata } from "next";
import { ArrowDownToLine, LifeBuoy, PhoneCall } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SupportForm } from "@/components/forms/support-form";
import { StatusBoard } from "@/components/support/status-board";
import { SectionHeading } from "@/components/site/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { getStatusServices } from "@/lib/status";

export const metadata: Metadata = {
  title: "Support",
  description: "Meld inn en IT-supportsak til IT Kompass AS.",
  alternates: { canonical: "/support" },
};

export default async function SupportPage() {
  const status = await getStatusServices();
  return (
    <main id="main">
      <PageHero eyebrow="Support" title="Når noe stopper, skal veien videre være kort." body="Meld inn saken med kategori, prioritet og beskrivelse. Legg gjerne ved et skjermbilde, så går det raskere å finne ut av det." />

      <section className="section-pad">
        <div className="container-shell grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-ink">Meld inn en sak</h2>
            <div className="mt-6"><SupportForm /></div>
          </div>
          <div className="grid content-start gap-5">
            {site.phone ? (
              <div className="surface-card p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-[13px] bg-tile text-brand" aria-hidden="true"><PhoneCall size={20} /></span>
                <h2 className="mt-5 text-xl font-bold text-ink">Haster det?</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Ved kritiske feil kan du ringe oss direkte.</p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={`${buttonVariants({ variant: "secondary" })} mt-5`}>{site.phone}</a>
              </div>
            ) : null}
            {site.remoteHelpUrl ? (
              <div className="surface-card p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-[13px] bg-tile text-brand" aria-hidden="true"><LifeBuoy size={20} /></span>
                <h2 className="mt-5 text-xl font-bold text-ink">Fjernhjelp</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Når vi skal hjelpe deg på skjermen, laster du ned fjernhjelpsverktøyet her og gir oss koden som vises.</p>
                <a href={site.remoteHelpUrl} target="_blank" rel="noreferrer" className={`${buttonVariants()} mt-5`}>Last ned fjernhjelp <ArrowDownToLine size={16} aria-hidden="true" /></a>
              </div>
            ) : null}
            <div className="surface-card p-6 sm:p-7">
              <h2 className="text-xl font-bold text-ink">Slik behandler vi saken</h2>
              <ol className="mt-4 grid gap-3 text-sm text-body">
                <li className="flex gap-3"><span className="font-extrabold text-brand">01</span>Vi mottar saken og ser på prioriteten du har valgt.</li>
                <li className="flex gap-3"><span className="font-extrabold text-brand">02</span>Vi tar kontakt hvis vi trenger mer informasjon.</li>
                <li className="flex gap-3"><span className="font-extrabold text-brand">03</span>Vi løser saken eller avtaler videre oppfølging.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {status ? (
        <section id="status" className="section-pad border-t border-line bg-soft">
          <div className="container-shell">
            <SectionHeading eyebrow="Driftsstatus" title="Status for tjenestene." align="left" />
            <div className="mt-8 max-w-3xl"><StatusBoard services={status} /></div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
