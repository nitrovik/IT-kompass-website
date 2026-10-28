/*
  Samarbeidspartnerne i stripen rett under heroen (components/home/partners.tsx).

  Legg bare inn selskaper der samarbeidet er bekreftet, og bare offisielle logofiler.
  Slik legger du til eller oppdaterer en logo:
  1. Legg logofilen i public/partners/ (SVG, eller PNG/WebP med gjennomsiktig bakgrunn).
  2. Fyll inn filsti og logoens egen bredde og høyde i piksler, så beholder den riktige
     proporsjoner. Størrelsen i stripen regnes ut fra proporsjonene, så brede og høye logoer
     ser omtrent like store ut. scale finjusterer én logo (1 = normal).
  Uten logofil vises navnet i nettsidens egen skrift, ikke som en etterligning av logoen.

  Logofilene er renset for bakgrunn (oktober 2026): Fjord & Foundry kom som kremhvit logo på et
  innbakt rutemønster, så teksten og ankeret er satt i nettsidens mørkeblå (flagget er uendret).
  GlobalConnect kom på hvit bakgrunn.
*/
export type Partner = { name: string; logo?: { src: string; width: number; height: number; scale?: number } };

export const partnerSection = {
  label: "Våre samarbeidspartnere",
};

export const partners: Partner[] = [
  { name: "Fjord & Foundry", logo: { src: "/partners/fjord-and-foundry.webp", width: 141, height: 120 } },
  { name: "GlobalConnect", logo: { src: "/partners/globalconnect.webp", width: 565, height: 90 } },
  { name: "MF Graveservice AS", logo: { src: "/partners/mf-graveservice.webp", width: 302, height: 90 } },
];

// Fra så mange partnere glir stripen; med færre står den stille
export const PARTNER_MARQUEE_MIN = 3;
