// Kulcsszó-kalkulátor, élő lekérés: AI-val jelölt kulcsszavak → DataForSEO keresésszám.
// Szerveroldali modul (kulcsok: OPENAI_API_KEY, DATAFORSEO_LOGIN/PASSWORD, KULCSSZO_SECRET).
import { createHmac, timingSafeEqual } from "node:crypto";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const MAX_KEYWORDS = 15;

// Megbízható szám, nem nagy szám: csak szolgáltatót kereső (vásárlói szándékú) kulcsszavak.
const SYSTEM = `Magyar SEO-kutató vagy. A felhasználó megadja a foglalkozását, a fő szolgáltatásait és hogy hol dolgozik.
Írj 30–40 olyan keresőkifejezést, amit egy magyar ügyfél begépel a Google-be, amikor ILYEN SZOLGÁLTATÓT KERES, hogy megbízza vagy időpontot foglaljon.
Szabályok:
- Csak vásárlói szándék: szolgáltatás neve, "+ ár/árak", "+ város/kerület", "+ közelben", "szakember/cég/iroda" stb.
- TILOS: információs keresés (mi az, hogyan, jelentése, törvény, irányelv), állás, fizetés, képzés, tanfolyam, saját kezű megoldás, sablon, letöltés, más szakma.
- Ha Budapest vagy egy város a helyszín, kb. a kifejezések harmada tartalmazza a várost (kerületet csak ha megadta). Ha országos/online, ne írj várost.
- Természetes, kisbetűs, ékezetes keresési formák, max. 6 szó, írásjelek nélkül. Ne ismételj.
A "name" mezőbe a foglalkozás rövid, helyesen írt magyar neve kerüljön (pl. "Gyógytornász").
Ha a bemenet értelmetlen vagy nem szolgáltatás, adj vissza üres keywords listát.`;

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["name", "keywords"],
  properties: {
    name: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
  },
};

async function candidates({ occupation, services, location }) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Foglalkozás: ${occupation}\nSzolgáltatások: ${services.join(", ")}\nHelyszín: ${location}`,
        },
      ],
      text: { format: { type: "json_schema", name: "kulcsszavak", strict: true, schema } },
    }),
  });
  if (!res.ok) throw new Error(`OpenAI: ${await res.text()}`);
  const data = await res.json();
  const text = data.output
    ?.find((o) => o.type === "message")
    ?.content?.find((c) => c.type === "output_text")?.text;
  const { name, keywords } = JSON.parse(text);
  // a DataForSEO elutasítja az írásjeles / túl hosszú kifejezéseket
  const cleaned = keywords
    .map((k) => k.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim())
    .filter((k) => k && k.length <= 80 && k.split(" ").length <= 10);
  return { name, keywords: [...new Set(cleaned)].slice(0, 50) };
}

async function volumes(keywords) {
  const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([{ keywords, location_code: 2348, language_code: "hu" }]), // Magyarország
  });
  const json = await res.json();
  const task = json.tasks?.[0];
  if (!res.ok || task?.status_code !== 20000) {
    throw new Error(`DataForSEO: ${task?.status_message || json.status_message}`);
  }
  return (task.result || [])
    .filter((k) => k.search_volume > 0)
    .map((k) => ({ keyword: k.keyword, volume: k.search_volume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, MAX_KEYWORDS);
}

export async function research(input) {
  const { name, keywords } = await candidates(input);
  if (!keywords.length) return { name, keywords: [] };
  return { name, keywords: await volumes(keywords) };
}

// Az eredményt aláírva adjuk a böngészőnek; az email-kapu csak aláírt listát fogad el,
// így az űrlapon keresztül nem lehet tetszőleges szöveget kiküldetni az Airtable-levéllel.
const sign = (payload) => createHmac("sha256", process.env.KULCSSZO_SECRET).update(payload).digest("base64url");

export function makeToken(result) {
  const payload = Buffer.from(JSON.stringify(result)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readToken(token) {
  if (typeof token !== "string" || !process.env.KULCSSZO_SECRET) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}
