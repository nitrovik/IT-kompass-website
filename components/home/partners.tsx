import Image from "next/image";
import { PARTNER_MARQUEE_MIN, partnerSection, partners, type Partner } from "@/content/partners";

/*
  Samarbeidspartnere, rett under heroen.
  Én partner: en rolig, statisk rad. Fra to: logoene glir sakte fra høyre mot venstre i
  en sømløs sløyfe. Settet med logoer gjentas til raden er bredere enn skjermen, og raden står to
  ganger etter hverandre og flyttes −50 % med en CSS-animasjon (transform), så den går rundt uten
  hopp og uten tomrom. Bare første sett leses opp av skjermlesere. Sløyfen står stille utenfor
  skjermen og ved redusert bevegelse.
*/
const GAP = 72;
const AREA = 5400; // omtrent samme flate for alle logoer, så ingen dominerer
const MAX_H = 54;
const SPEED = 34; // px per sekund

function size({ width, height, scale = 1 }: NonNullable<Partner["logo"]>) {
  const ratio = width / height;
  const h = Math.min(MAX_H, Math.sqrt(AREA / ratio)) * scale;
  return { h, w: h * ratio };
}

function Logo({ partner, hidden }: { partner: Partner; hidden?: boolean }) {
  if (!partner.logo) return <span className="partner-name">{partner.name}</span>;
  const { h, w } = size(partner.logo);
  return (
    <Image className="partner-logo" src={partner.logo.src} alt={hidden ? "" : partner.name} width={partner.logo.width} height={partner.logo.height}
      style={{ ["--h" as string]: `${h.toFixed(1)}px`, ["--w" as string]: `${w.toFixed(1)}px` }} unoptimized />
  );
}

export function Partners() {
  if (!partners.length) return null;
  if (partners.length < PARTNER_MARQUEE_MIN) {
    return (
      <section className="partners" aria-labelledby="partnere-heading">
        <div className="wrap partners-inner">
          <h2 id="partnere-heading" className="partners-label">{partnerSection.label}</h2>
          <ul className="partners-row partners-static">{partners.map((p) => <li key={p.name}><Logo partner={p} /></li>)}</ul>
        </div>
      </section>
    );
  }
  // Gjenta settet til én rad er minst 1700 px (bredere enn stripen på store skjermer)
  const setWidth = partners.reduce((sum, p) => sum + (p.logo ? size(p.logo).w : 140) + GAP, 0);
  const repeats = Math.max(1, Math.ceil(1700 / setWidth));
  const items = Array.from({ length: repeats }, (_, r) => partners.map((p) => ({ p, key: `${r}-${p.name}`, hidden: r > 0 }))).flat();
  const row = (copy: boolean) => (
    <ul className="partners-row" aria-hidden={copy || undefined}>
      {items.map(({ p, key, hidden }) => <li key={key} aria-hidden={hidden || undefined}><Logo partner={p} hidden={copy || hidden} /></li>)}
    </ul>
  );
  return (
    <section className="partners" aria-labelledby="partnere-heading">
      <div className="wrap partners-inner">
        <h2 id="partnere-heading" className="partners-label">{partnerSection.label}</h2>
        <div className="partners-viewport" data-observe="toggle">
          <div className="partners-track" style={{ ["--dur" as string]: `${((setWidth * repeats) / SPEED).toFixed(1)}s`, ["--gap" as string]: `${GAP}px` }}>
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
