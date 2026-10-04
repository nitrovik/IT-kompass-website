import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { privacySections, privacyUpdated } from "@/content/legal";
import { PageHero } from "@/components/site/page-hero";
import { site } from "@/config/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({ title: "Personvern", description: "Slik behandler IT Kompass AS personopplysninger på nettstedet.", path: "/personvern" });

const slug = (title: string) => title.toLowerCase().replace(/[^a-zæøå0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function PrivacyPage() {
  const sections = privacySections.filter((section) => !section.onlyWithAnalytics || site.plausibleDomain);
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/personvern", label: "Personvern" }]} eyebrow="Personvern" title="Personvern skal være forståelig." body="Her forklarer vi hvilke opplysninger vi behandler når du bruker nettstedet, og hvorfor." />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
          <nav aria-label="Innhold på siden" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Innhold</p>
            <ol className="mt-5 grid gap-2.5 border-l border-line pl-4 text-[14px]">
              {sections.map((section) => <li key={section.title}><a href={`#${slug(section.title)}`} className="link-underline text-muted hover:text-ink">{section.title}</a></li>)}
            </ol>
          </nav>
          <div className="max-w-[44rem]">
            <div className="grid gap-12">
              {sections.map((section) => (
                <article key={section.title} id={slug(section.title)} className="scroll-mt-28">
                  <h2 className="card-title text-[26px] text-ink">{section.title}</h2>
                  {section.body.map((paragraph) => <p key={paragraph} className="mt-4 text-[17px] leading-[1.75] text-body">{paragraph}</p>)}
                  {site.email && section.title === "Dine rettigheter" ? <p className="mt-4 text-[17px] leading-[1.75] text-body">Du kan også skrive til <a className="link-underline font-semibold text-brand" href={`mailto:${site.email}`}>{site.email}</a>.</p> : null}
                </article>
              ))}
            </div>
            <p className="mt-16 border-t border-line pt-6 text-sm text-muted">Sist oppdatert {formatDate(privacyUpdated)}.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
