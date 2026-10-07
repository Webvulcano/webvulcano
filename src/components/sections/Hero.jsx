import Image from "next/image";
import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import HeroPortrait from "@/components/ui/HeroPortrait";
import { site } from "@/data/site";

const lines = [
  <span key="a" className="xl:whitespace-nowrap">
    A neten, <Accent>megbízhatónak</Accent>
  </span>,
  <>
    és <Accent><span className="whitespace-nowrap">0-24ben</span> elérhetőnek</Accent>
  </>,
  "kell lenned",
];

const features = [
  { icon: "grid", label: "Weboldal" },
  { icon: "search", label: "Google Business profil" },
  { icon: "laurel", label: "Automatikus értékelésszerzés" },
];

const thumbs = [
  "/projects/mik-eloteto/mikeloteto_1.webp",
  "/projects/stillsoulproduction/still_1.webp",
  "/projects/cold-email-sender/email-sender1.webp",
];

// Sticky hero: a külső wrapper 200svh magas, -100svh margóval — a következő
// (sötét) szekció így „rácsúszik” a kitűzött hero-ra (desktopon).
// Mobilon (<lg): cím fent balra, portré középen alul (abszolút), CTA alul középen a portré előtt;
// a feature-pill-ek és az „ingyen vázlat” sor mobilon rejtve.
export default function Hero() {
  return (
    <div id="top" className="relative bg-canvas lg:mb-[-100svh] lg:h-[200svh]">
      <section
        className="hero-glow relative min-h-svh overflow-clip lg:sticky lg:top-0 lg:h-svh lg:min-h-[680px]"
      >
        <div className="container-x grid h-full grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="z-30 flex flex-col pt-28 lg:relative lg:justify-center lg:pt-[72px]">

            <h1 className="type-display font-extrabold text-ink max-lg:text-center">
              {lines.map((line, i) => (
                <span key={i} className="-mr-[0.2em] block overflow-hidden pt-[0.04em] pr-[0.2em] pb-[0.08em]">
                  <span className="rise block" style={{ "--d": `${120 + i * 90}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <ul
              className="rise mt-7 flex flex-wrap gap-x-5 max-lg:hidden gap-y-2 text-sm font-medium text-ink/80"
              style={{ "--d": "650ms" }}
            >
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-raised/70 text-ink/80">
                    <Icon name={f.icon} className="size-3.5" strokeWidth={2} />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>

            <div
              className="rise flex flex-col items-center gap-4 max-lg:absolute max-lg:inset-x-0 max-lg:bottom-8 max-lg:z-30 lg:mt-8 lg:flex-row lg:flex-wrap lg:gap-x-6"
              style={{ "--d": "750ms" }}
            >
              <Button href={site.ctaHref}>
                {site.cta}
                <Icon name="arrow" className="size-4" strokeWidth={2} />
              </Button>

              <div className="flex items-center gap-3 max-lg:hidden">
                <div className="flex -space-x-3">
                  {thumbs.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={80}
                      height={80}
                      sizes="40px"
                      className="size-10 rounded-full border-2 border-canvas object-cover object-left-top"
                    />
                  ))}
                </div>
                <p className="text-sm text-ink/75">
                  <span className="block font-bold text-ink">Ingyen vázlatot kapsz</span>
                  mielőtt bármit fizetnél
                </p>
              </div>
            </div>
          </div>

          <HeroPortrait />
        </div>
      </section>
    </div>
  );
}
