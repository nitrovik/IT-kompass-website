import type { CSSProperties, ReactNode } from "react";
import { bounds, pathData, type Point, type Segment } from "@/components/home/fiber/geometry";
import { HERO_PULSES, type Prefix } from "@/components/home/fiber/motion";
import { BRANCH_ANGLES, DESKTOP, MOBILE, chosenOf, type Fiber, type Scene } from "@/components/home/fiber/scene";
import { MOTION_CSS_URL } from "@/components/home/motion-css";

/*
  Fiberscenen i heroen. Samme historie som diagrammet «Behovet avgjør», tegnet lyst og stille:
  behovet kommer inn fra venstre, samles i kompasset, grener seg ut til noen få alternativer,
  og én retning er tydeligere og fortsetter videre. Tegningen ligger i scene.ts.

  Alt er plassert rundt ett punkt, kompassets sentrum (ankeret .fiber-anchor), så banene
  alltid treffer kompasset og har samme proporsjoner på alle skjermer.

  - Fibrene og nodene er en statisk SVG som tegnes én gang. Ingen filter, ingen blur.
  - Fortellingen (én syklus): en impuls kommer inn → ringen markerer at den er fremme →
    svake impulser sjekker alternativene etter tur (nodene blinker) → den riktige retningen
    lyser opp og impulsen fortsetter ut. Støttefibrene får en impuls hver 2. eller 3. syklus,
    så rytmen varierer uten at ting langt fra hverandre beveger seg samtidig.
  - Alt som beveger seg er transform- og opacity-keyframes (motion.ts), så skjermkortet gjør
    jobben alene: ingen JavaScript, ingen layout, ingen ny maling. Keyframes ligger i en egen
    fil (/motion.css) som hero-pointer.tsx laster etter at siden er ferdig. Uten den står alt stille.
  - Starter etter lasting (data-fiber-live), står stille utenfor skjermen, skjules ved
    «redusert bevegelse».
  - PC: peker du mot et alternativ, lyser grenen svakt opp og nålen peker dit (hero-pointer.tsx).
*/

const VIEW = { x: -2400, y: -1100, w: 3600, h: 2200 };
const end = (segments: Segment[]) => segments[segments.length - 1][3];

/* Statisk tegning: fibre inn, grener ut, noder. Tegnes én gang. */
function Drawing({ scene, p, className }: { scene: Scene; p: Prefix; className: string }) {
  const chosen = chosenOf(scene);
  const small = p === "m";
  const grad = (id: string, [x1, y1]: [number, number], [x2, y2]: [number, number], color: string, from: number, mid: number, to: number) => (
    <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" stopColor={color} stopOpacity={from} />
      <stop offset=".55" stopColor={color} stopOpacity={mid} />
      <stop offset="1" stopColor={color} stopOpacity={to} />
    </linearGradient>
  );
  const halo = (key: string, f: Fiber, d: string, stroke: string) => <path key={key} d={d} stroke={stroke} strokeWidth={f.width * 4.5} strokeOpacity={0.09} />;
  const inbound = (f: Fiber) => `url(#g-${f.id})`;
  const onwardEnd = end(scene.onward);

  return (
    <svg className={`fiber-svg ${className}`} style={{ left: VIEW.x, top: VIEW.y }} width={VIEW.w} height={VIEW.h} viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} aria-hidden="true" focusable="false">
      <defs>
        {/* Inn: svak ved kanten, sterkest ved kompasset */}
        {scene.incoming.map((f) => { const s = f.segments[0][0]; return grad(`g-${f.id}`, [s[0] * 0.7, s[1] * 0.7], [-60, 0], f.color, 0, f.opacity * 0.75, f.opacity); })}
        {/* Grener: sterkest ved kompasset, litt svakere ved noden */}
        {scene.branches.map((b) => grad(`g-${b.id}`, [0, 0], [b.node[0], b.node[1]], b.color, b.opacity, b.opacity * 0.85, b.opacity * (b.chosen ? 1 : 0.7)))}
        {/* Videre i riktig retning: toner ut mot kanten */}
        {grad(`g-${p}-onward`, [chosen.node[0], chosen.node[1]], [onwardEnd[0], onwardEnd[1]], chosen.color, chosen.opacity, chosen.opacity * 0.55, 0)}
        <radialGradient id={`g-${p}-node`}><stop offset="0" stopColor="#2aa6ff" stopOpacity=".45" /><stop offset="1" stopColor="#2aa6ff" stopOpacity="0" /></radialGradient>
      </defs>
      <g fill="none" strokeLinecap="round">
        {/* Myk dybde rundt hovedbanen: en bred, svak strek (ikke blur) */}
        {scene.incoming.filter((f) => f.main).map((f) => halo(`h-${f.id}`, f, pathData(f.segments), inbound(f)))}
        {halo("h-chosen", chosen, pathData(chosen.segments), `url(#g-${chosen.id})`)}
        {halo("h-onward", chosen, pathData(scene.onward), `url(#g-${p}-onward)`)}
        {scene.incoming.map((f) => <path key={f.id} d={pathData(f.segments)} stroke={inbound(f)} strokeWidth={f.width} />)}
        {scene.branches.map((b) => <path key={b.id} d={pathData(b.segments)} stroke={`url(#g-${b.id})`} strokeWidth={b.width} />)}
        <path d={pathData(scene.onward)} stroke={`url(#g-${p}-onward)`} strokeWidth={chosen.width} />
        {/* Diskré refleks i glasset langs hovedbanen */}
        {scene.incoming.filter((f) => f.main).map((f) => <path key={`r-${f.id}`} d={pathData(f.segments)} transform="translate(0 -0.6)" stroke="#fff" strokeOpacity={0.55} strokeWidth={0.5} />)}
        <path d={pathData(chosen.segments)} transform="translate(0 -0.6)" stroke="#fff" strokeOpacity={0.5} strokeWidth={0.5} />
      </g>
      {/* Knutepunktene: alternativene som ringer, det riktige valget fylt og med et mykt lys */}
      {scene.branches.map((b) =>
        b.chosen ? (
          <g key={`n-${b.id}`}>
            <circle cx={b.node[0]} cy={b.node[1]} r={small ? 13 : 17} fill={`url(#g-${p}-node)`} />
            <circle cx={b.node[0]} cy={b.node[1]} r={small ? 5.2 : 6.5} fill="#1d6fc4" stroke="#d6ecff" strokeWidth={1.8} />
            <circle cx={b.node[0]} cy={b.node[1]} r={small ? 1.7 : 2.1} fill="#fff" />
          </g>
        ) : (
          <g key={`n-${b.id}`}>
            <circle cx={b.node[0]} cy={b.node[1]} r={small ? 3.8 : 4.5} fill="#f5f9fd" stroke={b.color} strokeWidth={1.3} />
            <circle cx={b.node[0]} cy={b.node[1]} r={1.5} fill={b.color} />
          </g>
        ),
      )}
    </svg>
  );
}

/* Lite SVG-lag som bare dekker sin egen bane, så opacity kan endres uten å male scenen på nytt */
function Overlay({ segments, node, className, style, branch }: { segments: Segment[]; node?: Point; className: string; style?: CSSProperties; branch?: number }) {
  const box = bounds(segments, 14);
  return (
    <svg className={className} data-branch={branch} style={{ left: box.x, top: box.y, ...style }} width={box.w} height={box.h} viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} aria-hidden="true" focusable="false">
      <g fill="none" strokeLinecap="round">
        <path d={pathData(segments)} stroke="#2aa6ff" strokeOpacity=".16" strokeWidth="7" />
        <path d={pathData(segments)} stroke="#2aa6ff" strokeWidth="1.8" />
      </g>
      {node ? <circle cx={node[0]} cy={node[1]} r="8.5" fill="none" stroke="#2aa6ff" strokeOpacity=".7" strokeWidth="1.4" /> : null}
    </svg>
  );
}

function Motion({ scene, p, className }: { scene: Scene; p: Prefix; className: string }) {
  const chosen = chosenOf(scene);
  const cycle = `${scene.cycle}s`;
  return (
    <>
      {/* Grenen til det riktige valget lyser opp når impulsen går ut i den (bare grenen: lite lag å tegne) */}
      <Overlay segments={chosen.segments} className={`fiber-overlay ${className}`} style={{ animationName: `fo-${p}`, animationDuration: cycle }} />
      {HERO_PULSES[p].map((pulse) => (
        <span key={pulse.name} className={`fiber-pulse ${pulse.scan ? "is-scan " : ""}${className}`} style={{ animationName: pulse.name, animationDuration: `${pulse.cycle}s` }}><span /></span>
      ))}
      {scene.branches.map((b, i) => <span key={`glow-${b.id}`} className={`fiber-node-glow ${className}`} style={{ left: b.node[0], top: b.node[1], animationName: `fn-${p}-${i}`, animationDuration: cycle }} />)}
      <span className={`fiber-node-glow is-chosen ${className}`} style={{ left: chosen.node[0], top: chosen.node[1], animationName: `fn-${p}-c`, animationDuration: cycle }} />
      <span className={`fiber-ring ${className}`} style={{ animationName: `fr-${p}`, animationDuration: cycle }} />
    </>
  );
}

export function FiberScene({ children }: { children: ReactNode }) {
  return (
    <div className="fiber-anchor" aria-hidden="true" data-branches={JSON.stringify(BRANCH_ANGLES)} data-motion-css={MOTION_CSS_URL} style={{ ["--needle-rest-d" as string]: `${chosenOf(DESKTOP).angle}deg`, ["--needle-rest-m" as string]: `${chosenOf(MOBILE).angle}deg` }}>
      {/* Lyset i bakgrunnen står bak kompasset (statisk, tegnes én gang) */}
      <span className="fiber-glow" />
      <Drawing scene={DESKTOP} p="d" className="hidden lg:block" />
      <Drawing scene={MOBILE} p="m" className="lg:hidden" />
      {/* PC: grenen du peker mot lyser svakt opp (data-focus settes av hero-pointer.tsx) */}
      {DESKTOP.branches.map((b, i) => <Overlay key={`focus-${b.id}`} branch={i} segments={b.chosen ? [...b.segments, ...DESKTOP.onward] : b.segments} node={b.node} className="fiber-focus hidden lg:block" />)}
      <Motion scene={DESKTOP} p="d" className="hidden lg:block" />
      <Motion scene={MOBILE} p="m" className="lg:hidden" />
      {children}
    </div>
  );
}
