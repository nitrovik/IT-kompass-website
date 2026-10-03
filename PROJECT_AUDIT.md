# IT Kompass AS – sluttkontroll

Dato: 2. oktober 2026

## Implementert

- [x] Forside
- [x] Tjenesteroversikt
- [x] Egen underside per tjeneste
- [x] Prosjekter
- [x] Nettsidepakker Start / Pro / Premium
- [x] Om oss
- [x] Support med saksskjema
- [x] Vedlegg i supportsak
- [x] Fjernhjelp-lenke som konfigurerbar verdi
- [x] Driftsstatus med adapter for live API
- [x] Kontakt med kategorier og møtebooking-plassering
- [x] Kartplassholder uten oppdiktet dekningsområde
- [x] Personvern
- [x] 404 med kompasstema
- [x] Løsningsveiviser
- [x] Server Actions
- [x] Zod-validering
- [x] Resend-klargjøring
- [x] Cloudflare Turnstile server-side validering
- [x] Plausible-klargjøring
- [x] Sitemap
- [x] robots.txt
- [x] LocalBusiness structured data med org.nr.
- [x] Reduced motion
- [x] Tastaturfokus og skip-link
- [x] Responsiv mobil-first layout
- [x] 3D-scene lazy-loades og deaktiveres på mobil, reduced motion og svakere enheter
- [x] Motion-animasjoner
- [x] GSAP ScrollTrigger-sekvens
- [x] Lenis smooth scroll
- [x] Kompass-scrollindikator
- [x] Glass-effekt i header ved scroll
- [x] Magnetiske hoved-CTA-er
- [x] Fiber-/nettverkstematikken er gjennomgående
- [x] Alt innhold ligger i datafiler under `content/`

## Bevisst ikke oppdiktet

- Faktisk logo-SVG
- Telefonnummer
- E-postadresse
- Adresse/poststed
- Dekningsområde
- Leverandør-/partnernavn
- Kundesitater
- Kvantitative resultater
- Ekte prosjektbilder
- Fjernhjelpsprodukt/-URL
- Cal.com URL

## Teknisk verifikasjon

- TypeScript/TSX er syntax-kontrollert med TypeScript-kompilatoren i arbeidsmiljøet: 55 filer, 0 parse-feil.
- `npm install` kunne ikke fullføres i arbeidsmiljøet fordi nettverk/installasjonen tidsavbrøt. Derfor er full `npm run build` ikke påstått som lokalt verifisert her.
- `package.json` er kontrollert mot tilgjengelige npm-resultater for sentrale pakker: React 19.3.0, TypeScript 7.0.2, Tailwind CSS 4.3.3, Motion 13.5.0, Lenis 1.3.26, GSAP 3.15.0, Resend 6.32.0, Zod 4.6.5, React Three Fiber 9.8.1, Drei 10.7.8, Lucide 1.47.0 og Turnstile-adapter 1.6.1.

## Publiseringskritiske steg

Før produksjon må kontaktdata, logo, område, partnerlogoer, ekte bilder, Resend, Turnstile, Cal.com, fjernhjelp og Plausible konfigureres. Se `PUBLISHING.md`.
