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
  const colRef = useRef(null);
  const numRef = useRef(null);
  const [active, setActive] = useState(0);

  // Egyetlen rAF-fojtott scroll listener. React state csak lépésváltáskor változik; a szám
  // pozícióját közvetlenül a DOM-ba írjuk (transform), a pötty/vonal pedig tisztán CSS (sticky).
  //
  // Szám pályája: elején az 1. lépés címével egy vonalban jön, amikor az eléri a képernyő
  // közepét, ott marad (a pötty vonalában), a végén a sticky oszlop magassága úgy van
  // beállítva, hogy az utolsó címmel egy sorban engedjen el.
  useEffect(() => {
    let raf = 0;
    let centerT = 0; // a „középen” állapot eltolása (px), layoutból számolva
    let minT = 0; // ennél feljebb nem mehet (ne lógjon rá a leírásra)
    let pinnedY = 0; // a szám középvonala a képernyőn, amikor az oszlop tapad
    const n = steps.length;
    const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

    const layout = () => {
      const ol = listRef.current;
      const col = colRef.current;
      const num = numRef.current;
      if (!ol || !col || !num) return;
      if (!desktop()) {
        col.style.height = "";
        num.style.transform = "";
        return;
      }
      const stickyTop = parseFloat(getComputedStyle(col).top) || 0;
      const h = num.offsetHeight;
      const textBottom = num.previousElementSibling.offsetTop + num.previousElementSibling.offsetHeight;
      // középre: a szám közepe = képernyő közepe, amíg az oszlop tapad; de ne csússzon a szövegre
      minT = textBottom - num.offsetTop; // a számjegyek dobozában van belső felső tér, így 0 rés is elég
      centerT = Math.max(minT, window.innerHeight / 2 - stickyTop - num.offsetTop - h / 2);
      pinnedY = stickyTop + num.offsetTop + centerT + h / 2;

      const title = ol.lastElementChild?.querySelector("h3");
      if (!title) return;
      const numCenter = num.offsetTop + centerT + h / 2;
      const dist = ol.getBoundingClientRect().bottom - title.getBoundingClientRect().top;
      col.style.height = `${Math.max(num.offsetTop + centerT + h, numCenter - title.offsetHeight / 2 + dist)}px`;
    };

    const update = () => {
      raf = 0;
      const ol = listRef.current;
      const num = numRef.current;
      if (!ol || !num) return;
      const r = ol.getBoundingClientRect();
      const p = (window.innerHeight / 2 - r.top) / r.height;
      setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n))));

      if (!desktop()) return;
      const first = ol.firstElementChild?.querySelector("h3");
      if (!first) return;
      const cur = new DOMMatrixReadOnly(getComputedStyle(num).transform).m42 || 0;
      const nr = num.getBoundingClientRect();
      const naturalCenter = nr.top - cur + nr.height / 2;
      const fr = first.getBoundingClientRect();
      // amíg az 1. cím a tapadó pozíció alatt jár, azt követi; utána a tapadó (középső) helyen
      // áll; az oszlop elengedése után vele együtt megy tovább.
      const target = Math.max(fr.top + fr.height / 2, Math.min(pinnedY, naturalCenter + centerT));
      num.style.transform = `translate3d(0,${Math.max(minT, target - naturalCenter)}px,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      layout();
      onScroll();
    };

    onResize();
    document.fonts?.ready.then(onResize);
    const ro = new ResizeObserver(onResize);
    if (numRef.current) ro.observe(numRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="folyamat"
      className="relative bg-gradient-to-b from-canvas-2 via-canvas-2 to-canvas text-ink"
    >
      <div className="container-x grid gap-x-14 pt-24 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1.1fr)] lg:pt-32">
        <div ref={colRef} className="lg:sticky lg:top-[112px] lg:flex lg:flex-col lg:self-start">
          <h2 className="max-w-[20ch] type-h2 font-bold">
            Így készül a <Accent>Te</Accent> weboldalad –{" "}
            <span className="underline decoration-2 underline-offset-[0.2em]">lépésről lépésre</span>
          </h2>
          <p className="mt-4 max-w-[44ch] text-base text-ink/75">
            A cél, hogy a lehető legkevesebb idődet vegye el. A terhet leveszem rólad.
          </p>
          <div ref={numRef} className="mt-10 hidden will-change-transform lg:block">
            <p
              key={active}
              aria-hidden="true"
              className="number-in leading-none font-extralight [font-feature-settings:'zero'_1] lg:text-10xl xl:text-11xl"
            >
              {pad(active + 1)}.
            </p>
          </div>
        </div>

        {/* idővonal: a pötty sticky a képernyő közepén, a kék vonal belőle nyúlik felfelé és az
            overflow-y-clip vágja a tetejét — natív görgetés, nincs JS-késés/rángás.
            py-3 + bg-clip-content: a pötty a szürke vonal végén áll meg, a halo nem lóg a clip-élre */}
        <div aria-hidden="true" className="relative hidden overflow-x-visible overflow-y-clip bg-ink/10 bg-clip-content py-3 lg:block">
          <div className="sticky top-[50svh] h-0">
            <div className="absolute bottom-0 left-0 h-[200svh] w-px bg-accent" />
            <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent glow-highlight-dot" />
          </div>
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
                  className={`type-h2 font-bold transition-colors duration-500 ${
                    on ? "text-ink" : "lg:text-ink/25"
                  }`}
                >
                  {s.title}
                </h3>
                <div
                  className={`transition-opacity duration-500 ${on ? "opacity-100" : "lg:opacity-30"}`}
                >
                  <p className="mt-5 max-w-[46ch] text-base text-ink/80 md:text-lg">{s.short}</p>
                  {/* ideiglenesen kivéve:
                  <Link
                    href={stepPath(s.slug)}
                    className="mt-6 inline-flex items-center gap-2 text-base font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-[0.2em] transition hover:decoration-accent-ink"
                  >
                    Részletek
                    <Icon name="arrow" className="size-4" strokeWidth={2} />
                  </Link>
                  */}
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
