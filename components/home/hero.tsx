import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { homeHero, homeServices } from "@/content/home";
import { FiberField } from "@/components/site/fiber-field";
import { HeroPointer } from "@/components/home/hero-pointer";
import { WordReveal } from "@/components/home/word-reveal";
import { MagneticLink } from "@/components/ui/magnetic-link";

export function Hero() {
  const { panel } = homeHero;
  return (
    <section className="hero-surface relative overflow-hidden" aria-labelledby="hero-heading">
      <HeroPointer className="fiber-parallax absolute inset-0 opacity-60 lg:opacity-95">
        <FiberField variant="hero" />
      </HeroPointer>
      <div className="container-shell relative z-10 grid items-center gap-10 py-16 sm:py-20 lg:min-h-[650px] lg:grid-cols-[1fr_.72fr] lg:gap-[70px] lg:py-[108px]">
        <div>
          <p className="eyebrow">{homeHero.eyebrow}</p>
          <h1 id="hero-heading" className="display-text mt-5 max-w-[700px] text-ink">
            <WordReveal lines={homeHero.title} accentLast />
          </h1>
          <p className="mt-6 max-w-[650px] text-[17px] leading-[1.65] text-body sm:text-[19px]">{homeHero.body}</p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <MagneticLink href={homeHero.primaryCta.href}>{homeHero.primaryCta.label} <ArrowRight size={17} aria-hidden="true" /></MagneticLink>
            <MagneticLink href={homeHero.secondaryCta.href} variant="secondary">{homeHero.secondaryCta.label}</MagneticLink>
          </div>
          <nav aria-label="Tjenester" className="mt-8">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] font-medium text-body">
              {homeServices.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="inline-flex items-center gap-2.5 rounded-full py-1 transition-colors hover:text-brand">
                    <span className="size-[7px] rounded-full bg-brand shadow-[0_0_0_6px_rgba(8,124,240,.09)]" aria-hidden="true" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <aside className="glass-panel relative rounded-[26px] p-3 sm:p-[18px]" aria-label={panel.title}>
          <div className="flex items-center justify-between gap-4 px-2 pt-2 pb-4">
            <h2 className="text-[15px] font-extrabold text-ink">{panel.title}</h2>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#1a64a8]">
              <span className="size-2 rounded-full bg-[#39b86a] shadow-[0_0_0_6px_rgba(57,184,106,.12)]" aria-hidden="true" />
              {panel.status}
            </span>
          </div>
          <ul>
            {panel.rows.map(({ icon: Icon, title, text }) => (
              <li key={title} className="grid grid-cols-[42px_1fr_auto] items-center gap-3.5 border-t border-[#b8cfe5]/60 px-2.5 py-4">
                <span className="grid size-[42px] place-items-center rounded-[13px] bg-[linear-gradient(145deg,#eff8ff,#dceeff)] text-brand" aria-hidden="true"><Icon size={19} strokeWidth={2} /></span>
                <span>
                  <span className="block text-[15px] font-extrabold text-ink">{title}</span>
                  <span className="mt-1 block text-xs leading-[1.5] text-muted">{text}</span>
                </span>
                <Check size={16} strokeWidth={3} className="text-success" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
