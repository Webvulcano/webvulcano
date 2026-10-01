// A „Hideg email automatizáló” kipróbálható demójának adatai (/munkaim/hideg-email).
// Szimuláció: kitalált cégek, valós küldés nincs. A folyamat a send-daily-emails skill lépéseit követi.

export const command = "send daily emails";

export const statuses = {
  new: { label: "Nincs elkezdve", className: "bg-paper/10 text-paper/70" },
  sent: { label: "Email elküldve", className: "bg-paper/15 text-paper" },
  noreply: { label: "Nincs válasz", className: "bg-danger/15 text-danger" },
  followup: { label: "Emlékeztető elküldve", className: "bg-accent/15 text-accent" },
  replied: { label: "Válaszolt", className: "bg-highlight/15 text-highlight" },
  interested: { label: "Érdeklődik", className: "bg-highlight text-night" },
};

// Két régebbi lead (3 napja kapott emailt) + három új, amit ma talál a gép.
// Az email címek maszkolva — kitalált cégek, ne tűnjenek valós címnek.
export const leads = [
  {
    id: "kovacs",
    company: "Kovács Autómosó",
    person: "Gábor",
    website: "kovacsautomoso.hu",
    email: "gabor@••••.hu",
    mono: "KA",
    tone: "accent",
    status: "sent",
    next: "ma",
  },
  {
    id: "napfeny",
    company: "Napfény Fogászat",
    person: "Anna",
    website: "napfenyfogaszat.hu",
    email: "anna@••••.hu",
    mono: "NF",
    tone: "highlight",
    status: "sent",
    next: "ma",
  },
  {
    id: "toth",
    company: "Tóth Villanyszerelés",
    person: "Péter",
    website: "tothvillany.hu",
    email: "peter@••••.hu",
    mono: "TV",
    tone: "accent",
    status: null,
    next: "",
  },
  {
    id: "zoldag",
    company: "Zöldág Kertészet",
    person: "Kata",
    website: "zoldagkert.hu",
    email: "kata@••••.hu",
    mono: "ZK",
    tone: "highlight",
    status: null,
    next: "",
  },
  {
    id: "bella",
    company: "Bella Szépségszalon",
    person: "Bella",
    website: "bellaszalon.hu",
    email: "hello@••••.hu",
    mono: "BS",
    tone: "paper",
    status: null,
    next: "",
  },
];

export const leadById = Object.fromEntries(leads.map((l) => [l.id, l]));
export const newLeadIds = ["toth", "zoldag", "bella"];

// changes: a Notion-tábla változásai az adott lépésben (id → mezők). A színpad-animáció
// egyenként „alkalmazza” őket (onApply), így a tábla az animációval együtt frissül.
export const steps = [
  {
    title: "Beírom: „send daily emails”",
    text: "Egyetlen mondat Claude-nak — innentől minden magától megy. Előtte megmutatja a napi keretet, hogy tudjam, mi fog történni.",
    tag: "Claude",
    log: ["● Napi email-kör indul", "  Keret ma: 7 új email + 5 emlékeztető"],
  },
  {
    title: "Kontaktok a netről",
    text: "Megkeresi a kiválasztott iparág budapesti cégeit — név, weboldal, email cím —, és egyenként felveszi őket a nyilvántartásba.",
    tag: "Apify",
    log: [
      "● Cégek keresése: helyi szolgáltatók · Budapest",
      "  ✓ 3 új cég, elérhető email címmel",
      "  ✓ Felvéve az adatbázisba: Nincs elkezdve",
    ],
    changes: Object.fromEntries(newLeadIds.map((id) => [id, { status: "new", next: "ma" }])),
  },
  {
    title: "Sablon kitöltése",
    text: "A bevált email-sablonba behelyettesíti a cég nevét, a kontakt nevét és a weboldalát — minden email személyre szabott, nem tömeglevél.",
    tag: "Sablon",
    log: ["● Emailek személyre szabása", "  ✓ {cégnév} {név} {weboldal} → 3 egyedi email"],
  },
  {
    title: "Emailek kiküldése",
    text: "Egyesével mennek ki a levelek a saját címemről, szünetekkel és napi limittel — hogy ne legyen belőle spam.",
    tag: "Resend",
    log: [
      "● Küldés",
      "  ✓ Tóth Villanyszerelés — kézbesítve",
      "  ✓ Zöldág Kertészet — kézbesítve",
      "  ✓ Bella Szépségszalon — kézbesítve",
    ],
  },
  {
    title: "Státusz az adatbázisba",
    text: "Minden cégnél rögzíti, hogy megkapta az emailt, és mikor kell legközelebb ránézni. Semmi nem marad fejben vagy cetlin.",
    tag: "Adatbázis",
    log: ["● Nyilvántartás frissítése", "  ✓ 3 cég → Email elküldve · következő lépés: 3 nap múlva"],
    changes: Object.fromEntries(newLeadIds.map((id) => [id, { status: "sent", next: "+3 nap" }])),
  },
  {
    title: "Válaszok ellenőrzése",
    text: "Átnézi a postafiókot: ki válaszolt a korábbi emailekre? Akinél van válasz, azt jelöli, akinél nincs, azt előkészíti egy emlékeztetőre.",
    tag: "Gmail",
    log: [
      "● Beérkezett válaszok ellenőrzése",
      "  ✓ Napfény Fogászat válaszolt",
      "  – Kovács Autómosó: 3 napja nincs válasz",
    ],
    changes: {
      napfeny: { status: "replied", next: "ma" },
      kovacs: { status: "noreply", next: "ma" },
    },
  },
  {
    title: "Emlékeztető (follow-up)",
    text: "Aki nem válaszolt, annak megírja és elküldi a rövid emlékeztetőt. Legfeljebb kettőt — utána leáll, nem zaklat senkit.",
    tag: "Follow-up",
    log: ["● Emlékeztetők", "  ✓ Kovács Autómosó — 1. emlékeztető elküldve · következő: 4 nap múlva"],
    changes: { kovacs: { status: "followup", next: "+4 nap" } },
  },
  {
    title: "Érdeklődő → szól nekem",
    text: "Ha valaki érdeklődik, azonnal jelez, és megírja a válasz vázlatát. Én csak átolvasom és elküldöm — a személyes beszélgetés az enyém.",
    tag: "Értesítés",
    log: [
      "● Érdeklődő érkezett!",
      "  🔔 Értesítés küldve Lehelnek",
      "  ✓ Válaszvázlat elkészült — jóváhagyásra vár",
      "  ✓ Napfény Fogászat → Érdeklődik",
      "Kész. 3 új email · 1 emlékeztető · 1 érdeklődő — kb. 1 perc alatt.",
    ],
    changes: { napfeny: { status: "interested", next: "hívás" } },
  },
];

// A tábla sorai a stepIndex. lépésben (-1 = indítás előtt). applied: az aktuális lépés már
// alkalmazott változásai (lead id-k); null = mind. Status nélküli lead még nincs a táblában.
export function tableAt(stepIndex, applied = null) {
  const rows = Object.fromEntries(leads.map((l) => [l.id, { ...l, changed: false }]));
  for (let i = 0; i <= stepIndex; i++) {
    const current = i === stepIndex;
    for (const [id, fields] of Object.entries(steps[i].changes || {})) {
      if (current && applied && !applied.includes(id)) continue;
      Object.assign(rows[id], fields);
      if (current) rows[id].changed = true;
    }
  }
  return leads.map((l) => rows[l.id]).filter((r) => r.status);
}

// Sablon: a { key } részek helyére kerül a lead adata.
export const template = {
  subject: ["Rövid kérdés a ", { key: "company" }, " weboldaláról"],
  body: [
    "Szia ",
    { key: "person" },
    "! Megnéztem a ",
    { key: "website" },
    " oldalt, és lenne pár ötletem, hogyan hozhatna több érdeklődőt…",
  ],
};
export const placeholders = { company: "{cégnév}", person: "{név}", website: "{weboldal}" };

// A postafiók a válasz-ellenőrzéskor (lead: melyik leadtől jött válasz).
export const inbox = [
  { from: "Könyvelő", subject: "Havi bizonylatok", lead: null },
  { from: "Hírlevél", subject: "Őszi webes trendek", lead: null },
  { from: "Napfény Fogászat", subject: "Re: Rövid kérdés a weboldaláról", lead: "napfeny" },
  { from: "Nyomda", subject: "Névjegykártya árajánlat", lead: null },
  { from: "Hírlevél", subject: "Heti összefoglaló", lead: null },
];

export const followup =
  "Szia Gábor! Csak ránéztem, eljutott-e hozzád a múltkori levelem. Ha érdekel, szívesen megmutatok egy ingyenes vázlatot.";

export const notify = {
  title: "Új érdeklődő: Napfény Fogászat",
  reply: "„Érdekel, mennyibe kerülne egy új oldal?”",
  draft:
    "Szia Anna! Köszönöm a választ! Egy ilyen oldal nálam fix áron készül, és az első vázlatot ingyen megmutatom. Mikor lenne jó egy 15 perces hívás a héten?",
};

export const benefits = [
  {
    stat: "1 perc",
    title: "napi 2–3 óra helyett",
    text: "Keresés, emailezés, adminisztráció — mind lefut egy mondatra. Az idő a munkára marad.",
  },
  {
    stat: "0",
    title: "elfelejtett érdeklődő",
    text: "Minden kontakt státusza egy helyen van, az emlékeztetők maguktól mennek ki a megfelelő napon.",
  },
  {
    stat: "100%",
    title: "személyes a fontos részen",
    text: "A gép a monoton részt csinálja. Amikor valaki érdeklődik, én válaszolok — kész vázlatból.",
  },
];
