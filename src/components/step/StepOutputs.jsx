import ScrollFill from "@/components/ui/ScrollFill";

// „Mit kapsz ebből a lépésből” — referencia: „What this stage produces”.
// A feltöltődő címek skála-lépcsője a hasábszélességhez igazítva (egy sor = egy kitöltési sor).
export const fillHeading = "text-2xl font-bold sm:text-3xl md:text-4xl";

export default function StepOutputs({ step }) {
  return (
    <section
      id="mit-kapsz"
      className="grid gap-12 border-t border-paper/10 py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16 lg:py-28"
    >
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="text-sm font-medium tracking-eyebrow text-highlight uppercase">
          Mit kapsz ebből a lépésből
        </p>
        <ScrollFill
          as="h2"
          segments={[{ lines: step.outputsTitle, fill: "text-paper" }]}
          className={`mt-6 ${fillHeading}`}
        />
      </div>

      <ul className="border-t border-paper/10 lg:mt-12">
        {step.outputs.map((o, i) => (
          <li
            key={o}
            data-reveal
            style={{ "--d": `${i * 80}ms` }}
            className="border-b border-paper/10 py-6 text-lg text-paper/90 lg:text-xl"
          >
            {o}
          </li>
        ))}
      </ul>
    </section>
  );
}
