import type { Partner } from "@/content/partners";

/*
  Rolig, horisontal logostripe. Ren CSS: sporet flyttes med transform (skjermkortet gjør
  jobben), ingen JavaScript per bilde.

  - Logosettet gjentas til det er langt nok til å fylle brede skjermer, og ligger to ganger
    etter hverandre. Sporet glir nøyaktig én settlengde (-50 %), så starten møter slutten uten hopp.
  - Står stille når banneret er utenfor skjermen (data-observe="toggle") og når musen er over.
  - Redusert bevegelse: ingen animasjon, ett sett med logoer, brutt over flere linjer.
  - Logoene lastes «lazy» og har faste mål, så de verken forsinker første visning eller flytter innhold.
*/
const MIN_LOGOS = 8;
const SECONDS_PER_LOGO = 4.5;

function Logo({ partner, hidden }: { partner: Partner; hidden?: boolean }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- små, statiske logoer i faste mål; next/image gir ingen gevinst her
    <img src={partner.logo} alt={hidden ? "" : partner.name} width={partner.width} height={partner.height} loading="lazy" decoding="async" draggable={false}
      className="partner-logo" style={partner.scale ? { ["--logo-scale" as string]: partner.scale } : undefined} />
  );
  if (!partner.url) return img;
  return <a href={partner.url} target="_blank" rel="noopener noreferrer" tabIndex={hidden ? -1 : undefined} className="partner-link">{img}</a>;
}

export function PartnerBanner({ label, partners }: { label: string; partners: Partner[] }) {
  if (!partners.length) return null;
  const repeat = Math.ceil(MIN_LOGOS / partners.length);
  const set = Array.from({ length: repeat }, () => partners).flat();
  const list = (hidden?: boolean) => (
    <ul className="partner-list" aria-hidden={hidden || undefined}>
      {set.map((partner, i) => (
        // Første runde av settet er den ekte listen for skjermlesere, resten er gjentakelser
        <li key={`${partner.name}-${i}`} aria-hidden={!hidden && i >= partners.length ? true : undefined}>
          <Logo partner={partner} hidden={hidden || i >= partners.length} />
        </li>
      ))}
    </ul>
  );

  return (
    <section data-observe="toggle" className="partner-banner" aria-label={label}>
      <p className="container-shell partner-label">{label}</p>
      <div className="partner-marquee">
        <div className="partner-track" style={{ ["--partner-duration" as string]: `${set.length * SECONDS_PER_LOGO}s` }}>
          {list()}
          {list(true)}
        </div>
      </div>
    </section>
  );
}
