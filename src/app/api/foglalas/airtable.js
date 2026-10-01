import { booking } from "@/data/booking";

const BASE_ID = "appd1wTStPNASBYJz";
const TABLE_ID = "tblqRZxjGfxFnbOG3"; // Foglalasok
const API = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  };
}

// Adott (budapesti) nap foglalt időpontjai, UTC ms-ben.
export async function bookedTimes(date) {
  const formula = `AND({Statusz}='Foglalt',DATETIME_FORMAT(SET_TIMEZONE({Idopont},'${booking.timeZone}'),'YYYY-MM-DD')='${date}')`;
  const res = await fetch(`${API}?filterByFormula=${encodeURIComponent(formula)}&fields%5B%5D=Idopont`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.records.map((r) => new Date(r.fields.Idopont).getTime());
}

export async function createBooking(fields) {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) throw new Error(await res.text());
}
