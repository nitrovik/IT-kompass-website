"use client";

import { useEffect, useRef } from "react";

/*
  Kompasset som scroll-indikator: ringen fylles etter hvor langt ned du har kommet,
  nålen dreier med, og et klikk tar deg til toppen. Dukker opp etter første skjermhøyde.
*/
export function CompassToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const progress = max > 0 ? Math.min(y / max, 1) : 0;
      el.style.setProperty("--p", progress.toFixed(4));
      el.dataset.show = y > window.innerHeight * 0.8 ? "true" : "false";
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button ref={ref} type="button" onClick={toTop} data-show="false" aria-label="Til toppen av siden"
      className="group fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full border border-line bg-white/85 shadow-[0_18px_40px_-18px_rgba(14,39,71,.45)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] data-[show=false]:pointer-events-none data-[show=false]:translate-y-3 data-[show=false]:opacity-0 hover:-translate-y-0.5 lg:grid">
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r="25" fill="none" stroke="#e0eaf4" strokeWidth="2" />
        <circle cx="28" cy="28" r="25" fill="none" stroke="url(#ctt)" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: "calc(1 - var(--p, 0))" }} />
        <defs>
          <linearGradient id="ctt" x1="0" x2="1"><stop offset="0" stopColor="#2aa6ff" /><stop offset="1" stopColor="#0a6ed1" /></linearGradient>
        </defs>
      </svg>
      <span className="relative block h-7 w-2.5 transition-transform duration-300 group-hover:!rotate-0" style={{ transform: "rotate(calc(var(--p, 0) * 180deg))" }} aria-hidden="true">
        <svg viewBox="0 0 10 28" className="absolute inset-0 size-full">
          <path d="M5 0 9 14H1Z" fill="#0e2747" />
          <path d="M1 14h8l-4 14Z" fill="#2a8aa8" />
          <circle cx="5" cy="14" r="1.8" fill="#fff" stroke="#0e2747" strokeWidth="1" />
        </svg>
      </span>
    </button>
  );
}
