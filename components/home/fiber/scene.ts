import type { Point, Segment } from "@/components/home/fiber/geometry";

/*
  Tegningen i heroen, som data. Samme historie som diagrammet «Behovet avgjør»:
  behovet kommer inn, går gjennom IT Kompass, alternativene vurderes, og én retning er riktig.

  Alt er målt i piksler rundt kompassets sentrum (0, 0). Positive x er mot høyre, positive y nedover.
  Brukes både på serveren (tegning og keyframes) og i nettleseren (nålen og pekeren på PC).
*/

export type Fiber = { id: string; segments: Segment[]; width: number; color: string; opacity: number; main?: boolean };
export type Branch = Fiber & { node: Point; chosen?: boolean; angle: number };
export type Scene = { incoming: Fiber[]; branches: Branch[]; onward: Segment[]; cycle: number; scanStep: number };

/* Retning inn i kompasset (svakt stigende mot høyre) og normalen på den */
const IN: Point = [0.966, -0.259];
const NORMAL: Point = [0.259, 0.966];

/* Siste del før kompasset: fibrene ligger tett og parallelt, som én samlet kabel */
function intoHub(from: Segment, offset: number): Segment[] {
  const [, , c2, end] = from;
  const handle: Point = [end[0] + (end[0] - c2[0]) * 0.6, end[1] + (end[1] - c2[1]) * 0.6];
  const approach: Point = [-IN[0] * 150 + NORMAL[0] * offset, -IN[1] * 150 + NORMAL[1] * offset];
  const hub: Point = [NORMAL[0] * offset * 0.3, NORMAL[1] * offset * 0.3];
  return [from, [end, handle, approach, hub]];
}

/* Retning fra nord, med klokka – samme mål som rotate() på nålen */
const bearing = ([x, y]: Point) => Math.round(((Math.atan2(x, -y) * 180) / Math.PI) * 10) / 10;

/*
  Gren ut av kompasset til et alternativ. lead: hvor langt grenen følger kabelens retning før den
  svinger; approach og dy: hvordan den legger seg inn mot noden. Ulike verdier gir ulike kurver.
*/
function branch(id: string, node: Point, lead: number, approach: number, dy: number, style: Omit<Fiber, "id" | "segments">, chosen = false): Branch {
  const segment: Segment = [[0, 0], [IN[0] * lead, IN[1] * lead], [node[0] - approach, node[1] + dy], node];
  return { id, segments: [segment], node, chosen, angle: bearing(node), ...style };
}

const ALT = (color: string, opacity = 0.55) => ({ width: 1, color, opacity });
const MAIN = { width: 1.7, color: "#1d6fc4", opacity: 0.95, main: true };

export const DESKTOP: Scene = {
  cycle: 12,
  scanStep: 0.035,
  // Behovet: inn fra venstre, under teksten
  incoming: [
    { id: "d-in", segments: intoHub([[-1500, 420], [-1000, 420], [-620, 380], [-360, 250]], 0), width: 1.6, color: "#1d6fc4", opacity: 0.85, main: true },
    { id: "d-in-low", segments: intoHub([[-1250, 620], [-900, 600], [-560, 470], [-330, 300]], 7), width: 1, color: "#4b8fd6", opacity: 0.55 },
    { id: "d-in-steep", segments: intoHub([[-620, 780], [-490, 630], [-340, 420], [-235, 290]], 14), width: 0.9, color: "#2a8aa8", opacity: 0.5 },
  ],
  // Alternativene. Den valgte (chosen) er tydeligere og fortsetter videre (onward).
  branches: [
    branch("d-b0", [235, -225], 95, 95, 18, ALT("#6ea6dd")),
    branch("d-b1", [330, -92], 150, 130, 0, MAIN, true),
    branch("d-b2", [300, 58], 110, 105, -8, ALT("#4b8fd6")),
    branch("d-b3", [205, 190], 85, 120, -22, ALT("#2a8aa8", 0.5)),
  ],
  onward: [[[330, -92], [470, -92], [650, -140], [1000, -185]]],
};

export const MOBILE: Scene = {
  cycle: 10,
  scanStep: 0.045,
  incoming: [
    { id: "m-in", segments: [[[-330, 44], [-220, 44], [-120, 14], [0, 0]]], width: 1.4, color: "#1d6fc4", opacity: 0.85, main: true },
    { id: "m-in-high", segments: [[[-330, -40], [-230, -40], [-120, -6], [0, 0]]], width: 0.9, color: "#4b8fd6", opacity: 0.55 },
  ],
  branches: [
    branch("m-b0", [118, -74], 64, 48, 0, ALT("#6ea6dd")),
    branch("m-b1", [150, 4], 72, 50, 0, { ...MAIN, width: 1.5 }, true),
    branch("m-b2", [116, 76], 60, 52, 0, ALT("#2a8aa8", 0.5)),
  ],
  onward: [[[150, 4], [190, 4], [230, -6], [300, -18]]],
};

export const chosenOf = (scene: Scene) => scene.branches.find((b) => b.chosen)!;

/* Nålen hviler i retning av det riktige valget (PC). Mobil: se --needle-rest i globals.css. */
export const NEEDLE_REST = chosenOf(DESKTOP).angle;
export const BRANCH_ANGLES = DESKTOP.branches.map((b) => b.angle);
