import { site } from "@/data/site";
import { steps, stepPath } from "@/data/steps";

// Fix dátum: írd át, ha az adott oldal tartalma érdemben változik. (A `new Date()` minden
// buildnél „friss”-nek jelölne mindent → a Google figyelmen kívül hagyja a lastModified-ot.)
const updated = {
  home: "2026-10-07",
  demos: "2026-10-07",
  steps: "2026-10-07",
  privacy: "2026-10-01",
};

export default function sitemap() {
  return [
    { url: site.url, lastModified: updated.home, changeFrequency: "weekly", priority: 1 },
    ...["ertekeles", "hideg-email", "ticketing"].map((slug) => ({
      url: `${site.url}/munkaim/${slug}`,
      lastModified: updated.demos,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...steps.map((s) => ({
      url: `${site.url}${stepPath(s.slug)}`,
      lastModified: updated.steps,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    { url: `${site.url}/adatkezeles`, lastModified: updated.privacy, changeFrequency: "yearly", priority: 0.2 },
  ];
}
