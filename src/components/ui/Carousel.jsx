"use client";

import { Children, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

// Vízszintesen lapozható, teljes képszélességű sor: natív görgetés + snap (trackpad, húzás,
// mobil swipe), mellé ←/→ gombok, amik egy kártyányit lapoznak. A sáv a képernyő széléig ér, de
// az első kártya a container-x-szel egy vonalban kezdődik (bleed-track). A gyerekek maradhatnak
// szerver-komponensek.
// itemClassName: egy elem szélessége (a belógó következő kártya jelzi, hogy van tovább).
export default function Carousel({
  children,
  label,
  itemClassName = "",
  className = "",
}) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const page = (dir) => {
    const el = track.current;
    const item = el?.firstElementChild;
    if (!item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (item.offsetWidth + gap), behavior: "smooth" });
  };

  const button =
    "grid size-11 place-items-center rounded-full border border-paper/15 text-paper transition hover:border-paper/50 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className={className}>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="bleed-track flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className={`flex shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
      <div className="container-x mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={edge.start}
          aria-label="Előző"
          className={button}
        >
          <Icon name="arrow" className="size-5 rotate-180" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={edge.end}
          aria-label="Következő"
          className={button}
        >
          <Icon name="arrow" className="size-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
