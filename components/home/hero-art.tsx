import { homeHero } from "@/content/home";

/*
  Kompasset i heroen, fra designet: stiplede baner rundt kompasset, skiven med glorie og
  kompasset fra logoen. Fiberbanene og lyskulene tegnes over hele heroen (hero-fiber-system.tsx).
  Lag i figuren:
  1. rutenett, baner og teksten under kompasset: statisk SVG
  2. skiven, ringen og merkene: statisk SVG
  3. lyset i sentrum, som tennes når kompasset tar imot et signal
  4. nålen, som roteres (transform) mot pekeren eller dit signalet sendes
*/
export function HeroArt() {
  const { art } = homeHero;
  return (
    <div className="hero-art">
      <div className="hero-figure">
        <svg viewBox="0 0 700 520" role="img" aria-label={art.label}>
          <g className="hero-svg-grid">
            <circle cx="350" cy="260" r="225" />
            <circle cx="350" cy="260" r="182" strokeDasharray="2 8" />
            <circle cx="350" cy="260" r="135" />
            <path d="M350 18V502M105 260H595" strokeDasharray="2 9" />
          </g>
          <text className="hero-caption" x="350" y="490" textAnchor="middle" fill="#7e92a9" fontFamily="system-ui,sans-serif" fontSize="9" letterSpacing="2.6">{art.ring}</text>
        </svg>

        <svg className="hero-compass-core" viewBox="250 160 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="hero-disc" cx="35%" cy="25%" r="80%">
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#e0edfa" />
            </radialGradient>
          </defs>
          <circle cx="350" cy="260" r="99" fill="#c4d9ee" opacity=".3" />
          <circle cx="350" cy="260" r="86" fill="url(#hero-disc)" stroke="#b4cce5" strokeWidth="1.3" />
          {/* Kompasset fra logoen: ring med fire merker. Nålen ligger i et eget lag over. */}
          <circle cx="350" cy="260" r="64" fill="none" stroke="#0b2545" strokeWidth="3.6" />
          <path d="M350 196V206M414 260H404M350 324V314M286 260H296" stroke="#0b2545" strokeWidth="3.6" />
          <g fill="#6b829c" fontFamily="system-ui,sans-serif" fontSize="10" letterSpacing="2">
            <text x="350" y="180" textAnchor="middle">N</text>
            <text x="350" y="351" textAnchor="middle">S</text>
            <text x="272" y="264" textAnchor="middle">W</text>
            <text x="428" y="264" textAnchor="middle">E</text>
          </g>
        </svg>

        <span className="hero-core-glow" aria-hidden="true" />

        {/* Nordnål i marine, sørnål i turkis, hvitt nav i midten (som i logoen). Roteres rundt sentrum. */}
        <svg className="hero-needle" viewBox="-12 -50 24 100" aria-hidden="true">
          <path d="M0 -48L11.5 0H-11.5Z" fill="#0b2545" />
          <path d="M-11.5 0H11.5L0 48Z" fill="#237286" />
          <circle r="6.4" fill="#fff" stroke="#0b2545" strokeWidth="2.2" />
        </svg>
      </div>
    </div>
  );
}
