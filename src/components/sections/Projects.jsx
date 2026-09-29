import Image from "next/image";
import Accent from "@/components/ui/Accent";
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
          <span className="block text-3xl font-bold md:text-4xl lg:text-5xl">Kiemelt</span>
          <Accent className="block text-5xl text-paper/85 md:text-6xl lg:text-7xl">
            projektjeim
          </Accent>
        </h2>
      </div>

      {/* Sticky, egymásra csúszó projektkártyák (desktop) */}
      <div className="container-x mt-12 pb-10">
        {featuredProjects.map((p, i) => (
          <article
            key={p.title}
            className="relative grid items-center gap-8 border-t border-paper/10 bg-night py-10 not-last:lg:mb-[16vh] lg:sticky lg:top-[88px] lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:py-14"
            style={{ zIndex: i + 1 }}
          >
            <a
              href={p.url || "/#kapcsolat"}
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

            <div>
              <p className="text-sm font-medium tracking-label text-paper/60 uppercase">
                {String(i + 1).padStart(2, "0")} · {p.kind}
              </p>
              <h3 className="mt-4 text-2xl font-medium lg:text-3xl">{p.title}</h3>
              <p className="mt-5 max-w-[48ch] text-base text-paper/65">{p.summary}</p>
              <div className="mt-7">
                <Tags tags={p.tags} />
              </div>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-8 inline-flex items-center gap-2 text-base font-medium text-paper underline decoration-paper/30 underline-offset-[0.2em] transition hover:decoration-paper"
                >
                  {p.url.replace("https://", "")}
                  <Icon name="arrowUpRight" className="size-4" strokeWidth={2} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="container-x grid gap-5 pb-24 md:grid-cols-2 lg:pb-36">
        {otherProjects.map((p, i) => (
          <article
            key={p.title}
            data-reveal
            style={{ "--d": `${i * 100}ms` }}
            className="noise flex flex-col rounded-2xl border border-paper/10 bg-night-2 p-8 lg:p-10"
          >
            <p className="text-sm font-medium tracking-label text-paper/60 uppercase">{p.kind}</p>
            <p className="mt-6 text-3xl leading-none font-bold text-highlight lg:text-4xl">
              {p.stat}
            </p>
            <p className="mt-2 text-sm text-paper/65">{p.statLabel}</p>
            <h3 className="mt-8 text-xl font-medium">{p.title}</h3>
            <p className="mt-3 mb-7 text-base text-paper/65">{p.summary}</p>
            <div className="mt-auto">
              <Tags tags={p.tags} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
