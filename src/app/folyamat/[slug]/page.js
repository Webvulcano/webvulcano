import { notFound } from "next/navigation";
import OtherSteps from "@/components/step/OtherSteps";
import StepDetails from "@/components/step/StepDetails";
import StepHero from "@/components/step/StepHero";
import StepNav from "@/components/step/StepNav";
import StepOutputs from "@/components/step/StepOutputs";
import CtaCard from "@/components/ui/CtaCard";
import RevealObserver from "@/components/ui/RevealObserver";
import JsonLd from "@/components/ui/JsonLd";
import { getStep, slugify, stepPath, steps } from "@/data/steps";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

// Csak az 5 ismert lépés létezik — minden más slug 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return steps.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = getStep(slug);
  if (!found) return {};
  return pageMeta({
    title: `${found.step.title} – Így dolgozom`,
    description: found.step.description,
    path: stepPath(slug),
  });
}

export default async function StepPage({ params }) {
  const { slug } = await params;
  const found = getStep(slug);
  if (!found) notFound();

  const { step, index, next } = found;
  const details = step.details.map((d) => ({ ...d, id: slugify(d.titleLines.join(" ")) }));

  const breadcrumb = breadcrumbSchema([
    { name: "Folyamat", path: "/#folyamat" },
    { name: step.title, path: stepPath(step.slug) },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="bg-night text-paper">
        <div className="container-x">
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
