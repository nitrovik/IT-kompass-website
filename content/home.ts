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
  secondary: { label: "Se hva vi gjør", href: "/tjenester" },
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

export const homeContact = {
  eyebrow: "La oss begynne her",
  title: [{ text: "La oss finne" }, { em: "riktig løsning." }] satisfies TitleLine[],
  body: "Har du et konkret behov, eller vil du bare se på mulighetene? Vi starter gjerne med en uforpliktende prat.",
  link: { label: "Utforsk tjenestene", href: "/tjenester" },
  card: {
    eyebrow: "Et enkelt første steg",
    title: "Hva trenger bedriften hjelp med?",
    body: "Fortell oss kort hva bedriften trenger hjelp med. Så finner vi ut av neste steg sammen.",
  },
};
