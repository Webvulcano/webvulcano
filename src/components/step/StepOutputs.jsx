
// „Mit kapsz ebből a lépésből” — referencia: „What this stage produces”.
// A feltöltődő címek skála-lépcsője a hasábszélességhez igazítva (egy sor = egy kitöltési sor).
export const fillHeading = "type-h2 font-bold";

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
        <h2 className={`mt-6 ${fillHeading}`}>
          {step.outputsTitle.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
      </div>

      <ul className="border-t border-paper/10 lg:mt-12">
        {step.outputs.map((o, i) => (
          <li
            key={o}
            data-reveal
            style={{ "--d": `${i * 80}ms` }}
            className="border-b border-paper/10 py-6 type-h4 text-paper/90"
          >
            {o}
          </li>
        ))}
      </ul>
    </section>
  );
}
