// A fő oldal (kod/webvulcano/app/api/lead/route.ts) JS-portja — ugyanaz az Airtable tábla.
const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tblZaCWjyWERrOrcu";

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

  const { name, email, phone, website, painpoint, goal } = body ?? {};

  if (!name || !email) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const fields = {
    Name: name,
    Email: email,
    Painpoint: painpoint || "",
    Goal: goal || "",
  };
  if (website) fields.Website = website;
  if (phone) fields.Phone = phone;

  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    console.error("Airtable error:", await res.text());
    return Response.json({ success: false, error: "Airtable error" }, { status: 502 });
  }

  return Response.json({ success: true });
}
