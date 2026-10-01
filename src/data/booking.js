// Időpontfoglaló beállítások + közös idő-logika (kliens és API is ezt használja).
export const booking = {
  timeZone: "Europe/Budapest",
  workDays: [1, 2, 3, 4, 5], // H–P (0 = vasárnap)
  startHour: 10,
  endHour: 17, // utolsó hívásnak eddig véget kell érnie
  durationMin: 20,
  stepMin: 30,
  minNoticeHours: 24,
  daysAhead: 30,
  // TODO: fix Google Meet link – üresen: „a linket e-mailben küldöm”
  meetUrl: "",
};

const pad = (n) => String(n).padStart(2, "0");

// Budapesti fali idő → UTC Date (DST-helyes a 10–17 sávban).
export function budapestToUtc(date, time) {
  const guess = new Date(`${date}T${time}:00Z`);
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: booking.timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(guess)
      .map((x) => [x.type, x.value]),
  );
  const asLocal = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Date(guess.getTime() - (asLocal - guess.getTime()));
}

// Mai budapesti dátum (YYYY-MM-DD).
export function todayBudapest() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: booking.timeZone }).format(new Date());
}

// Foglalható napok listája (csak munkanapok, a következő daysAhead napból).
export function bookableDays() {
  const [y, m, d] = todayBudapest().split("-").map(Number);
  const days = [];
  for (let i = 0; i <= booking.daysAhead; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    if (!booking.workDays.includes(dt.getUTCDay())) continue;
    const iso = dt.toISOString().slice(0, 10);
    if (allSlots(iso).length) days.push(iso);
  }
  return days;
}

// Adott nap összes időpontja (HH:mm), a minimum előzetes idő után.
export function allSlots(date) {
  const earliest = Date.now() + booking.minNoticeHours * 3600_000;
  const slots = [];
  for (let t = booking.startHour * 60; t + booking.durationMin <= booking.endHour * 60; t += booking.stepMin) {
    const time = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
    if (budapestToUtc(date, time).getTime() >= earliest) slots.push(time);
  }
  return slots;
}

export function isValidSlot(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return bookableDays().includes(date) && allSlots(date).includes(time);
}
