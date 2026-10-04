"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/*
  Myk scrolling med Lenis. Animasjonsløkken kjører bare mens siden faktisk scroller:
  den startes av hjul, berøring, tastatur og lenker, og stopper når scrollingen har
  falt til ro. Da ber vi ikke nettleseren tegne nye bilder når ingenting skjer.
*/
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, anchors: { offset: -90 } });
    let frame = 0;
    let idleFrames = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      idleFrames = lenis.isScrolling ? 0 : idleFrames + 1;
      if (idleFrames > 20) { frame = 0; return; }
      frame = requestAnimationFrame(raf);
    };
    const wake = () => {
      idleFrames = 0;
      if (!frame) frame = requestAnimationFrame(raf);
    };

    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((name) => window.addEventListener(name, wake, { passive: true }));
    // Lenis sender ut scroll også når den selv animerer (f.eks. ankerlenker)
    const offScroll = lenis.on("scroll", wake);
    window.addEventListener("click", wake, { capture: true, passive: true });
    wake();

    return () => {
      cancelAnimationFrame(frame);
      events.forEach((name) => window.removeEventListener(name, wake));
      window.removeEventListener("click", wake, { capture: true });
      offScroll();
      lenis.destroy();
    };
  }, []);

  return null;
}
