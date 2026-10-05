"use client";

import { useEffect, useRef } from "react";
import { onScroll } from "@/lib/frame";

type Step = { number: string; title: string; text?: string };

/*
  Stegene i «Slik jobber vi». Fiberlinjen fylles med lys etter hvor langt du har scrollet
  gjennom seksjonen, og hvert steg tennes når lyset når det. Plasseringen måles bare når
  sidens størrelse endres; per bilde regnes framdriften ut fra scrollposisjonen alene, og
  bare lyslinjen (transform) og stegene som faktisk skifter tilstand skrives.
*/
export function ProcessTrack({ steps, className }: { steps: Step[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const light = lightRef.current;
    if (!el || !light) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const active = items.map(() => false);
    let last = "";
    const apply = (p: number) => {
      const value = p.toFixed(3);
      if (value === last) return;
      last = value;
      light.style.setProperty("--p", value);
      items.forEach((item, i) => {
        const on = p >= (i / Math.max(items.length - 1, 1)) * 0.98;
        if (on !== active[i]) { active[i] = on; item.dataset.active = String(on); }
      });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(1); return; }

    let top = 0;
    return onScroll({
      measure: ({ y }) => { top = el.getBoundingClientRect().top + y; },
      update: ({ y, vh }) => apply(Math.min(Math.max((vh * 0.82 - (top - y)) / (vh * 0.55), 0), 1)),
    });
  }, []);

  return (
    <ol ref={ref} className={`relative mt-16 grid gap-10 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:gap-8 ${className ?? ""}`} style={{ ["--n" as string]: steps.length }}>
      {/* Sporet og lyset */}
      <span aria-hidden="true" className="absolute top-7 bottom-7 left-7 w-px bg-line md:top-7 md:right-[calc(50%/var(--n))] md:bottom-auto md:left-[calc(50%/var(--n))] md:h-px md:w-auto">
        <span ref={lightRef} className="process-light absolute inset-0 bg-[linear-gradient(180deg,#2aa6ff,#0a6ed1)] md:bg-[linear-gradient(90deg,#2aa6ff,#0a6ed1)]" />
      </span>
      {steps.map((step) => (
        <li key={step.number} data-step data-active="false" className="group/step relative grid grid-cols-[56px_1fr] gap-5 md:grid-cols-1 md:gap-0 md:text-center">
          <span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full border border-line bg-white text-[15px] font-semibold text-faint tabular shadow-[0_8px_20px_-12px_rgba(14,39,71,.35)] transition-[color,border-color,box-shadow] duration-700 group-data-[active=true]/step:border-brand/50 group-data-[active=true]/step:text-brand group-data-[active=true]/step:shadow-[0_0_0_6px_rgba(42,166,255,.12),0_10px_24px_-10px_rgba(10,110,209,.6)]">
            <svg viewBox="0 0 56 56" className="absolute inset-0 size-full" aria-hidden="true">
              {[0, 90, 180, 270].map((a) => <line key={a} x1="28" y1="4" x2="28" y2="8" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${a} 28 28)`} />)}
            </svg>
            {step.number}
          </span>
          <div className="md:mt-7 md:px-3">
            <h3 className="card-title text-[19px] text-ink">{step.title}</h3>
            {step.text ? <p className="mt-2 text-[15px] leading-[1.6] text-muted">{step.text}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
