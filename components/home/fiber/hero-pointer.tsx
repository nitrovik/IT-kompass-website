"use client";

import { useEffect, useRef } from "react";
import { HeroCompass } from "@/components/home/fiber/hero-compass";
import { onScroll, scrollState } from "@/lib/frame";

/*
  Kompassnålen følger pekeren på desktop (musepeker, store skjermer). Heroens plassering
  i dokumentet måles bare når sidens størrelse endres (den felles bildeløkken), ikke per
  pekerbevegelse. På berøringsskjermer og smale skjermer skjer ingenting – kompasset vises
  ikke der uansett (se hero-compass.tsx).
*/
export function HeroPointer() {
  const needleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const needle = needleRef.current;
    const host = needle?.closest<HTMLElement>("[data-hero]");
    if (!needle || !host) return;
    if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;

    const rect = { top: 0, left: 0, width: 1, height: 1 };
    let angle = 42;
    let idleTimer = 0;

    const setNeedle = (target: number) => {
      // Korteste vei rundt, så nålen aldri snurrer en hel runde
      const delta = ((((target - angle) % 360) + 540) % 360) - 180;
      angle += delta;
      needle.style.transform = `rotate(${angle.toFixed(1)}deg)`;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX - rect.left;
      const y = event.clientY - (rect.top - scrollState().y);
      // På 1024–1279 px står kompasset litt lenger til høyre (se hero-compass.tsx)
      const cx = rect.width * (rect.width < 1280 ? 0.75 : 0.7);
      const cy = rect.height * 0.46;
      setNeedle((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setNeedle(42), 2200);
    };
    const onLeave = () => {
      window.clearTimeout(idleTimer);
      setNeedle(42);
    };

    const offScroll = onScroll({
      measure: ({ y }) => {
        const box = host.getBoundingClientRect();
        rect.top = box.top + y;
        rect.left = box.left;
        rect.width = box.width;
        rect.height = box.height;
      },
      update: () => {},
    });
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      window.clearTimeout(idleTimer);
      offScroll();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <HeroCompass ref={needleRef} />;
}
