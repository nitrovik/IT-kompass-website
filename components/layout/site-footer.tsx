import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";

export function SiteFooter() {
  const contactLabel = site.phone || site.email || site.address ? "Kontaktinformasjon" : "Kontaktinformasjon konfigureres før publisering";
  return (
    <footer className="border-t border-white/8 bg-[#050d17]">
      <div className="container-shell section-pad !pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.8fr]">
          <div>
            <div className="eyebrow">IT Kompass AS</div>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Teknologi som skal fungere i hverdagen.</h2>
            <p className="mt-5 max-w-lg leading-7 text-slate-400">Nøytral partner innen IT og telecom for små og mellomstore bedrifter. Én kontakt for løsningen.</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Navigasjon</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              <Link href="/tjenester" className="hover:text-white">Tjenester</Link>
              <Link href="/prosjekter" className="hover:text-white">Prosjekter</Link>
              <Link href="/om-oss" className="hover:text-white">Om oss</Link>
              <Link href="/support" className="hover:text-white">Support</Link>
              <Link href="/kontakt" className="hover:text-white">Kontakt</Link>
              <Link href="/personvern" className="hover:text-white">Personvern</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{contactLabel}</div>
            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <div className="flex gap-3"><span className="mt-0.5 text-[#6EC5FF]"><MapPin size={16}/></span><span>{site.address ? `${site.address}, ${site.postalCode} ${site.city}` : "Adresse settes før publisering."}</span></div>
              <div className="flex gap-3"><span className="mt-0.5 text-[#6EC5FF]"><Phone size={16}/></span><span>{site.phone || "Telefon settes før publisering."}</span></div>
              <div className="flex gap-3"><span className="mt-0.5 text-[#6EC5FF]"><Mail size={16}/></span><span>{site.email || "E-post settes før publisering."}</span></div>
              <div>Org.nr. {site.orgNumber}</div>
            </div>
            {!site.phone && !site.email && !site.address ? (
              <div className="mt-5 rounded-xl border border-[#269BFF]/15 bg-[#269BFF]/5 p-4 text-xs leading-5 text-slate-400">Kontaktverdiene ligger samlet i <code className="text-slate-300">config/site.ts</code> og fylles inn før publisering.</div>
            ) : null}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} IT Kompass AS</div>
          <Link href="/finn-riktig-losning" className="inline-flex items-center gap-1 text-slate-300 hover:text-white">Finn riktig løsning <ArrowUpRight size={13}/></Link>
        </div>
      </div>
    </footer>
  );
}
