import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { navLinks, site } from "@/data/site";

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-ink/5 bg-canvas/80 backdrop-blur-md">
      <nav className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Webvulcano – kezdőlap">
          <Image
            src="/brand/logo.webp"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full"
            preload
          />
          {/* Mobilon (md alatt): „WebVulcano – weboldal & automatizáció” egy sorban; desktopon a régi kétsoros logo-felirat */}
          <span className="flex items-baseline gap-1.5 whitespace-nowrap md:hidden">
            <span className="text-base font-bold">WebVulcano</span>
            <span className="text-sm text-ink/60 max-[359px]:text-xs">– weboldal &amp; automatizáció</span>
          </span>
          <span className="hidden text-sm leading-none font-bold md:inline">
            Web
            <br />
            vulcano
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-8">
          <ul className="hidden items-center gap-8 text-base font-medium md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {site.phone && (
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hidden text-base font-medium lg:block"
            >
              {site.phone}
            </a>
          )}

          {/* mobilon (md alatt) nincs CTA a navban — a hero és a szekciók gombjai viszik a kapcsolatra */}
          <div className="hidden md:block">
            <Button href={site.ctaHref} size="sm" className="sm:px-5">
              <span className="sm:hidden">{site.ctaShort}</span>
              <span className="hidden sm:inline">{site.cta}</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
