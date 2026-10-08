/*
  Nettsidepakkene med priser. Vises på siden «Nettsider og drift» (/tjenester/nettsider).
  Prisene er bestemt av IT Kompass AS. Endre tekst og priser her.

  Alle priser er eks. mva. (vatNote vises under prisene og i innledningen).
  price: setup = etablering (engangsbeløp), monthly = per måned, terms = vilkår under prisen.
  Bruk custom i stedet for setup/monthly når prisen settes ut fra behov.
  Mellomrommet i beløpene er et hardt mellomrom (U+00A0), så tallet aldri deles over to linjer.
*/
export type WebsitePackage = {
  name: string;
  description: string;
  features: string[];
  featured: boolean;
  price: { setup?: string; monthly?: string; custom?: string; terms?: string };
};

export const vatNote = "eks. mva";

export const websitePackages: WebsitePackage[] = [
  {
    name: "Start",
    description: "En tydelig og profesjonell nettside for virksomheter som trenger et solid fundament.",
    features: ["Design og utvikling", "Responsivt nettsted", "Grunnleggende SEO", "Hosting klar for drift"],
    featured: false,
    price: { setup: "4 990,-", monthly: "390,-", terms: "12 måneders binding" },
  },
  {
    name: "Pro",
    description: "For virksomheter som trenger mer innhold, flere sider og større fleksibilitet.",
    features: ["Alt i Start", "Flere innholdstyper", "Utvidet SEO", "Innholdsstruktur for vekst"],
    featured: true,
    price: { setup: "9 990,-", monthly: "690,-", terms: "Inkludert 5 timer endringstid i måneden" },
  },
  {
    name: "Premium",
    description: "For virksomheter som ønsker en komplett digital profil og høy grad av tilpasning.",
    features: ["Alt i Pro", "Skreddersydde komponenter", "Avanserte interaksjoner", "Prioritert videreutvikling"],
    featured: false,
    price: { custom: "Pris ut fra behov" },
  },
];
