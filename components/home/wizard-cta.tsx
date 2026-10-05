import Link from "next/link";
import { homeWizardCta } from "@/content/home";
import { wizardSteps } from "@/content/wizard";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";
import { SplitWords } from "@/components/ui/split-words";
import { cn } from "@/lib/utils";

/*
  Fiberbånd i bakgrunnen – CSS-animasjon som bare går mens seksjonen er synlig.
  Gløden rundt pulsene er brede, svake streker med samme animasjon (ikke et blurfilter,
  som måtte vært regnet ut på nytt for hele banneret i hvert bilde), og SVG-en ligger i
  et eget lag, så bare den tegnes på nytt – ikke tekst og bakgrunn.
*/
function BannerFibers() {
  const paths = [
    "M-40 240 C 260 120, 520 90, 760 170 S 1100 210, 1280 40",
    "M-40 262 C 240 150, 520 70, 790 150 S 1120 240, 1280 90",
    "M-40 214 C 280 90, 560 130, 820 190 S 1120 160, 1280 10",
    "M-40 288 C 300 190, 600 130, 840 210 S 1130 260, 1280 150",
    "M-40 300 C 340 230, 640 170, 880 230 S 1160 280, 1280 200",
  ];
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] w-full will-change-transform [mask-image:linear-gradient(90deg,transparent_5%,#000_55%)] sm:inset-0 sm:h-full" viewBox="0 0 1240 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        {paths.map((d, i) => <path key={`c-${i}`} d={d} stroke="#5fb8ff" strokeOpacity={0.12 + i * 0.03} strokeWidth="1.1" />)}
        {paths.map((d, i) => {
          const timing = { animationDuration: `${7 + i * 1.3}s`, animationDelay: `${-i * 2.1}s` };
          return (
            <g key={`p-${i}`}>
              <path d={d} pathLength={1} stroke="#48b9ff" strokeOpacity=".07" strokeWidth="11" className="banner-pulse" style={timing} />
              <path d={d} pathLength={1} stroke="#48b9ff" strokeOpacity=".12" strokeWidth="7" className="banner-pulse" style={timing} />
              <path d={d} pathLength={1} stroke="#48b9ff" strokeOpacity=".24" strokeWidth="4" className="banner-pulse" style={timing} />
              <path d={d} pathLength={1} stroke={i % 2 ? "#ffffff" : "#48b9ff"} strokeWidth={i % 2 ? 1.6 : 2.2} className="banner-pulse" style={timing} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function WizardCta() {
  const needs = wizardSteps[0].options;
  return (
    <section className="px-3 py-[clamp(4rem,7vw,6rem)] sm:px-4" aria-labelledby="veiviser-heading">
      <div data-observe="toggle" className="navy-slab on-dark relative overflow-hidden rounded-[32px] lg:rounded-[40px]">
        <BannerFibers />
        <div className="container-shell relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow" data-reveal="fade">{homeWizardCta.eyebrow}</p>
              <h2 id="veiviser-heading" data-split className="section-title mt-5 text-white"><SplitWords text={homeWizardCta.title} /></h2>
              <p data-reveal style={{ ["--d" as string]: ".15s" }} className="lead mt-6 !text-on-navy">{homeWizardCta.body}</p>
              <ul data-reveal style={{ ["--d" as string]: ".25s" }} className="mt-8 flex flex-wrap gap-2.5" aria-label="Velg hva det gjelder">
                {needs.map((need) => (
                  <li key={need}>
                    <Link href={`/finn-riktig-losning?behov=${encodeURIComponent(need)}`}
                      className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-white/[.06] pr-4 pl-3 text-[14px] font-medium text-white backdrop-blur transition hover:-translate-y-px hover:border-[#48b9ff]/60 hover:bg-[#48b9ff]/12">
                      <span className="grid size-5 place-items-center rounded-full border border-white/30 transition group-hover:border-[#48b9ff] group-hover:bg-[#48b9ff]" aria-hidden="true">
                        <span className="size-1.5 rounded-full bg-white/70 transition group-hover:bg-white" />
                      </span>
                      {need}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={homeWizardCta.cta.href} data-reveal style={{ ["--d" as string]: ".3s" }} className={cn(buttonVariants({ variant: "light", size: "lg" }), "self-start lg:self-end")}>
              {homeWizardCta.cta.label} <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
