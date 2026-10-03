import type { Metadata } from "next";
import { site } from "@/config/site";
import { homeServices, homeServicesIntro } from "@/content/home";
import { Hero } from "@/components/home/hero";
import { ServiceCard } from "@/components/home/service-card";
import { PositioningSection } from "@/components/home/positioning-section";
import { ProcessSection } from "@/components/home/process-section";
import { WebsitesSection } from "@/components/home/websites-section";
import { WizardCta } from "@/components/home/wizard-cta";
import { ContactSection } from "@/components/home/contact-section";
import { CompassScrollIndicator } from "@/components/home/compass-scroll-indicator";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function JsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.legalName,
    url: site.url,
    logo: `${site.url.replace(/\/$/, "")}/brand/it-kompass-logo.png`,
    description: site.description,
    identifier: { "@type": "PropertyValue", propertyID: "NO:ORGNR", value: site.orgNumber },
    telephone: site.phone || undefined,
    email: site.email || undefined,
    address: site.address
      ? { "@type": "PostalAddress", streetAddress: site.address, postalCode: site.postalCode || undefined, addressLocality: site.city || undefined, addressCountry: site.country }
      : undefined,
    areaServed: site.coverageArea || undefined,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}

export default function HomePage() {
  return (
    <main id="main">
      <JsonLd />
      <CompassScrollIndicator />
      <Hero />

      <section className="section-pad" aria-labelledby="tjenester-heading">
        <div className="container-shell">
          <SectionHeading id="tjenester-heading" eyebrow={homeServicesIntro.eyebrow} title={homeServicesIntro.title} body={homeServicesIntro.body} />
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {homeServices.map((service, index) => <ServiceCard key={service.href} service={service} index={index} />)}
          </div>
        </div>
      </section>

      <PositioningSection />
      <ProcessSection />
      <WebsitesSection />
      <WizardCta />
      <ContactSection />
    </main>
  );
}
