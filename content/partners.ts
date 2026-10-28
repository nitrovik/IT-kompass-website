/*
  Samarbeidspartnerne i stripen rett under heroen (components/home/partners.tsx).

  Legg bare inn selskaper der samarbeidet er bekreftet, og bare offisielle logofiler.
  Slik legger du til eller oppdaterer en logo:
  1. Legg logofilen i public/partners/ (helst SVG, ellers PNG med gjennomsiktig bakgrunn).
  2. Fyll inn logo med filsti og logoens egen bredde og høyde (piksler, eller viewBox-målene
     for SVG), så beholder den riktige proporsjoner. scale justerer en logo som ser for liten
     eller for stor ut ved siden av de andre (1 = normal).
  Uten logofil vises navnet i nettsidens egen skrift, ikke som en etterligning av logoen.

  Med én eller to partnere står stripen stille. Fra tre partnere glir logoene sakte fra høyre
  mot venstre i en sømløs sløyfe.
*/
export type Partner = { name: string; logo?: { src: string; width: number; height: number; scale?: number } };

export const partnerSection = {
  label: "Våre samarbeidspartnere",
};

export const partners: Partner[] = [
  // Den offisielle logoen mangler foreløpig: legg den i public/partners/globalconnect.svg og fyll inn logo her
  { name: "GlobalConnect" },
];

// Fra så mange partnere glir stripen; med færre står den stille (gjentatte kopier av samme logo ville sett kunstig ut)
export const PARTNER_MARQUEE_MIN = 3;
