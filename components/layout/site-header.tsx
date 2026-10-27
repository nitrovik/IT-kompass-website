"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { mainNav, navCta, type ServicesNav } from "@/content/navigation";
import { site } from "@/config/site";

const MOBILE = "(max-width: 760px)";

/*
  Lenke til en seksjon. Står seksjonen på siden man er på (forsiden, eller kontaktskjemaet på
  tjenestesidene), er det en vanlig ankerlenke, så nettleseren scroller dit hver gang. Ellers
  går den til forsiden og seksjonen.
*/
function SectionLink({ href, local, className, onClick, children }: { href: string; local: boolean; className?: string; onClick?: () => void; children: ReactNode }) {
  return local ? <a className={className} href={href.slice(1)} onClick={onClick}>{children}</a> : <Link className={className} href={href} onClick={onClick}>{children}</Link>;
}

/*
  Headeren: logo og meny på én linje til venstre, «La oss snakke» til høyre. Står fast øverst
  når siden scrolles (sticky, ren CSS).

  «Tjenester» åpner en undermeny (mønsteret «disclosure navigation» fra WAI-ARIA):
  - Mus: åpnes når pekeren holdes over, med en liten forsinkelse inn og ut, så den ikke blinker
    når pekeren går fra knappen ned til listen. Et klikk låser den åpen.
  - Tastatur: Enter/mellomrom åpner og lukker, pil ned går inn i listen, pilene flytter mellom
    lenkene, Escape lukker og setter fokus tilbake på knappen. Den lukkes når fokus går videre.
  - Mobil (≤ 760 px): menyen er et panel under headeren, og tjenestene foldes ut ved trykk.
*/
export function SiteHeader({ servicesNav }: { servicesNav: ServicesNav }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const servicesItem = useRef<HTMLLIElement>(null);
  const servicesButton = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const openedBy = useRef<"hover" | "click" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const onHome = pathname === "/";
  const inServices = pathname.startsWith("/tjenester");
  // Sider med eget kontaktskjema: «Kontakt» og «La oss snakke» blir på siden
  const localHref = (href: string) => onHome || (href === "/#kontakt" && inServices);

  // Lukk menyene når brukeren går til en annen side
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  const closeAll = () => {
    window.clearTimeout(timer.current);
    openedBy.current = null;
    setServicesOpen(false);
    setMenuOpen(false);
  };

  // Escape lukker det som er åpent, klikk utenfor lukker undermenyen og mobilmenyen
  useEffect(() => {
    if (!menuOpen && !servicesOpen) return;
    const onKey = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (servicesOpen) {
        setServicesOpen(false);
        openedBy.current = null;
        servicesButton.current?.focus();
      } else {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const onDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node;
      if (menuOpen && !headerRef.current?.contains(target)) setMenuOpen(false);
      if (servicesOpen && !window.matchMedia(MOBILE).matches && !servicesItem.current?.contains(target)) {
        openedBy.current = null;
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen, servicesOpen]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hover = (open: boolean) => (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse" || window.matchMedia(MOBILE).matches) return;
    window.clearTimeout(timer.current);
    if (open && !servicesOpen) {
      timer.current = window.setTimeout(() => {
        openedBy.current = "hover";
        setServicesOpen(true);
      }, 70);
    } else if (!open && openedBy.current === "hover") {
      timer.current = window.setTimeout(() => {
        openedBy.current = null;
        setServicesOpen(false);
      }, 180);
    }
  };

  const toggleServices = () => {
    window.clearTimeout(timer.current);
    // Åpnet av musepekeren: klikket låser den åpen i stedet for å lukke den
    if (servicesOpen && openedBy.current === "hover") {
      openedBy.current = "click";
      return;
    }
    openedBy.current = servicesOpen ? null : "click";
    setServicesOpen(!servicesOpen);
  };

  const links = () => [...(servicesItem.current?.querySelectorAll<HTMLAnchorElement>(".nav-panel a") ?? [])];
  const focusLink = (index: number) => {
    const all = links();
    all[(index + all.length) % all.length]?.focus();
  };

  const onButtonKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    openedBy.current = "click";
    setServicesOpen(true);
    requestAnimationFrame(() => focusLink(0));
  };

  const onPanelKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = links();
    const index = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (index < 0) return;
    const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: all.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    focusLink(next);
  };

  // Lukk undermenyen når fokus går ut av den (Tab videre)
  const onItemBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (window.matchMedia(MOBILE).matches) return;
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      openedBy.current = null;
      setServicesOpen(false);
    }
  };

  return (
    <header className="site-header" ref={headerRef}>
      <nav className="wrap site-nav" aria-label="Hovedmeny">
        <Link className="brand" href="/" aria-label={`${site.name}, til forsiden`}>
          <Image className="brand-logo" src="/brand/it-kompass-logo-web-opt.png" alt={site.name} width={414} height={148} loading="eager" fetchPriority="high" unoptimized />
        </Link>

        <div className={menuOpen ? "nav-menu open" : "nav-menu"} id="hovedmeny">
          <ul className="nav-list">
            <li ref={servicesItem} className={servicesOpen ? "nav-item is-open" : "nav-item"} onPointerEnter={hover(true)} onPointerLeave={hover(false)} onBlur={onItemBlur}>
              <button ref={servicesButton} type="button" className={inServices ? "nav-link is-active" : "nav-link"} aria-expanded={servicesOpen} aria-controls="tjenestemeny" onClick={toggleServices} onKeyDown={onButtonKey}>
                {servicesNav.label}
                <svg className="nav-caret" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div className="nav-panel" id="tjenestemeny" onKeyDown={onPanelKey}>
                <ul className="nav-services">
                  {servicesNav.items.map((item) => (
                    <li key={item.href}>
                      <Link className="nav-service" href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={closeAll}>
                        <span className="nav-service-tag" aria-hidden="true">{item.tag}</span>
                        <span className="nav-service-text">
                          <span className="nav-service-name">{item.label}</span>
                          <span className="nav-service-sum">{item.summary}</span>
                        </span>
                        <span className="nav-service-go" aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="nav-panel-foot">
                  <Link className="nav-panel-all" href={servicesNav.overview.href} aria-current={pathname === servicesNav.overview.href ? "page" : undefined} onClick={closeAll}>
                    {servicesNav.overview.label} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </li>
            {mainNav.map((item) => (
              <li key={item.href} className="nav-item">
                <SectionLink className="nav-link" href={item.href} local={localHref(item.href)} onClick={closeAll}>{item.label}</SectionLink>
              </li>
            ))}
          </ul>
          <SectionLink className="btn btn-primary nav-sheet-cta" href={navCta.href} local={localHref(navCta.href)} onClick={closeAll}>
            {navCta.label} <span className="btn-arrow" aria-hidden="true">↗</span>
          </SectionLink>
        </div>

        <SectionLink className="btn btn-primary nav-action" href={navCta.href} local={localHref(navCta.href)}>
          {navCta.label} <span className="btn-arrow" aria-hidden="true">↗</span>
        </SectionLink>
        <button ref={menuButton} className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-controls="hovedmeny" aria-expanded={menuOpen} aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}</svg>
        </button>
      </nav>
    </header>
  );
}
