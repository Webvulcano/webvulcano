import Link from "next/link";
import DemoFullscreen from "@/components/demo/DemoFullscreen";
import Accent from "@/components/ui/Accent";
import CtaCard from "@/components/ui/CtaCard";
import RevealObserver from "@/components/ui/RevealObserver";
import { benefits } from "@/data/emailDemo";

export const metadata = {
  title: "Hideg email automatizáló – Próbáld ki | Webvulcano",
  description:
    "Egy mondat Claude-nak, és lefut a napi ügyfélszerzés: cégek keresése, személyre szabott emailek, emlékeztetők, érdeklődők jelzése. Próbáld ki a szimulációt.",
};

const facts = [
  { value: "1 perc", label: "napi 2–3 óra keresés és emailezés helyett" },
  { value: "9 lépés", label: "egyetlen parancsra, magától" },
  { value: "0", label: "elfelejtett emlékeztető vagy érdeklődő" },
];

export default function EmailDemoPage() {
  return (
    <>
      <main className="bg-night text-paper">
        <div className="container-x">
          <header className="pt-40 pb-16 lg:pt-48 lg:pb-24">
            <nav aria-label="Morzsamenü" className="rise">
              <ol className="flex flex-wrap items-center gap-2 text-sm font-medium tracking-label uppercase">
                <li>
                  <Link
                    href="/#munkaim"
                    className="text-paper transition hover:text-paper/75"
                  >
                    Munkáim
                  </Link>
                </li>
                <li aria-hidden="true" className="text-paper/40">
                  /
                </li>
                <li aria-current="page" className="text-paper/60">
                  Hideg email automatizáló
                </li>
              </ol>
            </nav>

            <p
              className="rise mt-10 text-sm font-medium tracking-eyebrow text-highlight uppercase"
              style={{ "--d": "80ms" }}
            >
              AI automatizáció · saját eszköz
            </p>
            <h1
              className="rise mt-4 max-w-[18ch] type-h1 font-bold"
              style={{ "--d": "140ms" }}
            >
              Egy mondat, és a napi ügyfélszerzés <Accent>kész</Accent>.
            </h1>
            <p
              className="rise mt-6 max-w-[58ch] text-base text-paper/70 md:text-lg"
              style={{ "--d": "220ms" }}
            >
              Beírom Claude-nak, hogy „send daily emails” — és a gép megkeresi a
              cégeket, megírja és elküldi a személyre szabott emaileket, követi,
              ki válaszolt, és szól, ha valaki érdeklődik. Próbáld ki lent,
              lépésről lépésre.
            </p>

            <dl className="mt-14 grid gap-8 sm:grid-cols-3">
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className="rise"
                  style={{ "--d": `${300 + i * 90}ms` }}
                >
                  <dt className="type-stat font-bold text-highlight">
                    {f.value}
                  </dt>
                  <dd className="mt-3 text-sm text-paper/70">{f.label}</dd>
                </div>
              ))}
            </dl>
          </header>

          <section
            aria-labelledby="demo-cim"
            className="border-t border-paper/10 py-16 lg:py-24"
          >
            <h2
              id="demo-cim"
              data-reveal
              className="mb-10 type-h2 font-bold lg:mb-14"
            >
              Próbáld <Accent>ki</Accent>
            </h2>
            <DemoFullscreen demo="email" title="Hideg email automatizáló" />
          </section>

          <section
            aria-labelledby="mit-jelent"
            className="border-t border-paper/10 py-16 lg:py-24"
          >
            <h2
              id="mit-jelent"
              data-reveal
              className="type-h3 font-bold"
            >
              Mit jelent ez egy <Accent>vállalkozásnak</Accent>?
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {benefits.map((b, i) => (
                <article
                  key={b.title}
                  data-reveal
                  style={{ "--d": `${i * 100}ms` }}
                  className="noise flex flex-col rounded-2xl border border-paper/10 bg-night-2 p-8"
                >
                  <p className="type-stat font-bold text-highlight">
                    {b.stat}
                  </p>
                  <h3 className="mt-3 text-lg font-medium">{b.title}</h3>
                  <p className="mt-3 text-base text-paper/65">{b.text}</p>
                </article>
              ))}
            </div>
            <p
              data-reveal
              className="mt-10 max-w-[60ch] text-base text-paper/70 md:text-lg"
            >
              Ilyen automatizálást a te vállalkozásodnak is össze tudok rakni —
              ajánlatkérésre, időpontfoglalásra vagy bármilyen ismétlődő
              feladatra.
            </p>
          </section>
        </div>

        <div className="container-x pb-24 lg:pb-32">
          <CtaCard />
        </div>
      </main>
      <RevealObserver />
    </>
  );
}
