import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Adatkezelési tájékoztató",
  description: "A Webvulcano adatkezelési tájékoztatója: milyen adatokat kezelünk, miért, meddig, és milyen jogaid vannak (GDPR).",
  path: "/adatkezeles",
});

const { legal } = site;

// Adatkezelések célonként (GDPR 13. cikk): adatok, cél, jogalap, időtartam.
const purposes = [
  {
    title: "Kapcsolatfelvétel és díjmentes vázlat kérése",
    rows: [
      ["Adatok", "Név, email cím, telefonszám (nem kötelező), weboldalad címe (nem kötelező), a vállalkozásod és céljaid leírása."],
      ["Cél", "A díjmentes weboldal-vázlat és az árajánlat elkészítése, kapcsolattartás a megkereséssel kapcsolatban."],
      ["Jogalap", "Szerződéskötést megelőző lépések a kérésedre (GDPR 6. cikk (1) b) pont)."],
      ["Időtartam", "A megkeresés lezárásától számított legfeljebb 1 év, vagy a törlési kérésedig."],
    ],
  },
  {
    title: "Online hívás foglalása",
    rows: [
      ["Adatok", "Név, email cím, a választott időpont, az üzenet."],
      ["Cél", "A hívás megszervezése és a Google Meet link elküldése."],
      ["Jogalap", "Szerződéskötést megelőző lépések a kérésedre (GDPR 6. cikk (1) b) pont)."],
      ["Időtartam", "A hívástól számított legfeljebb 1 év, vagy a törlési kérésedig."],
    ],
  },
  {
    title: "Útmutató letöltése",
    rows: [
      ["Adatok", "Név, email cím, telefonszám (nem kötelező), az AI-ajánlás demóban keresett szakma és város, valamint az, hogy hozzájárultál-e a megkereséshez."],
      ["Cél", "Az útmutató elérhetővé tétele; ha külön hozzájárultál, kapcsolatfelvétel az útmutatóval kapcsolatban."],
      ["Jogalap", "Hozzájárulásod (GDPR 6. cikk (1) a) pont), amelyet bármikor visszavonhatsz."],
      ["Időtartam", "A hozzájárulás visszavonásáig, de legfeljebb 1 évig."],
    ],
  },
  {
    title: "Email levelezés",
    rows: [
      ["Adatok", "Email cím, név, a levél tartalma."],
      ["Cél", "A megkeresésed megválaszolása, kapcsolattartás."],
      ["Jogalap", "Szerződéskötést megelőző lépések, illetve jogos érdek a megkeresés megválaszolásához (GDPR 6. cikk (1) b) és f) pont)."],
      ["Időtartam", "Az ügy lezárásától számított legfeljebb 1 év."],
    ],
  },
  {
    title: "A weboldal működése és biztonsága",
    rows: [
      ["Adatok", "IP-cím, a böngésző és az eszköz típusa, a kérés időpontja (szervernapló); az AI-ajánlás demóban az IP-cím a napi keresési korláthoz."],
      ["Cél", "A weboldal kiszolgálása, hibakeresés, a visszaélések (pl. túlzott terhelés) megelőzése."],
      ["Jogalap", "Jogos érdek a weboldal biztonságos működtetéséhez (GDPR 6. cikk (1) f) pont)."],
      ["Időtartam", "A keresési korlátnál legfeljebb 1 nap (csak a szerver memóriájában); a szervernapló a tárhelyszolgáltató (Vercel) megőrzési szabályai szerint."],
    ],
  },
  {
    title: "Szerződés és számlázás",
    rows: [
      ["Adatok", "Név, cégnév, cím, adószám, a szerződésben és a számlán szereplő adatok."],
      ["Cél", "Ha a megkeresésből megrendelés lesz: a szerződés teljesítése és a számlázás."],
      ["Jogalap", "Szerződés teljesítése (GDPR 6. cikk (1) b) pont); a számlák megőrzésénél jogi kötelezettség (6. cikk (1) c) pont; az adózás rendjéről szóló 2017. évi CL. törvény 78. § (3) bekezdése, az áfatörvény 179. § (1) bekezdése)."],
      ["Időtartam", "A számlákat és az adózással összefüggő iratokat az adó megállapításához való jog elévüléséig őrizzük meg: főszabály szerint annak a naptári évnek az utolsó napjától számított 5 évig, amelyben az adóról bevallást kellett tenni (2017. évi CL. törvény 202. § (1))."],
    ],
  },
];

// Cégnevek/címek a szolgáltatók saját adatvédelmi oldalairól / DPA-jából (ellenőrizve: 2026-10-16).
const processors = [
  ["Vercel Inc. (440 N Barranca Avenue #4133, Covina, CA 91723, USA)", "a weboldal tárhelye, szervernapló"],
  ["Formagrid Inc. – Airtable (1 Front Street, Fl 28, San Francisco, CA 94111, USA)", "az űrlapok és időpontfoglalások adatainak tárolása"],
  ["Cloudflare, Inc. (101 Townsend St., San Francisco, CA 94107, USA)", "a beérkező emailek továbbítása"],
  ["Plus Five Five, Inc. – Resend (2261 Market Street #5039, San Francisco, CA 94114, USA)", "email küldés"],
  ["OpenAI Ireland Ltd. (1st Floor, The Liffey Trust Centre, 117-126 Sheriff Street Upper, Dublin 1, D01 YC43, Írország)", "az AI-ajánlás demó: csak a megadott szakmát és várost kapja meg, személyes adatot nem"],
];

const sections = [
  {
    title: "Az adatkezelő",
    body: [
      <>
        Név: {legal.name}
        <br />
        {legal.address && (
          <>
            Székhely: {legal.address}
            <br />
          </>
        )}
        Nyilvántartási szám: {legal.registryNo}
        <br />
        Adószám: {legal.taxId}
        <br />
        Email: {site.email}
        <br />
        Telefon: {site.phone}
        <br />
        Weboldal: webvulcano.hu
      </>,
    ],
  },
  {
    title: "Milyen adatokat, miért és meddig kezelünk",
    body: ["Csak azokat az adatokat kezeljük, amelyeket megadsz, vagy amelyek a weboldal működéséhez szükségesek:"],
    purposes,
  },
  {
    title: "Adatfeldolgozók",
    body: ["Az adatokat az alábbi szolgáltatók kezelik a megbízásunkból, kizárólag a megjelölt célra:"],
    list: processors.map(([name, role]) => `${name} – ${role}`),
    after: [
      "Az emailjeinket (Gmail) és az online hívásokat (Google Meet) a Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Írország) szolgáltatásával intézzük. Ezeknél a Google önálló adatkezelőként kezeli az adatokat, a saját adatvédelmi irányelvei szerint (policies.google.com/privacy).",
      "Ezeken kívül harmadik félnek az adatokat nem adjuk tovább, és nem értékesítjük.",
    ],
  },
  {
    title: "Adattovábbítás az EU-n kívülre",
    body: [
      "A Vercel, az Airtable, a Cloudflare és a Resend az Amerikai Egyesült Államokban működik, így az adatok oda is kerülhetnek. A Vercel, a Cloudflare és a Resend az EU–USA adatvédelmi keretrendszer (EU-U.S. Data Privacy Framework) szerint tanúsított; az Airtable esetében a továbbítás az Európai Bizottság által elfogadott általános szerződési feltételek (SCC) alapján történik.",
      "A Google Ireland Limited és az OpenAI Ireland Ltd. az EU-n belül működik; ha az adatokat az EU-n kívüli kapcsolt vállalkozásaikhoz továbbítják, azt saját adatvédelmi szabályzatuk szerint, a GDPR V. fejezetének megfelelően teszik (a Google LLC szintén az EU–USA adatvédelmi keretrendszer szerint tanúsított).",
    ],
  },
  {
    title: "Automatizált döntéshozatal",
    body: ["Automatizált döntéshozatalt és profilalkotást nem alkalmazunk."],
  },
  {
    title: "A jogaid",
    body: ["A GDPR alapján jogosult vagy:"],
    list: [
      "Tájékoztatást és hozzáférést kérni a kezelt adataidhoz",
      "Adataid helyesbítését kérni",
      "Adataid törlését kérni",
      "Az adatkezelés korlátozását kérni",
      "Adataidat géppel olvasható formában megkapni (adathordozhatóság)",
      "Tiltakozni a jogos érdeken alapuló adatkezelés ellen",
      "Hozzájárulásodat bármikor visszavonni – ez nem érinti a visszavonás előtti adatkezelés jogszerűségét",
      "Panaszt tenni a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH), vagy bírósághoz fordulni",
    ],
    after: `Kérésedet (a hozzájárulás visszavonását is) a ${site.email} címen nyújthatod be, legfeljebb 30 napon belül teljesítjük.`,
  },
  {
    title: "NAIH elérhetőségek",
    body: [
      <>
        Nemzeti Adatvédelmi és Információszabadság Hatóság
        <br />
        Cím: 1055 Budapest, Falk Miksa utca 9–11.
        <br />
        Postacím: 1363 Budapest, Pf. 9.
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
        <p className="mt-4 text-sm text-paper/55">Utolsó frissítés: 2026. október 16.</p>

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
              {s.purposes && (
                <div className="mt-6 space-y-8">
                  {s.purposes.map((p) => (
                    <div key={p.title}>
                      <h3 className="text-base font-bold">{p.title}</h3>
                      <dl className="mt-3 grid gap-x-6 gap-y-2 text-base sm:grid-cols-[max-content_1fr]">
                        {p.rows.map(([k, v]) => (
                          <div key={k} className="contents">
                            <dt className="text-paper/55">{k}</dt>
                            <dd className="text-paper/75 max-sm:mb-2">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
              {s.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-paper/75">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
              {[s.after].flat().filter(Boolean).map((a) => (
                <p key={a} className="mt-3 text-base text-paper/75">
                  {a}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
