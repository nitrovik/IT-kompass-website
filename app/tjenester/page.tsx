import type { Metadata } from "next";
import { services } from "@/content/services";
import { ServiceCard } from "@/components/home/service-card";
import { PageHero } from "@/components/site/page-hero";
import { WizardCta } from "@/components/home/wizard-cta";

export const metadata: Metadata = {
  title: "Tjenester",
  description: "WiFi, fiber og telecom, IT support og nettsider fra IT Kompass AS – samlet hos én partner.",
  alternates: { canonical: "/tjenester" },
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Tjenester" title="IT og telecom, samlet på ett sted." body="Vi kan ta ansvar for én del av IT-miljøet ditt eller koordinere flere tjenester gjennom én kontaktperson." />
      <section className="section-pad">
        <h2 className="sr-only">Våre tjenesteområder</h2>
        <div className="container-shell grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} index={index} headingLevel="h3" service={{ title: service.shortTitle, description: service.description, icon: service.icon, bullets: service.bullets, href: `/tjenester/${service.slug}` }} />
          ))}
        </div>
      </section>
      <WizardCta />
    </main>
  );
}
