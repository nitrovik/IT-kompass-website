/*
  Alt synlig innhold på forsiden. Kan flyttes til et CMS (f.eks. Sanity) senere
  uten at komponentene må skrives om. Ikke legg inn oppdiktede kunder, tall,
  priser, partnere eller kontaktopplysninger.
*/

export const homeHero = {
  eyebrow: "IT Kompass AS",
  title: ["Din lokale", "IT partner."],
  body: "Vi drifter. Du driver.",
  cta: { label: "Ta kontakt", href: "/#kontakt" },
};

export const homePositioning = {
  eyebrow: "Behovet avgjør",
  title: ["Riktig valg", "for bedriften din."],
  body: "Vi ser på alternativene og anbefaler det som passer dere best. Dere bestemmer selv.",
  points: [
    { title: "Objektive råd", text: "Anbefalingen bygger på behovet deres, ikke på én leverandør." },
    { title: "Mindre å følge opp", text: "Du slipper å ta kontakten selv. Vi gjør det for dere." },
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

export const homeContact = {
  eyebrow: "Kontakt",
  title: "Fortell oss hva dere trenger.",
  body: "Skriv noen ord om hva det gjelder, så tar vi kontakt.",
  formTitle: "Send en melding",
};
