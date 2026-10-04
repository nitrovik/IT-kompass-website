import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactDetails } from "@/components/home/contact-section";
import { CoverageMap } from "@/components/site/coverage-map";
import { homeContact } from "@/content/home";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({ title: "Kontakt", description: "Kontakt IT Kompass AS om fiber, WiFi, mobil, IT support, utstyr, installasjoner og nettsider.", path: "/kontakt" });

export default function ContactPage() {
  const hasDetails = Boolean(site.phone || site.email || site.address);
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/kontakt", label: "Kontakt" }]} eyebrow="Kontakt" title="Fortell oss hva du skal få på plass." body="Velg tema og beskriv kort hva du trenger. Vi tar kontakt for å finne riktig vei videre." />
      <section className="section-pad">
        <div className="container-shell grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div data-reveal className="surface-card p-6 sm:p-10">
            <h2 className="card-title text-[24px] text-ink">{homeContact.formTitle}</h2>
            <p className="mt-2 text-[15px] text-muted">Felt merket med * må fylles ut.</p>
            <div className="mt-8"><ContactForm /></div>
          </div>
          <div className="grid content-start gap-5">
            {hasDetails ? (
              <div data-reveal className="surface-card p-7">
                <h2 className="card-title mb-6 text-[20px] text-ink">Kontaktinformasjon</h2>
                <ContactDetails />
              </div>
            ) : null}
            {site.bookingUrl ? (
              <div id="booking" data-reveal className="surface-card p-7">
                <h2 className="card-title text-[20px] text-ink">Bestill et møte</h2>
                <p className="mt-2 text-[15px] leading-6 text-muted">Finn et tidspunkt som passer, så tar vi en prat.</p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-line">
                  <iframe src={site.bookingUrl} title="Bestill møte med IT Kompass" loading="lazy" className="h-[520px] w-full bg-white" />
                </div>
              </div>
            ) : null}
            <div data-reveal style={{ ["--d" as string]: ".1s" }}>
              <CoverageMap title={homeContact.mapTitle} fallback={homeContact.mapFallback} className="min-h-[380px]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
