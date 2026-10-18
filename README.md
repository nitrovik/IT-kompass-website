# IT Kompass AS – nettside

Nettsiden til IT Kompass AS, bygget med Next.js. Designet følger den godkjente forhåndsvisningen i `design/reference-homepage-preview.html`. Retningslinjene står i `HANDOFF.md` og `CLAUDE.md`.

## Sider

Nettsiden er bevisst holdt til én side, pluss personvernsiden som loven krever. Eieren fjernet tjenestesidene, prosjekter, om oss, support og veiviseren i oktober 2026 for å gjøre siden enklere.

| Adresse | Innhold |
| --- | --- |
| `/` | Forside: hero med fiberanimasjon og kontaktskjema (ankeret `/#kontakt`) |
| `/personvern` | Personvernerklæring (utkast, må gjennomgås) |

## Hvor endrer jeg tekst og informasjon?

- **Kontaktinfo, org.nr., dekningsområde:** `config/site.ts`
- **Tekster på forsiden:** `content/home.ts`
- **Personvern:** `content/legal.ts`
- **Bilder:** legg dem i `public/media/` (se README der)

Felt som står tomme (telefon, e-post, adresse) blir ikke vist på nettsiden. Det står altså aldri «settes inn senere» eller lignende ute på siden.

## Kjøre lokalt

Krever Node.js 20.9 eller nyere.

```bash
npm install
npm run dev        # http://localhost:3000
```

Uten miljøvariabler går skjemaene i testmodus lokalt. Innsendinger godtas, men det sendes ingen e-post.

## Kontroll før publisering

```bash
npm run typecheck
npm run lint
npm run build
```

## Teknologi

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lenis, Zod, Resend og Cloudflare Turnstile. Skriftene Schibsted Grotesk (overskrifter) og Inter (brødtekst) ligger lokalt i `app/fonts/` (SIL Open Font License).

Fiberscenen i heroen er en egen, lett WebGL-renderer (`components/home/fiber/`). Den lastes etter at siden er vist, pauser når den ikke er synlig, og viser et statisk bilde på svake enheter, uten skjermkort og ved «redusert bevegelse». Se CLAUDE.md for detaljer.

Alt som beveger seg med scroll eller mus går i én felles bildeløkke (`lib/frame.ts`), slik at nettleseren slipper å måle siden på nytt i hvert bilde.

Lighthouse (5. oktober 2026, lokal måling, mobil, før siden ble forenklet): forsiden ytelse 94–95, undersidene 95–99. PC: 100. Tilgjengelighet, beste praksis og SEO: 100 på alle sider. Bør måles på nytt etter forenklingen.

## Publisering

Nettsiden publiseres på Railway. Steg for steg står i `PUBLISHING.md`.

## Mangler fra eier før lansering

- Telefon, e-post og adresse (`config/site.ts`)
- Gjennomgang av personvernerklæringen
- Kontoer og nøkler: Resend, Cloudflare Turnstile, og valgfritt Plausible
