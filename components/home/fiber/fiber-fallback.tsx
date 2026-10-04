/*
  Statisk fiberbilde i SVG. Vises med en gang (også uten JavaScript), på svake enheter,
  og mens WebGL-scenen lastes. Linjene følger samme komposisjon som WebGL-scenen:
  fibrene samles der kompasset står (70 %, 46 %).
*/
const trunk = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10 - 0.5;
  const sy = 640 + t * 330;
  const ey = 30 - t * 420;
  return `M-40 ${sy.toFixed(0)} C 260 ${(560 + t * 160).toFixed(0)}, 520 ${(355 + t * 40).toFixed(0)}, 700 ${(322 + t * 6).toFixed(0)} S 880 ${(250 + t * 60).toFixed(0)}, 1040 ${ey.toFixed(0)}`;
});

const background = Array.from({ length: 9 }, (_, i) => {
  const y = 760 - i * 70;
  return `M-40 ${y} C 300 ${y - 120}, 600 ${y - 260 + (i % 3) * 40}, 1040 ${y - 470}`;
});

export function FiberFallback({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
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
