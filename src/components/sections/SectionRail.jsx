"use client";

import Icon from "@/components/ui/Icon";
import { useActiveSection } from "@/lib/useActiveSection";

const items = [
  { id: "garancia", icon: "laurel", label: "Garancia" },
  { id: "miert-velem", icon: "brain", label: "Miért velem" },
  { id: "munkaim", icon: "rocket", label: "Munkáim" },
  { id: "folyamat", icon: "flask", label: "Folyamat" },
  { id: "arak", icon: "tag", label: "Árak" },
  { id: "gyik", icon: "quote", label: "GYIK" },
];

// Jobb oldali ikon-sín (referencia stílus): szürke üvegkörök, az aktuális szekcióé kék.
export default function SectionRail() {
  const active = useActiveSection(items.map((i) => i.id));

  return (
    <nav
      aria-label="Szekciók"
      className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {items.map((it) => {
        const on = active === it.id;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            aria-label={it.label}
            aria-current={on ? "true" : undefined}
            className={`group relative grid size-10 place-items-center rounded-full transition-all duration-300 ${
              on
                ? "scale-110 bg-accent text-on-accent glow-accent-ring"
                : "bg-muted/80 text-paper backdrop-blur-md hover:bg-muted"
            }`}
          >
            <Icon name={it.icon} className="size-5" strokeWidth={1.5} />
            <span className="pointer-events-none absolute right-13 rounded-md bg-night px-2 py-1 text-sm whitespace-nowrap text-paper opacity-0 transition-opacity group-hover:opacity-100">
              {it.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
