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
  pricingAnswerShort,
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
      className="grid gap-6 border-t border-paper/10 py-12 md:gap-10 md:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-24"
    >
      {/* a cím akkor kezd tapadni (görgetéssel együtt menni), amikor eléri a képernyő közepét */}
      <div className="lg:sticky lg:top-[calc(50svh-1.5rem)] lg:self-start">
        <h2 id={id} className="type-h3 font-bold">
          {title}
        </h2>
        {intro && (
          <p className="mt-5 hidden max-w-[42ch] text-base text-paper/70 md:block">
            {intro}
          </p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

// Cím + leírás sorok (vonallal elválasztva). Mobilon csak a cím látszik (a leírás desktopon marad).
function Rows({ items, numbered = false }) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className="border-t border-paper/10">
      {items.map((item, i) => (
        <li
          key={item.title}
         
          className="flex items-baseline gap-4 border-b border-paper/10 py-4 md:gap-5 md:py-6"
        >
          {numbered && (
            <span aria-hidden="true" className="w-7 shrink-0 text-sm font-medium text-paper/60 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <div>
            <h3 className="type-h4 font-medium">{item.title}</h3>
            <p className="mt-2 hidden max-w-[58ch] text-base text-paper/70 md:block">{item.text}</p>
          </div>
        </li>
      ))}
    </List>
  );
}

// Cella: sima szöveg, vagy { long, short } — a short mobilon látszik, a long md-től.
function Cell({ value }) {
  if (value && typeof value === "object") {
    return (
      <>
        <span className="md:hidden">{value.short}</span>
        <span className="hidden md:inline">{value.long}</span>
      </>
    );
  }
  return value;
}
const longOf = (v) => (v && typeof v === "object" ? v.long : v);

// Valódi <table> (a keresők és az AI táblázatként olvassák). Mobilon oldalra lapozás nélkül fér ki:
// rövid cellák ({ long, short }), és a hideRowsMobile / hideColsMobile sorok, oszlopok rejtve.
// highlight: a kiemelt oszlop indexe · wide: sokoszlopos tábla (md-től nagyobb minimális szélesség).
function DataTable({ caption, head, rows, highlight, wide = false, hideRowsMobile = [], hideColsMobile = [] }) {
  const hl = (i) => (i === highlight ? "bg-highlight/[0.07] font-medium text-paper" : "text-paper/75");
  const col = (i) => (hideColsMobile.includes(i) ? "hidden md:table-cell" : "");
  const pad = `px-2 py-3 md:p-4 ${wide ? "lg:p-5" : ""}`;
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption}
      className="overflow-x-auto rounded-2xl border border-paper/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <table
        className={`w-full border-collapse text-left text-sm md:text-base ${wide ? "md:min-w-[720px]" : "md:min-w-[480px]"}`}
      >
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
                  className={`${pad} ${col(i)} text-xs font-medium md:text-sm md:tracking-label md:uppercase ${
                    i === highlight ? "bg-highlight/[0.07] text-highlight" : "text-paper/60"
                  }`}
                >
                  <Cell value={h} />
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells]) => (
            <tr
              key={longOf(label)}
              className={`border-b border-paper/10 last:border-b-0 ${
                hideRowsMobile.includes(longOf(label)) ? "hidden md:table-row" : ""
              }`}
            >
              <th scope="row" className={`${pad} align-top font-medium text-paper`}>
                <Cell value={label} />
              </th>
              {cells.map((c, i) => (
                <td key={i} className={`${pad} ${col(i + 1)} align-top ${hl(i + 1)}`}>
                  <Cell value={c} />
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
          <header className="pt-32 pb-12 md:pt-40 md:pb-16 lg:pt-48 lg:pb-24">
            <nav aria-label="Morzsamenü" className="hidden md:block">
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

            <p className={`mt-10 hidden md:block ${eyebrow}`}>
              Csomagok és árak
            </p>
            <h1 className="max-w-[20ch] md:mt-4 type-h1 font-bold">
              Weboldal készítés árak 2026: <Accent>mennyibe kerül</Accent> egy weboldal?
            </h1>
            <p className="mt-6 text-base text-paper/80 md:hidden">{pricingAnswerShort}</p>
            <p className="mt-6 hidden max-w-[62ch] text-lg text-paper/80 md:block">{pricingAnswer}</p>
            <div
              className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
             
            >
              <Button href={site.ctaHref}>
                Mennyibe kerülne ez nekem?
                <Icon name="arrow" className="size-4" strokeWidth={2} />
              </Button>
            </div>
          </header>

          {/* 1. Csomagok */}
          <section aria-labelledby="csomagok" className="border-t border-paper/10 py-12 md:py-16 lg:py-24">
            <h2 id="csomagok" className="max-w-[24ch] type-h2 font-bold">
              Mennyibe kerül egy weboldal? Három csomag, <Accent>fix áron</Accent>
            </h2>
            <div className="mt-8 grid gap-5 md:mt-12 lg:grid-cols-3">
              {pricing.map((p, i) => (
                <article
                  key={p.name}
                 
                  className={`noise flex flex-col rounded-2xl bg-gradient-to-b from-night-2 to-night-3 p-6 md:p-7 lg:p-8 ${
                    p.featured ? "ring-1 ring-highlight/40" : ""
                  }`}
                >
                  <p className="text-sm font-medium tracking-label text-highlight uppercase">{p.label}</p>
                  <h3 className="mt-3 type-h3 font-medium">{p.name}</h3>
                  <p className="mt-2 hidden text-sm text-paper/60 md:block">{p.forWhom}</p>
                  <p className="mt-4 md:mt-6 type-stat font-bold whitespace-nowrap text-highlight">{p.price}</p>
                  <ul className="mt-5 space-y-3 border-t border-paper/10 pt-5 md:mt-6 md:pt-6">
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
                  <p className="mt-auto hidden pt-8 text-sm text-paper/60 md:block">
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
            <p className="mt-6 max-w-[58ch] text-base text-paper/70 md:mt-8">
              <span className="hidden md:inline">A pontos árat a díjmentes vázlat után kapod meg. </span>
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
            <h3 className="mt-8 mb-4 type-h4 font-medium md:mt-12 md:mb-5">
              {running.example.caption}
            </h3>
            <DataTable
              caption={running.example.caption}
              head={running.example.head}
              rows={running.example.rows}
              highlight={1}
              hideColsMobile={running.example.hideColsMobile}
            />
            <p className="mt-4 text-sm text-paper/50">
              {running.example.note}
            </p>
          </Section>

          {/* 5. AI láthatóság */}
          <Section id="ai-lathatosag" title="Mit jelent az AI láthatóság beállítása?" intro={aiVisibility.intro}>
            <Rows items={aiVisibility.items} />
            <p className="mt-6 max-w-[58ch] text-base text-paper/70 md:mt-8">
              <span className="hidden md:inline">Kíváncsi vagy, hol tartasz most? </span>
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
          <section aria-labelledby="osszehasonlitas" className="border-t border-paper/10 py-12 md:py-16 lg:py-24">
            <h2 id="osszehasonlitas" className="max-w-[26ch] type-h2 font-bold">
              Weboldal készítés árak a piacon: <Accent>mit kapsz</Accent> a pénzedért?
            </h2>
            <div className="mt-8 md:mt-10">
              <DataTable
                caption="Weboldal készítés árak összehasonlítása: WebVulcano, WordPress-csomag és ügynökség"
                head={market.head}
                rows={market.rows}
                highlight={1}
                wide
                hideRowsMobile={market.hideRowsMobile}
              />
            </div>
            {market.note && <p className="mt-4 hidden max-w-[80ch] text-sm text-paper/50 md:block">{market.note}</p>}
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
                  className={`border-b border-paper/10 py-5 md:py-6 ${item.mobile ? "" : "hidden md:block"}`}
                >
                  <h3 className="type-h4 font-medium">{item.q}</h3>
                  <p className="mt-2 max-w-[62ch] text-base text-paper/70">{item.a}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="container-x pb-16 md:pb-24 lg:pb-32">
          <CtaCard reveal={false} />
        </div>
      </main>
    </>
  );
}
