import Image from "next/image";
import Link from "next/link";
import { steps, stepPath } from "@/data/steps";
import { navLinks, site } from "@/data/site";

const heading = "text-sm font-medium tracking-label text-paper/60 uppercase";

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-night text-paper">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={44} height={44} className="size-11 rounded-full" />
            <span className="text-base leading-none font-bold">
              Web
              <br />
              vulcano
            </span>
          </Link>
          <p className="mt-5 max-w-[36ch] text-sm text-paper/65">
            Weboldalkészítés budapesti vállalkozásoknak – számokkal alátámasztva hozom az
            érdeklődőidet.
          </p>
        </div>

        <nav aria-label="Lábléc">
          <p className={heading}>Oldal</p>
          <ul className="mt-4 space-y-2.5 text-base text-paper/70">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={site.ctaHref} className="transition hover:text-paper">
                Kapcsolat
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="A folyamat lépései">
          <p className={heading}>Így dolgozom</p>
          <ul className="mt-4 space-y-2.5 text-base text-paper/70">
            {steps.map((s) => (
              <li key={s.slug}>
                <Link href={stepPath(s.slug)} className="transition hover:text-paper">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>Elérhetőség</p>
          <ul className="mt-4 space-y-2.5 text-base text-paper/70">
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-paper">
                {site.email}
              </a>
            </li>
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition hover:text-paper">
                  {site.phone}
                </a>
              </li>
            )}
            <li>{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-paper/10 py-6 text-sm text-paper/60 sm:flex-row sm:justify-between">
        <p>© 2026 webvulcano · {site.owner}</p>
        <a href={site.privacyUrl} target="_blank" rel="noopener" className="hover:text-paper">
          Adatkezelési tájékoztató
        </a>
      </div>
    </footer>
  );
}
