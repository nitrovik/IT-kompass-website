import type { Metadata } from "next";
import { privacySections, privacyUpdated } from "@/content/legal";
import { PageHero } from "@/components/site/page-hero";
import { site } from "@/config/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Personvern",
  description: "Slik behandler IT Kompass AS personopplysninger på nettstedet.",
  alternates: { canonical: "/personvern" },
};

export default function PrivacyPage() {
  const sections = privacySections.filter((section) => !section.onlyWithAnalytics || site.plausibleDomain);
  return (
    <main id="main">
      <PageHero eyebrow="Personvern" title="Personvern skal være forståelig." body="Her forklarer vi hvilke opplysninger vi behandler når du bruker nettstedet, og hvorfor." />
      <section className="section-pad">
        <div className="container-shell max-w-3xl">
          <div className="grid gap-10">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="text-2xl font-extrabold tracking-[-.02em] text-ink">{section.title}</h2>
                {section.body.map((paragraph) => <p key={paragraph} className="mt-3 leading-7 text-body">{paragraph}</p>)}
                {site.email && section.title === "Dine rettigheter" ? <p className="mt-3 leading-7 text-body">Du kan også skrive til <a className="font-semibold text-brand hover:underline" href={`mailto:${site.email}`}>{site.email}</a>.</p> : null}
              </article>
            ))}
          </div>
          <p className="mt-12 border-t border-line pt-6 text-sm text-muted">Sist oppdatert {formatDate(privacyUpdated)}.</p>
        </div>
      </section>
    </main>
  );
}
