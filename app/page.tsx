import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/config/site";
import { Hero } from "@/components/home/hero";
import { ContactSection } from "@/components/home/contact-section";

export const metadata: Metadata = pageMetadata({ title: "IT Kompass AS | IT og telecom med én kontakt", description: site.description, path: "/", absoluteTitle: true });

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
        areaServed: site.areaServed,
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
      <ContactSection />
    </main>
  );
}
