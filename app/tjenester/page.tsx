import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/content/services";
import { ServiceCard } from "@/components/home/service-card";
import { PageHero } from "@/components/site/page-hero";
import { ProcessSection } from "@/components/home/process-section";
import { WizardCta } from "@/components/home/wizard-cta";

export const metadata: Metadata = pageMetadata({ title: "Tjenester", description: "WiFi, fiber og telecom, IT support og nettsider fra IT Kompass AS – samlet hos én partner, uavhengig av leverandør.", path: "/tjenester" });

export default function ServicesPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/tjenester", label: "Tjenester" }]} eyebrow="Tjenester" title="IT og telecom, samlet på ett sted." body="Vi kan ta ansvar for én del av IT-miljøet ditt eller koordinere flere tjenester gjennom én kontaktperson." cta={{ href: "/finn-riktig-losning", label: "Finn riktig løsning" }} secondaryCta={{ href: "/kontakt", label: "Ta kontakt" }} />
      <section className="section-pad">
        <h2 className="sr-only">Våre tjenesteområder</h2>
        <div className="container-shell grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} index={index} large service={{ title: service.shortTitle, description: service.description, icon: service.slug, bullets: service.bullets, href: `/tjenester/${service.slug}` }} />
          ))}
        </div>
      </section>
      <div className="bg-soft"><ProcessSection /></div>
      <WizardCta />
    </main>
  );
}
