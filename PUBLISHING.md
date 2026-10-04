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
3. Under **Settings → Source** velger du hvilken gren som skal publiseres (normalt `main`). Hver gang den grenen oppdateres, publiserer Railway på nytt.
4. Under **Settings → Networking** trykker du **Generate Domain**. Da får du en testadresse som slutter på `.up.railway.app`.

## 2. Legg inn miljøvariabler

Legg dem inn under fanen **Variables** i tjenesten (ikke i koden). Hele listen med forklaringer står i `.env.example`.

**Påkrevd for at skjemaene skal fungere:**

- `NEXT_PUBLIC_SITE_URL` = `https://itkompass.no`
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

1. I Railway: **Settings → Networking → Custom Domain**. Legg til både `itkompass.no` og `www.itkompass.no`.
2. Railway viser hvilke DNS-poster du trenger for hvert domene. Legg dem inn **nøyaktig** slik Railway oppgir i DNS-oppsettet for `itkompass.no` hos Gigahost.
3. **Ikke rør eksisterende e-postposter** (MX, SPF osv.).
4. HTTPS ordnes automatisk når DNS er på plass. Det kan ta fra noen minutter til noen timer.

### Viktig om hoveddomenet (`itkompass.no` uten www)

Railway peker domener med en `CNAME`-post. For hoveddomenet (uten www) krever det at DNS-leverandøren støtter **ALIAS**, **ANAME** eller **CNAME-flattening**. `www` er ikke noe problem.

Sjekk i Gigahosts DNS-panel om du kan velge posttypen ALIAS eller ANAME:

- **Ja:** legg inn hoveddomenet som ALIAS/ANAME mot verdien Railway oppgir.
- **Nei:** velg ett av disse alternativene:
  - **Flytt DNS til Cloudflare (gratis).** Domenet blir fortsatt registrert hos Gigahost, du bytter bare navnetjenere. Kopier **alle** eksisterende DNS-poster (særlig e-post) til Cloudflare før du bytter.
  - **Bruk `www.itkompass.no` som hovedadresse.** Sett `NEXT_PUBLIC_SITE_URL=https://www.itkompass.no`, og be Gigahost videresende `itkompass.no` til `https://www.itkompass.no`.

## 4. Test etter publisering

- [ ] Forsiden, menyen og mobilmenyen
- [ ] Kontaktskjema på forsiden og på `/kontakt`: e-posten kommer frem
- [ ] Supportskjema med og uten vedlegg
- [ ] Veiviseren `/finn-riktig-losning` hele veien
- [ ] `https://itkompass.no/sitemap.xml` og `/robots.txt`
- [ ] En side som ikke finnes, så du ser 404-siden
- [ ] `www.itkompass.no` sender deg videre til `itkompass.no` (eller omvendt hvis www er hovedadressen)

## Valgfritt senere

- **Plausible** (besøksstatistikk uten informasjonskapsler): sett `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Personvernsiden får da et avsnitt om statistikk automatisk.
- **Møtebooking**: sett `NEXT_PUBLIC_CAL_URL`.
- **Fjernhjelp**: sett `REMOTE_HELP_URL`.
- **Driftsstatus**: sett `STATUS_API_URL`.
