"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { onFrame } from "@/lib/frame";
import { cn } from "@/lib/utils";

/*
  Kort med fysisk lysrespons.

  pointermove → lokal museposisjon (kortets mål leses én gang ved pointerenter)
  → målverdier for lys, tilt, skygge og ikon
  → den felles bildeløkken (lib/frame.ts) interpolerer mykt mot målet (eksponentiell demping)
  → resultatet skrives som transform og opacity på egne lag.

  Lyset, den lysende kanten og hover-skyggen er egne elementer som bare flyttes (transform)
  og tones (opacity). Kantlyset ligger bak kortets hvite flate og synes bare i den 1 px brede
  kanten – én felles avrundet beskjæring, ingen maske. Da slipper nettleseren å male kortet på nytt per bilde – skjermkortet
  setter lagene sammen. Kortet tiltes med transform og glir tilbake til rotateX(0)
  rotateY(0) translateY(0) når pekeren forlater det. Tilt bare med mus og uten
  «redusert bevegelse». Ingen React-state per bevegelse, ingen layoutmåling per bilde.
*/
type State = { mx: number; my: number; rx: number; ry: number; hover: number };

// Halv størrelse på lagene: bare så store som lyset faktisk er synlig (se globals.css)
const LIGHT = 162; // lyskjeglen
const RIM = 140;   // kantlyset

export function SpotlightCard({ href, className, children, tilt = true, style }: { href?: string; className?: string; children: ReactNode; tilt?: boolean; style?: CSSProperties }) {
  const ref = useRef<HTMLElement | null>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const rimLightRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const light = lightRef.current;
    const rimLight = rimLightRef.current;
    const shadow = shadowRef.current;
    if (!el || !light || !rimLight || !shadow) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const icon = el.querySelector<HTMLElement>(".card-icon");
    const iconGlow = el.querySelector<HTMLElement>(".card-icon-glow");
    const fiber = el.querySelector<HTMLElement>(".card-fiber");
    let rect = { left: 0, top: 0, width: 1, height: 1 };
    const current: State = { mx: 0.5, my: 0.5, rx: 0, ry: 0, hover: 0 };
    const target: State = { mx: 0.5, my: 0.5, rx: 0, ry: 0, hover: 0 };
    let running = false;
    let disposed = false;
    let last = 0;

    const write = () => {
      const { mx, my, rx, ry, hover } = current;
      const x = mx * rect.width;
      const y = my * rect.height;
      el.style.transform = tilt && !reduce
        ? `perspective(1100px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translate3d(0, ${(-6 * hover).toFixed(2)}px, 0)`
        : `translate3d(0, ${(-6 * hover).toFixed(2)}px, 0)`;
      light.style.transform = `translate3d(${(x - LIGHT).toFixed(1)}px, ${(y - LIGHT).toFixed(1)}px, 0)`;
      light.style.opacity = hover.toFixed(3);
      rimLight.style.transform = `translate3d(${(x - RIM).toFixed(1)}px, ${(y - RIM).toFixed(1)}px, 0)`;
      rimLight.style.opacity = hover.toFixed(3);
      // Lyset står ved pekeren → skyggen faller motsatt vei
      shadow.style.transform = `translate3d(${((0.5 - mx) * 18 * hover).toFixed(2)}px, ${((0.5 - my) * 10 * hover).toFixed(2)}px, 0)`;
      shadow.style.opacity = hover.toFixed(3);
      if (icon && !reduce) icon.style.transform = `translate3d(${((mx - 0.5) * 6 * hover).toFixed(2)}px, ${((my - 0.5) * 6 * hover).toFixed(2)}px, 0)`;
      if (iconGlow) iconGlow.style.opacity = (0.25 + hover * 0.75).toFixed(3);
      if (fiber) fiber.style.opacity = (0.35 + hover * 0.65).toFixed(3);
    };

    // I ro: tilbake til stilarket (ingen transform, ingen ekstra lag)
    const reset = () => {
      for (const node of [el, light, rimLight, shadow, icon]) node?.style.removeProperty("transform");
      for (const node of [light, rimLight, shadow, iconGlow, fiber]) node?.style.removeProperty("opacity");
    };

    const tick = (now: number) => {
      if (disposed) return false;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 11);
      const kh = 1 - Math.exp(-dt * (target.hover > current.hover ? 9 : 5));
      current.mx += (target.mx - current.mx) * k;
      current.my += (target.my - current.my) * k;
      current.rx += (target.rx - current.rx) * k;
      current.ry += (target.ry - current.ry) * k;
      current.hover += (target.hover - current.hover) * kh;
      const settled = Math.abs(target.hover - current.hover) < 0.002 && Math.abs(target.rx - current.rx) < 0.005 && Math.abs(target.ry - current.ry) < 0.005 && Math.abs(target.mx - current.mx) < 0.001 && Math.abs(target.my - current.my) < 0.001;
      if (settled) {
        Object.assign(current, target);
        running = false;
        last = 0;
        if (target.hover === 0) { reset(); return false; } // nøyaktig rotateX(0) rotateY(0) translateY(0)
      }
      write();
      return !settled;
    };
    const kick = () => {
      if (running) return;
      running = true;
      onFrame(tick);
    };

    const measure = () => {
      const box = el.getBoundingClientRect();
      rect = { left: box.left, top: box.top, width: el.offsetWidth || box.width, height: el.offsetHeight || box.height };
    };
    const onEnter = (event: PointerEvent) => {
      measure();
      if (event.pointerType !== "mouse") return;
      current.mx = target.mx = (event.clientX - rect.left) / rect.width;
      current.my = target.my = (event.clientY - rect.top) / rect.height;
      target.hover = 1;
      kick();
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.mx = (event.clientX - rect.left) / rect.width;
      target.my = (event.clientY - rect.top) / rect.height;
      target.hover = 1;
      if (tilt && !reduce) {
        target.rx = (0.5 - target.my) * 5;
        target.ry = (target.mx - 0.5) * 6;
      }
      kick();
    };
    const onLeave = () => {
      target.hover = 0;
      target.rx = 0;
      target.ry = 0;
      kick();
    };
    // Tastaturfokus gir samme lys, sentrert
    const onFocus = () => { measure(); target.mx = 0.5; target.my = 0.35; target.hover = 1; kick(); };
    const onBlur = () => onLeave();

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocus);
    el.addEventListener("focusout", onBlur);
    return () => {
      disposed = true;
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocus);
      el.removeEventListener("focusout", onBlur);
    };
  }, [tilt]);

  const layers = (
    <>
      <span ref={shadowRef} className="spotlight-shadow" aria-hidden="true" />
      <span className="spotlight-frame" aria-hidden="true">
        <span ref={rimLightRef} className="spotlight-rim-light" />
        <span className="spotlight-surface" />
        <span ref={lightRef} className="spotlight-light" />
      </span>
    </>
  );
  const classes = cn("spotlight-card block", className);
  if (href) return <Link href={href} ref={(node) => { ref.current = node; }} className={classes} style={style}>{layers}{children}</Link>;
  return <div ref={(node) => { ref.current = node; }} className={classes} style={style}>{layers}{children}</div>;
}
