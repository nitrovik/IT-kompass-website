"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { navItems, site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CompassMark({ progress = 0 }: { progress?: number }) {
  const rotation = progress * 210;
  return (
    <span className="relative grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.035]" aria-hidden="true">
      <span className="absolute inset-1 rounded-full border border-white/8" />
      <span className="absolute inset-[10px] rounded-full border border-[#269BFF]/30" />
      <span style={{ transform: `rotate(${rotation}deg)` }} className="absolute h-[13px] w-px origin-bottom bg-gradient-to-b from-[#6EC5FF] to-[#269BFF]" />
      <span className="relative size-1.5 rounded-full bg-white shadow-[0_0_12px_#269BFF]" />
    </span>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} – forsiden`}>
      <CompassMark />
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-[-.02em]">IT Kompass</span>
        <span className="block text-[10px] font-medium uppercase tracking-[.18em] text-slate-400">AS</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastPathname, setLastPathname] = useState(pathname);
  const reduceMotion = useReducedMotion();

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 12);
      setProgress(doc > 0 ? Math.min(y / doc, 1) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "py-3" : "py-5")}>
      <div className={cn("container-shell rounded-2xl px-3", scrolled && "glass")}> 
        <div className="flex h-14 items-center justify-between gap-4 px-1 sm:px-2">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Hovednavigasjon">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", active ? "text-white" : "text-slate-400 hover:bg-white/[.04] hover:text-white")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/kontakt" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>Kontakt</Link>
            <button className="inline-grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[.03] text-white lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Lukk meny" : "Åpne meny"}>
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
            <CompassMark progress={reduceMotion ? 0 : progress} />
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav id="mobile-navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/10 lg:hidden" aria-label="Mobilnavigasjon">
              <div className="grid gap-1 px-2 py-4">
                {navItems.map((item) => <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-base text-slate-200 hover:bg-white/[.05]">{item.label}</Link>)}
                <Link href="/finn-riktig-losning" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-full")}>Finn riktig løsning</Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
