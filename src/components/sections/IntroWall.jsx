"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const RANGE = 420; // px, ennyit csúszik egy sor a szekción való végiggörgetés alatt

export default function IntroWall({ rows }) {
  const wrapRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 → a sáv alulról belép, 1 → felül kilép
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const x = i % 2 === 0 ? -p * RANGE : -RANGE + p * RANGE;
        row.style.transform = `translate3d(${x}px,0,0)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative flex flex-col gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      {rows.map((images, i) => (
        <div
          key={i}
          ref={(n) => (rowRefs.current[i] = n)}
          className="flex w-max will-change-transform"
          style={{ transform: `translate3d(${i % 2 === 0 ? 0 : -RANGE}px,0,0)` }}
        >
          {[...images, ...images].map((src, j) => (
            <div key={j} className="w-[240px] shrink-0 pr-4 sm:w-[300px]">
              <div className="overflow-hidden rounded-xl border border-paper/10 bg-night-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
                <Image
                  src={src}
                  alt=""
                  width={600}
                  height={360}
                  sizes="300px"
                  className="aspect-[16/10] w-full object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
