import Link from "next/link";
import { services, serviceHref } from "@/content/services";

/*
  Tjenestene som en redaksjonell indeks (fra forsidens design). Hver rad går til tjenestesiden.
  Ved hover glir innholdet litt inn og pilen blir blå og dreies; det gjøres med transform, så
  ingenting må legges ut på nytt mens pekeren beveger seg over listen.
*/
export function ServicesIndex({ exclude }: { exclude?: string }) {
  return (
    <ul className="service-index">
      {services.filter((service) => service.slug !== exclude).map((service) => (
        <li key={service.slug} data-reveal>
          <Link className="service-row" href={serviceHref(service.slug)}>
            <span className="service-num" aria-hidden="true">{service.tag}</span>
            <span className="service-name">{service.name}</span>
            <span className="service-detail">{service.summary}</span>
            <span className="service-go" aria-hidden="true">↗</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
