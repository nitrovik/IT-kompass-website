/*
  Leverandører og samarbeidspartnere som vises i banneret under heroen på forsiden.

  Legg bare inn selskaper der samarbeidet faktisk er bekreftet. Står listen tom,
  vises ikke banneret i det hele tatt. Se hvordan det ser ut på /forhandsvisning/partnere.

  Slik legger du til en logo:
  1. Legg logofilen i public/partners/ (helst SVG, ellers PNG med gjennomsiktig bakgrunn).
  2. Legg til en linje under med navn, filsti og logoens egen bredde og høyde (i piksler,
     eller viewBox-målene for SVG). Da beholder logoen riktige proporsjoner.
  3. Valgfritt: url (lenke til leverandøren) og scale (f.eks. 1.15 hvis en logo ser
     liten ut ved siden av de andre).

  Eksempel:
  { name: "Leverandør AS", logo: "/partners/leverandor.svg", width: 160, height: 40, url: "https://leverandor.no" },
*/
export type Partner = { name: string; logo: string; width: number; height: number; url?: string; scale?: number };

export const partnerSection = {
  // Rammet inn som bredde, ikke som én fast partner: kjernebudskapet er at vi er leverandøruavhengige
  label: "Leverandører vi jobber med",
};

export const partners: Partner[] = [];
