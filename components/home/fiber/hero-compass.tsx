import { forwardRef } from "react";

/*
  Kompasset der fibrene møtes. Samme formspråk som logoen: ring med fire merker,
  nål i marine (nord) og turkis (sør). Nålens rotasjon styres av hero-fiber.tsx.
*/
export const HeroCompass = forwardRef<HTMLSpanElement>(function HeroCompass(_, needleRef) {
  return (
    <div className="pointer-events-none absolute left-[75%] top-[46%] z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block xl:left-[70%]" aria-hidden="true">
      <span className="compass-ping absolute inset-0 rounded-full border border-brand-bright/40" />
      <span className="compass-ping absolute inset-0 rounded-full border border-brand-bright/30 [animation-delay:1.8s]" />
      <div className="relative grid size-[124px] place-items-center rounded-full border border-white/90 bg-white/55 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_30px_60px_-24px_rgba(14,39,71,.45),0_0_0_10px_rgba(255,255,255,.18)] backdrop-blur-[6px]">
        <svg viewBox="0 0 120 120" className="absolute inset-0 size-full">
          <circle cx="60" cy="60" r="47" fill="none" stroke="#0e2747" strokeWidth="2.6" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="#0e2747" strokeOpacity=".12" />
          {Array.from({ length: 24 }, (_, i) => {
            const major = i % 6 === 0;
            const a = (i / 24) * Math.PI * 2;
            const r1 = major ? 40 : 43;
            const r2 = 47;
            // Avrundet, så server og nettleser gir nøyaktig samme tall
            const f = (n: number) => Math.round(n * 100) / 100;
            return <line key={i} x1={f(60 + Math.sin(a) * r1)} y1={f(60 - Math.cos(a) * r1)} x2={f(60 + Math.sin(a) * r2)} y2={f(60 - Math.cos(a) * r2)} stroke="#0e2747" strokeOpacity={major ? 0.9 : 0.25} strokeWidth={major ? 2.6 : 1} strokeLinecap="round" />;
          })}
        </svg>
        <span ref={needleRef} className="needle relative block h-[70px] w-[18px]" style={{ transform: "rotate(42deg)" }}>
          <svg viewBox="0 0 18 70" className="absolute inset-0 size-full overflow-visible">
            <path d="M9 0 L17 35 L1 35 Z" fill="#0e2747" />
            <path d="M1 35 L17 35 L9 70 Z" fill="#2a8aa8" />
            <path d="M9 0 L9 70" stroke="#fff" strokeOpacity=".18" strokeWidth=".8" />
            <circle cx="9" cy="35" r="4.4" fill="#fff" stroke="#0e2747" strokeWidth="2" />
          </svg>
        </span>
      </div>
    </div>
  );
});
