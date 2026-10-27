import Link from "next/link";
import { getService, serviceHref, servicesOverview, type Service } from "@/content/services";
import { site } from "@/config/site";
import { TitleLines } from "@/components/home/section-title";
import { ContactSection } from "@/components/home/contact-section";
import { Breadcrumbs } from "@/components/site/page-hero";
import { ServiceArt } from "@/components/service/service-art";

/*
  En tjenesteside: hva tjenesten er, hva som er med, hva dere får, typiske behov, kontaktskjema
  med riktig kategori valgt og lenker til tjenester som henger sammen med denne.
  Sidene deler uttrykk, men «Dette gjør vi» settes opp på to måter (service.layout) og hver side
  har sin egen tegning, så de ikke blir like kopier.
*/
function ServiceJsonLd({ service }: { service: Service }) {
  const base = site.url.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: `${base}${serviceHref(service.slug)}`,
    serviceType: service.name,
    areaServed: site.areaServed,
    provider: { "@type": "LocalBusiness", "@id": `${base}/#organisasjon`, name: site.legalName, url: base },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}

function Check() {
  return (
    <svg className="svc-check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" opacity=".35" />
      <path d="M6 10.4l2.6 2.6L14.2 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Includes({ service }: { service: Service }) {
  const heading = (
    <>
      <p className="eyebrow">Dette gjør vi</p>
      <h2 id="svc-includes" className="section-heading svc-h2"><TitleLines lines={[{ text: `${service.name}:` }, { em: "dette er med." }]} /></h2>
    </>
  );
  if (service.layout === "index") {
    // Nummerert rekke langs en fiberlinje, som en bane med knutepunkter
    return (
      <section className="svc-section svc-includes-index" aria-labelledby="svc-includes">
        <div className="wrap">
          <div className="svc-head" data-reveal>{heading}</div>
          <ol className="svc-steps">
            {service.includes.map((item, i) => (
              <li key={item.title} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <span className="svc-step-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }
  // To kolonner: overskriften står fast til venstre mens listen scrolles forbi
  return (
    <section className="svc-section svc-includes-split" aria-labelledby="svc-includes">
      <div className="wrap svc-split">
        <div className="svc-split-head" data-reveal>{heading}</div>
        <dl className="svc-list">
          {service.includes.map((item, i) => (
            <div key={item.title} data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }}>
              <dt><span className="svc-list-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map(getService).filter((item): item is Service => Boolean(item));
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <ServiceJsonLd service={service} />

      <section className={`svc-hero svc-hero-${service.art}`} aria-labelledby="svc-heading">
        <div className="wrap svc-hero-grid">
          <div className="svc-hero-copy">
            <Breadcrumbs items={[{ href: "/tjenester", label: "Tjenester" }, { href: serviceHref(service.slug), label: service.name }]} />
            <p className="eyebrow svc-eyebrow hero-fade" style={{ ["--d" as string]: ".05s" }}>{service.name}</p>
            <h1 id="svc-heading" className="svc-title hero-fade" style={{ ["--d" as string]: ".12s" }}><TitleLines lines={service.title} /></h1>
            <p className="svc-intro hero-fade" style={{ ["--d" as string]: ".22s" }}>{service.intro}</p>
            <div className="hero-actions hero-fade" style={{ ["--d" as string]: ".32s" }}>
              <a className="btn btn-primary" href="#kontakt">Ta kontakt <span className="btn-arrow" aria-hidden="true">↗</span></a>
              <Link className="btn btn-secondary" href="/tjenester">Alle tjenester</Link>
            </div>
          </div>
          <div className="svc-hero-art hero-fade" style={{ ["--d" as string]: ".2s" }}>
            <ServiceArt kind={service.art} />
          </div>
        </div>
      </section>

      <Includes service={service} />

      <section className="svc-section svc-outcomes" aria-labelledby="svc-outcomes">
        <div className="wrap">
          <h2 id="svc-outcomes" className="svc-kicker" data-reveal>Dette får dere</h2>
          <ul className="svc-outcome-list">
            {service.outcomes.map((item, i) => (
              <li key={item.title} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <Check />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="svc-section svc-needs" aria-labelledby="svc-needs">
        <div className="wrap svc-needs-grid">
          <div data-reveal>
            <p className="eyebrow">Typiske behov</p>
            <h2 id="svc-needs" className="section-heading svc-h2"><TitleLines lines={service.needsTitle} /></h2>
          </div>
          <ul className="svc-need-list" data-reveal style={{ ["--d" as string]: ".08s" }}>
            {service.needs.map((need) => <li key={need}>{need}</li>)}
          </ul>
        </div>
      </section>

      <ContactSection copy={{ eyebrow: "Ta kontakt", title: service.contact.title, body: service.contact.body, link: { label: "Se alle tjenester", href: "/tjenester" } }} category={service.category} />

      <section className="svc-section svc-related" aria-labelledby="svc-related">
        <div className="wrap">
          <div className="svc-related-head" data-reveal>
            <h2 id="svc-related" className="svc-kicker">Andre tjenester</h2>
            <Link className="text-link" href="/tjenester">{servicesOverview.eyebrow}: se alle <span aria-hidden="true">↗</span></Link>
          </div>
          <ul className="svc-related-list">
            {related.map((item) => (
              <li key={item.slug} data-reveal>
                <Link className="svc-related-link" href={serviceHref(item.slug)}>
                  <span className="svc-tag" aria-hidden="true">{item.tag}</span>
                  <span className="svc-related-name">{item.name}</span>
                  <span className="svc-related-sum">{item.summary}</span>
                  <span className="service-go" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
