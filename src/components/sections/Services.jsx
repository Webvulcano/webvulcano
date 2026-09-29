import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { services } from "@/data/content";
import { site } from "@/data/site";

export default function Services() {
  return (
    <section className="relative isolate overflow-clip bg-night text-paper">
      {/* halvány kék fény a kártyák mögött */}
      <div
        aria-hidden="true"
        className="absolute top-[30%] left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]"
      />

      <div className="container-x py-24 text-center lg:py-36">
        <p data-reveal className="text-sm font-medium tracking-eyebrow text-paper/60 uppercase">
          Weboldalkészítés budapesti vállalkozásoknak
        </p>

        <h2
          data-reveal
          style={{ "--d": "80ms" }}
          className="text-gradient mx-auto mt-8 max-w-[18ch] text-3xl font-bold md:text-5xl lg:text-6xl"
        >
          Több érdeklődő egy olyan <Accent>weboldallal</Accent>, ami tényleg dolgozik helyetted.
        </h2>

        <div className="mt-20 grid gap-5 text-left md:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.title}
              data-reveal
              style={{ "--d": `${i * 110}ms` }}
              className={`noise group rounded-2xl border bg-gradient-to-b from-night-2 to-night-3 p-8 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-accent/60 hover:glow-accent-soft lg:p-9 ${
                i === 0
                  ? "border-accent/50 glow-accent-soft"
                  : "border-paper/10"
              }`}
            >
              <h3 className="text-2xl font-bold">{s.title}</h3>
              <p className="mt-6 text-base text-paper/65">{s.text}</p>
            </article>
          ))}
        </div>

        <p
          data-reveal
          className="text-gradient mx-auto mt-28 max-w-[26ch] text-2xl font-bold md:text-3xl lg:text-4xl"
        >
          Ha a mostani oldalad nem hoz hívást – vagy nincs is –, egy rád szabott weboldal a legjobb
          befektetés a vállalkozásodba.
        </p>

        <div data-reveal className="mt-12 flex flex-col items-center gap-4">
          <Button href={site.ctaHref} size="lg">
            {site.cta}
            <Icon name="arrow" className="size-5" strokeWidth={2} />
          </Button>
          <p className="text-sm text-paper/60">Ingyen vázlat • Nem kötelez semmire</p>
        </div>
      </div>
    </section>
  );
}
