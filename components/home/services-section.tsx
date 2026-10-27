import { homeServices } from "@/content/home";
import { TitleLines } from "@/components/home/section-title";

/* Tjenestene som en indeks. Hver rad går til kontaktskjemaet. */
export function ServicesSection() {
  return (
    <section className="services" id="tjenester" aria-labelledby="tjenester-heading">
      <div className="wrap">
        <div className="services-head" data-reveal>
          <div>
            <p className="eyebrow">{homeServices.eyebrow}</p>
            <h2 id="tjenester-heading" className="section-heading"><TitleLines lines={homeServices.title} /></h2>
          </div>
          <p className="body-copy">{homeServices.body}</p>
        </div>
        <div className="service-index">
          {homeServices.items.map((item) => (
            <a key={item.num} className="service-row" href={homeServices.href} data-reveal>
              <span className="service-num">{item.num}</span>
              <span className="service-name">{item.name[0]}<br />{item.name[1]}</span>
              <span className="service-detail">{item.detail}</span>
              <span className="service-go" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <div className="services-foot">
          <span>{homeServices.foot.text}</span>
          <a href={homeServices.foot.link.href} className="text-link">{homeServices.foot.link.label} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
