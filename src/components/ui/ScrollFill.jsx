"use client";

import { useEffect, useRef } from "react";

// Görgetésre, soronként balról jobbra „feltöltődő” szöveg (referencia: dixieraizpacheco.com).
// segments: [{ lines: ["…", "…"], fill: "text-paper" }, { lines: [...], fill: "text-decor" }]
// Két réteg soronként: a halvány alap a valódi (felolvasható) szöveg, fölötte egy aria-hidden
// kitöltő réteg clip-path-szal. JS-ből görgetésenként csak a --p (0–1) változik — a számítás CSS
// (globals.css → .fill-line).
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
  const lines = segments.flatMap((s) => s.lines.map((line) => ({ line, fill: s.fill })));

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
      if (tracker) {
        const r = tracker.getBoundingClientRect();
        // a sticky szakasz 85%-áig teljesen kitöltődik, utána kicsit „áll”
        p = -r.top / Math.max(1, (r.height - vh) * 0.85);
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
    <Tag ref={ref} data-fill className={className} style={{ "--n": lines.length }}>
      {lines.map((l, i) => (
        <span key={i} className="relative block w-fit" style={{ "--i": i }}>
          <span className={base}>
            {l.line}{" "}
          </span>
          <span aria-hidden="true" className={`fill-line absolute inset-0 ${l.fill}`}>
            {l.line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
