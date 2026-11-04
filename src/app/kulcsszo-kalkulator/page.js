import KeywordCalculator from "@/components/ui/KeywordCalculator";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Kulcsszó-kalkulátor – hányan keresnek rád a Google-ön?",
  description:
    "Nézd meg, hányan keresik a szolgáltatásodat havonta a Google-ön, és mennyi új ügyfelet hozhatna, ha a Google első oldalán lennél.",
  path: "/kulcsszo-kalkulator",
});

export default function KeywordCalculatorPage() {
  return (
    <main className="bg-night text-paper">
      <div className="container-x max-w-4xl">
        <KeywordCalculator />
      </div>
    </main>
  );
}
