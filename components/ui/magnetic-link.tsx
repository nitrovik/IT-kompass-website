"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { onFrame } from "@/lib/frame";
import { cn } from "@/lib/utils";

/*
  Hoved-CTA som trekkes svakt (maks 3 px) mot musepekeren. Målet settes fra pointermove,
  og en fjær i den felles bildeløkken flytter knappen med transform – ingen React-state,
  ingen animasjonsbibliotek. Ingen effekt på berøringsskjerm eller ved redusert bevegelse.
*/
export function MagneticLink({ href, children, variant = "default", size = "lg", className }: { href: string; children: ReactNode; variant?: "default" | "secondary" | "outline"; size?: "lg" | "default"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rect = { left: 0, top: 0, width: 1, height: 1 };
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, vx: 0, vy: 0 };
    let running = false;
    let disposed = false;
    let last = 0;

    // Fjær (stivhet 360, demping 28, masse 0,25 – samme følelse som før)
    const tick = (now: number) => {
      if (disposed) return false;
      const dt = last ? Math.min((now - last) / 1000, 0.032) : 0.016;
      last = now;
      // Små, faste steg (4 ms), så fjæren er stabil uansett bildetakt
      const steps = Math.ceil(dt / 0.004);
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        pos.vx += ((-360 * (pos.x - target.x) - 28 * pos.vx) / 0.25) * h;
        pos.vy += ((-360 * (pos.y - target.y) - 28 * pos.vy) / 0.25) * h;
        pos.x += pos.vx * h;
        pos.y += pos.vy * h;
      }
      const settled = Math.abs(pos.x - target.x) < 0.01 && Math.abs(pos.y - target.y) < 0.01 && Math.abs(pos.vx) < 0.05 && Math.abs(pos.vy) < 0.05;
      if (settled) {
        pos.x = target.x; pos.y = target.y; pos.vx = pos.vy = 0;
        running = false;
        last = 0;
      }
      el.style.transform = pos.x === 0 && pos.y === 0 ? "" : `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`;
      return !settled;
    };
    const kick = () => {
      if (running) return;
      running = true;
      onFrame(tick);
    };

    const onEnter = () => {
      const box = el.getBoundingClientRect();
      rect = { left: box.left - pos.x, top: box.top - pos.y, width: box.width, height: box.height };
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      kick();
    };
    const onLeave = () => { target.x = 0; target.y = 0; kick(); };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      disposed = true;
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="inline-flex hover:will-change-transform">
      <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>{children}</Link>
    </div>
  );
}
