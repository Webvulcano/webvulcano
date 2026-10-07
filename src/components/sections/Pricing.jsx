import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { pricing } from "@/data/content";
import { site } from "@/data/site";

const headline = ["Profi", "vállalkozásnak", "profi", "weboldal", "jár."];

// Mobilon (lg alatt): a cím 2 sorban („Profi vállalkozásnak / profi weboldal jár.”), az alcím rejtve;
// a kiemelt csomag felül teljes szélességben, alatta a másik kettő kompakt kártyaként egymás mellett.

export default function Pricing() {
  return (
    <section id="arak" className="relative overflow-clip bg-night text-paper">
      <div className="container-x grid gap-14 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-36">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <p data-reveal className="text-sm font-medium tracking-eyebrow text-paper/60 uppercase">
            Csomagok és árak
          </p>
          <h2 className="mt-6 type-h2 font-bold max-lg:text-[1.75rem] max-lg:leading-tight">
            {headline.map((w, i) => (
              <span key={i}>
                <span data-reveal style={{ "--d": `${i * 70}ms` }} className="inline-block lg:block">
                  {w}
                </span>
                {i === 1 ? <br className="lg:hidden" /> : " "}
              </span>
            ))}
          </h2>
          <p data-reveal className="mt-8 hidden max-w-[30ch] type-lead text-muted-soft lg:block">
            Egy összecsapott oldal azt üzeni: nem veszed komolyan a saját munkád.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-5">
          {pricing.map((p, i) => (
            <article
              key={p.name}
              data-reveal
              style={{ "--d": `${i * 100}ms` }}
              className={`noise flex flex-col rounded-2xl bg-gradient-to-b from-night-2 to-night-3 lg:block lg:p-10 ${
                p.featured
                  ? "col-span-2 order-first p-7 lg:order-none"
                  : "p-5 lg:p-8"
              }`}
            >
              <p className={`font-medium tracking-label text-highlight uppercase ${p.featured ? "text-sm" : "text-xs lg:text-sm"}`}>{p.label}</p>
              <h3 className={`mt-3 font-medium ${p.featured ? "type-h3" : "text-lg leading-snug lg:type-h3"}`}>{p.name}</h3>
              <p className={`mt-4 max-w-[52ch] text-base text-paper/75 ${p.featured ? "" : "hidden lg:block"}`}>{p.text}</p>
              <p className={`mt-2 text-sm text-paper/60 ${p.featured ? "" : "hidden lg:block"}`}>{p.forWhom}</p>
              {p.highlights && (
                <ul className="mt-3 space-y-1 lg:hidden">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-1.5 text-xs leading-snug text-paper/70">
                      <Icon name="check" className="mt-px size-3 shrink-0 text-highlight" strokeWidth={2.4} />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              <div className={`flex flex-wrap items-end justify-between gap-4 ${p.featured ? "mt-8 lg:mt-10" : "mt-auto pt-6 lg:mt-10 lg:pt-0"}`}>
                <div>
                  <p className={`text-sm font-medium tracking-label text-highlight uppercase ${p.featured ? "" : "hidden lg:block"}`}>
                    Befektetés
                  </p>
                  <p className={`mt-1 font-bold whitespace-nowrap text-highlight ${p.featured ? "type-stat" : "text-lg lg:type-stat"}`}>
                    {p.price}
                  </p>
                </div>
                <Link
                  href={site.ctaHref}
                  className="inline-flex items-center gap-2 text-base font-medium text-paper/85 transition hover:text-paper"
                >
                  Ezt kérem
                  <Icon name="arrow" className="size-4" strokeWidth={2} />
                </Link>
              </div>
            </article>
          ))}

          <div
            data-reveal
            className="col-span-2 flex flex-col gap-3 rounded-2xl bg-paper/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between lg:px-10"
          >
            <p className="text-base text-paper/75">
              <span className="font-bold text-paper">Karbantartás + hosting:</span>{" "}
              15&nbsp;000&nbsp;Ft/hó –{" "}
              <span className="text-highlight">az első 3&nbsp;hónap díjmentes.</span>
            </p>
            <Link
              href={site.ctaHref}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-paper/70 underline decoration-paper/25 underline-offset-[0.2em] hover:text-paper"
            >
              Pontos árajánlatot kérek
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
