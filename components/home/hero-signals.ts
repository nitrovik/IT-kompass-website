/*
  Kompass- og fibertegningen i heroen, som data (koordinater fra designet, viewBox 700 × 520).

  Designet flyttet lyssignalene med offset-path på SVG-sirkler, som tegner hele SVG-en på nytt
  i hvert bilde. Her regnes banene om til transform-keyframes når siden bygges: hvert signal er
  et eget lag som skjermkortet flytter alene, langs nøyaktig samme bane og med samme tempo
  (jevn fart langs banen, 7,5 s per runde, inn- og uttoning i hver ende).
*/

type Point = readonly [number, number];
type Segment = readonly [Point, Point, Point, Point];

export const VIEW = { w: 700, h: 520 } as const;

/** Fibrene, i tegnerekkefølge. tone gir fargen (.fiber-a … .fiber-d i globals.css). */
export const FIBERS = [
  { tone: "a", d: "M15 98C135 98 148 204 251 218S380 117 464 137S568 197 683 65" },
  { tone: "b", d: "M16 174C129 174 168 250 255 250S359 149 440 191S550 300 687 280" },
  { tone: "c", d: "M17 412C129 412 160 319 251 317S367 395 445 322S552 222 686 230" },
  { tone: "a", d: "M42 470C151 470 177 354 260 345S361 371 427 302S526 124 658 111" },
  { tone: "b", d: "M28 52C139 52 178 177 254 202S357 250 427 244S533 371 685 412" },
  { tone: "d", d: "M14 304C118 304 154 239 239 239S358 328 430 350S548 423 683 424" },
  { tone: "c", d: "M75 22C160 22 184 142 257 180S360 207 423 170S529 75 646 53" },
] as const;

/** Den lyse refleksen langs første del av hovedfiberen. */
export const HIGHLIGHT = "M16 174C129 174 168 250 255 250S359 149 440 191";

export const NODES: readonly Point[] = [[251, 218], [464, 137], [445, 322], [257, 180]];

/** Lyssignalene: radius og banen de følger (samme som tre av fibrene). Forsinkelsene står i globals.css. */
export const SIGNALS = [
  { r: 4, d: "M 16 174 C 129 174 168 250 255 250 S 359 149 440 191 S 550 300 687 280" },
  { r: 3.6, d: "M 17 412 C 129 412 160 319 251 317 S 367 395 445 322 S 552 222 686 230" },
  { r: 3.4, d: "M 28 52 C 139 52 178 177 254 202 S 357 250 427 244 S 533 371 685 412" },
] as const;

/** Leser banene (bare absolutte M, C og S, slik designet bruker dem) som kubiske Bézier-segmenter. */
function parse(d: string): Segment[] {
  const tokens = d.match(/[MCS]|-?\d*\.?\d+/g) ?? [];
  const segments: Segment[] = [];
  let i = 0;
  let command = "";
  let current: Point = [0, 0];
  let lastControl: Point | null = null;
  const point = (): Point => [Number(tokens[i++]), Number(tokens[i++])];
  while (i < tokens.length) {
    if (/[MCS]/.test(tokens[i])) command = tokens[i++];
    if (command === "M") {
      current = point();
      lastControl = null;
      continue;
    }
    // S speiler forrige kontrollpunkt rundt startpunktet
    const c1: Point = command === "C" ? point() : lastControl ? [2 * current[0] - lastControl[0], 2 * current[1] - lastControl[1]] : current;
    const c2 = point();
    const end = point();
    segments.push([current, c1, c2, end]);
    lastControl = c2;
    current = end;
  }
  return segments;
}

function bezier([p0, p1, p2, p3]: Segment, t: number): Point {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/** Punkt på banen etter en gitt andel av lengden (0–1), som offset-distance i prosent. */
function walk(segments: readonly Segment[]) {
  const dense: Point[] = [];
  segments.forEach((segment, i) => {
    for (let s = i === 0 ? 0 : 1; s <= 120; s++) dense.push(bezier(segment, s / 120));
  });
  const lengths = [0];
  for (let i = 1; i < dense.length; i++) lengths.push(lengths[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = lengths[lengths.length - 1];
  return (share: number): Point => {
    const target = Math.min(Math.max(share, 0), 1) * total;
    let i = 1;
    while (i < lengths.length - 1 && lengths[i] < target) i++;
    const f = (target - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1);
    return [dense[i - 1][0] + (dense[i][0] - dense[i - 1][0]) * f, dense[i - 1][1] + (dense[i][1] - dense[i - 1][1]) * f];
  };
}

const round = (n: number, digits: number) => Math.round(n * 10 ** digits) / 10 ** digits;

// Jevne steg langs banen, pluss knekkpunktene i designets opacity (8 % og 88 %)
const STEPS = 64;
const TIMES = [...new Set([...Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS), 0.08, 0.88])].sort((a, b) => a - b);
const opacityAt = (t: number) => (t < 0.08 ? t / 0.08 : t > 0.88 ? (1 - t) / 0.12 : 1);

/** Keyframes hero-signal-1 … 3 (lastes som /motion.css, se components/home/motion-css.ts). */
export const HERO_SIGNAL_CSS = SIGNALS.map((signal, i) => {
  const at = walk(parse(signal.d));
  const frames = TIMES.map((t) => {
    const [x, y] = at(t);
    return `${round(t * 100, 3)}%{transform:translate(${round((x / VIEW.w) * 100, 2)}%,${round((y / VIEW.h) * 100, 2)}%);opacity:${round(opacityAt(t), 3)}}`;
  });
  return `@keyframes hero-signal-${i + 1}{${frames.join("")}}`;
}).join("");
