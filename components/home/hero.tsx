import { homeHero } from "@/content/home";
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
            <MagneticLink href={homeHero.cta.href}>{homeHero.cta.label} <Arrow /></MagneticLink>
          </div>
        </div>
      </div>
    </section>
  );
}
