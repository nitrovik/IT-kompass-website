import { Headphones, Network, Wifi, Globe2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  kicker: string;
  description: string;
  intro: string;
  icon: LucideIcon;
  bullets: string[];
  detailed: { title: string; body: string }[];
  process: string[];
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "wifi",
    title: "WiFi for virksomheter og bygg",
    shortTitle: "WiFi",
    kicker: "01 / Nettverk",
    description: "Prosjektering, installasjon og full drift av trådløse nett for bedrifter, hoteller, skoler og offentlige bygg.",
    intro: "Et godt trådløst nett skal være stabilt, oversiktlig og dimensjonert for hvordan bygget faktisk brukes.",
    icon: Wifi,
    bullets: ["Prosjektering og kartlegging", "Installasjon og konfigurering", "Drift og overvåking"],
    detailed: [
      { title: "Kartlegging", body: "Vi starter med bygg, bruksmønster, kapasitet og hvilke områder som må ha dekning." },
      { title: "Prosjektering", body: "Løsningen dimensjoneres rundt bygget og kravene til virksomheten, ikke rundt en standardmal." },
      { title: "Installasjon", body: "Tilgangspunkter og nettverk settes opp og dokumenteres slik at løsningen er enkel å følge opp." },
      { title: "Drift", body: "Når drift inngår, kan vi følge med på nettverket og ta tak i endringer og avvik." },
    ],
    process: ["Behov og bygg", "Kartlegging", "Prosjektering", "Installasjon", "Drift"],
    metaTitle: "WiFi for bedrifter | IT Kompass AS",
    metaDescription: "Prosjektering, installasjon og drift av WiFi for bedrifter, hoteller, skoler og offentlige bygg.",
  },
  {
    slug: "fiber-og-telecom",
    title: "Fiber og telecom samlet",
    shortTitle: "Fiber og telecom",
    kicker: "02 / Forbindelse",
    description: "Fiber, bredbånd, mobil, fasttelefoni og sentralbord samlet hos én partner.",
    intro: "Vi hjelper virksomheten med forbindelser og telefoni som er tilpasset behov, lokasjon og arbeidsform.",
    icon: Network,
    bullets: ["Fiber og bredbånd", "Mobil og bedriftsabonnement", "Fasttelefoni og sentralbord"],
    detailed: [
      { title: "Fiber og bredbånd", body: "Vi vurderer tilgjengelige alternativer og hjelper med valg, bestilling og oppfølging." },
      { title: "Mobil", body: "Bedriftsmobil og abonnement kan samles med resten av telecom-leveransen." },
      { title: "Telefoni", body: "Fasttelefoni og sentralbord kan tilpasses hvordan virksomheten tar imot og følger opp samtaler." },
      { title: "Samlet oppfølging", body: "Du slipper å holde oversikt over flere leverandørflater når vi kan koordinere leveransen." },
    ],
    process: ["Behov", "Adresse og tilgjengelighet", "Løsningsvalg", "Bestilling", "Oppfølging"],
    metaTitle: "Fiber og telecom for bedrifter | IT Kompass AS",
    metaDescription: "Fiber, bredbånd, mobil, fasttelefoni og sentralbord for små og mellomstore bedrifter.",
  },
  {
    slug: "it-support",
    title: "IT support som følger virksomheten",
    shortTitle: "IT support",
    kicker: "03 / Drift",
    description: "Brukerstøtte, drift og overvåking, sikkerhet, backup, utstyr og installasjoner.",
    intro: "IT support handler om å få hverdagen til å fungere, fra én bruker med et problem til drift av et helt miljø.",
    icon: Headphones,
    bullets: ["Brukerstøtte", "Drift og overvåking", "Sikkerhet og backup"],
    detailed: [
      { title: "Brukerstøtte", body: "Vi hjelper med vanlige IT-problemer, oppsett og spørsmål i arbeidshverdagen." },
      { title: "Drift og overvåking", body: "Vi kan følge opp enheter, tjenester og nettverk og gjøre endringer når virksomheten trenger det." },
      { title: "Sikkerhet", body: "Sikkerhet bygges inn i drift, tilgang, oppdateringer og rutiner i stedet for å behandles som et sideprosjekt." },
      { title: "Backup", body: "Backup skal være planlagt, kontrollert og tilpasset hva virksomheten faktisk trenger å kunne gjenopprette." },
    ],
    process: ["Kartlegg miljøet", "Prioriter behov", "Sette opp drift", "Overvåke", "Forbedre"],
    metaTitle: "IT support for bedrifter | IT Kompass AS",
    metaDescription: "Brukerstøtte, drift, overvåking, sikkerhet, backup og IT-utstyr for små og mellomstore bedrifter.",
  },
  {
    slug: "nettsider",
    title: "Nettsider og drift som faktisk er gjennomtenkt",
    shortTitle: "Nettsider og drift",
    kicker: "04 / Digitalt",
    description: "Design, utvikling, hosting, SEO og innhold for virksomheter som vil ha en nettside som gjør jobben sin.",
    intro: "Vi bygger nettsider med samme prinsipp som resten av leveransene våre: forstå behovet, velg riktig løsning og gjør det enkelt å videreutvikle.",
    icon: Globe2,
    bullets: ["Design og utvikling", "Hosting og drift", "SEO og innhold"],
    detailed: [
      { title: "Design", body: "Vi utvikler et tydelig visuelt uttrykk rundt virksomheten, innholdet og målgruppen." },
      { title: "Utvikling", body: "Moderne frontend og en arkitektur som tåler at nettstedet får mer innhold og funksjonalitet over tid." },
      { title: "Hosting", body: "Teknisk drift, ytelse og tilgjengelighet bygges inn fra starten." },
      { title: "SEO og innhold", body: "Innholdet struktureres slik at mennesker forstår siden, og søkemotorer får et ryddig utgangspunkt." },
    ],
    process: ["Mål og innhold", "Designretning", "Utvikling", "Lansering", "Videre drift"],
    metaTitle: "Nettsider og drift for bedrifter | IT Kompass AS",
    metaDescription: "Design, utvikling, hosting, SEO og innhold for moderne bedriftsnettsteder.",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
