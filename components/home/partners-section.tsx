import Image from "next/image";
import { partners } from "@/content/partners";

/* Vises bare når det finnes bekreftede partnere i content/partners.ts. */
export function PartnersSection() {
  if (!partners.length) return null;
  return (
    <section className="border-y border-line py-14" aria-labelledby="partnere-heading">
      <div className="container-shell">
        <h2 id="partnere-heading" className="eyebrow">Partnere vi samarbeider med</h2>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <li key={partner.name} className="flex justify-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
              {partner.url ? (
                <a href={partner.url} target="_blank" rel="noreferrer" aria-label={partner.name}><Image src={partner.logo} alt={partner.name} width={140} height={48} className="h-10 w-auto object-contain" /></a>
              ) : (
                <Image src={partner.logo} alt={partner.name} width={140} height={48} className="h-10 w-auto object-contain" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
