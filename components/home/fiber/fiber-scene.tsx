/*
  Fiberscenen i heroen – ren, statisk SVG. Ingen WebGL, ingen JavaScript, ingen bevegelse:
  de sju glødende lyspunktene som tidligere gled langs linjene (SVG <animateMotion> +
  blurfilter) ble droppet fordi det kontinuerlige filter-repaintet gjorde hele siden
  treg. Igjen står bare den rolige linjetegningen – et bakgrunnslag med mange tynne,
  svake fibre og et "trunk"-lag som samles mot høyre, der kompasset står (hero-compass.tsx
  via hero-pointer.tsx, uendret).

  Samme oppmerking rendres for mobil og desktop (viewBox skaleres ikke-uniformt til
  beholderen) – ingen enhetsgjenkjenning, ingen kvalitetsnivåer, ingen lasting etter at
  siden er klar, og dermed heller ingen «redusert bevegelse»-logikk å holde styr på.
*/

const TRUNK_COUNT = 33;
const BG_COUNT = 27;

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
      </defs>

      <g fill="none" stroke="url(#fiber-fade)" strokeLinecap="round">
        {background.map((d) => <path key={d} d={d} strokeWidth="0.6" opacity="0.5" />)}
        {trunk.map((d) => <path key={d} d={d} strokeWidth="1.1" />)}
      </g>

      <g fill="#2aa6ff">
        <circle cx="560" cy="352" r="2.2" opacity="0.7" />
        <circle cx="842" cy="246" r="2.6" opacity="0.8" />
        <circle cx="905" cy="120" r="1.8" opacity="0.6" />
      </g>
    </svg>
  );
}
