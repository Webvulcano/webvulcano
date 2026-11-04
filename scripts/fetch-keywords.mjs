// Lokálisan futtatandó: lekéri egy iparág kulcsszavait a DataForSEO-ból → src/data/kulcsszavak/<iparag>.json
// Használat: node --env-file=.env.local scripts/fetch-keywords.mjs ibf
// Új iparág: seed-kulcsszavak ide, feltételezések a src/data/kulcsszavak/index.js-be.
import { writeFile, mkdir } from "node:fs/promises";

const INDUSTRIES = {
  ibf: {
    name: "Információbiztonsági felelős",
    seeds: [
      "információbiztonsági felelős",
      "ibf szolgáltatás",
      "nis2 megfelelés",
      "kiberbiztonsági tanácsadás",
      "információbiztonsági audit",
    ],
    // Szűk magyar piacon a keywords_for_keywords alig ad ötletet → ezeket külön lekérjük (search_volume).
    candidates: [
      "nis2", "nis2 irányelv", "nis2 tanácsadás", "nis2 tanácsadó", "nis2 audit", "nis2 szolgáltatás",
      "nis2 kötelezett", "nis2 megfelelőség", "nis2 törvény", "kiberbiztonsági törvény", "kiberbiztonsági audit",
      "kiberbiztonsági tanácsadó", "kiberbiztonság cégeknek", "ibf", "ibf feladatai", "külsős ibf",
      "információbiztonsági felelős feladatai", "információbiztonsági felelős szolgáltatás",
      "információbiztonsági felelős képzés", "információbiztonsági tanácsadás", "információbiztonsági szabályzat",
      "információbiztonsági irányítási rendszer", "iso 27001", "iso 27001 tanúsítás", "iso 27001 tanácsadás",
      "informatikai biztonsági szabályzat", "it biztonsági audit", "it biztonsági tanácsadás",
      "elektronikus információs rendszer biztonsága", "biztonsági osztályba sorolás", "sbkh",
      "kiberbiztonsági felelős", "adatvédelmi tisztviselő", "gdpr tanácsadás",
    ],
  },
};

const slug = process.argv[2];
const industry = INDUSTRIES[slug];
if (!industry) {
  console.error(`Ismeretlen iparág: ${slug}. Elérhető: ${Object.keys(INDUSTRIES).join(", ")}`);
  process.exit(1);
}

const { DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD } = process.env;
if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
  console.error("Hiányzó DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD (.env.local)");
  process.exit(1);
}

const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString("base64");

async function query(endpoint, keywords) {
  const res = await fetch(`https://api.dataforseo.com/v3/keywords_data/google_ads/${endpoint}/live`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        keywords,
        location_code: 2348, // Magyarország
        language_code: "hu",
      },
    ]),
  });
  const json = await res.json();
  const task = json.tasks?.[0];
  if (!res.ok || task?.status_code !== 20000) {
    console.error("DataForSEO hiba:", task?.status_message || json.status_message);
    process.exit(1);
  }
  return task;
}

const tasks = [await query("keywords_for_keywords", industry.seeds)];
if (industry.candidates?.length) tasks.push(await query("search_volume", industry.candidates));
const cost = tasks.reduce((sum, t) => sum + t.cost, 0);

// a két végpont átfedhet → kulcsszavanként egy sor
const unique = new Map(tasks.flatMap((t) => t.result || []).map((k) => [k.keyword, k]));

const keywords = [...unique.values()]
  .filter((k) => k.search_volume > 0)
  .map((k) => ({
    keyword: k.keyword,
    volume: k.search_volume,
    cpc: k.cpc ?? null,
    competition: k.competition ?? null,
  }))
  .sort((a, b) => b.volume - a.volume);

await mkdir("src/data/kulcsszavak", { recursive: true });
await writeFile(
  `src/data/kulcsszavak/${slug}.json`,
  JSON.stringify(
    { slug, name: industry.name, fetchedAt: new Date().toISOString().slice(0, 10), keywords },
    null,
    2,
  ),
);

console.log(`${keywords.length} kulcsszó mentve → src/data/kulcsszavak/${slug}.json (költség: $${cost.toFixed(3)})`);
