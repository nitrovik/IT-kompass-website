"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { mainNav } from "@/content/navigation";
import { site } from "@/config/site";

/*
  Lenke til en seksjon på forsiden. På forsiden er det en vanlig ankerlenke, så nettleseren
  scroller dit hver gang (også når adressen allerede slutter på samme #). Fra andre sider
  går den til forsiden og seksjonen.
*/
function SectionLink({ href, onHome, className, children }: { href: string; onHome: boolean; className?: string; children: ReactNode }) {
  return onHome ? <a className={className} href={href.slice(1)}>{children}</a> : <Link className={className} href={href}>{children}</Link>;
}

/*
  Headeren fra designet med logoen til IT Kompass: tre lenker og «La oss snakke». Står fast øverst når siden
  scrolles (sticky, ren CSS). På mobil blir lenkene en nedtrekksmeny under headeren.
*/
export function SiteHeader() {
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const onHome = pathname === "/";

  // Lukk menyen når brukeren går til en annen side
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape lukker menyen og setter fokus tilbake på menyknappen
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="wrap site-nav" aria-label="Hovedmeny">
        <Link className="brand" href="/" aria-label={`${site.name}, til forsiden`}>
          <Image className="brand-logo" src="/brand/it-kompass-logo-web-opt.png" alt={site.name} width={414} height={148} loading="eager" fetchPriority="high" unoptimized />
        </Link>
        {/* Lukk ved valg: lenkene går til et anker på forsiden, og da endres ikke adressen */}
        <div className={open ? "nav-links open" : "nav-links"} id="hovedmeny" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
          {mainNav.map((item) => <SectionLink key={item.href} href={item.href} onHome={onHome}>{item.label}</SectionLink>)}
        </div>
        <button ref={menuButton} className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-controls="hovedmeny" aria-expanded={open} aria-label={open ? "Lukk meny" : "Åpne meny"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        </button>
      </nav>
    </header>
  );
}
