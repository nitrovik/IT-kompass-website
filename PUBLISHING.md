# Publisering på Railway

Nettsiden kjører som en Next.js-server på [Railway](https://railway.com). Domenet `itkompass.no` kan bli liggende hos Gigahost.

Prosjektet er allerede satt opp for Railway:

- `railway.json` sier hvordan siden bygges (`npm run build`) og startes (`npm run start`), og at Railway skal sjekke at forsiden svarer før en ny versjon tas i bruk.
- `npm run start` bruker automatisk porten Railway gir (`PORT`).
- `package.json` låser Node.js til versjon 20–24.
- Besøk på den andre varianten av domenet (med eller uten `www`) sendes automatisk videre til hovedadressen i `NEXT_PUBLIC_SITE_URL`.

## 1. Opprett prosjektet

1. Logg inn på railway.com med GitHub-kontoen din. En bedriftsside trenger et betalt abonnement. Sjekk gjeldende pris og vilkår hos Railway.
2. Velg **New Project → Deploy from GitHub repo** og velg `nitrovik/IT-kompass-website`.
3. Under **Settings → Source** velger du grenen `main`. Hver gang `main` oppdateres, publiserer Railway på nytt.
   - Slå gjerne på **Wait for CI**. Da venter Railway på den automatiske kontrollen i GitHub (`.github/workflows/ci.yml`), så en versjon med feil aldri går live.
4. Under **Settings → Networking** trykker du **Generate Domain**. Da får du en testadresse som slutter på `.up.railway.app`.

## 2. Legg inn miljøvariabler

Legg dem inn under fanen **Variables** i tjenesten (ikke i koden). Hele listen med forklaringer står i `.env.example`.

**Påkrevd for at skjemaene skal fungere:**

- `NEXT_PUBLIC_SITE_URL` = `https://www.itkompass.no` (kan også stå tom: www er standard i koden)
- `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_RECIPIENT`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

Mangler Turnstile-nøklene, avviser skjemaene alle innsendinger. Det er med vilje, for å stoppe spam.

Railway publiserer på nytt når du endrer variabler. Variabler som starter med `NEXT_PUBLIC_` bakes inn når siden bygges, så de virker først etter neste publisering.

### Resend (e-post)

1. Opprett konto på resend.com og legg til domenet `itkompass.no`.
2. Resend gir deg noen DNS-poster (SPF/DKIM). Legg dem inn hos Gigahost.
3. Lag en API-nøkkel og lim den inn som `RESEND_API_KEY`.

### Cloudflare Turnstile (spamvern)

1. Opprett gratis konto hos Cloudflare og åpne **Turnstile**.
2. Legg til et nettsted med disse vertsnavnene: `itkompass.no`, `www.itkompass.no` og testadressen fra Railway (`…up.railway.app`).
3. Kopier **Site key** til `NEXT_PUBLIC_TURNSTILE_SITE_KEY` og **Secret key** til `TURNSTILE_SECRET_KEY`.

## 3. Koble domenet

Hovedadressen er **`www.itkompass.no`**.

1. I Railway: **Settings → Networking → Custom Domain**. Legg til `www.itkompass.no`.
2. Railway viser en `CNAME`-post (og eventuelt en `TXT`-post for bekreftelse). Legg dem inn **nøyaktig** slik Railway oppgir i DNS-oppsettet for `itkompass.no` hos Gigahost, med navnet `www`.
3. Sett opp videresending hos Gigahost fra `itkompass.no` til `https://www.itkompass.no`.
4. **Ikke rør eksisterende e-postposter** (MX, SPF osv.).
5. HTTPS ordnes automatisk når DNS er på plass. Det kan ta fra noen minutter til noen timer.

### Hvorfor www (oktober 2026)

Railway peker domener med en `CNAME`-post. Gigahost avviser `CNAME` på domenet uten www («A CNAME record cannot be placed at the zone apex»), og har ikke ALIAS/ANAME. Derfor er `www.itkompass.no` hovedadressen, og `itkompass.no` videresendes dit hos Gigahost. Nettsiden sender også selv besøk på `itkompass.no` videre til www, hvis de skulle nå Railway.

Vil dere heller bruke adressen uten www senere, må DNS flyttes til en leverandør med CNAME-flattening (for eksempel Cloudflare, gratis), og `NEXT_PUBLIC_SITE_URL` settes til `https://itkompass.no`. Kopier **alle** eksisterende DNS-poster (særlig e-post) før navnetjenerne byttes.

## 4. Test etter publisering

- [ ] Forsiden, menyen og mobilmenyen
- [ ] Kontaktskjema på forsiden og på `/kontakt`: e-posten kommer frem
- [ ] Supportskjema med og uten vedlegg
- [ ] Veiviseren `/finn-riktig-losning` hele veien
- [ ] `https://www.itkompass.no/sitemap.xml` og `/robots.txt`
- [ ] En side som ikke finnes, så du ser 404-siden
- [ ] `itkompass.no` sender deg videre til `https://www.itkompass.no`

## Slik oppdateres nettsiden senere

Endringer gjøres på en egen gren og samles i en «pull request» mot `main` på GitHub. Den automatiske kontrollen bygger og sjekker siden. Når alt er grønt og du trykker **Merge**, publiserer Railway den nye versjonen.

## Valgfritt senere

- **Plausible** (besøksstatistikk uten informasjonskapsler): sett `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Personvernsiden får da et avsnitt om statistikk automatisk.
- **Møtebooking**: sett `NEXT_PUBLIC_CAL_URL`.
- **Fjernhjelp**: sett `REMOTE_HELP_URL`.
- **Driftsstatus**: sett `STATUS_API_URL`.
