"use client";

import { useEffect, useState } from "react";

// Melyik szekción jár éppen a viewport közepe? (null, ha egyiken sem — pl. hero fölött.)
// rAF-fojtott scroll listener: pontosabb, mint az IntersectionObserver sávja,
// mert a szekciók közti résben és visszagörgetéskor is helyes eredményt ad.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key.split(",");
    let raf = 0;

    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let current = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = id;
      }
      setActive(current);
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
  }, [key]);

  return active;
}
