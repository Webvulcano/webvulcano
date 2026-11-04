import ibf from "./ibf.json";

// Kulcsszó-kalkulátor: előre kiszámolt iparágak. Ha a látogató foglalkozása illik egy `aliases`
// elemre, ezt kapja (azonnal, ingyen); minden másra élő lekérés megy (src/lib/keywordResearch.js).
// A keresésszámokat a scripts/fetch-keywords.mjs tölti le (JSON).
//
// Csak szolgáltatót kereső (vásárlói szándékú) kulcsszavak számítanak: megbízható szám, nem nagy szám.
// Kimarad: információs keresés (pl. „nis2”, „nis2 irányelv”), rokon, de más szolgáltatás (DPO, ISO-tanúsítás),
// képzés, sablonkeresés, többértelmű rövidítés („ibf”).
const pick = (data, keep) => ({
  slug: data.slug,
  name: data.name,
  fetchedAt: data.fetchedAt,
  keywords: data.keywords.filter((k) => keep.includes(k.keyword)).map(({ keyword, volume }) => ({ keyword, volume })),
});

export const industries = [
  {
    ...pick(ibf, [
      "nis2 audit",
      "információbiztonsági felelős",
      "kiberbiztonsági audit",
      "nis2 megfelelés",
      "ibf szolgáltatás",
      "nis2 tanácsadás",
      "információbiztonsági tanácsadás",
    ]),
    aliases: ["információbiztonság", "ibf", "nis2", "kiberbiztonság"],
    clientValue: 1200000, // egy új ügyfél első éves értéke (óvatos), Ft
  },
];

const norm = (s) => s.toLowerCase().normalize("NFC").replace(/\s+/g, " ").trim();

export function findIndustry(occupation) {
  const o = norm(occupation);
  return industries.find((i) => i.aliases.some((a) => o.includes(a))) ?? null;
}
