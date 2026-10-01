import Accent from "@/components/ui/Accent";
import BenefitAccordion from "@/components/ui/BenefitAccordion";
import { benefits } from "@/data/content";

export default function WhyMe() {
  return (
    <section id="miert-velem" className="bg-canvas">
      {/* Kivéve: „Weboldalkészítés Budapesten: helyi vállalkozásoknak” sáv
      <div className="container-x pb-8 text-center text-paper">
              <h2
                data-reveal
                className="mx-auto max-w-[20ch] type-h3 font-light"
              >
                Weboldalkészítés Budapesten:
                <Accent className="text-muted-soft">helyi vállalkozásoknak</Accent>
              </h2>
            </div>
      
      */}
      <div className="px-3 pb-3">
        <div className="rounded-[24px] bg-canvas py-20 text-ink lg:py-28">
          <div className="container-x">
            <h3 className="mx-auto mt-6 max-w-[18ch] text-center type-h2 font-bold"
            >
              Mit kapsz, ha <Accent>velem</Accent> dolgozol?
            </h3>
            <p className="mx-auto mt-6 max-w-[52ch] text-center text-base text-ink/80 md:text-lg"
            >
              Egy ember viszi a szöveget, a designt, a kódot és az élesítést – az elejétől a végéig.
            </p>

            <BenefitAccordion items={benefits} />
          </div>
        </div>
      </div>
    </section>
  );
}
