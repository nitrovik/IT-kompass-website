import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/config/site";
import { homeServices, homeServicesIntro } from "@/content/home";
import { Hero } from "@/components/home/hero";
import { ServiceCard } from "@/components/home/service-card";
import { PositioningSection } from "@/components/home/positioning-section";
import { ProcessSection } from "@/components/home/process-section";
import { WebsitesSection } from "@/components/home/websites-section";
import { PartnersSection } from "@/components/home/partners-section";
import { WizardCta } from "@/components/home/wizard-cta";
import { ContactSection } from "@/components/home/contact-section";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = pageMetadata({ title: "IT Kompass AS | IT og telecom. Én partner.", description: site.description, path: "/", absoluteTitle: true });

function JsonLd() {
  const base = site.url.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${base}/#organisasjon`,
        name: site.legalName,
        url: base,
        logo: `${base}/brand/it-kompass-logo.png`,
        image: `${base}/brand/it-kompass-logo.png`,
        description: site.description,
        identifier: { "@type": "PropertyValue", propertyID: "NO:ORGNR", value: site.orgNumber },
        telephone: site.phone || undefined,
        email: site.email || undefined,
        address: site.address
          ? { "@type": "PostalAddress", streetAddress: site.address, postalCode: site.postalCode || undefined, addressLocality: site.city || undefined, addressCountry: site.country }
          : undefined,
        areaServed: site.coverageArea || undefined,
        knowsAbout: ["WiFi", "Fiber", "Telecom", "IT support", "Nettsider"],
      },
      { "@type": "WebSite", "@id": `${base}/#nettsted`, url: base, name: site.name, inLanguage: "nb-NO", publisher: { "@id": `${base}/#organisasjon` } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <JsonLd />
      <Hero />

      <section className="section-pad" aria-labelledby="tjenester-heading">
        <div className="container-shell">
          <SectionHeading id="tjenester-heading" eyebrow={homeServicesIntro.eyebrow} title={homeServicesIntro.title} body={homeServicesIntro.body} />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeServices.map((service, index) => <ServiceCard key={service.href} service={service} index={index} />)}
          </div>
        </div>
      </section>

      <PositioningSection />
      <ProcessSection />
      <WebsitesSection />
      <PartnersSection />
      <WizardCta />
      <ContactSection />
    </main>
  );
}
