/*
  Hovedmenyen ved siden av logoen. «Tjenester» åpner en undermeny med alle tjenestesidene
  (servicesNav i content/services.ts, sendt inn fra app/layout.tsx), de andre lenkene går til
  seksjoner på forsiden. Samme innhold på PC og mobil.
*/
export type NavLink = { label: string; href: string };
export type NavService = NavLink & { tag: string; summary: string };
export type ServicesNav = { label: string; overview: NavLink; items: NavService[] };

export const mainNav: NavLink[] = [
  { label: "Hvorfor IT Kompass", href: "/#hvorfor" },
  { label: "Kontakt", href: "/#kontakt" },
];

export const navCta = { label: "La oss snakke", href: "/#kontakt" };
