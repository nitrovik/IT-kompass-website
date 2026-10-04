import Link from "next/link";
import { homeHero, homeServices } from "@/content/home";
import { HeroFiber } from "@/components/home/fiber/hero-fiber";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { Arrow } from "@/components/ui/arrow";

/* Hver bokstavgruppe glir opp bak en maske – ren CSS, synlig også uten JavaScript. */
function HeroHeadline({ lines }: { lines: string[] }) {
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((sum, line) => sum + line.split(" ").length, 0));
  return (
    <>
      {lines.map((line, lineIndex) => (
        <span key={line} className={lineIndex === lines.length - 1 ? "block text-[#0b63c0]" : "block"}>
          {line.split(" ").map((word, w, words) => (
            <span key={`${line}-${w}`}>
              <span className="hero-word"><span style={{ ["--i" as string]: starts[lineIndex] + w }}>{word}</span></span>
              {w < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section data-hero data-observe="toggle" className="hero-surface relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_70%_45%,#000,transparent)]" aria-hidden="true" />
      <HeroFiber />

      <div className="container-shell relative z-10 flex min-h-[100svh] flex-col pt-[calc(var(--header-h)+2rem)] pb-6 lg:min-h-[max(780px,min(100svh,960px))] lg:pb-10">
        <div className="my-auto max-w-[640px] py-10 lg:py-16">
          <p className="eyebrow hero-fade" style={{ ["--d" as string]: ".05s" }}>{homeHero.eyebrow}</p>
          <h1 id="hero-heading" className="display-text mt-6 text-ink">
            <HeroHeadline lines={homeHero.title} />
          </h1>
          <p className="lead hero-fade mt-7 max-w-[560px] sm:text-[1.2rem]" style={{ ["--d" as string]: ".55s" }}>{homeHero.body}</p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: ".7s" }}>
            <MagneticLink href={homeHero.primaryCta.href}>{homeHero.primaryCta.label} <Arrow /></MagneticLink>
            <MagneticLink href={homeHero.secondaryCta.href} variant="secondary">{homeHero.secondaryCta.label}</MagneticLink>
          </div>
          <nav aria-label={homeHero.quickLinksLabel} className="hero-fade mt-9" style={{ ["--d" as string]: ".85s" }}>
            <ul className="flex flex-wrap gap-2">
              {homeServices.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/80 bg-white/55 pr-3.5 pl-2.5 text-[13px] font-medium text-body backdrop-blur transition hover:border-[#bcd6ee] hover:bg-white hover:text-ink">
                    <span className="relative grid size-2 place-items-center" aria-hidden="true">
                      <span className="absolute size-2 rounded-full bg-brand-bright/30 transition-transform duration-500 group-hover:scale-[2.2]" />
                      <span className="relative size-1.5 rounded-full bg-brand" />
                    </span>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <ul className="glass hero-fade grid grid-cols-2 overflow-hidden rounded-[22px] lg:grid-cols-4" style={{ ["--d" as string]: "1s" }} aria-label="Derfor IT Kompass">
          {homeHero.reasons.map((reason, index) => (
            <li key={reason.title} className="relative px-4 py-4 sm:px-6 sm:py-5 [&:nth-child(n+3)]:border-t [&:nth-child(n+3)]:border-white/70 lg:[&:nth-child(n+3)]:border-t-0 [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:inset-y-5 [&:not(:first-child)]:before:left-0 [&:not(:first-child)]:before:w-px [&:not(:first-child)]:before:bg-[#c9dcee] [&:nth-child(3)]:before:hidden lg:[&:nth-child(3)]:before:block">
              <span className="tabular text-[11px] font-semibold tracking-[.14em] text-brand">0{index + 1}</span>
              <p className="card-title mt-1.5 text-[15px] text-ink sm:text-base">{reason.title}</p>
              <p className="mt-1 text-[12.5px] leading-[1.5] text-muted sm:text-[13px]">{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
