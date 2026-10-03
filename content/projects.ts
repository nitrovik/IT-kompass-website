/*
  Ekte kundeprosjekter legges inn her når de er klare for publisering.
  Bildet legges i public/media/ (f.eks. "/media/kunde-nettside.jpg").
  Ikke legg inn oppdiktede prosjekter, kunder eller resultater.

  Eksempel:
  { slug: "kunde-as-nettside", title: "Ny nettside for Kunde AS", category: "Nettsider", year: "2026",
    description: "Kort om hva som ble levert.", image: { src: "/media/kunde-as.jpg", alt: "Forsiden til Kunde AS på laptop og mobil" } },
*/
export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image?: { src: string; alt: string };
};

export const projects: Project[] = [];

export const websitePackages = [
  { name: "Start", description: "En tydelig og profesjonell nettside for virksomheter som trenger et solid fundament.", features: ["Design og utvikling", "Responsivt nettsted", "Grunnleggende SEO", "Hosting klar for drift"], price: "Pris kommer", featured: false },
  { name: "Pro", description: "For virksomheter som trenger mer innhold, flere sider og større fleksibilitet.", features: ["Alt i Start", "Flere innholdstyper", "Utvidet SEO", "Innholdsstruktur for vekst"], price: "Pris kommer", featured: true },
  { name: "Premium", description: "For virksomheter som ønsker en komplett digital profil og høy grad av tilpasning.", features: ["Alt i Pro", "Skreddersydde komponenter", "Avanserte interaksjoner", "Prioritert videreutvikling"], price: "Pris kommer", featured: false },
];
