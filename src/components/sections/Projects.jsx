import Image from "next/image";
import Link from "next/link";
import Accent from "@/components/ui/Accent";
import Carousel from "@/components/ui/Carousel";
import Icon from "@/components/ui/Icon";
import { featuredProjects, otherProjects } from "@/data/projects";

function Tags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full border border-paper/15 bg-paper/[0.04] px-3.5 py-1.5 text-sm text-paper/75"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Projects() {
  return (
    <section id="munkaim" className="bg-night text-paper">
      <div className="container-x pt-24 lg:pt-36">
        <h2 data-reveal>
          <span className="block type-h2 font-bold">
            Kiemelt
          </span>
          <Accent className="block text-5xl text-paper/85 md:text-6xl lg:text-7xl">
            projektjeim
          </Accent>
        </h2>
      </div>

      {/* Sticky, egymásra csúszó projektkártyák (mobilon és desktopon is). A Nav nem tapad (absolute),
          ezért mobilon a kártya a képernyő tetejére ül (top-0). */}
      <div className="container-x mt-12 pb-10">
        {featuredProjects.map((p, i) => (
          <article
            key={p.title}
            className="sticky top-0 grid items-center gap-6 border-t border-paper/10 bg-night pt-5 pb-8 not-last:mb-[12vh] lg:top-[88px] lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:py-14 not-last:lg:mb-[16vh]"
            style={{ zIndex: i + 1 }}
          >
            <a
              href={p.url || p.demo || "/#kapcsolat"}
              target={p.url ? "_blank" : undefined}
              rel={p.url ? "noopener" : undefined}
              className="group block overflow-hidden rounded-2xl border border-paper/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
            >
              <Image
                src={p.image}
                alt={`${p.title} – képernyőkép`}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </a>

            {/* Mobilon (lg alatt) a link a cím alá kerül (order), hogy jobban látsszon. */}
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium tracking-label text-paper/60 uppercase">
                {String(i + 1).padStart(2, "0")} · {p.kind}
              </p>
              <h3 className="mt-4 type-h3 font-medium">
                {p.title}
              </h3>
              <p className="mt-5 max-w-[48ch] text-base text-paper/65 max-lg:order-2">
                {p.summary}
              </p>
              <div className="mt-7 max-lg:order-3">
                <Tags tags={p.tags} />
              </div>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="nudge-link mt-8 inline-flex items-center gap-2 text-base font-medium text-paper underline max-lg:order-1 max-lg:mt-4 decoration-paper/30 underline-offset-[0.2em] transition hover:decoration-paper"
                >
                  <span className={`nudge-text ${p.flow ? `flow-${p.flow}` : ""}`}>{p.url.replace("https://", "")}</span>
                  <Icon
                    name="arrowUpRight"
                    className="nudge-icon size-4"
                    strokeWidth={2}
                  />
                </a>
              )}
              {p.demo && (
                <Link
                  href={p.demo}
                  className="nudge-link mt-8 inline-flex items-center gap-2 text-base font-medium text-paper underline max-lg:order-1 max-lg:mt-4 decoration-paper/30 underline-offset-[0.2em] transition hover:decoration-paper"
                >
                  <span className={`nudge-text ${p.flow ? `flow-${p.flow}` : ""}`}>Nézd meg élőben hogy működik</span>
                  <Icon
                    name="arrowUpRight"
                    className="nudge-icon size-4"
                    strokeWidth={2}
                  />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Kisebb cím a lapozható sor fölött; a lapozási tipp csak mobilon (md alatt) látszik. */}
      <div data-reveal className="container-x mt-10 mb-6">
        <h3 className="type-h4 font-bold">További munkáim</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-paper/60 md:hidden">
          Húzd oldalra a többi munkámért
          <Icon name="arrow" className="size-4 shrink-0" strokeWidth={2} />
        </p>
      </div>

      <Carousel
        label="További munkák"
        className="pb-24 lg:pb-36"
        itemClassName="w-[86%] md:w-[46%] lg:w-[44%]"
      >
        {otherProjects.map((p) => (
          <article
            key={p.title}
            className="noise flex w-full flex-col rounded-2xl border border-paper/10 bg-night-2 p-8 lg:p-10"
          >
            <p className="text-sm font-medium tracking-label text-paper/60 uppercase">
              {p.kind}
            </p>
            <p className="mt-6 type-stat font-bold text-highlight">
              {p.stat}
            </p>
            <p className="mt-2 text-sm text-paper/65">{p.statLabel}</p>
            <h3 className="mt-8 type-h4 font-medium">{p.title}</h3>
            <p className="mt-3 mb-7 hidden text-base text-paper/65 md:block">{p.summary}</p>
            <p className="mt-3 mb-7 text-base text-paper/65 md:hidden">
              {p.summaryMobile ?? p.summary}
            </p>
            {/* A stack-címkék mobilon (md alatt) nem kellenek a lapozós kártyákon. */}
            <div className="mt-auto hidden md:block">
              <Tags tags={p.tags} />
            </div>
            {p.demo && (
              <Link
                href={p.demo}
                className="nudge-link mt-7 inline-flex items-center gap-2 self-start text-base font-medium text-paper underline decoration-paper/30 underline-offset-[0.2em] transition hover:decoration-paper"
              >
                <span className="nudge-text">Nézd meg élőben hogy működik</span>
                <Icon name="arrowUpRight" className="nudge-icon size-4" strokeWidth={2} />
              </Link>
            )}
          </article>
        ))}
      </Carousel>
    </section>
  );
}
