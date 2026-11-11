import Link from "next/link";
import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import CtaCard from "@/components/ui/CtaCard";
import Icon from "@/components/ui/Icon";
import JsonLd from "@/components/ui/JsonLd";
import { pricing } from "@/data/content";
import {
  aiVisibility,
  everyPackage,
  market,
  payment,
  priceFactors,
  pricingAnswer,
  pricingFaq,
  pricingMeta,
  pricingPath,
  pricingUpdated,
  running,
} from "@/data/pricingPage";
import { site } from "@/data/site";
import {
  breadcrumbSchema,
  faqSchema,
  graphSchema,
  offerCatalogSchema,
  pageMeta,
  webPageSchema,
} from "@/lib/seo";

// Árkalauz: a „weboldal készítés árak” / „honlapkészítés árak” keresések céloldala.
// Szöveg: src/data/pricingPage.js · árak: src/data/content.js (pricing, upkeep) — a főoldallal közös forrás.
export const metadata = pageMeta({ ...pricingMeta, path: pricingPath });

const schema = graphSchema(
  webPageSchema({
    path: pricingPath,
    name: pricingMeta.title,
    description: pricingMeta.description,
    dateModified: pricingUpdated.iso,
  }),
  breadcrumbSchema([{ name: "Weboldal készítés árak", path: pricingPath }]),
  offerCatalogSchema({ path: pricingPath, name: "Weboldal készítés csomagok", items: pricing }),
  faqSchema(pricingFaq),
);

const eyebrow = "text-sm font-medium tracking-eyebrow text-highlight uppercase";

// Kétoszlopos szekció: balra a (tapadó) cím, jobbra a tartalom — a /folyamat/* oldalak mintájára.
function Section({ id, title, intro, children }) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-10 border-t border-paper/10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-24"
    >
      {/* a cím akkor kezd tapadni (görgetéssel együtt menni), amikor eléri a képernyő közepét */}
      <div className="lg:sticky lg:top-[calc(50svh-1.5rem)] lg:self-start">
        <h2 id={id} className="type-h3 font-bold">
          {title}
        </h2>
        {intro && (
          <p className="mt-5 max-w-[42ch] text-base text-paper/70">
            {intro}
          </p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

// Cím + leírás sorok (vonallal elválasztva).
function Rows({ items, numbered = false }) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className="border-t border-paper/10">
      {items.map((item, i) => (
        <li
          key={item.title}
         
          className="flex gap-5 border-b border-paper/10 py-6"
        >
          {numbered && (
            <span aria-hidden="true" className="w-7 shrink-0 pt-1 text-sm font-medium text-paper/60 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <div>
            <h3 className="type-h4 font-medium">{item.title}</h3>
            <p className="mt-2 max-w-[58ch] text-base text-paper/70">{item.text}</p>
          </div>
        </li>
      ))}
    </List>
  );
}

// Valódi <table> (a keresők és az AI táblázatként olvassák); keskeny képernyőn vízszintesen görgethető.
// highlight: a kiemelt oszlop indexe · wide: sokoszlopos tábla (nagyobb minimális szélesség).
function DataTable({ caption, head, rows, highlight, wide = false }) {
  const hl = (i) => (i === highlight ? "bg-highlight/[0.07] font-medium text-paper" : "text-paper/75");
  return (
    <div
     
      tabIndex={0}
      role="region"
      aria-label={caption}
      className="overflow-x-auto rounded-2xl border border-paper/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <table className={`w-full border-collapse text-left text-base ${wide ? "min-w-[720px]" : "min-w-[480px]"}`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-paper/10 bg-paper/[0.04]">
            {head.map((h, i) =>
              // az üres sarokcella nem oszlopfejléc
              h === "" ? (
                <td key={i} />
              ) : (
                <th
                  key={i}
                  scope="col"
                  className={`p-4 text-sm font-medium tracking-label uppercase ${wide ? "lg:p-5" : ""} ${
                    i === highlight ? "bg-highlight/[0.07] text-highlight" : "text-paper/60"
                  }`}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells]) => (
            <tr key={label} className="border-b border-paper/10 last:border-b-0">
              <th scope="row" className={`p-4 align-top font-medium text-paper ${wide ? "lg:p-5" : ""}`}>
                {label}
              </th>
              {cells.map((c, i) => (
                <td key={i} className={`p-4 align-top ${wide ? "lg:p-5" : ""} ${hl(i + 1)}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={schema} />
      <main className="bg-night text-paper">
        <div className="container-x">
          <header className="pt-40 pb-16 lg:pt-48 lg:pb-24">
            <nav aria-label="Morzsamenü" >
              <ol className="flex flex-wrap items-center gap-2 text-sm font-medium tracking-label uppercase">
                <li>
                  <Link href="/" className="text-paper transition hover:text-paper/75">
                    Főoldal
                  </Link>
                </li>
                <li aria-hidden="true" className="text-paper/40">
                  /
                </li>
                <li aria-current="page" className="text-paper/60">
                  Árak
                </li>
              </ol>
            </nav>

            <p className={`mt-10 ${eyebrow}`}>
              Csomagok és árak
            </p>
            <h1 className="mt-4 max-w-[20ch] type-h1 font-bold">
              Weboldal készítés árak 2026: <Accent>mennyibe kerül</Accent> egy weboldal?
            </h1>
            <p
              className="mt-6 max-w-[62ch] text-base text-paper/80 md:text-lg"
             
            >
              {pricingAnswer}
            </p>
            <div
              className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
             
            >
              <Button href={site.ctaHref}>
                Kérek díjmentes vázlatot
                <Icon name="arrow" className="size-4" strokeWidth={2} />
              </Button>
              <p className="text-sm text-paper/60">
                Frissítve: <time dateTime={pricingUpdated.iso}>{pricingUpdated.label}</time> · Írta:{" "}
                {site.owner}, webfejlesztő
              </p>
            </div>
          </header>

          {/* 1. Csomagok */}
          <section aria-labelledby="csomagok" className="border-t border-paper/10 py-16 lg:py-24">
            <h2 id="csomagok" className="max-w-[24ch] type-h2 font-bold">
              Mennyibe kerül egy weboldal? Három csomag, <Accent>fix áron</Accent>
            </h2>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {pricing.map((p, i) => (
                <article
                  key={p.name}
                 
                  className={`noise flex flex-col rounded-2xl bg-gradient-to-b from-night-2 to-night-3 p-7 lg:p-8 ${
                    p.featured ? "ring-1 ring-highlight/40" : ""
                  }`}
                >
                  <p className="text-sm font-medium tracking-label text-highlight uppercase">{p.label}</p>
                  <h3 className="mt-3 type-h3 font-medium">{p.name}</h3>
                  <p className="mt-2 text-sm text-paper/60">{p.forWhom}</p>
                  <p className="mt-6 type-stat font-bold whitespace-nowrap text-highlight">{p.price}</p>
                  <ul className="mt-6 space-y-3 border-t border-paper/10 pt-6">
                    {p.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-paper/80">
                        <Icon
                          name="check"
                          className="mt-1 size-4 shrink-0 text-highlight"
                          strokeWidth={2.4}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-8 text-sm text-paper/60">
                    <span className="font-medium text-paper/85">Elkészül:</span> {p.delivery}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm text-paper/50">
              {site.legal.vat}
            </p>
          </section>

          {/* 2. Minden csomagban */}
          <Section id="minden-csomagban" title="Mi van benne minden csomagban?">
            <Rows items={everyPackage} />
          </Section>

          {/* 3. Mitől függ az ár */}
          <Section
            id="mitol-fugg"
            title="Mitől függ egy weboldal ára?"
          >
            <Rows items={priceFactors} numbered />
            <p className="mt-8 max-w-[58ch] text-base text-paper/70">
              A pontos árat a díjmentes vázlat után kapod meg.{" "}
              <Link
                href="/folyamat/arajanlat"
                className="font-medium text-paper underline decoration-paper/30 underline-offset-[0.2em] transition hover:decoration-paper"
              >
                Így néz ki az árajánlat
              </Link>
              .
            </p>
          </Section>

          {/* 4. Folyamatos költség */}
          <Section
            id="fenntartas"
            title="Mennyibe kerül egy weboldal fenntartása?"
          >
            <Rows items={running.items} />
            <h3 className="mt-12 mb-5 type-h4 font-medium">
              {running.example.caption}
            </h3>
            <DataTable
              caption={running.example.caption}
              head={running.example.head}
              rows={running.example.rows}
              highlight={1}
            />
            <p className="mt-4 text-sm text-paper/50">
              {running.example.note}
            </p>
          </Section>

          {/* 5. AI láthatóság */}
          <Section id="ai-lathatosag" title="Mit jelent az AI láthatóság beállítása?" intro={aiVisibility.intro}>
            <Rows items={aiVisibility.items} />
            <p className="mt-8 max-w-[58ch] text-base text-paper/70">
              Kíváncsi vagy, hol tartasz most?{" "}
              <Link
                href="/#AI"
                className="font-medium text-paper underline decoration-paper/30 underline-offset-[0.2em] transition hover:decoration-paper"
              >
                Nézd meg, ajánl-e téged az AI
              </Link>
              .
            </p>
          </Section>

          {/* 6. Piaci összehasonlítás — teljes szélességben, mert a táblázatnak hely kell */}
          <section aria-labelledby="osszehasonlitas" className="border-t border-paper/10 py-16 lg:py-24">
            <h2 id="osszehasonlitas" className="max-w-[26ch] type-h2 font-bold">
              Weboldal készítés árak a piacon: <Accent>mit kapsz</Accent> a pénzedért?
            </h2>
            <div className="mt-10">
              <DataTable
                caption="Weboldal készítés árak összehasonlítása: WebVulcano, WordPress-csomag és ügynökség"
                head={market.head}
                rows={market.rows}
                highlight={1}
                wide
              />
            </div>
            {/* a lapozási tipp csak ott látszik, ahol a tábla nem fér ki (md alatt) */}
            <p className="mt-3 flex items-center gap-2 text-sm text-paper/60 md:hidden">
              Húzd oldalra a többi oszlopért
              <Icon name="arrow" className="size-4 shrink-0" strokeWidth={2} />
            </p>
            <p className="mt-4 max-w-[80ch] text-sm text-paper/50">
              {market.note}
            </p>
          </section>

          {/* 7. Fizetés */}
          <Section
            id="fizetes"
            title="Hogyan megy a fizetés?"
          >
            <Rows items={payment} numbered />
          </Section>

          {/* 8. GYIK — minden válasz nyitva: a kereső és az AI is teljes szöveget lát */}
          <Section id="gyik-arak" title="Gyakori kérdések az árakról">
            <div className="border-t border-paper/10">
              {pricingFaq.map((item, i) => (
                <div
                  key={item.q}
                 
                  className="border-b border-paper/10 py-6"
                >
                  <h3 className="type-h4 font-medium">{item.q}</h3>
                  <p className="mt-2 max-w-[62ch] text-base text-paper/70">{item.a}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="container-x pb-24 lg:pb-32">
          <CtaCard reveal={false} />
        </div>
      </main>
    </>
  );
}
