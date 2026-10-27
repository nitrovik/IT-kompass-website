import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

/*
  Slank footer fra designet, med den lyse logoen. I tillegg til designets tekst står org.nr., personvern og
  telefon/e-post/adresse (når de er lagt inn i config/site.ts).
*/
export function SiteFooter() {
  const address = [site.address, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <Link className="footer-brand" href="/" aria-label={`${site.name}, til forsiden`}>
          <Image className="footer-logo" src="/brand/it-kompass-logo-web-inverse-opt.png" alt={site.name} width={414} height={148} unoptimized />
        </Link>
        <span className="footer-meta">
          IT og telecom for bedrifter. Org.nr. {site.orgNumber}
          {site.phone ? <> · <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></> : null}
          {site.email ? <> · <a href={`mailto:${site.email}`}>{site.email}</a></> : null}
          {address ? <> · {address}</> : null}
          {" · "}<Link href="/personvern">Personvern</Link>
        </span>
        <a className="footer-top" href="#top">Til toppen ↑</a>
      </div>
    </footer>
  );
}
