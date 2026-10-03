import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactDetails } from "@/components/home/contact-section";
import { CoverageMap } from "@/components/site/coverage-map";
import { homeContact } from "@/content/home";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt IT Kompass AS om fiber, WiFi, mobil, IT support, utstyr, installasjoner og nettsider.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Kontakt" title="Fortell oss hva du skal få på plass." body="Velg tema og beskriv kort hva du trenger. Vi tar kontakt for å finne riktig vei videre." />
      <section className="section-pad">
        <div className="container-shell grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-ink">{homeContact.formTitle}</h2>
            <div className="mt-6"><ContactForm /></div>
          </div>
          <div className="grid content-start gap-5">
            {site.phone || site.email || site.address ? (
              <div className="surface-card p-6 sm:p-7">
                <h2 className="text-xl font-bold text-ink">Kontaktinformasjon</h2>
                <ContactDetails />
              </div>
            ) : null}
            {site.bookingUrl ? (
              <div id="booking" className="surface-card p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-[13px] bg-tile text-brand" aria-hidden="true"><CalendarClock size={20} /></span>
                <h2 className="mt-5 text-xl font-bold text-ink">Bestill et møte</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Finn et tidspunkt som passer, så tar vi en prat.</p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-line">
                  <iframe src={site.bookingUrl} title="Bestill møte med IT Kompass" loading="lazy" className="h-[520px] w-full bg-white" />
                </div>
              </div>
            ) : null}
            <CoverageMap title={homeContact.mapTitle} fallback={homeContact.mapFallback} className="min-h-[340px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
