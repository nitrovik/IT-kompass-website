/*
  Alt synlig innhold på forsiden. Kan flyttes til et CMS (f.eks. Sanity) senere
  uten at komponentene må skrives om. Ikke legg inn oppdiktede kunder, tall,
  priser, partnere eller kontaktopplysninger.
*/

export const homeHero = {
  eyebrow: "IT Kompass AS",
  title: ["Din lokale", "IT partner."],
  body: "Vi drifter. Du driver.",
  cta: { label: "Ta kontakt", href: "/kontakt" },
};

export const homePositioning = {
  eyebrow: "Uavhengig av leverandør",
  title: ["Behovet ditt først.", "Leverandøren etterpå."],
  body: "Vi sammenligner alternativene og anbefaler det som passer dere. Dere bestemmer selv.",
  points: [
    { title: "Objektive råd", text: "Anbefalingen bygger på behovet deres, ikke på én leverandør." },
    { title: "Mindre å følge opp", text: "Vi tar praten med leverandørene for dere." },
    { title: "Samlet oversikt", text: "Fiber, mobil og IT-avtaler på ett sted." },
    { title: "Nye behov", text: "Endrer behovet seg, ser vi på alternativene igjen." },
  ],
  // Illustrasjonen viser prinsippet. Leverandørene er bevisst anonyme, ikke bytt inn navn uten avtale.
  diagram: {
    need: "Behovet ditt",
    hub: "IT Kompass",
    options: ["Alternativ A", "Alternativ B", "Alternativ C", "Alternativ D"],
    chosen: 2,
    result: "Riktig valg",
    caption: "Behovet avgjør hvilket alternativ du får anbefalt.",
  },
};

export const homeProcess = {
  eyebrow: "Slik jobber vi",
  title: ["Fra første prat", "til ferdig oppsett."],
  body: "Du forteller hva dere trenger. Vi tar oss av resten.",
  steps: [
    { number: "01", title: "Kartlegging", text: "Vi går gjennom hva dere har og hva dere trenger." },
    { number: "02", title: "Anbefaling", text: "Du får et konkret forslag." },
    { number: "03", title: "Oppsett", text: "Vi bestiller, installerer og setter alt opp." },
    { number: "04", title: "Oppfølging", text: "Du ringer oss når noe skjer eller må endres." },
  ],
};

export const homeWizardCta = {
  eyebrow: "Veiviser",
  title: "Finn riktig løsning.",
  body: "Svar på tre spørsmål og få en anbefaling. Velg hva det gjelder:",
  cta: { label: "Start veiviseren", href: "/finn-riktig-losning" },
};

export const homeContact = {
  eyebrow: "Kontakt",
  title: "Fortell oss hva dere trenger.",
  body: "Skriv noen ord om hva det gjelder, så tar vi kontakt.",
  formTitle: "Send en melding",
  mapTitle: "Hvor vi jobber",
  mapFallback: "Skriv hvor dere holder til, så sier vi fra om vi dekker området.",
};
