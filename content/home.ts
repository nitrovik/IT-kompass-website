import type { ServiceCardData } from "@/content/types";
import { startSetupPrice } from "@/content/packages";

/*
  Alt synlig innhold på forsiden. Kan flyttes til et CMS (f.eks. Sanity) senere
  uten at komponentene må skrives om. Ikke legg inn oppdiktede kunder, tall,
  priser, partnere eller kontaktopplysninger.
*/

export const homeHero = {
  eyebrow: "IT Kompass AS",
  title: ["Din lokale", "IT partner."],
  body: "Vi ordner fiber, mobil, WiFi, IT-hjelp og nettsider for bedriften din.",
  primaryCta: { label: "Finn riktig løsning", href: "/finn-riktig-losning" },
  secondaryCta: { label: "Ta kontakt", href: "/kontakt" },
  quickLinksLabel: "Fire tjenesteområder",
  // Vises i glassbåndet nederst i heroen
  reasons: [
    { title: "Fast kontaktperson", text: "Samme person følger dere opp hver gang." },
    { title: "Uavhengig", text: "Ingen leverandør bestemmer hva vi anbefaler." },
    { title: "Viken og hele Norge", text: "På stedet i Viken. Digitalt i resten av landet." },
    { title: "Uten fagprat", text: "Du får valgene forklart med vanlige ord." },
  ],
};

export const homeServicesIntro = {
  eyebrow: "Tjenester",
  title: ["Fire tjenester", "for bedriften din."],
  body: "Velg én tjeneste eller alle fire.",
};

export const homeServices: ServiceCardData[] = [
  {
    title: "WiFi",
    href: "/tjenester/wifi",
    description: "Vi planlegger, installerer og drifter trådløst nett. For bedrifter, hoteller, skoler og offentlige bygg.",
    icon: "wifi",
  },
  {
    title: "Fiber og telecom",
    href: "/tjenester/fiber-og-telecom",
    description: "Fiber, mobil og sentralbord. Vi sjekker adressen og finner leverandøren som passer.",
    icon: "fiber-og-telecom",
  },
  {
    title: "IT support",
    href: "/tjenester/it-support",
    description: "Hjelp når PC-en eller nettverket stopper. Drift, sikkerhet og backup.",
    icon: "it-support",
  },
  {
    title: "Nettsider og drift",
    href: "/tjenester/nettsider",
    description: `En nettside som viser hva dere gjør. Pakker fra ${startSetupPrice} eks. mva.`,
    icon: "nettsider",
  },
];

export const homePositioning = {
  eyebrow: "Uavhengig av leverandør",
  title: ["Behovet ditt først.", "Leverandøren etterpå."],
  body: "Vi sammenligner alternativene og anbefaler det som passer dere. Dere bestemmer selv.",
  points: [
    { title: "Objektive råd", text: "Anbefalingen bygger på behovet deres, ikke på én leverandør." },
    { title: "Mindre å følge opp", text: "Vi tar praten med leverandørene for dere." },
    { title: "Samlet oversikt", text: "Fiber, mobil og IT-avtaler på ett sted." },
    { title: "Nye behov", text: "Endrer behovet seg, ser vi på alternativene igjen." },
  ],
  // Illustrasjonen viser prinsippet. Leverandørene er bevisst anonyme, ikke bytt inn navn uten avtale.
  diagram: {
    need: "Behovet ditt",
    hub: "IT Kompass",
    options: ["Alternativ A", "Alternativ B", "Alternativ C", "Alternativ D"],
    chosen: 2,
    result: "Riktig valg",
    caption: "Behovet avgjør hvilket alternativ du får anbefalt.",
  },
};

export const homeProcess = {
  eyebrow: "Slik jobber vi",
  title: ["Fra første prat", "til ferdig oppsett."],
  body: "Du forteller hva dere trenger. Vi tar oss av resten.",
  steps: [
    { number: "01", title: "Kartlegging", text: "Vi går gjennom hva dere har og hva dere trenger." },
    { number: "02", title: "Anbefaling", text: "Du får et konkret forslag." },
    { number: "03", title: "Oppsett", text: "Vi bestiller, installerer og setter alt opp." },
    { number: "04", title: "Oppfølging", text: "Du ringer oss når noe skjer eller må endres." },
  ],
};

export const homeWebsites = {
  eyebrow: "Nettsider",
  title: ["En nettside kundene", "finner fram i."],
  body: "Kundene skal finne det de leter etter, også på mobil. Slik kan siden deres se ut.",
  growth: { title: "Dette får dere", text: "Én leveranse, fra første utkast til drift." },
};

export const homeWizardCta = {
  eyebrow: "Veiviser",
  title: "Finn riktig løsning.",
  body: "Svar på tre spørsmål og få en anbefaling. Velg hva det gjelder:",
  cta: { label: "Start veiviseren", href: "/finn-riktig-losning" },
};

export const homeContact = {
  eyebrow: "Kontakt",
  title: "Fortell oss hva dere trenger.",
  body: "Skriv noen ord om hva det gjelder, så tar vi kontakt.",
  formTitle: "Send en melding",
  mapTitle: "Hvor vi jobber",
  mapFallback: "Skriv hvor dere holder til, så sier vi fra om vi dekker området.",
};
