# Publisering

Nettsiden bruker Next.js med serverfunksjoner for skjemaene. Den trenger derfor en vertstjeneste som kjører Next.js. Et vanlig statisk webhotell er ikke nok.

## 1. Velg vertstjeneste

Nettsiden er kommersiell, så tjenesten må tillate kommersiell bruk.

| Tjeneste | Kommersiell bruk | Merknad |
| --- | --- | --- |
| **Vercel Pro** | Ja | Laget av dem som lager Next.js. Gratisplanen (Hobby) er bare for ikke-kommersiell bruk. |
| **Netlify** | Ja, også på gratisplanen | Støtter Next.js godt. Nye Next.js-funksjoner kommer av og til litt senere enn hos Vercel. |

Begge kobles til GitHub-repoet og publiserer automatisk når `main` oppdateres. Sjekk gjeldende priser og vilkår hos tjenesten før du velger.

## 2. Koble til GitHub

1. Opprett konto hos tjenesten og velg «Import project» / «Add new site» fra GitHub.
2. Velg repoet `nitrovik/IT-kompass-website`.
3. Tjenesten kjenner igjen Next.js automatisk. Byggekommando: `npm run build`.

## 3. Legg inn miljøvariabler

Legg dem inn i tjenestens kontrollpanel (ikke i koden). Hele listen med forklaringer står i `.env.example`.

**Påkrevd for at skjemaene skal fungere:**

- `NEXT_PUBLIC_SITE_URL` = `https://itkompass.no`
- `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_RECIPIENT`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

Mangler Turnstile-nøklene, avviser skjemaene alle innsendinger i produksjon. Det er med vilje, for å stoppe spam.

Når du har lagt inn eller endret variabler, må nettsiden publiseres på nytt («Redeploy») før endringen virker.

### Resend (e-post)

1. Opprett konto på resend.com og legg til domenet `itkompass.no`.
2. Resend gir deg noen DNS-poster (SPF/DKIM). Legg dem inn hos Gigahost (se punkt 4).
3. Lag en API-nøkkel og lim den inn som `RESEND_API_KEY`.

### Cloudflare Turnstile (spamvern)

1. Opprett gratis konto hos Cloudflare og åpne «Turnstile».
2. Legg til et nettsted for `itkompass.no` (og gjerne vertstjenestens testadresse).
3. Kopier «Site key» til `NEXT_PUBLIC_TURNSTILE_SITE_KEY` og «Secret key» til `TURNSTILE_SECRET_KEY`.

## 4. Koble domenet hos Gigahost

Domenet kan bli liggende hos Gigahost.

1. Legg til `itkompass.no` og `www.itkompass.no` hos vertstjenesten. Den viser hvilke DNS-poster du trenger.
2. Logg inn hos Gigahost, åpne DNS for `itkompass.no` og legg inn postene **nøyaktig** slik vertstjenesten oppgir dem (vanligvis en `A`-post for `@` og en `CNAME` for `www`).
3. **Ikke rør eksisterende e-postposter** (MX, SPF osv.), med mindre du vet at de skal endres.
4. HTTPS ordnes automatisk når DNS er på plass. Det kan ta fra noen minutter til noen timer.

## 5. Test etter publisering

- [ ] Forsiden, menyen og mobilmenyen
- [ ] Kontaktskjema på forsiden og på `/kontakt`: e-posten kommer frem
- [ ] Supportskjema med og uten vedlegg
- [ ] Veiviseren `/finn-riktig-losning` hele veien
- [ ] `https://itkompass.no/sitemap.xml` og `/robots.txt`
- [ ] En side som ikke finnes, så du ser 404-siden
- [ ] Både `www.itkompass.no` og `itkompass.no` havner på samme side

## Valgfritt senere

- **Plausible** (besøksstatistikk uten informasjonskapsler): sett `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Personvernsiden får da et avsnitt om statistikk automatisk.
- **Møtebooking**: sett `NEXT_PUBLIC_CAL_URL`.
- **Fjernhjelp**: sett `REMOTE_HELP_URL`.
- **Driftsstatus**: sett `STATUS_API_URL`.
