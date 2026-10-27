import Link from "next/link";
import { homeContact, type TitleLine } from "@/content/home";
import type { ContactCategory } from "@/content/contact";
import { site } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";
import { TitleLines } from "@/components/home/section-title";

/* Telefon, e-post og adresse når de er lagt inn i config/site.ts (ellers ingenting). */
export function ContactDetails() {
  const address = [site.address, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const items = [
    site.phone ? { label: "Telefon", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` } : null,
    site.email ? { label: "E-post", value: site.email, href: `mailto:${site.email}` } : null,
    address ? { label: "Adresse", value: address } : null,
  ].filter((item): item is { label: string; value: string; href?: string } => item !== null);

  if (!items.length) return null;
  return (
    <dl className="contact-details">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.href ? <a href={item.href} className="link-underline hover:text-brand">{item.value}</a> : item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type ContactCopy = { eyebrow: string; title: TitleLine[]; body: string; link?: { label: string; href: string } };

/*
  Kontaktseksjonen fra designet. Kortet til høyre har kontaktskjemaet (sendes med Resend,
  beskyttet av Turnstile) der designet hadde en lenke til itkompass.no. Tjenestesidene bruker
  samme seksjon med egen tekst og forhåndsvalgt kategori i skjemaet.
*/
export function ContactSection({ copy = homeContact, category }: { copy?: ContactCopy; category?: ContactCategory }) {
  const { card } = homeContact;
  return (
    <section className="contact" id="kontakt" aria-labelledby="kontakt-heading">
      <div className="wrap contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="kontakt-heading" className="section-heading"><TitleLines lines={copy.title} /></h2>
          <p className="body-copy">{copy.body}</p>
          {copy.link ? <Link className="text-link" href={copy.link.href}>{copy.link.label} <span aria-hidden="true">↗</span></Link> : null}
          <ContactDetails />
        </div>
        <div className="contact-card" id="kontaktskjema" data-reveal style={{ ["--d" as string]: ".08s" }}>
          <div className="card-eyebrow">{card.eyebrow}</div>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <ContactForm defaultCategory={category} />
        </div>
      </div>
    </section>
  );
}
