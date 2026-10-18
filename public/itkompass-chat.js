/*!
 * IT Kompass chat-assistent  ·  v1.0
 * En enkel FAQ-bot med kontaktskjema. Ingen server, ingen AI, ingen informasjonskapsler.
 *
 * Installasjon: legg denne linjen rett før </body> på nettsiden:
 *   <script src="/itkompass-chat.js" defer></script>
 *
 * Valgfritt oppsett (legg FØR linjen over):
 *   <script>window.ITKompassChat = { primaryColor: "#123b6d" };</script>
 *
 * Alle svar og knapper ligger i KNOWLEDGE lenger ned. Endre tekstene der.
 */
(function () {
  "use strict";
  if (window.__itkChatLoaded) return;
  window.__itkChatLoaded = true;

  /* ------------------------------------------------------------------ *
   * 1. OPPSETT – kan overstyres med window.ITKompassChat = { ... }
   * ------------------------------------------------------------------ */
  var DEFAULTS = {
    brandName: "IT Kompass",
    botName: "Kompass-assistenten",
    logoUrl: "/brand/it-kompass-logo-web-opt.png", // vises i toppen, faller tilbake til «IK» hvis bildet mangler
    primaryColor: "#0a6ed1", // knapper, topplinje, dine meldinger
    accentColor: "#2aa6ff", // lenker og fokusmarkering
    position: "right", // "right" eller "left"
    fontFamily: "", // tom = samme skrift som nettsiden
    privacyUrl: "/personvern",

    // Hvordan henvendelsen sendes:
    //  "auto"     – bruk endpoint hvis satt, ellers sidens eget kontaktskjema
    //  "siteForm" – fyll ut og send sidens eget kontaktskjema (#kontakt)
    //  "endpoint" – POST til endpoint (f.eks. Formspree eller Web3Forms)
    leadMode: "auto",
    endpoint: "",
    endpointExtra: {}, // ekstra felt i POST, f.eks. { access_key: "..." } for Web3Forms
    siteFormSelector: "#kontakt form",

    // Liten «Trenger du hjelp?»-boble etter X sekunder (0 = av). Vises én gang per økt.
    teaserDelaySeconds: 12,
    teaserText: "Hei! Lurer du på noe om IT eller telecom? 👋",

    // Kategoriene i sidens kontaktskjema (må matche nedtrekkslisten)
    categories: ["Fiber/WiFi", "Mobil", "IT support", "Utstyr", "Installasjoner", "Nettsider"],
  };
  var CFG = Object.assign({}, DEFAULTS, window.ITKompassChat || {});

  /* ------------------------------------------------------------------ *
   * 2. KUNNSKAPSBASE – endre svarene her
   *    title:     teksten på knappen
   *    keywords:  ord som utløser svaret når noen skriver fritt
   *    answer:    svaret. **fet tekst** og [lenketekst](https://...) støttes
   *    category:  forhåndsvalgt kategori hvis kunden vil bli kontaktet
   *    next:      forslag som vises etter svaret
   * ------------------------------------------------------------------ */
  var KNOWLEDGE = [
    {
      id: "om",
      title: "Hva gjør IT Kompass?",
      keywords: ["hva gjør", "hvem er", "om dere", "om firmaet", "it kompass", "tjenester", "tilbyr", "hva kan dere", "partner"],
      answer:
        "Vi er en lokal IT- og telecompartner for bedrifter i Viken og resten av Norge.\n\nVi sammenligner leverandørene og anbefaler det som passer behovet deres, og dere får **én fast kontaktperson** for fiber, mobil og IT. Kort sagt: **vi drifter, du driver.**",
      next: ["tjenester", "leverandor", "kontakt"],
    },
    {
      id: "tjenester",
      title: "Hvilke tjenester har dere?",
      keywords: ["tjeneste", "tjenester", "produkter", "hva leverer", "oversikt", "alt dere"],
      answer:
        "Dette kan vi hjelpe med:\n\n• **Fiber, bredbånd og WiFi**\n• **Mobil og telecom** (abonnementer og sentralbord)\n• **IT-drift og support**\n• **IT-sikkerhet**\n• **Utstyr og installasjon**\n• **Nettsider**\n• **AI og automatisering**\n\nVelg et område under, så forteller jeg mer.",
      next: ["fiber", "mobil", "drift", "sikkerhet", "utstyr", "nettsider", "ai"],
    },
    {
      id: "fiber",
      title: "Fiber, bredbånd og WiFi",
      keywords: ["fiber", "bredbånd", "bredband", "internett", "nett", "wifi", "wi-fi", "trådløst", "tradlost", "dekning", "hastighet", "linje", "router", "ruter", "4g", "5g", "nettverk", "treg"],
      answer:
        "Vi sjekker hvilke leverandører som kan levere fiber eller bredbånd på adressen deres, sammenligner tilbudene og anbefaler det som passer. Vi tar også kontakten med leverandøren, så dere slipper.\n\nHar dere dårlig WiFi på kontoret, kan vi se på dekningen og hvilket utstyr som trengs.",
      category: "Fiber/WiFi",
      next: ["bytte", "pris", "kontakt"],
    },
    {
      id: "mobil",
      title: "Mobil og telecom",
      keywords: ["mobil", "mobilabonnement", "abonnement", "telefon", "telefoni", "sentralbord", "svarmeny", "telecom", "telekom", "simkort", "sim", "ringe", "nummer", "bedriftsmobil", "datapakke"],
      answer:
        "Vi hjelper med **mobilabonnementer til de ansatte** og **sentralbord og bedriftstelefoni**. Vi ser på hvordan dere bruker telefonen i dag, sammenligner alternativene og samler avtalene, så dere har full oversikt på ett sted.",
      category: "Mobil",
      next: ["bytte", "pris", "kontakt"],
    },
    {
      id: "drift",
      title: "IT-drift og support",
      keywords: ["support", "drift", "driftsavtale", "vedlikehold", "hjelp med pc", "feil", "problem", "virker ikke", "fungerer ikke", "brukere", "microsoft", "365", "office", "e-post", "epost", "outlook", "teams", "oppdatering", "it-avdeling", "helpdesk"],
      answer:
        "Vi kan ta ansvaret for den daglige IT-en: brukere og tilganger, oppdateringer, e-post og Microsoft 365, og hjelp når noe ikke virker. Dere får en fast kontaktperson som kjenner oppsettet deres, i stedet for å ringe en ny kundeservice hver gang.",
      category: "IT support",
      next: ["sikkerhet", "pris", "kontakt"],
    },
    {
      id: "sikkerhet",
      title: "IT-sikkerhet",
      keywords: ["sikkerhet", "sikker", "sikre", "hacking", "hacket", "virus", "antivirus", "løsepengevirus", "ransomware", "phishing", "svindel", "backup", "sikkerhetskopi", "tofaktor", "2fa", "passord", "brannmur", "gdpr", "angrep"],
      answer:
        "De fleste angrep mot små bedrifter starter med en svindel-e-post eller et lekket passord. Vi kan gå gjennom det viktigste sammen med dere:\n\n• Tofaktorpålogging\n• Sikkerhetskopi (backup)\n• Oppdateringer\n• Beskyttelse av e-post og maskiner\n• Sikkert nettverk\n\nMålet er et nivå som passer bedriften, ikke mest mulig.",
      category: "IT support",
      next: ["drift", "kontakt"],
    },
    {
      id: "utstyr",
      title: "Utstyr og installasjon",
      keywords: ["utstyr", "pc", "datamaskin", "laptop", "bærbar", "barbar", "skjerm", "skriver", "printer", "maskinvare", "installasjon", "installere", "montering", "kabling", "nytt kontor", "flytte", "flytting", "oppsett"],
      answer:
        "Vi skaffer utstyret dere trenger, som PC-er, skjermer, nettverksutstyr og skrivere, og sørger for at det blir **satt opp og installert**. Det gjelder også ved flytting eller nytt kontor.",
      category: "Utstyr",
      next: ["drift", "kontakt"],
    },
    {
      id: "nettsider",
      title: "Nettsider",
      keywords: ["nettside", "nettsider", "hjemmeside", "webside", "website", "nettbutikk", "webshop", "shopify", "wordpress", "domene", "design", "seo", "google"],
      answer:
        "Vi lager nettsider for bedrifter: moderne, raske og enkle å oppdatere. Vi kan også hjelpe med nettbutikk, domene og e-post på eget domene.",
      category: "Nettsider",
      next: ["pris", "kontakt"],
    },
    {
      id: "ai",
      title: "AI og automatisering",
      keywords: ["ai", "kunstig intelligens", "automatisering", "automatisere", "chatbot", "chatgpt", "copilot", "robot", "integrasjon", "integrasjoner", "effektivisere", "manuelt", "tidstyv"],
      answer:
        "Mye av det manuelle arbeidet i en bedrift kan automatiseres, for eksempel å flytte data mellom systemer, sortere henvendelser eller lage rapporter. Vi kan se på hvor dere bruker mest tid og foreslå løsninger med AI og automatisering som faktisk sparer timer.",
      category: "IT support",
      next: ["kontakt"],
    },
    {
      id: "pris",
      title: "Hva koster det?",
      keywords: ["pris", "priser", "koster", "kostnad", "kost", "billig", "dyr", "dyrt", "betale", "faktura", "tilbud", "budsjett", "spare", "billigere", "kroner", "kr"],
      answer:
        "Det avhenger av hva dere trenger, så vi har ingen fast prisliste. Vi ser først på behovet og dagens avtaler, og gir dere deretter et konkret forslag. **Dere bestemmer selv** om dere vil gå videre.",
      next: ["leverandor", "kontakt"],
    },
    {
      id: "leverandor",
      title: "Er dere bundet til én leverandør?",
      keywords: ["leverandør", "leverandor", "leverandører", "uavhengig", "objektiv", "nøytral", "noytral", "bundet", "telenor", "telia", "ice", "globalconnect", "altibox", "sammenligne", "sammenligner"],
      answer:
        "Nei. Anbefalingen bygger på **behovet deres**, ikke på én bestemt leverandør. Vi ser på alternativene, forklarer forskjellene og anbefaler det som passer best. Endrer behovet seg senere, ser vi på alternativene på nytt.",
      next: ["bytte", "kontakt"],
    },
    {
      id: "bytte",
      title: "Hvordan foregår et bytte?",
      keywords: ["hvordan bytt", "bytte leverandør", "bytte til", "bytte", "bytter", "skifte", "flytte avtale", "overgang", "si opp", "oppsigelse", "binding", "bindingstid", "hvor lang tid", "hvordan foregår", "prosess", "komme i gang", "starte"],
      answer:
        "Enkelt forklart:\n\n1. Dere forteller hva dere trenger.\n2. Vi ser på dagens avtaler og alternativene.\n3. Dere får en anbefaling og bestemmer selv.\n4. Vi tar kontakten med leverandørene og følger opp.\n\nDere har **mindre å følge opp**, og én person å forholde dere til.",
      next: ["kontakt"],
    },
    {
      id: "omrade",
      title: "Hvor holder dere til?",
      weight: 0.75, // stedsnavn skal ikke overstyre selve spørsmålet («fiber på Hønefoss»)
      keywords: ["holder dere til", "hvor er dere", "hvor ligger", "har dere kontor", "kontor i", "hvor", "område", "omrade", "lokal", "lokale", "viken", "buskerud", "ringerike", "hønefoss", "honefoss", "oslo", "drammen", "akershus", "norge", "kontoradresse", "adresse", "besøk"],
      answer:
        "Vi hjelper bedrifter i **Viken og hele Norge**. Mye kan ordnes digitalt, og vi kommer gjerne innom når det trengs.",
      next: ["kontakt"],
    },
  ];

  var START_TOPICS = ["om", "fiber", "mobil", "drift", "pris"];

  // Ord som betyr «jeg vil snakke med noen»
  var CONTACT_WORDS = ["kontakt", "kontakte", "ring meg", "ringe meg", "snakke med", "menneske", "selger", "rådgiver", "radgiver", "møte", "mote", "befaring", "bli kontaktet", "ta kontakt", "send melding", "henvendelse", "kontaktskjema", "tilbud på", "ring"];
  var GREETING_WORDS = ["hei", "hallo", "heisann", "hey", "hi", "god morgen", "god dag", "god kveld", "halla", "yo"];
  var THANKS_WORDS = ["takk", "tusen takk", "takker", "flott", "supert", "perfekt", "bra"];

  /* ------------------------------------------------------------------ *
   * 3. HJELPEFUNKSJONER
   * ------------------------------------------------------------------ */
  var STORE_KEY = "itk-chat-v1";
  function storeGet() {
    try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || "null"); } catch (e) { return null; }
  }
  function storeSet(v) {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (e) { /* privat modus o.l. */ }
  }
  function byId(id) {
    for (var i = 0; i < KNOWLEDGE.length; i++) if (KNOWLEDGE[i].id === id) return KNOWLEDGE[i];
    return null;
  }
  function normalize(s) {
    return (" " + String(s || "").toLowerCase()
      .replace(/[“”«»"'’!?.,;:()\[\]{}\/\\]/g, " ")
      .replace(/\s+/g, " ") + " ");
  }
  function levenshtein(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }
  // Treff på hele ord/fraser, med litt toleranse for skrivefeil på lange ord
  function phraseHit(text, words, phrase) {
    if (phrase.indexOf(" ") !== -1) return text.indexOf(" " + phrase + " ") !== -1 || text.indexOf(" " + phrase) !== -1;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w === phrase) return true;
      if (phrase.length >= 5 && w.indexOf(phrase) === 0) return true; // «fiberen» → «fiber»
      if (phrase.length >= 6 && levenshtein(w, phrase) <= 1) return true; // «brednbånd» → «bredbånd»
    }
    return false;
  }
  function anyHit(text, list) {
    var words = text.trim().split(" ");
    for (var i = 0; i < list.length; i++) if (phraseHit(text, words, list[i])) return true;
    return false;
  }
  function findTopic(input) {
    var text = normalize(input);
    var words = text.trim().split(" ");
    var best = null, bestScore = 0;
    KNOWLEDGE.forEach(function (t) {
      var score = 0, used = {};
      t.keywords.forEach(function (k) {
        if (k.indexOf(" ") !== -1) { if (phraseHit(text, words, k)) score += 3; return; }
        // Hvert ord teller bare én gang per tema (unngår dobbeltelling av «hønefoss»/«honefoss»)
        for (var i = 0; i < words.length; i++) {
          if (used[i]) continue;
          if (phraseHit(text, [words[i]], k)) { used[i] = true; score += k.length >= 5 ? 2 : 1.5; break; }
        }
      });
      score *= t.weight || 1;
      if (score > bestScore) { bestScore = score; best = t; }
    });
    return bestScore >= 1.5 ? best : null;
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  // Trygg mini-markdown: **fet**, [lenke](url) og linjeskift. Ingen innerHTML.
  function renderRich(text) {
    var frag = document.createDocumentFragment();
    var re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|\n/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (m[1]) frag.appendChild(el("strong", { text: m[1] }));
      else if (m[2]) {
        var href = /^(https?:\/\/|\/|#|mailto:|tel:)/.test(m[3]) ? m[3] : "#";
        var a = el("a", { href: href, text: m[2] });
        if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
        frag.appendChild(a);
      } else frag.appendChild(el("br"));
      last = re.lastIndex;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * 4. UTSEENDE (Shadow DOM, så sidens CSS ikke påvirker boten og omvendt)
   * ------------------------------------------------------------------ */
  // Bruker sidens egen skrifttype, med systemskrift som reserve
  function pageFont() {
    if (CFG.fontFamily) return CFG.fontFamily;
    var f = "";
    try { f = window.getComputedStyle(document.body).fontFamily || ""; } catch (e) {}
    if (!f || /^["']?times/i.test(f)) f = "";
    return (f ? f + "," : "") + "system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif";
  }
  function buildStyles() { return "\
:host{all:initial;font-family:inherit}\
*{box-sizing:border-box}\
.wrap{--p:" + CFG.primaryColor + ";--a:" + CFG.accentColor + ";--bg:#f8fbff;--card:#ffffff;--ink:#14213d;--muted:#5b6b82;--line:#dbe4f0;\
font-family:" + pageFont() + ";font-size:15px;line-height:1.45;color:var(--ink);\
position:fixed;bottom:calc(20px + env(safe-area-inset-bottom,0px));" + (CFG.position === "left" ? "left" : "right") + ":calc(20px + env(safe-area-inset-" + (CFG.position === "left" ? "left" : "right") + ",0px));z-index:2147483000}\
.launcher{all:unset;cursor:pointer;width:60px;height:60px;border-radius:50%;background:var(--p);color:#fff;display:grid;place-items:center;\
box-shadow:0 8px 24px rgba(18,59,109,.35);transition:transform .15s ease}\
.launcher:hover{transform:scale(1.06)}\
.launcher:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:3px solid var(--a);outline-offset:2px}\
.launcher svg{width:28px;height:28px}\
.badge{position:absolute;top:-2px;" + (CFG.position === "left" ? "left" : "right") + ":-2px;width:16px;height:16px;border-radius:50%;background:#e5484d;border:2px solid #fff}\
.teaser{position:absolute;bottom:72px;" + (CFG.position === "left" ? "left" : "right") + ":0;width:max-content;max-width:260px;background:var(--card);color:var(--ink);\
padding:12px 34px 12px 14px;border-radius:14px;box-shadow:0 8px 28px rgba(20,33,61,.18);border:1px solid var(--line);cursor:pointer;animation:pop .25s ease}\
.teaser .x{all:unset;cursor:pointer;position:absolute;top:6px;right:8px;width:22px;height:22px;display:grid;place-items:center;color:var(--muted);border-radius:6px;font-size:16px}\
.panel{position:absolute;bottom:76px;" + (CFG.position === "left" ? "left" : "right") + ":0;width:380px;height:min(620px,calc(100vh - 110px));background:var(--bg);\
border-radius:18px;box-shadow:0 18px 50px rgba(20,33,61,.28);border:1px solid var(--line);display:flex;flex-direction:column;overflow:hidden;animation:pop .2s ease}\
.panel[hidden]{display:none}\
@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}\
.head{background:var(--p);color:#fff;padding:14px 12px 14px 16px;display:flex;align-items:center;gap:12px}\
.logo{width:40px;height:40px;border-radius:12px;background:#fff;display:grid;place-items:center;overflow:hidden;flex:none}\
.logo img{width:100%;height:100%;object-fit:contain;padding:4px}\
.logo span{font-weight:800;color:var(--p);font-size:15px;letter-spacing:.5px}\
.head h2{all:unset;display:block;font-weight:700;font-size:16px}\
.head p{margin:2px 0 0;font-size:12.5px;opacity:.85;display:flex;align-items:center;gap:6px}\
.dot{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block}\
.hbtn{all:unset;cursor:pointer;margin-left:auto;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#fff}\
.hbtn+.hbtn{margin-left:0}\
.hbtn:hover{background:rgba(255,255,255,.15)}\
.hbtn svg{width:20px;height:20px}\
.log{flex:1;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}\
.msg{max-width:86%;padding:10px 13px;border-radius:16px;white-space:normal;word-wrap:break-word}\
.bot{background:var(--card);border:1px solid var(--line);border-bottom-left-radius:6px;align-self:flex-start}\
.user{background:var(--p);color:#fff;border-bottom-right-radius:6px;align-self:flex-end}\
.msg a{color:var(--a)}\
.user a{color:#fff}\
.chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%}\
.chip{all:unset;cursor:pointer;font-size:14px;padding:7px 12px;border-radius:999px;border:1.5px solid var(--p);color:var(--p);background:var(--card);line-height:1.3}\
.chip:hover{background:var(--p);color:#fff}\
.chip.primary{background:var(--p);color:#fff}\
.chip.primary:hover{filter:brightness(1.12)}\
.chip[disabled]{opacity:.45;pointer-events:none}\
.typing{display:flex;gap:4px;padding:14px}\
.typing i{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:b 1s infinite}\
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}\
@keyframes b{0%,80%,100%{opacity:.3;transform:none}40%{opacity:1;transform:translateY(-3px)}}\
.summary{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px;align-self:stretch;font-size:14px}\
.summary dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 12px}\
.summary dt{color:var(--muted)}\
.summary dd{margin:0;word-break:break-word;white-space:pre-wrap}\
.consent{font-size:12.5px;color:var(--muted);margin:10px 0 0}\
.consent a{color:var(--a)}\
.foot{border-top:1px solid var(--line);background:var(--card);padding:10px}\
.form{display:flex;gap:8px;align-items:flex-end}\
.form textarea{flex:1;resize:none;font:inherit;color:var(--ink);border:1.5px solid var(--line);border-radius:12px;padding:10px 12px;max-height:110px;min-height:44px;background:#fff}\
.form textarea:focus{border-color:var(--a);outline:none}\
.send{all:unset;cursor:pointer;width:44px;height:44px;border-radius:12px;background:var(--p);color:#fff;display:grid;place-items:center;flex:none}\
.send[disabled]{opacity:.4;cursor:default}\
.send svg{width:20px;height:20px}\
.err{color:#b42318;font-size:13px;margin:6px 2px 0}\
.note{font-size:11.5px;color:var(--muted);text-align:center;margin:8px 0 0}\
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\
@media (max-width:480px){.wrap{bottom:calc(14px + env(safe-area-inset-bottom,0px))}\
.panel{position:fixed;inset:0;width:auto;height:auto;border-radius:0;border:0;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\
.wrap.open .launcher{display:none}.teaser{max-width:calc(100vw - 100px)}}\
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}"; }

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var ICON_RESET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ------------------------------------------------------------------ *
   * 5. BYGG GRENSESNITTET
   * ------------------------------------------------------------------ */
  function mount() {
    var host = el("div", { id: "itk-chat-root" });
    document.body.appendChild(host);
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.appendChild(el("style", { text: buildStyles() }));

    var wrap = el("div", { class: "wrap" });
    var launcher = el("button", { class: "launcher", type: "button", "aria-label": "Åpne chat med " + CFG.brandName, "aria-expanded": "false", "aria-controls": "itk-panel" });
    launcher.innerHTML = ICON_CHAT;

    var logo = el("div", { class: "logo", "aria-hidden": "true" });
    if (CFG.logoUrl) {
      var img = el("img", { src: CFG.logoUrl, alt: "" });
      img.addEventListener("error", function () { logo.innerHTML = ""; logo.appendChild(el("span", { text: "IK" })); });
      logo.appendChild(img);
    } else logo.appendChild(el("span", { text: "IK" }));

    var resetBtn = el("button", { class: "hbtn", type: "button", "aria-label": "Start samtalen på nytt", title: "Start på nytt" });
    resetBtn.innerHTML = ICON_RESET;
    var closeBtn = el("button", { class: "hbtn", type: "button", "aria-label": "Lukk chatten", title: "Lukk" });
    closeBtn.innerHTML = window.innerWidth <= 480 ? ICON_CLOSE : ICON_DOWN;

    var head = el("div", { class: "head" }, [
      logo,
      el("div", null, [el("h2", { id: "itk-title", text: CFG.brandName }), el("p", null, [el("span", { class: "dot", "aria-hidden": "true" }), CFG.botName])]),
      resetBtn, closeBtn,
    ]);
    var log = el("div", { class: "log", role: "log", "aria-live": "polite", "aria-relevant": "additions", tabindex: "0", "aria-label": "Samtale" });
    var input = el("textarea", { rows: "1", placeholder: "Skriv et spørsmål …", "aria-label": "Skriv en melding", maxlength: "1500", enterkeyhint: "send" });
    var sendBtn = el("button", { class: "send", type: "submit", "aria-label": "Send" });
    sendBtn.innerHTML = ICON_SEND;
    var errLine = el("p", { class: "err", role: "alert", hidden: "" });
    var form = el("form", { class: "form" }, [input, sendBtn]);
    var foot = el("div", { class: "foot" }, [form, errLine, el("p", { class: "note", text: "Automatisk assistent med ferdige svar" })]);
    var panel = el("div", { class: "panel", id: "itk-panel", role: "dialog", "aria-labelledby": "itk-title", hidden: "" }, [head, log, foot]);

    wrap.appendChild(panel);
    wrap.appendChild(launcher);
    root.appendChild(wrap);

    /* ---------------- tilstand ---------------- */
    var state = storeGet() || { open: false, history: [], lead: null, step: null, teaserSeen: false };
    var busy = false;

    function save() { storeSet(state); }

    function scrollDown() { log.scrollTop = log.scrollHeight; }

    // history-oppføringer: {t:"bot"|"user", text} | {t:"chips", items:[{label,action}]} | {t:"summary"}
    function addRaw(entry, animate) {
      var node;
      if (entry.t === "bot") { node = el("div", { class: "msg bot" }); node.appendChild(renderRich(entry.text)); }
      else if (entry.t === "user") node = el("div", { class: "msg user", text: entry.text });
      else if (entry.t === "chips") {
        node = el("div", { class: "chips", role: "group", "aria-label": "Forslag" });
        entry.items.forEach(function (it) {
          node.appendChild(el("button", {
            class: "chip" + (it.primary ? " primary" : ""), type: "button", text: it.label,
            onclick: function () { if (!busy) handleAction(it.action, it.label); },
          }));
        });
        // Gamle forslag deaktiveres når nye kommer
        Array.prototype.forEach.call(log.querySelectorAll(".chips"), function (c) {
          Array.prototype.forEach.call(c.querySelectorAll(".chip"), function (b) { b.setAttribute("disabled", ""); b.setAttribute("tabindex", "-1"); });
        });
      } else if (entry.t === "summary") node = buildSummary(entry.lead);
      if (node) { log.appendChild(node); scrollDown(); }
      return node;
    }
    function push(entry) { state.history.push(entry); save(); return addRaw(entry, true); }

    function botSay(text, chips, done) {
      busy = true;
      var typing = el("div", { class: "msg bot typing", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]);
      log.appendChild(typing); scrollDown();
      var delay = reduceMotion ? 0 : Math.min(250 + text.length * 4, 900);
      setTimeout(function () {
        typing.remove();
        push({ t: "bot", text: text });
        if (chips && chips.length) push({ t: "chips", items: chips });
        busy = false;
        if (done) done();
      }, delay);
    }

    /* ---------------- samtaleflyt ---------------- */
    function topicChips(ids, withContact) {
      var items = ids.map(function (id) {
        if (id === "kontakt") return { label: "Bli kontaktet", action: "lead", primary: true };
        var t = byId(id); return t ? { label: t.title, action: "topic:" + id } : null;
      }).filter(Boolean);
      if (withContact && ids.indexOf("kontakt") === -1) items.push({ label: "Bli kontaktet", action: "lead", primary: true });
      items.push({ label: "Andre spørsmål", action: "menu" });
      return items;
    }
    function greet() {
      botSay("Hei! 👋 Jeg er " + CFG.botName + ".\n\nJeg kan svare på spørsmål om IT, fiber, mobil og hvordan vi jobber. Velg et tema eller skriv spørsmålet ditt.",
        topicChips(START_TOPICS, true).filter(function (c) { return c.action !== "menu"; }));
    }
    function showMenu() {
      botSay("Hva lurer du på?", KNOWLEDGE.map(function (t) { return { label: t.title, action: "topic:" + t.id }; })
        .concat([{ label: "Bli kontaktet", action: "lead", primary: true }]));
    }
    function answerTopic(t) {
      state.lastTopic = t.id; save();
      botSay(t.answer, topicChips(t.next || [], true));
    }

    function handleAction(action, label) {
      if (label) push({ t: "user", text: label });
      if (action.indexOf("topic:") === 0 || action === "menu") { state.unanswered = null; save(); }
      if (action === "menu") return showMenu();
      if (action === "lead") return startLead();
      if (action.indexOf("topic:") === 0) { var t = byId(action.slice(6)); if (t) return answerTopic(t); }
      if (action.indexOf("cat:") === 0) return leadAnswer(action.slice(4));
      if (action === "skip") return leadAnswer("");
      if (action === "hint") return leadAnswer(state.lead && state.lead.messageHint);
      if (action === "gotoform") {
        var sf = findSiteForm();
        if (sf) { setOpen(false, false); sf.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); }
        return;
      }
      if (action === "confirm") return submitLead();
      if (action === "edit") return startLead(true);
      if (action === "cancel") { state.step = null; state.lead = null; save(); return botSay("Helt i orden. Er det noe annet jeg kan hjelpe med?", topicChips(START_TOPICS, true)); }
    }

    function handleFree(text) {
      push({ t: "user", text: text });
      if (state.step) return leadAnswer(text);
      state.unanswered = null; // bare forrige ubesvarte spørsmål skal foreslås som melding
      var n = normalize(text);
      var t = findTopic(text);
      if (anyHit(n, CONTACT_WORDS) && (!t || t.category)) {
        if (t) { state.lastTopic = t.id; save(); }
        return startLead();
      }
      if (t) return answerTopic(t);
      if (anyHit(n, GREETING_WORDS) && n.trim().split(" ").length <= 3) return botSay("Hei! Hva kan jeg hjelpe deg med?", topicChips(START_TOPICS, true));
      if (anyHit(n, THANKS_WORDS) && n.trim().split(" ").length <= 4) return botSay("Bare hyggelig! Si fra hvis du lurer på noe mer.", topicChips(["kontakt"], false));
      botSay("Det har jeg dessverre ikke et ferdig svar på. Jeg er en enkel assistent med faste svar.\n\nLegg igjen kontaktinfo, så svarer en av oss deg personlig. Eller velg et tema under.",
        [{ label: "Legg igjen kontaktinfo", action: "lead", primary: true }].concat(topicChips(START_TOPICS, false)));
      state.unanswered = text; save();
    }

    /* ---------------- kontaktflyt ---------------- */
    var STEPS = [
      { key: "category", ask: "Hva gjelder det?", chips: function () { return CFG.categories.map(function (c) { return { label: c, action: "cat:" + c }; }); } },
      { key: "name", ask: "Hva heter du?" },
      { key: "company", ask: "Hvilken bedrift er du fra?", optional: true },
      { key: "email", ask: "Hvilken e-postadresse kan vi svare på?" },
      { key: "phone", ask: "Telefonnummer, hvis du heller vil bli ringt?", optional: true },
      { key: "message", ask: "Skriv kort hva du trenger hjelp med." },
    ];
    function stepIndex(key) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].key === key) return i; return -1; }

    function startLead(editing) {
      var prev = editing ? state.lead : null;
      state.lead = prev ? Object.assign({}, prev) : {};
      var topic = byId(state.lastTopic);
      if (!editing && topic && topic.category) state.lead.category = topic.category;
      if (!editing && state.unanswered) state.lead.messageHint = state.unanswered;
      state.editing = !!editing;
      state.step = state.lead.category && !editing ? "name" : "category";
      save();
      var intro = editing ? "Ok, vi tar det på nytt." :
        "Flott! Jeg trenger noen få opplysninger, så tar vi kontakt." + (state.lead.category ? "\n\nJeg har satt temaet til **" + state.lead.category + "**." : "");
      botSay(intro, null, askStep);
    }
    function askStep() {
      var s = STEPS[stepIndex(state.step)];
      var chips = s.chips ? s.chips() : [];
      if (s.optional) chips = chips.concat([{ label: "Hopp over", action: "skip" }]);
      if (s.key === "message" && state.lead.messageHint) chips = [{ label: "Bruk: «" + state.lead.messageHint.slice(0, 40) + (state.lead.messageHint.length > 40 ? "…" : "") + "»", action: "hint" }];
      chips.push({ label: "Avbryt", action: "cancel" });
      botSay(s.ask, chips, function () {
        input.setAttribute("placeholder", s.key === "email" ? "navn@bedrift.no" : s.key === "phone" ? "Telefonnummer" : "Skriv svaret her …");
        input.setAttribute("inputmode", s.key === "email" ? "email" : s.key === "phone" ? "tel" : "text");
        input.setAttribute("autocomplete", s.key === "email" ? "email" : s.key === "phone" ? "tel" : s.key === "name" ? "name" : s.key === "company" ? "organization" : "off");
        if (!isTouch()) input.focus();
      });
    }
    function leadAnswer(value) {
      var key = state.step;
      if (!key) return;
      value = String(value || "").trim();
      var s = STEPS[stepIndex(key)];
      if (!value && !s.optional) return botSay(key === "category" ? "Velg et tema fra listen." : "Dette feltet trenger jeg for å kunne svare deg.", null, askStep);
      if (key === "category" && value && CFG.categories.indexOf(value) === -1) {
        // Fritekst som kategori: prøv å matche, ellers bruk første som passer
        var t = findTopic(value); value = (t && t.category) || matchCategory(value) || "";
        if (!value) return botSay("Jeg skjønte ikke helt hvilket tema. Velg ett av disse:", null, askStep);
      }
      if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return botSay("Det ser ikke ut som en gyldig e-postadresse. Prøv igjen, f.eks. navn@bedrift.no.", null, askStep);
      if (key === "phone" && value && value.replace(/[^\d]/g, "").length < 8) return botSay("Telefonnummeret ser for kort ut. Skriv det på nytt, eller hopp over.", null, askStep);
      if (key === "name" && value.length < 2) return botSay("Skriv navnet ditt, så vet vi hvem vi snakker med.", null, askStep);
      state.lead[key] = value;
      var i = stepIndex(key) + 1;
      // Ved første gjennomgang: hopp over kategori hvis den allerede er satt
      state.step = i < STEPS.length ? STEPS[i].key : null;
      save();
      resetInputHints();
      if (state.step) askStep(); else showSummary();
    }
    function matchCategory(v) {
      var n = v.toLowerCase();
      for (var i = 0; i < CFG.categories.length; i++) if (CFG.categories[i].toLowerCase().indexOf(n) !== -1 || n.indexOf(CFG.categories[i].toLowerCase().split("/")[0]) !== -1) return CFG.categories[i];
      return "";
    }
    function resetInputHints() {
      input.setAttribute("placeholder", "Skriv et spørsmål …");
      input.setAttribute("inputmode", "text");
      input.setAttribute("autocomplete", "off");
    }
    function buildSummary(lead) {
      var rows = [["Tema", lead.category], ["Navn", lead.name], ["Bedrift", lead.company], ["E-post", lead.email], ["Telefon", lead.phone], ["Melding", lead.message]];
      var dl = el("dl");
      rows.forEach(function (r) { if (r[1]) { dl.appendChild(el("dt", { text: r[0] })); dl.appendChild(el("dd", { text: r[1] })); } });
      var consent = el("p", { class: "consent" }, ["Når du sender, bruker vi opplysningene bare til å svare på henvendelsen. Les mer i ",
        el("a", { href: CFG.privacyUrl, target: "_blank", rel: "noopener", text: "personvernerklæringen" }), "."]);
      return el("div", { class: "summary", "aria-label": "Oppsummering" }, [dl, consent]);
    }
    function showSummary() {
      botSay("Takk! Stemmer dette?", null, function () {
        push({ t: "summary", lead: state.lead });
        push({ t: "chips", items: [{ label: "Send", action: "confirm", primary: true }, { label: "Endre", action: "edit" }, { label: "Avbryt", action: "cancel" }] });
      });
    }

    function composeMessage(lead) {
      var lines = [];
      if (lead.company) lines.push("Bedrift: " + lead.company);
      if (lead.phone) lines.push("Telefon: " + lead.phone);
      if (lines.length) lines.push("");
      lines.push(lead.message || "");
      lines.push("", "(Sendt via chat-assistenten)");
      return lines.join("\n");
    }

    function submitLead() {
      var lead = state.lead;
      var mode = CFG.leadMode === "auto" ? (CFG.endpoint ? "endpoint" : "siteForm") : CFG.leadMode;
      botSay("Sender …", null, function () {
        busy = true;
        var p = mode === "endpoint" ? sendEndpoint(lead) : sendSiteForm(lead);
        p.then(function (res) {
          busy = false;
          state.step = null; state.lead = null; state.unanswered = null; save();
          if (res === "sent") {
            botSay("Takk, " + firstName(lead.name) + "! Henvendelsen er sendt, og vi tar kontakt så snart vi kan. ✅", topicChips(["om"], false));
            try { window.dispatchEvent(new CustomEvent("itk-chat-lead", { detail: lead })); } catch (e) {}
          } else if (res === "filled") {
            botSay("Jeg har fylt ut kontaktskjemaet på siden for deg. Sjekk at alt ser riktig ut og trykk **Send melding**.", null);
          }
        }).catch(function () {
          busy = false; save();
          botSay("Beklager, noe gikk galt da meldingen skulle sendes. Prøv igjen, eller bruk kontaktskjemaet på siden.",
            [{ label: "Prøv igjen", action: "confirm", primary: true }, { label: "Gå til kontaktskjema", action: "gotoform" }]);
        });
      });
    }
    function firstName(n) { return String(n || "").split(" ")[0]; }

    function sendEndpoint(lead) {
      var payload = Object.assign({}, CFG.endpointExtra, {
        kategori: lead.category, navn: lead.name, bedrift: lead.company || "", epost: lead.email, email: lead.email,
        telefon: lead.phone || "", melding: lead.message, side: location.href, kilde: "chat-assistent",
        subject: "Ny henvendelse fra chatten: " + lead.category,
      });
      return fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return "sent"; });
    }

    // Fyller ut sidens eget kontaktskjema (#kontakt) og sender det.
    // Skjulte «felle»-felt (honeypot, f.eks. «Nettsted») blir IKKE fylt ut.
    function findSiteForm() {
      var f = document.querySelector(CFG.siteFormSelector);
      if (!f) {
        var forms = document.querySelectorAll("form");
        for (var i = 0; i < forms.length; i++) if (forms[i].querySelector("input[type=email]") && forms[i].querySelector("textarea")) { f = forms[i]; break; }
      }
      return f;
    }
    function labelText(field) {
      var t = [field.name, field.id, field.getAttribute("autocomplete"), field.getAttribute("placeholder"), field.getAttribute("aria-label")];
      if (field.id) { var l = document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(field.id) : field.id) + '"]'); if (l) t.push(l.textContent); }
      var p = field.closest("label"); if (p) t.push(p.textContent);
      return t.filter(Boolean).join(" ").toLowerCase();
    }
    function isTrap(field) {
      if (field.type === "hidden" || field.disabled) return true;
      if (field.getAttribute("tabindex") === "-1" || field.getAttribute("aria-hidden") === "true") return true;
      if (/nettsted|website|homepage|url|honeypot|hp_|^hp$|bot|fax/.test(labelText(field))) return true;
      var cs = window.getComputedStyle(field);
      if (cs.display === "none" || cs.visibility === "hidden") return true;
      var box = field.closest("[aria-hidden=true],[hidden]");
      return !!box;
    }
    function setValue(field, value) {
      var proto = field.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : field.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      var setter = Object.getOwnPropertyDescriptor(proto, "value").set; // fungerer også med React/Vue
      setter.call(field, value);
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function sendSiteForm(lead) {
      return new Promise(function (resolve, reject) {
        var f = findSiteForm();
        if (!f) return reject(new Error("Fant ikke kontaktskjema"));
        var fields = Array.prototype.filter.call(f.querySelectorAll("input,select,textarea"), function (x) { return !isTrap(x) && x.type !== "submit" && x.type !== "button"; });
        var filled = { cat: false, name: false, email: false, msg: false };
        fields.forEach(function (x) {
          var lt = labelText(x);
          if (x.tagName === "SELECT" && !filled.cat) {
            var opt = Array.prototype.find.call(x.options, function (o) { return (o.text + " " + o.value).toLowerCase().indexOf(String(lead.category).toLowerCase()) !== -1; });
            if (opt) { setValue(x, opt.value); filled.cat = true; }
          } else if (x.tagName === "TEXTAREA" && !filled.msg) { setValue(x, composeMessage(lead)); filled.msg = true; }
          else if ((x.type === "email" || /e-?post|email|mail/.test(lt)) && !filled.email) { setValue(x, lead.email); filled.email = true; }
          else if (x.type === "tel" || /telefon|phone|mobil/.test(lt)) { if (lead.phone) setValue(x, lead.phone); }
          else if (/firma|bedrift|company|organi/.test(lt)) { if (lead.company) setValue(x, lead.company); }
          else if (/navn|name/.test(lt) && !filled.name && (x.type === "text" || !x.type)) { setValue(x, lead.name); filled.name = true; }
        });
        if (!filled.email || !filled.msg) return reject(new Error("Mangler felt"));
        // Lytt etter tegn på at skjemaet ble sendt
        var region = f.closest("section") || f.parentElement || document.body;
        var before = region.textContent;
        var done = false;
        function finish(r) { if (done) return; done = true; obs.disconnect(); clearTimeout(timer); resolve(r); }
        var obs = new MutationObserver(function () {
          var txt = region.textContent;
          if (txt !== before && /takk|mottatt|thank/i.test(txt.replace(before, ""))) finish("sent");
          if (!document.contains(f)) finish("sent");
        });
        obs.observe(region, { childList: true, subtree: true, characterData: true });
        var timer = setTimeout(function () {
          // Skjemaet ble tømt etter innsending = sendt. Ellers: la kunden se over og trykke selv.
          var em = f.querySelector("input[type=email]");
          if (em && !em.value) finish("sent");
          else { f.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); finish("filled"); }
        }, 6000);
        if (!f.checkValidity()) { f.scrollIntoView({ block: "center" }); return finish("filled"); }
        try { f.requestSubmit ? f.requestSubmit() : f.submit(); } catch (e) { finish("filled"); }
      });
    }

    /* ---------------- åpne / lukke ---------------- */
    var teaser = null;
    function setOpen(open, focusInput) {
      state.open = open; save();
      panel.hidden = !open;
      wrap.classList.toggle("open", open);
      launcher.setAttribute("aria-expanded", String(open));
      launcher.setAttribute("aria-label", (open ? "Lukk" : "Åpne") + " chat med " + CFG.brandName);
      launcher.innerHTML = open ? ICON_CLOSE : ICON_CHAT;
      if (open) {
        hideTeaser();
        if (!state.history.length) greet();
        scrollDown();
        if (focusInput && !isTouch()) setTimeout(function () { input.focus(); }, 30);
      } else if (focusInput !== false) launcher.focus();
    }
    function isTouch() { return window.matchMedia && window.matchMedia("(pointer: coarse)").matches; }
    function hideTeaser() { if (teaser) { teaser.remove(); teaser = null; } state.teaserSeen = true; save(); }
    function showTeaser() {
      if (state.open || state.teaserSeen || state.history.length) return;
      var x = el("button", { class: "x", type: "button", "aria-label": "Skjul", text: "×", onclick: function (e) { e.stopPropagation(); hideTeaser(); } });
      teaser = el("div", { class: "teaser", role: "status" }, [CFG.teaserText, x]);
      teaser.addEventListener("click", function () { setOpen(true, true); });
      wrap.insertBefore(teaser, launcher);
      launcher.appendChild(el("span", { class: "badge", "aria-hidden": "true" }));
    }

    launcher.addEventListener("click", function () { setOpen(panel.hidden, true); var b = launcher.querySelector(".badge"); if (b) b.remove(); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    resetBtn.addEventListener("click", function () {
      state = { open: true, history: [], lead: null, step: null, teaserSeen: true }; save();
      log.innerHTML = ""; resetInputHints(); busy = false; greet();
    });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v || busy) return;
      input.value = ""; autoGrow();
      handleFree(v);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit")); }
    });
    function autoGrow() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 110) + "px"; }
    input.addEventListener("input", autoGrow);


    // Gjenopprett samtalen fra denne økten
    state.history.forEach(function (h) { addRaw(h, false); });
    if (state.open) setOpen(true, false);
    if (CFG.teaserDelaySeconds > 0 && !state.teaserSeen) setTimeout(showTeaser, CFG.teaserDelaySeconds * 1000);

    // Åpne fra siden: window.ITKompassChatOpen() eller lenker med href="#chat"
    window.ITKompassChatOpen = function () { setOpen(true, true); };
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href="#chat"]');
      if (a) { e.preventDefault(); setOpen(true, true); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
