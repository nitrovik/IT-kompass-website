"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";
import { onScroll } from "@/lib/frame";

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Lukk mobilmenyen når brukeren navigerer til en ny side.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Krymp headeren og vis framdrift ved scrolling. Kjører i den felles bildeløkken og skriver
  // bare når noe faktisk endres: attributtet ved terskelen, framdriften som transform.
  useEffect(() => {
    const header = headerRef.current;
    const bar = progressRef.current;
    if (!header || !bar) return;
    let scrolled = "";
    let progress = "";
    return onScroll({
      update: ({ y, max }) => {
        const nextScrolled = y > 12 ? "true" : "false";
        if (nextScrolled !== scrolled) header.dataset.scrolled = scrolled = nextScrolled;
        const nextProgress = max > 0 ? Math.min(y / max, 1).toFixed(3) : "0";
        if (nextProgress !== progress) bar.style.transform = `scaleX(${(progress = nextProgress)})`;
      },
    });
  }, []);

  // Mobilmeny: lås scroll, Escape lukker, fokus flyttes inn og tilbake.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    firstLink.current?.focus();
    const button = menuButton.current;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
    <header ref={headerRef} data-scrolled="false" className="site-header fixed inset-x-0 top-0 z-50">
      <div className="container-shell flex h-full items-center gap-10">
        <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label={`${site.name} – til forsiden`}>
          <Image src="/brand/it-kompass-logo-web-opt.png" alt={site.name} width={414} height={148} loading="eager" fetchPriority="high" unoptimized className="brand-logo h-auto" />
        </Link>

        <nav className="ml-auto hidden items-center gap-9 lg:flex" aria-label="Hovednavigasjon">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("nav-link text-[14.5px] font-medium text-[#2a4566] transition-colors hover:text-ink", isActive(item.href) && "text-ink")}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 ml-auto flex items-center gap-3 lg:ml-2">
          <Link href="/kontakt" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Ta kontakt <Arrow size={14} />
          </Link>
          <button ref={menuButton} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobilmeny" aria-label={open ? "Lukk meny" : "Åpne meny"}
            className="relative grid size-11 place-items-center rounded-full border border-line-strong bg-white/80 text-ink backdrop-blur transition hover:border-[#9fc0e0] lg:hidden">
            <span aria-hidden="true" className={cn("absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span aria-hidden="true" className={cn("absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </div>

      <div ref={progressRef} className="scroll-progress pointer-events-none absolute inset-x-0 bottom-[-1px] h-[2px] rounded-r-full bg-[linear-gradient(90deg,rgba(72,185,255,.25),#48b9ff_40%,#0a6ed1)] opacity-0 transition-opacity duration-500 [[data-scrolled=true]_&]:opacity-100" aria-hidden="true" />

    </header>
      {/* Mobilmeny */}
      <div id="mobilmeny" hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-[#f8fbff]/[.97] backdrop-blur-xl lg:hidden" data-lenis-prevent>
        <nav aria-label="Mobilnavigasjon" className="container-shell flex min-h-full flex-col pt-[calc(var(--header-h)+1.5rem)] pb-8">
          <ul className="grid">
            {[{ href: "/", label: "Forside" }, ...navItems].map((item, index) => (
              <li key={item.href} className="border-b border-line" style={{ animation: open ? `hero-fade-in .6s var(--ease-out-soft) both ${index * 45}ms` : undefined }}>
                <Link ref={index === 0 ? firstLink : undefined} href={item.href} aria-current={pathname === item.href ? "page" : undefined}
                  className="group flex items-center justify-between py-4 font-display text-[28px] font-semibold tracking-[-.02em] text-ink">
                  {item.label}
                  <Arrow size={20} className={cn("text-faint", pathname === item.href && "text-brand")} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-10">
            <Link href="/finn-riktig-losning" className={cn(buttonVariants({ size: "lg" }), "w-full")}>Finn riktig løsning <Arrow /></Link>
            <Link href="/kontakt" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}>Ta kontakt</Link>
            <p className="mt-3 text-center text-xs text-muted">{site.legalName} · Org.nr. {site.orgNumber}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
