// Forrás: kod/webvulcano/components/projectlist.jsx (fő oldal) — valós projektek.

export const featuredProjects = [
  {
    title: "M.I.K Előtető",
    kind: "Weboldal · helyi szolgáltató",
    summary:
      "A vállalkozónak eddig nem volt weboldala. A cél egy átlátható, bizalomkeltő és egyszerű oldal volt, aminek egyetlen dolga van: hogy felvegyék vele a kapcsolatot.",
    tags: ["Weboldal", "Mobilbarát", "React", "Kész"],
    image: "/projects/mik-eloteto/mikeloteto_1.jpg",
    width: 2394,
    height: 1373,
    url: "https://mikeloteto.hu",
  },
  {
    title: "StillSoul Production",
    kind: "Weboldal · média ügynökség",
    summary:
      "Profi megjelenés, szolgáltatások és referenciák egy helyen, kapcsolatfelvételi űrlappal. Mögé admin felület is készült, amin a tulajdonos maga szerkeszti a tartalmat és a képeket.",
    tags: ["Weboldal", "Admin felület", "Next.js", "Űrlap"],
    image: "/projects/stillsoulproduction/still_1.jpg",
    width: 2394,
    height: 1374,
    url: "https://stillsoulproduction.hu",
  },
  {
    title: "Hideg email automatizáló",
    kind: "AI automatizáció · saját eszköz",
    summary:
      "Megkeresi a megadott iparágban a potenciális ügyfeleket, kiküldi az emailt, és egy Notion adatbázisban követi, melyik kontakt hol tart. A napi 2–3\u00a0órás keresés és emailezés 1\u00a0percre rövidült.",
    tags: ["AI automatizáció", "Apify", "Notion API", "Resend"],
    image: "/projects/cold-email-sender/email-sender1.png",
    width: 3420,
    height: 2146,
  },
];

export const otherProjects = [
  {
    title: "Ticketing rendszer AI integráció",
    kind: "AI automatizáció",
    stat: "20\u00a0óra",
    statLabel: "megtakarítás havonta, fejenként",
    summary:
      "Napi 100+\u00a0hibajegy automatikus kategorizálása, átnevezése és összefoglalása – hogy a csapat a megoldásra figyeljen, ne az adminisztrációra.",
    tags: ["Node-RED", "Otobo", "Gemini API"],
  },
  {
    title: "Mooira",
    kind: "Weboldal · esküvői ruhavarrás",
    stat: "Folyamatban",
    statLabel: "régi oldal teljes újjáépítése",
    summary:
      "Egy elavult weboldal modernizálása: letisztult, könnyen navigálható és gyors oldal, ami jól mutatja be a szolgáltatásokat és a referenciákat.",
    tags: ["Weboldal", "Next.js", "Redesign"],
  },
];

// A „Probléma” szekció képfala (screenshotok a kész munkákból).
export const wallImages = [
  "/projects/mik-eloteto/mikeloteto_1.jpg",
  "/projects/stillsoulproduction/still_2.jpg",
  "/projects/cold-email-sender/email-sender2.png",
  "/projects/mik-eloteto/mikeloteto_2.jpg",
  "/projects/stillsoulproduction/still_1.jpg",
  "/projects/cold-email-sender/email-sender1.png",
  "/projects/mik-eloteto/mikeloteto_3.jpg",
  "/projects/stillsoulproduction/still_3.jpg",
  "/projects/cold-email-sender/email-sender3.png",
];
