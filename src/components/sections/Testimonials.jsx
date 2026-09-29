import Image from "next/image";
import Accent from "@/components/ui/Accent";
import { testimonials } from "@/data/testimonials";

// Csak akkor jelenik meg, ha van valós vélemény a data/testimonials.js-ben.
export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-clip bg-canvas py-24 text-ink lg:py-32">
      <p
        aria-hidden="true"
        className="text-outline pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 text-7xl font-extrabold whitespace-nowrap text-ink/10 select-none md:text-9xl lg:text-10xl"
      >
        VÉLEMÉNYEK
      </p>

      <div className="container-x relative">
        <h2 data-reveal className="text-3xl font-bold md:text-4xl lg:text-5xl">
          Mit mondanak az <Accent>ügyfeleim</Accent>
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              data-reveal
              style={{ "--d": `${(i % 2) * 100}ms` }}
              className={`rounded-2xl bg-raised/60 p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)] ring-1 ring-raised/70 backdrop-blur-md lg:p-10 ${
                i % 2 ? "md:translate-y-10" : ""
              }`}
            >
              <blockquote className="text-lg font-medium lg:text-xl">„{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                {t.avatar && (
                  <Image
                    src={t.avatar}
                    alt=""
                    width={80}
                    height={80}
                    className="size-10 rounded-full object-cover"
                  />
                )}
                <span className="text-sm">
                  <span className="block font-bold">{t.name}</span>
                  <span className="text-ink/75">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
