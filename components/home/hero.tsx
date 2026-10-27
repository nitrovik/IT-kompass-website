import { homeHero } from "@/content/home";
import { FiberScene } from "@/components/home/fiber/fiber-scene";
import { HeroPointer } from "@/components/home/fiber/hero-pointer";
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

/*
  PC: teksten til venstre, kompasset til høyre i innholdsrammen, fibrene inn fra nede til venstre.
  Mobil: kompasset og fibrene i det frie feltet over teksten, så de aldri krysser overskrift eller knapp.
*/
export function Hero() {
  return (
    <section data-hero data-observe="toggle" className="hero-surface hero-surface-home relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_42%_at_42%_24%,#000,transparent)] lg:[mask-image:radial-gradient(52%_60%_at_70%_46%,#000,transparent)]" aria-hidden="true" />

      <div className="container-shell relative z-10 flex min-h-[min(100svh,760px)] flex-col pt-[var(--header-h)] pb-8 lg:min-h-[max(780px,min(100svh,960px))] lg:pt-[calc(var(--header-h)+2rem)] lg:pb-10">
        <div className="pointer-events-none relative h-[clamp(170px,30svh,250px)] shrink-0 lg:static lg:h-auto">
          <FiberScene>
            <HeroPointer />
          </FiberScene>
        </div>

        <div className="relative mt-[clamp(.5rem,3svh,2rem)] mb-auto max-w-[640px] lg:my-auto lg:py-16">
          <p className="eyebrow hero-fade" style={{ ["--d" as string]: ".05s" }}>{homeHero.eyebrow}</p>
          <h1 id="hero-heading" className="display-text mt-6 text-ink">
            <HeroHeadline lines={homeHero.title} />
          </h1>
          <p className="lead hero-fade mt-7 max-w-[560px] sm:text-[1.2rem]" style={{ ["--d" as string]: ".55s" }}>{homeHero.body}</p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: ".7s" }}>
            <MagneticLink href={homeHero.cta.href}>{homeHero.cta.label} <Arrow /></MagneticLink>
          </div>
        </div>
      </div>
    </section>
  );
}
