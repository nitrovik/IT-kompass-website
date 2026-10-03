import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/config/site";
import { services } from "@/content/services";

const titleClass = "text-xs font-extrabold uppercase tracking-[.14em] text-[#82b7e8]";
const linkClass = "text-sm leading-7 text-on-navy transition-colors hover:text-white";

export function SiteFooter() {
  const address = [site.address, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return (
    <footer className="bg-footer text-on-navy">
      <div className="container-shell pt-14 pb-7">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.8fr_1fr]">
          <div>
            <Link href="/" className="inline-block rounded-2xl bg-white/95 px-3.5 py-3 shadow-[0_10px_30px_rgba(0,0,0,.10)]" aria-label={`${site.name} – til forsiden`}>
              <Image src="/brand/it-kompass-logo-web.png" alt={site.name} width={414} height={148} className="h-auto w-[180px]" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6">IT og telecom i riktig retning. Én partner, uavhengig av leverandør.</p>
          </div>
          <nav aria-label="Bunnmeny">
            <h2 className={titleClass}>Navigasjon</h2>
            <ul className="mt-4">
              <li><Link href="/" className={linkClass}>Forside</Link></li>
              {navItems.map((item) => <li key={item.href}><Link href={item.href} className={linkClass}>{item.label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <h2 className={titleClass}>Tjenester</h2>
            <ul className="mt-4">
              {services.map((service) => <li key={service.slug}><Link href={`/tjenester/${service.slug}`} className={linkClass}>{service.shortTitle}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className={titleClass}>Kontakt</h2>
            <ul className="mt-4 text-sm leading-7">
              {site.phone ? <li>Telefon <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-white hover:underline">{site.phone}</a></li> : null}
              {site.email ? <li>E-post <a href={`mailto:${site.email}`} className="text-white hover:underline">{site.email}</a></li> : null}
              {address ? <li>{address}</li> : null}
              <li>Org.nr. {site.orgNumber}</li>
              {!site.phone && !site.email ? <li><Link href="/kontakt" className={linkClass}>Send oss en henvendelse</Link></li> : null}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-on-navy-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.legalName}</span>
          <Link href="/personvern" className="hover:text-white">Personvern</Link>
        </div>
      </div>
    </footer>
  );
}
