// A „Ticketing rendszer AI integráció” kipróbálható demójának adatai (/munkaim/ticketing).
// Szimuláció: kitalált jegyek és kollégák, valós AI-hívás nincs. A folyamat a valós
// Otobo + Node-RED + Gemini integrációt követi: átnevezés, kategorizálás, összefoglaló.

export const types = {
  Monitor: "bg-accent/15 text-accent",
  Printer: "bg-highlight/15 text-highlight",
  Modem: "bg-danger/15 text-danger",
};
export const typeNames = Object.keys(types);

export const services = {
  service: "bg-paper/10 text-paper/75",
  incident: "bg-paper/20 text-paper",
};
export const serviceNames = Object.keys(services);

// raw: ahogy a bejelentő beküldte · title: az AI által átfogalmazott cím.
// keys: amiből az AI a kategóriát „kiolvassa” (a 2. lépésben kiemelve).
export const tickets = [
  {
    id: "t1",
    no: "#4821",
    from: "Kiss Judit · könyvelés",
    time: "07:58",
    raw: "nyomtato",
    title: "Nem nyomtat a 2. emeleti HP nyomtató — papírelakadás",
    body: [
      "Szia! A ",
      { key: "2. emeleti nyomtató" },
      " megint ",
      { key: "nem nyomtat" },
      ", villog a narancs lámpa és azt írja: ",
      { key: "paper jam" },
      ". Holnap reggelre kellene a havi záráshoz!",
    ],
    type: "Printer",
    service: "incident",
  },
  {
    id: "t2",
    no: "#4822",
    from: "Szabó Márk · marketing",
    time: "08:04",
    raw: "SEGÍTSÉG",
    title: "Második monitor igénylése új kollégának (3. em., marketing)",
    type: "Monitor",
    service: "service",
  },
  {
    id: "t3",
    no: "#4823",
    from: "Kovács Péter · ügyfélszolgálat",
    time: "08:12",
    raw: "nem megy!!!",
    title: "Teljes irodai internetkimaradás — piros a router lámpája",
    type: "Modem",
    service: "incident",
  },
];
export const ticketById = Object.fromEntries(tickets.map((t) => [t.id, t]));

// A 2. lépés: mit „ért meg” az AI a jegyből.
export const insights = [
  ["Eszköz", "nyomtató, 2. emelet"],
  ["Hiba", "papírelakadás"],
  ["Sürgős", "holnap reggelig"],
];

// Az internetkimaradásos jegy hozzászólásai (5. lépés). system: automatikus rendszerüzenet.
export const comments = [
  {
    who: "Kovács Péter",
    time: "08:12",
    text: "Egész irodában nincs net, piros a router lámpája.",
  },
  {
    who: "Rendszer",
    time: "08:13",
    text: "Hozzárendelve: Helpdesk, 1. szint",
    system: true,
  },
  {
    who: "Nagy Eszter",
    time: "08:16",
    text: "A 2. emeleten sincs. A VPN se megy.",
  },
  {
    who: "Tóth Ádám",
    time: "08:20",
    text: "Áramtalanítottam a routert, 5 perc után vissza — nem segített.",
  },
  {
    who: "Tóth Ádám",
    time: "08:31",
    text: "Kicseréltem a WAN- és a patch kábeleket, ugyanaz.",
  },
  {
    who: "Kovács Péter",
    time: "08:41",
    text: "Még mindig nincs. 9-kor ügyfélhívásunk van!!",
  },
  {
    who: "Tóth Ádám",
    time: "08:44",
    text: "Újra áramtalanítottam mindent, a switchet is. Semmi.",
  },
  {
    who: "Rendszer",
    time: "08:47",
    text: "Átadva: Helpdesk, 2. szint",
    system: true,
  },
  {
    who: "Balogh Réka",
    time: "08:58",
    text: "Bekötöttem a tartalék routert — az sem kap IP-címet.",
  },
  {
    who: "Balogh Réka",
    time: "09:06",
    text: "Telekomnál bejelentve (TK-55812). Szerintük a vonal rendben van.",
  },
  {
    who: "Nagy Eszter",
    time: "09:15",
    text: "Addig mobilnetet osztunk meg, de nagyon lassú.",
  },
  {
    who: "Rendszer",
    time: "09:30",
    text: "Prioritás emelve: magas",
    system: true,
  },
  {
    who: "Nagy Eszter",
    time: "09:41",
    text: "Reggel villanyszerelők dolgoztak a földszinti szerverszekrénynél.",
  },
  {
    who: "Tóth Ádám",
    time: "09:52",
    text: "Szekrényben a Telekom-modem percenként újraindul, a tápja forró.",
  },
  {
    who: "Balogh Réka",
    time: "10:05",
    text: "Telekom: modemcsere csak holnap 8–12 között.",
  },
  {
    who: "Kovács Péter",
    time: "10:12",
    text: "Az ügyfél már másodszor hív, mit mondjak neki?",
  },
  {
    who: "Rendszer",
    time: "10:20",
    text: "SLA-határidő: 2 óra múlva lejár",
    system: true,
  },
];
const people = new Set(comments.filter((c) => !c.system).map((c) => c.who))
  .size;
const systemCount = comments.filter((c) => c.system).length;

export const summary = [
  {
    label: "Mi történt",
    text: "08:12 óta nincs internet (VPN sem) az egész irodában. Kétszer áramtalanítottak, kicserélték a kábeleket, bekötötték a tartalék routert — egyik sem segített. A Telekom szerint a vonal rendben van (TK-55812).",
  },
  {
    label: "Hol tart",
    text: "A hiba nem a routerben van: a földszinti szerverszekrényben a Telekom-modem percenként újraindul, a tápja túlmelegszik — valószínűleg a reggeli villanyszerelés óta. Modemcsere csak holnap, az SLA 2 óra múlva lejár.",
  },
  {
    label: "Javaslat",
    text: "1) Most cseréljétek a modem tápegységét (12 V, a raktárban van) — ez valószínűleg azonnal megoldja. 2) Ha nem, 4G router a sürgős hívásokhoz. 3) Kovács Péter ügyfelének: visszahívás 11:00-ig.",
  },
];

// changes: a jegylista változásai az adott lépésben (id → mezők). A színpad egyenként
// „alkalmazza” őket (onApply), így a lista az animációval együtt frissül.
export const steps = [
  {
    title: "Beérkeznek a hibajegyek",
    text: "A kollégák úgy írják meg a jegyet, ahogy éppen tudják — „nem megy!!!”, „SEGÍTSÉG”. Címből senki nem tudja, mi a baj.",
    tag: "Otobo",
    log: [
      "● Új jegyek figyelése",
      "  ✓ #4821, #4822, #4823 beérkezett",
      "  – cím alapján nem azonosítható",
    ],
    changes: Object.fromEntries(tickets.map((t) => [t.id, { arrived: true }])),
  },
  {
    title: "Az AI elolvassa",
    text: "Minden új jegyet a Gemini elolvas: melyik eszköz, mi a hiba, mennyire sürgős — pont úgy, ahogy egy tapasztalt kolléga tenné.",
    tag: "Gemini",
    log: [
      "● #4821 elküldve elemzésre (Node-RED → Gemini)",
      "  ✓ Eszköz: nyomtató · Hiba: papírelakadás · Sürgős",
    ],
  },
  {
    title: "Érthető új cím",
    text: "A semmitmondó címet lecseréli egy olyanra, amiből első ránézésre látszik a probléma. A listában végre lehet keresni.",
    tag: "Átnevezés",
    log: [
      "● Cím átírása",
      "  ✓ „nyomtato” → „Nem nyomtat a 2. emeleti HP nyomtató — papírelakadás”",
    ],
    changes: { t1: { renamed: true } },
  },
  {
    title: "Kategorizálás",
    text: "Eszköztípus (Monitor / Printer / Modem) és jegytípus (service / incident) — automatikusan, így rögtön a jó emberhez kerül.",
    tag: "Kategória",
    log: [
      "● Kategorizálás",
      "  ✓ #4821 → Printer · incident",
      "  ✓ #4822 → Monitor · service",
      "  ✓ #4823 → Modem · incident",
    ],
    changes: {
      t1: { categorized: true },
      t2: { renamed: true, categorized: true },
      t3: { renamed: true, categorized: true },
    },
  },
  {
    title: "Gyűlnek a hozzászólások",
    text: "Egy nehezebb jegy alatt órák alatt összegyűlik egy tucat üzenet. Aki később ránéz, végigolvashatja mindet — vagy…",
    tag: "Hozzászólások",
    log: [
      "● #4823 · új hozzászólások",
      `  ${comments.length} hozzászólás, ${people} résztvevő, ${systemCount} rendszerüzenet`,
    ],
    changes: { t3: { comments: comments.length } },
  },
  {
    title: "Egy gomb: összefoglaló",
    text: "Egy kattintás, és az AI megmondja: mi történt eddig, hol tart a jegy, és mi kellene a megoldáshoz. Nyomd meg te!",
    tag: "Összefoglaló",
    log: [
      "● Összefoglaló kérve: #4823",
      `  ✓ ${comments.length} hozzászólás → 3 bekezdés`,
      "  ✓ Javaslat a megoldáshoz elkészült",
    ],
    changes: { t3: { summarized: true } },
  },
  {
    title: "Az eredmény",
    text: "Pár másodperc alatt: minden jegy érthető címet és kategóriát kapott, a jó emberhez került — a hosszú jegyet pedig bárki fél perc alatt átlátja.",
    tag: "Eredmény",
    hideLog: true, // az alsó napló/lista becsukódik, az eredmény kap helyet
    log: [
      "● Összesítés",
      "  ✓ 3 jegy átnevezve",
      "  ✓ 3 jegy kategorizálva: Printer · Monitor · Modem",
      `  ✓ ${comments.length} hozzászólás → 1 összefoglaló + javaslat`,
      "Kész. Kézi adminisztráció: 0 perc.",
    ],
  },
];

// A lista sorai a stepIndex. lépésben (-1 = indítás előtt). applied: az aktuális lépés már
// alkalmazott változásai (jegy id-k); null = mind. Be nem érkezett jegy még nincs a listában.
export function tableAt(stepIndex, applied = null) {
  const rows = Object.fromEntries(
    tickets.map((t) => [t.id, { ...t, changed: false }]),
  );
  for (let i = 0; i <= stepIndex; i++) {
    const current = i === stepIndex;
    for (const [id, fields] of Object.entries(steps[i].changes || {})) {
      if (current && applied && !applied.includes(id)) continue;
      Object.assign(rows[id], fields);
      if (current) rows[id].changed = true;
    }
  }
  return tickets.map((t) => rows[t.id]).filter((r) => r.arrived);
}

// Az utolsó lépés összesítő chipjei.
export const recap = [
  "3 jegy átnevezve",
  "3 kategorizálva",
  `${comments.length} hozzászólás → 1 összefoglaló`,
  "0 perc kézi munka",
];

export const facts = [
  { value: "20 óra", label: "megtakarítás havonta, fejenként" },
  { value: "100+", label: "hibajegy naponta, kézi címkézés nélkül" },
  { value: "1 kattintás", label: "és látszik, hol tart egy hosszú jegy" },
];

export const benefits = [
  {
    stat: "0",
    title: "„nem megy!!!” című jegy",
    text: "Minden jegy olyan címet kap, amiből rögtön látszik a baj — a listában keresni és szűrni is lehet.",
  },
  {
    stat: "Azonnal",
    title: "a jó emberhez kerül",
    text: "A kategória alapján a nyomtatós jegy a nyomtatóshoz, a sürgős hiba a sor elejére megy — nincs kézi szétosztás.",
  },
  {
    stat: "30 mp",
    title: "egy hosszú jegy átlátása",
    text: "Nem kell végigolvasni 20 hozzászólást: az összefoglaló megmondja, hol tart és mi a következő lépés.",
  },
];
