import { homePositioning } from "@/content/home";
import { SplitLines } from "@/components/ui/split-words";

/*
  Mørk kontrastseksjon. Illustrasjonen forteller prinsippet: behovet går inn i kompasset,
  alternativene vurderes ett for ett (lyspulser), og det som passer lyser opp.
  Animasjonen er ren CSS/SVG og går bare mens seksjonen er synlig.
*/
const W = 560;
const H = 420;
const NEED = { x: 50, y: 210 };
const HUB = { x: 214, y: 210 };
const OPTION_X = 394;
const optionY = (i: number, n: number) => 66 + (i * (H - 132)) / (n - 1);

function routeTo(y: number) {
  return `M${HUB.x + 30} ${HUB.y} C ${HUB.x + 90} ${HUB.y}, ${OPTION_X - 90} ${y}, ${OPTION_X - 10} ${y}`;
}

function RouteDiagram() {
  const { diagram } = homePositioning;
  const n = diagram.options.length;
  const chosenY = optionY(diagram.chosen, n);
  const needle = 90 + (Math.atan2(chosenY - HUB.y, OPTION_X - HUB.x) * 180) / Math.PI;
  const pct = (x: number, total: number) => `${((x / total) * 100).toFixed(3)}%`;
  const needPath = `M${NEED.x + 10} ${NEED.y} L ${HUB.x - 30} ${HUB.y}`;

  return (
    <figure data-observe="toggle" className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[.035] p-4 shadow-[0_1px_0_rgba(255,255,255,.06)_inset] sm:p-6">
      <div className="grid-lines-dark pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(80%_70%_at_50%_50%,#000,transparent)]" aria-hidden="true" />
      <div className="relative aspect-[4/3]">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="route-chosen" x1="0" x2="1">
              <stop offset="0" stopColor="#2aa6ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7fd0ff" />
            </linearGradient>
            <radialGradient id="hub-glow"><stop offset="0" stopColor="#2aa6ff" stopOpacity=".35" /><stop offset="1" stopColor="#2aa6ff" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx={HUB.x} cy={HUB.y} r="90" fill="url(#hub-glow)" />

          {/* Behov → kompass */}
          <path d={needPath} className="fiber" stroke="#8fd0ff" strokeOpacity=".55" strokeWidth="1.6" />
          <path d={needPath} pathLength={1} className="fiber route-pulse route-pulse-in" stroke="#fff" strokeWidth="2.6" />

          {/* Kompass → alternativer */}
          {diagram.options.map((_, i) => {
            const y = optionY(i, n);
            const chosen = i === diagram.chosen;
            return (
              <g key={i}>
                <path d={routeTo(y)} className="fiber" stroke={chosen ? "url(#route-chosen)" : "#8fa8c2"} strokeOpacity={chosen ? 1 : 0.32} strokeWidth={chosen ? 2 : 1.2} />
                <path d={routeTo(y)} pathLength={1} className="fiber route-pulse route-pulse-scan" stroke="#cfe9ff" strokeWidth="2.2" style={{ animationDelay: `${0.4 + i * 0.55}s` }} />
                {chosen ? <path d={routeTo(y)} pathLength={1} className="fiber route-pulse route-pulse-chosen" stroke="#fff" strokeWidth="3" /> : null}
                <circle cx={OPTION_X} cy={y} r={chosen ? 9 : 6} fill={chosen ? "#2aa6ff" : "#0b2342"} stroke={chosen ? "#bfe6ff" : "#8fa8c2"} strokeOpacity={chosen ? 1 : 0.6} strokeWidth="1.6" className={chosen ? "route-node-chosen" : undefined} />
              </g>
            );
          })}

          {/* Behovet */}
          <circle cx={NEED.x} cy={NEED.y} r="9" fill="#0b2342" stroke="#8fd0ff" strokeWidth="1.6" />
          <circle cx={NEED.x} cy={NEED.y} r="3.5" fill="#8fd0ff" />

          {/* Kompasset */}
          <circle cx={HUB.x} cy={HUB.y} r="30" fill="#0e2747" stroke="#fff" strokeOpacity=".9" strokeWidth="2.2" />
          {Array.from({ length: 4 }, (_, i) => {
            const a = (i * Math.PI) / 2;
            return <line key={i} x1={Math.round((HUB.x + Math.sin(a) * 23) * 100) / 100} y1={Math.round((HUB.y - Math.cos(a) * 23) * 100) / 100} x2={Math.round((HUB.x + Math.sin(a) * 30) * 100) / 100} y2={Math.round((HUB.y - Math.cos(a) * 30) * 100) / 100} stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />;
          })}
          <g transform={`rotate(${needle.toFixed(2)} ${HUB.x} ${HUB.y})`}>
            <path d={`M${HUB.x} ${HUB.y - 19} L${HUB.x + 5} ${HUB.y} L${HUB.x - 5} ${HUB.y} Z`} fill="#fff" />
            <path d={`M${HUB.x - 5} ${HUB.y} L${HUB.x + 5} ${HUB.y} L${HUB.x} ${HUB.y + 19} Z`} fill="#4fb3cf" />
            <circle cx={HUB.x} cy={HUB.y} r="2.6" fill="#0e2747" stroke="#fff" strokeWidth="1.2" />
          </g>
        </svg>

        {/* Etiketter i HTML, så de er skarpe og lesbare på alle skjermstørrelser */}
        <span className="absolute -translate-x-1/2 translate-y-5 text-[12px] font-medium whitespace-nowrap text-on-navy sm:text-[13px]" style={{ left: pct(NEED.x, W), top: pct(NEED.y, H) }}>{diagram.need}</span>
        <span className="absolute -translate-x-1/2 translate-y-11 text-[12px] font-semibold whitespace-nowrap text-white sm:text-[13px]" style={{ left: pct(HUB.x, W), top: pct(HUB.y, H) }}>{diagram.hub}</span>
        {diagram.options.map((option, i) => {
          const chosen = i === diagram.chosen;
          return (
            <span key={option} className="absolute -translate-y-[10px] pl-4 leading-5" style={{ left: pct(OPTION_X, W), top: pct(optionY(i, n), H) }}>
              <span className={chosen ? "block text-[12px] font-semibold whitespace-nowrap text-white sm:text-[13px]" : "block text-[12px] whitespace-nowrap text-on-navy-muted sm:text-[13px]"}>{option}{chosen ? <span className="sr-only"> – {diagram.result}</span> : null}</span>
              {chosen ? <span className="route-badge mt-1.5 hidden items-center gap-1.5 rounded-full whitespace-nowrap sm:inline-flex bg-[#2aa6ff]/15 px-2 py-0.5 text-[11px] font-semibold text-[#9fdcff] ring-1 ring-[#2aa6ff]/40"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="m1.5 5.2 2.2 2.2L8.5 2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{diagram.result}</span> : null}
            </span>
          );
        })}
      </div>
      <figcaption className="relative mt-3 border-t border-white/10 pt-4 text-[13px] leading-5 text-on-navy-muted">{diagram.caption}</figcaption>
    </figure>
  );
}

export function PositioningSection() {
  return (
    <section className="px-3 sm:px-4" aria-labelledby="leverandoruavhengig-heading">
      <div className="navy-slab on-dark overflow-hidden rounded-[32px] lg:rounded-[40px]">
        <div className="container-shell section-pad grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow" data-reveal="fade">{homePositioning.eyebrow}</p>
            <h2 id="leverandoruavhengig-heading" data-split className="section-title mt-5 text-white"><SplitLines lines={homePositioning.title} /></h2>
            <p data-reveal style={{ ["--d" as string]: ".15s" }} className="lead mt-6 max-w-[34rem] !text-on-navy">{homePositioning.body}</p>
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {homePositioning.points.map((point, index) => (
                <li key={point.title} data-reveal style={{ ["--d" as string]: `${0.2 + index * 0.07}s` }} className="flex gap-4">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#2aa6ff]/12 text-[#8fd0ff] ring-1 ring-[#2aa6ff]/30" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12"><path d="m2 6.3 2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span>
                    <strong className="card-title block text-[16px] text-white">{point.title}</strong>
                    <span className="mt-1 block text-[14px] leading-6 text-on-navy">{point.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="scale" style={{ ["--d" as string]: ".1s" }}>
            <RouteDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
