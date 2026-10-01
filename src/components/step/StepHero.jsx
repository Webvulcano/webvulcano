import Link from "next/link";

const pad = (n) => String(n).padStart(2, "0");

export default function StepHero({ step, index, total }) {
  return (
    <header className="pt-40 pb-20 lg:pt-48 lg:pb-28">
      <nav aria-label="Morzsamenü" className="rise">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-medium tracking-label uppercase">
          <li>
            <Link href="/#folyamat" className="text-paper transition hover:text-paper/75">
              Folyamat
            </Link>
          </li>
          <li aria-hidden="true" className="text-paper/40">
            /
          </li>
          <li aria-current="page" className="text-paper/60">
            {step.title}
          </li>
        </ol>
      </nav>

      <p
        className="rise mt-10 text-sm font-medium tracking-eyebrow text-highlight uppercase"
        style={{ "--d": "80ms" }}
      >
        Lépés {pad(index + 1)}&nbsp;/&nbsp;{pad(total)}
      </p>
      <h1
        className="rise mt-4 max-w-[16ch] type-h1 font-bold"
        style={{ "--d": "140ms" }}
      >
        {step.title}
      </h1>
      <p
        className="rise mt-6 max-w-[56ch] text-base text-paper/70 md:text-lg"
        style={{ "--d": "220ms" }}
      >
        {step.lead}
      </p>
    </header>
  );
}
