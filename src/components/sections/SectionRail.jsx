"use client";

import Icon from "@/components/ui/Icon";
import { useActiveSection } from "@/lib/useActiveSection";

// top: a lap tetejére visz (nincs szekció-azonosítója, nem lesz „aktív”).
const items = [
  { id: "top", icon: "arrowUp", label: "Vissza a tetejére", top: true },
  { id: "bemutatkozas", icon: "smile", label: "Bemutatkozás" },
  // { id: "garancia", icon: "laurel", label: "Garancia" }, // a szekció kivéve (page.js)
  // { id: "miert-velem", icon: "brain", label: "Miért velem" },
  { id: "munkaim", icon: "rocket", label: "Munkáim" },
  { id: "folyamat", icon: "flask", label: "Folyamat" },
  // { id: "arak", icon: "tag", label: "Árak" },
  // { id: "gyik", icon: "quote", label: "GYIK" },
  { id: "kapcsolat", icon: "send", label: "Kapcsolat" },
];

// Jobb oldali ikon-sín (referencia stílus): szürke üvegkörök, az aktuális szekcióé kék;
// rámutatva kék pirulává nyílik, benne a szekció nevével.
export default function SectionRail() {
  const active = useActiveSection(items.filter((i) => !i.top).map((i) => i.id));

  return (
    <nav
      aria-label="Szekciók"
      className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {items.map((it) => {
        const on = active === it.id;
        return (
          <a
            key={it.id}
            href={it.top ? "#" : `#${it.id}`}
            onClick={
              it.top
                ? (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                : undefined
            }
            aria-label={it.label}
            aria-current={on ? "true" : undefined}
            className={`group relative flex h-10 items-center rounded-full px-2.5 transition-all duration-300 hover:bg-accent hover:pr-4 hover:text-on-accent hover:glow-accent-ring ${
              on
                ? "scale-110 bg-accent text-on-accent glow-accent-ring hover:scale-100"
                : "bg-muted/80 text-paper backdrop-blur-md"
            }`}
          >
            <Icon
              name={it.icon}
              className="size-5 shrink-0"
              strokeWidth={1.5}
            />
            {/* hover: a név kinyílik a pirulában (grid 0fr → 1fr) */}
            <span className="grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity,margin] duration-300 group-hover:ml-2 group-hover:grid-cols-[1fr] group-hover:opacity-100">
              <span className="overflow-hidden text-sm font-medium whitespace-nowrap">
                {it.label}
              </span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
