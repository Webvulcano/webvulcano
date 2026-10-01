import Image from "next/image";
// import IntroWall from "./IntroWall"; // félretéve: görgetésre mozgó weboldal-képsorok
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
// import { wallImages } from "@/data/projects";
import { site } from "@/data/site";

// const rows = [wallImages.slice(0, 3), wallImages.slice(3, 6), wallImages.slice(6, 9)];

const services = [
  "Könnyen érthető weboldalt készítek",
  "Rendbe teszem a Google Cégprofilodat",
  "Automatikusan gyűjtöm a Google-értékeléseidet",
  "Egyedi chatbotot építek a weboldaladra",
  "Automatikus emaileket és SMS-eket állítok be",
];

export default function Intro() {
  return (
    <section id="bemutatkozas" className="relative overflow-clip bg-night text-paper">
      <div className="container-x grid items-center gap-16 py-24 lg:grid-cols-2 lg:py-36">
        <div>
          <p className="type-lead text-paper/70">
            Szia, Lehel vagyok 👋
          </p>
          <h2 className="mt-3 type-h2 font-bold">
            Miben tudok segíteni?
          </h2>

          <ul className="mt-8 space-y-3.5">
            {services.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 text-base font-medium text-paper/90 md:text-lg"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-highlight/15 text-highlight">
                  <Icon name="check" className="size-3.5" strokeWidth={2.4} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-6 pl-9 text-base text-paper/50 md:text-lg">
            …és még sok minden, ami informatika
          </p>

          <div className="mt-10">
            <Button href={site.ctaHref}>{site.cta}</Button>
          </div>
        </div>

        {/* <IntroWall rows={rows} /> */}
        <div className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-full border border-paper/10 bg-[radial-gradient(circle_at_50%_35%,var(--highlight),var(--accent)_70%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
        >
          <Image
            src="/images/lehel3.png"
            alt="Bognár Lehel, webfejlesztő"
            width={2000}
            height={2000}
            sizes="(min-width: 1024px) 480px, 90vw"
            className="size-full object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
