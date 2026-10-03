"use client";

import Link from "next/link";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  Kort med myk lyskjegle som følger pekeren, svak lysende kant og en liten tilt.
  Posisjonen skrives rett til CSS-variabler (--mx, --my, --rx, --ry) i én
  requestAnimationFrame. Kortets mål leses én gang når pekeren kommer inn,
  ikke på hver bevegelse. Tilt brukes bare med mus og uten «redusert bevegelse».
*/
export function SpotlightCard({ href, className, children, tilt = true }: { href?: string; className?: string; children: ReactNode; tilt?: boolean }) {
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);

  const allowTilt = () => tilt && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onEnter = (event: PointerEvent<HTMLElement>) => {
    rect.current = event.currentTarget.getBoundingClientRect();
  };

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const box = rect.current ?? el.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const withTilt = allowTilt();
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (withTilt) {
        el.style.setProperty("--rx", `${((box.height / 2 - y) / box.height) * 4}deg`);
        el.style.setProperty("--ry", `${((x - box.width / 2) / box.width) * 4}deg`);
      }
    });
  };

  const onLeave = (event: PointerEvent<HTMLElement>) => {
    cancelAnimationFrame(frame.current);
    rect.current = null;
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };

  const handlers = { onPointerEnter: onEnter, onPointerMove: onMove, onPointerLeave: onLeave };
  const classes = cn("spotlight-card block h-full", className);

  if (href) {
    return <Link href={href} className={classes} {...handlers}>{children}</Link>;
  }
  return <div className={classes} {...handlers}>{children}</div>;
}
