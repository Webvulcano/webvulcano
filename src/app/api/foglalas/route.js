import { budapestToUtc, isValidSlot } from "@/data/booking";
import { bookedTimes, createBooking } from "./airtable";

// POST /api/foglalas → új foglalás az Airtable Foglalasok táblába
export async function POST(request) {
  if (!process.env.AIRTABLE_TOKEN) {
    return Response.json({ success: false, error: "Server misconfigured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message, date, time } = body ?? {};
  if (!name || !email || !date || !time) {
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }
  if (!isValidSlot(date, time)) {
    return Response.json({ success: false, error: "Invalid slot" }, { status: 400 });
  }

  try {
    const start = budapestToUtc(date, time);
    // dupla foglalás elleni ellenőrzés közvetlenül mentés előtt
    const taken = await bookedTimes(date);
    if (taken.includes(start.getTime())) {
      return Response.json({ success: false, error: "taken" }, { status: 409 });
    }
    await createBooking({
      Nev: name,
      Email: email,
      Idopont: start.toISOString(),
      Uzenet: message || "",
      Statusz: "Foglalt",
    });
    return Response.json({ success: true });
  } catch (e) {
    console.error("Airtable error:", e.message);
    return Response.json({ success: false, error: "Airtable error" }, { status: 502 });
  }
}
