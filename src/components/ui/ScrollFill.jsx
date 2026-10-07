"use client";

import { useEffect, useRef } from "react";

// Görgetésre, soronként balról jobbra „feltöltődő” szöveg (referencia: dixieraizpacheco.com).
// segments: [{ lines: ["…", "…"], fill: "text-paper" }, { lines: [...], fill: "text-decor" }]
// Két réteg soronként: a halvány alap a valódi (felolvasható) szöveg, fölötte egy aria-hidden
// kitöltő réteg. A kitöltés szavanként halad (globális szó-index --i, összes szó --n), így ha egy
// sor mobilon tördelődik, a vizuális sorok is sorban egymás után töltődnek.
// JS-ből görgetésenként csak a --p (0–1) változik — a számítás CSS (globals.css → .fill-line).
//
// track=false: a progress a saját blokkon mér (alja a viewport 85%-ánál indul, 35%-ánál kész).
// track=true: a legközelebbi [data-fill-track] ősön való áthaladás (sticky szekcióhoz).
export default function ScrollFill({
  as: Tag = "h2",
  segments,
  className = "",
  base = "text-paper/12",
  track = false,
  start = 0.85,
  end = 0.35,
}) {
  const ref = useRef(null);
  let wordCount = 0;
  const lines = segments.flatMap((s) =>
    s.lines.map((line) => ({
      line,
      fill: s.fill,
      words: line.split(" ").map((w) => ({ w, i: wordCount++ })),
    }))
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    const tracker = track ? el.closest("[data-fill-track]") : null;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let p;
      const tr = tracker?.getBoundingClientRect();
      // Csak akkor követjük a tracker-t, ha tényleg sticky-hosszú (lg: 200svh); mobilon a
      // szekció nem magasabb a viewportnál → saját blokkhoz mérünk (különben 0→1 ugrás).
      if (tr && tr.height > vh * 1.2) {
        // a sticky szakasz 85%-áig teljesen kitöltődik, utána kicsit „áll”
        p = -tr.top / ((tr.height - vh) * 0.85);
      } else {
        const r = el.getBoundingClientRect();
        p = (vh * start - r.top) / (vh * (start - end) + r.height);
      }
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
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
  }, [track, start, end]);

  return (
    <Tag ref={ref} data-fill className={className} style={{ "--n": wordCount }}>
      {lines.map((l, i) => (
        <span key={i} className="relative block w-fit">
          {/* Az alap és a kitöltő réteg ugyanabból a szó-struktúrából épül → azonosan tördel. */}
          <span className={base}>
            {l.words.map(({ w, i: wi }, k) => (
              <span key={wi}>
                {k > 0 && " "}
                <span className="inline-block">{w}</span>
              </span>
            ))}{" "}
          </span>
          <span aria-hidden="true" className={`absolute inset-0 ${l.fill}`}>
            {l.words.map(({ w, i: wi }, k) => (
              <span key={wi}>
                {k > 0 && " "}
                <span className="fill-line inline-block" style={{ "--i": wi }}>
                  {w}
                </span>
              </span>
            ))}
          </span>
        </span>
      ))}
    </Tag>
  );
}
