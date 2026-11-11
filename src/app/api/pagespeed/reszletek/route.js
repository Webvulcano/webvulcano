import { TOP_ISSUES, buildIssue, openToken } from "@/lib/pagespeed";

// PageSpeed-teszt, 2. lépés: név + email (+ hozzájárulás) → lead a „PageSpeed Érdeklődés” Airtable
// táblába (az útmutató-levelet Airtable-automatizáció küldi), és a javítandó tételek feloldása. A tételek csak a /api/pagespeed által titkosított tokenből jöhetnek.
const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tbliZAAFMFoutTMRi"; // „PageSpeed Érdeklődés”

const clean = (v, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const airtable = process.env.AIRTABLE_TOKEN;
  if (!airtable) {
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
  const data = openToken(body?.token);

  if (!name || !EMAIL.test(email) || !data?.items || body?.consent !== true) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const scores = data.scores.map((s) => `${s.label}: ${s.value}`).join(", ");
  const issues = data.items.slice(0, TOP_ISSUES).map(buildIssue);
  // A levélbe kerülő útmutató-PDF-et ez a link állítja elő a mérés eredményéből (nem tárolunk fájlt).
  const pdfUrl = `${new URL(request.url).origin}/api/pagespeed/pdf?t=${encodeURIComponent(body.token)}`;
  const fields = {
    Name: name,
    Email: email,
    Website: data.url,
    Status: "PageSpeed",
    Painpoint: `PageSpeed-teszt (mobil)\n${scores}\n\n${issues.map((i) => `• ${i.title}`).join("\n")}`,
    Goal: `Összefoglaló PDF: ${pdfUrl}`,
  };
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${airtable}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields, typecast: true }),
  });

  if (!res.ok) {
    console.error("Airtable error:", await res.text());
    return Response.json({ success: false, error: "Airtable error" }, { status: 502 });
  }

  return Response.json({
    success: true,
    issues: issues.map(({ id, title, why, fix, savings }) => ({ id, title, why, fix, savings })),
  });
}
