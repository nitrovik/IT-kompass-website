import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";

const shortcuts = [
  { href: "/tjenester", label: "Tjenester" },
  { href: "/finn-riktig-losning", label: "Finn riktig løsning" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="hero-surface relative grid min-h-[100svh] place-items-center overflow-hidden px-6 pt-[var(--header-h)] pb-16 outline-none">
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_45%,#000,transparent)]" aria-hidden="true" />
      <div className="relative max-w-xl text-center" data-inview="true">
        {/* Kompasset leter etter retningen og finner tilbake til nord */}
        <div className="relative mx-auto grid size-32 place-items-center rounded-full border border-white bg-white/70 shadow-[0_30px_60px_-30px_rgba(14,39,71,.5)] backdrop-blur" aria-hidden="true">
          <span className="compass-ping absolute inset-0 rounded-full border border-brand-bright/40" />
          <svg viewBox="0 0 120 120" className="absolute inset-0 size-full">
            <circle cx="60" cy="60" r="47" fill="none" stroke="#0e2747" strokeWidth="2.6" />
            {[0, 90, 180, 270].map((a) => <line key={a} x1="60" y1="13" x2="60" y2="21" stroke="#0e2747" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${a} 60 60)`} />)}
          </svg>
          <span className="lost-needle relative block h-[72px] w-[18px]">
            <svg viewBox="0 0 18 70" className="absolute inset-0 size-full"><path d="M9 0 L17 35 L1 35 Z" fill="#0e2747" /><path d="M1 35 L17 35 L9 70 Z" fill="#2a8aa8" /><circle cx="9" cy="35" r="4.4" fill="#fff" stroke="#0e2747" strokeWidth="2" /></svg>
          </span>
        </div>
        <p className="eyebrow mt-10 justify-center">404 – feil retning</p>
        <h1 className="page-title mt-5 text-ink">Du har tatt en annen vei.</h1>
        <p className="lead mt-5">Siden du leter etter finnes ikke. Kompasset peker deg tilbake.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}><Arrow className="rotate-180" /> Til forsiden</Link>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]">
          {shortcuts.map((item) => <li key={item.href}><Link href={item.href} className="link-underline text-muted hover:text-ink">{item.label}</Link></li>)}
        </ul>
      </div>
    </main>
  );
}
