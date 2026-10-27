"use client";

import { useEffect, useRef } from "react";
import { HeroCompass, NEEDLE_REST } from "@/components/home/fiber/hero-compass";
import { onFrame } from "@/lib/frame";

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/*
  Den eneste klientdelen i heroen.

  1. Starter lysimpulsene i fiberscenen (data-fiber-live på heroen) først når siden er
     ferdig lastet og nettleseren har ledig tid, så de aldri konkurrerer med første visning.
     Ikke ved «redusert bevegelse» eller datasparing. Selve bevegelsen er ren CSS (transform).
  2. Kompassnålen følger pekeren på PC (mus, brede skjermer). Kompassets plassering måles
     bare når heroen endrer størrelse (ResizeObserver), og nålen skrives høyst én gang per
     bilde, uansett hvor ofte musen rapporterer bevegelse. Ingenting kjører mens siden scroller.
*/
export function HeroPointer() {
  const needleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = needleRef.current?.closest<HTMLElement>("[data-hero]");
    if (!host) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    const idle: Idle = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ?? ((cb) => window.setTimeout(cb, 300));
    const start = () => idle(() => host.setAttribute("data-fiber-live", ""), { timeout: 2000 });
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    const needle = needleRef.current;
    const compass = needle?.parentElement;
    const host = needle?.closest<HTMLElement>("[data-hero]");
    if (!needle || !compass || !host) return;
    if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;

    // Kompassets sentrum i dokumentet (uavhengig av scroll)
    const center = { x: 0, y: 0 };
    let angle = NEEDLE_REST;
    let target = NEEDLE_REST;
    let idleTimer = 0;
    let queued = false;

    const write = () => {
      queued = false;
      // Korteste vei rundt, så nålen aldri snurrer en hel runde
      angle += ((((target - angle) % 360) + 540) % 360) - 180;
      needle.style.transform = `rotate(${angle.toFixed(1)}deg)`;
      return false;
    };
    const aim = (next: number) => {
      target = next;
      if (!queued) { queued = true; onFrame(write); }
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX + window.scrollX;
      const y = event.clientY + window.scrollY;
      aim((Math.atan2(y - center.y, x - center.x) * 180) / Math.PI + 90);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => aim(NEEDLE_REST), 2200);
    };
    const onLeave = () => {
      window.clearTimeout(idleTimer);
      aim(NEEDLE_REST);
    };

    const measure = () => {
      const box = compass.getBoundingClientRect();
      center.x = box.left + box.width / 2 + window.scrollX;
      center.y = box.top + box.height / 2 + window.scrollY;
    };
    const resize = new ResizeObserver(measure);
    resize.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      window.clearTimeout(idleTimer);
      resize.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <HeroCompass ref={needleRef} />;
}
