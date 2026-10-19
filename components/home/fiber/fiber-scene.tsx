/*
  Fiberscenen i heroen – ren SVG/CSS, ingen WebGL, ingen JavaScript for selve animasjonen.

  Linjene er en statisk tegning (samme kurver som før): et bakgrunnslag med mange tynne,
  svake fibre og et "trunk"-lag som samles mot høyre. Det eneste som beveger seg er sju
  små, myke lyspunkter som glir langs sju av fibrene (<animateMotion>), med ulik fart og
  starttidspunkt slik at de aldri går i takt. Resten av tegningen står helt stille, så
  scenen alltid leses som rolig linjekunst med noen få lysimpulser – ikke som tette,
  lysende "rør" slik den tidligere WebGL-scenen gjorde på smale skjermer.

  Samme oppmerking rendres for mobil og desktop (viewBox skaleres ikke-uniformt til
  beholderen, akkurat som før) – ingen enhetsgjenkjenning, ingen kvalitetsnivåer, ingen
  lasting etter at siden er klar. Ved «redusert bevegelse» bytter en ren CSS-regel til et
  sett med stillestående punkter på samme sted, uten at noe JavaScript trengs.
*/

const TRUNK_COUNT = 33;
const BG_COUNT = 27;

// Linjer med et glødepunkt (7 av 33) – fart og starttidspunkt varierer, så de aldri synkroniseres
const DOTS = [
  { trunk: 3, r: 2.6, dur: 8.5, begin: -1.8, frozen: { cx: 208, cy: 472.5 } },
  { trunk: 8, r: 3.4, dur: 11, begin: -5.4, frozen: { cx: 208, cy: 503.8 } },
  { trunk: 13, r: 2.8, dur: 7.5, begin: -0.6, frozen: { cx: 208, cy: 534.6 } },
  { trunk: 17, r: 3.8, dur: 12.5, begin: -8.1, frozen: { cx: 208, cy: 559.4 } },
  { trunk: 21, r: 3, dur: 9.5, begin: -3.2, frozen: { cx: 208, cy: 584.6 } },
  { trunk: 25, r: 2.9, dur: 13, begin: -10.4, frozen: { cx: 208, cy: 609.5 } },
  { trunk: 30, r: 3.2, dur: 10, begin: -6.7, frozen: { cx: 208, cy: 640.5 } },
];

const trunk = Array.from({ length: TRUNK_COUNT }, (_, i) => {
  const t = i / (TRUNK_COUNT - 1) - 0.5;
  const sy = 640 + t * 330;
  const ey = 30 - t * 420;
  return `M-40 ${sy.toFixed(0)} C 260 ${(560 + t * 160).toFixed(0)}, 520 ${(355 + t * 40).toFixed(0)}, 700 ${(322 + t * 6).toFixed(0)} S 880 ${(250 + t * 60).toFixed(0)}, 1040 ${ey.toFixed(0)}`;
});

const background = Array.from({ length: BG_COUNT }, (_, i) => {
  const y = Math.round(760 - i * (560 / (BG_COUNT - 1)));
  return `M-40 ${y} C 300 ${y - 120}, 600 ${y - 260 + (i % 3) * 40}, 1040 ${y - 470}`;
});

export function FiberScene() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fiber-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5c8fc2" stopOpacity="0.08" />
          <stop offset="0.55" stopColor="#3f7fbf" stopOpacity="0.4" />
          <stop offset="1" stopColor="#3f7fbf" stopOpacity="0.55" />
        </linearGradient>
        <filter id="fiber-dot-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="none" stroke="url(#fiber-fade)" strokeLinecap="round">
        {background.map((d) => <path key={d} d={d} strokeWidth="0.6" opacity="0.5" />)}
        {trunk.map((d, i) => <path key={d} id={`trunk-${i}`} d={d} strokeWidth="1.1" />)}
      </g>

      <g fill="#2aa6ff">
        <circle cx="560" cy="352" r="2.2" opacity="0.7" />
        <circle cx="842" cy="246" r="2.6" opacity="0.8" />
        <circle cx="905" cy="120" r="1.8" opacity="0.6" />
      </g>

      {/* Glødepunktene – det eneste som beveger seg */}
      <g className="fiber-motion-dots">
        {DOTS.map(({ trunk: t, r, dur, begin }) => (
          <circle key={t} r={r} fill="#2aa6ff" filter="url(#fiber-dot-glow)" opacity="0">
            <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="linear" rotate="0">
              <mpath href={`#trunk-${t}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="linear" keyTimes="0;0.1;0.88;1" values="0;0.85;0.85;0" />
          </circle>
        ))}
      </g>
      {/* Redusert bevegelse: frosne punkter på samme sted i stedet for de glidende */}
      <g className="fiber-static-dots">
        {DOTS.map(({ trunk: t, r, frozen }) => <circle key={t} cx={frozen.cx} cy={frozen.cy} r={r} fill="#2aa6ff" filter="url(#fiber-dot-glow)" opacity="0.55" />)}
      </g>
    </svg>
  );
}
