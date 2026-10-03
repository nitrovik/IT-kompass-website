import { homeContact } from "@/content/home";
import { site } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";
import { CoverageMap } from "@/components/site/coverage-map";

export function ContactDetails() {
  const address = [site.address, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const items = [
    site.phone ? { label: "Telefon", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` } : null,
    site.email ? { label: "E-post", value: site.email, href: `mailto:${site.email}` } : null,
    address ? { label: "Adresse", value: address } : null,
  ].filter((item): item is { label: string; value: string; href?: string } => item !== null);

  if (!items.length) return null;
  return (
    <dl className="mt-7 grid gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-sm font-bold text-ink">{item.label}</dt>
          <dd className="mt-0.5 text-muted">{item.href ? <a href={item.href} className="hover:text-brand hover:underline">{item.value}</a> : item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactSection() {
  return (
    <section className="section-pad" aria-labelledby="kontakt-heading">
      <div className="container-shell grid gap-5 lg:grid-cols-[.8fr_1fr_.8fr]">
        <div className="lg:pr-4">
          <p className="eyebrow">{homeContact.eyebrow}</p>
          <h2 id="kontakt-heading" className="mt-3 text-[clamp(2.1rem,3.6vw,2.75rem)] leading-[1.03] font-extrabold tracking-[-.04em] text-ink">{homeContact.title}</h2>
          <p className="mt-4 leading-[1.7] text-muted">{homeContact.body}</p>
          <ContactDetails />
        </div>
        <div className="surface-card p-6">
          <h3 className="text-[22px] font-extrabold tracking-[-.02em] text-ink">{homeContact.formTitle}</h3>
          <div className="mt-5"><ContactForm compact /></div>
        </div>
        <CoverageMap title={homeContact.mapTitle} fallback={homeContact.mapFallback} />
      </div>
    </section>
  );
}
