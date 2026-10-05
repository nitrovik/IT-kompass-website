"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { onScroll } from "@/lib/frame";

/*
  Liten dybdeeffekt: elementet forskyves litt i forhold til scroll (styrke i px over
  hele passeringen). Bare transform. Plasseringen måles når sidens størrelse endres,
  ikke per bilde, og ingenting skrives når elementet er langt utenfor skjermen.
*/
export function Parallax({ children, strength = 40, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let top = 0;
    let height = 0;
    let offset = 0;
    return onScroll({
      // Trekk fra egen forskyvning, så målingen gjelder den opprinnelige plasseringen
      measure: ({ y }) => { const rect = el.getBoundingClientRect(); top = rect.top + y - offset; height = rect.height; },
      update: ({ y, vh }) => {
        const center = top - y + height / 2;
        if (center < -vh || center > vh * 2) return;
        const p = (center - vh / 2) / (vh / 2 + height / 2);
        const next = Math.round(-p * strength * 10) / 10;
        if (next === offset) return;
        offset = next;
        el.style.transform = `translate3d(0, ${next}px, 0)`;
      },
    });
  }, [strength]);
  return <div ref={ref} className={className} style={{ willChange: "transform" }}>{children}</div>;
}
