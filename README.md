# IT Kompass AS – nettside

Nettsiden til IT Kompass AS, bygget med Next.js. Designet følger den godkjente forhåndsvisningen i `design/reference-homepage-preview.html`. Retningslinjene står i `HANDOFF.md` og `CLAUDE.md`.

## Sider

| Adresse | Innhold |
| --- | --- |
| `/` | Forside: hero med fiberanimasjon, tjenester, leverandøruavhengig, prosess, nettsider/pakker, veiviser og kontakt |
| `/tjenester` og `/tjenester/[tjeneste]` | Oversikt og egen side for WiFi, fiber og telecom, IT support og nettsider |
| `/prosjekter` | Prosjekter (vises når ekte prosjekter er lagt inn) og nettsidepakkene Start / Pro / Premium |
| `/om-oss` | Om IT Kompass |
| `/support` | Supportskjema med vedlegg. Fjernhjelp og driftsstatus vises når de er koblet til |
| `/kontakt` | Kontaktskjema, kontaktinfo, møtebooking (når lenke er satt) og kartplassholder |
| `/finn-riktig-losning` | Veiviser med tre spørsmål som gir en anbefaling og sender en forespørsel |
| `/personvern` | Personvernerklæring (utkast, må gjennomgås) |

## Hvor endrer jeg tekst og informasjon?

- **Kontaktinfo, org.nr., dekningsområde:** `config/site.ts`
- **Tekster på forsiden:** `content/home.ts`
- **Tjenestene:** `content/services.ts`
- **Prosjekter og nettsidepakker:** `content/projects.ts`
- **Veiviseren:** `content/wizard.ts`
- **Personvern:** `content/legal.ts`
- **Bilder:** legg dem i `public/media/` (se README der)

Felt som står tomme (telefon, e-post, adresse, booking, fjernhjelp) blir ikke vist på nettsiden. Det står altså aldri «settes inn senere» eller lignende ute på siden.

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

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, Lenis, Zod, Resend og Cloudflare Turnstile. Fonten Inter ligger lokalt i `app/fonts/` (SIL Open Font License).

Fiberanimasjonen er SVG og CSS. Den er statisk på mobil og når brukeren har slått på «redusert bevegelse».

Lighthouse (3. oktober 2026): mobil ytelse 95, PC ytelse 100, tilgjengelighet 100, beste praksis 100, SEO 100.

## Publisering

Nettsiden publiseres på Railway. Steg for steg står i `PUBLISHING.md`.

## Mangler fra eier før lansering

- Telefon, e-post og adresse (`config/site.ts`)
- Dekningsområde (`config/site.ts` → `coverageArea`)
- Ekte bilde til «Leverandøruavhengig»-seksjonen og eventuelle prosjekter
- Priser på nettsidepakkene (står nå som «Pris kommer»)
- Gjennomgang av personvernerklæringen
- Kontoer og nøkler: Resend, Cloudflare Turnstile, og valgfritt Plausible, Cal.com og fjernhjelp
