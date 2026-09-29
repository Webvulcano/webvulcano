import Image from "next/image";
import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ParallaxGroup from "@/components/ui/ParallaxGroup";
import { site } from "@/data/site";

const lines = [
  <span key="a" className="xl:whitespace-nowrap">
    A neten, <Accent>megbízhatónak</Accent>
  </span>,
  <>
    és <Accent>0-24ben elérhetőnek</Accent>
  </>,
  "kell lenned",
];

const features = [
  { icon: "grid", label: "Weboldal" },
  { icon: "search", label: "Google Business profil" },
  { icon: "laurel", label: "Automatikus értékelésszerzés" },
];

// Parallax-mélységek (--mx/--my: -1…1, ParallaxGroup írja).
const shadowDepth = { transform: "translate3d(calc(var(--mx, 0) * -6px), calc(var(--my, 0) * -4px), 0)" };
const portraitDepth = { transform: "translate3d(calc(var(--mx, 0) * 10px), calc(var(--my, 0) * 6px), 0)" };

const thumbs = [
  "/projects/mik-eloteto/mikeloteto_1.jpg",
  "/projects/stillsoulproduction/still_1.jpg",
  "/projects/cold-email-sender/email-sender1.png",
];

// Sticky hero: a külső wrapper 200svh magas, -100svh margóval — a következő
// (sötét) szekció így „rácsúszik” a kitűzött hero-ra (desktopon).
export default function Hero() {
  return (
    <div id="top" className="relative bg-canvas lg:mb-[-100svh] lg:h-[200svh]">
      <section
        className="hero-glow relative overflow-clip lg:sticky lg:top-0 lg:h-svh lg:min-h-[680px]"
      >
        <div className="container-x grid h-full grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="relative z-30 flex flex-col justify-center pt-32 pb-6 lg:pt-[72px] lg:pb-0">

            <h1 className="text-4xl font-extrabold text-ink sm:text-5xl lg:text-6xl lg:[font-size:min(4.7684rem,5vw)]">
              {lines.map((line, i) => (
                <span key={i} className="-mr-[0.2em] block overflow-hidden pt-[0.04em] pr-[0.2em] pb-[0.08em]">
                  <span className="rise block" style={{ "--d": `${120 + i * 90}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <ul
              className="rise mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink/80"
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
              className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
              style={{ "--d": "750ms" }}
            >
              <Button href={site.ctaHref}>
                {site.cta}
                <Icon name="arrow" className="size-4" strokeWidth={2} />
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {thumbs.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={80}
                      height={80}
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

          {/* Rétegek: z-[5] vetett árnyék → z-10 portré (parallax). */}
          <ParallaxGroup className="relative h-[520px] sm:h-[640px] lg:h-full">
            <div aria-hidden="true" className="absolute inset-0 z-[5]" style={shadowDepth}>
              <Image
                src="/images/hero4.png"
                alt=""
                width={1972}
                height={2900}
                sizes="(min-width: 1024px) 38vw, 80vw"
                className="fade-up absolute bottom-0 left-[46%] h-[90%] w-auto max-w-none -translate-x-1/2 opacity-25 blur-xl brightness-0 lg:left-[54%]"
                style={{ "--d": "400ms" }}
              />
            </div>

            <div className="absolute inset-0 z-10" style={portraitDepth}>
              <Image
                src="/images/hero4.png"
                alt="Bognár Lehel, weboldalfejlesztő"
                width={1972}
                height={2900}
                preload
                sizes="(min-width: 1024px) 38vw, 80vw"
                className="fade-up absolute bottom-0 left-[40%] h-[92%] w-auto max-w-none -translate-x-1/2 lg:left-[48%]"
                style={{ "--d": "250ms" }}
              />
            </div>
          </ParallaxGroup>
        </div>
      </section>
    </div>
  );
}
