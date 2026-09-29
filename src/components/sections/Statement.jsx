import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ScrollFill from "@/components/ui/ScrollFill";
import { site } from "@/data/site";

// Görgetésre feltöltődő statement (referencia: „Awards don't close deals…”).
// Desktopon a szekció 200svh magas, a szöveg középre tűzve; a kitöltés a szekción való
// áthaladással halad. Mobilon normál folyás, a kitöltés a saját blokkhoz mér.
const segments = [
  {
    lines: ["Weboldalt ma már", "Te is össze tudnál", "kattintani."],
    fill: "text-paper",
  },
  {
    lines: [
      "De méred is hogy",
      "hányan, és mire kattintanak?",
    ],
    fill: "text-highlight",
  },
];

export default function Statement() {
  return (
    <section data-fill-track className="relative bg-night text-paper lg:h-[200svh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
        <div className="container-x py-24 lg:py-0 lg:pt-[72px]">
          <ScrollFill
            as="h2"
            track
            segments={segments}
            className="text-3xl font-bold sm:text-4xl md:text-5xl [@media(min-width:1280px)_and_(min-height:820px)]:text-6xl"
          />
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <p className="text-base text-paper/70 md:text-lg">
              Nálam látni fogod, hogy a látogatók mire kattintanak az oldaladon.
            </p>
            <Button href={site.ctaHref}>
              {site.cta}
              <Icon name="arrow" className="size-4" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
