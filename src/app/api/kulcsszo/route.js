import { readToken } from "@/lib/keywordResearch";

// Kulcsszó-kalkulátor, 2. lépés: lead a lead-form Airtable táblájába (Status = „Kalkulátor”).
// A teljes kulcsszólista a Painpoint mezőbe kerül, levélbe illeszthető formában —
// a levelet Airtable-automatizáció küldi ki (trigger: Status = „Kalkulátor”).
// A lista csak az /api/kulcsszo/elemzes által aláírt tokenből jöhet.
const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tblZaCWjyWERrOrcu";

const clean = (v, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request) {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return Response.json({ success: false, error: "Server misconfigured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = clean(body?.name);
  const email = clean(body?.email);
  const result = readToken(body?.token);

  if (!name || !email || !result?.keywords?.length || body?.consent !== true) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const list = result.keywords
    .map((k) => `• ${k.keyword} – ${k.volume.toLocaleString("hu-HU")} keresés/hó`)
    .join("\n");
  const fields = {
    Name: name,
    Email: email,
    Status: "Kalkulátor",
    Painpoint: `${result.name} (Google Ads, Magyarország, ${result.fetchedAt})\n\n${list}`,
  };
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields, typecast: true }),
  });

  if (!res.ok) {
    console.error("Airtable error:", await res.text());
    return Response.json({ success: false, error: "Airtable error" }, { status: 502 });
  }

  return Response.json({ success: true });
}
