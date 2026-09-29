import Accent from "@/components/ui/Accent";
import AiDemo from "@/components/ui/AiDemo";

// A kiemelt rész félkövér, hogy a sorok első ránézésre szétváljanak.
const gaps = [
  { pre: "Ha nem átlátható a ", key: "Google Business Profilod", post: "," },
  { pre: "ha a ", key: "weboldalad", post: " nem mondja ki tisztán, pontosan mivel foglalkozol," },
  { pre: "ha nincsenek ", key: "értékeléseid", post: "…" },
];

export default function Problem() {
  return (
    <section
      id="miert"
      className="relative z-10 overflow-clip rounded-t-[28px] bg-night text-paper lg:rounded-t-[36px]"
    >
      <div className="container-x pt-24 pb-8 lg:pt-36 lg:pb-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <h2
            data-reveal
            className="text-gradient text-4xl font-bold md:text-5xl lg:col-span-5 lg:text-6xl"
          >
            Pont ezen múlik <Accent className="text-muted-soft">minden</Accent>
          </h2>

          <ol className="border-t border-paper/10 lg:col-span-7">
            {gaps.map((g, i) => (
              <li
                key={g.key}
                data-reveal
                style={{ "--d": `${80 + i * 70}ms` }}
                className="flex gap-6 border-b border-paper/10 py-6 md:gap-8"
              >
                <span className="pt-1 font-mono text-sm text-highlight">0{i + 1}</span>
                <p className="text-lg text-paper/55 md:text-xl">
                  {g.pre}
                  <strong className="font-semibold text-paper">{g.key}</strong>
                  {g.post}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <p
          data-reveal
          className="mt-16 text-4xl font-bold text-paper md:text-5xl lg:mt-24 lg:text-right lg:text-7xl"
        >
          …akkor igazából <br className="hidden lg:block" />
          <Accent className="text-highlight">nem is létezel.</Accent>
        </p>

        <div
          data-reveal
          className="relative mt-24 overflow-hidden rounded-[28px] border border-paper/10 bg-night-2 p-6 md:p-10 lg:mt-32 lg:p-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -left-40 size-[480px] rounded-full bg-highlight/15 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
            <div>
              <h3 className="mt-6 text-3xl font-bold text-paper md:text-4xl">
                De egyáltalán <Accent className="text-highlight">ajánl téged?</Accent>
              </h3>
              <p className="mt-5 max-w-[42ch] text-base text-paper/60 md:text-lg">
                A ChatGPT pont ezekből veszi az információt, és ez alapján ajánl
                vállalkozókat. Írd be, mivel foglalkozol és hol – megnézzük élőben.
              </p>
            </div>

            <AiDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
