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
- **Partnere (vises bare når listen ikke er tom):** `content/partners.ts`
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

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, Lenis, Zod, Resend og Cloudflare Turnstile. Skriftene Schibsted Grotesk (overskrifter) og Inter (brødtekst) ligger lokalt i `app/fonts/` (SIL Open Font License).

Fiberscenen i heroen er en egen, lett WebGL-renderer (`components/home/fiber/`). Den lastes etter at siden er vist, pauser når den ikke er synlig, og viser et statisk bilde på svake enheter, uten skjermkort og ved «redusert bevegelse». Se CLAUDE.md for detaljer.

Lighthouse (4. oktober 2026, mobil): forsiden ytelse 95, undersidene 94–99. PC: 100. Tilgjengelighet, beste praksis og SEO: 100 på alle sider.

## Publisering

Nettsiden publiseres på Railway. Steg for steg står i `PUBLISHING.md`.

## Mangler fra eier før lansering

- Telefon, e-post og adresse (`config/site.ts`)
- Dekningsområde (`config/site.ts` → `coverageArea`)
- Ekte bilde til «Leverandøruavhengig»-seksjonen og eventuelle prosjekter
- Priser på nettsidepakkene (står nå som «Pris kommer»)
- Gjennomgang av personvernerklæringen
- Kontoer og nøkler: Resend, Cloudflare Turnstile, og valgfritt Plausible, Cal.com og fjernhjelp
