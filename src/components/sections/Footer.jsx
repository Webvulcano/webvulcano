import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import CopyEmail from "@/components/ui/CopyEmail";
import { navLinks, site } from "@/data/site";

const heading = "text-sm font-medium tracking-label text-paper/60 uppercase";

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-night text-paper">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logo.webp" alt="" width={44} height={44} className="size-11 rounded-full" />
            <span className="text-base leading-none font-bold">
              Web
              <br />
              vulcano
            </span>
          </Link>
          <p className="mt-5 max-w-[36ch] text-sm text-paper/65">
            Weboldalkészítés budapesti vállalkozásoknak, hogy a neten is megtaláljanak, és
            megbízzanak benned.
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

        <div>
          <p className={heading}>Elérhetőség</p>
          <ul className="mt-4 space-y-2.5 text-base text-paper/70">
            <li>
              <CopyEmail icon={false} className="text-base" />
            </li>
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition hover:text-paper">
                  {site.phone}
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-5 flex gap-2.5">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-paper/15 text-paper/70 transition hover:border-highlight hover:text-highlight"
                >
                  <Icon name={s.icon} className="size-5" />
                </a>
              </li>
            ))}
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
