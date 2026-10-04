/*
  Fiberscenen i heroen – en liten WebGL-renderer uten eksterne biblioteker.

  Hvordan den virker:
  - Hver fiber er en glatt kurve (Catmull-Rom) i tre dimensjoner. Kurvene lages én gang
    (og på nytt ved endret størrelse) og ligger i ett felles buffer → ett tegnekall for
    alle fibre og ett for nettverkspunktene.
  - Tre dybdelag (bakgrunn, midt, forgrunn) med ekte perspektiv: z-verdien skalerer
    bredde og posisjon, og musen flytter «kameraet» litt slik at lagene glir mot hverandre.
  - Fiberkroppen tegnes som et glassrør (mørkere kanter, lys kjerne, lysrefleks på én side).
  - Lyspulsene regnes ut i fragment-shaderen fra tid, fart og et frø per fiber: tre pulser
    per fiber med ulik fart, hale og styrke, enkelte kraftigere impulser, og noen fibre
    som nesten er stille. Ingen tilfeldig blinking – alt er deterministisk og flytende.
  - Musen skyver fibre svakt unna, forsterker lyset i nærheten og vipper perspektivet.
  - Adaptiv kvalitet: måler bildetiden og går ned i oppløsning/antall fibre, eller stopper
    animasjonen, hvis enheten ikke klarer det.
*/

export type FiberTier = "high" | "medium";

export type FiberSceneOptions = {
  tier: FiberTier;
  animate: boolean;
  /** Tillat WebGL selv om nettleseren bare kan tegne i programvare (kun for testing). */
  allowSoftware?: boolean;
  onReady?: () => void;
  onDegrade?: (reason: "slow" | "context-lost") => void;
};

export type FiberScene = {
  resize: () => void;
  setPointer: (x: number, y: number, active: boolean) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
};

// ---------------------------------------------------------------------------
// Delte GLSL-funksjoner (perspektiv, bølgebevegelse, musefrastøtning)
// ---------------------------------------------------------------------------

const COMMON = /* glsl */ `
precision highp float;
uniform vec2 u_res;      // lerretets størrelse i CSS-piksler
uniform float u_dpr;
uniform float u_time;
uniform vec2 u_cam;      // kameraforskyvning (px), styrt av musen
uniform vec3 u_pointer;  // musens posisjon (px fra sentrum) + aktiv 0..1
uniform float u_wide;    // 1 = bred layout (tekst til venstre), 0 = smal (tekst øverst)
const float FOCAL = 1400.0;

vec3 sway(vec3 p, float u, float seed, float amp) {
  float t = u_time;
  p.y += sin(u * 9.0 + t * 0.32 + seed * 20.0) * amp;
  p.x += cos(u * 6.5 + t * 0.24 + seed * 11.0) * amp * 0.45;
  p.z += sin(u * 4.5 + t * 0.19 + seed * 7.0) * amp * 2.2;
  return p;
}

vec2 project(vec3 p, out float s) {
  s = FOCAL / (FOCAL - p.z);
  return (p.xy - u_cam) * s + u_cam;
}

vec2 repel(vec2 sp, float layer, out float glow) {
  vec2 d = sp - u_pointer.xy;
  float r = mix(150.0, 210.0, layer * 0.5);
  float f = exp(-dot(d, d) / (r * r)) * u_pointer.z;
  glow = f;
  float strength = mix(5.0, 18.0, layer * 0.5);
  return sp + normalize(d + vec2(0.0001)) * f * strength;
}

// Demper fibre bak teksten, så lesbarheten aldri lider.
float textMask(vec2 sp) {
  vec2 f = sp / u_res + 0.5;
  float wide = mix(0.22, 1.0, smoothstep(0.24, 0.62, f.x));
  float narrow = mix(0.32, 1.0, smoothstep(0.3, 0.78, f.y)) * mix(0.75, 1.0, smoothstep(0.2, 0.7, f.x));
  return mix(narrow, wide, u_wide);
}
`;

const FIBER_VS = /* glsl */ `
${COMMON}
attribute vec3 a_pos;
attribute vec3 a_prev;
attribute vec3 a_next;
attribute vec3 a_uv;     // u langs fiberen, side (-1/+1), bølgeamplitude
attribute vec4 a_fiber;  // kjerneradius (px), glorie-faktor, lag (0/1/2), frø
attribute vec4 a_anim;   // fart (u/s), aktivitet, lengde (px), lysstyrke

varying vec3 v_uv;
varying vec4 v_fiber;
varying vec4 v_anim;
varying float v_glow;
varying float v_mask;
varying float v_corePx;

void main() {
  float seed = a_fiber.w;
  float layer = a_fiber.z;
  float s, sPrev, sNext, g, gPrev, gNext;
  vec2 sp = repel(project(sway(a_pos, a_uv.x, seed, a_uv.z), s), layer, g);
  vec2 spPrev = repel(project(sway(a_prev, a_uv.x, seed, a_uv.z), sPrev), layer, gPrev);
  vec2 spNext = repel(project(sway(a_next, a_uv.x, seed, a_uv.z), sNext), layer, gNext);

  vec2 dir = spNext - spPrev;
  dir = length(dir) < 0.0001 ? vec2(1.0, 0.0) : normalize(dir);
  vec2 normal = vec2(-dir.y, dir.x);

  float core = max(a_fiber.x * s, 0.35);
  float halfWidth = core * a_fiber.y + 1.0;
  vec2 pos = sp + normal * a_uv.y * halfWidth;

  v_uv = vec3(a_uv.x, a_uv.y * halfWidth / core, a_uv.z);
  v_fiber = a_fiber;
  v_anim = a_anim;
  v_glow = g;
  v_mask = textMask(sp);
  v_corePx = core * u_dpr;
  gl_Position = vec4(pos.x / (u_res.x * 0.5), -pos.y / (u_res.y * 0.5), 0.0, 1.0);
}
`;

const FIBER_FS = /* glsl */ `
precision highp float;
uniform float u_time;
uniform float u_reveal;   // sekunder siden start (tegner fibrene inn fra venstre)
uniform float u_energy;   // 0..1, pulsene tones inn etter innføringen

varying vec3 v_uv;
varying vec4 v_fiber;
varying vec4 v_anim;
varying float v_glow;
varying float v_mask;
varying float v_corePx;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  float u = v_uv.x;
  float s = v_uv.y;               // på tvers, målt i kjerneradier
  float a = abs(s);
  float halo = v_fiber.y;
  float layer = v_fiber.z;
  float seed = v_fiber.w;
  float len = v_anim.z;
  float layerA = layer < 0.5 ? 0.3 : (layer < 1.5 ? 0.8 : 1.0);

  // Glassrøret
  float e = clamp(1.0 / max(v_corePx, 0.5), 0.04, 1.0);
  if (layer < 0.5) e = max(e, 0.9);                        // bakgrunnen er uskarp, som ute av fokus
  float coverage = clamp(v_corePx, 0.25, 1.0);
  float body = (1.0 - smoothstep(1.0 - e, 1.0 + e, a)) * coverage;
  float edge = smoothstep(0.3, 1.0, a);
  vec3 bodyCol = mix(vec3(0.82, 0.91, 1.0), vec3(0.16, 0.36, 0.60), edge);
  float bodyA = body * mix(0.16, 0.58, edge) * layerA;
  vec3 rgb = bodyCol * bodyA;
  float alpha = bodyA;

  float sk = (s + 0.42) / 0.22;
  float spec = body * exp(-sk * sk) * 0.7 * layerA * step(1.5, v_corePx);
  rgb += vec3(spec);
  alpha += spec * 0.35;

  // Lyspulser
  float pulses = 0.0;
  float hot = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float h1 = hash(seed * 17.0 + fi * 3.1);
    float h2 = hash(seed * 31.0 + fi * 7.3);
    float speed = v_anim.x * (0.7 + 0.6 * h1);
    float period = 1.3 + 1.7 * h2;
    float phase = u_time * speed + h1 * period;
    float cycle = floor(phase / period);
    float head = mod(phase, period) - 0.15;
    float d = (u - head) * len;
    float on = step(1.0 - v_anim.y, hash(seed * 13.0 + fi * 5.0 + cycle * 1.37));
    float strong = step(0.8, hash(seed * 7.0 + fi + cycle * 2.11));
    float tail = mix(50.0, 170.0, h2) * (1.0 + strong * 0.9);
    float p = d <= 0.0 ? exp(d / tail) : exp(-d * d / 180.0);
    float boost = (0.6 + 0.4 * h1) * (1.0 + strong * 1.5);
    pulses += p * on * boost;
    hot += (d <= 0.0 ? exp(d / (tail * 0.16)) : exp(-d * d / 40.0)) * on * boost;
  }
  pulses *= v_anim.w * u_energy;
  hot *= v_anim.w * u_energy;

  // Glorie rundt pulsen (elektrisk blå) og hvitglødende kjerne
  float haloProfile = exp(-a * a / (halo * halo * 0.11));
  float haloI = clamp(haloProfile * pulses * 0.42 * layerA, 0.0, 0.85);
  rgb += vec3(0.03, 0.44, 1.0) * haloI;
  alpha += haloI;

  float coreProfile = exp(-a * a * 1.3);
  float coreI = coreProfile * (pulses * 0.55 + hot * 1.2) * layerA;
  vec3 coreCol = mix(vec3(0.30, 0.70, 1.0), vec3(1.0), clamp(hot * 0.7, 0.0, 1.0));
  rgb += coreCol * coreI;
  alpha += coreI * 0.6;

  // Musen lyser opp fibrene i nærheten
  float glowI = haloProfile * v_glow * 0.22 * layerA;
  rgb += vec3(0.05, 0.45, 1.0) * glowI;
  alpha += glowI;

  // Innføring: fibrene tegnes fra venstre mot høyre
  float delay = layer < 0.5 ? 0.0 : (layer < 1.5 ? 0.25 : 0.45);
  float reveal = smoothstep(0.0, 0.18, u_reveal * 0.8 - delay - hash(seed) * 0.3 - u);

  float k = v_mask * reveal;
  gl_FragColor = vec4(rgb, min(alpha, 1.0)) * k;
}
`;

const NODE_VS = /* glsl */ `
${COMMON}
attribute vec3 a_pos;
attribute vec4 a_info;   // u, frø, bølgeamplitude, lag
attribute vec4 a_node;   // størrelse (px), fase, fart, lysstyrke
varying vec4 v_node;
varying float v_mask;
varying float v_glow;
varying float v_layer;
void main() {
  float s, g;
  vec2 sp = repel(project(sway(a_pos, a_info.x, a_info.y, a_info.z), s), a_info.w, g);
  v_node = a_node;
  v_mask = textMask(sp);
  v_glow = g;
  v_layer = a_info.w;
  gl_PointSize = a_node.x * s * u_dpr * 4.0;
  gl_Position = vec4(sp.x / (u_res.x * 0.5), -sp.y / (u_res.y * 0.5), 0.0, 1.0);
}
`;

const NODE_FS = /* glsl */ `
precision highp float;
uniform float u_time;
uniform float u_energy;
varying vec4 v_node;
varying float v_mask;
varying float v_glow;
varying float v_layer;
void main() {
  float r = length(gl_PointCoord - 0.5) * 4.0;   // 1.0 = nodens radius
  float beat = 0.5 + 0.5 * sin(u_time * v_node.z + v_node.y);
  beat = pow(beat, 3.0);
  float layerA = v_layer < 0.5 ? 0.45 : (v_layer < 1.5 ? 0.8 : 1.0);
  float dot = 1.0 - smoothstep(0.55, 0.75, r);
  float rk = (r - 1.15) / 0.12;
  float ring = exp(-rk * rk) * 0.55;
  float glow = exp(-r * r * 0.9) * (0.25 + 0.75 * beat) * u_energy;
  vec3 rgb = vec3(0.0);
  float alpha = 0.0;
  // mørk kjerne med lys midte – som et koblingspunkt
  float dotA = dot * 0.85 * layerA;
  rgb += mix(vec3(0.10, 0.36, 0.66), vec3(1.0), 0.25 + 0.55 * beat) * dotA;
  alpha += dotA;
  float ringA = ring * layerA * (0.6 + 0.4 * v_glow);
  rgb += vec3(0.10, 0.45, 0.85) * ringA;
  alpha += ringA;
  float glowA = glow * 0.35 * v_node.w * layerA;
  rgb += vec3(0.05, 0.50, 1.0) * glowA;
  alpha += glowA;
  gl_FragColor = vec4(rgb, min(alpha, 1.0)) * v_mask;
}
`;

// ---------------------------------------------------------------------------
// Geometri
// ---------------------------------------------------------------------------

type Vec3 = [number, number, number];

type FiberDef = {
  points: Vec3[];
  core: number;      // kjerneradius i px
  halo: number;      // gloriebredde i kjerneradier
  layer: 0 | 1 | 2;
  speedPx: number;   // pulsfart i px/s
  activity: number;  // 0..1 – hvor ofte det går pulser
  brightness: number;
  sway: number;      // bølgeamplitude i px
  pinch?: Vec3;      // punkt der bølgen dempes (kompasset)
  nodes?: number[];  // u-posisjoner for nettverkspunkter
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function catmullRom(points: Vec3[], samples: number): Vec3[] {
  const out: Vec3[] = [];
  const n = points.length - 1;
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * n;
    const seg = Math.min(Math.floor(t), n - 1);
    const lt = t - seg;
    const p0 = points[Math.max(seg - 1, 0)];
    const p1 = points[seg];
    const p2 = points[seg + 1];
    const p3 = points[Math.min(seg + 2, n)];
    const t2 = lt * lt;
    const t3 = t2 * lt;
    const v: Vec3 = [0, 0, 0];
    for (let k = 0; k < 3; k++) {
      v[k] = 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * lt + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
    }
    out.push(v);
  }
  return out;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

/*
  Komposisjonen. Koordinater i CSS-piksler med origo i midten av lerretet (y nedover).
  Bred layout: fibrene samles i et punkt på høyre side der kompasset står (70 %, 46 %).
  Smal layout: fibrene feier fra nede til venstre mot oppe til høyre bak/under teksten.
*/
export const HUB = { x: 0.7, y: 0.46 };
// På 1024–1279 px står kompasset litt lenger til høyre, så det aldri kommer for nær teksten
export const hubX = (width: number) => (width < 1280 ? 0.75 : HUB.x);

function compose(W: number, H: number, tier: FiberTier): FiberDef[] {
  const rnd = mulberry32(1937);
  const r = (a: number, b: number) => a + (b - a) * rnd();
  const wide = W >= 1024;
  const fibers: FiberDef[] = [];
  const dense = tier === "high" ? 1 : 0.55;

  const hub: Vec3 = wide ? [W * (hubX(W) - 0.5), H * (HUB.y - 0.5), 0] : [W * 0.46, H * 0.12, 0];

  // Bakgrunn: mange tynne, uskarpe fibre som fyller hele flaten
  const bgCount = Math.round((wide ? 28 : 16) * dense);
  for (let i = 0; i < bgCount; i++) {
    const t = i / (bgCount - 1);
    const z = r(-650, -320);
    const spread = FOCAL_INV(z);
    const y0 = (r(0.15, 0.85) * H) * spread;
    const y1 = (r(-0.85, -0.05) * H) * spread;
    const x0 = -W * 0.75 * spread;
    const x1 = W * 0.75 * spread;
    const wobble = r(-0.25, 0.25) * H * spread;
    const pts: Vec3[] = [
      [x0, y0 * 0.6 + (t - 0.5) * H * 0.4 * spread, z],
      [x0 * 0.35, lerp(y0, y1, 0.3) + wobble, z + r(-40, 40)],
      [x1 * 0.2, lerp(y0, y1, 0.62) - wobble * 0.6, z + r(-40, 40)],
      [x1, y1 * 0.6 + (t - 0.5) * H * 0.4 * spread, z],
    ];
    fibers.push({ points: pts, core: r(0.7, 1.3), halo: 6, layer: 0, speedPx: r(55, 120), activity: r(0.25, 0.7), brightness: r(0.5, 0.9), sway: r(6, 12), nodes: rnd() > 0.72 ? [r(0.3, 0.7)] : undefined });
  }

  // Midt: hovednettverket – samles i kompasset
  const trunk = Math.round((wide ? 15 : 11) * (tier === "high" ? 1 : 0.8));
  for (let i = 0; i < trunk; i++) {
    const t = trunk > 1 ? i / (trunk - 1) - 0.5 : 0;
    const zStart = r(-140, 120);
    const zEnd = r(-160, 140);
    const pinchSpread = wide ? 9 : 26;
    const start: Vec3 = wide ? [-W * 0.62, H * (0.62 + t * 0.55), zStart] : [-W * 0.75, H * (0.5 + t * 0.35), zStart];
    const end: Vec3 = wide ? [W * 0.74, -H * (0.36 - t * 0.62) + r(-24, 24), zEnd] : [W * 0.9, H * (0.02 + t * 0.5), zEnd];
    const pinch: Vec3 = [hub[0] + t * pinchSpread * 0.6, hub[1] + t * pinchSpread, t * 24];
    const pts: Vec3[] = [
      start,
      [lerp(start[0], hub[0], 0.42), hub[1] + H * (0.24 + t * 0.32), lerp(zStart, 0, 0.4)],
      [hub[0] - W * 0.11, hub[1] + H * (0.05 + t * 0.06), lerp(zStart, 0, 0.8)],
      pinch,
      [hub[0] + W * 0.09, hub[1] - H * (0.03 - t * 0.07), lerp(0, zEnd, 0.3)],
      [lerp(hub[0], end[0], 0.6), lerp(hub[1], end[1], 0.62) + t * H * 0.06, lerp(0, zEnd, 0.7)],
      end,
    ];
    const quiet = rnd() < 0.18;
    fibers.push({
      points: pts, core: r(1.3, 2.1), halo: 7, layer: 1,
      speedPx: quiet ? r(40, 70) : r(130, 280), activity: quiet ? 0.12 : r(0.55, 0.95), brightness: r(0.75, 1.1),
      sway: r(5, 9), pinch, nodes: rnd() > 0.55 ? [r(0.12, 0.3), r(0.72, 0.9)] : [r(0.15, 0.35)],
    });
  }

  if (wide) {
    // Kryssende fibre gjennom kompasset (ovenfra og ned mot høyre)
    for (let i = 0; i < 3; i++) {
      const t = i / 2 - 0.5;
      const pinch: Vec3 = [hub[0] + t * 8, hub[1] - t * 6, 10];
      const pts: Vec3[] = [
        [hub[0] - W * (0.42 - t * 0.1), -H * 0.6, r(-120, 0)],
        [hub[0] - W * 0.13, hub[1] - H * (0.16 + t * 0.05), r(-60, 20)],
        pinch,
        [hub[0] + W * 0.12, hub[1] + H * (0.12 + t * 0.05), r(0, 80)],
        [W * 0.72, H * (0.42 + t * 0.2), r(-40, 120)],
      ];
      fibers.push({ points: pts, core: r(1.1, 1.6), halo: 7, layer: 1, speedPx: r(90, 190), activity: r(0.4, 0.8), brightness: r(0.6, 0.9), sway: r(4, 8), pinch });
    }
    // Frie buer på høyre side som ikke går gjennom kompasset
    for (let i = 0; i < 5; i++) {
      const y = H * r(0.15, 0.62);
      const pts: Vec3[] = [
        [W * r(-0.05, 0.12), H * 0.62, r(-200, -60)],
        [W * r(0.12, 0.22), y, r(-160, -40)],
        [W * r(0.3, 0.4), y - H * r(0.25, 0.45), r(-160, 0)],
        [W * 0.62, -H * r(0.05, 0.5), r(-200, -40)],
      ];
      fibers.push({ points: pts, core: r(0.9, 1.4), halo: 7, layer: 1, speedPx: r(80, 200), activity: r(0.3, 0.75), brightness: r(0.55, 0.85), sway: r(6, 10), nodes: [r(0.3, 0.7)] });
    }
  }

  // Forgrunn: få, tykke og tydelige fibre med sterkere lys
  const fg = wide ? 4 : 2;
  for (let i = 0; i < fg; i++) {
    const z = r(140, 260);
    const s = FOCAL_INV(z);
    const pts: Vec3[] = wide
      ? [
          [W * r(-0.15, 0.1) * s, H * 0.65 * s, z],
          [hub[0] * s - W * r(0.06, 0.14) * s, hub[1] * s + H * r(0.14, 0.3) * s, z + r(-30, 30)],
          [hub[0] * s + W * r(0.04, 0.12) * s, hub[1] * s - H * r(-0.02, 0.16) * s, z + r(-30, 30)],
          [W * 0.68 * s, -H * r(0.1, 0.6) * s, z],
        ]
      : [
          [-W * 0.65, H * r(0.45, 0.62), z],
          [-W * 0.1, H * r(0.3, 0.5), z],
          [W * 0.3, H * r(0.05, 0.25), z],
          [W * 0.7, -H * r(0.0, 0.2), z],
        ];
    fibers.push({ points: pts, core: r(2.6, 3.8), halo: 6, layer: 2, speedPx: r(220, 380), activity: r(0.55, 0.9), brightness: 1.15, sway: r(8, 14), nodes: rnd() > 0.5 ? [r(0.25, 0.75)] : undefined });
  }

  return fibers;

  function FOCAL_INV(z: number) { return (FOCAL - z) / FOCAL; }
  function lerp(a: number, b: number, k: number) { return a + (b - a) * k; }
}

const FOCAL = 1400;

type Built = { vertices: Float32Array; indices: Uint16Array | Uint32Array; nodes: Float32Array; nodeCount: number };

function build(fibers: FiberDef[], samples: number): Built {
  const floatsPerVertex = 20;
  const sampledAll = fibers.map((fiber) => catmullRom(fiber.points, samples));
  const vertexCount = sampledAll.reduce((sum, pts) => sum + pts.length * 2, 0);
  const vertices = new Float32Array(vertexCount * floatsPerVertex);
  const IndexArray = vertexCount > 65535 ? Uint32Array : Uint16Array;
  const indices = new IndexArray(sampledAll.reduce((sum, pts) => sum + (pts.length - 1) * 6, 0));
  const nodeData: number[] = [];

  let v = 0;
  let idx = 0;
  let base = 0;
  fibers.forEach((fiber, f) => {
    const pts = sampledAll[f];
    // Buelengde → u, så pulsene får jevn fart
    const lengths = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0];
      const dy = pts[i][1] - pts[i - 1][1];
      const dz = pts[i][2] - pts[i - 1][2];
      lengths.push(lengths[i - 1] + Math.hypot(dx, dy, dz));
    }
    const total = lengths[lengths.length - 1] || 1;
    const seed = (f * 0.61803398875) % 1;
    const speedU = fiber.speedPx / total;

    const swayAt = (p: Vec3) => {
      if (!fiber.pinch) return fiber.sway;
      const d = Math.hypot(p[0] - fiber.pinch[0], p[1] - fiber.pinch[1]);
      return fiber.sway * smoothstep(18, 260, d);
    };

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const prev = pts[Math.max(i - 1, 0)];
      const next = pts[Math.min(i + 1, pts.length - 1)];
      const u = lengths[i] / total;
      const amp = swayAt(p);
      for (const side of [-1, 1]) {
        vertices.set([p[0], p[1], p[2], prev[0], prev[1], prev[2], next[0], next[1], next[2], u, side, amp, fiber.core, fiber.halo, fiber.layer, seed, speedU, fiber.activity, total, fiber.brightness], v);
        v += floatsPerVertex;
      }
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const a = base + i * 2;
      indices[idx++] = a; indices[idx++] = a + 1; indices[idx++] = a + 2;
      indices[idx++] = a + 1; indices[idx++] = a + 3; indices[idx++] = a + 2;
    }
    base += pts.length * 2;

    for (const nu of fiber.nodes ?? []) {
      const i = Math.round(nu * (pts.length - 1));
      const p = pts[i];
      const size = fiber.layer === 0 ? 2.2 : fiber.layer === 1 ? 3.4 : 5;
      nodeData.push(p[0], p[1], p[2], lengths[i] / total, seed, swayAt(p), fiber.layer, size, f * 1.7, 0.8 + (f % 5) * 0.25, fiber.brightness);
    }
  });

  return { vertices, indices, nodes: new Float32Array(nodeData), nodeCount: nodeData.length / 11 };
}

// ---------------------------------------------------------------------------
// WebGL
// ---------------------------------------------------------------------------

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Fiber shader: ${log}`);
  }
  return shader;
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram();
  if (!p) throw new Error("program");
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`Fiber program: ${gl.getProgramInfoLog(p)}`);
  return p;
}

/* Programvaretegning (ingen skjermkort) gjør en kontinuerlig scene for tung for prosessoren. */
function isSoftwareRenderer(gl: WebGLRenderingContext) {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

export function createFiberScene(canvas: HTMLCanvasElement, options: FiberSceneOptions): FiberScene | null {
  let tier = options.tier;
  // failIfMajorPerformanceCaveat: uten skjermkort (programvaretegning) får vi ingen kontekst,
  // og det statiske SVG-bildet blir stående i stedet for å belaste prosessoren.
  const context = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: tier === "high", depth: false, stencil: false, powerPreference: "high-performance", failIfMajorPerformanceCaveat: !options.allowSoftware }) as WebGLRenderingContext | null;
  if (!context) return null;
  const gl: WebGLRenderingContext = context;
  if (!options.allowSoftware && isSoftwareRenderer(gl)) return null;
  const uintIndices = gl.getExtension("OES_element_index_uint");

  let fiberProgram: WebGLProgram;
  let nodeProgram: WebGLProgram;
  try {
    fiberProgram = program(gl, FIBER_VS, FIBER_FS);
    nodeProgram = program(gl, NODE_VS, NODE_FS);
  } catch (error) {
    console.warn(error);
    return null;
  }

  const vbo = gl.createBuffer();
  const ibo = gl.createBuffer();
  const nbo = gl.createBuffer();
  let indexCount = 0;
  let indexType: number = gl.UNSIGNED_SHORT;
  let nodeCount = 0;

  const loc = (p: WebGLProgram, name: string) => gl.getUniformLocation(p, name);
  const fiberU = {
    res: loc(fiberProgram, "u_res"), dpr: loc(fiberProgram, "u_dpr"), time: loc(fiberProgram, "u_time"), cam: loc(fiberProgram, "u_cam"),
    pointer: loc(fiberProgram, "u_pointer"), wide: loc(fiberProgram, "u_wide"), reveal: loc(fiberProgram, "u_reveal"), energy: loc(fiberProgram, "u_energy"),
  };
  const nodeU = {
    res: loc(nodeProgram, "u_res"), dpr: loc(nodeProgram, "u_dpr"), time: loc(nodeProgram, "u_time"), cam: loc(nodeProgram, "u_cam"),
    pointer: loc(nodeProgram, "u_pointer"), wide: loc(nodeProgram, "u_wide"), energy: loc(nodeProgram, "u_energy"),
  };

  let width = 1;
  let height = 1;
  let dpr = 1;
  const maxDpr = () => (tier === "high" ? 1.75 : 1);

  const rebuild = () => {
    const samples = tier === "high" ? 150 : 90;
    const built = build(compose(width, height, tier), samples);
    if (built.indices instanceof Uint32Array && !uintIndices) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, built.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, built.indices, gl.STATIC_DRAW);
    indexCount = built.indices.length;
    indexType = built.indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
    gl.bufferData(gl.ARRAY_BUFFER, built.nodes, gl.STATIC_DRAW);
    nodeCount = built.nodeCount;
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr());
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    rebuild();
    if (!running) draw(performance.now());
  };

  // Mus og kamera interpoleres for en fysisk, rolig respons
  const pointer = { x: 0, y: 0, active: 0, tx: 0, ty: 0, tActive: 0 };
  const cam = { x: 0, y: 0 };

  const start = performance.now();
  let last = start;
  let frame = 0;
  let running = false;
  let visible = true;
  let destroyed = false;
  let skip = false;
  const frameTimes: number[] = [];
  let measured = false;

  const layout = (p: WebGLProgram, attrs: [string, number, number][]) => attrs.map(([name, size, offset]) => ({ loc: gl.getAttribLocation(p, name), size, offset }));
  const fiberAttrs = layout(fiberProgram, [["a_pos", 3, 0], ["a_prev", 3, 3], ["a_next", 3, 6], ["a_uv", 3, 9], ["a_fiber", 4, 12], ["a_anim", 4, 16]]);
  const nodeAttrs = layout(nodeProgram, [["a_pos", 3, 0], ["a_info", 4, 3], ["a_node", 4, 7]]);
  const bindAttributes = (buffer: WebGLBuffer | null, attrs: ReturnType<typeof layout>, floats: number) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const { loc: l, size, offset } of attrs) {
      if (l < 0) continue;
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, floats * 4, offset * 4);
    }
  };

  const disableAll = () => {
    const max = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number;
    for (let i = 0; i < Math.min(max, 8); i++) gl.disableVertexAttribArray(i);
  };

  function draw(now: number) {
    const animate = options.animate;
    const t = animate ? (now - start) / 1000 : 14.2;
    const reveal = animate ? t : 99;
    const energy = animate ? smoothstep(0.9, 2.4, t) : 1;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;

    // Fysisk demping: musen og kameraet følger målet mykt
    const k = 1 - Math.exp(-dt * 5.5);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    pointer.active += (pointer.tActive - pointer.active) * (1 - Math.exp(-dt * 3));
    const camK = 1 - Math.exp(-dt * 2.2);
    cam.x += (pointer.active * pointer.x * 0.05 - cam.x) * camK;
    cam.y += (pointer.active * pointer.y * 0.05 - cam.y) * camK;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const wide = width >= 1024 ? 1 : 0;

    gl.useProgram(fiberProgram);
    disableAll();
    bindAttributes(vbo, fiberAttrs, 20);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.uniform2f(fiberU.res, width, height);
    gl.uniform1f(fiberU.dpr, dpr);
    gl.uniform1f(fiberU.time, t);
    gl.uniform2f(fiberU.cam, cam.x, cam.y);
    gl.uniform3f(fiberU.pointer, pointer.x, pointer.y, pointer.active);
    gl.uniform1f(fiberU.wide, wide);
    gl.uniform1f(fiberU.reveal, reveal);
    gl.uniform1f(fiberU.energy, energy);
    gl.drawElements(gl.TRIANGLES, indexCount, indexType, 0);

    if (nodeCount) {
      gl.useProgram(nodeProgram);
      disableAll();
      bindAttributes(nbo, nodeAttrs, 11);
      gl.uniform2f(nodeU.res, width, height);
      gl.uniform1f(nodeU.dpr, dpr);
      gl.uniform1f(nodeU.time, t);
      gl.uniform2f(nodeU.cam, cam.x, cam.y);
      gl.uniform3f(nodeU.pointer, pointer.x, pointer.y, pointer.active);
      gl.uniform1f(nodeU.wide, wide);
      gl.uniform1f(nodeU.energy, energy * Math.min(reveal / 2, 1));
      gl.drawArrays(gl.POINTS, 0, nodeCount);
    }
  }

  const loop = (now: number) => {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    // Medium: 30 bilder i sekundet er nok og sparer batteri
    if (tier === "medium") { skip = !skip; if (skip) return; }
    draw(now);
    measure(now);
  };

  // Adaptiv kvalitet: mål gjennomsnittlig bildetid etter innføringen
  let lastFrameAt = 0;
  function measure(now: number) {
    if (measured) return;
    if (lastFrameAt) frameTimes.push(now - lastFrameAt);
    lastFrameAt = now;
    if (frameTimes.length < 150) return;
    measured = true;
    const sorted = [...frameTimes].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const budget = tier === "high" ? 26 : 52;
    if (median > budget) {
      if (tier === "high") {
        tier = "medium";
        frameTimes.length = 0;
        measured = false;
        lastFrameAt = 0;
        resize();
      } else {
        stop();
        options.onDegrade?.("slow");
      }
    }
  }

  function startLoop() {
    if (running || destroyed || !options.animate || !visible) return;
    running = true;
    last = performance.now();
    lastFrameAt = 0;
    frame = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  const onLost = (event: Event) => {
    event.preventDefault();
    stop();
    options.onDegrade?.("context-lost");
  };
  canvas.addEventListener("webglcontextlost", onLost);

  resize();
  draw(performance.now());
  options.onReady?.();
  startLoop();

  return {
    resize,
    setPointer(x, y, active) {
      pointer.tx = x - width / 2;
      pointer.ty = y - height / 2;
      pointer.tActive = active ? 1 : 0;
      if (!options.animate) return;
      if (!running) startLoop();
    },
    setVisible(next) {
      visible = next;
      if (next) startLoop();
      else stop();
    },
    destroy() {
      destroyed = true;
      stop();
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(vbo);
      gl.deleteBuffer(ibo);
      gl.deleteBuffer(nbo);
      gl.deleteProgram(fiberProgram);
      gl.deleteProgram(nodeProgram);
    },
  };
}
