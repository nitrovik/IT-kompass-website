import type { Fiber } from "@/components/home/hero-fibers";

/*
  Kompasset som knutepunkt: én tilstandsmaskin styrer både lyskulene og kompassnålen.

  idle       nålen hviler i retningen den sist sendte et signal, eller følger musepekeren
  absorbing  en kule har nådd skiven og trekkes inn i sentrum; nålen står stille
  aiming     en ny utgang er valgt; nålen roterer dit
  emitting   kula sendes ut langs den valgte banen; nålen holder retningen til kula er ute av skiven

  Bare tilstandsmaskinen bestemmer hvor nålen skal peke (steer). Én kule behandles om gangen,
  så to signaler kjemper aldri om nålen. Kulene flyttes med Web Animations (transform og
  opacity på skjermkortet); JavaScript kjører bare når en fase skifter, og når nålen beveger seg.
*/

type Phase = "idle" | "absorbing" | "aiming" | "emitting";

export type ControllerElements = {
  host: HTMLElement;
  needle: HTMLElement;
  core: HTMLElement;
  pulses: HTMLElement[];
  ports: Map<string, HTMLElement>;
  nodes: Map<string, HTMLElement>;
};

export type NeedleState = { angle: number; rest: number };

const wrap180 = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;
const mod360 = (a: number) => ((a % 360) + 360) % 360;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
const r1 = (n: number) => Math.round(n * 10) / 10;

/* Ekte tilfeldighet der nettleseren har den, ellers Math.random */
function random() {
  const c = globalThis.crypto;
  if (c?.getRandomValues) return c.getRandomValues(new Uint32Array(1))[0] / 4294967296;
  return Math.random();
}

/*
  Nålen som en dempet fjær, med to drivmåter som bruker samme fysikk:
  - glide: når kompasset retter seg inn mot en utgang er målet kjent, så hele bevegelsen regnes
    ut på forhånd og spilles av med Web Animations. Da går den på skjermkortet og holder seg jevn
    selv om hovedtråden er opptatt.
  - aim: når nålen følger musepekeren endres målet hele tiden, så fjæren regnes per bilde
    (requestAnimationFrame), men bare mens nålen faktisk beveger seg.
  Den ene tar over der den andre slapp, med samme vinkel og fart.
*/
const STEP = 1 / 60;

class Needle {
  angle: number;
  private vel = 0;
  private target: number;
  private omega = 9;
  private zeta = 0.8;
  private raf = 0;
  private last = 0;
  private glideAnim: Animation | null = null;
  private glidePath: { angles: number[]; vels: number[] } | null = null;
  private waiters: (() => void)[] = [];

  constructor(private el: HTMLElement, start: number) {
    this.angle = start;
    this.target = start;
    this.write();
  }

  aim(bearing: number, omega: number, zeta: number) {
    this.takeOver();
    this.omega = omega;
    this.zeta = zeta;
    // Korteste vei rundt, så nålen aldri snurrer en ekstra runde
    this.target = this.angle + wrap180(bearing - this.angle);
    if (!this.raf && (Math.abs(this.target - this.angle) > 0.05 || Math.abs(this.vel) > 3)) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  glide(bearing: number, omega: number, zeta: number) {
    const target = this.angle + wrap180(bearing - this.angle);
    if (this.glideAnim && Math.abs(target - this.target) < 0.05) return;
    this.takeOver();
    this.target = this.angle + wrap180(bearing - this.angle);
    if (Math.abs(this.target - this.angle) < 0.2 && Math.abs(this.vel) < 3) return;
    // Samme fjær som i tick, regnet ut i forkant med 60 steg i sekundet
    const angles = [this.angle];
    const vels = [this.vel];
    let angle = this.angle;
    let vel = this.vel;
    for (let i = 0; i < 600; i++) {
      vel += (omega * omega * (this.target - angle) - 2 * zeta * omega * vel) * STEP;
      angle += vel * STEP;
      angles.push(angle);
      vels.push(vel);
      if (Math.abs(this.target - angle) < 0.2 && Math.abs(vel) < 3) break;
    }
    angles[angles.length - 1] = this.target;
    vels[vels.length - 1] = 0;
    const n = angles.length - 1;
    const anim = this.el.animate(
      angles.map((x, i) => ({ offset: i / n, transform: `rotate(${x.toFixed(2)}deg)` })),
      { duration: n * STEP * 1000, easing: "linear", fill: "forwards" },
    );
    this.glideAnim = anim;
    this.glidePath = { angles, vels };
    anim.finished.then(
      () => {
        if (this.glideAnim !== anim) return;
        this.glideAnim = null;
        this.glidePath = null;
        this.angle = mod360(this.target);
        this.target = this.angle;
        this.vel = 0;
        this.write();
        anim.cancel();
        this.flush();
      },
      () => {},
    );
  }

  hold() {
    this.aim(this.angle, 14, 1);
  }

  settled(): Promise<void> {
    return this.raf || this.glideAnim ? new Promise((resolve) => this.waiters.push(resolve)) : Promise.resolve();
  }

  stop() {
    this.takeOver();
    this.vel = 0;
    this.target = this.angle;
    this.flush();
  }

  /* Stopper den bevegelsen som pågår og overtar vinkelen og farten den hadde */
  private takeOver() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    const anim = this.glideAnim;
    const path = this.glidePath;
    if (!anim || !path) return;
    const i = Math.min(path.angles.length - 1, Math.max(0, Math.round(Number(anim.currentTime ?? 0) / 1000 / STEP)));
    this.angle = path.angles[i];
    this.vel = path.vels[i];
    this.glideAnim = null;
    this.glidePath = null;
    this.write();
    anim.cancel();
  }

  private tick = (now: number) => {
    const dt = Math.min(0.032, Math.max(0.004, (now - this.last) / 1000));
    this.last = now;
    const acc = this.omega * this.omega * (this.target - this.angle) - 2 * this.zeta * this.omega * this.vel;
    this.vel += acc * dt;
    this.angle += this.vel * dt;
    if (Math.abs(this.target - this.angle) < 0.2 && Math.abs(this.vel) < 3) {
      this.angle = mod360(this.target);
      this.target = this.angle;
      this.vel = 0;
      this.raf = 0;
      this.write();
      this.flush();
      return;
    }
    this.write();
    this.raf = requestAnimationFrame(this.tick);
  };

  private flush() {
    const waiting = this.waiters;
    this.waiters = [];
    waiting.forEach((resolve) => resolve());
  }

  private write() {
    this.el.style.transform = `rotate(${this.angle.toFixed(2)}deg)`;
  }
}

/* Banens fart: konstant ut, rolig start fra sentrum; inn: konstant, så bremser kula inn i sentrum */
function incoming(fiber: Fiber, v: number) {
  const cruise = fiber.rimAt / v;
  const settle = (2 * (fiber.length - fiber.rimAt)) / v;
  const total = cruise + settle;
  const decel = (v * v) / (2 * (fiber.length - fiber.rimAt));
  const position = (t: number) => {
    if (t <= cruise) return v * t;
    const tau = t - cruise;
    return fiber.rimAt + v * tau - 0.5 * decel * tau * tau;
  };
  const frames = sample(total, (t) => {
    const s = position(t);
    const inside = Math.max(0, (s - fiber.rimAt) / (fiber.length - fiber.rimAt));
    // Kula trekker seg sammen og blekner mens den trekkes inn i sentrum
    const scale = 1 - 0.74 * smooth(0, 1, inside);
    const opacity = Math.min(1, s / 40) * (1 - smooth(0.3, 1, inside));
    return { p: fiber.at(s), scale, opacity };
  });
  return { frames, total, cruise, timeAt: (s: number) => s / v };
}

function outgoing(fiber: Fiber, v: number, r: number) {
  const v0 = v * 0.3;
  const ramp = r * 1.25;
  const accel = (v * v - v0 * v0) / (2 * ramp);
  const rampTime = (v - v0) / accel;
  const total = rampTime + (fiber.length - ramp) / v;
  const position = (t: number) => (t <= rampTime ? v0 * t + 0.5 * accel * t * t : ramp + v * (t - rampTime));
  const timeAt = (s: number) => (s <= ramp ? (-v0 + Math.sqrt(v0 * v0 + 2 * accel * s)) / accel : rampTime + (s - ramp) / v);
  const frames = sample(total, (t) => {
    const s = position(t);
    // Kula vokser fram fra sentrum og når full størrelse ved kanten av skiven
    const scale = 0.28 + 0.72 * smooth(0, 1, s / r);
    const opacity = smooth(0, 0.6, s / r) * Math.min(1, (fiber.length - s) / 48);
    return { p: fiber.at(s), scale, opacity };
  });
  return { frames, total, timeAt };
}

type Route = { frames: Keyframe[]; total: number; timeAt: (s: number) => number };
type Flight = { source: Fiber; inbound: Route & { cruise: number }; arrival: Animation; rimAt: number };

function sample(total: number, at: (t: number) => { p: { x: number; y: number }; scale: number; opacity: number }): Keyframe[] {
  const n = Math.min(120, Math.max(24, Math.round(total / 40)));
  return Array.from({ length: n + 1 }, (_, i) => {
    const { p, scale, opacity } = at((total * i) / n);
    return { offset: i / n, transform: `translate3d(${r1(p.x)}px, ${r1(p.y)}px, 0) scale(${scale.toFixed(3)})`, opacity: Math.max(0, Math.min(1, opacity)).toFixed(3) };
  });
}

/*
  Banene trekkes som fra en stokket kortstokk: alle gyldige baner brukes én gang før den stokkes
  på nytt, og en ny runde starter aldri med banen som nettopp ble brukt. Rekkefølgen er tilfeldig
  hver runde, men over tid får alle banene like mange signaler.
*/
class Deck {
  private cards: Fiber[] = [];
  private last = "";
  constructor(private all: Fiber[]) {}
  get size() {
    return this.all.length;
  }
  draw(): Fiber {
    if (!this.cards.length) {
      const cards = [...this.all];
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      const end = cards.length - 1;
      if (end > 0 && cards[end].id === this.last) {
        const j = Math.floor(random() * end);
        [cards[end], cards[j]] = [cards[j], cards[end]];
      }
      this.cards = cards;
    }
    const next = this.cards.pop()!;
    this.last = next.id;
    return next;
  }
}

export class FiberController {
  private phase: Phase = "idle";
  private token = 0;
  private running = false;
  private timers = new Map<number, (ok: boolean) => void>();
  private needle: Needle;
  private rest: number;
  private aimBearing = 0;
  private hover: number | null = null;
  private sources: Deck;
  private targets: Deck;
  // Banenes keyframes regnes ut én gang, og hver kombinasjon av kule og bane lages som animasjon én gang
  private routes = new Map<string, Route>();
  private anims = new Map<string, Animation>();
  private glow: Animation | null = null;

  constructor(private els: ControllerElements, fibers: Fiber[], private opts: { speed: number; r: number }, state: NeedleState) {
    this.sources = new Deck(fibers.filter((f) => f.valid && f.kind === "in"));
    this.targets = new Deck(fibers.filter((f) => f.valid && f.kind === "out"));
    this.needle = new Needle(els.needle, state.angle);
    this.rest = state.rest;
  }

  get state(): NeedleState {
    return { angle: this.needle.angle, rest: this.rest };
  }

  /** Musepekeren nær kompasset (retning) eller borte (null). Følges bare når kompasset er ledig. */
  setHover(bearing: number | null) {
    this.hover = bearing;
    if (this.phase === "idle") this.steer();
  }

  start(delay: number) {
    if (this.running || !this.sources.size || !this.targets.size) return;
    this.running = true;
    const token = ++this.token;
    this.wait(delay, token).then((ok) => {
      if (ok) void this.loop(token);
    });
  }

  stop() {
    this.running = false;
    this.token++;
    this.timers.forEach((resolve, id) => {
      clearTimeout(id);
      resolve(false);
    });
    this.timers.clear();
    for (const el of [...this.els.pulses, this.els.core]) el.getAnimations().forEach((a) => a.cancel());
    // Nålen fryses der den er; den skal ikke bevege seg mens heroen ikke vises
    this.phase = "idle";
    this.els.host.dataset.fiberPhase = "idle";
    this.needle.stop();
  }

  destroy() {
    this.stop();
    this.needle.stop();
  }

  private async loop(token: number) {
    let flight: Flight | null = this.launch(this.sources.draw(), token);
    while (flight && token === this.token) flight = await this.cycle(token, flight);
  }

  /* En kule startes fra kanten langs en bane inn */
  private launch(source: Fiber, token: number): Flight {
    const inbound = this.route(source, () => incoming(source, this.opts.speed));
    const arrival = this.play(this.freePulse(), source.id, inbound.frames, inbound.total);
    if (source.node) this.later(inbound.timeAt(source.node.at), token, () => this.flash(this.els.nodes.get(source.id)));
    return { source, inbound, arrival, rimAt: performance.now() + inbound.cruise };
  }

  /*
    Ett signal: kula når skiven, absorberes, nålen retter seg inn, kula sendes ut langs en ny bane.
    Neste kule startes fra kanten allerede mens denne sendes ut, beregnet slik at den kommer fram
    etter en kort pause. Kompasset tar fortsatt imot bare én kule om gangen.
  */
  private async cycle(token: number, { source, inbound, arrival, rimAt }: Flight): Promise<Flight | null> {
    // Fase B: kula når skiven og trekkes inn i sentrum
    if (!(await this.wait(Math.max(0, rimAt - performance.now()), token))) return null;
    this.setPhase("absorbing");
    this.flash(this.els.ports.get(source.id));
    this.later((inbound.total - inbound.cruise) * 0.42, token, () => this.charge());
    if (!(await this.finished(arrival, token))) return null;

    // Fase C og D: ny retning velges, og nålen roterer til banens faktiske retning
    const target = this.targets.draw();
    this.aimBearing = target.bearing;
    this.setPhase("aiming");
    if (!(await Promise.race([this.needle.settled().then(() => true), this.wait(1800, token)]))) return null;
    if (token !== this.token || !(await this.wait(140, token))) return null;

    // Fase E: kula sendes ut fra sentrum langs den valgte banen
    this.setPhase("emitting");
    this.rest = target.bearing;
    this.els.host.dataset.fiberOut = target.id;
    const outbound = this.route(target, () => outgoing(target, this.opts.speed, this.opts.r));
    this.play(this.freePulse(), target.id, outbound.frames, outbound.total);
    this.release();
    const leaves = outbound.timeAt(target.rimAt);
    this.later(leaves, token, () => this.flash(this.els.ports.get(target.id)));
    if (target.node) this.later(outbound.timeAt(target.node.at), token, () => this.flash(this.els.nodes.get(target.id)));

    // Neste kule: når fram tidligst etter at denne er ute av skiven og en kort pause
    const nextSource = this.sources.draw();
    const nextRoute = this.route(nextSource, () => incoming(nextSource, this.opts.speed));
    const pause = leaves + 220 + 650 + random() * 950;
    const next = this.wait(Math.max(0, pause - nextRoute.cruise), token).then((ok) => (ok ? this.launch(nextSource, token) : null));
    if (!(await this.wait(leaves + 220, token))) return null;

    // Fase F: kompasset er ledig og klart for neste signal
    this.setPhase("idle");
    return next;
  }

  private setPhase(phase: Phase) {
    this.phase = phase;
    this.els.host.dataset.fiberPhase = phase;
    this.steer();
  }

  /* Den eneste stedet som bestemmer hvor nålen skal peke */
  private steer() {
    if (this.phase === "absorbing") this.needle.hold();
    else if (this.phase === "aiming" || this.phase === "emitting") this.needle.glide(this.aimBearing, 10.5, 0.74);
    else this.needle.aim(this.hover ?? this.rest, 8.5, 0.82);
  }

  private freePulse() {
    return this.els.pulses.find((el) => !el.getAnimations().some((a) => a.playState === "running")) ?? this.els.pulses[0];
  }

  private route<T extends Route>(fiber: Fiber, make: () => T): T {
    let route = this.routes.get(fiber.id) as T | undefined;
    if (!route) this.routes.set(fiber.id, (route = make()));
    return route;
  }

  private play(el: HTMLElement, fiberId: string, frames: Keyframe[], duration: number) {
    el.getAnimations().forEach((a) => a.cancel());
    const key = `${this.els.pulses.indexOf(el)}:${fiberId}`;
    let anim = this.anims.get(key);
    if (!anim) {
      anim = new Animation(new KeyframeEffect(el, frames, { duration, easing: "linear", fill: "forwards" }), document.timeline);
      this.anims.set(key, anim);
    }
    anim.currentTime = 0;
    anim.play();
    return anim;
  }

  /* Lyset i sentrum: tennes når kula absorberes, ligger svakt mens nålen snur, og følger kula ut */
  private charge() {
    this.glow?.cancel();
    this.glow = this.els.core.animate(
      [
        { opacity: 0, transform: "scale(.5)" },
        { opacity: 0.88, transform: "scale(1)", offset: 0.38 },
        { opacity: 0.46, transform: "scale(.9)" },
      ],
      { duration: 560, easing: "cubic-bezier(.2,.75,.25,1)", fill: "forwards" },
    );
  }

  private release() {
    // Fra lysstyrken ladingen har nå, regnet ut fra animasjonens tid (uten å lese stilen)
    const p = this.glow?.effect?.getComputedTiming().progress;
    const from = p == null ? 0 : p < 0.38 ? (p / 0.38) * 0.88 : 0.88 - ((p - 0.38) / 0.62) * 0.42;
    this.glow?.cancel();
    this.glow = this.els.core.animate(
      [
        { opacity: from, transform: "scale(.9)" },
        { opacity: 0, transform: "scale(1.14)" },
      ],
      { duration: 520, easing: "ease-in-out", fill: "forwards" },
    );
  }

  private flash(el: HTMLElement | undefined) {
    el?.animate(
      [
        { opacity: 0, transform: "scale(.5)" },
        { opacity: 1, transform: "scale(1)", offset: 0.28 },
        { opacity: 0, transform: "scale(1.3)" },
      ],
      { duration: 820, easing: "ease-out" },
    );
  }

  private finished(anim: Animation, token: number) {
    return anim.finished.then(
      () => token === this.token,
      () => false,
    );
  }

  private wait(ms: number, token: number): Promise<boolean> {
    return new Promise((resolve) => {
      const id = window.setTimeout(() => {
        this.timers.delete(id);
        resolve(token === this.token);
      }, ms);
      this.timers.set(id, resolve);
    });
  }

  private later(ms: number, token: number, fn: () => void) {
    this.wait(ms, token).then((ok) => {
      if (ok) fn();
    });
  }
}
