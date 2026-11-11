// PageSpeed-teszt: Google PageSpeed Insights v5 → pontszámok + javítandó tételek.
// Szerveroldali modul (kulcsok: PAGESPEED_API_KEY, KULCSSZO_SECRET a token titkosításához).
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { auditText } from "@/data/pagespeedAudits";
import { guides } from "@/data/pagespeedGuides";

const API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = [
  { key: "performance", param: "PERFORMANCE", label: "Teljesítmény" },
  { key: "accessibility", param: "ACCESSIBILITY", label: "Akadálymentesség" },
  { key: "best-practices", param: "BEST_PRACTICES", label: "Ajánlott gyakorlatok" },
  { key: "seo", param: "SEO", label: "SEO" },
];
const VITALS = [
  { id: "largest-contentful-paint", label: "Fő tartalom betölt (LCP)" },
  { id: "cumulative-layout-shift", label: "Elmozdulás (CLS)" },
  { id: "total-blocking-time", label: "Blokkolás (TBT)" },
];
export const TOP_ISSUES = 5;

// Csak publikus, normál portú, domain nevű http(s) cím mehet tovább (a lekérést a Google
// végzi, de IP-címet / belső nevet így sem engedünk).
export function normalizeUrl(input) {
  if (typeof input !== "string") return null;
  let raw = input.trim().slice(0, 300);
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let u;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password || u.port) return null;
  const host = u.hostname.toLowerCase();
  if (!host.includes(".") || host.length > 253 || host.includes(":") || /^[\d.]+$/.test(host)) return null;
  if (/\.(local|localhost|internal|lan|home)$/.test(host)) return null;
  u.hash = "";
  return u.toString();
}

const fail = (code) => Object.assign(new Error(code), { code });

// A Google-leírás végén „[Tudj meg többet](link).” áll: a link kiesik, a maradék írásjel is.
const cleanText = (s = "") => {
  const t = s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/^[.,;:\s]+$/, "")
    .trim();
  if (t.length <= 240) return t;
  // hosszú leírásnál az utolsó teljes mondatig vágunk, nem szó közepén
  const cut = t.slice(0, 240);
  const end = cut.lastIndexOf(". ");
  return end > 80 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`;
};

const MAX_ITEMS = 10; // a tokenben ennyi tétel utazik: az első 5 részletes, a többi csak felsorolás

// Egy tételből a megjeleníthető szöveg. A token csak az azonosítót, a becsült nyereséget (ms) és az
// ismeretlen audit nyers szövegét hordozza, a többit innen építjük újra (így a token kicsi marad).
export function buildIssue({ id, ms = 0, t, w }) {
  const known = auditText[id];
  const [title, why, fix] = known ?? [t ?? id, w ?? "", null];
  return {
    id,
    title,
    why,
    fix,
    steps: guides[id]?.steps ?? [],
    dev: guides[id]?.dev ?? null,
    savings: ms >= 100 ? `~${(ms / 1000).toLocaleString("hu-HU", { maximumFractionDigits: 1 })} mp gyorsulás` : null,
  };
}

function issuesFrom(lr) {
  const found = [];
  for (const { key } of CATEGORIES) {
    for (const ref of lr.categories?.[key]?.auditRefs ?? []) {
      if (ref.group === "metrics") continue;
      const a = lr.audits?.[ref.id];
      if (!a || a.score == null || a.score >= 0.9) continue;
      const ms = Math.round(a.details?.overallSavingsMs ?? 0);
      const known = Boolean(auditText[ref.id]);
      found.push({
        // a saját magyar szöveggel bíró tételek előre kerülnek, a Google nyers szövege csak kitöltés
        known,
        priority: Math.max(ms / 100, (ref.weight || 0) * (1 - a.score), 0.5),
        id: ref.id,
        ms,
        ...(known ? {} : { t: a.title.slice(0, 90), w: cleanText(a.description) }),
      });
    }
  }
  found.sort((x, y) => Number(y.known) - Number(x.known) || y.priority - x.priority);
  return {
    total: found.length,
    items: found.slice(0, MAX_ITEMS).map(({ known, priority, ...rest }) => rest),
  };
}

// → { scores, vitals, items, total } vagy Error{code: "unreachable" | "busy" | "failed"}
export async function runPagespeed(url) {
  const params = new URLSearchParams({ url, strategy: "mobile", locale: "hu" });
  for (const c of CATEGORIES) params.append("category", c.param);
  if (process.env.PAGESPEED_API_KEY) params.set("key", process.env.PAGESPEED_API_KEY);

  let res;
  try {
    res = await fetch(`${API}?${params}`, { signal: AbortSignal.timeout(55000), cache: "no-store" });
  } catch {
    throw fail("failed");
  }
  if (res.status === 429) throw fail("busy");
  if (!res.ok) {
    // a Google 400/500-zal jelzi, ha a cím nem elérhető / nem betölthető
    throw fail(res.status === 400 || res.status === 500 ? "unreachable" : "failed");
  }
  const lr = (await res.json()).lighthouseResult;
  if (!lr || lr.runtimeError) throw fail("unreachable");

  const scores = CATEGORIES.map((c) => {
    const s = lr.categories?.[c.key]?.score;
    return s == null ? null : { key: c.key, label: c.label, value: Math.round(s * 100) };
  }).filter(Boolean);
  if (!scores.length) throw fail("unreachable");

  const vitals = VITALS.map((v) => {
    const a = lr.audits?.[v.id];
    return a
      ? { id: v.id, label: v.label, value: a.displayValue ?? "–", score: a.score ?? 0, ms: Math.round(a.numericValue ?? 0) }
      : null;
  }).filter(Boolean);

  const { total, items } = issuesFrom(lr);
  return { scores, vitals, items, total };
}

// A javítandó tételek titkosított tokenben utaznak: a böngésző csak a név+email beküldése után
// kapja meg a nyers listát, a hálózati fülön addig nem olvasható.
const key = () => createHash("sha256").update(process.env.KULCSSZO_SECRET).digest();

export function sealToken(data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString("base64url");
}

export function openToken(token) {
  if (typeof token !== "string" || !process.env.KULCSSZO_SECRET) return null;
  try {
    const buf = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), buf.subarray(0, 12));
    decipher.setAuthTag(buf.subarray(12, 28));
    return JSON.parse(Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString());
  } catch {
    return null;
  }
}
