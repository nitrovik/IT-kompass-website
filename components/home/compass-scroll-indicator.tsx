"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* Diskré kompass på store skjermer. Nålen dreier etter hvor langt ned på siden du er. */
export function CompassScrollIndicator() {
  const needle = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        needle.current?.style.setProperty("transform", `rotate(${progress * 180}deg)`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none fixed right-5 bottom-6 z-30 hidden xl:block" aria-hidden="true">
      <div className="relative grid size-12 place-items-center rounded-full border border-line bg-white/85 shadow-[0_10px_30px_rgba(16,42,77,.10)] backdrop-blur">
        <span className="absolute inset-1.5 rounded-full border border-line" />
        <span ref={needle} className="relative block h-7 w-1.5 transition-transform duration-300 ease-out">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-[#0f2a4d] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#2a8aa8] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        </span>
        <span className="absolute size-1.5 rounded-full border border-[#0f2a4d] bg-white" />
      </div>
    </div>
  );
}
