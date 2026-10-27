import { homeHero } from "@/content/home";
import { HeroArt } from "@/components/home/hero-art";
import { HeroFiberSystem } from "@/components/home/hero-fiber-system";

/* Heroen fra designet: teksten til venstre, kompasset til høyre (under teksten på mobil), fiberbanene over hele heroen. */
export function Hero() {
  const [first, second] = homeHero.title;
  return (
    <section className="hero" data-hero aria-labelledby="hero-heading">
      <HeroFiberSystem />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker"><span className="kicker-mark" aria-hidden="true">✳</span> {homeHero.kicker}</p>
          <h1 id="hero-heading">{first}<br /><span className="serif">{second}</span></h1>
          <div className="hero-actions">
            <a className="btn btn-primary" href={homeHero.primary.href}>{homeHero.primary.label} <span className="btn-arrow" aria-hidden="true">↗</span></a>
            <a className="btn btn-secondary" href={homeHero.secondary.href}>{homeHero.secondary.label} <span className="btn-arrow" aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-assurance"><span className="assurance-line" aria-hidden="true" /> {homeHero.assurance}</p>
        </div>
        <HeroArt />
      </div>
    </section>
  );
}
