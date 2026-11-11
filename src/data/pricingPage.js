// A /weboldal-keszites-arak oldal szövegei. Az árak NEM itt vannak: a csomagok a content.js `pricing`
// tömbjéből, a havidíjak az `upkeep` objektumból jönnek (egy ár mindenhol).
// Vázlat + döntések: projektek/webvulcano/szoveg-tervezet-arak.md
import { upkeep } from "@/data/content";

const NB = " ";
const ft = (n) => `${n.toLocaleString("hu-HU").replace(/\s/g, NB)}${NB}Ft`;

export const pricingPath = "/weboldal-keszites-arak";

// Írd át, ha az oldal ára vagy tartalma érdemben változik (látható dátum + schema dateModified + sitemap).
export const pricingUpdated = { iso: "2026-11-10", label: "2026. november" };

export const pricingMeta = {
  // ≤60 karakter a „ | WebVulcano” utótaggal együtt (55).
  title: "Weboldal készítés árak 2026 – fix csomagok",
  description: `Weboldal készítés árak 2026-ban: 120 ezer Ft-tól, a legtöbb vállalkozásnak 180 ezer Ft. Fix ár, díjmentes vázlat, 3 hónap ingyen karbantartás.`,
};

// Válasz-először bekezdés: ezt emeli ki a kereső és az AI, ezért minden szám benne van.
export const pricingAnswer = `Nálam egy weboldal 120 és 450${NB}ezer${NB}Ft között van. Egy egyoldalas landing 120${NB}ezer${NB}Ft-tól indul, a legtöbb helyi vállalkozásnak való Üzleti weboldal 180${NB}ezer${NB}Ft, az egyedi funkciós oldal 450${NB}ezer${NB}Ft-ig megy. Az ár fix: a díjmentes vázlat után pontos árajánlatot kapsz, és annyit fizetsz, amennyi abban áll. Alanyi adómentes vagyok, ÁFA nem kerül rá.`;

// Mobilon a hosszú válasz helyett ez látszik (a hosszú desktopon marad, a SEO miatt).
export const pricingAnswerShort = `120–450${NB}ezer${NB}Ft, fix áron. A legtöbbeknek 180${NB}ezer${NB}Ft.`;

export const everyPackage = [
  { title: "Megírt szöveg", text: "Nem neked kell kitalálnod, mit írj magadról." },
  { title: "Egyedi design", text: "A te vállalkozásodra szabva, nem sablonból." },
  { title: "Gyors, mobilbarát oldal", text: "A látogatóid nagy része telefonról érkezik." },
  { title: "Alap SEO", text: "Hogy a helyi keresésekben megtaláljanak." },
  {
    title: `${upkeep.freeMonths}${NB}hónap díjmentes karbantartás`,
    text: "Az átadás után sem maradsz egyedül.",
  },
];

export const priceFactors = [
  {
    title: "Hány oldal és szekció kell",
    text: "Egy egyoldalas landing kevesebb munka, mint egy többoldalas bemutatkozó oldal.",
  },
  {
    title: "Kell-e egyedi funkció",
    text: "Időpontfoglalás, chatbot, automatizáció – ezek viszik feljebb az árat.",
  },
  {
    title: "Megvan-e az alapanyag",
    text: "Ha van logód és vannak jó képeid, gyorsabban haladunk. Ha nincs, segítek.",
  },
  {
    title: "Mennyi a szöveg",
    text: "A szövegírás benne van az árban, de tíz szolgáltatást bemutatni több munka, mint hármat.",
  },
];

// Folyamatos költségek.
export const running = {
  items: [
    {
      title: `Karbantartással: ${ft(upkeep.maintenance)}/hó`,
      text: `Benne van az üzemeltetés (tárhely), a frissítések, a kisebb módosítások (például nyitvatartás, árak, képek cseréje), a Google Cégprofilod gondozása és egy havi jelentés. Az első ${upkeep.freeMonths}${NB}hónap díjmentes.`,
    },
    {
      title: `Karbantartás nélkül: ${ft(upkeep.hosting)}/hó`,
      text: `A karbantartás nem kötelező. Ha nem kéred, csak az oldal üzemeltetését fizeted – negyedévre, fél évre vagy egy évre előre. Az első ${upkeep.freeMonths}${NB}hónap itt is díjmentes.`,
    },
    {
      title: `Domain: évi 2500–4000${NB}Ft`,
      text: "Egy .hu domain ára a regisztrátortól függ. A domaint te regisztrálod a saját nevedre – végig segítek, és ha kell, útmutatót is küldök.",
    },
  ],
};

export const aiVisibility = {
    items: [
    {
      title: "Google Cégprofil",
      text: "Hogy a Google keresőjében és a térképen pontos adatokkal jelenj meg: név, nyitvatartás, elérhetőség, képek.",
    },
    {
      title: "Google Search Console",
      text: "A Google tud az oldaladról, és látod, milyen keresésekre találnak rád.",
    },
    {
      title: "Bing Webmaster Tools",
      text: "Az oldalad bekerül a Bing keresőjébe is – a ChatGPT keresője többek között innen dolgozik.",
    },
    {
      title: "Bing Places for Business",
      text: "A vállalkozásod a Bing térképén és helyi találataiban is megjelenik.",
    },
  ],
};

// Piaci összehasonlítás — név nélkül, kategóriánként. Források (nyilvános árlisták, 2026-11-10):
// lásd projektek/webvulcano/szoveg-tervezet-arak.md → „Piaci adatok forrása”. Ha frissíted, a dátumot is.
export const market = {
  // A WebVulcano oszlop az első adatoszlop. Cella lehet { long, short }: a short a mobilos (rövid) változat,
  // hogy a tábla oldalra lapozás nélkül kiférjen.
  head: [
    "",
    { long: "WebVulcano – Üzleti weboldal", short: "WebVulcano" },
    { long: "WordPress-csomag", short: "WordPress" },
    "Ügynökség",
  ],
  // mobilon rejtett sorok (nem különböztetnek meg)
  hideRowsMobile: ["Admin felület", "Látogatottság mérése"],
  rows: [
    [
      { long: "Elkészítés ára", short: "Ár" },
      { long: `180${NB}ezer${NB}Ft, ÁFA nélkül`, short: `180e${NB}Ft` },
      { long: `119–199${NB}ezer${NB}Ft-tól`, short: `119–199e${NB}Ft` },
      { long: `245${NB}ezer${NB}Ft + ÁFA-tól, jellemzően 400–900${NB}ezer${NB}Ft + ÁFA`, short: `400–900e${NB}Ft` },
    ],
    [
      { long: "Elkészülés", short: "Idő" },
      { long: "Általában 5–10 munkanap", short: `5–10${NB}nap` },
      { long: "Csomagtól függ", short: "változó" },
      { long: "2–6 hét", short: `2–6${NB}hét` },
    ],
    [
      "Szövegírás",
      { long: "Benne van", short: "✓" },
      { long: "Nem szerepel a csomagban", short: "✗" },
      { long: "Külön díjért vagy részben", short: "külön díj" },
    ],
    [
      "Admin felület",
      "Van, a te oldaladra szabva",
      "Van (WordPress)",
      "Van (jellemzően WordPress)",
    ],
    [
      "Látogatottság mérése",
      "Saját analitikai oldal: hányan jöttek, hányan kerestek meg",
      "Google Analytics bekötve",
      "Mérés beállítva",
    ],
    [
      { long: "Vállalkozásra szabott modul", short: "Egyedi modul" },
      { long: "1 választható modul benne van", short: "✓" },
      { long: "Külön díjért", short: "külön díj" },
      { long: `Egyedi funkcióval 900${NB}ezer${NB}Ft + ÁFA-tól`, short: `900e${NB}Ft-tól` },
    ],
    [
      { long: "Google Cégprofil, Search Console, Bing beállítása", short: "AI láthatóság" },
      { long: "Benne van (AI láthatóság beállítása)", short: "✓" },
      { long: "Külön díjért", short: "külön díj" },
      { long: "Nem szerepel az árlistákon", short: "✗" },
    ],
    [
      { long: "Havi költség", short: "Havi díj" },
      {
        long: `${ft(upkeep.hosting)}/hó üzemeltetés, vagy ${ft(upkeep.maintenance)}/hó karbantartással`,
        short: `${upkeep.hosting / 1000}–${upkeep.maintenance / 1000}e${NB}Ft`,
      },
      { long: "Tárhely és domain külön", short: "külön" },
      { long: `Tárhely évi 12–30${NB}ezer${NB}Ft + ÁFA, karbantartás külön`, short: "külön" },
    ],
  ],
};

export const payment = [
  {
    title: "Díjmentes vázlat",
    text: "Előbb látod az oldalad első változatát. Semmire nem kötelez.",
  },
  {
    title: "Fix árajánlat",
    text: "Pontosan leírom, mi van benne, és azt is, mi nincs.",
  },
  {
    title: "1. részlet",
    text: "Ha tetszik a vázlat, és megrendeled az oldalt, ekkor fizeted az első részletet.",
  },
  {
    title: "2. részlet",
    text: "A projekt lezárásakor, amikor az oldalad elkészült.",
  },
];

// Csak ár-kérdések — a főoldali GYIK-et nem ismétli. `mobile: true` = mobilon is látszik. Ebből készül az oldal FAQ schemája is.
export const pricingFaq = [
  {
    q: "Van rejtett költség a weboldal készítés árában?",
    a: "Nincs. Az árajánlatban benne van, mit tartalmaz az oldal, és az is, mit nem. Annyit fizetsz, amennyi abban áll.",
  },
  {
    q: "Kell ÁFÁ-t fizetnem?",
    a: "Nem. Alanyi adómentes vagyok, az árakra nem kerül ÁFA: amit az árajánlatban látsz, az a végösszeg.",
  },
  {
    q: "Mennyi idő alatt készül el a weboldal?",
    a: "Általában 5–10 munkanap. Ha az infók és a képek később érkeznek, az elkészülés ennyivel csúszik. A pontos ütemezés az árajánlatban szerepel.",
  },
  {
    q: "Kötelező a karbantartás?",
    a: `Nem. Karbantartással havi ${ft(upkeep.maintenance)}, amiben az üzemeltetés is benne van. Karbantartás nélkül csak az üzemeltetést fizeted, ez havi ${ft(upkeep.hosting)}. Az első ${upkeep.freeMonths} hónap mindkét esetben díjmentes.`,
  },
  {
    q: "Lehet részletekben fizetni?",
    a: "Igen, két részletben fizetsz. Az elsőt akkor, ha tetszik a díjmentes vázlat, és megrendeled az oldalt. A másodikat a projekt lezárásakor.",
  },
  {
    q: "Mi van, ha később bővíteni szeretném az oldalt?",
    mobile: true, // mobilon csak ezek látszanak (a többit az oldal már elmondja)
    a: "A kisebb módosítások benne vannak a karbantartásban. Nagyobb bővítésre – új aloldal, új modul – külön, szintén fix ajánlatot adok.",
  },
  {
    q: "Miért olcsóbb, mint egy ügynökség?",
    mobile: true, // mobilon csak ezek látszanak (a többit az oldal már elmondja)
    a: "Mert egyedül dolgozom: nincs projektmenedzser és iroda, amit neked kellene kifizetned. Közvetlenül azzal beszélsz, aki az oldaladat készíti.",
  },
  {
    // Lehel szövege (2026-11-10), nyelvileg csiszolva. A „60+ óra” az ő becslése.
    q: "Miért ne csináljam meg magam AI-val, teljesen ingyen?",
    mobile: true, // mobilon csak ezek látszanak (a többit az oldal már elmondja)
    a: "Azt is lehet, 1–2 nap alatt össze is tudod rakni. A gond az, hogy attól, hogy elkészült, még senki nem talál rá: megjelenik majd egyáltalán a Google-keresésekben? Látni fogod hányan érkeznek az oldaladra, és mire kattintanak? Ha nincs 60+ órád egy olyan weboldalra, ami konkrét statisztikákat is mutat, érdemes kiszervezni. Mutatok egy demo-t ahol megnézheted pontosan mit kapsz ha megrendeled a weboldal készítést.",
  },
];
