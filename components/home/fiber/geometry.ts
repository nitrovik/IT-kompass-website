/*
  Geometri for fiberbanene. Alt regnes ut på serveren når siden bygges, så nettleseren
  får ferdige SVG-baner og ferdige CSS-keyframes – ingen utregning per bilde.

  En bane er en rekke kubiske Bézier-segmenter. Lysimpulsene følger banen med
  transform-keyframes (translate + rotate) som er samplet langs banen. Transform
  animeres av skjermkortet (compositor), så impulsene koster verken JavaScript,
  layout eller ny maling mens de beveger seg.
*/

export type Point = readonly [number, number];
export type Segment = readonly [Point, Point, Point, Point];

const r1 = (n: number) => Math.round(n * 10) / 10;

/** SVG-banen (d-attributtet) for en rekke segmenter. */
export function pathData(segments: readonly Segment[]) {
  const [start] = segments[0];
  return segments.reduce((d, [, c1, c2, end]) => `${d} C ${r1(c1[0])} ${r1(c1[1])}, ${r1(c2[0])} ${r1(c2[1])}, ${r1(end[0])} ${r1(end[1])}`, `M ${r1(start[0])} ${r1(start[1])}`);
}

function bezier([p0, p1, p2, p3]: Segment, t: number): Point {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/** Punkter med jevn avstand langs banen (buelengde), med retningen i grader. */
function walk(segments: readonly Segment[]) {
  const dense: Point[] = [];
  segments.forEach((segment, i) => {
    for (let s = i === 0 ? 0 : 1; s <= 120; s++) dense.push(bezier(segment, s / 120));
  });
  const lengths = [0];
  for (let i = 1; i < dense.length; i++) lengths.push(lengths[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = lengths[lengths.length - 1];
  return {
    total,
    at(distance: number) {
      const target = Math.min(Math.max(distance, 0), total);
      let i = 1;
      while (i < lengths.length - 1 && lengths[i] < target) i++;
      const span = lengths[i] - lengths[i - 1] || 1;
      const f = (target - lengths[i - 1]) / span;
      const [ax, ay] = dense[i - 1];
      const [bx, by] = dense[i];
      return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
    },
  };
}

/** Rammen rundt banene (med marg), for små SVG-lag som bare dekker sin egen bane. */
export function bounds(segments: readonly Segment[], pad = 10) {
  const points = segments.flatMap((segment) => Array.from({ length: 25 }, (_, i) => bezier(segment, i / 24)));
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.floor(Math.min(...xs) - pad);
  const y = Math.floor(Math.min(...ys) - pad);
  return { x, y, w: Math.ceil(Math.max(...xs) + pad) - x, h: Math.ceil(Math.max(...ys) + pad) - y };
}

/**
  Kort blink på et bestemt tidspunkt i syklusen (andel 0–1): opacity opp raskt og ned rolig,
  valgfritt med skalering (ringen rundt kompasset). Ellers usynlig.
*/
export function flashKeyframes(name: string, at: number, { rise = 0.01, fall = 0.12, max = 1, scale }: { rise?: number; fall?: number; max?: number; scale?: [number, number] } = {}) {
  const pct = (n: number) => `${Math.round(Math.min(Math.max(n, 0), 1) * 100000) / 1000}%`;
  const tf = (s?: number) => (scale && s !== undefined ? `transform:scale(${s});` : "");
  return `@keyframes ${name}{0%,${pct(at - rise)}{opacity:0;${tf(scale?.[0])}}${pct(at)}{opacity:${max};${tf(1)}animation-timing-function:cubic-bezier(.22,1,.36,1)}${pct(at + fall)},100%{opacity:0;${tf(scale?.[1])}}}`;
}

/** Rolig start og rolig ankomst. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type PulseLeg = {
  segments: readonly Segment[];
  /** Andel av syklusen (0–1) der impulsen starter og når enden av banen */
  from: number;
  to: number;
};

/**
  Keyframes for én lysimpuls som går gjennom en eller flere baner etter hverandre
  (f.eks. inn til kompasset og videre ut). Utenfor tidsrommene er impulsen usynlig.
  unit "px": koordinatene brukes direkte. unit "%": koordinatene deles på box
  (brukes når laget har samme størrelse som SVG-ens viewBox, se positioning-section).
*/
export function pulseKeyframes(name: string, legs: readonly PulseLeg[], opts: { unit?: "px" | "%"; box?: Point; steps?: number; fade?: number } = {}) {
  const { unit = "px", box = [1, 1], steps = 36, fade = 0.12 } = opts;
  const fmt = (x: number, y: number) => (unit === "%" ? `${r1((x / box[0]) * 1000) / 10}%, ${r1((y / box[1]) * 1000) / 10}%` : `${r1(x)}px, ${r1(y)}px`);
  const frames: string[] = [];
  const pct = (n: number) => `${Math.round(n * 100000) / 1000}%`;
  legs.forEach((leg, li) => {
    const path = walk(leg.segments);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = path.at(easeInOut(t) * path.total);
      // Myk inn- og uttoning i hver ende av banen
      const opacity = Math.min(1, t / fade, (1 - t) / fade);
      frames.push(`${pct(leg.from + (leg.to - leg.from) * t)}{transform:translate(${fmt(p.x, p.y)}) rotate(${r1(p.angle)}deg);opacity:${r1(Math.max(opacity, 0) * 100) / 100}}`);
    }
    // Usynlig og i ro fram til neste del (eller resten av syklusen)
    const end = path.at(path.total);
    const next = legs[li + 1]?.from ?? 1;
    if (next > leg.to) frames.push(`${pct(Math.min(leg.to + 0.0001, next))},${pct(next === 1 ? 1 : next - 0.0001)}{transform:translate(${fmt(end.x, end.y)}) rotate(${r1(end.angle)}deg);opacity:0}`);
  });
  if (legs[0].from > 0) {
    const start = walk(legs[0].segments).at(0);
    frames.unshift(`0%,${pct(legs[0].from - 0.0001)}{transform:translate(${fmt(start.x, start.y)}) rotate(${r1(start.angle)}deg);opacity:0}`);
  }
  return `@keyframes ${name}{${frames.join("")}}`;
}
