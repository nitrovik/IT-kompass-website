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
