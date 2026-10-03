"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function CompassScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);
  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 xl:block" aria-hidden="true">
      <div className="relative flex h-44 w-10 items-center justify-center rounded-full border border-white/8 bg-[#07111f]/30 backdrop-blur">
        <div className="absolute inset-2 rounded-full border border-white/6" />
        <div className="absolute h-24 w-px bg-gradient-to-b from-transparent via-[#269BFF]/50 to-transparent" />
        <div className="absolute h-7 w-1 origin-bottom rounded-full bg-gradient-to-t from-[#269BFF] to-[#6EC5FF]" style={{ transform: `rotate(${reduceMotion ? 0 : progress * 160 - 80}deg)` }} />
        <span className="absolute bottom-5 text-[9px] font-bold tracking-[.18em] text-slate-500">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
