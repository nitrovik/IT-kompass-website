"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  Lar fiberscenen reagere svakt på musepekeren. Kun på enheter med presis peker
  og uten «redusert bevegelse». Posisjonen skrives som CSS-variabler i én
  requestAnimationFrame per bilde, uten React-state og uten layoutmåling per bevegelse.
*/
export function HeroPointer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;
    const capable = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!capable || reduce) return;

    let frame = 0;
    let rect = host.getBoundingClientRect();
    const updateRect = () => { rect = host.getBoundingClientRect(); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        layer.style.setProperty("--px", x.toFixed(3));
        layer.style.setProperty("--py", y.toFixed(3));
      });
    };
    const onLeave = () => {
      layer.style.setProperty("--px", "0");
      layer.style.setProperty("--py", "0");
    };

    host.addEventListener("pointerenter", updateRect);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointerenter", updateRect);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true">{children}</div>;
}
