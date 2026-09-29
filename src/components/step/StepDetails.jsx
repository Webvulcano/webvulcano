import ScrollFill from "@/components/ui/ScrollFill";
import { fillHeading } from "@/components/step/StepOutputs";

// 3 részletező sor: bal oldalt görgetésre feltöltődő cím, jobbra két bekezdés.
export default function StepDetails({ details }) {
  return (
    <>
      {details.map((d) => (
        <article
          key={d.id}
          id={d.id}
          className="grid gap-8 border-t border-paper/10 py-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16 lg:py-24"
        >
          <ScrollFill
            as="h2"
            segments={[{ lines: d.titleLines, fill: "text-paper" }]}
            className={fillHeading}
          />
          <div className="max-w-[56ch] space-y-5 text-base text-paper/70 md:text-lg lg:pt-2">
            {d.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </article>
      ))}
    </>
  );
}
