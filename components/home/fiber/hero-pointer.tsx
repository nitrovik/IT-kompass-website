"use client";

import { useEffect, useRef } from "react";
import { HeroCompass } from "@/components/home/fiber/hero-compass";
import { BRANCH_ANGLES, NEEDLE_REST } from "@/components/home/fiber/scene";
import { onFrame } from "@/lib/frame";

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/*
  Den eneste klientdelen i heroen.

  1. Starter bevegelsen på forsiden først når siden er ferdig lastet og nettleseren har ledig
     tid: laster keyframes-filen (/motion.css) og setter data-fiber-live på heroen når den er
     klar. Ikke ved «redusert bevegelse» eller datasparing. Selve bevegelsen er ren CSS (transform).
  2. Kompassnålen følger pekeren på PC (mus, brede skjermer). Peker du mot et av alternativene,
     låser nålen seg til grenen og grenen lyser svakt opp (data-focus på ankeret, CSS-overgang
     på opacity). I ro peker nålen mot det riktige valget. Kompassets plassering måles bare når
     heroen endrer størrelse (ResizeObserver), og nålen skrives høyst én gang per bilde, uansett
     hvor ofte musen rapporterer bevegelse. Ingenting kjører mens siden scroller.
*/
export function HeroPointer() {
  const needleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = needleRef.current?.closest<HTMLElement>("[data-hero]");
    if (!host) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    const href = host.querySelector<HTMLElement>("[data-motion-css]")?.dataset.motionCss;
    if (!href) return;
    const idle: Idle = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ?? ((cb) => window.setTimeout(cb, 300));
    const live = () => host.setAttribute("data-fiber-live", "");
    const start = () => idle(() => {
      // Samme fil gjenbrukes hvis brukeren kommer tilbake til forsiden uten å laste siden på nytt
      const existing = document.querySelector<HTMLLinkElement>(`link[data-motion="${href}"]`);
      if (existing?.sheet) return live();
      const link = existing ?? Object.assign(document.createElement("link"), { rel: "stylesheet", href });
      link.dataset.motion = href;
      link.addEventListener("load", live, { once: true });
      if (!existing) document.head.append(link);
    }, { timeout: 2000 });
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    const needle = needleRef.current;
    const compass = needle?.parentElement;
    const host = needle?.closest<HTMLElement>("[data-hero]");
    const anchor = needle?.closest<HTMLElement>(".fiber-anchor");
    if (!needle || !compass || !host || !anchor) return;
    if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;

    // Kompassets sentrum i dokumentet (uavhengig av scroll)
    const center = { x: 0, y: 0 };
    let angle = NEEDLE_REST;
    let target = NEEDLE_REST;
    let idleTimer = 0;
    let queued = false;
    let focus = -1;

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
    const setFocus = (next: number) => {
      if (next === focus) return;
      focus = next;
      if (next < 0) delete anchor.dataset.focus;
      else anchor.dataset.focus = String(next);
    };
    const rest = () => { setFocus(-1); aim(NEEDLE_REST); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const dx = event.clientX + window.scrollX - center.x;
      const dy = event.clientY + window.scrollY - center.y;
      // Retning fra nord med klokka, 0–360 (samme mål som grenenes vinkler i scene.ts)
      const bearing = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
      // Til høyre for kompasset og nær en gren: lås nålen til grenen
      let nearest = -1;
      if (dx > 30) BRANCH_ANGLES.forEach((angle, i) => { if (Math.abs(angle - bearing) < 22 && (nearest < 0 || Math.abs(angle - bearing) < Math.abs(BRANCH_ANGLES[nearest] - bearing))) nearest = i; });
      setFocus(nearest);
      aim(nearest < 0 ? bearing : BRANCH_ANGLES[nearest]);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(rest, 2200);
    };
    const onLeave = () => {
      window.clearTimeout(idleTimer);
      rest();
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
