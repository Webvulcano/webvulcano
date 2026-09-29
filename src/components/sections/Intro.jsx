import Image from "next/image";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { problemPoints } from "@/data/content";
import { wallImages } from "@/data/projects";
import { site } from "@/data/site";

const columns = [
  { images: wallImages.slice(0, 3), dir: "marquee-up", dur: "46s" },
  { images: wallImages.slice(3, 6), dir: "marquee-down", dur: "54s" },
  { images: wallImages.slice(6, 9), dir: "marquee-up", dur: "50s" },
];

function WallColumn({ images, dir, dur, className = "" }) {
  // A lista duplikálva van, hogy a -50%-os eltolás varrat nélkül ismétlődjön.
  return (
    <div className={`flex flex-col gap-4 ${dir} ${className}`} style={{ "--dur": dur }}>
      {[...images, ...images].map((src, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-paper/10 bg-night-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          <Image
            src={src}
            alt=""
            width={600}
            height={360}
            sizes="(min-width: 1024px) 16vw, 40vw"
            className="aspect-[16/10] w-full object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}

export default function Intro() {
  return (
    <section id="bemutatkozas" className="relative overflow-clip bg-night text-paper">
      <div className="container-x grid items-center gap-16 py-24 lg:grid-cols-2 lg:py-36">
        <div>
          <p data-reveal className="max-w-[52ch] text-base text-paper/70 md:text-lg">
            Bognár Lehel vagyok, weboldalfejlesztő. Olyan oldalt építek, ami:
          </p>

          <ul className="mt-6 space-y-3.5">
            {problemPoints.map((p, i) => (
              <li
                key={p}
                data-reveal
                style={{ "--d": `${100 + i * 70}ms` }}
                className="flex items-center gap-3 text-base font-medium text-paper/90 md:text-lg"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-highlight/15 text-highlight">
                  <Icon name="check" className="size-3.5" strokeWidth={2.4} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <p data-reveal className="mt-8 max-w-[52ch] text-base text-paper/70 md:text-lg">
            Egy sablonos, összekattintott oldal többe kerül, mint gondolnád: elvesztett bizalom,
            elvesztett hívások. Egy rád szabott weboldal éjjel-nappal dolgozik helyetted – és
            számokkal mutatja, mit hozott.
          </p>

          <div data-reveal className="mt-10">
            <Button href={site.ctaHref}>{site.cta}</Button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative h-[520px] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] lg:h-[760px]"
        >
          <div className="absolute inset-[-10%] grid rotate-[-8deg] grid-cols-2 gap-4 sm:grid-cols-3">
            {columns.map((c, i) => (
              <WallColumn key={i} {...c} className={i === 2 ? "hidden sm:flex" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
