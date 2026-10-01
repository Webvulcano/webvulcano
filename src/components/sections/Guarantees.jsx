import Laurel from "@/components/ui/Laurel";
import { guarantees } from "@/data/content";

// A referencia „díjak” sávjának megfelelője — díjak helyett valós garanciák.
export default function Guarantees() {
  return (
    <section id="garancia" className="relative bg-night text-paper">
      <div className="container-x border-t border-paper/10 py-20 lg:py-28">
        <p
          data-reveal
          className="mb-14 text-center text-sm font-medium tracking-eyebrow text-paper/60 uppercase"
        >
          Amit minden ügyfelem megkap
        </p>

        <ul className="grid gap-14 md:grid-cols-3 md:gap-8">
          {guarantees.map((g, i) => (
            <li
              key={g.title[0]}
              data-reveal
              style={{ "--d": `${i * 120}ms` }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-3 text-decor">
                <Laurel className="h-20 w-auto" />
                <p className="type-h4 font-medium text-paper">
                  {g.title[0]}
                  <br />
                  <span className="text-paper/80">{g.title[1]}</span>
                </p>
                <Laurel flip className="h-20 w-auto" />
              </div>
              <p className="mt-5 max-w-[28ch] text-base text-paper/65">{g.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
