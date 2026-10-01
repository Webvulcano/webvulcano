// Szövegek: brand-context/* + projektek/webvulcano/szoveg-tervezet.md alapján.

export const problemPoints = [
  "3\u00a0másodperc alatt megérteti, ki vagy és mivel foglalkozol",
  "Első ránézésre bizalmat kelt",
  "A te vállalkozásodra szabott, nem sablon",
  "Mobilon is gyors és gördülékeny",
];

export const guarantees = [
  {
    title: ["3\u00a0hónap", "ingyen karbantartás"],
    text: "Az átadás után sem maradsz egyedül.",
  },
  {
    title: ["Ingyen vázlat", "fizetés előtt"],
    text: "Előbb látod az oldalad, csak utána döntesz.",
  },
  {
    title: ["Mérhető", "eredmény"],
    text: "Csatolt analytics: látod, mennyi érdeklődőt hoz.",
  },
];

export const services = [
  {
    title: "Teljes csomag, egy kézben",
    text: "Szöveg, design, fejlesztés, élesítés. Nem kell három embert koordinálnod – egyetlen emberrel egyeztetsz: velem.",
  },
  {
    title: "Közvetlenül velem dolgozol",
    text: "Nincs projektmenedzser, nincs junior, aki rajtad tanul. Budapesti, magyar nyelvű, közvetlen kapcsolat.",
  },
  {
    title: "Megtérülő weboldal",
    text: "Nem dicséretre tervezem, hanem érdeklődőkre. Az analytics feketén-fehéren megmutatja, mennyit hoz az oldalad.",
  },
];

export const benefits = [
  {
    icon: "code",
    title: "Fejlesztői háttér",
    text: "4 év fejlesztői tapasztalattal rendelkezem, ebből 2 évig banki rendszereken dolgoztam fejlesztőként. Ott tanultam meg, mit jelent megbízható, hibamentes munkát szállítani – ezt hozom a te oldaladra is.",
  },
  {
    icon: "package",
    title: "Teljes csomag egy kézben",
    text: "Szövegírás, design, fejlesztés, élesítés. Te csak a végeredményt látod – meg a beérkező hívásokat.",
  },
  {
    icon: "bolt",
    title: "Villámgyors betöltés",
    text: "Modern alapokon (Next.js) épül, ezért gyorsan betölt. Nem veszíted el a türelmetlen látogatót, és a Google is jobban szereti.",
  },
  {
    icon: "target",
    title: "Érdeklődőkre tervezve",
    text: "Az oldal célja, hogy ügyfelet hozzon: jól látható elérhetőség, egyértelmű gombok, egyszerű kapcsolatfelvétel.",
  },
  {
    icon: "chart",
    title: "Mérhető eredmény",
    text: "Csatolt analytics: látod, hány látogató jött, honnan, és hányan vették fel veled a kapcsolatot.",
  },
  {
    icon: "search",
    title: "Alap SEO beépítve",
    text: "Rendezett meta-adatok, gyors betöltés, tiszta szerkezet – hogy a helyi keresésekben is megtaláljanak.",
  },
  {
    icon: "phone",
    title: "Mobilra optimalizálva",
    text: "A látogatóid nagy része telefonról érkezik. Az oldal minden képernyőn ugyanolyan jól működik.",
  },
  {
    icon: "server",
    title: "Hosting és karbantartás",
    text: "Én szolgálom ki az oldalt, és frissítem, ha kell. Az első 3\u00a0hónap díjmentes, utána 15\u00a0ezer\u00a0Ft/hó.",
  },
];

// A folyamat lépései: data/steps.js (főoldal + /folyamat/[slug] aloldalak közös forrása).

// ⚠️ Csomagnevek/tartalom: javaslat a positioning.md ársávjából (80–200e, tipikus 120e) — Lehel véglegesíti.
export const pricing = [
  {
    label: "Egy oldal",
    name: "Landing oldal",
    text: "Egyetlen, fókuszált oldal egy világos céllal: hívás vagy üzenet.",
    forWhom: "Induló vállalkozásoknak, egy-egy szolgáltatásra",
    price: "120e\u00a0Ft-tól",
  },
  {
    label: "Legjobb ár-érték",
    name: "Üzleti weboldal",
    text: "Rád szabott, több szekciós oldal szövegírással, referenciákkal, űrlappal és csatolt analyticsszel.",
    forWhom: "A legtöbb helyi vállalkozásnak ez a jó választás",
    price: "150e\u00a0Ft",
    featured: true,
  },
  {
    label: "Egyedi igények",
    name: "Ultra Weboldal",
    text: "Admin felület, egyedi automatizációk - vállalkozásodra szabva",
    forWhom: "Ha több kell, mint egy bemutatkozó oldal",
    price: "450e\u00a0Ft-ig",
  },
];

export const faq = [
  {
    q: "Mennyibe kerül egy weboldal?",
    a: "120 és 450\u00a0ezer\u00a0Ft között, a komplexitástól függően. A legtöbb helyi vállalkozásnak szóló oldal nagyjából 160\u00a0ezer\u00a0Ft. Az ingyen vázlat után pontos, fix árajánlatot kapsz.",
  },
  {
    q: "Tényleg ingyen van a vázlat? Mire kötelez?",
    a: "Igen, ingyen van, és semmire nem kötelez. Megnézed, és ha tetszik, adok árajánlatot. Ha nem, nincs vele több dolgod.",
  },
  {
    q: "Mit kell nekem csinálnom?",
    a: "Minimálisat. Pár infót kérek a vállalkozásodról és – ha vannak – képeket. A szöveget megírom, a designt és a fejlesztést intézem.",
  },
  {
    q: "Mennyi idő alatt készül el az oldal?",
    a: "A mérettől függ, és attól, milyen gyorsan érkeznek az infók és a képek. A pontos ütemezést az árajánlatban leírom, hogy előre tudj tervezni.",
  },
  {
    q: "Mit tartalmaz a karbantartás?",
    a: "Hosting, frissítések, kisebb módosítások (pl.\u00a0nyitvatartás, árak, képek cseréje), a Google Cégprofilod gondozása és egy havi rövid jelentés: hány látogatód volt, és hányan kerestek meg. Havi 15\u00a0ezer\u00a0Ft – az első 3\u00a0hónap díjmentes.",
  },
  {
    q: "Kell külön tárhelyet vennem?",
    a: "Nem, a tárhellyel nem kell foglalkoznod: az oldal kiszolgálását én intézem. Ha még nincs domain neved (pl.\u00a0cegneved.hu), segítek beszerezni.",
  },
  {
    q: "Megtalálnak majd a Google-ben?",
    a: "Az alap SEO beépítve jár: rendezett meta-adatok, gyors betöltés, tiszta szerkezet, mobilbarát megjelenés. Ez az alapja annak, hogy a helyi keresésekben is feljebb kerülj.",
  },
  {
    q: "Mit mutat az analytics?",
    a: "Hány látogatód volt, honnan érkeztek (Google, Facebook, közvetlenül), és hányan vették fel veled a kapcsolatot. Számokban látod, mit hoz az oldal.",
  },
  {
    q: "Van már weboldalam. Azt is megújítod?",
    a: "Igen. Megnézem a mostanit, és a vázlatban megmutatom, hogyan lehetne belőle ügyfelet hozó oldal.",
  },
  {
    q: "Később módosíthatom az oldalt?",
    a: "Persze. A kisebb módosításokat a karbantartás keretében elvégzem. Ha nagyobb bővítés kell (új aloldal, új funkció), arra külön ajánlatot adok.",
  },
];

