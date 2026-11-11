import PageSpeedTool from "@/components/ui/PageSpeedTool";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "PageSpeed-teszt – milyen gyors a weboldalad?",
  description:
    "Írd be a weboldalad címét, és 20 másodperc alatt megmutatom, mit lát a Google: sebesség, SEO, akadálymentesség és az 5 legfontosabb javítandó tétel.",
  path: "/pagespeed-teszt",
});

export default function PageSpeedPage() {
  return (
    <main className="bg-night text-paper">
      <div className="container-x max-w-4xl">
        <PageSpeedTool />
      </div>
    </main>
  );
}
