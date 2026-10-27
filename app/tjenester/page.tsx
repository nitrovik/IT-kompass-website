import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { servicesOverview } from "@/content/services";
import { homeContact } from "@/content/home";
import { TitleLines } from "@/components/home/section-title";
import { ContactSection } from "@/components/home/contact-section";
import { Breadcrumbs } from "@/components/site/page-hero";
import { ServicesIndex } from "@/components/service/services-index";

export const metadata: Metadata = pageMetadata({ title: servicesOverview.metaTitle, description: servicesOverview.metaDescription, path: "/tjenester" });

/* Oversikten over tjenestene: indeksen fra forsidens design, med en lenke til hver tjenesteside. */
export default function ServicesOverviewPage() {
  const { foot } = servicesOverview;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section className="svc-hero svc-hero-overview" aria-labelledby="svc-heading">
        <div className="wrap">
          <Breadcrumbs items={[{ href: "/tjenester", label: "Tjenester" }]} />
          <div className="svc-overview-head">
            <div>
              <p className="eyebrow hero-fade" style={{ ["--d" as string]: ".05s" }}>{servicesOverview.eyebrow}</p>
              <h1 id="svc-heading" className="svc-title hero-fade" style={{ ["--d" as string]: ".12s" }}><TitleLines lines={servicesOverview.title} /></h1>
            </div>
            <p className="svc-intro hero-fade" style={{ ["--d" as string]: ".22s" }}>{servicesOverview.body}</p>
          </div>
        </div>
      </section>
      <section className="services" aria-label="Alle tjenester">
        <div className="wrap">
          <ServicesIndex />
          <div className="services-foot">
            <span>{foot.text}</span>
            <a href={foot.link.href} className="text-link">{foot.link.label} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <ContactSection copy={{ eyebrow: homeContact.eyebrow, title: homeContact.title, body: homeContact.body }} />
    </main>
  );
}
