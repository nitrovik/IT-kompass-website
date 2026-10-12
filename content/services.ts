import type { ServiceIconKey } from "@/content/types";
import { startSetupPrice } from "@/content/packages";

export type Service = {
  slug: ServiceIconKey;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  bullets: string[];
  detailed: { title: string; body: string }[];
  process: string[];
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "wifi",
    title: "Trådløst nett der dere trenger det",
    shortTitle: "WiFi",
    description: "Vi planlegger, installerer og drifter trådløst nett. For bedrifter, hoteller, skoler og offentlige bygg.",
    intro: "Vi planlegger nettet etter hvordan dere bruker bygget. Da får dere dekning der folk faktisk jobber.",
    bullets: ["Kartlegging og planlegging", "Montering og oppsett", "Drift og overvåking"],
    detailed: [
      { title: "Kartlegging", body: "Vi ser på bygget, hvor mange som bruker nettet og hvor det må være dekning." },
      { title: "Planlegging", body: "Hvor senderne skal stå, bestemmes av bygget deres. Ikke av en standardmal." },
      { title: "Montering", body: "Vi monterer utstyret og skriver ned oppsettet. Da er det enkelt å følge opp senere." },
      { title: "Drift", body: "Med driftsavtale følger vi med på nettet og retter feil." },
    ],
    process: ["Behov", "Kartlegging", "Planlegging", "Montering", "Drift"],
    metaTitle: "WiFi for bedrifter | IT Kompass AS",
    metaDescription: "Vi planlegger, installerer og drifter WiFi for bedrifter, hoteller, skoler og offentlige bygg.",
  },
  {
    slug: "fiber-og-telecom",
    title: "Fiber, mobil og sentralbord til bedriften",
    shortTitle: "Fiber og telecom",
    description: "Vi sjekker adressen, sammenligner leverandørene og ordner avtalen.",
    intro: "Hva dere kan få, avhenger av adressen. Vi finner det som passer der dere holder til.",
    bullets: ["Fiber og bredbånd", "Mobil og bedriftsabonnement", "Fasttelefon og sentralbord"],
    detailed: [
      { title: "Fiber og bredbånd", body: "Vi sjekker hva som finnes på adressen og bestiller for dere." },
      { title: "Mobil", body: "Mobilabonnementene følger vi opp sammen med resten." },
      { title: "Telefoni", body: "Vi setter opp sentralbordet etter hvordan dere tar imot samtaler." },
      { title: "Én kontaktperson", body: "Du ringer oss, ikke hver leverandør." },
    ],
    process: ["Behov", "Sjekk av adressen", "Valg av leverandør", "Bestilling", "Oppfølging"],
    metaTitle: "Fiber og telecom for bedrifter | IT Kompass AS",
    metaDescription: "Fiber, mobil og sentralbord for bedrifter. Vi sjekker adressen og sammenligner leverandørene.",
  },
  {
    slug: "it-support",
    title: "IT-hjelp når noe ikke virker",
    shortTitle: "IT support",
    description: "Hjelp til de ansatte, drift av PC-er og nettverk, sikkerhet og backup.",
    intro: "Vi hjelper både én ansatt med et problem og hele bedriften med drift. På stedet i Viken, digitalt i hele Norge.",
    bullets: ["Hjelp til ansatte", "Drift og overvåking", "Sikkerhet og backup"],
    detailed: [
      { title: "Hjelp til ansatte", body: "PC, e-post eller skriver som ikke virker. Meld saken, så tar vi den." },
      { title: "Drift og overvåking", body: "Vi følger med på PC-er, tjenester og nettverk. Endringer gjør vi når dere trenger dem." },
      { title: "Sikkerhet", body: "Oppdateringer, tilganger og gode rutiner er med i den faste driften." },
      { title: "Backup", body: "Vi tar backup av det dere må kunne hente tilbake, og sjekker at den virker." },
    ],
    process: ["Kartlegging", "Prioritering", "Oppsett av drift", "Overvåking", "Forbedring"],
    metaTitle: "IT support for bedrifter | IT Kompass AS",
    metaDescription: "IT-hjelp for bedrifter: hjelp til ansatte, drift, sikkerhet og backup.",
  },
  {
    slug: "nettsider",
    title: "Nettside som viser hva dere gjør",
    shortTitle: "Nettsider og drift",
    description: `Vi lager, drifter og oppdaterer nettsiden. Pakker fra ${startSetupPrice} eks. mva.`,
    intro: "Kundene deres skal forstå hva dere gjør og hvordan de når dere.",
    bullets: ["Design og utvikling", "Drift og oppdateringer", "Synlighet i Google og innhold"],
    detailed: [
      { title: "Design", body: "Siden får et uttrykk som passer bedriften og kundene deres." },
      { title: "Utvikling", body: "Siden er rask og lett å bygge videre på når dere trenger mer." },
      { title: "Drift", body: "Vi holder siden oppe og oppdatert, så dere slipper." },
      { title: "Synlig i Google (SEO)", body: "Vi bygger opp teksten så både kunder og Google forstår den." },
    ],
    process: ["Mål og innhold", "Design", "Utvikling", "Lansering", "Drift"],
    metaTitle: "Nettsider og drift for bedrifter | IT Kompass AS",
    metaDescription: `Nettsider for bedrifter. Vi lager, drifter og oppdaterer. Pakker fra ${startSetupPrice} eks. mva.`,
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
