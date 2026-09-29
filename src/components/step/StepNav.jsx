import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { stepPath } from "@/data/steps";
import { site } from "@/data/site";

const label = "text-sm font-medium tracking-label text-paper/60 uppercase";
const link =
  "mt-2 inline-flex items-center gap-2 text-lg font-medium text-paper transition hover:text-paper/75";

// Előző/következő navigáció. Az utolsó lépés után a kapcsolati űrlapra visz.
export default function StepNav({ next }) {
  return (
    <nav
      aria-label="Lépések közti navigáció"
      className="grid gap-8 border-y border-paper/10 py-8 sm:grid-cols-2"
    >
      <div>
        <p className={label}>A folyamat</p>
        <Link href="/#folyamat" className={link}>
          <Icon name="arrow" className="size-4 rotate-180" strokeWidth={2} />
          Összes lépés
        </Link>
      </div>
      <div className="sm:text-right">
        <p className={label}>{next ? "Következő lépés" : "Indulhatunk?"}</p>
        <Link href={next ? stepPath(next.slug) : site.ctaHref} className={link}>
          {next ? next.title : site.cta}
          <Icon name="arrow" className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </nav>
  );
}
