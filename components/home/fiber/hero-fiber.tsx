"use client";

import { useEffect, useRef, useState } from "react";
import type { FiberScene } from "@/components/home/fiber/engine";
import { FiberFallback } from "@/components/home/fiber/fiber-fallback";
import { HeroCompass } from "@/components/home/fiber/hero-compass";

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/*
  Laster WebGL-scenen når siden er ferdig lastet og nettleseren har ledig tid, slik at
  heroen aldri forsinker første visning. Svake enheter, «spar data» og manglende WebGL
  beholder det statiske SVG-bildet. Ved «redusert bevegelse» tegnes ett stillestående bilde.
*/
export function HeroFiber() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest<HTMLElement>("[data-hero]");
    if (!canvas || !host) return;

    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const weak = (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 2 || nav.connection?.saveData === true;
    if (weak) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;

    let scene: FiberScene | null = null;
    let cancelled = false;
    let rect = host.getBoundingClientRect();
    let needleAngle = 42;
    let idleTimer = 0;

    const setNeedle = (target: number) => {
      // Korteste vei rundt, så nålen aldri snurrer en hel runde
      const delta = ((((target - needleAngle) % 360) + 540) % 360) - 180;
      needleAngle += delta;
      if (needleRef.current) needleRef.current.style.transform = `rotate(${needleAngle.toFixed(1)}deg)`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !scene) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      scene.setPointer(x, y, true);
      // Kompassnålen peker mot musen
      const cx = rect.width * (rect.width < 1280 ? 0.75 : 0.7);
      const cy = rect.height * 0.46;
      setNeedle((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setNeedle(42), 2200);
    };
    const onLeave = () => {
      scene?.setPointer(0, 0, false);
      window.clearTimeout(idleTimer);
      setNeedle(42);
    };
    const updateRect = () => { rect = host.getBoundingClientRect(); };
    const onResize = () => { updateRect(); scene?.resize(); };

    const io = new IntersectionObserver(([entry]) => scene?.setVisible(entry.isIntersecting && !document.hidden), { threshold: 0 });
    const onVisibility = () => scene?.setVisible(!document.hidden);

    const init = async () => {
      const { createFiberScene } = await import("@/components/home/fiber/engine");
      if (cancelled) return;
      // ?fiber=1 tvinger scenen på også uten skjermkort – brukes til visuell testing
      const force = new URLSearchParams(window.location.search).get("fiber") === "1";
      scene = createFiberScene(canvas, {
        tier: desktop ? "high" : "medium",
        animate: !reduce,
        allowSoftware: force,
        onReady: () => setReady(true),
        onDegrade: (reason) => { if (reason === "context-lost") setReady(false); },
      });
      if (!scene) return;
      io.observe(host);
      document.addEventListener("visibilitychange", onVisibility);
      if (desktop && !reduce) {
        host.addEventListener("pointerenter", updateRect);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
      }
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", updateRect, { passive: true });
    };

    const idle: Idle = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ?? ((cb) => window.setTimeout(cb, 200));
    const start = () => idle(() => { void init(); }, { timeout: 1500 });
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(idleTimer);
      window.removeEventListener("load", start);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointerenter", updateRect);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateRect);
      scene?.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true" data-ready={ready}>
      <FiberFallback className={`transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`} />
      <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />
      <HeroCompass ref={needleRef} />
    </div>
  );
}
