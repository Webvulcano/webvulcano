// AI-útmutató letöltés: a lead a lead-form Airtable táblájába megy (Status = „Útmutató”).
const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tblZaCWjyWERrOrcu";
const GUIDE_URL = "/utmutato/chatgpt-ajanlas-utmutato.pdf";

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
  const phone = clean(body?.phone, 30);
  const industry = clean(body?.industry, 60);
  const city = clean(body?.city, 60);

  if (!name || !email || body?.consent !== true) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const searched = industry && city ? ` (keresett: ${industry}, ${city})` : "";
  const contactOk = body?.contactOk === true ? "igen" : "nem";
  const fields = {
    Name: name,
    Email: email,
    Status: "Útmutató",
    Painpoint: `AI-útmutatót töltött le${searched} · megkereshető: ${contactOk}`,
  };
  if (phone) fields.Phone = phone;
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

  return Response.json({ success: true, url: GUIDE_URL });
}
