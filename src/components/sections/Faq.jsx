import Accent from "@/components/ui/Accent";
import Icon from "@/components/ui/Icon";
import { faq } from "@/data/content";

export default function Faq() {
  return (
    <section id="gyik" className="relative z-20 bg-canvas text-ink">
      <div className="container-x grid gap-12 py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-36">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <h2 data-reveal className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Gyakori <Accent>kérdések</Accent>
          </h2>
          <p data-reveal className="mt-6 max-w-[34ch] text-base text-ink/75">
            Nem találod a választ? Írd meg a lenti űrlapon, és 24&nbsp;órán belül válaszolok.
          </p>
        </div>

        <div className="border-t border-ink/10">
          {faq.map((item, i) => (
            <details
              key={item.q}
              name="faq"
              open={i === 0}
              className="group border-b border-ink/10"
            >
              <summary className="flex items-start gap-5 py-7">
                <span className="w-7 shrink-0 pt-1 text-sm font-medium text-ink/75 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-lg font-medium transition-colors group-hover:text-accent-ink lg:text-xl">
                  {item.q}
                </span>
                <Icon
                  name="plus"
                  className="acc-icon mt-0.5 size-6 shrink-0 text-ink/60 transition-transform duration-300"
                />
              </summary>
              <p className="max-w-[62ch] pr-10 pb-8 pl-12 text-base text-ink/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
