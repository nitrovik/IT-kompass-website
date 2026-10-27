/*
  Fiberbanene i heroen som geometri, i heroens egne piksler.

  Kompasset er knutepunktet: banene inn kommer fra en kant av skjermen og ender i
  kompassets sentrum, banene ut starter i sentrum og går ut over en kant. Siste (eller
  første) stykke av hver bane er en rett linje langs radien, så banen krysser kanten av
  kompass-skiven i nøyaktig den retningen kompassnålen skal peke.

  Banene beregnes ut fra hvor kompasset og teksten faktisk står (målt i nettleseren), og
  komposisjonen byttes etter skjermen: på PC kommer signalene ned fra toppen og går ut mot
  høyre og ned, på mobil kommer de inn fra venstre under teksten. Samme kontrollpunkter gir
  både SVG-banen (d) og punktene lyskulene følger, så kulen ligger alltid på streken.
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

/* Komposisjonen: PC fra taket og ut til høyre, mobil fra venstre og ut til høyre. Ingen to kurver er like. */
function specs({ w, h, c, r, copy, mode }: Layout): Spec[] {
  if (mode === "side") {
    const left = copy.right + 36;
    const gap = Math.max(48, c.x - r - left);
    return [
      { id: "in-1", kind: "in", tone: "a", bearing: 284, edge: "top", at: left + gap * 0.06, k1: 0.54, k2: 0.48, node: 0.44 },
      { id: "in-2", kind: "in", tone: "b", main: true, bearing: 315, edge: "top", at: left + gap * 0.5, k1: 0.46, k2: 0.4 },
      { id: "in-3", kind: "in", tone: "c", bearing: 344, edge: "top", at: c.x - r * 0.1, k1: 0.4, k2: 0.34 },
      { id: "out-1", kind: "out", tone: "d", bearing: 48, edge: "top", at: c.x + (w - c.x) * 0.6, k1: 0.44, k2: 0.36 },
      { id: "out-2", kind: "out", tone: "b", main: true, bearing: 83, edge: "right", at: c.y * 0.6, k1: 0.42, k2: 0.4, node: 0.56 },
      { id: "out-3", kind: "out", tone: "c", bearing: 113, edge: "right", at: c.y + (h - c.y) * 0.44, k1: 0.4, k2: 0.38 },
      { id: "out-4", kind: "out", tone: "a", bearing: 146, edge: "bottom", at: c.x + (w - c.x) * 0.66, k1: 0.42, k2: 0.36, node: 0.52 },
    ];
  }
  const above = Math.max(r * 1.6, c.y - copy.bottom);
  const below = Math.max(r * 1.6, h - c.y);
  return [
    { id: "in-1", kind: "in", tone: "b", main: true, bearing: 293, edge: "left", at: c.y - above * 0.56, k1: 0.5, k2: 0.42, node: 0.5 },
    { id: "in-2", kind: "in", tone: "a", bearing: 238, edge: "left", at: c.y + below * 0.5, k1: 0.44, k2: 0.36 },
    { id: "out-1", kind: "out", tone: "d", bearing: 58, edge: "right", at: c.y - above * 0.48, k1: 0.44, k2: 0.4 },
    { id: "out-2", kind: "out", tone: "b", main: true, bearing: 99, edge: "right", at: c.y + below * 0.3, k1: 0.4, k2: 0.38, node: 0.5 },
    { id: "out-3", kind: "out", tone: "c", bearing: 149, edge: "bottom", at: c.x + (w - c.x) * 0.42, k1: 0.42, k2: 0.34 },
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
  Banene bygges fra oppskriftene over. Krysser en bane teksten, prøves små tilpasninger i denne
  rekkefølgen til den går fri: enden flyttes langs kanten bort fra kompasset (mot hjørnet), så
  dreies retningen ut fra kompasset litt mot den samme siden, og til slutt går enden rundt
  hjørnet til sidekanten. Går den ikke fri, blir den ikke brukt.
*/
export function buildFibers(layout: Layout): Fiber[] {
  const { w, h, c } = layout;
  const blocked = [inflate(layout.copy, 16), ...layout.avoid.map((b) => inflate(b, 18))];
  return specs(layout).map((spec) => {
    const along = spec.edge === "top" || spec.edge === "bottom";
    const corner = along ? (spec.at >= c.x ? w : 0) : spec.at >= c.y ? h : 0;
    // Retningen mot hjørnets side: øst/vest for topp og bunn, sør/nord for sidekantene
    const away = along ? (corner === w ? 90 : 270) : corner === h ? 180 : 0;
    const tries: [Edge, number, number][] = [];
    for (const turn of [0, 6, 12, 18]) {
      const delta = ((away - spec.bearing + 540) % 360) - 180;
      const bearing = spec.bearing + Math.sign(delta) * Math.min(Math.abs(delta), turn);
      for (const f of [0, 0.3, 0.6, 0.9]) tries.push([spec.edge, spec.at + (corner - spec.at) * f, bearing]);
    }
    if (along) {
      const side: Edge = corner === w ? "right" : "left";
      for (const g of [0.12, 0.3]) tries.push([side, spec.edge === "bottom" ? h - (h - c.y) * g : c.y * g, spec.bearing]);
    }
    let fiber = build(layout, spec, ...tries[0], blocked);
    for (const attempt of tries.slice(1)) {
      if (fiber.valid) break;
      fiber = build(layout, spec, ...attempt, blocked);
    }
    return fiber;
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
