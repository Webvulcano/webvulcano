"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Egyetlen observer az egész oldalra: minden [data-reveal] elem kap egy
// .is-visible osztályt, amikor a viewportba ér. Késleltetés: style={{ "--d": "120ms" }}.
// A pathname a függőség: kliens-navigáció után (aloldalról aloldalra) az új elemeket is figyeli.
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.is-visible)");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
