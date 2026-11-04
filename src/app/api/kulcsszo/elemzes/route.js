// Kulcsszó-kalkulátor, 1. lépés: foglalkozás + szolgáltatások + helyszín → kulcsszavak keresésszámmal.
// Ismert iparágnál az előre kiszámolt lista megy (ingyen); különben élő lekérés (AI + DataForSEO, ~$0,1).
// Kapcsoló: az élő lekérés csak KULCSSZO_LIVE=1 mellett fut; enélkül ismeretlen iparágra
// `unavailable` választ ad (a felület kapcsolatfelvételre irányít).
import { findIndustry } from "@/data/kulcsszavak";
import { makeToken, research } from "@/lib/keywordResearch";

const DAILY_LIMIT = 3;
const LOCATIONS = ["Budapest", "Más város", "Országosan / online"];

// Egyszerű IP-alapú napi korlát + eredmény-gyorsítótár. Memóriában élnek: szerverless hostingon
// példányonként számolnak — költségvédelemnek elég, szigorú limitnek nem (lásd ai-ajanlas).
const hits = new Map();
const cache = new Map();

function overLimit(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${day}:${ip}`;
  const n = (hits.get(key) ?? 0) + 1;
  if (hits.size > 5000) hits.clear();
  hits.set(key, n);
  return n > DAILY_LIMIT;
}

const clean = (v, max = 60) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

export async function POST(request) {
  const { OPENAI_API_KEY, DATAFORSEO_LOGIN, KULCSSZO_SECRET, KULCSSZO_LIVE } = process.env;
  const live = KULCSSZO_LIVE === "1";
  if (!KULCSSZO_SECRET || (live && (!OPENAI_API_KEY || !DATAFORSEO_LOGIN))) {
    return Response.json({ success: false, error: "Server misconfigured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const occupation = clean(body?.occupation);
  const services = (Array.isArray(body?.services) ? body.services : []).map((s) => clean(s)).filter(Boolean).slice(0, 5);
  const place = LOCATIONS.includes(body?.location) ? body.location : "";
  const city = clean(body?.city, 40);
  const location = place === "Országosan / online" ? place : [place, city].filter(Boolean).join(", ");
  if (!occupation || !services.length || !place) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const known = findIndustry(occupation);
  if (known) {
    const result = { name: known.name, fetchedAt: known.fetchedAt, keywords: known.keywords };
    return Response.json({ success: true, result, clientValue: known.clientValue, token: makeToken(result) });
  }
  if (!live) {
    return Response.json({ success: true, unavailable: true });
  }

  const key = [occupation, ...services, location].join("|").toLowerCase();
  let result = cache.get(key);
  if (!result) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    if (overLimit(ip)) {
      return Response.json({ success: false, error: "Rate limited" }, { status: 429 });
    }
    try {
      const { name, keywords } = await research({ occupation, services, location });
      result = { name, fetchedAt: new Date().toISOString().slice(0, 10), keywords };
    } catch (err) {
      console.error("Keyword research error:", err.message);
      return Response.json({ success: false, error: "Research error" }, { status: 502 });
    }
    if (cache.size > 500) cache.clear();
    cache.set(key, result);
  }

  return Response.json({ success: true, result, clientValue: null, token: makeToken(result) });
}
