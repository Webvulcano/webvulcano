import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Záró CTA-kártya — főoldal (Folyamat után) és a folyamat-aloldalak alja.
export default function CtaCard() {
  return (
    <div
      data-reveal
      className="noise relative overflow-hidden rounded-[28px] bg-night px-6 py-20 text-center text-paper ring-1 ring-paper/10 sm:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-40 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-accent/30 blur-[120px]"
      />
      <h2 className="relative mx-auto max-w-[20ch] text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
        Nézzük meg, mit tudnék kihozni a <Accent>te</Accent> vállalkozásodból.
      </h2>
      <p className="relative mx-auto mt-6 max-w-[48ch] text-base text-paper/70 md:text-lg">
        A vállalkozásod jó. A weboldalad is ezt mutassa. Kérj egy ingyen vázlatot – utána
        döntesz.
      </p>
      <div className="relative mt-10 flex justify-center">
        <Button href={site.ctaHref} size="lg">
          {site.cta}
          <Icon name="arrow" className="size-5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
