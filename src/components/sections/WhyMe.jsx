import Accent from "@/components/ui/Accent";
import Icon from "@/components/ui/Icon";
import { benefits } from "@/data/content";

export default function WhyMe() {
  return (
    <section id="miert-velem" className="bg-night">
      <div className="container-x pb-8 text-center text-paper">
        <h2
          data-reveal
          className="mx-auto max-w-[20ch] text-2xl font-light md:text-3xl lg:text-4xl"
        >
          Weboldalkészítés Budapesten:{" "}
          <Accent className="text-muted-soft">helyi vállalkozásoknak</Accent>
        </h2>
      </div>

      <div className="px-3 pt-16 pb-3">
        <div className="rounded-[24px] bg-canvas py-20 text-ink lg:py-28">
          <div className="container-x">
            <p
              data-reveal
              className="text-center text-sm font-medium tracking-eyebrow text-ink/75 uppercase"
            >
              Miért velem
            </p>
            <h3
              data-reveal
              style={{ "--d": "80ms" }}
              className="mx-auto mt-6 max-w-[18ch] text-center text-3xl font-bold md:text-4xl lg:text-5xl"
            >
              Mit kapsz, ha <Accent>velem</Accent> dolgozol?
            </h3>
            <p
              data-reveal
              style={{ "--d": "140ms" }}
              className="mx-auto mt-6 max-w-[52ch] text-center text-base text-ink/80 md:text-lg"
            >
              Egy ember viszi a szöveget, a designt, a kódot és az élesítést – az elejétől a végéig.
            </p>

            <div className="mx-auto mt-14 grid max-w-[1080px] items-start gap-4 md:grid-cols-2 md:gap-5">
              {benefits.map((b, i) => (
                <details
                  key={b.title}
                  data-reveal
                  style={{ "--d": `${(i % 2) * 80}ms` }}
                  className="group rounded-2xl bg-raised/60 ring-1 ring-ink/5 backdrop-blur transition-colors hover:bg-raised/80 open:bg-raised"
                >
                  <summary className="flex items-center gap-4 px-6 py-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/80">
                      <Icon name={b.icon} className="size-5" />
                    </span>
                    <span className="flex-1 text-lg font-medium">{b.title}</span>
                    <Icon
                      name="chevron"
                      className="acc-chevron size-5 shrink-0 text-ink/60 transition-transform duration-300"
                    />
                  </summary>
                  <p className="max-w-[56ch] px-6 pb-6 pl-20 text-base text-ink/80">{b.text}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
