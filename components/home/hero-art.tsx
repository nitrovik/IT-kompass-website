import { homeHero } from "@/content/home";
import { FIBERS, HIGHLIGHT, NODES, SIGNALS } from "@/components/home/hero-signals";
import { HeroMotion } from "@/components/home/hero-motion";
import { MOTION_CSS_URL } from "@/components/home/motion-css";

/*
  Kompasset og fibrene fra designet. Tegningen er den samme, men delt i lag (se globals.css):
  1. fibrene, rutenettet og teksten: statisk SVG, tegnes én gang
  2. kompasset (samme kompass som i logoen, på designets skive): eget lag som svever rolig opp og ned (transform)
  3. tre lyssignaler: egne lag som flyttes langs fibrene (transform/opacity)
  4. nodene: øverst, som i designet
*/
export function HeroArt() {
  const { art } = homeHero;
  return (
    <div className="hero-art">
      <div className="hero-figure">
        <svg viewBox="0 0 700 520" role="img" aria-label={art.label}>
          <defs>
            <filter id="hero-softglow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="hero-svg-grid">
            <circle cx="350" cy="260" r="225" />
            <circle cx="350" cy="260" r="182" strokeDasharray="2 8" />
            <circle cx="350" cy="260" r="135" />
            <path d="M350 18V502M105 260H595" strokeDasharray="2 9" />
          </g>
          <g fill="none" strokeLinecap="round">
            {FIBERS.map((fiber) => <path key={fiber.d} className={`fiber fiber-${fiber.tone}`} d={fiber.d} />)}
            <path className="fiber-highlight" d={HIGHLIGHT} filter="url(#hero-softglow)" />
          </g>
          <text x="350" y="490" textAnchor="middle" fill="#7e92a9" fontFamily="system-ui,sans-serif" fontSize="9" letterSpacing="2.6">{art.ring}</text>
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
          {/* Kompasset fra logoen: ring med fire merker, nål i marine (nord) og turkis (sør) */}
          <circle cx="350" cy="260" r="64" fill="none" stroke="#0b2545" strokeWidth="3.6" />
          <path d="M350 196V206M414 260H404M350 324V314M286 260H296" stroke="#0b2545" strokeWidth="3.6" />
          <path d="M350 212L361.5 260H338.5Z" fill="#0b2545" />
          <path d="M338.5 260H361.5L350 308Z" fill="#237286" />
          <circle cx="350" cy="260" r="6.4" fill="#fff" stroke="#0b2545" strokeWidth="2.2" />
          <g fill="#6b829c" fontFamily="system-ui,sans-serif" fontSize="10" letterSpacing="2">
            <text x="350" y="180" textAnchor="middle">N</text>
            <text x="350" y="351" textAnchor="middle">S</text>
            <text x="272" y="264" textAnchor="middle">W</text>
            <text x="428" y="264" textAnchor="middle">E</text>
          </g>
        </svg>

        {SIGNALS.map((signal, i) => (
          <span key={signal.d} className={`hero-signal s${i + 1}`} aria-hidden="true">
            <svg viewBox="-16 -16 32 32">
              <defs>
                <filter id={`hero-signal-glow-${i + 1}`} x="-200%" y="-200%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle r={signal.r} fill="#fff" stroke="#4c99eb" strokeWidth="2" filter={`url(#hero-signal-glow-${i + 1})`} />
            </svg>
          </span>
        ))}

        <svg className="hero-layer" viewBox="0 0 700 520" aria-hidden="true">
          <g fill="#2f7bc8">{NODES.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />)}</g>
        </svg>

        <HeroMotion href={MOTION_CSS_URL} />
      </div>
    </div>
  );
}
