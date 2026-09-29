// A folyamat 5 lépése — a főoldali Folyamat szekció és a /folyamat/[slug] aloldalak közös forrása.
// Csak valós állítások (brand-context + eddigi copy): nincs kitalált határidő, körszám, ügyfélportál.
// titleLines / outputsTitle: kézi sortörés a görgetésre feltöltődő címekhez (ScrollFill).

const NB = " ";

export const steps = [
  {
    slug: "kuldj-infot",
    title: "Küldj pár infót",
    short:
      "Pár kérdés a vállalkozásodról a lenti űrlapon: mivel foglalkozol, kik az ügyfeleid, mit szeretnél elérni. Két perc az egész.",
    teaser: "Két perc az űrlapon, és tudom, kinek, miért és mit építünk.",
    description:
      "Az első lépés: pár kérdés a vállalkozásodról. Két perc kitölteni, és 24 órán belül személyesen visszajelzek.",
    lead: `Minden jó weboldal néhány jó kérdéssel kezdődik. Két perc az űrlapon, és már tudom, kinek, miért és mit építünk – 24${NB}órán belül személyesen visszajelzek.`,
    outputsTitle: ["Tiszta kiindulás", "a vázlathoz."],
    outputs: [
      "Rögzített cél: mit kell elérnie az oldalnak – hívás, foglalás vagy üzenet",
      "Kép a vállalkozásodról és arról, kik az ügyfeleid",
      "A mostani oldalad átnézése, ha van",
      `Személyes visszajelzés 24${NB}órán belül`,
    ],
    details: [
      {
        titleLines: ["Rövid űrlap,", "nem kérdőív"],
        paragraphs: [
          "Csak azt kérdezem, ami a vázlathoz tényleg kell: mivel foglalkozol, kik az ügyfeleid, és mit szeretnél, hogy a weboldal elérjen. Nem kell hozzá időpont, sem hosszú egyeztetés.",
          "Ha van már anyagod – logó, képek, régi szövegek –, azt is jelezheted, de nem feltétel. Ami hiányzik, azt a vázlatnál együtt pótoljuk.",
        ],
      },
      {
        titleLines: ["Megnézem,", "hol tartasz most"],
        paragraphs: [
          "Ha van weboldalad, átnézem, mi működik és mi nem: milyen gyorsan tölt be, hogyan mutat mobilon, és hol akad el a látogató, mielőtt felvenné veled a kapcsolatot.",
          "Ha még nincs oldalad, azt nézem meg, hogyan mutatkoznak be a versenytársaid – és hol lehet őket jobban csinálni.",
        ],
      },
      {
        titleLines: ["Egy cél,", "amit mérni lehet"],
        paragraphs: [
          "Eldöntjük, mit tekintünk sikernek: hívást, foglalást vagy üzenetet. Ez lesz az a szám, amire az egész oldal épül.",
          "Később az analytics pontosan ezt méri – így nem érzésre, hanem számokból látod, hogy megérte-e.",
        ],
      },
    ],
  },
  {
    slug: "ingyen-vazlat",
    title: "Ingyen vázlatot kapsz",
    short:
      "Elkészítem az oldalad első vázlatát. Így már azelőtt látod, mit kapsz, hogy bármit fizetnél.",
    teaser: "Látod az oldalad első vázlatát, mielőtt bármit fizetnél.",
    description:
      "Mielőtt bármit fizetnél, látod a weboldalad első vázlatát: szerkezet, szövegjavaslat, vizuális irány. Nem kötelez semmire.",
    lead: "Mielőtt bármit fizetnél, látod az oldalad első vázlatát. Így nem zsákbamacskát veszel: pontosan tudod, mire mondasz igent.",
    outputsTitle: ["Látod,", "mielőtt fizetnél."],
    outputs: [
      "Az oldal szerkezete: milyen szekciók, milyen sorrendben",
      "Első szövegjavaslat a fő részekre: cím, ajánlat, cselekvésre ösztönzés",
      "Vizuális irány: színek, betűk, hangulat",
      "Semmilyen kötelezettség – csak megnézed",
    ],
    details: [
      {
        titleLines: ["Szerkezet, ami", "a döntést segíti"],
        paragraphs: [
          "A szekciók sorrendje azt követi, ahogy az ügyfeled dönt: mit csinálsz, miért bízhat benned, mennyibe kerül, és hogyan ér el téged.",
          "Minden résznek egy dolga van: közelebb vinni a látogatót ahhoz, hogy felhívjon vagy írjon neked.",
        ],
      },
      {
        titleLines: ["Szavak, amik", "hívást hoznak"],
        paragraphs: [
          "A jó szöveg nem díszítés. Az ügyfeled nyelvén szól, és megválaszolja a kérdéseit, mielőtt feltenné őket.",
          "A vázlatban már valódi címeket és ajánlatot látsz – nem „lorem ipsumot” –, így azt is el tudod dönteni, hogy a mondanivaló stimmel-e.",
        ],
      },
      {
        titleLines: ["Döntés", "nyomás nélkül"],
        paragraphs: [
          "Ha tetszik az irány, küldök rá árajánlatot. Ha nem, nincs vele több dolgod – nem kell magyarázkodnod.",
          "Ha valamin változtatnál, szólj bátran: a vázlat pont arra való, hogy a módosítások még az árajánlat előtt kiderüljenek.",
        ],
      },
    ],
  },
  {
    slug: "arajanlat",
    title: "Árajánlat",
    short:
      "Ha tetszik az irány, küldök egy átlátható, fix árajánlatot. Nincs rejtett költség, nincs apró betű.",
    teaser: "Fix, átlátható ár – pontosan látod, mit tartalmaz.",
    description:
      "Fix, átlátható árajánlat: pontos tartalom, ütemezés, karbantartás. Nincs rejtett költség, nincs apró betű.",
    lead: "Ha tetszik az irány, fix, átlátható árajánlatot kapsz. Pontosan látod, mit tartalmaz – és azt is, mit nem.",
    outputsTitle: ["Fix ár,", "apró betű nélkül."],
    outputs: [
      `Fix ár a leírt tartalomra, jellemzően 120 és 200${NB}ezer${NB}Ft között`,
      "Pontos lista arról, mit tartalmaz az oldal",
      "Ütemezés: mikor mi készül el",
      `Karbantartás: 15${NB}000${NB}Ft/hó, az első 3${NB}hónap díjmentes`,
    ],
    details: [
      {
        titleLines: ["Nincs", "apró betű"],
        paragraphs: [
          "Az ajánlatban benne van, milyen részekből áll az oldal, milyen funkciókat kap, és ki írja a szövegeket. Ami nincs benne, azt is leírom.",
          "Így nem ér meglepetés a végén: az az ár, amit az elején látsz.",
        ],
      },
      {
        titleLines: ["Ütemezés, amivel", "tervezni tudsz"],
        paragraphs: [
          "Az elkészülés ideje a mérettől függ, és attól, milyen gyorsan érkeznek tőled az infók és a képek.",
          "A pontos ütemezést az ajánlatban rögzítem, hogy előre tudj tervezni – például egy kampánnyal vagy egy szezonkezdettel.",
        ],
      },
      {
        titleLines: ["Utána sem", "maradsz egyedül"],
        paragraphs: [
          `A karbantartás havi 15${NB}ezer${NB}Ft, és az első 3${NB}hónap díjmentes. Ebben benne van a hosting, a frissítések, a kisebb módosítások, a Google Cégprofilod gondozása és egy havi jelentés.`,
          "Ha később nagyobb bővítés kell – új aloldal, új funkció –, arra külön, szintén fix ajánlatot adok.",
        ],
      },
    ],
  },
  {
    slug: "kivitelezes",
    title: "Megcsinálom",
    short:
      "Szöveg, design, fejlesztés – mindent én intézek. Menet közben látod a haladást, és bármikor szólhatsz, ha valamit másképp szeretnél.",
    teaser: "Szöveg, design, fejlesztés – egy kézben, nálam.",
    description:
      "Szövegírás, egyedi design és gyors, mobilbarát fejlesztés egy kézben. Te a végeredményt látod, meg a beérkező hívásokat.",
    lead: "Szöveg, design, fejlesztés – mindent én intézek. Te a végeredményt látod, meg a beérkező hívásokat.",
    outputsTitle: ["Minden", "egy kézben."],
    outputs: [
      "Megírt, érdeklődőkre optimalizált szövegek",
      "Egyedi design, a vállalkozásodra szabva",
      "Gyors, mobilbarát oldal modern alapokon (Next.js)",
      "Alap SEO: meta-adatok, tiszta szerkezet, gyors betöltés",
    ],
    details: [
      {
        titleLines: ["A te ügyfeled", "nyelvén"],
        paragraphs: [
          "A szövegeket én írom, a vázlatnál egyeztetett irány alapján. Nem szakszavakkal, hanem úgy, ahogy az ügyfeled keres és gondolkodik.",
          "Minden cím és gomb egy kérdésre felel: miért nálad, és miért most vegye fel veled a kapcsolatot.",
        ],
      },
      {
        titleLines: ["Design, ami", "bizalmat kelt"],
        paragraphs: [
          "Az első benyomás pár másodperc alatt eldől. A design azt a minőséget mutatja, amit a munkádban is nyújtasz.",
          "Nem sablonból dolgozom: a színek, a betűk és a képek a te vállalkozásodhoz igazodnak – mobilon és számítógépen is.",
        ],
      },
      {
        titleLines: ["Kód, ami", "nem lassít"],
        paragraphs: [
          "Két évig banki rendszereken dolgoztam fejlesztőként – ott a hibának nincs helye. Ugyanezzel a precizitással építem a te oldaladat.",
          "Modern alapokon (Next.js) készül, ezért gyorsan betölt. A türelmetlen látogató nem kattint el, és a Google is jobban szereti.",
        ],
      },
    ],
  },
  {
    slug: "elesites-karbantartas",
    title: "Élesítés és karbantartás",
    short: `Élesítjük az oldalt, bekötöm az analyticset, és onnantól figyelem. Átnézzük a Google Cégprofilodat, és megnézzük, hogyan szerezhetnél több értékelést. Az első 3${NB}hónap karbantartása díjmentes.`,
    teaser: "Élő oldal, csatolt analytics – és nem maradsz magadra.",
    description:
      "Élesítés, csatolt analytics és folyamatos karbantartás. Számokban látod, mit hoz a weboldalad. Az első 3 hónap díjmentes.",
    lead: "Élesítjük az oldalt, bekötöm az analyticset, és onnantól figyelem. Számokban látod, mit hoz a weboldalad.",
    outputsTitle: ["Számokban látod,", "mit hoz."],
    outputs: [
      "Élő oldal a saját domaineden",
      "Csatolt analytics: látogatók, források, érdeklődők",
      "Google Cégprofil átnézése és rendbetétele",
      "Terv, hogyan szerezz több Google-értékelést",
      "Hosting, frissítések, kisebb módosítások",
      `3${NB}hónap díjmentes karbantartás, utána 15${NB}000${NB}Ft/hó`,
    ],
    details: [
      {
        titleLines: ["Élesítés", "gond nélkül"],
        paragraphs: [
          "Az oldal kiszolgálását én intézem, tárhellyel nem kell foglalkoznod. Ha még nincs domain neved, segítek beszerezni.",
          "Élesítés előtt végigpróbálom az oldalt telefonon és számítógépen is, hogy az első látogatód már a kész, működő verziót lássa.",
        ],
      },
      {
        titleLines: ["Számok,", "nem érzések"],
        paragraphs: [
          "Az analytics megmutatja, hány látogatód volt, honnan érkeztek, és hányan vették fel veled a kapcsolatot.",
          "Így feketén-fehéren látod, mit hoz az oldal – és azt is, hol érdemes még javítani rajta.",
        ],
      },
      {
        titleLines: ["Google Cégprofil", "és értékelések"],
        paragraphs: [
          "Átnézzük a Google Cégprofilodat: stimmelnek-e az adatok, a nyitvatartás, a kategóriák és a képek, és ugyanazt mondja-e, mint a weboldalad.",
          "Megnézzük, hogyan szerezhetnél több értékelést a vállalkozásodnak – mert aki a Google-ben rád talál, először a csillagokat nézi.",
        ],
      },
      {
        titleLines: ["Folyamatos", "karbantartás"],
        paragraphs: [
          `Az első 3${NB}hónap karbantartása díjmentes, utána havi 15${NB}ezer${NB}Ft. Ebben benne vannak a frissítések és a kisebb módosítások (például a nyitvatartás, az árak vagy a képek cseréje), a Google Cégprofilod gondozása, és minden hónapban kapsz egy rövid jelentést: hány látogatód volt, és hányan kerestek meg.`,
          "Nem hagylak magadra az átadás után: ha valami változik a vállalkozásodban, az oldalad is követi.",
        ],
      },
    ],
  },
];

export function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const stepPath = (slug) => `/folyamat/${slug}`;

export function getStep(slug) {
  const index = steps.findIndex((s) => s.slug === slug);
  if (index === -1) return null;
  return { step: steps[index], index, next: steps[index + 1] ?? null };
}
