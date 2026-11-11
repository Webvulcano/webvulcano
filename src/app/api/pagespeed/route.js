import { normalizeUrl, runPagespeed, sealToken } from "@/lib/pagespeed";

// PageSpeed-teszt, 1. lépés: cím → pontszámok (nyíltan) + titkosított token a javítandó tételekkel.
// A Google lekérése 10–30 mp, ezért a hosszabb időkeret.
export const maxDuration = 60;

const DAILY_LIMIT = 5;

// IP-alapú napi korlát + 24 órás eredmény-gyorsítótár. Memóriában élnek: szerverless hostingon
// példányonként számolnak — költségvédelemnek elég, szigorú limitnek nem (lásd kulcsszo/elemzes).
const hits = new Map();
const cache = new Map();
const TTL = 24 * 60 * 60 * 1000;

function overLimit(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${day}:${ip}`;
  const n = (hits.get(key) ?? 0) + 1;
  if (hits.size > 5000) hits.clear();
  hits.set(key, n);
  return n > DAILY_LIMIT;
}

export async function POST(request) {
  if (!process.env.KULCSSZO_SECRET) {
    return Response.json({ success: false, error: "Server misconfigured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const url = normalizeUrl(body?.url);
  if (!url) {
    return Response.json({ success: false, error: "Invalid URL" }, { status: 400 });
  }

  let data = cache.get(url);
  if (!data || Date.now() - data.at > TTL) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    if (overLimit(ip)) {
      return Response.json({ success: false, error: "Rate limited" }, { status: 429 });
    }
    try {
      const { scores, vitals, items, total } = await runPagespeed(url);
      data = { at: Date.now(), scores, vitals, total, token: sealToken({ url, scores, vitals, items, total }) };
    } catch (err) {
      console.error("PageSpeed error:", err.message);
      const status = err.code === "unreachable" ? 422 : err.code === "busy" ? 503 : 502;
      return Response.json({ success: false, error: err.code ?? "failed" }, { status });
    }
    if (cache.size > 200) cache.clear();
    cache.set(url, data);
  }

  const { at, ...result } = data;
  return Response.json({ success: true, url, ...result });
}
