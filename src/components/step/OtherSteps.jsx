import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { stepPath, steps } from "@/data/steps";

const pad = (n) => String(n).padStart(2, "0");

// A referencia „Related process guides” listája helyett: a folyamat többi lépése.
export default function OtherSteps({ current }) {
  return (
    <section id="tobbi-lepes" className="border-t border-paper/10 py-20 lg:py-28">
      <p className="text-sm font-medium tracking-eyebrow text-highlight uppercase">Így dolgozom</p>
      <h2 className="mt-6 type-h2 font-bold">
        <span className="block">A folyamat</span>
        <span className="block">többi lépése.</span>
      </h2>

      <ul className="mt-14 border-t border-paper/10">
        {steps.map((s, i) =>
          s.slug === current ? null : (
            <li key={s.slug} className="border-b border-paper/10">
              <Link
                href={stepPath(s.slug)}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 py-7"
              >
                <span className="text-sm font-medium text-paper/60 tabular-nums">{pad(i + 1)}</span>
                <span>
                  <span className="block type-h3 font-medium">{s.title}</span>
                  <span className="mt-1 block text-base text-paper/65">{s.teaser}</span>
                </span>
                <Icon
                  name="arrow"
                  className="size-5 text-paper/60 transition group-hover:translate-x-1 group-hover:text-paper"
                  strokeWidth={2}
                />
              </Link>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
