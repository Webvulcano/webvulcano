"use client";

import { useState } from "react";
import Accent from "@/components/ui/Accent";
import Icon from "@/components/ui/Icon";
import { faq } from "@/data/content";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="gyik" className="relative z-20 bg-canvas text-ink">
      <div className="container-x grid gap-12 py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-36">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <h2 data-reveal className="type-h2 font-bold">
            Gyakori <Accent>kérdések</Accent>
          </h2>
          <p data-reveal className="mt-6 max-w-[34ch] text-base text-ink/75">
            Nem találod a választ? Írd meg a lenti űrlapon, és 24&nbsp;órán belül válaszolok.
          </p>
        </div>

        <div className="border-t border-ink/10">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="group border-b border-ink/10">
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-start gap-5 py-7 text-left"
                >
                  <span className="w-7 shrink-0 pt-1 text-sm font-medium text-ink/75 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 type-h4 font-medium transition-colors group-hover:text-accent-ink">
                    {item.q}
                  </span>
                  <Icon
                    name="plus"
                    className={`mt-0.5 size-6 shrink-0 text-ink/60 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                {/* 0fr → 1fr: tartalom-magasságra animál, böngészőfüggetlenül */}
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-[62ch] pr-10 pb-8 pl-12 text-base text-ink/80">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
