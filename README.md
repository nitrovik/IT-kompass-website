# IT Kompass AS – komplett nettsted

Dette prosjektet er den komplette implementasjonen av nettstedet til IT Kompass AS, bygget videre fra fase 2 og 3.

## Teknologi

- Next.js 16 App Router
- React 19
- TypeScript 7
- Tailwind CSS 4
- shadcn/ui mønster
- Motion for komponentanimasjoner
- GSAP klar for scrollsekvenser
- Lenis for myk scrolling
- React Three Fiber + Drei for hero-scene
- Zod for server-side validering
- Resend for e-post
- Cloudflare Turnstile for spamvern
- Plausible for personvernvennlig analyse

Pakken er låst på versjoner kontrollert 2. oktober 2026. React 19.3.0, TypeScript 7.0.2, Lenis 1.3.26, GSAP 3.15.0, Resend 6.32.0, Zod 4.6.5 og Turnstile-adapteren 1.6.1 er de versjonene som er definert i `package.json`.

## Faser som nå er med

### Fase 1
Visuell retning, designsystem og sidekart.

### Fase 2
Felles layout, design tokens, responsiv header/footer, reduced motion og prosjektgrunnlag.

### Fase 3
Komplett forside med hero, fiber/kompass-tema, tjenestekort, arbeidsprosess og nettsideutstilling.

### Fase 4
Alle hovedundersider:

- Tjenester
- Egen side for hver tjeneste
- Prosjekter
- Nettsidepakker Start / Pro / Premium
- Om oss
- Support
- Kontakt
- Personvern
- 404

### Fase 5
Server Actions, Zod, Resend, Turnstile, supportskjema med vedlegg, løsningsveiviser, metadata, sitemap, robots, LocalBusiness structured data og Plausible-integrasjon.

### Fase 6
README, sluttkontroll og produksjonsforberedelser.

### Fase 7
Publiseringsguide og Gigahost-domeneoppsett. Se `PUBLISHING.md`.

## Start lokalt

Node.js 20.9+ anbefales.

```bash
npm install
npm run dev
```

## Produksjonskontroll

```bash
npm run typecheck
npm run lint
npm run build
```

## Miljøvariabler

Kopier `.env.example` til `.env.local` og fyll inn verdier før produksjon.

Viktigst:

- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `CONTACT_RECIPIENT`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_CAL_URL`
- `REMOTE_HELP_URL`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

## Logo

Legg den faktiske SVG-logoen i:

`public/brand/logo.svg`

Header/footer er nå bygd med en kompakt kompassmarkering slik at prosjektet fungerer før logoen legges inn. Når logoen er levert, byttes markeringen i `components/layout/site-header.tsx` og ved behov i footer.

## Ekte bilder og partnere

Prosjektet bruker bevisst bildeplassholdere. Ikke fyll disse med stockbilder. Legg inn ekte prosjektbilder i `public/media/` og bytt inn i prosjektdataene.

Partnerseksjonen bruker kun nøytrale plassholdere. Legg kun inn leverandører dere faktisk har avtale med.

## Kontaktinformasjon

Telefon, e-post og adresse er ikke oppdiktet. Sett verdier i `config/site.ts` før publisering.

## Driftstatus

`content/status.ts` er en adapterklar statisk modell. Når valgt driftsleverandør tilbyr et status-API, kan data hentes fra en server-side adapter uten å endre UI-et.

## Headless CMS senere

Alt synlig innhold ligger i `content/` og kan migreres til Sanity senere uten omskriving av sidekomponentene.

## Framtidige utvidelser

Arkitekturen er lagt opp slik at følgende kan legges til senere:

- Kundeportal og innlogging
- Supportsaker per kunde
- Blogg
- Adressesjekk for fiber
- Chat
- Engelsk versjon

## Viktig om manglende kildedata

Logo-SVG, faktisk dekningsområde, telefon, e-post, adresse, bekreftede partnerlogoer, ekte prosjektbilder og reell møte-/fjernhjelpslenke er ikke oppgitt i arbeidsgrunnlaget. Prosjektet inneholder derfor ikke oppdiktede verdier. Disse feltene er sentralisert og klare for innsetting før publisering.

## Design handoff
The current approved visual direction and Claude Code instructions are in:
- `CLAUDE.md`
- `HANDOFF.md`
- `CLAUDE_FIRST_PROMPT.md`
- `START_HER.md`
- `reference-homepage-preview.html`
