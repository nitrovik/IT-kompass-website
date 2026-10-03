"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollSequence() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const line = ref.current.querySelector<HTMLElement>("[data-sequence-line]");
    const nodes = ref.current.querySelectorAll<HTMLElement>("[data-sequence-node]");
    const ctx = gsap.context(() => {
      gsap.fromTo(line, { scaleX: .1, transformOrigin: "left center" }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 55%", scrub: true } });
      gsap.fromTo(nodes, { opacity: .35, y: 4 }, { opacity: 1, y: 0, stagger: .08, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 72%", end: "bottom 52%", scrub: true } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className="pointer-events-none absolute inset-x-0 top-1/2 hidden md:block" aria-hidden="true"><div data-sequence-line className="h-px origin-left scale-x-0 bg-gradient-to-r from-[#269BFF]/60 via-[#6EC5FF]/30 to-transparent" />{["20%","45%","70%","92%"].map((left, i) => <span key={left} data-sequence-node className="absolute top-0 size-2 -translate-y-1/2 rounded-full border border-[#6EC5FF]/30 bg-[#269BFF]/60 shadow-[0_0_14px_rgba(38,155,255,.45)]" style={{ left }} />)}</div>;
}
