"use client";

import { useEffect, useRef } from "react";

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/*
  Starter lyssignalene i heroen når siden er ferdig lastet og nettleseren har ledig tid:
  laster keyframes-filen (/motion.css) og setter data-motion-live på heroen når den er klar.
  Ikke ved «redusert bevegelse» eller datasparing. Selve bevegelsen er ren CSS (transform).
*/
export function HeroMotion({ href }: { href: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-hero]");
    if (!host) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    const idle: Idle = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ?? ((cb) => window.setTimeout(cb, 300));
    const live = () => host.setAttribute("data-motion-live", "");
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
  }, [href]);

  return <span ref={ref} hidden />;
}
