"use client";

import { useEffect, useRef } from "react";
import { onScroll } from "@/lib/frame";

/*
  Kompasset som scroll-indikator: ringen fylles etter hvor langt ned du har kommet,
  nålen dreier med, og et klikk tar deg til toppen. Dukker opp etter første skjermhøyde.
*/
export function CompassToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);

  // Kjører i den felles bildeløkken og skriver bare når verdien faktisk endres
  useEffect(() => {
    const el = ref.current;
    const ring = ringRef.current;
    const needle = needleRef.current;
    if (!el || !ring || !needle) return;
    let shown = "";
    let last = "";
    return onScroll({
      update: ({ y, vh, vw, max }) => {
        const show = y > vh * 0.8 ? "true" : "false";
        if (show !== shown) el.dataset.show = shown = show;
        if (vw < 1024) return; // knappen vises bare på store skjermer
        const progress = (max > 0 ? Math.min(y / max, 1) : 0).toFixed(3);
        if (progress === last) return;
        last = progress;
        ring.style.strokeDashoffset = String(1 - Number(progress));
        needle.style.setProperty("--a", `${(Number(progress) * 180).toFixed(1)}deg`);
      },
    });
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button ref={ref} type="button" onClick={toTop} data-show="false" aria-label="Til toppen av siden"
      className="group fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full border border-line bg-white/95 shadow-[0_18px_40px_-18px_rgba(14,39,71,.45)] transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] data-[show=false]:pointer-events-none data-[show=false]:translate-y-3 data-[show=false]:opacity-0 hover:-translate-y-0.5 lg:grid">
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r="25" fill="none" stroke="#e0eaf4" strokeWidth="2" />
        <circle ref={ringRef} cx="28" cy="28" r="25" fill="none" stroke="url(#ctt)" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        <defs>
          <linearGradient id="ctt" x1="0" x2="1"><stop offset="0" stopColor="#2aa6ff" /><stop offset="1" stopColor="#0a6ed1" /></linearGradient>
        </defs>
      </svg>
      {/* Ytre del dreier med scrollen (uten overgang), indre del retter nålen opp ved hover */}
      <span ref={needleRef} className="relative block h-7 w-2.5 will-change-transform [transform:rotate(var(--a,0deg))]" aria-hidden="true">
        <svg viewBox="0 0 10 28" className="absolute inset-0 size-full transition-[rotate] duration-300 group-hover:[rotate:calc(var(--a,0deg)*-1)]">
          <path d="M5 0 9 14H1Z" fill="#0e2747" />
          <path d="M1 14h8l-4 14Z" fill="#2a8aa8" />
          <circle cx="5" cy="14" r="1.8" fill="#fff" stroke="#0e2747" strokeWidth="1" />
        </svg>
      </span>
    </button>
  );
}
