// Az „Automatikus Google-értékelés gyűjtő” kipróbálható demójának adatai (/munkaim/ertekeles).
// Szimuláció: kitalált vállalkozás (villanyszerelő) és ügyfelek, valós email nincs.

export const business = { name: "Tóth Villanyszerelés", owner: "Péter" };

export const statuses = {
  done: { label: "Munka kész", className: "bg-paper/10 text-paper/75" },
  waiting: { label: "Vár (1–2 nap)", className: "bg-paper/15 text-paper" },
  sent: { label: "Email elküldve", className: "bg-accent/15 text-accent" },
  opened: { label: "Megnyitva", className: "bg-highlight/15 text-highlight" },
  reviewed: { label: "Értékelt ★5", className: "bg-highlight text-night" },
};

// A naptár eseményei (1. lépés). client: ügyfél-id, ha munkáról van szó.
export const days = ["H", "K", "Sze", "Cs", "P"];
export const events = [
  { day: 0, from: 9, to: 11, title: "Nagy Gábor — lámpák", client: null },
  { day: 1, from: 8, to: 10, title: "Anyagbeszerzés", client: null },
  {
    day: 1,
    from: 13,
    to: 16,
    title: "Szabó Kata — konyha villanyszerelés",
    client: "kata",
  },
  { day: 3, from: 10, to: 12, title: "Felmérés, Budaörs", client: null },
];

export const clients = [
  {
    id: "gabor",
    name: "Nagy Gábor",
    job: "Lámpák felszerelése",
    status: "reviewed",
    when: "múlt hét",
  },
  {
    id: "kata",
    name: "Szabó Kata",
    job: "Konyha villanyszerelés",
    status: null,
    when: "",
  },
];
export const clientById = Object.fromEntries(clients.map((c) => [c.id, c]));

export const email = {
  to: "kata@••••.hu",
  subject: "Köszönöm a bizalmat, Kata!",
  body: "Szia Kata! Remélem, minden rendben működik az új konyhában. Ha elégedett voltál a munkával, nagyon sokat segítenél, ha pár szóban értékelnél a Google-ön — egy perc az egész. Köszönöm! Péter",
};

export const review = {
  name: "Szabó Kata",
  text: "Pontos, tiszta munka, mindent elmagyarázott. A konyhában végre minden konnektor ott van, ahol kell. Csak ajánlani tudom!",
  before: { rating: "4,6", count: 38 },
  after: { rating: "4,7", count: 39 },
};

export const recap = [
  "0 elfelejtett kérés",
  "1–2 nap után, nem tolakodóan",
  "személyes hangú email",
  "0 perc kézi munka",
];

// changes: az ügyféllista változásai az adott lépésben. A színpad onApply-jal alkalmazza.
export const steps = [
  {
    title: "Munka vége a naptárban",
    text: "Nem kell semmit beírni sehova: a rendszer a naptárból látja, hogy egy munka véget ért, és felveszi az ügyfelet.",
    tag: "Naptár",
    log: [
      "● Naptár figyelése",
      "  ✓ Lezárt munka: Szabó Kata — konyha villanyszerelés",
      "  ✓ Felvéve: értékelés-kérésre vár",
    ],
    changes: { kata: { status: "done", when: "kedd 16:00" } },
  },
  {
    title: "Vár 1–2 napot",
    text: "Nem azonnal ír — hagy időt, hogy az ügyfél kipróbálja, megszokja az eredményt. Így a kérés természetes, nem tolakodó.",
    tag: "Időzítés",
    log: [
      "● Időzítés",
      "  – Kedd: munka vége",
      "  – Szerda: türelem",
      "  ✓ Csütörtök 10:00: küldés ideje",
    ],
    changes: { kata: { status: "waiting", when: "csüt. 10:00" } },
  },
  {
    title: "Személyes email",
    text: "Nem sablonlevél-szagú: az ügyfél nevével, a konkrét munkával, a te hangodon — egy kattintásos linkkel a Google-értékeléshez.",
    tag: "Email",
    log: [
      "● Email írása",
      "  ✓ {név} {munka} → személyre szabva",
      "  ✓ Google-értékelés link csatolva",
    ],
  },
  {
    title: "Elküldve, megnyitva",
    text: "Kimegy a saját címedről. Látod, ha megnyitotta, és ha rákattintott a linkre — semmi nem vész el.",
    tag: "Küldés",
    log: [
      "● Küldés",
      "  ✓ Kézbesítve: kata@••••.hu",
      "  ✓ Megnyitva · link megnyitva",
    ],
    changes: { kata: { status: "opened", when: "csüt. 10:42" } },
  },
  {
    title: "Új Google-értékelés",
    text: "Az ügyfél pár szóban megírja, és megjelenik a profilodon. Minden új értékelés több bizalmat és több hívást jelent.",
    tag: "Google",
    log: [
      "● Google Business Profile",
      "  ★★★★★ Új értékelés: Szabó Kata",
      "  ✓ Értékelés: 4,6 → 4,7 (39)",
    ],
    changes: { kata: { status: "reviewed", when: "csüt. 11:05" } },
  },
  {
    title: "Az eredmény",
    text: "Minden lezárt munka után magától megy a kérés — az értékelések gyűlnek, te közben dolgozol.",
    tag: "Eredmény",
    hideLog: true, // az alsó napló/lista becsukódik, az eredmény kap helyet
    log: [
      "● Összesítés",
      "  ✓ 1 lezárt munka → 1 kérés → 1 új értékelés",
      "Kész. Kézi munka: 0 perc.",
    ],
  },
];

export function tableAt(stepIndex, applied = null) {
  const rows = Object.fromEntries(
    clients.map((c) => [c.id, { ...c, changed: false }]),
  );
  for (let i = 0; i <= stepIndex; i++) {
    const current = i === stepIndex;
    for (const [id, fields] of Object.entries(steps[i].changes || {})) {
      if (current && applied && !applied.includes(id)) continue;
      Object.assign(rows[id], fields);
      if (current) rows[id].changed = true;
    }
  }
  return clients.map((c) => rows[c.id]).filter((r) => r.status);
}

export const facts = [
  { value: "0 perc", label: "kézi munka egy értékelés-kérésre" },
  { value: "1–2 nap", label: "a munka után — amikor még friss az élmény" },
  { value: "0", label: "elfelejtett kérés" },
];

export const benefits = [
  {
    stat: "Több",
    title: "értékelés, magától",
    text: "A legtöbb elégedett ügyfél szívesen értékel — csak senki nem kéri meg. Itt minden munka után megtörténik.",
  },
  {
    stat: "Jobb",
    title: "helyezés a térképen",
    text: "A friss, sok értékelés a Google-ben is előrébb visz — több hívás ugyanannyi munkával.",
  },
  {
    stat: "0 perc",
    title: "rád eső munka",
    text: "Nem kell emlékezni, írni, utánamenni. A naptár alapján minden magától történik.",
  },
];
