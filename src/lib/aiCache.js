// Airtable-gyorsítótár az AI-ajánláshoz: szakma+város párosra 7 napig a mentett
// választ adjuk vissza, és számoljuk, hányan kerestek rá. Hiba esetén csendben
// kiesik (null / no-op), a keresés ilyenkor az OpenAI-jal megy tovább.
const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tblegbmeo29JqjSz9"; // „AI ajánlás cache”
const URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const headers = () => ({
  Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
});

export const cacheKey = (industry, city) =>
  `${industry}|${city}`.toLowerCase().replace(/\s+/g, " ");

// → { id, count, fresh, question, items } vagy null
export async function readCache(key) {
  if (!process.env.AIRTABLE_TOKEN) return null;
  try {
    const formula = `{Kulcs}='${key.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
    const res = await fetch(`${URL}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    const rec = (await res.json()).records?.[0];
    if (!rec) return null;

    const f = rec.fields;
    let items = null;
    try {
      items = JSON.parse(f["Válasz"] ?? "null");
    } catch {}
    const updated = Date.parse(f["Frissítve"] ?? "");
    return {
      id: rec.id,
      count: f["Keresések száma"] ?? 0,
      fresh: Array.isArray(items) && items.length > 0 && Date.now() - updated < MAX_AGE,
      question: f["Kérdés"] || null,
      items,
    };
  } catch (err) {
    console.error("AI cache read error:", err);
    return null;
  }
}

// Keresésszám +1; ha `answer` is jön, a mentett választ is frissíti.
export async function writeCache({ key, industry, city, prev, answer }) {
  if (!process.env.AIRTABLE_TOKEN) return;
  const fields = { "Keresések száma": (prev?.count ?? 0) + 1 };
  if (answer) {
    Object.assign(fields, {
      Szakma: industry,
      Város: city,
      Kérdés: answer.question ?? "",
      Válasz: JSON.stringify(answer.items),
      Frissítve: new Date().toISOString(),
    });
  }
  try {
    const res = prev
      ? await fetch(`${URL}/${prev.id}`, {
          method: "PATCH",
          headers: headers(),
          body: JSON.stringify({ fields }),
        })
      : await fetch(URL, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ fields: { Kulcs: key, Szakma: industry, Város: city, ...fields } }),
        });
    if (!res.ok) throw new Error(await res.text());
  } catch (err) {
    console.error("AI cache write error:", err);
  }
}
