// Forrás: kod/webvulcano/components/projectlist.jsx (fő oldal) — valós projektek.

export const featuredProjects = [
  {
    title: "M.I.K Előtető",
    kind: "Weboldal · helyi szolgáltató",
    summary:
      "A vállalkozónak eddig nem volt weboldala. A cél egy átlátható, bizalomkeltő és egyszerű oldal volt, aminek egyetlen dolga van: hogy felvegyék vele a kapcsolatot.",
    tags: ["Weboldal", "Mobilbarát", "React", "Kész"],
    image: "/projects/mik-eloteto/mikeloteto_1.webp",
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
    image: "/projects/stillsoulproduction/still_1.webp",
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
    image: "/projects/cold-email-sender/email-sender1.webp",
    width: 2400,
    height: 1506,
    demo: "/munkaim/hideg-email",
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
    demo: "/munkaim/ticketing",
  },
  {
    title: "Automatikus Google-értékelés gyűjtő",
    kind: "AI automatizáció",
    stat: "0 perc",
    statLabel: "kézi munka egy értékelés-kérésre",
    summary:
      "Amikor egy munka véget ér, a rendszer kiolvassa a naptárból, és 1–2 nappal később magától küld egy személyes hangú emailt az ügyfélnek: ha elégedett volt, értékeljen a Google-ön. Egyetlen kérés sem marad el, az értékelések automatikusan érkeznek majd.",
    tags: ["Make.com", "Google Calendar", "Email", "Google értékelés"],
    demo: "/munkaim/ertekeles",
  },
  {
    title: "Érted hallásgondozó",
    kind: "Weboldal · hallásgondozás",
    stat: "Folyamatban",
    statLabel: "teljes újjáépítés, élesítés előtt",
    summary:
      "Teljes újjáépítés: jól olvasható, egyszerű oldal, ahol a látogató gyorsan megtalálja, amit keres, és könnyen időpontot kér. A főoldalon kiemelve jelennek meg az aktuális akciók, mellette termékoldal és blog. Mögé admin felület készül: a tulajdonos látja, hányan jöttek, mire kattintottak és mennyi időt töltöttek az oldalon, ezenkívül maga tudja szerkeszteni az akciókat és a blogcikkeket.",
    tags: ["Weboldal", "Admin felület", "Analitika", "Blog"],
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
  "/projects/mik-eloteto/mikeloteto_1.webp",
  "/projects/stillsoulproduction/still_2.webp",
  "/projects/cold-email-sender/email-sender2.webp",
  "/projects/mik-eloteto/mikeloteto_2.webp",
  "/projects/stillsoulproduction/still_1.webp",
  "/projects/cold-email-sender/email-sender1.webp",
  "/projects/mik-eloteto/mikeloteto_3.webp",
  "/projects/stillsoulproduction/still_3.webp",
  "/projects/cold-email-sender/email-sender3.webp",
];
