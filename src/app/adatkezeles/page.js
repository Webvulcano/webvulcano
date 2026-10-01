import { site } from "@/data/site";

export const metadata = {
  title: "Adatkezelési tájékoztató | Webvulcano",
  description: "Adatkezelési tájékoztató és GDPR információk.",
};

// Tartalom: a régi webvulcano.hu/adatkezeles alapján, a variant-2 űrlapjaihoz és szolgáltatóihoz igazítva.
const sections = [
  {
    title: "Az adatkezelő",
    body: [
      <>
        Név: {site.owner} egyéni vállalkozó
        <br />
        Székhely: Magyarország
        <br />
        Email: {site.email}
        <br />
        Weboldal: webvulcano.hu
      </>,
    ],
  },
  {
    title: "A kezelt adatok köre",
    body: ["A weboldal űrlapjainak kitöltésekor az alábbi adatokat kezeljük:"],
    list: [
      "Név és email cím",
      "Weboldal címe (opcionális)",
      "A vállalkozásoddal és céljaiddal kapcsolatos leírás (opcionális)",
      "Időpontfoglalásnál a választott időpont és az üzenet",
    ],
  },
  {
    title: "Az adatkezelés célja",
    list: [
      "A díjmentes weboldal-vázlat elkészítése és visszaküldése",
      "A lefoglalt online hívás megszervezése és a Google Meet link elküldése",
      "A kért útmutató elküldése",
      "Kapcsolatfelvétel a fenti megkeresésekkel kapcsolatban",
    ],
  },
  {
    title: "Az adatkezelés jogalapja",
    body: [
      "Az adatkezelés jogalapja az önkéntes hozzájárulásod (GDPR 6. cikk (1) bekezdés a) pont), amelyet az űrlap elküldésével és az adatkezelési tájékoztató elfogadásával adsz meg.",
    ],
  },
  {
    title: "Az adatkezelés időtartama",
    body: [
      "Az adatokat a megkeresés lezárásától számított legfeljebb 1 évig tároljuk, vagy addig, amíg a törlésüket nem kéred – amelyik előbb bekövetkezik.",
    ],
  },
  {
    title: "Adatfeldolgozók, adattovábbítás",
    body: [
      "Az űrlapok és időpontfoglalások adatait az Airtable (Formagrid Inc.) szolgáltatásban tároljuk. A weboldalt a Vercel Inc. tárhelye szolgálja ki. Adatvédelmi irányelveik: airtable.com/privacy és vercel.com/legal/privacy-policy.",
      "Az AI-ajánlás demó csak a megadott iparágat és várost küldi el az OpenAI szolgáltatásnak, személyes adatot nem.",
      "Ezeken kívül harmadik félnek az adatokat nem adjuk tovább, és nem értékesítjük.",
    ],
  },
  {
    title: "A jogaid",
    body: ["A GDPR alapján jogosult vagy:"],
    list: [
      "Tájékoztatást kérni a kezelt adataidról",
      "Adataid helyesbítését kérni",
      "Adataid törlését kérni",
      "Az adatkezelés korlátozását kérni",
      "Hozzájárulásodat bármikor visszavonni",
      "Panaszt tenni a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH)",
    ],
    after: `Kérésedet a ${site.email} címen nyújthatod be, legfeljebb 30 napon belül teljesítjük.`,
  },
  {
    title: "NAIH elérhetőségek",
    body: [
      <>
        Nemzeti Adatvédelmi és Információszabadság Hatóság
        <br />
        Cím: 1055 Budapest, Falk Miksa utca 9–11.
        <br />
        Telefon: +36 (1) 391-1400
        <br />
        Email: ugyfelszolgalat@naih.hu
        <br />
        Web: naih.hu
      </>,
    ],
  },
  {
    title: "Sütik",
    body: [
      "A weboldal nem használ sütiket, és nem tárol adatot a böngésződben. Elemző vagy marketing eszközt nem alkalmazunk.",
    ],
  },
  {
    title: "Módosítások",
    body: [
      "Fenntartjuk a jogot a tájékoztató módosítására. A módosítás dátumát az oldal tetején feltüntetjük.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-night text-paper">
      <div className="container-x max-w-3xl pt-40 pb-24 lg:pt-48 lg:pb-36">
        <h1 className="type-h1 font-bold">Adatkezelési tájékoztató</h1>
        <p className="mt-4 text-sm text-paper/55">Utolsó frissítés: 2026. október 1.</p>

        <div className="mt-14 space-y-12">
          {sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="type-h4 font-bold">
                {i + 1}. {s.title}
              </h2>
              {s.body?.map((b, k) => (
                <p key={k} className="mt-3 text-base text-paper/75">
                  {b}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-paper/75">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
              {s.after && <p className="mt-3 text-base text-paper/75">{s.after}</p>}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
