"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  Kort med fysisk lysrespons.

  pointermove → lokal museposisjon (kortets mål leses én gang ved pointerenter)
  → målverdier for lys, tilt, skygge og ikon
  → én requestAnimationFrame-løkke interpolerer mykt mot målet (eksponentiell demping)
  → verdiene skrives som CSS-variabler (--mx, --my, --rx, --ry, --sx, --sy, --ix, --iy, --hover).

  Skyggen kastes bort fra lyset, kanten lyser der lyset treffer, ikonet trekkes litt
  mot pekeren. Løkken stopper når kortet har falt til ro. Ingen React-state per bevegelse,
  ingen layoutmåling per bilde. Tilt brukes bare med mus og uten «redusert bevegelse».
*/
type State = { mx: number; my: number; rx: number; ry: number; hover: number };

export function SpotlightCard({ href, className, children, tilt = true, style }: { href?: string; className?: string; children: ReactNode; tilt?: boolean; style?: CSSProperties }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rect = el.getBoundingClientRect();
    const current: State = { mx: 0.5, my: 0.5, rx: 0, ry: 0, hover: 0 };
    const target: State = { mx: 0.5, my: 0.5, rx: 0, ry: 0, hover: 0 };
    let frame = 0;
    let last = 0;

    const write = () => {
      el.style.setProperty("--mx", `${(current.mx * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(current.my * 100).toFixed(2)}%`);
      el.style.setProperty("--rx", `${current.rx.toFixed(3)}deg`);
      el.style.setProperty("--ry", `${current.ry.toFixed(3)}deg`);
      // Lyset står ved pekeren → skyggen faller motsatt vei
      el.style.setProperty("--sx", `${((0.5 - current.mx) * 18).toFixed(2)}px`);
      el.style.setProperty("--sy", `${((0.5 - current.my) * 10).toFixed(2)}px`);
      el.style.setProperty("--ix", `${((current.mx - 0.5) * 6 * current.hover).toFixed(2)}px`);
      el.style.setProperty("--iy", `${((current.my - 0.5) * 6 * current.hover).toFixed(2)}px`);
      el.style.setProperty("--hover", current.hover.toFixed(3));
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 11);
      const kh = 1 - Math.exp(-dt * (target.hover > current.hover ? 9 : 5));
      current.mx += (target.mx - current.mx) * k;
      current.my += (target.my - current.my) * k;
      current.rx += (target.rx - current.rx) * k;
      current.ry += (target.ry - current.ry) * k;
      current.hover += (target.hover - current.hover) * kh;
      write();
      const settled = Math.abs(target.hover - current.hover) < 0.002 && Math.abs(target.rx - current.rx) < 0.005 && Math.abs(target.ry - current.ry) < 0.005 && Math.abs(target.mx - current.mx) < 0.001;
      if (settled) { frame = 0; last = 0; return; }
      frame = requestAnimationFrame(tick);
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onEnter = (event: PointerEvent) => {
      rect = el.getBoundingClientRect();
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
    const onFocus = () => { target.mx = 0.5; target.my = 0.35; target.hover = 1; kick(); };
    const onBlur = () => onLeave();

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocus);
    el.addEventListener("focusout", onBlur);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocus);
      el.removeEventListener("focusout", onBlur);
    };
  }, [tilt]);

  const classes = cn("spotlight-card block", className);
  if (href) return <Link href={href} ref={(node) => { ref.current = node; }} className={classes} style={style}>{children}</Link>;
  return <div ref={(node) => { ref.current = node; }} className={classes} style={style}>{children}</div>;
}
