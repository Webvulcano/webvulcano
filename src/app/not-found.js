import Button from "@/components/ui/Button";
import Accent from "@/components/ui/Accent";
import Icon from "@/components/ui/Icon";

// noindex-et a Next magától tesz a 404-re.
export const metadata = { title: "Az oldal nem található" };

export default function NotFound() {
  return (
    <main className="bg-night text-paper">
      <div className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-40 pb-24 lg:pt-48 lg:pb-36">
        <p className="text-sm font-medium tracking-eyebrow text-highlight uppercase">404</p>
        <h1 className="mt-4 max-w-[18ch] type-h1 font-bold">
          Ez az oldal <Accent>nem létezik</Accent>.
        </h1>
        <p className="mt-6 max-w-[48ch] text-base text-paper/70 md:text-lg">
          Lehet, hogy elköltözött, vagy elírás van a címben. A főoldalon mindent megtalálsz.
        </p>
        <div className="mt-10">
          <Button href="/">
            Vissza a főoldalra
            <Icon name="arrow" className="size-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </main>
  );
}
