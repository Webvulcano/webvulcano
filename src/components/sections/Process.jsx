"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Accent from "@/components/ui/Accent";
import CtaCard from "@/components/ui/CtaCard";
import Icon from "@/components/ui/Icon";
import { stepPath, steps } from "@/data/steps";

const pad = (n) => String(n).padStart(2, "0");

export default function Process() {
  const listRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Egyetlen rAF-fojtott scroll listener: a képernyő közepe hol jár a lépéslistán.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = listRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      setProgress(Math.min(1, Math.max(0, (mid - r.top) / r.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = steps.length;
  const active = Math.min(n - 1, Math.floor(progress * n));

  return (
    <section
      id="folyamat"
      className="relative bg-gradient-to-b from-canvas-2 via-canvas-2 to-canvas text-ink"
    >
      <div className="container-x grid gap-x-14 pt-24 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1.1fr)] lg:pt-32">
        <div className="lg:sticky lg:top-[112px] lg:flex lg:h-[calc(100svh-150px)] lg:flex-col lg:self-start">
          <h2 className="max-w-[20ch] text-2xl font-bold lg:text-3xl">
            Így készül a <Accent>te</Accent> weboldalad –{" "}
            <span className="underline decoration-2 underline-offset-[0.2em]">lépésről lépésre</span>
          </h2>
          <p className="mt-4 max-w-[44ch] text-base text-ink/75">
            A cél, hogy a lehető legkevesebb idődet vegye el. A terhet leveszem rólad.
          </p>
          <p
            key={active}
            aria-hidden="true"
            className="number-in mt-auto hidden font-extralight [font-feature-settings:'zero'_1] lg:block lg:text-10xl xl:text-11xl"
          >
            {pad(active + 1)}.
          </p>
        </div>

        {/* idővonal */}
        <div aria-hidden="true" className="relative hidden bg-ink/10 lg:block">
          <div
            className="absolute top-0 left-0 w-px bg-accent"
            style={{ height: `${progress * 100}%` }}
          />
          <span
            className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent glow-highlight-dot"
            style={{ top: `${progress * 100}%` }}
          />
        </div>

        <ol ref={listRef} className="mt-12 lg:mt-0">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.slug}
                className="flex flex-col justify-center border-t border-ink/10 py-10 lg:min-h-[72svh] lg:border-0 lg:py-0"
              >
                <p className="mb-3 text-sm font-medium tracking-label text-ink/75 lg:hidden">
                  {pad(i + 1)}.
                </p>
                <h3
                  className={`text-3xl font-bold transition-colors duration-500 md:text-4xl lg:text-5xl ${
                    on ? "text-ink" : "lg:text-ink/25"
                  }`}
                >
                  {s.title}
                </h3>
                <div
                  className={`transition-opacity duration-500 ${on ? "opacity-100" : "lg:opacity-30"}`}
                >
                  <p className="mt-5 max-w-[46ch] text-base text-ink/80 md:text-lg">{s.short}</p>
                  <Link
                    href={stepPath(s.slug)}
                    className="mt-6 inline-flex items-center gap-2 text-base font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-[0.2em] transition hover:decoration-accent-ink"
                  >
                    Részletek
                    <Icon name="arrow" className="size-4" strokeWidth={2} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="container-x pt-16 pb-24 lg:pt-8 lg:pb-32">
        <CtaCard />
      </div>
    </section>
  );
}
