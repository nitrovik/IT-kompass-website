import Image from "next/image";
import { PARTNER_MARQUEE_MIN, partnerSection, partners, type Partner } from "@/content/partners";

/*
  Samarbeidspartnere, rett under heroen (der fordelsstripen sto før).
  Én eller to partnere: en rolig, statisk rad. Fra tre partnere: en sakte, sømløs sløyfe fra høyre
  mot venstre. Raden står to ganger etter hverandre og flyttes −50 % med en CSS-animasjon
  (transform), så den går rundt uten hopp. Den andre kopien er skjult for skjermlesere, sløyfen
  står stille utenfor skjermen, når pekeren er over den og ved redusert bevegelse.
*/
function Logo({ partner }: { partner: Partner }) {
  if (!partner.logo) return <span className="partner-name">{partner.name}</span>;
  const { src, width, height, scale = 1 } = partner.logo;
  // Samme høyde for alle logoer (justert med scale), bredden følger logoens egne proporsjoner
  const h = 30 * scale;
  return <Image className="partner-logo" src={src} alt={partner.name} width={width} height={height} style={{ height: h, width: (width / height) * h }} unoptimized />;
}

export function Partners() {
  if (!partners.length) return null;
  const moving = partners.length >= PARTNER_MARQUEE_MIN;
  const row = (copy: boolean) => (
    <ul className="partners-row" aria-hidden={copy || undefined}>
      {partners.map((partner) => <li key={partner.name}><Logo partner={partner} /></li>)}
    </ul>
  );
  return (
    <section className="partners" aria-labelledby="partnere-heading">
      <div className="wrap partners-inner">
        <h2 id="partnere-heading" className="partners-label">{partnerSection.label}</h2>
        {moving ? (
          <div className="partners-viewport" data-observe="toggle">
            <div className="partners-track" style={{ ["--n" as string]: partners.length }}>
              {row(false)}
              {row(true)}
            </div>
          </div>
        ) : (
          <div className="partners-static">{row(false)}</div>
        )}
      </div>
    </section>
  );
}
