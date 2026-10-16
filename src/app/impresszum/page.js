import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Impresszum",
  description: "A Webvulcano (Bognár Lehel egyéni vállalkozó) szolgáltatói adatai és a tárhelyszolgáltató elérhetőségei.",
  path: "/impresszum",
});

const { legal, host } = site;

// Ekertv. 4. § szerinti szolgáltatói adatok. A cím csak akkor jelenik meg, ha a site.js-ben ki van töltve.
const sections = [
  {
    title: "Szolgáltató",
    rows: [
      ["Név", legal.name],
      ["Székhely", legal.address],
      ["Nyilvántartási szám", legal.registryNo],
      ["Nyilvántartó", legal.registry],
      ["Adószám", legal.taxId],
      ["Adózás", legal.vat],
      ["Email", <a key="e" href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-paper">{site.email}</a>],
      ["Telefon", <a key="t" href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline underline-offset-4 hover:text-paper">{site.phone}</a>],
      ["Weboldal", "webvulcano.hu"],
    ],
  },
  {
    title: "Tárhelyszolgáltató",
    rows: [
      ["Név", host.name],
      ["Cím", host.address],
      ["Email", host.email],
      ["Weboldal", host.web],
    ],
  },
];

export default function ImprintPage() {
  return (
    <main className="bg-night text-paper">
      <div className="container-x max-w-3xl pt-40 pb-24 lg:pt-48 lg:pb-36">
        <h1 className="type-h1 font-bold">Impresszum</h1>

        <div className="mt-14 space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="type-h4 font-bold">{s.title}</h2>
              <dl className="mt-4 grid gap-x-8 gap-y-2 text-base sm:grid-cols-[max-content_1fr]">
                {s.rows
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-paper/55">{k}</dt>
                      <dd className="text-paper/80 max-sm:mb-2">{v}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-12 text-base text-paper/75">
          A személyes adatok kezeléséről az{" "}
          <a href={site.privacyUrl} className="underline underline-offset-4 hover:text-paper">
            adatkezelési tájékoztatóban
          </a>{" "}
          olvashatsz.
        </p>
      </div>
    </main>
  );
}
