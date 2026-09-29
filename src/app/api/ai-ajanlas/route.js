// „ChatGPT téged ajánl?” — OpenAI Responses API webes kereséssel.
// A kulcs: OPENAI_API_KEY a .env.local-ban (sosem megy a böngészőbe).
import { aiMockDelay, aiMockItems } from "@/data/aiMock";
import { cacheKey, readCache, writeCache } from "@/lib/aiCache";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const DAILY_LIMIT = 5;
const MAX_LEN = 60;

// Egyszerű IP-alapú napi korlát. Memóriában él: szerverless hostingon példányonként
// számol, újraindításkor nullázódik — költségvédelemnek elég, szigorú limitnek nem.
const hits = new Map();

function overLimit(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${day}:${ip}`;
  const n = (hits.get(key) ?? 0) + 1;
  if (hits.size > 5000) hits.clear();
  hits.set(key, n);
  return n > DAILY_LIMIT;
}

const SYSTEM = `Magyar helyi keresési asszisztens vagy. A felhasználó azt kérdezi, kit ajánlasz egy adott városban egy adott szakmából.
Keress a weben, és ajánlj pontosan 3 valós, jelenleg működő vállalkozást abban a városban, úgy, ahogy egy átlagos felhasználónak ajánlanád.
Ha találsz Google-értékelést, add meg (rating: pl. 4.9, reviews: értékelések száma), különben null. Ne találj ki semmit.
A "reason" legyen egy rövid, tárgyilagos mondat arról, miért ajánlod — az értékelést és a számokat NE írd bele (azok külön mezőben vannak).
A "question" mezőbe írd meg a kérdést helyes magyar ragozással: "Kit ajánlasz, ha <szakma> kell <városban>?".
Ha a szakma vagy a város értelmetlen, adj vissza üres items listát.`;

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["question", "items"],
  properties: {
    question: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "reason", "rating", "reviews"],
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
          rating: { type: ["number", "null"] },
          reviews: { type: ["integer", "null"] },
        },
      },
    },
  },
};

const clean = (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, MAX_LEN) : "");

export async function POST(request) {
  // Tesztmód: mentett válasz, nincs OpenAI-hívás és nincs napi korlát.
  if (process.env.AI_MOCK === "1") {
    await new Promise((r) => setTimeout(r, aiMockDelay));
    return Response.json({ success: true, question: null, items: aiMockItems });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Response.json({ success: false, error: "Server misconfigured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const industry = clean(body?.industry);
  const city = clean(body?.city);
  if (!industry || !city) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  // Gyorsítótár: friss mentett válasznál nincs OpenAI-hívás és nem számít a napi korlátba.
  const cKey = cacheKey(industry, city);
  const cached = await readCache(cKey);
  if (cached?.fresh) {
    await writeCache({ key: cKey, industry, city, prev: cached });
    return Response.json({ success: true, question: cached.question, items: cached.items });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (overLimit(ip)) {
    return Response.json({ success: false, error: "Rate limited" }, { status: 429 });
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      tools: [{ type: "web_search" }],
      input: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Szakma: ${industry}\nVáros: ${city}` },
      ],
      text: { format: { type: "json_schema", name: "ajanlas", strict: true, schema } },
    }),
  });

  if (!res.ok) {
    console.error("OpenAI error:", await res.text());
    return Response.json({ success: false, error: "OpenAI error" }, { status: 502 });
  }

  const data = await res.json();
  const text = data.output
    ?.find((o) => o.type === "message")
    ?.content?.find((c) => c.type === "output_text")?.text;

  try {
    const { question, items } = JSON.parse(text);
    const top = items.slice(0, 3);
    await writeCache({ key: cKey, industry, city, prev: cached, answer: { question, items: top } });
    return Response.json({ success: true, question, items: top });
  } catch {
    console.error("OpenAI parse error:", text);
    return Response.json({ success: false, error: "Bad response" }, { status: 502 });
  }
}
