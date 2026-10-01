import { Fragment } from "react";
import Accent from "@/components/ui/Accent";
import AiDemo from "@/components/ui/AiDemo";
import PixelFade from "@/components/ui/PixelFade";
import PixelHalo from "@/components/ui/PixelHalo";
import ScrollStory from "@/components/ui/ScrollStory";

// A kiemelt rész félkövér, hogy a sorok első ránézésre szétváljanak.
const gaps = [
  { pre: "Ha nem átlátható a ", key: "Google Business Profilod", post: "," },
  {
    pre: "ha a ",
    key: "weboldalad",
    post: " nem mondja ki tisztán, pontosan mivel foglalkozol,",
  },
  { pre: "ha nincsenek ", key: "értékeléseid", post: "…" },
];

// Desktopon kitűzött, görgetés-vezérelt jelenet (ScrollStory), szünet nélkül: az elemek
// átfedve jönnek, a kitűzés teljes hosszán mindig mozog valami. Küszöbök: 1 = a cím (címkártya)
// a helyére úszik + 1. tétel · 2–3 = további tételek · 4 = a lista alatt a csattanó (a többi marad).
// Képernyőben a kitűzés kezdetétől; a szekció (1 + storyLength)·100svh magas.
// --wait (tételre, öröklődik) + --lag / --dur: elemenként a küszöbhöz képesti késés / időtartam, szintén képernyőben.
const storySteps = [0, 0.45, 0.9, 1.35];
const storyLength = 1.95;
const punch = ["nem", "is", "létezel."];

function Gap({ g, className }) {
  return (
    <p
      data-story-rise
      style={{ "--lag": 0.05 }}
      className={`text-paper/55 ${className}`}
    >
      {g.pre}
      <strong
        data-story-mark
        style={{ "--lag": 0.2, "--dur": 0.25 }}
        className="font-semibold text-paper"
      >
        {g.key}
      </strong>
      {g.post}
    </p>
  );
}

// Elválasztó: statikusan sima vonal, a desktop-jelenetben balról jobbra kirajzolódik.
function Line({ className }) {
  return (
    <span
      data-story-line
      aria-hidden="true"
      className={`absolute inset-x-0 h-px bg-paper/10 ${className}`}
    />
  );
}

export default function Problem() {
  return (
    <>
      <ScrollStory
        id="miert"
        steps={storySteps}
        length={storyLength}
        className="relative z-10 overflow-clip rounded-t-[28px] bg-night text-paper lg:rounded-t-[36px]"
      >
        <div className="container-x pt-24 lg:pt-36">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div data-reveal data-story-fog className="lg:col-span-5">
              <h2
                data-story-card
                className="text-gradient type-statement font-bold"
              >
                Pont ezen múlik{" "}
                <Accent className="text-muted-soft">minden</Accent>
              </h2>
            </div>

            <ol className="lg:col-span-7">
              {gaps.map((g, i) => (
                <li
                  key={g.key}
                  data-reveal
                  data-story-in
                  // az 1. tétel megvárja, míg a cím a helyére úszik
                  style={{
                    "--d": `${80 + i * 70}ms`,
                    "--k": i + 1,
                    "--wait": i === 0 ? 0.2 : 0,
                  }}
                  className="relative flex gap-6 py-6 md:gap-8"
                >
                  {i === 0 && <Line className="top-0" />}
                  <Line className="bottom-0" />
                  <span
                    data-story-rise

                    className="pt-1 font-mono text-sm text-highlight"
                  >
                    0{i + 1}
                  </span>
                  <Gap g={g} className="type-h4" />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* csattanó: mobilon saját, képernyőnyi blokk, hogy ne olvadjon bele a listába;
            desktopon a lista alá, a jobb oszlopba kerül — folytatja a „ha…, ha…, ha…” mondatot,
            a cím és a lista fölötte marad */}
        <div
          data-story-in
          style={{ "--k": 4 }}
          className="container-x flex min-h-[70svh] items-center justify-center py-24 lg:mt-14 lg:grid lg:min-h-[85svh] lg:grid-cols-12 lg:gap-16"
        >
          <div className="relative lg:col-span-7 lg:col-start-6">
            <div
              data-story-glow
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight/10 opacity-0 blur-3xl"
            />
            <p
              data-reveal
              className="relative text-center type-statement font-bold text-paper lg:text-left"
            >
              {/* maszk: a sor alulról csúszik be; a padding/negatív margó a mellékjeleknek és a
                  „g” szárának ad helyet, a sorköz nem változik */}
              <span className="-mt-[0.08em] -mb-[0.16em] block overflow-hidden pt-[0.08em] pb-[0.16em]">
                <span
                  data-story-rise
                  style={{ "--y": "120%", "--blur": "0px" }}
                  className="block"
                >
                  …akkor igazából
                </span>
              </span>
              <Accent className="block text-highlight">
                {punch.map((w, i) => (
                  <Fragment key={w}>
                    {i > 0 && " "}
                    <span
                      data-story-rise
                      style={{
                        "--lag": 0.12 + i * 0.07,
                        "--y": "0.2em",
                        "--blur": "14px",
                      }}
                      className="inline-block"
                    >
                      {w}
                    </span>
                  </Fragment>
                ))}
              </Accent>
            </p>
          </div>
        </div>
      </ScrollStory>

      {/* AI-teszt: külön világos sáv, a sötét demó-panel így kiugrik */}
      <section className="relative overflow-clip bg-canvas text-ink">
        <PixelFade />
        <PixelFade flip />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 size-[560px] rounded-full bg-accent/10 blur-3xl"
        />
        {/* a kurzor-halo a csíkok közti világos felületen is (a tartalom mögött) */}
        <PixelHalo />
        <div className="container-x relative grid items-center gap-10 py-36 lg:grid-cols-[1fr_1.25fr] lg:gap-14 lg:py-44">
          <div>
            <h3 className="type-h2 font-bold text-ink">
              De egyáltalán{" "}
              <Accent className="text-accent-ink">ajánl téged az AI?</Accent>
            </h3>
            <p className="mt-5 max-w-[42ch] text-base text-ink/70 md:text-lg">
              A ChatGPT pont ezekből veszi az információt, és ez alapján ajánl
              vállalkozókat. Írd be, mivel foglalkozol és hol – megnézzük
              élőben.
            </p>
          </div>

          <div>
            <AiDemo />
          </div>
        </div>
      </section>
    </>
  );
}
