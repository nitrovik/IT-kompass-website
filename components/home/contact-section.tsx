import Link from "next/link";
import { homeContact } from "@/content/home";
import { site } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";
import { CoverageMap } from "@/components/site/coverage-map";
import { SplitWords } from "@/components/ui/split-words";
import { Arrow } from "@/components/ui/arrow";

export function ContactDetails() {
  const address = [site.address, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const items = [
    site.phone ? { label: "Telefon", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` } : null,
    site.email ? { label: "E-post", value: site.email, href: `mailto:${site.email}` } : null,
    address ? { label: "Adresse", value: address } : null,
  ].filter((item): item is { label: string; value: string; href?: string } => item !== null);

  if (!items.length) return null;
  return (
    <dl className="grid gap-5">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-semibold tracking-[.14em] text-faint uppercase">{item.label}</dt>
          <dd className="mt-1 text-[16px] text-ink">{item.href ? <a href={item.href} className="link-underline hover:text-brand">{item.value}</a> : item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const shortcuts = [
  { href: "/finn-riktig-losning", label: "Usikker på hva du trenger?", cta: "Bruk veiviseren" },
  { href: "/support", label: "Har du en driftssak?", cta: "Meld inn supportsak" },
];

export function ContactSection() {
  return (
    <section className="section-pad" aria-labelledby="kontakt-heading">
      <div className="container-shell grid gap-5 lg:grid-cols-[1fr_1.1fr_.8fr]">
        <div className="flex flex-col lg:pr-6">
          <p className="eyebrow" data-reveal="fade">{homeContact.eyebrow}</p>
          <h2 id="kontakt-heading" data-split className="section-title mt-5 text-[clamp(2.1rem,3.4vw,2.9rem)] text-ink"><SplitWords text={homeContact.title} /></h2>
          <p data-reveal className="lead mt-5">{homeContact.body}</p>
          <div data-reveal className="mt-8"><ContactDetails /></div>
          <ul data-reveal className="mt-auto hidden gap-3 pt-10 lg:grid">
            {shortcuts.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-soft px-4 py-3.5 transition hover:border-[#bcd6ee] hover:bg-white">
                  <span>
                    <span className="block text-[13px] text-muted">{item.label}</span>
                    <span className="block text-[15px] font-semibold text-ink">{item.cta}</span>
                  </span>
                  <Arrow className="text-brand" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ ["--d" as string]: ".1s" }} className="surface-card p-6 sm:p-8">
          <h3 className="card-title text-[22px] text-ink">{homeContact.formTitle}</h3>
          <div className="mt-6"><ContactForm compact /></div>
        </div>
        <div data-reveal style={{ ["--d" as string]: ".2s" }}>
          <CoverageMap title={homeContact.mapTitle} fallback={homeContact.mapFallback} className="h-full" />
        </div>
        <ul className="grid gap-3 lg:hidden">
          {shortcuts.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-soft px-4 py-3.5">
                <span>
                  <span className="block text-[13px] text-muted">{item.label}</span>
                  <span className="block text-[15px] font-semibold text-ink">{item.cta}</span>
                </span>
                <Arrow className="text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
