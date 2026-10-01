"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { booking, bookableDays, todayBudapest } from "@/data/booking";
import { site } from "@/data/site";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper placeholder:text-paper/40 outline-none transition focus:border-accent focus:bg-paper/[0.07]";
const label = "mb-1.5 block text-sm font-medium text-paper/70";

const dayFmt = new Intl.DateTimeFormat("hu-HU", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("hu-HU", { month: "long", day: "numeric", weekday: "long", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", timeZone: "UTC" });
const fmt = (f, iso) => f.format(new Date(`${iso}T12:00:00Z`));
const weekdays = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

// Havi rács (hétfő kezdettel): null = üres cella, egyébként YYYY-MM-DD.
function monthGrid(ym) {
  const [y, m] = ym.split("-").map(Number);
  const offset = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array(offset).fill(null);
  for (let d = 1; d <= count; d++) cells.push(`${ym}-${String(d).padStart(2, "0")}`);
  return cells;
}

function Calendar({ days, value, onPick }) {
  const months = [...new Set(days.map((d) => d.slice(0, 7)))];
  const [picked, setMonth] = useState(null);
  const month = months.includes(picked) ? picked : months[0];
  const today = todayBudapest();
  if (!month) return null;
  const i = months.indexOf(month);
  const nav = "grid size-8 place-items-center rounded-full text-paper/70 transition hover:bg-paper/10 hover:text-paper disabled:pointer-events-none disabled:opacity-25";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-semibold capitalize">{fmt(monthFmt, `${month}-01`)}</p>
        <div className="flex gap-1">
          <button type="button" aria-label="Előző hónap" disabled={i <= 0} onClick={() => setMonth(months[i - 1])} className={nav}>
            <Icon name="arrow" className="size-4 rotate-180" strokeWidth={2} />
          </button>
          <button type="button" aria-label="Következő hónap" disabled={i >= months.length - 1} onClick={() => setMonth(months[i + 1])} className={nav}>
            <Icon name="arrow" className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((w) => (
          <span key={w} className="pb-1 text-sm font-medium text-paper/40">{w}</span>
        ))}
        {monthGrid(month).map((d, k) => {
          if (!d) return <span key={k} />;
          const ok = days.includes(d);
          const sel = d === value;
          return (
            <button
              key={d}
              type="button"
              disabled={!ok}
              onClick={() => onPick(d)}
              aria-pressed={sel}
              className={`mx-auto aspect-square w-full max-w-10 rounded-full text-sm tabular-nums transition ${
                sel
                  ? "bg-highlight font-semibold text-night"
                  : ok
                    ? "bg-paper/[0.06] font-medium text-paper hover:bg-highlight/20"
                    : "text-paper/25"
              } ${d === today && !sel ? "ring-1 ring-paper/40" : ""}`}
            >
              {Number(d.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Online hívás foglaló: gomb + felugró ablak (nap → időpont → adatok) → /api/foglalas → Airtable.
export default function BookingModal({ className = "" }) {
  const dialog = useRef(null);
  const [days, setDays] = useState([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState(null);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function open() {
    setDays(bookableDays());
    dialog.current?.showModal();
  }

  async function pickDay(d) {
    setDate(d);
    setTime("");
    setSlots(null);
    setError("");
    try {
      const res = await fetch(`/api/foglalas/szabad?nap=${d}`);
      const data = await res.json();
      if (!data.success) throw new Error();
      setSlots(data.slots);
    } catch {
      setSlots([]);
      setError("Nem sikerült betölteni az időpontokat, próbáld újra.");
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!consent) {
      setError("Kérlek, fogadd el az adatkezelési tájékoztatót.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/foglalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, date, time }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else if (data.error === "taken") {
        setError("Ezt az időpontot közben lefoglalták, válassz másikat.");
        pickDay(date);
      } else throw new Error();
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`inline-flex items-center gap-2 rounded-full border border-paper/25 px-6 py-3 text-base font-medium text-paper transition hover:border-paper/60 hover:bg-paper/[0.06] ${className}`}
      >
        Időpontot foglalok
        <Icon name="arrow" className="size-4" strokeWidth={2} />
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto w-[min(92vw,720px)] rounded-2xl border border-paper/10 bg-night-2 p-0 text-paper shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] [color-scheme:dark] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-6 md:p-7">
          <button
            type="button"
            aria-label="Bezárás"
            onClick={() => dialog.current?.close()}
            className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-paper/60 hover:bg-paper/10 hover:text-paper"
          >
            <Icon name="plus" className="size-4 rotate-45" strokeWidth={2} />
          </button>

          {done ? (
            <div className="py-4 text-center" role="status">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-highlight/15 text-highlight">
                <Icon name="check" className="size-6" strokeWidth={2.4} />
              </span>
              <h3 className="mt-4 type-h4 font-bold">Lefoglalva!</h3>
              <p className="mt-2 text-base text-paper/70">
                {fmt(longFmt, date)}, {time} · {booking.durationMin}&nbsp;perc, Google Meet
              </p>
              {booking.meetUrl ? (
                <a href={booking.meetUrl} target="_blank" rel="noopener" className="mt-4 inline-block text-highlight underline underline-offset-4">
                  Csatlakozási link
                </a>
              ) : (
                <p className="mt-3 text-sm text-paper/55">A Google Meet linket e-mailben küldöm.</p>
              )}
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="text-sm font-medium tracking-label text-highlight uppercase">Online hívás</p>
              <h3 className="mt-2 pr-8 type-h4 font-bold">Foglalj egy {booking.durationMin} perces hívást</h3>
              <p className="mt-1 text-base text-paper/70">Google Meet-en átbeszéljük, mire van szükséged.</p>

              <div className="mt-6 grid gap-6 md:grid-cols-[1fr_200px]">
                <Calendar days={days} value={date} onPick={pickDay} />

                <div className="md:border-l md:border-paper/10 md:pl-6">
                  {!date ? (
                    <p className="text-sm text-paper/55 md:pt-1">Válassz napot a naptárban.</p>
                  ) : (
                    <>
                      <p className="mb-3 text-base font-semibold capitalize">{fmt(longFmt, date)}</p>
                      {slots === null ? (
                        <p className="text-sm text-paper/55">Betöltés…</p>
                      ) : slots.length === 0 ? (
                        <p className="text-sm text-paper/55">Erre a napra nincs szabad időpont.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:max-h-[300px] md:grid-cols-1 md:overflow-y-auto md:pr-1">
                          {slots.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTime(t)}
                              className={`rounded-lg border py-2 text-sm tabular-nums transition ${
                                t === time
                                  ? "border-accent bg-accent text-on-accent"
                                  : "border-paper/10 bg-paper/[0.03] text-paper/80 hover:border-highlight/50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {time && (
                <div className="mt-5 space-y-3.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="b-name" className={label}>Hogyan szólíthatlak? *</label>
                      <input id="b-name" placeholder="pl. Peti" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                    </div>
                    <div>
                      <label htmlFor="b-email" className={label}>E-mail cím *</label>
                      <input id="b-email" type="email" placeholder="pl. peter@cegem.hu" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="b-msg" className={label}>Mivel foglalkozol? Miben szeretnél fejlődni?</label>
                    <textarea id="b-msg" placeholder="pl. Építőipari vállalkozásom van, de a Google-ben nem találnak meg minket. Szeretnék egy modern weboldalt, ami hozza az ügyfeleket." className={`${input} min-h-[80px] resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>
                  <label className="flex items-start gap-2.5 text-sm text-paper/70">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                    />
                    <span>
                      Elfogadom az{" "}
                      <a href={site.privacyUrl} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-paper">
                        adatkezelési tájékoztatót
                      </a>
                      .
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={sending}
                    className="glow-accent inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
                  >
                    {sending ? "Foglalás…" : `Foglalás: ${fmt(dayFmt, date)}, ${time}`}
                  </button>
                </div>
              )}

              {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
