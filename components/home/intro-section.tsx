import { homeIntro } from "@/content/home";
import { TitleLines } from "@/components/home/section-title";

/* «Hvorfor IT Kompass» i menyen går hit (#hvorfor). */
export function IntroSection() {
  return (
    <section className="intro" id="hvorfor" aria-labelledby="hvorfor-heading">
      <div className="wrap intro-grid">
        <div className="intro-left" data-reveal>
          <p className="eyebrow">{homeIntro.eyebrow}</p>
          <h2 id="hvorfor-heading" className="section-heading"><TitleLines lines={homeIntro.title} /></h2>
          <p className="intro-quote">{homeIntro.quote}</p>
        </div>
        <div className="intro-right" data-reveal style={{ ["--d" as string]: ".08s" }}>
          {homeIntro.paragraphs.map((paragraph, i) => (
            <p key={paragraph}>{i === 0 ? <><strong>{homeIntro.lead}</strong> </> : null}{paragraph}</p>
          ))}
          <a className="text-link" href={homeIntro.link.href}>{homeIntro.link.label} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
