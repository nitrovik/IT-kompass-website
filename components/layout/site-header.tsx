"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { navItems, site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} – til forsiden`}>
      <Image src="/brand/it-kompass-logo-web.png" alt={site.name} width={414} height={148} priority className="h-auto w-[150px] sm:w-[180px] lg:w-[205px]" />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Lukk mobilmenyen når brukeren navigerer til en ny side.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-[68px] items-center gap-8 lg:h-[78px]">
        <Brand />
        <nav className="mx-auto hidden items-center gap-8 lg:flex" aria-label="Hovednavigasjon">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm font-medium text-[#244568] transition-colors hover:text-ink",
                  "after:absolute after:inset-x-0 after:-bottom-[9px] after:h-0.5 after:rounded-full after:bg-brand after:opacity-0 after:transition-opacity hover:after:opacity-100",
                  active && "text-ink after:opacity-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link href="/kontakt" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Ta kontakt <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="inline-grid size-11 place-items-center rounded-full border border-line-strong bg-white text-ink lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobilmeny"
            aria-label={open ? "Lukk meny" : "Åpne meny"}
          >
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobilmeny"
            aria-label="Mobilnavigasjon"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="container-shell grid gap-1 py-4">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-soft", active && "bg-sky")}>
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/finn-riktig-losning" className={cn(buttonVariants({ size: "lg" }), "mt-3 w-full")}>
                Finn riktig løsning <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/kontakt" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full sm:hidden")}>
                Ta kontakt
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
