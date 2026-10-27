/*
  Alt synlig innhold på forsiden, etter eierens design (design/reference-homepage-v2.html).
  Kan flyttes til et CMS (f.eks. Sanity) senere uten at komponentene må skrives om.
  Ikke legg inn oppdiktede kunder, tall, priser, partnere eller kontaktopplysninger.
*/

/** En linje i en overskrift: vanlig tekst, eventuelt etterfulgt av et kursivt aksentord (serif, blått). */
export type TitleLine = { text?: string; em?: string };

export const homeHero = {
  kicker: "En trygg partner innen IT og telekom",
  title: ["Vi drifter.", "Du driver."],
  body: "Vi hjelper bedrifter med IT og telecom. Vi finner løsninger som passer behovet ditt – uavhengig av leverandør.",
  primary: { label: "La oss snakke", href: "#kontakt" },
  secondary: { label: "Se hva vi gjør", href: "#tjenester" },
  assurance: "En kontaktperson, trygg drift slik at du kan drive det dere skal uten bekymringer",
  art: {
    label: "Spesialtegnet kompass med fiberoptiske baner som møtes i et sentralt punkt",
    ring: "FORBINDELSER · MULIGHETER · RETNING",
    note: { title: "Teknologi i sammenheng", text: "Ikke flere løsninger enn du trenger." },
    badge: ["IT og telecom.", "Én kontakt."],
    caption: "IT. Nettverk. Telekom.",
  },
};

export const homeProof = {
  intro: "En partner. Flere fagområder.",
  items: [
    { icon: "check", text: "Nøytral rådgivning" },
    { icon: "panel", text: "IT og telekom samlet" },
    { icon: "shield", text: "Én kontakt å forholde seg til" },
  ],
} as const;

export const homeIntro = {
  eyebrow: "Se helheten først",
  title: [{ text: "Vi hjelper deg" }, { text: "å velge ", em: "riktig." }] satisfies TitleLine[],
  quote: "«Behovet avgjør, IT Kompasset viser vei.»",
  lead: "Behovet avgjør.",
  paragraphs: [
    "Vi hjelper deg å finne løsninger som passer for bedriften din, og som fungerer godt sammen uavhengig av hva behovet deres er.",
    "Du får hjelp til å vurdere alternativene og en kontaktperson å forholde deg til.",
  ],
  link: { label: "Ta en prat med oss", href: "#kontakt" },
};

export const homeServices = {
  eyebrow: "Hva vi hjelper med",
  title: [{ text: "IT og telecom." }, { em: "Samlet på ett sted." }] satisfies TitleLine[],
  body: "IT-støtte, WiFi, fiber og telefoni. Vi hjelper deg å finne løsninger som passer bedriften din så kan dere samle løsning på et sted.",
  items: [
    { num: "IT", name: ["IT-støtte", "og drift"], detail: "Brukerstøtte, drift og oppfølging av IT-løsningene bedriften bruker hver dag." },
    { num: "WIFI", name: ["WiFi og", "nettverk"], detail: "Planlegging, prosjektering, installasjon og drift av trådløse nettverk tilpasset bygget og bruken." },
    { num: "FIBER", name: ["Fiber og", "bredbånd"], detail: "Vi vurderer fiber- og bredbåndsalternativer ut fra behovet og tilgjengeligheten der dere holder til." },
    { num: "TALE", name: ["Telefoni og", "sentralbord"], detail: "Mobil, fasttelefoni og sentralbord tilpasset måten bedriften jobber på." },
  ],
  // Hver rad går til kontaktskjemaet
  href: "#kontakt",
  foot: { text: "Usikker på hva dere trenger? Ta en prat med oss.", link: { label: "Snakk med oss", href: "#kontakt" } },
};

export const homeContact = {
  eyebrow: "La oss begynne her",
  title: [{ text: "La oss finne" }, { em: "riktig løsning." }] satisfies TitleLine[],
  body: "Har du et konkret behov, eller vil du bare se på mulighetene? Vi starter gjerne med en uforpliktende prat.",
  // Designet lenket til itkompass.no (denne nettsiden). Her går knappen til skjemaet i kortet ved siden av.
  cta: { label: "Send oss en melding", href: "#kontaktskjema" },
  card: {
    eyebrow: "Et enkelt første steg",
    title: "Hva trenger bedriften hjelp med?",
    body: "Fortell oss kort hva bedriften trenger hjelp med. Så finner vi ut av neste steg sammen.",
    link: { label: "Utforsk tjenestene", href: "#tjenester" },
  },
};
