import type { LucideIcon } from "lucide-react";
import { Blocks, Globe2, Headphones, Network, ShieldCheck, Wifi } from "lucide-react";

export type HomeService = {
  title: string;
  kicker: string;
  href: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
};

export const homeHero = {
  eyebrow: "IT Kompass AS",
  title: ["IT og telecom.", "Én partner."],
  body:
    "Vi finner løsningen som passer virksomheten din, uavhengig av leverandør. Du får én kontakt for IT og telecom.",
  primaryCta: { label: "Finn riktig løsning", href: "/finn-riktig-losning" },
  secondaryCta: { label: "Snakk med oss", href: "/kontakt" },
};

export const homeServices: HomeService[] = [
  {
    title: "WiFi",
    kicker: "01 / Nettverk",
    href: "/tjenester/wifi",
    description:
      "Prosjektering, installasjon og full drift av trådløse nett for bedrifter, hoteller, skoler og offentlige bygg.",
    icon: Wifi,
    bullets: ["Kartlegging", "Installasjon", "Drift og overvåking"],
  },
  {
    title: "Fiber og telecom",
    kicker: "02 / Forbindelse",
    href: "/tjenester/fiber-og-telecom",
    description:
      "Fiber, bredbånd, mobil, fasttelefoni og sentralbord samlet gjennom én partner.",
    icon: Network,
    bullets: ["Fiber og bredbånd", "Mobil", "Telefoni og sentralbord"],
  },
  {
    title: "IT support",
    kicker: "03 / Drift",
    href: "/tjenester/it-support",
    description:
      "Brukerstøtte, drift og overvåking, sikkerhet, backup, utstyr og installasjoner.",
    icon: Headphones,
    bullets: ["Brukerstøtte", "Sikkerhet og backup", "Utstyr og installasjoner"],
  },
  {
    title: "Nettsider og drift",
    kicker: "04 / Digitalt",
    href: "/tjenester/nettsider",
    description:
      "Design, utvikling, hosting, SEO og innhold for virksomheter som vil ha en nettside som faktisk gjør jobben sin.",
    icon: Globe2,
    bullets: ["Design og utvikling", "Hosting", "SEO og innhold"],
  },
];

export const homePositioning = {
  eyebrow: "Leverandøruavhengig",
  title: "Riktig løsning først. Leverandør etterpå.",
  body:
    "Vi starter med behovet ditt, ikke med én bestemt leverandør. Vi vurderer løsninger på tvers av IT og telecom og samler det du trenger hos én kontaktperson.",
  points: [
    "Behovet styrer anbefalingen.",
    "Løsningen bygges for virksomheten din.",
    "Én kontakt når noe skal endres eller følges opp.",
  ],
  icon: ShieldCheck,
};

export const homeProcess = [
  { number: "01", title: "Forstå behovet", text: "Vi begynner med virksomheten, arbeidsmåten og det som skal fungere." },
  { number: "02", title: "Finne riktig løsning", text: "Vi vurderer alternativer og foreslår en løsning som passer behovet." },
  { number: "03", title: "Sette det opp", text: "Vi prosjekterer, installerer og får tjenesten i drift." },
  { number: "04", title: "Følge det opp", text: "Du har en fast partner for endringer, support og videre drift." },
];

export const homeShowcase = [
  {
    title: "Nettside for virksomheten",
    category: "Nettsider",
    description: "Plassholder for et ekte prosjektbilde. Vis en ferdig nettside i laptop- og mobilramme.",
    motif: "Forside med tydelig tjenestehierarki, store flater og konverteringsfokus.",
  },
  {
    title: "Bedriftsnett på tvers av bygg",
    category: "WiFi",
    description: "Plassholder for et ekte prosjektbilde. Vis før/etter, dekning eller installasjon.",
    motif: "Kartlegging, tilgangspunkter og dokumentasjon samlet i én leveranse.",
  },
  {
    title: "Telecom samlet i ett oppsett",
    category: "Fiber og telecom",
    description: "Plassholder for et ekte prosjektbilde. Vis løsning, installasjon eller kundemiljø.",
    motif: "Fiber, mobil og telefoni samlet under én kontaktflate.",
  },
];

export const homePackages = [
  { name: "Start", summary: "En profesjonell nettside for virksomheter som trenger en tydelig tilstedeværelse på nett.", price: "Pris kommer", featured: false },
  { name: "Pro", summary: "Mer innhold, flere sider og større fleksibilitet for virksomheter i vekst.", price: "Pris kommer", featured: true },
  { name: "Premium", summary: "En komplett digital profil med høy grad av tilpasning, innhold og videreutvikling.", price: "Pris kommer", featured: false },
];

export const homeTrust = [
  { icon: Blocks, label: "Én kontaktflate" },
  { icon: Network, label: "IT og telecom samlet" },
  { icon: ShieldCheck, label: "Bygd for videre drift" },
];
