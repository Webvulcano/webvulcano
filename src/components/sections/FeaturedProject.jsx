import Image from "next/image";
import Accent from "@/components/ui/Accent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

// A referencia case-study blokkjának megfelelője. Csak valós tények — kitalált számok nélkül.
const facts = [
  { value: "0 → 1", label: "saját weboldal – előtte nem volt" },
  { value: "Admin", label: "felület: maguk szerkesztik a tartalmat" },
  { value: "Űrlap", label: "az érdeklődők egyből az oldalról írnak" },
];

export default function FeaturedProject() {
  return (
    <section className="bg-night text-paper">
      <div className="container-x pb-24 lg:pb-36">
        <div className="noise overflow-hidden rounded-[28px] bg-gradient-to-br from-feature via-night to-night-2 lg:grid lg:grid-cols-[5fr_7fr]">
          <div data-reveal className="relative min-h-[380px] lg:min-h-full">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-0 h-3/4 rounded-t-[200px] bg-gradient-to-t from-highlight/20 to-transparent"
            />
            <Image
              src="/projects/stillsoulproduction/card-preview.webp"
              alt="A StillSoul Production csapata"
              width={1117}
              height={1285}
              sizes="(min-width: 1024px) 34vw, 90vw"
              className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
            />
          </div>

          <div className="p-8 sm:p-12 lg:p-16">
            <p data-reveal className="text-sm font-medium tracking-eyebrow text-paper/70 uppercase">
              Kiemelt projekt · Média ügynökség
            </p>
            <h2
              data-reveal
              style={{ "--d": "80ms" }}
              className="mt-6 type-h2 font-bold"
            >
              Weboldal nélkül indultak. Most egy oldal <Accent>dolgozik</Accent> nekik.
            </h2>
            <p
              data-reveal
              style={{ "--d": "140ms" }}
              className="mt-6 max-w-[52ch] text-base text-paper/75 md:text-lg"
            >
              A StillSoul Production-nek nem volt weboldala. Készült egy modern, gyors oldal, ami
              bemutatja a szolgáltatásaikat és a referenciáikat – mögötte pedig egy admin felület,
              amin a tulajdonos maga cseréli a szövegeket és a képeket.
            </p>

            <dl className="mt-12 grid gap-8 sm:grid-cols-3">
              {facts.map((f, i) => (
                <div key={f.value} data-reveal style={{ "--d": `${200 + i * 90}ms` }}>
                  <dt className="type-stat font-bold text-highlight">
                    {f.value}
                  </dt>
                  <dd className="mt-3 text-sm text-paper/70">{f.label}</dd>
                </div>
              ))}
            </dl>

            <div data-reveal className="mt-12">
              <Button
                href="https://stillsoulproduction.hu"
                variant="outline"
                target="_blank"
                rel="noopener"
              >
                Megnézem élőben
                <Icon name="arrowUpRight" className="size-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
