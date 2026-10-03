import Image from "next/image";
import { Check } from "lucide-react";
import { homePositioning } from "@/content/home";
import { Reveal } from "@/components/ui/reveal";

/* Plassholder-illustrasjon til et ekte bilde er levert (se homePositioning.image). */
function PlaceholderVisual() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#9fc9ea,#11355b)]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(255,255,255,.18),transparent_22%),linear-gradient(130deg,rgba(4,16,31,.1),rgba(7,24,46,.72))]" />
      <div className="absolute inset-[10%_9%] -rotate-[4deg] rounded-[22px] bg-[linear-gradient(135deg,#dfeffa,#8cb7da)] shadow-[0_34px_50px_rgba(0,0,0,.17)]">
        <div className="absolute inset-[14%_12%] rounded-[18px] bg-[linear-gradient(160deg,#15395f,#0e233f)] shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)]">
          <div className="absolute inset-[12%] rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,.95),rgba(221,239,252,.72))]">
            <div className="absolute top-[38%] left-[18%] grid w-[64%] gap-3">
              <span className="h-2 rounded-full bg-[#9cc4e6]" />
              <span className="h-2 w-4/5 rounded-full bg-[#bcd6ec]" />
              <span className="h-2 w-3/5 rounded-full bg-[#d4e5f4]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PositioningSection() {
  const { image, caption } = homePositioning;
  return (
    <section className="section-pad bg-soft" aria-labelledby="leverandoruavhengig-heading">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{homePositioning.eyebrow}</p>
          <h2 id="leverandoruavhengig-heading" className="mt-3 text-[clamp(2.25rem,4vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-.04em] text-ink">
            {homePositioning.title.map((line) => <span key={line} className="block">{line}</span>)}
          </h2>
          <p className="mt-5 max-w-[590px] leading-[1.75] text-muted">{homePositioning.body}</p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {homePositioning.points.map((point) => (
              <li key={point.title} className="flex gap-3 text-sm text-[#38536f]">
                <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-sky text-brand" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                <span><strong className="block font-bold text-ink">{point.title}</strong>{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <Reveal>
          <figure className="relative min-h-[340px] overflow-hidden rounded-[28px] sm:min-h-[430px]">
            {image ? <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" /> : <PlaceholderVisual />}
            <figcaption className="absolute right-[6%] bottom-[6%] left-[6%] z-10 rounded-[17px] bg-[rgba(5,24,44,.8)] px-5 py-4 text-white backdrop-blur-lg sm:left-[23%]">
              <strong className="block text-lg sm:text-xl">{caption.title}</strong>
              <span className="mt-1 block text-xs text-[#c3d3e3]">{caption.text}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
