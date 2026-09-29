import { notFound } from "next/navigation";
import OtherSteps from "@/components/step/OtherSteps";
import StepDetails from "@/components/step/StepDetails";
import StepHero from "@/components/step/StepHero";
import StepNav from "@/components/step/StepNav";
import StepOutputs from "@/components/step/StepOutputs";
import CtaCard from "@/components/ui/CtaCard";
import OnThisPage from "@/components/ui/OnThisPage";
import RevealObserver from "@/components/ui/RevealObserver";
import { getStep, slugify, steps } from "@/data/steps";

// Csak az 5 ismert lépés létezik — minden más slug 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return steps.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = getStep(slug);
  if (!found) return {};
  return {
    title: `${found.step.title} – Így dolgozom | Webvulcano`,
    description: found.step.description,
  };
}

export default async function StepPage({ params }) {
  const { slug } = await params;
  const found = getStep(slug);
  if (!found) notFound();

  const { step, index, next } = found;
  const details = step.details.map((d) => ({ ...d, id: slugify(d.titleLines.join(" ")) }));
  const toc = [
    { id: "mit-kapsz", label: "Mit kapsz" },
    ...details.map((d) => ({ id: d.id, label: d.titleLines.join(" ") })),
    { id: "tobbi-lepes", label: "Többi lépés" },
  ];

  return (
    <>
      <main className="bg-night text-paper">
        <div className="container-x xl:grid xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-14">
          <aside className="hidden xl:block">
            <div className="sticky top-[30vh] mt-48">
              <OnThisPage items={toc} />
            </div>
          </aside>

          <div className="min-w-0">
            <StepHero step={step} index={index} total={steps.length} />
            <StepOutputs step={step} />
            <StepDetails details={details} />
            <OtherSteps current={step.slug} />
            <StepNav next={next} />
          </div>
        </div>

        <div className="container-x py-24 lg:py-32">
          <CtaCard />
        </div>
      </main>
      <RevealObserver />
    </>
  );
}
