import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Tölcsér: elérés → weboldal → akció. Minden szint az előző 84%-a (a clip-path 8%-8% saját szélességből vág); a trapéz alja
// pontosan a következő szint tetejével egyezik, így folytonos tölcsért ad (md-től).
const funnel = [
  {
    step: "1",
    title: "Elérés",
    text: "Facebook- vagy Instagram-poszt, TikTok, YouTube-videó, hirdetés, szórólap – bármi, amivel eléred az embereket. Ez hozza a látogatót.",
    tags: ["Facebook", "Instagram", "TikTok", "YouTube", "Szórólap"],
  },
  {
    step: "2",
    title: "Weboldal",
    text: "Itt ismerik meg a szolgáltatásod, itt döntik el, hogy megbíznak-e benned. A látogatóból itt lesz érdeklődő.",
    highlight: true,
  },
  {
    step: "3",
    title: "Akció",
    text: "Időpontfoglalás, hívás, ajánlatkérés vagy vásárlás. A jó oldal ide tereli.",
  },
];

export default function Services() {
  return (
    <section className="relative isolate overflow-clip bg-canvas text-ink">
      {/* halvány kék fény a kártyák mögött */}
      <div
        aria-hidden="true"
        className="absolute top-[30%] left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="container-x py-24 text-center lg:py-36">
        <h2
          data-reveal
          style={{ "--d": "80ms" }}
          className="mx-auto mt-8 max-w-[18ch] text-3xl font-bold md:text-5xl lg:text-6xl"
        >
          A <Accent>Szomorú igazság</Accent>, amit senki sem mond el weboldal készítés előtt.
        </h2>

        <p data-reveal className="mx-auto mt-8 max-w-[52ch] text-base text-ink/70 md:text-lg">
          Egy weboldal nem hoz több látogatót. Arra való, hogy abból, aki már eljutott hozzád,
          érdeklődő – majd ügyfél – legyen. Képzelj el egy tölcsért:
        </p>

        <ol className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-3 md:gap-0">
          {funnel.map((f, i) => (
            <li
              key={f.title}
              data-reveal
              style={{ "--d": `${i * 120}ms`, "--w": `${100 * 0.84 ** i}%` }}
              className={`noise w-full rounded-2xl border px-8 py-8 md:w-[var(--w)] md:rounded-none md:border-0 md:px-[12%] md:[clip-path:polygon(0_0,100%_0,92%_100%,8%_100%)] ${
                f.highlight
                  ? "border-accent/50 bg-gradient-to-b from-accent to-accent-hover text-on-accent"
                  : "border-ink/10 bg-canvas-2 text-ink"
              }`}
            >
              <p
                className={`text-sm font-medium ${f.highlight ? "text-on-accent/80" : "text-accent"}`}
              >
                {f.step}. lépés
              </p>
              <h3 className="mt-1 text-2xl font-bold md:text-3xl">{f.title}</h3>
              <p
                className={`mx-auto mt-3 max-w-[46ch] text-base ${f.highlight ? "text-on-accent/90" : "text-ink/65"}`}
              >
                {f.text}
              </p>
              {f.highlight && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-night/25 px-4 py-1.5 text-sm font-semibold">
                  Ezzel foglalkozom én
                </p>
              )}
              {f.tags && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {f.tags.map((t) => (
                    <span key={t} className="rounded-full bg-ink/6 px-3 py-1 text-xs text-ink/70">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mx-auto mt-28 max-w-[26ch] text-2xl font-bold md:text-3xl lg:text-4xl"
        >
          Ugyanannyi látogatóból több ügyfél. Erre való egy jó weboldal.
        </p>

        <div data-reveal className="mt-12 flex flex-col items-center gap-4">
          <Button href={site.ctaHref} size="lg">
            {site.cta}
            <Icon name="arrow" className="size-5" strokeWidth={2} />
          </Button>
          <p className="text-sm text-ink/60">Ingyen vázlat • Nem kötelez semmire</p>
        </div>
      </div>
    </section>
  );
}
