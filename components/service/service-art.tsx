import type { Service } from "@/content/services";

/*
  Strektegninger øverst på tjenestesidene, i samme uttrykk som kompasset på forsiden: tynne
  blå linjer, små knutepunkter og et lite kompass-merke. Statiske SVG-er (ingen animasjon).
*/
const LINE = "#2369cf";
const SOFT = "#8fb9e9";
const DEEP = "#214e83";

function Mark({ x, y }: { x: number; y: number }) {
  // Kompasset fra logoen i miniatyr: ring, fire merker og nålen
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="23" fill="#fff" stroke="#b4cce5" strokeWidth="1.2" />
      <circle r="15" fill="none" stroke="#0b2545" strokeWidth="2" />
      <path d="M0 -15v4M15 0h-4M0 15v-4M-15 0h4" stroke="#0b2545" strokeWidth="2" />
      <path d="M0 -10l3.2 10h-6.4Z" fill="#0b2545" />
      <path d="M-3.2 0h6.4L0 10Z" fill="#237286" />
      <circle r="2.2" fill="#fff" stroke="#0b2545" strokeWidth="1.2" />
    </g>
  );
}

function Dot({ x, y, r = 4, fill = LINE }: { x: number; y: number; r?: number; fill?: string }) {
  return <circle cx={x} cy={y} r={r} fill={fill} />;
}

function Port({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="5" fill="#fff" stroke="#a9c6e6" strokeWidth="1.6" />;
}

function Support() {
  return (
    <>
      <rect x="132" y="92" width="216" height="138" rx="6" fill="#fff" stroke={DEEP} strokeWidth="1.6" />
      <path d="M150 112h180M150 112v100h180" stroke={SOFT} strokeWidth="1" />
      <path d="M206 262h68M240 230v32" stroke={DEEP} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M186 168l26 22 48-50" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M348 160 C 392 160, 404 118, 446 110" fill="none" stroke={SOFT} strokeWidth="1.4" />
      <path d="M348 196 C 396 200, 404 250, 448 262" fill="none" stroke={LINE} strokeWidth="1.4" />
      <path d="M132 176 C 92 176, 70 140, 30 132" fill="none" stroke={SOFT} strokeWidth="1.4" />
      <Port x={348} y={160} />
      <Port x={348} y={196} />
      <Port x={132} y={176} />
      <Dot x={446} y={110} />
      <Dot x={448} y={262} fill={DEEP} />
      <Dot x={30} y={132} fill={SOFT} />
      <Mark x={84} y={268} />
    </>
  );
}

function Wifi() {
  return (
    <>
      <path d="M60 300V120h150v80h120v100H60ZM210 120h210v180H330" fill="none" stroke="#c4d9ef" strokeWidth="1.2" />
      {[46, 86, 126, 166].map((r, i) => (
        <path key={r} d={`M${240 - r * 0.86} ${210 - r * 0.5} A ${r} ${r} 0 0 1 ${240 + r * 0.86} ${210 - r * 0.5}`} fill="none" stroke={i % 2 ? SOFT : LINE} strokeWidth={i === 0 ? 2 : 1.5} strokeLinecap="round" opacity={1 - i * 0.16} />
      ))}
      <circle cx="240" cy="210" r="11" fill="#fff" stroke={DEEP} strokeWidth="1.8" />
      <Dot x={240} y={210} r={4} fill={DEEP} />
      <Dot x={112} y={252} r={3.5} fill={SOFT} />
      <Dot x={370} y={168} r={3.5} fill={SOFT} />
      <Dot x={300} y={262} r={3.5} fill={LINE} />
      <Mark x={408} y={274} />
    </>
  );
}

function Fiber() {
  const strands = [-48, -24, 0, 24, 48];
  return (
    <>
      {strands.map((o, i) => (
        <path key={o} d={`M-10 ${190 + o * 2.6} C 110 ${190 + o * 2.2}, 170 ${190 + o * 0.6}, 250 190`} fill="none" stroke={i === 2 ? LINE : i % 2 ? SOFT : DEEP} strokeWidth={i === 2 ? 1.8 : 1.2} opacity={i === 2 ? 1 : 0.8} />
      ))}
      <path d="M250 190 C 320 190, 360 150, 490 128" fill="none" stroke={LINE} strokeWidth="1.8" />
      <path d="M250 190 C 330 196, 370 236, 490 252" fill="none" stroke={SOFT} strokeWidth="1.3" />
      <rect x="318" y="208" width="112" height="96" rx="4" fill="#fff" stroke={DEEP} strokeWidth="1.5" />
      <path d="M318 236h112M346 236v68M374 236v68M402 236v68" stroke="#c4d9ef" strokeWidth="1" />
      <Dot x={92} y={128} r={3.5} fill={SOFT} />
      <Dot x={146} y={258} r={3.5} />
      <Mark x={250} y={190} />
    </>
  );
}

function Voice() {
  const people = [
    [96, 96],
    [384, 96],
    [76, 270],
    [404, 270],
  ];
  return (
    <>
      {people.map(([x, y], i) => (
        <g key={i}>
          <path d={`M240 184 C ${240 + (x - 240) * 0.35} 184, ${x} ${y + (184 - y) * 0.55}, ${x} ${y}`} fill="none" stroke={i % 2 ? SOFT : LINE} strokeWidth="1.4" />
          <circle cx={x} cy={y} r="17" fill="#fff" stroke={DEEP} strokeWidth="1.4" />
          <circle cx={x} cy={y - 4} r="5" fill="none" stroke={DEEP} strokeWidth="1.3" />
          <path d={`M${x - 8} ${y + 9} q8 -8 16 0`} fill="none" stroke={DEEP} strokeWidth="1.3" />
        </g>
      ))}
      <path d="M182 284c10 12 26 18 44 18M270 268c0 18-10 30-22 34" fill="none" stroke="#c4d9ef" strokeWidth="1.2" />
      <path d="M150 300c18 30 54 40 90 40s72-10 90-40" fill="none" stroke={SOFT} strokeWidth="1.2" strokeDasharray="2 7" />
      <Mark x={240} y={184} />
    </>
  );
}

function Web() {
  return (
    <>
      <rect x="86" y="70" width="308" height="220" rx="7" fill="#fff" stroke={DEEP} strokeWidth="1.6" />
      <path d="M86 98h308" stroke={DEEP} strokeWidth="1.2" />
      <Dot x={104} y={84} r={3} fill={SOFT} />
      <Dot x={116} y={84} r={3} fill={SOFT} />
      <Dot x={128} y={84} r={3} fill={SOFT} />
      <rect x="110" y="120" width="132" height="12" rx="2" fill={LINE} opacity=".85" />
      <rect x="110" y="142" width="96" height="8" rx="2" fill="#c4d9ef" />
      <rect x="110" y="158" width="116" height="8" rx="2" fill="#c4d9ef" />
      <rect x="110" y="184" width="64" height="20" rx="2" fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x="266" y="120" width="104" height="84" rx="3" fill="#eef5fc" stroke="#c4d9ef" />
      <path d="M266 186l30-28 22 20 16-12 36 26" fill="none" stroke={SOFT} strokeWidth="1.3" />
      <path d="M110 232h260M110 252h200" stroke="#dbe7f3" strokeWidth="6" strokeLinecap="round" />
      <path d="M394 150 C 430 150, 440 112, 486 104" fill="none" stroke={SOFT} strokeWidth="1.3" />
      <Port x={394} y={150} />
      <Dot x={486} y={104} />
      <Mark x={70} y={292} />
    </>
  );
}

const ART: Record<Service["art"], () => React.JSX.Element> = { support: Support, wifi: Wifi, fiber: Fiber, voice: Voice, web: Web };

export function ServiceArt({ kind }: { kind: Service["art"] }) {
  const Art = ART[kind];
  return (
    <svg className="svc-art" viewBox="0 0 480 360" fill="none" aria-hidden="true">
      <g className="svc-art-grid" stroke="#d6e4f2" strokeWidth="1">
        <circle cx="240" cy="190" r="168" strokeDasharray="2 8" />
        <circle cx="240" cy="190" r="118" />
      </g>
      <Art />
    </svg>
  );
}
