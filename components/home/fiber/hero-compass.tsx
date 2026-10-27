import { forwardRef } from "react";

/*
  Kompasset der fibrene møtes. Samme formspråk som logoen: ring med fire hovedmerker,
  nål i marine (nord) og turkis (sør). Står midt på ankeret i fiber-scene.tsx.
  Skiven er hel og ugjennomsiktig (ingen backdrop-filter), så den er billig å tegne og
  skjuler fibrene som går inn under den. Nålen peker i retningen fibrene fortsetter ut,
  og følger pekeren på PC (hero-pointer.tsx).
*/
export const NEEDLE_REST = 66;

export const HeroCompass = forwardRef<HTMLSpanElement>(function HeroCompass(_, needleRef) {
  return (
    <div className="hero-compass">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full">
        <circle cx="60" cy="60" r="47" fill="none" stroke="#0e2747" strokeWidth="2.4" />
        <circle cx="60" cy="60" r="40" fill="none" stroke="#0e2747" strokeOpacity=".1" />
        {Array.from({ length: 24 }, (_, i) => {
          const major = i % 6 === 0;
          const a = (i / 24) * Math.PI * 2;
          const r1 = major ? 40 : 43.5;
          // Avrundet, så server og nettleser gir nøyaktig samme tall
          const f = (n: number) => Math.round(n * 100) / 100;
          return <line key={i} x1={f(60 + Math.sin(a) * r1)} y1={f(60 - Math.cos(a) * r1)} x2={f(60 + Math.sin(a) * 47)} y2={f(60 - Math.cos(a) * 47)} stroke="#0e2747" strokeOpacity={major ? 0.85 : 0.22} strokeWidth={major ? 2.4 : 1} strokeLinecap="round" />;
        })}
      </svg>
      <span ref={needleRef} className="needle absolute top-[21%] left-[42.5%] block h-[58%] w-[15%]" style={{ transform: `rotate(${NEEDLE_REST}deg)` }}>
        <svg viewBox="0 0 18 70" className="absolute inset-0 size-full overflow-visible">
          <path d="M9 0 L17 35 L1 35 Z" fill="#0e2747" />
          <path d="M1 35 L17 35 L9 70 Z" fill="#2a8aa8" />
          <path d="M9 0 L9 70" stroke="#fff" strokeOpacity=".18" strokeWidth=".8" />
          <circle cx="9" cy="35" r="4.4" fill="#fff" stroke="#0e2747" strokeWidth="2" />
        </svg>
      </span>
    </div>
  );
});
