import { steps, stepPath } from "@/data/steps";

const baseUrl = "https://www.webvulcano.hu";

export default function sitemap() {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["ertekeles", "hideg-email", "ticketing"].map((slug) => ({
      url: `${baseUrl}/munkaim/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...steps.map((s) => ({
      url: `${baseUrl}${stepPath(s.slug)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    { url: `${baseUrl}/adatkezeles`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
