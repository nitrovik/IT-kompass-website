"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { requestFrame, setScrollDriver } from "@/lib/frame";

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/*
  Myk scrolling med Lenis, drevet av den felles bildeløkken (lib/frame.ts), slik at
  scroll-effektene oppdateres i samme bilde som scrollposisjonen. Lenis får sin egen klokke
  som bare går mens den kjører: etter en pause starter neste scroll mykt i stedet for å
  hoppe (Lenis ville ellers trodd at flere sekunder hadde gått siden forrige bilde).
  Løkken stopper når scrollingen har falt til ro. Selve Lenis lastes først etter at siden
  er vist (ledig tid etter load), så den ikke konkurrerer med første visning.
*/
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: Lenis | null = null;
    let cancelled = false;
    let idleFrames = 0;
    let clock = 0;
    let previous = 0;
    let offScroll = () => {};

    const drive = (now: number) => {
      if (!lenis) return false;
      // Maks ett bilde (≈ 34 ms) om gangen, så en pause aldri blir et hopp
      clock += previous ? Math.min(now - previous, 34) : 16.7;
      previous = now;
      lenis.raf(clock);
      idleFrames = lenis.isScrolling ? 0 : idleFrames + 1;
      if (idleFrames > 20) { previous = 0; return false; }
      return true;
    };
    const wake = () => {
      idleFrames = 0;
      requestFrame();
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

    // Lenis lastes når siden er ferdig og nettleseren har ledig tid – ikke før første visning.
    // Til da scroller siden vanlig.
    const start = async () => {
      const { default: LenisClass } = await import("lenis");
      if (cancelled) return;
      lenis = new LenisClass({ duration: 1.1, smoothWheel: true, syncTouch: false, anchors: { offset: -90 }, autoRaf: false });
      setScrollDriver(drive);
      events.forEach((name) => window.addEventListener(name, wake, { passive: true }));
      // Lenis sender ut scroll også når den selv animerer (f.eks. ankerlenker)
      offScroll = lenis.on("scroll", wake);
      window.addEventListener("click", wake, { capture: true, passive: true });
    };
    const idle: Idle = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ?? ((cb) => window.setTimeout(cb, 200));
    const schedule = () => idle(() => { void start(); }, { timeout: 1200 });
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (!lenis) return;
      setScrollDriver(null);
      events.forEach((name) => window.removeEventListener(name, wake));
      window.removeEventListener("click", wake, { capture: true });
      offScroll();
      lenis.destroy();
    };
  }, []);

  return null;
}
