import type { ServiceCardData } from "@/content/types";

/*
  Alt synlig innhold på forsiden. Kan flyttes til et CMS (f.eks. Sanity) senere
  uten at komponentene må skrives om. Ikke legg inn oppdiktede kunder, tall,
  priser, partnere eller kontaktopplysninger.
*/

export const homeHero = {
  eyebrow: "IT Kompass AS",
  title: ["IT og telecom.", "Én partner."],
  body:
    "Vi finner den beste løsningen for din bedrift, uavhengig av leverandør. Du får én kontaktperson for alt innen IT, telecom, fiber og nettverk.",
  primaryCta: { label: "Finn riktig løsning", href: "/finn-riktig-losning" },
  secondaryCta: { label: "Ta kontakt", href: "/kontakt" },
  quickLinksLabel: "Fire tjenesteområder",
  // Vises i glassbåndet nederst i heroen
  reasons: [
    { title: "Nøytral rådgivning", text: "Vi starter med behovet ditt, ikke med én bestemt leverandør." },
    { title: "Bedriftsfokus", text: "Løsninger for små og mellomstore bedrifter." },
    { title: "Lokalt til stede", text: "Rask oppfølging og personlig service." },
    { title: "Én kontaktperson", text: "For alt innen IT, telecom, fiber og nettverk." },
  ],
};

export const homeServicesIntro = {
  eyebrow: "Våre tjenester",
  title: ["Komplett IT og telecom,", "samlet hos oss."],
  body: "Vi leverer løsninger som fungerer i praksis. Fra trådløse nett og fiber til drift, sikkerhet og moderne nettsider.",
};

export const homeServices: ServiceCardData[] = [
  {
    title: "WiFi",
    href: "/tjenester/wifi",
    description: "Prosjektering, installasjon og full drift av trådløse nett for bedrifter, hoteller, skoler og offentlige bygg.",
    icon: "wifi",
  },
  {
    title: "Fiber og telecom",
    href: "/tjenester/fiber-og-telecom",
    description: "Fiber, bredbånd, mobil, fasttelefoni og sentralbord, samlet hos én partner.",
    icon: "fiber-og-telecom",
  },
  {
    title: "IT support",
    href: "/tjenester/it-support",
    description: "Brukerstøtte, drift og overvåking, sikkerhet, backup, utstyr og installasjoner.",
    icon: "it-support",
  },
  {
    title: "Nettsider og drift",
    href: "/tjenester/nettsider",
    description: "Design, utvikling, hosting, SEO og innhold for en sterkere digital tilstedeværelse.",
    icon: "nettsider",
  },
];

export const homePositioning = {
  eyebrow: "Leverandøruavhengig",
  title: ["Riktig løsning først.", "Leverandør etterpå."],
  body:
    "Vi starter med behovet ditt, ikke med én bestemt leverandør. Derfor kan vi vurdere løsninger på tvers av IT og telecom og samle dem hos én kontaktperson.",
  points: [
    { title: "Objektiv rådgivning", text: "Vi finner løsningen som passer." },
    { title: "Én kontakt", text: "Én partner for IT og telecom." },
    { title: "Lokal nærhet", text: "Rask oppfølging og personlig service." },
    { title: "Langsiktig samarbeid", text: "Vi følger opp når behovene endrer seg." },
  ],
  // Illustrasjonen viser prinsippet. Leverandørene er bevisst anonyme – ikke bytt inn navn uten avtale.
  diagram: {
    need: "Behovet ditt",
    hub: "IT Kompass",
    options: ["Alternativ A", "Alternativ B", "Alternativ C", "Alternativ D"],
    chosen: 2,
    result: "Riktig løsning",
    caption: "Vi vurderer alternativene opp mot behovet – og anbefaler det som passer.",
  },
};

export const homeProcess = {
  eyebrow: "Slik jobber vi",
  title: ["Fra behov", "til løsning."],
  body: "Vi gjør IT og telecom enklere å forholde seg til. Du forteller hva du trenger. Vi tar oss av resten.",
  steps: [
    { number: "01", title: "Forstå behovet", text: "Vi lytter og kartlegger hva virksomheten faktisk trenger." },
    { number: "02", title: "Finne riktig løsning", text: "Vi sammenligner alternativer og anbefaler en retning." },
    { number: "03", title: "Sette det opp", text: "Vi leverer, konfigurerer og installerer." },
    { number: "04", title: "Følge det opp", text: "Vi er her også når løsningen skal driftes videre." },
  ],
};

export const homeWebsites = {
  eyebrow: "Nettsider",
  title: ["En del av løsningen", "skal også se bra ut."],
  body: "Nettsidene vi lager skal være raske, tydelige og gode å bruke. Her er en forhåndsvisning av uttrykket vi kan bygge for kundene våre.",
  packagesEyebrow: "Nettsidepakker",
  packagesTitle: "Tre nivåer for ulike behov.",
  packagesBody: "Prisene fylles inn når pakkene er bestemt.",
  growth: { title: "Bygd for videre vekst", text: "Design, utvikling, hosting, SEO og innhold i samme leveranse." },
};

export const homePackages = [
  { name: "Start", summary: "En profesjonell nettside for virksomheter som trenger en tydelig tilstedeværelse på nett.", price: "Pris kommer", featured: false },
  { name: "Pro", summary: "Mer innhold, flere sider og større fleksibilitet for virksomheter i vekst.", price: "Pris kommer", featured: true },
  { name: "Premium", summary: "En komplett digital profil med høy grad av tilpasning, innhold og videreutvikling.", price: "Pris kommer", featured: false },
];

export const homeWizardCta = {
  eyebrow: "Klar for neste steg?",
  title: "Finn riktig løsning.",
  body: "Svar på tre korte spørsmål, så får du en anbefalt retning. Start med å velge hva det gjelder:",
  cta: { label: "Start veiviseren", href: "/finn-riktig-losning" },
};

export const homeContact = {
  eyebrow: "Kontakt",
  title: "Fortell oss hva du skal få på plass.",
  body: "Vi hjelper deg med alt fra fiber og WiFi til IT-support, nettsider og drift.",
  formTitle: "Send oss en henvendelse",
  mapTitle: "Vårt dekningsområde",
  mapFallback: "Fortell oss hvor virksomheten holder til, så avklarer vi om vi kan hjelpe.",
};
