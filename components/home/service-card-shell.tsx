"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { HomeService } from "@/content/home";

export function ServiceCardShell({ service, icon, index }: { service: Omit<HomeService, "icon">; icon: ReactNode; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);

  const onMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y });
    setTilt({ x: (50 - y) * .05, y: (x - 50) * .05 });
  };

  return (
    <motion.div onViewportEnter={() => setRevealed(true)} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .6, delay: index * .06 }}>
      <Link ref={ref} href={service.href} onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })} className="group relative block h-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 transition-colors hover:border-[#269BFF]/40" style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <span className="pointer-events-none absolute inset-0 opacity-80" style={{ background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(110,197,255,.16), transparent 30%)` }} />
        <div className="relative z-10 flex h-full min-h-[310px] flex-col">
          <div className="flex items-start justify-between">
            <span className={`icon-draw grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[.035] text-[#6EC5FF] ${revealed ? "is-visible" : ""}`}>{icon}</span>
            <span className="text-xs font-medium text-slate-500">{service.kicker}</span>
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold tracking-[-.04em] text-white">{service.title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{service.description}</p>
          </div>
          <div className="mt-auto pt-8">
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {service.bullets.map((bullet) => <span key={bullet} className="rounded-full border border-white/10 bg-white/[.025] px-3 py-1.5">{bullet}</span>)}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm font-semibold text-white">Se tjenesten <span className="transition-transform group-hover:translate-x-1"><ArrowUpRight size={17}/></span></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
