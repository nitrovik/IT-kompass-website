import type { TitleLine } from "@/content/home";
import type { ContactCategory } from "@/content/contact";
import type { ServicesNav } from "@/content/navigation";

/*
  Tjenestene: menyen under «Tjenester», oversikten på /tjenester og hver sin side på /tjenester/[slug].
  Teksten bygger på det nettsiden har sagt om tjenestene tidligere, skrevet etter SKRIVEREGLER.md.
  Ikke legg inn priser, leveransetider, garantier, plattformer eller kunder som ikke er bekreftet.

  layout: hvordan «Dette gjør vi» settes opp på siden ("index": nummerert liste, "split": to kolonner),
  så sidene ikke blir like kopier. art: tegningen øverst på siden (components/service/service-art.tsx).
*/
export type Service = {
  slug: string;
  /** Kort merke i menyen og oversikten */
  tag: string;
  name: string;
  /** Én linje i menyen og oversikten */
  summary: string;
  category: ContactCategory;
  metaTitle: string;
  metaDescription: string;
  title: TitleLine[];
  intro: string;
  includes: { title: string; body: string }[];
  outcomes: { title: string; body: string }[];
  needs: string[];
  needsTitle: TitleLine[];
  layout: "index" | "split";
  art: "support" | "wifi" | "fiber" | "voice" | "web";
  related: string[];
  contact: { title: TitleLine[]; body: string };
};

export const services: Service[] = [
  {
    slug: "it-support",
    tag: "IT",
    name: "IT-støtte og drift",
    summary: "Hjelp til ansatte, drift, sikkerhet og backup.",
    category: "IT support",
    metaTitle: "IT-støtte og drift for bedrifter",
    metaDescription: "Hjelp til ansatte, drift av PC-er og nettverk, sikkerhet og backup. På stedet i Viken og digitalt i hele Norge.",
    title: [{ text: "IT som virker," }, { em: "hver dag." }],
    intro: "Vi hjelper de ansatte når noe stopper, og holder PC-er, nettverk og backup i orden. På stedet i Viken og digitalt i hele Norge.",
    includes: [
      { title: "Hjelp til ansatte", body: "PC, e-post eller skriver som ikke virker. Meld saken, så tar vi den." },
      { title: "Drift og overvåking", body: "Vi følger med på PC-er, tjenester og nettverk, og gjør endringer når dere trenger dem." },
      { title: "Sikkerhet", body: "Oppdateringer, tilganger og gode rutiner er med i den faste driften." },
      { title: "Backup", body: "Vi tar backup av det dere må kunne hente tilbake, og sjekker at den virker." },
    ],
    outcomes: [
      { title: "Én kontaktperson", body: "Dere ringer oss, ikke hver leverandør." },
      { title: "Fast oppfølging", body: "Driften følges opp jevnlig, ikke bare når noe har stoppet." },
      { title: "Oversikt", body: "Dere vet hvilket utstyr dere har, hvem som har tilgang og at backupen virker." },
    ],
    needs: [
      "Nye ansatte trenger PC, e-post og tilganger fra første dag.",
      "Skriveren eller e-posten slutter å virke midt i en travel dag.",
      "Dere er usikre på om backupen faktisk virker.",
      "Ingen har oversikt over hvem som har tilgang til hva.",
    ],
    needsTitle: [{ text: "Når IT-en" }, { em: "står i veien." }],
    layout: "split",
    art: "support",
    related: ["wifi", "nettsider"],
    contact: { title: [{ text: "Fortell oss hva" }, { em: "som ikke virker." }], body: "Beskriv kort hva dere trenger hjelp med. Så tar vi kontakt." },
  },
  {
    slug: "wifi",
    tag: "WIFI",
    name: "WiFi og nettverk",
    summary: "Planlegging, installasjon og drift av trådløst nett.",
    category: "Fiber/WiFi",
    metaTitle: "WiFi og nettverk for bedrifter",
    metaDescription: "Vi planlegger, installerer og drifter trådløst nett etter bygget og bruken. Installasjon på stedet i Viken.",
    title: [{ text: "Dekning der dere" }, { em: "faktisk jobber." }],
    intro: "Vi planlegger nettet etter hvordan dere bruker bygget. Så monterer vi utstyret og følger med på det etterpå.",
    includes: [
      { title: "Kartlegging", body: "Vi ser på bygget, hvor mange som bruker nettet og hvor det må være dekning." },
      { title: "Planlegging", body: "Hvor senderne skal stå, bestemmes av bygget deres. Ikke av en standardmal." },
      { title: "Montering", body: "Vi monterer utstyret og skriver ned oppsettet. Da er det enkelt å følge opp senere." },
      { title: "Drift", body: "Med driftsavtale følger vi med på nettet og retter feil." },
    ],
    outcomes: [
      { title: "Dekning der folk jobber", body: "Senderne plasseres etter bygget og bruken." },
      { title: "Dokumentert oppsett", body: "Dere vet hva som er montert og hvordan det er satt opp." },
      { title: "Én kontaktperson", body: "Én å ringe når nettet ikke virker." },
    ],
    needs: [
      "Dekningen er dårlig i deler av bygget.",
      "Nettet blir tregt når mange er pålogget samtidig.",
      "Dere skal flytte inn i nye lokaler.",
      "Ingen vet hvordan nettet er satt opp i dag.",
    ],
    needsTitle: [{ text: "Når nettet" }, { em: "ikke holder mål." }],
    layout: "index",
    art: "wifi",
    related: ["fiber-og-bredband", "it-support"],
    contact: { title: [{ text: "Ta en prat om" }, { em: "nettet deres." }], body: "Fortell kort om bygget og hvor nettet ikke holder mål. Så tar vi kontakt." },
  },
  {
    slug: "fiber-og-bredband",
    tag: "FIBER",
    name: "Fiber og bredbånd",
    summary: "Vi sjekker adressen og sammenligner leverandørene.",
    category: "Fiber/WiFi",
    metaTitle: "Fiber og bredbånd for bedrifter",
    metaDescription: "Vi sjekker hva som finnes på adressen, sammenligner leverandørene og bestiller for dere.",
    title: [{ text: "Fiber til" }, { em: "bedriften din." }],
    intro: "Vi sjekker adressen, ordner avtalen og gir deg én kontaktperson hvis noe skjer.",
    includes: [
      { title: "Sjekk av adressen", body: "Hva dere kan få, avhenger av adressen. Vi finner ut hva som finnes der dere holder til." },
      { title: "Sammenligning", body: "Vi sammenligner leverandørene for dere, uavhengig av hvem som leverer." },
      { title: "Bestilling", body: "Vi bestiller og følger opp til nettet er på plass." },
      { title: "Oppfølging", body: "Er noe galt, tar vi det med leverandøren." },
    ],
    outcomes: [
      { title: "Uavhengig av leverandør", body: "Vi anbefaler det som passer behovet og adressen." },
      { title: "Mindre styr", body: "Vi tar kontakten med leverandørene, så dere slipper." },
      { title: "Oversikt", body: "Dere vet hva avtalen inneholder og hvem som leverer hva." },
    ],
    needs: [
      "Dere vet ikke hva som er mulig på adressen.",
      "Avtalen er gammel, og ingen har sammenlignet på lenge.",
      "Dere skal flytte og trenger nett fra første dag.",
      "Nettet faller ut, og dere vet ikke hvem dere skal ringe.",
    ],
    needsTitle: [{ text: "Når avtalen" }, { em: "ikke lenger passer." }],
    layout: "split",
    art: "fiber",
    related: ["telefoni-og-sentralbord", "wifi"],
    contact: { title: [{ text: "Vi sjekker" }, { em: "adressen for dere." }], body: "Skriv adressen og hva dere bruker nettet til. Så tar vi kontakt." },
  },
  {
    slug: "telefoni-og-sentralbord",
    tag: "TALE",
    name: "Telefoni og sentralbord",
    summary: "Mobil, fasttelefon og sentralbord for bedriften.",
    category: "Mobil",
    metaTitle: "Mobil, fasttelefoni og sentralbord for bedrifter",
    metaDescription: "Mobil, fasttelefon og sentralbord satt opp etter måten bedriften jobber på. Vi sammenligner leverandørene for dere.",
    title: [{ text: "Telefoni som passer" }, { em: "måten dere jobber på." }],
    intro: "Vi setter opp mobil, fasttelefon og sentralbord etter hvordan dere tar imot samtaler. Abonnementene følger vi opp sammen med resten.",
    includes: [
      { title: "Mobil", body: "Bedriftsabonnement til de ansatte, fulgt opp sammen med de andre avtalene." },
      { title: "Fasttelefon", body: "Faste nummer til bedriften, satt opp sammen med resten av telefonien." },
      { title: "Sentralbord", body: "Vi setter opp sentralbordet etter hvordan dere tar imot samtaler." },
      { title: "Sammenligning", body: "Vi sammenligner leverandørene og finner avtalen som passer." },
    ],
    outcomes: [
      { title: "Én kontaktperson", body: "Én å ringe, uansett hvem som leverer." },
      { title: "Samtaler som når fram", body: "Sentralbordet sender samtalen til riktig person." },
      { title: "Oversikt", body: "Dere vet hvem som har hvilket abonnement." },
    ],
    needs: [
      "Kunder kommer ikke gjennom når dere er opptatt.",
      "Mobilabonnementene er spredt på mange avtaler.",
      "Dere vil ha ett nummer som når riktig person.",
      "Nye ansatte trenger telefon og nummer raskt.",
    ],
    needsTitle: [{ text: "Når kundene" }, { em: "ikke kommer fram." }],
    layout: "index",
    art: "voice",
    related: ["fiber-og-bredband", "it-support"],
    contact: { title: [{ text: "Ta en prat om" }, { em: "telefonien." }], body: "Fortell kort hvor mange dere er og hvordan dere tar imot samtaler i dag." },
  },
  {
    slug: "nettsider",
    tag: "WEB",
    name: "Nettsider",
    summary: "Vi lager, drifter og oppdaterer nettsiden.",
    category: "Nettsider",
    metaTitle: "Nettsider for bedrifter",
    metaDescription: "Vi lager, drifter og oppdaterer nettsider for bedrifter. Siden skal vise hva dere gjør og hvordan kundene når dere.",
    title: [{ text: "En nettside som viser" }, { em: "hva dere gjør." }],
    intro: "Kundene deres skal forstå hva dere gjør og hvordan de når dere. Vi lager siden og holder den oppe og oppdatert etterpå.",
    includes: [
      { title: "Design", body: "Siden får et uttrykk som passer bedriften og kundene deres." },
      { title: "Utvikling", body: "Siden er rask og lett å bygge videre på når dere trenger mer." },
      { title: "Drift", body: "Vi holder siden oppe og oppdatert, så dere slipper." },
      { title: "Synlig i Google", body: "Vi bygger opp teksten så både kunder og Google forstår den." },
    ],
    outcomes: [
      { title: "Tydelig budskap", body: "Kundene ser raskt hva dere tilbyr og hvordan de tar kontakt." },
      { title: "Mindre å tenke på", body: "Oppdateringer og drift tar vi." },
      { title: "Én kontaktperson", body: "Samme kontakt som for resten av IT-en." },
    ],
    needs: [
      "Nettsiden er utdatert eller vanskelig å oppdatere.",
      "Kundene finner ikke det de leter etter.",
      "Dere har ingen nettside ennå.",
      "Ingen har ansvar for at siden er oppe og oppdatert.",
    ],
    needsTitle: [{ text: "Når nettsiden" }, { em: "ikke gjør jobben." }],
    layout: "split",
    art: "web",
    related: ["it-support", "telefoni-og-sentralbord"],
    contact: { title: [{ text: "Ta en prat om" }, { em: "nettsiden." }], body: "Fortell kort hva dere har i dag og hva siden skal gjøre for dere." },
  },
];

/* Oversiktssiden /tjenester */
export const servicesOverview = {
  eyebrow: "Tjenester",
  title: [{ text: "IT og telecom." }, { em: "Samlet på ett sted." }] satisfies TitleLine[],
  body: "IT-støtte, WiFi, fiber, telefoni og nettsider. Velg et område for å lese mer.",
  foot: { text: "Usikker på hva dere trenger? Ta en prat med oss.", link: { label: "Snakk med oss", href: "#kontakt" } },
  metaTitle: "Tjenester",
  metaDescription: "IT-støtte og drift, WiFi, fiber og bredbånd, telefoni og sentralbord, og nettsider for bedrifter. Én kontaktperson for alt.",
};

export const serviceHref = (slug: string) => `/tjenester/${slug}`;
export const getService = (slug: string) => services.find((service) => service.slug === slug);

/*
  Undermenyen under «Tjenester». Bygges her (på serveren) og sendes til headeren som props,
  så resten av tjenesteteksten ikke havner i JavaScript-filen som lastes i nettleseren.
*/
export const servicesNav: ServicesNav = {
  label: "Tjenester",
  overview: { label: "Alle tjenester", href: "/tjenester" },
  items: services.map((service) => ({ label: service.name, href: serviceHref(service.slug), tag: service.tag, summary: service.summary })),
};
