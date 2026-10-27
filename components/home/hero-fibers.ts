/*
  Fiberbanene i heroen som geometri, i heroens egne piksler.

  Kompasset er knutepunktet: banene inn kommer fra en kant av skjermen og ender i
  kompassets sentrum, banene ut starter i sentrum og går ut over en kant. Siste (eller
  første) stykke av hver bane er en rett linje langs radien, så banen krysser kanten av
  kompass-skiven i nøyaktig den retningen kompassnålen skal peke.

  Banene beregnes ut fra hvor kompasset og teksten faktisk står (målt i nettleseren). Retningen
  er alltid fra venstre, gjennom kompasset og ut til høyre: på PC kommer to baner inn fra venstre
  kant (over og under teksten) og én ned fra toppen, og fire går ut over høyre kant. På mobil
  kommer de inn fra venstre under teksten. Samme kontrollpunkter gir både SVG-banen (d) og
  punktene lyskulene følger, så kulen ligger alltid på streken.
*/

export type Pt = { x: number; y: number };
export type Box = { left: number; top: number; right: number; bottom: number };
export type Layout = {
  /** Heroens bredde og høyde */
  w: number;
  h: number;
  /** Kompassets sentrum og radien til skiven */
  c: Pt;
  r: number;
  /** Teksten (overskrift og knapper), som banene aldri skal krysse */
  copy: Box;
  /** side: teksten til venstre for kompasset (PC/nettbrett). stack: teksten over (mobil). */
  mode: "side" | "stack";
  /** Annen tekst banene skal gå utenom (teksten under kompasset) */
  avoid: Box[];
};

type Edge = "top" | "right" | "bottom" | "left";
export type Tone = "a" | "b" | "c" | "d";

type Spec = {
  id: string;
  kind: "in" | "out";
  tone: Tone;
  main?: boolean;
  /** Retningen fra sentrum til der banen krysser kanten av skiven (grader, med klokka fra nord) */
  bearing: number;
  edge: Edge;
  /** Hvor på kanten banen går ut (x for topp/bunn, y for sidene) */
  at: number;
  /** Hvor langt kontrollpunktene trekkes ut, som andel av avstanden mellom skiven og kanten */
  k1: number;
  k2: number;
  /** Et knutepunkt på banen, som andel av kurven */
  node?: number;
  /** Reservekant hvis banen ikke får plass fra den vanlige kanten (smale skjermer) */
  alt?: { edge: Edge; at: number };
};

export type Fiber = {
  id: string;
  kind: "in" | "out";
  tone: Tone;
  main: boolean;
  d: string;
  /** Kurven uten den rette biten under skiven (til den lyse refleksen) */
  curveD: string;
  length: number;
  /** Buelengden der banen krysser kanten av skiven */
  rimAt: number;
  /** Banens faktiske retning ved kanten, regnet ut fra geometrien (grader fra nord, ut fra sentrum) */
  bearing: number;
  rim: Pt;
  node?: { at: number; p: Pt };
  valid: boolean;
  at: (s: number) => Pt;
};

const OUTSIDE = 34;
const rad = (deg: number) => (deg * Math.PI) / 180;
export const unit = (bearing: number): Pt => ({ x: Math.sin(rad(bearing)), y: -Math.cos(rad(bearing)) });
export const bearingOf = (dx: number, dy: number) => ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
const add = (a: Pt, b: Pt, k = 1): Pt => ({ x: a.x + b.x * k, y: a.y + b.y * k });
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const r1 = (n: number) => Math.round(n * 10) / 10;
const fmt = (p: Pt) => `${r1(p.x)} ${r1(p.y)}`;

/*
  Komposisjonen. Inn fra venstre (og én fra toppen på PC), gjennom kompasset, ut til høyre.
  Hovedbanen (main, med lys refleks) kommer inn under teksten og fortsetter ut mot høyre med en
  liten bøy i kompasset. Ingen to kurver er like.
*/
function specs({ w, h, c, r, copy, mode }: Layout): Spec[] {
  if (mode === "side") {
    const low = copy.bottom + (h - copy.bottom) * 0.55;
    const high = Math.max(24, copy.top * 0.42);
    return [
      { id: "in-1", kind: "in", tone: "b", main: true, bearing: 240, edge: "left", at: low, k1: 0.5, k2: 0.42, alt: { edge: "bottom", at: copy.right * 0.8 } },
      { id: "in-2", kind: "in", tone: "a", bearing: 298, edge: "left", at: high, k1: 0.52, k2: 0.44, node: 0.5, alt: { edge: "top", at: copy.right * 0.85 } },
      { id: "in-3", kind: "in", tone: "c", bearing: 336, edge: "top", at: c.x - r * 1.2 - (c.x - copy.right) * 0.15, k1: 0.42, k2: 0.36 },
      { id: "out-1", kind: "out", tone: "d", bearing: 50, edge: "right", at: c.y * 0.24, k1: 0.44, k2: 0.38 },
      { id: "out-2", kind: "out", tone: "b", main: true, bearing: 84, edge: "right", at: c.y * 0.86, k1: 0.42, k2: 0.4, node: 0.56 },
      { id: "out-3", kind: "out", tone: "c", bearing: 113, edge: "right", at: c.y + (h - c.y) * 0.5, k1: 0.4, k2: 0.38 },
      { id: "out-4", kind: "out", tone: "a", bearing: 140, edge: "right", at: c.y + (h - c.y) * 0.9, k1: 0.42, k2: 0.36, node: 0.52, alt: { edge: "bottom", at: c.x + (w - c.x) * 0.7 } },
    ];
  }
  const above = Math.max(r * 1.6, c.y - copy.bottom);
  const below = Math.max(r * 1.6, h - c.y);
  return [
    { id: "in-1", kind: "in", tone: "b", main: true, bearing: 293, edge: "left", at: c.y - above * 0.56, k1: 0.5, k2: 0.42, node: 0.5 },
    { id: "in-2", kind: "in", tone: "a", bearing: 238, edge: "left", at: c.y + below * 0.5, k1: 0.44, k2: 0.36 },
    { id: "out-1", kind: "out", tone: "d", bearing: 58, edge: "right", at: c.y - above * 0.48, k1: 0.44, k2: 0.4 },
    { id: "out-2", kind: "out", tone: "b", main: true, bearing: 99, edge: "right", at: c.y + below * 0.3, k1: 0.4, k2: 0.38, node: 0.5 },
    { id: "out-3", kind: "out", tone: "c", bearing: 140, edge: "right", at: c.y + below * 0.85, k1: 0.42, k2: 0.34, alt: { edge: "bottom", at: c.x + (w - c.x) * 0.6 } },
  ];
}

function edgePoint(edge: Edge, at: number, w: number, h: number): { p: Pt; inward: Pt } {
  if (edge === "top") return { p: { x: at, y: -OUTSIDE }, inward: { x: 0, y: 1 } };
  if (edge === "bottom") return { p: { x: at, y: h + OUTSIDE }, inward: { x: 0, y: -1 } };
  if (edge === "left") return { p: { x: -OUTSIDE, y: at }, inward: { x: 1, y: 0 } };
  return { p: { x: w + OUTSIDE, y: at }, inward: { x: -1, y: 0 } };
}

type Cubic = readonly [Pt, Pt, Pt, Pt];

function bezier([p0, p1, p2, p3]: Cubic, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

/** Punkter med jevn tetthet langs banen og buelengden fram til hvert punkt. */
function sampler(segments: readonly Cubic[]) {
  const pts: Pt[] = [];
  segments.forEach((seg, i) => {
    for (let k = i === 0 ? 0 : 1; k <= 72; k++) pts.push(bezier(seg, k / 72));
  });
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = len[len.length - 1];
  const at = (s: number): Pt => {
    const target = Math.min(Math.max(s, 0), total);
    let lo = 0, hi = len.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (len[mid] < target) lo = mid;
      else hi = mid;
    }
    const span = len[hi] - len[lo] || 1;
    return lerp(pts[lo], pts[hi], (target - len[lo]) / span);
  };
  return { at, total };
}

const straightLine = (a: Pt, b: Pt): Cubic => [a, lerp(a, b, 1 / 3), lerp(a, b, 2 / 3), b];

function inflate(b: Box, m: number): Box {
  return { left: b.left - m, top: b.top - m, right: b.right + m, bottom: b.bottom + m };
}

/*
  Banene bygges fra oppskriftene over. Krysser en bane teksten, prøves små tilpasninger til den
  går fri, de minste først: enden flyttes litt langs kanten, retningen ut fra kompasset dreies
  opptil 18°, og/eller kurven strammes (lengre rett inn fra kanten, kortere svinger inn mot
  skiven). Hjelper ikke det, prøves reservekanten. Går den fortsatt ikke fri, brukes den ikke.
*/
const SHIFTS = [0, 1, -1, 2, -2, 3, -3];
const TURNS = [0, 6, -6, 12, -12, 18, -18];
const BENDS = [
  { k1: 1, k2: 1, cost: 0 },
  { k1: 1.2, k2: 0.7, cost: 0.4 },
  { k1: 1.35, k2: 0.45, cost: 0.8 },
];
const TRIES = BENDS.flatMap((bend) => SHIFTS.flatMap((shift) => TURNS.map((turn) => ({ shift, turn, bend, cost: Math.abs(shift) / 3 + Math.abs(turn) / 18 + bend.cost })))).sort((a, b) => a.cost - b.cost);

export function buildFibers(layout: Layout): Fiber[] {
  const { w, h } = layout;
  const blocked = [inflate(layout.copy, 16), ...layout.avoid.map((b) => inflate(b, 18))];
  const search = (spec: Spec, edge: Edge, at: number) => {
    const length = edge === "top" || edge === "bottom" ? w : h;
    const step = length * 0.05;
    let fiber: Fiber | null = null;
    for (const { shift, turn, bend } of TRIES) {
      const pos = Math.min(length - 8, Math.max(8, at + shift * step));
      fiber = build(layout, { ...spec, k1: spec.k1 * bend.k1, k2: spec.k2 * bend.k2 }, edge, pos, spec.bearing + turn, blocked);
      if (fiber.valid) return fiber;
    }
    return fiber!;
  };
  return specs(layout).map((spec) => {
    const fiber = search(spec, spec.edge, spec.at);
    if (fiber.valid || !spec.alt) return fiber;
    const backup = search(spec, spec.alt.edge, spec.alt.at);
    return backup.valid ? backup : fiber;
  });
}

function build({ w, h, c, r }: Layout, spec: Spec, side: Edge, edgeAt: number, heading: number, blocked: Box[]): Fiber {
  const u = unit(heading);
  const rim = add(c, u, r);
  const edge = edgePoint(side, edgeAt, w, h);
  const dist = Math.hypot(edge.p.x - rim.x, edge.p.y - rim.y);
  let curve: Cubic;
  let segments: Cubic[];
  let d: string;
  if (spec.kind === "in") {
    curve = [edge.p, add(edge.p, edge.inward, spec.k1 * dist), add(rim, u, spec.k2 * dist), rim];
    segments = [curve, straightLine(rim, c)];
    d = `M ${fmt(curve[0])} C ${fmt(curve[1])}, ${fmt(curve[2])}, ${fmt(curve[3])} L ${fmt(c)}`;
  } else {
    curve = [rim, add(rim, u, spec.k1 * dist), add(edge.p, edge.inward, spec.k2 * dist), edge.p];
    segments = [straightLine(c, rim), curve];
    d = `M ${fmt(c)} L ${fmt(rim)} C ${fmt(curve[1])}, ${fmt(curve[2])}, ${fmt(curve[3])}`;
  }
  const curveD = `M ${fmt(curve[0])} C ${fmt(curve[1])}, ${fmt(curve[2])}, ${fmt(curve[3])}`;
  const { at, total } = sampler(segments);
  const rimAt = spec.kind === "in" ? total - r : r;

  // Retningen ved kanten av skiven, målt på selve banen (ut fra sentrum)
  const before = at(rimAt - 1.5);
  const after = at(rimAt + 1.5);
  const bearing = spec.kind === "out" ? bearingOf(after.x - before.x, after.y - before.y) : bearingOf(before.x - after.x, before.y - after.y);

  // En bane er gyldig når den synlige delen holder seg unna teksten og skiven ligger inne i heroen
  let valid = rim.x > 0 && rim.x < w && rim.y > 0 && rim.y < h;
  for (let s = 0; valid && s <= total; s += 6) {
    const p = at(s);
    const visible = p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h;
    if (visible && blocked.some((b) => p.x > b.left && p.x < b.right && p.y > b.top && p.y < b.bottom)) valid = false;
  }

  let node: Fiber["node"];
  if (spec.node !== undefined) {
    const s = spec.kind === "in" ? spec.node * rimAt : r + spec.node * (total - r);
    node = { at: s, p: at(s) };
  }
  return { id: spec.id, kind: spec.kind, tone: spec.tone, main: !!spec.main, d, curveD, length: total, rimAt, bearing, rim, node, valid, at };
}
