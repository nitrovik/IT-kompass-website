"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  Liten dybdeeffekt: elementet forskyves litt i forhold til scroll (styrke i px over
  hele passeringen). Bare transform, bare når elementet er i nærheten av skjermen.
*/
export function Parallax({ children, strength = 40, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let active = false;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      el.style.transform = `translate3d(0, ${(-p * strength).toFixed(2)}px, 0)`;
    };
    const onScroll = () => { if (active && !frame) frame = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) onScroll(); }, { rootMargin: "20% 0px" });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [strength]);
  return <div ref={ref} className={className} style={{ willChange: "transform" }}>{children}</div>;
}
