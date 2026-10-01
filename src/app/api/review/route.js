// POST /api/review → 1–3 csillagos privát visszajelzés az Airtable Értékelések táblába.
// (4–5 csillagnál a kliens egyből a Google-értékeléshez visz, ide nem jön kérés.)
const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tblX90yduhdD0WybR";

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

  const { stars, comment } = body ?? {};
  if (![1, 2, 3].includes(stars) || typeof comment !== "string" || !comment.trim()) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { Stars: stars, Comment: comment.trim() } }),
  });
  if (!res.ok) {
    console.error("Airtable error:", await res.text());
    return Response.json({ success: false, error: "Airtable error" }, { status: 502 });
  }
  return Response.json({ success: true });
}
