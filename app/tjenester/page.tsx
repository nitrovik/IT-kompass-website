import type { Metadata } from "next";
import { services } from "@/content/services";
import { ServiceCard } from "@/components/home/service-card";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Tjenester",
  description: "WiFi, fiber og telecom, IT support og nettsider fra IT Kompass AS.",
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Tjenester" title="IT og telecom, samlet på ett sted." body="Vi kan ta ansvar for én del av IT-miljøet ditt eller koordinere flere tjenester gjennom én kontaktflate." />
      <section className="section-pad"><div className="container-shell grid gap-4 md:grid-cols-2">{services.map((service, index) => <ServiceCard key={service.slug} service={{ ...service, href: `/tjenester/${service.slug}` }} index={index} />)}</div></section>
    </main>
  );
}
