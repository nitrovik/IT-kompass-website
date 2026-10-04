import { site } from "@/config/site";

/*
  Kartplassholder med kompass og høydekurver. Det faktiske dekningsområdet settes i
  config/site.ts (coverageArea) – det gjettes aldri.
*/
export function CoverageMap({ title, fallback, className = "" }: { title: string; fallback: string; className?: string }) {
  return (
    <div data-observe="toggle" className={`surface-card p-3 ${className}`}>
      <div className="map-surface relative h-full min-h-[320px] overflow-hidden rounded-[18px]" role="img" aria-label="Illustrasjon av kart">
        <svg className="absolute inset-0 size-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#2a6fb0" strokeOpacity=".12">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M-20 ${70 + i * 46} C 80 ${40 + i * 50}, 160 ${110 + i * 40}, 240 ${80 + i * 48} S 360 ${50 + i * 46}, 420 ${90 + i * 44}`} />)}
          </g>
          <g fill="none" stroke="#0a6ed1">
            <circle cx="220" cy="180" r="120" strokeOpacity=".10" strokeDasharray="3 6" />
            <circle cx="220" cy="180" r="76" strokeOpacity=".16" />
            <circle cx="220" cy="180" r="36" strokeOpacity=".22" />
          </g>
          <circle cx="220" cy="180" r="120" fill="url(#map-glow)" />
          <defs><radialGradient id="map-glow"><stop offset="0" stopColor="#2aa6ff" stopOpacity=".16" /><stop offset="1" stopColor="#2aa6ff" stopOpacity="0" /></radialGradient></defs>
        </svg>
        <div className="absolute top-[45%] left-[55%] grid size-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-white/80 shadow-[0_18px_36px_-16px_rgba(14,39,71,.45)] backdrop-blur" aria-hidden="true">
          <span className="compass-ping absolute inset-0 rounded-full border border-brand-bright/40" />
          <svg viewBox="0 0 60 60" className="size-12">
            <circle cx="30" cy="30" r="24" fill="none" stroke="#0e2747" strokeWidth="2" />
            {[0, 90, 180, 270].map((a) => <line key={a} x1="30" y1="6" x2="30" y2="10" stroke="#0e2747" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 30 30)`} />)}
            <g transform="rotate(32 30 30)"><path d="M30 12 34 30H26Z" fill="#0e2747" /><path d="M26 30h8l-4 18Z" fill="#2a8aa8" /><circle cx="30" cy="30" r="2.6" fill="#fff" stroke="#0e2747" strokeWidth="1.4" /></g>
          </svg>
        </div>
        <div className="absolute inset-x-3 bottom-3 rounded-[14px] border border-white/80 bg-white/85 px-4 py-3.5 shadow-[0_12px_28px_-14px_rgba(14,39,71,.25)] backdrop-blur">
          <strong className="card-title block text-[14px] text-ink">{title}</strong>
          <span className="mt-0.5 block text-[13px] leading-5 text-muted">{site.coverageArea || fallback}</span>
        </div>
      </div>
    </div>
  );
}
