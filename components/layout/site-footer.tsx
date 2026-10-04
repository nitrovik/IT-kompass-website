import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/config/site";
import { services } from "@/content/services";
import { Arrow } from "@/components/ui/arrow";

const titleClass = "text-[11px] font-semibold uppercase tracking-[.18em] text-[#8fd0ff]";
const linkClass = "link-underline text-[15px] text-on-navy transition-colors hover:text-white";

export function SiteFooter() {
  const address = [site.address, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return (
    <footer className="on-dark relative overflow-hidden bg-footer text-on-navy" data-observe="toggle">
      {/* Fiberlinje med en lysimpuls langs toppkanten */}
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 1 H1200" stroke="#2aa6ff" strokeOpacity=".25" />
        <path d="M0 1 H1200" stroke="#7fd0ff" strokeWidth="2" pathLength={1} className="fiber footer-pulse" />
      </svg>
      <div className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_80%_at_85%_0%,#000,transparent)]" aria-hidden="true" />

      <div className="container-shell relative pt-20 pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_.75fr_.85fr_1fr]">
          <div>
            <Link href="/" className="inline-block" aria-label={`${site.name} – til forsiden`}>
              <Image src="/brand/it-kompass-logo-web-inverse-opt.png" alt={site.name} width={414} height={148} unoptimized className="h-auto w-[196px]" />
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-7">IT og telecom i riktig retning. Én partner, uavhengig av leverandør.</p>
            <Link href="/finn-riktig-losning" className="group mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-white">
              <span className="link-underline">Finn riktig løsning</span> <Arrow />
            </Link>
          </div>
          <nav aria-label="Bunnmeny">
            <h2 className={titleClass}>Navigasjon</h2>
            <ul className="mt-5 grid gap-2.5">
              <li><Link href="/" className={linkClass}>Forside</Link></li>
              {navItems.map((item) => <li key={item.href}><Link href={item.href} className={linkClass}>{item.label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <h2 className={titleClass}>Tjenester</h2>
            <ul className="mt-5 grid gap-2.5">
              {services.map((service) => <li key={service.slug}><Link href={`/tjenester/${service.slug}`} className={linkClass}>{service.shortTitle}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className={titleClass}>Kontakt</h2>
            <ul className="mt-5 grid gap-2.5 text-[15px]">
              {site.phone ? <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className={linkClass}>{site.phone}</a></li> : null}
              {site.email ? <li><a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a></li> : null}
              {address ? <li>{address}</li> : null}
              <li><Link href="/kontakt" className={linkClass}>Send oss en henvendelse</Link></li>
              <li><Link href="/support" className={linkClass}>Meld inn supportsak</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-on-navy-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.legalName} · Org.nr. {site.orgNumber}</span>
          <Link href="/personvern" className="link-underline hover:text-white">Personvern</Link>
        </div>
      </div>
    </footer>
  );
}
