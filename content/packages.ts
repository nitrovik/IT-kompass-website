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
    description: "For bedrifter som trenger en enkel og ryddig nettside.",
    features: ["Design og utvikling", "Fungerer på mobil", "Grunnleggende synlighet i Google", "Drift av siden"],
    featured: false,
    price: { setup: "4 990,-", monthly: "390,-", terms: "12 måneders binding" },
  },
  {
    name: "Pro",
    description: "For bedrifter som trenger flere sider og jevnlige endringer.",
    features: ["Alt i Start", "Flere sider og typer innhold", "Mer arbeid med synlighet i Google", "Lett å legge til nye sider"],
    featured: true,
    price: { setup: "9 990,-", monthly: "690,-", terms: "Inkludert 5 timer endringstid i måneden" },
  },
  {
    name: "Premium",
    description: "For bedrifter som trenger mer enn en standard nettside.",
    features: ["Alt i Pro", "Egne funksjoner etter behov", "Animasjoner og effekter", "Raskere hjelp med nye funksjoner"],
    featured: false,
    price: { custom: "Pris ut fra behov" },
  },
];

/** Laveste etableringspris, brukes i korte tekster om nettsidene (f.eks. «Pakker fra …»). */
export const startSetupPrice = websitePackages[0].price.setup ?? "";
