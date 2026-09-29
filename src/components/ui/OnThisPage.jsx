"use client";

import { useActiveSection } from "@/lib/useActiveSection";

// „Ezen az oldalon” kártya (aloldalak, bal oldalt). Az aktív szekció sora zöld pöttyöt
// és kék színt kap; kattintásra az adott szekcióra ugrik.
export default function OnThisPage({ items }) {
  const active = useActiveSection(items.map((i) => i.id));

  return (
    <nav
      aria-label="Ezen az oldalon"
      className="rounded-2xl bg-canvas/95 p-5 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] ring-1 ring-raised/60 backdrop-blur"
    >
      <p className="text-sm font-medium tracking-label text-ink/75 uppercase">Ezen az oldalon</p>
      <ul className="mt-4 space-y-1">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "true" : undefined}
                className={`relative block py-1.5 pl-4 text-base leading-snug transition-colors ${
                  on ? "text-accent-ink" : "text-ink/75 hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-[0.95em] left-0 size-1.5 -translate-y-1/2 rounded-full bg-highlight transition-opacity ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                />
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
