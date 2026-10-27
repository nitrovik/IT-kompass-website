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
  Nålen som en dempet fjær: følger et mål jevnt, med et lite naturlig overslag, og stopper
  helt når den er fremme. Skriver bare transform på sitt eget lag, og bare mens den beveger seg.
*/
class Needle {
  angle: number;
  private vel = 0;
  private target: number;
  private omega = 9;
  private zeta = 0.8;
  private raf = 0;
  private last = 0;
  private waiters: (() => void)[] = [];

  constructor(private el: HTMLElement, start: number) {
    this.angle = start;
    this.target = start;
    this.write();
  }

  aim(bearing: number, omega: number, zeta: number) {
    this.omega = omega;
    this.zeta = zeta;
    // Korteste vei rundt, så nålen aldri snurrer en ekstra runde
    this.target = this.angle + wrap180(bearing - this.angle);
    if (!this.raf && Math.abs(this.target - this.angle) > 0.05) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  hold() {
    this.aim(this.angle, 14, 1);
  }

  settled(): Promise<void> {
    return this.raf ? new Promise((resolve) => this.waiters.push(resolve)) : Promise.resolve();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.vel = 0;
    this.flush();
  }

  private tick = (now: number) => {
    const dt = Math.min(0.032, Math.max(0.004, (now - this.last) / 1000));
    this.last = now;
    const acc = this.omega * this.omega * (this.target - this.angle) - 2 * this.zeta * this.omega * this.vel;
    this.vel += acc * dt;
    this.angle += this.vel * dt;
    if (Math.abs(this.target - this.angle) < 0.2 && Math.abs(this.vel) < 3) {
      this.angle = ((this.target % 360) + 360) % 360;
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
    this.setPhase("idle");
  }

  destroy() {
    this.stop();
    this.needle.stop();
  }

  private async loop(token: number) {
    while (token === this.token) {
      if (!(await this.cycle(token))) return;
    }
  }

  /* Ett signal: inn langs en bane, absorberes, nålen retter seg inn, ut langs en ny bane */
  private async cycle(token: number): Promise<boolean> {
    const v = this.opts.speed;
    const source = this.sources.draw();
    const inbound = incoming(source, v);
    const carrier = this.freePulse();
    const arrival = this.play(carrier, inbound.frames, inbound.total);
    if (source.node) this.later(inbound.timeAt(source.node.at), token, () => this.flash(this.els.nodes.get(source.id)));

    // Fase B: kula når skiven og trekkes inn i sentrum
    if (!(await this.wait(inbound.cruise, token))) return false;
    this.setPhase("absorbing");
    this.flash(this.els.ports.get(source.id));
    this.later((inbound.total - inbound.cruise) * 0.42, token, () => this.charge());
    if (!(await this.finished(arrival, token))) return false;

    // Fase C og D: ny retning velges, og nålen roterer til banens faktiske retning
    const target = this.targets.draw();
    this.aimBearing = target.bearing;
    this.setPhase("aiming");
    if (!(await Promise.race([this.needle.settled().then(() => true), this.wait(1800, token)]))) return false;
    if (token !== this.token || !(await this.wait(140, token))) return false;

    // Fase E: kula sendes ut fra sentrum langs den valgte banen
    this.setPhase("emitting");
    this.rest = target.bearing;
    this.els.host.dataset.fiberOut = target.id;
    const outbound = outgoing(target, v, this.opts.r);
    this.play(this.freePulse(), outbound.frames, outbound.total);
    this.release();
    const leaves = outbound.timeAt(target.rimAt);
    this.later(leaves, token, () => this.flash(this.els.ports.get(target.id)));
    if (target.node) this.later(outbound.timeAt(target.node.at), token, () => this.flash(this.els.nodes.get(target.id)));
    if (!(await this.wait(leaves + 220, token))) return false;

    // Fase F: kompasset er ledig og klart for neste signal
    this.setPhase("idle");
    return this.wait(650 + random() * 950, token);
  }

  private setPhase(phase: Phase) {
    this.phase = phase;
    this.els.host.dataset.fiberPhase = phase;
    this.steer();
  }

  /* Den eneste stedet som bestemmer hvor nålen skal peke */
  private steer() {
    if (this.phase === "absorbing") this.needle.hold();
    else if (this.phase === "aiming" || this.phase === "emitting") this.needle.aim(this.aimBearing, 10.5, 0.74);
    else this.needle.aim(this.hover ?? this.rest, 8.5, 0.82);
  }

  private freePulse() {
    return this.els.pulses.find((el) => !el.getAnimations().some((a) => a.playState === "running")) ?? this.els.pulses[0];
  }

  private play(el: HTMLElement, frames: Keyframe[], duration: number) {
    el.getAnimations().forEach((a) => a.cancel());
    return el.animate(frames, { duration, easing: "linear", fill: "forwards" });
  }

  /* Lyset i sentrum: tennes når kula absorberes, ligger svakt mens nålen snur, og følger kula ut */
  private charge() {
    this.els.core.getAnimations().forEach((a) => a.cancel());
    this.els.core.animate(
      [
        { opacity: 0, transform: "scale(.5)" },
        { opacity: 0.88, transform: "scale(1)", offset: 0.38 },
        { opacity: 0.46, transform: "scale(.9)" },
      ],
      { duration: 560, easing: "cubic-bezier(.2,.75,.25,1)", fill: "forwards" },
    );
  }

  private release() {
    const from = Number(getComputedStyle(this.els.core).opacity) || 0.46;
    this.els.core.getAnimations().forEach((a) => a.cancel());
    this.els.core.animate(
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
