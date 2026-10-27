"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { bearingOf, buildFibers, type Fiber, type Layout } from "@/components/home/hero-fibers";
import { FiberController, type NeedleState } from "@/components/home/fiber-controller";

type Idle = (cb: () => void, opts?: { timeout: number }) => number;
type Geometry = { layout: Layout; fibers: Fiber[]; origin: { x: number; y: number } };

/*
  Fiberbanene og lyskulene i heroen. Banene tegnes i heroens egne piksler etter at kompasset
  og teksten er målt, så de går helt ut til kantene på alle skjermstørrelser. Målingen gjøres
  bare når heroen endrer størrelse. Kompasset (hero-art.tsx) står der det står; her styres
  bare nålen og lyset i sentrum.
*/
export function HeroFiberSystem() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const needleState = useRef<NeedleState>({ angle: 0, rest: 0 });

  // Mål heroen, kompasset og teksten, og bygg banene på nytt når noe av det endrer størrelse
  useEffect(() => {
    const hero = layerRef.current?.closest<HTMLElement>("[data-hero]");
    const compass = hero?.querySelector<HTMLElement>(".hero-compass-core");
    const copy = hero?.querySelector<HTMLElement>(".hero-copy");
    const caption = hero?.querySelector<SVGElement>(".hero-caption");
    if (!hero || !compass || !copy) return;
    let frame = 0;
    let key = "";
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hb = hero.getBoundingClientRect();
        const cb = compass.getBoundingClientRect();
        const pb = copy.getBoundingClientRect();
        const tb = caption?.getBoundingClientRect();
        const layout: Layout = {
          w: hb.width,
          h: hb.height,
          c: { x: cb.left + cb.width / 2 - hb.left, y: cb.top + cb.height / 2 - hb.top },
          // Skiven har radius 86 i kompassets viewBox på 200
          r: (cb.width * 86) / 200,
          copy: { left: pb.left - hb.left, top: pb.top - hb.top, right: pb.right - hb.left, bottom: pb.bottom - hb.top },
          mode: pb.right <= cb.left ? "side" : "stack",
          avoid: tb ? [{ left: tb.left - hb.left, top: tb.top - hb.top, right: tb.right - hb.left, bottom: tb.bottom - hb.top }] : [],
        };
        const next = [layout.w, layout.h, layout.c.x, layout.c.y, layout.r, layout.copy.right, layout.copy.bottom, tb?.width ?? 0].map(Math.round).join(",") + layout.mode;
        if (next === key) return;
        key = next;
        setGeo({ layout, fibers: buildFibers(layout), origin: { x: hb.left + window.scrollX, y: hb.top + window.scrollY } });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    observer.observe(compass);
    observer.observe(copy);
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Tilstandsmaskinen: startes når siden er ferdig lastet, stopper når heroen er utenfor skjermen
  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.closest<HTMLElement>("[data-hero]");
    const needle = hero?.querySelector<HTMLElement>(".hero-needle");
    const core = hero?.querySelector<HTMLElement>(".hero-core-glow");
    if (!geo || !layer || !hero || !needle || !core) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const { layout } = geo;

    const pulses = [...layer.querySelectorAll<HTMLElement>(".hero-pulse")];
    const glows = (selector: string) => new Map([...layer.querySelectorAll<HTMLElement>(selector)].map((el) => [el.dataset.fiber ?? "", el.querySelector<HTMLElement>(".hero-glow")!]));
    const controller = new FiberController(
      { host: hero, needle, core, pulses, ports: glows(".hero-port"), nodes: glows(".hero-node") },
      geo.fibers,
      { speed: Math.min(0.34, Math.max(0.17, layout.r * 0.0034)), r: layout.r },
      needleState.current,
    );
    hero.dataset.fibersReady = "";

    // Musepekeren: nålen orienterer seg mot pekeren når den er nær kompasset (sidens koordinater, ingen måling per bevegelse)
    let near = false;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const dx = event.pageX - geo.origin.x - layout.c.x;
      const dy = event.pageY - geo.origin.y - layout.c.y;
      const dist = Math.hypot(dx, dy);
      near = dist < layout.r * (near ? 4.1 : 3.5);
      if (!near) return controller.setHover(null);
      // Rett over sentrum er retningen ustabil: behold den forrige
      if (dist > layout.r * 0.38) controller.setHover(bearingOf(dx, dy));
    };
    const onLeave = () => {
      near = false;
      controller.setHover(null);
    };
    if (canHover && !reduced) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }

    // Signalene går bare når heroen er synlig, fanen er aktiv og bevegelse er ønsket
    let visible = false;
    let disposed = false;
    let loaded = document.readyState === "complete";
    const sync = () => {
      if (disposed || reduced || saveData) return;
      if (visible && loaded && !document.hidden) controller.start(600);
      else controller.stop();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(hero);
    const idle: Idle = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ?? ((cb) => window.setTimeout(cb, 300));
    const onLoad = () =>
      idle(() => {
        loaded = true;
        sync();
      }, { timeout: 2000 });
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    document.addEventListener("visibilitychange", sync);

    return () => {
      disposed = true;
      needleState.current = controller.state;
      controller.destroy();
      io.disconnect();
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", sync);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [geo]);

  const fibers = geo?.fibers.filter((f) => f.valid) ?? [];
  const main = fibers.find((f) => f.kind === "in" && f.main);
  const layout = geo?.layout;
  return (
    <>
      <svg className="hero-fibers" aria-hidden="true" data-ready={layout ? "" : undefined} viewBox={layout ? `0 0 ${layout.w} ${layout.h}` : undefined}>
        {layout ? (
          <>
            <defs>
              <filter id="hero-fiber-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {main ? <path className="fiber-highlight" d={main.curveD} filter="url(#hero-fiber-glow)" /> : null}
            {fibers.map((f) => (
              <path key={f.id} className={`fiber fiber-${f.tone}${f.main ? " fiber-main" : ""}`} d={f.d} />
            ))}
          </>
        ) : null}
      </svg>
      <div ref={layerRef} className="hero-pulses" aria-hidden="true" style={layout ? ({ "--fiber-s": (layout.r / 88).toFixed(3) } as CSSProperties) : undefined}>
        {fibers.map((f) => (
          <span key={f.id} className="hero-port" data-fiber={f.id} data-kind={f.kind} data-bearing={f.bearing.toFixed(2)} style={{ transform: `translate(${f.rim.x.toFixed(1)}px, ${f.rim.y.toFixed(1)}px)` }}>
            <span className="hero-glow" />
          </span>
        ))}
        {fibers.map((f) =>
          f.node ? (
            <span key={f.id} className="hero-node" data-fiber={f.id} style={{ transform: `translate(${f.node.p.x.toFixed(1)}px, ${f.node.p.y.toFixed(1)}px)` }}>
              <span className="hero-glow" />
            </span>
          ) : null,
        )}
        <span className="hero-pulse" />
        <span className="hero-pulse" />
        <span className="hero-pulse" />
      </div>
    </>
  );
}
