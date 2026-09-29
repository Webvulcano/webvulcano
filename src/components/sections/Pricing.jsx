import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { pricing } from "@/data/content";
import { site } from "@/data/site";

const headline = ["Profi", "vállalkozásnak", "profi", "weboldal", "jár."];

export default function Pricing() {
  return (
    <section id="arak" className="relative overflow-clip bg-night text-paper">
      <div className="container-x grid gap-14 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-36">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <p data-reveal className="text-sm font-medium tracking-eyebrow text-paper/60 uppercase">
            Csomagok és árak
          </p>
          <h2 className="mt-6 text-3xl font-bold md:text-5xl lg:text-4xl xl:text-5xl">
            {headline.map((w, i) => (
              <span key={i} data-reveal style={{ "--d": `${i * 70}ms` }} className="block">
                {w}
              </span>
            ))}
          </h2>
          <p data-reveal className="mt-8 max-w-[30ch] text-lg text-muted-soft lg:text-xl">
            Egy összecsapott oldal azt üzeni: nem veszed komolyan a saját munkád.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {pricing.map((p, i) => (
            <article
              key={p.name}
              data-reveal
              style={{ "--d": `${i * 100}ms` }}
              className={`noise rounded-2xl border bg-gradient-to-b from-night-2 to-night-3 p-8 lg:p-10 ${
                p.featured
                  ? "border-highlight/50 glow-highlight"
                  : "border-paper/10"
              }`}
            >
              <p className="text-sm font-medium tracking-label text-highlight uppercase">{p.label}</p>
              <h3 className="mt-3 text-2xl font-medium">{p.name}</h3>
              <p className="mt-4 max-w-[52ch] text-base text-paper/75">{p.text}</p>
              <p className="mt-2 text-sm text-paper/60">{p.forWhom}</p>

              <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium tracking-label text-highlight uppercase">
                    Befektetés
                  </p>
                  <p className="mt-1 text-3xl leading-none font-bold text-highlight lg:text-4xl">
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
            className="flex flex-col gap-3 rounded-2xl border border-dashed border-paper/15 p-6 sm:flex-row sm:items-center sm:justify-between lg:px-10"
          >
            <p className="text-base text-paper/75">
              <span className="font-bold text-paper">Karbantartás + hosting:</span>{" "}
              10&nbsp;000&nbsp;Ft/hó –{" "}
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
