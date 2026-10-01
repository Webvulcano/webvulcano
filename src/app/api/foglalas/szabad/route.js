import { allSlots, bookableDays, budapestToUtc } from "@/data/booking";
import { bookedTimes } from "../airtable";

// GET /api/foglalas/szabad?nap=YYYY-MM-DD → szabad időpontok
export async function GET(request) {
  const date = new URL(request.url).searchParams.get("nap") || "";
  if (!process.env.AIRTABLE_TOKEN) {
    return Response.json({ success: false, error: "Server misconfigured" }, { status: 500 });
  }
  if (!bookableDays().includes(date)) {
    return Response.json({ success: true, slots: [] });
  }
  try {
    const taken = new Set(await bookedTimes(date));
    const slots = allSlots(date).filter((t) => !taken.has(budapestToUtc(date, t).getTime()));
    return Response.json({ success: true, slots });
  } catch (e) {
    console.error("Airtable error:", e.message);
    return Response.json({ success: false, error: "Airtable error" }, { status: 502 });
  }
}
