"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

// Lenyíló dobozok: animált nyitás/zárás (grid-template-rows 0fr → 1fr), egyszerre csak egy nyitva —
// egy másik megnyitása becsukja az előzőt.
export default function BenefitAccordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="mx-auto mt-14 grid max-w-[1080px] items-start gap-4 md:grid-cols-2 md:gap-5">
      {items.map((b, i) => {
        const on = open === i;
        return (
          <div
            key={b.title}
            className={`rounded-2xl ring-1 ring-ink/5 backdrop-blur transition-colors duration-300 ${
              on ? "bg-raised" : "bg-raised/60 hover:bg-raised/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
              aria-controls={`benefit-${i}`}
              className="flex w-full items-center gap-4 px-6 py-6 text-left"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/80">
                <Icon name={b.icon} className="size-5" />
              </span>
              <span className="flex-1 text-lg font-medium">{b.title}</span>
              <Icon
                name="chevron"
                className={`size-5 shrink-0 text-ink/60 transition-transform duration-300 ${on ? "rotate-180" : ""}`}
              />
            </button>
            <div
              id={`benefit-${i}`}
              className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[56ch] px-6 pb-6 pl-20 text-base text-ink/80">{b.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
