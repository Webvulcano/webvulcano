"use client";

import { useState } from "react";
import BookingModal from "@/components/ui/BookingModal";
import Icon from "@/components/ui/Icon";
import { booking } from "@/data/booking";
import { defaultAssumptions } from "@/data/kulcsszavak/assumptions";
import { site } from "@/data/site";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper placeholder:text-paper/40 outline-none transition focus:border-accent focus:bg-paper/[0.07]";
const label = "mb-1.5 block text-sm font-medium text-paper/70";
const question = "mb-4 block type-h4 font-bold";
const primaryBtn =
  "glow-accent inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60";

// Kattintási arány, ha az oldal a Google első oldalán, a 4–10. helyen van — ezt biztosan el
// tudjuk érni; a top 3 (10–28%) bónusz, nem ígéret (Lehel döntése, 2026-11-02).
const CTR = [0.02, 0.06];
// Ennyi kulcsszó látszik az oldalon; a teljes listát emailben kapja meg (/api/kulcsszo → Airtable → Airtable-automatizáció).
const FREE_ROWS = 3;
const LOCATIONS = ["Budapest", "Más város", "Országosan / online"];
const STEPS = 4;

const fmt = (n) => Math.round(n).toLocaleString("hu-HU");
const fmtFt = (n) =>
  n >= 1000000
    ? `${(n / 1000000).toLocaleString("hu-HU", { maximumFractionDigits: 1 })} millió Ft`
    : `${fmt(Math.round(n / 1000) * 1000)} Ft`;
const pct = (n) => `${Math.round(n * 100)}%`;

function estimate(keywords, clientValue) {
  const { leadRate, closeRate } = defaultAssumptions;
  const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);
  const visitors = CTR.map((c) => totalVolume * c);
  const leads = visitors.map((v, i) => v * leadRate[i]);
  // Tartományként, mint az érdeklődőnél (Lehel döntése): min = minden arány alsó, max = felső értéke.
  // Csak óvatos számnál ellentmondásnak tűnt a „3–19 érdeklődő” mellett.
  const yearlyValue = clientValue ? leads.map((l, i) => l * closeRate[i] * 12 * clientValue) : null;
  return { totalVolume, visitors, leads, yearlyValue };
}

export default function KeywordCalculator() {
  // 1. lépés: űrlap
  const [occupation, setOccupation] = useState("");
  const [services, setServices] = useState(["", ""]);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [step, setStep] = useState(1); // űrlap-lépcső: 1 foglalkozás, 2 szolgáltatások, 3 helyszín, 4 ügyfélérték
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  // 2. lépés: eredmény (+ aláírt token az email-kapuhoz)
  const [result, setResult] = useState(null);
  const [token, setToken] = useState("");
  const [clientValue, setClientValue] = useState("");
  // 3. lépés: email-kapu; egy pipa: tájékoztató + email-megkeresés (Lehel döntése, 2026-11-02)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function setService(i, value) {
    setServices((prev) => prev.map((s, j) => (j === i ? value : s)));
  }

  function next(e) {
    e.preventDefault();
    setError("");
    if (step < STEPS) setStep(step + 1);
    else analyze();
  }

  async function analyze() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kulcsszo/elemzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occupation, services, location, city }),
      });
      const data = await res.json();
      if (res.status === 429) throw new Error("Mára elfogyott a keresésed – próbáld újra holnap, vagy írj nekem.");
      if (!data.success) throw new Error("Hiba történt, próbáld újra.");
      if (data.unavailable) {
        // élő lekérés kikapcsolva (KULCSSZO_LIVE) és nincs előre kiszámolt lista erre az iparágra
        setUnavailable(true);
        return;
      }
      setResult(data.result);
      setToken(data.token);
      // ha a látogató nem adott meg ügyfélértéket, az iparág óvatos alapértéke (ha van) lép be
      if (!clientValue.trim() && data.clientValue) setClientValue(String(data.clientValue));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!consent) {
      setError("Kérlek, jelöld be a hozzájárulást, különben nem tudom elküldeni a listát.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/kulcsszo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, consent, token }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setSent(true);
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setStep(1);
    setUnavailable(false);
    setResult(null);
    setToken("");
    setSent(false);
    setError("");
  }

  // Az űrlap egy képernyő (h-dvh, a globals.css data-no-scroll szabálya tiltja a görgetést és
  // rejti a footert); az eredményoldal normál, görgethető oldal.
  const oneScreen = !result;

  return (
    <div
      data-no-scroll={oneScreen || undefined}
      className={oneScreen ? "flex h-dvh flex-col justify-center pt-20 pb-6 lg:pt-24" : "pt-40 pb-24 lg:pt-48 lg:pb-36"}
    >
      <p className="text-sm font-medium tracking-label text-highlight uppercase">Kulcsszó-kalkulátor</p>
      {/* a 2–4. lépésnél csak a kártya marad (a h1 a felolvasónak megmarad), különben nem fér ki egy képernyőre */}
      <h1 className={`mt-3 type-h2 font-bold md:type-h1 ${oneScreen && step > 1 ? "sr-only" : ""}`}>
        Hányan keresnek rád a Google-ön?
      </h1>
      <p className={`mt-4 max-w-2xl text-lg text-paper/70 ${oneScreen && step > 1 ? "hidden" : ""}`}>
        Megnézem, hányan keresik havonta a szolgáltatásodat, és mennyi ügyfelet hozhatna, ha a Google első oldalán lennél.
      </p>

      {unavailable ? (
        <div className="mt-8 max-w-2xl rounded-2xl border border-paper/10 bg-night-2 p-6 md:p-8">
          <h2 className="type-h4 font-bold">Ehhez a szakmához még nincs kész elemzésem</h2>
          <p className="mt-2 text-base text-paper/70">
            Írj nekem, és kézzel lekérem a te szolgáltatásaidra a valós Google-keresésszámokat – díjmentesen.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <a href={site.ctaHref} className={primaryBtn}>
              {site.cta}
              <Icon name="arrow" className="size-4" strokeWidth={2} />
            </a>
            <button type="button" onClick={restart} className="text-base font-medium text-paper/60 underline underline-offset-4 hover:text-paper">
              Vissza
            </button>
          </div>
        </div>
      ) : !result ? (
        <form onSubmit={next} className="mt-6 max-w-2xl rounded-2xl border border-paper/10 bg-night-2 p-5 md:mt-8 md:p-8">
          {/* lépcsős kitöltés (mint a ContactForm): lépésenként egy kérdés; a „Tovább” csak a
              látható kötelező mezők kitöltése után enged tovább (natív required). */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium tracking-label text-paper/55 uppercase">
              {step}. lépés / {STEPS}
            </p>
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: STEPS }, (_, i) => (
                <span key={i} className={`h-1.5 w-8 rounded-full ${i < step ? "bg-accent" : "bg-paper/15"}`} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            {step === 1 && (
              <>
                <label htmlFor="kk-occ" className={question}>Mivel foglalkozol?</label>
                <input
                  id="kk-occ"
                  className={input}
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="pl. gyógytornász"
                  maxLength={60}
                  required
                />
              </>
            )}

            {step === 2 && (
              <fieldset>
                <legend className={question}>Mik a fő szolgáltatásaid?</legend>
                <p className="-mt-2 mb-4 text-sm text-paper/55">Minél pontosabb, annál pontosabb kulcsszavakat kapsz. 1–3 darab.</p>
                <div className="space-y-2.5">
                  {services.map((s, i) => (
                    <input
                      key={i}
                      aria-label={`${i + 1}. szolgáltatás`}
                      className={input}
                      value={s}
                      onChange={(e) => setService(i, e.target.value)}
                      placeholder={i === 0 ? "pl. gerinctorna" : i === 1 ? "pl. sportsérülés rehabilitáció" : "további szolgáltatás"}
                      maxLength={60}
                      required={i === 0}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                {/* max 3: így mobilon is kifér egy képernyőre */}
                {services.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setServices((prev) => [...prev, ""])}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-paper/70 hover:text-paper"
                  >
                    <Icon name="plus" className="size-4" strokeWidth={2} />
                    Még egy szolgáltatás
                  </button>
                )}
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <legend className={question}>Hol dolgozol?</legend>
                <div className="flex flex-wrap gap-2.5">
                  {LOCATIONS.map((l) => (
                    <label
                      key={l}
                      className={`cursor-pointer rounded-full border px-4 py-2.5 text-base transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                        location === l ? "border-accent bg-accent/10 text-paper" : "border-paper/15 text-paper/70 hover:border-paper/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="kk-loc"
                        value={l}
                        checked={location === l}
                        onChange={() => setLocation(l)}
                        className="sr-only"
                        required
                      />
                      {l}
                    </label>
                  ))}
                </div>
                {location && location !== "Országosan / online" && (
                  <input
                    aria-label={location === "Budapest" ? "Kerület" : "Város"}
                    className={`${input} mt-3`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={location === "Budapest" ? "kerület (nem kötelező), pl. XI. kerület" : "melyik város? pl. Debrecen"}
                    maxLength={40}
                    required={location === "Más város"}
                  />
                )}
              </fieldset>
            )}

            {step === 4 && (
              <>
                <label htmlFor="kk-value" className={question}>Mennyit ér neked 1 ügyfél 1 év alatt?</label>
                <p className="-mt-2 mb-4 text-sm text-paper/55">
                  Ebből számolom ki, mennyit érhetnek forintban az új ügyfelek. Nem kötelező – üresen is továbbléphetsz.
                </p>
                <div className="relative max-w-xs">
                  <input
                    id="kk-value"
                    inputMode="numeric"
                    className={`${input} pr-12`}
                    value={Number(clientValue.replace(/\D/g, "")) ? fmt(Number(clientValue.replace(/\D/g, ""))) : clientValue}
                    onChange={(e) => setClientValue(e.target.value.replace(/[^\d\s]/g, ""))}
                    placeholder="pl. 150 000"
                    maxLength={13}
                    autoFocus
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-base text-paper/45">Ft</span>
                </div>
              </>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-5 md:mt-8">
            <button type="submit" disabled={loading} className={primaryBtn}>
              {step < STEPS ? "Tovább" : loading ? "Keresem a kulcsszavakat… (kb. 15 mp)" : "Mutasd, hányan keresnek"}
              {!loading && <Icon name="arrow" className="size-4" strokeWidth={2} />}
            </button>
            {step > 1 && !loading && (
              <button
                type="button"
                onClick={() => {
                  setStep((s) => s - 1);
                  setError("");
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-paper/60 transition hover:text-paper"
              >
                <Icon name="arrow" className="size-4 rotate-180" strokeWidth={2} />
                Vissza
              </button>
            )}
          </div>
        </form>
      ) : (
        <Result
          result={result}
          clientValue={clientValue}
          setClientValue={setClientValue}
          restart={restart}
          gate={
            sent ? (
              <div role="status" className="mt-8 flex items-start gap-4 rounded-2xl border border-highlight/25 bg-highlight/[0.06] p-6 md:p-8">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight/15 text-highlight">
                  <Icon name="check" className="size-5" strokeWidth={2.4} />
                </span>
                <div>
                  <h2 className="type-h4 font-bold">Hamarosan megkapod a teljes listát!</h2>
                  <p className="mt-1 text-base text-paper/70">A(z) {email} címre küldöm. Ha nem látod, nézd meg a spam mappát is.</p>
                </div>
              </div>
            ) : (
              result.keywords.length > FREE_ROWS && (
                <form onSubmit={submit} className="mt-8 rounded-2xl border border-highlight/25 bg-highlight/[0.06] p-6 md:p-8">
                  <h2 className="type-h4 font-bold">+{result.keywords.length - FREE_ROWS} további kulcsszó</h2>
                  <p className="mt-1 text-base text-paper/70">Add meg a neved és az e-mail címed, és elküldöm a teljes listát.</p>

                  <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="kk-name" className={label}>Név</label>
                      <input id="kk-name" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                    </div>
                    <div>
                      <label htmlFor="kk-email" className={label}>E-mail cím</label>
                      <input id="kk-email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                    </div>
                  </div>

                  <label className="mt-4 flex items-start gap-2.5 text-sm text-paper/70">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                    />
                    <span>
                      Megismertem az{" "}
                      <a href={site.privacyUrl} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-paper">
                        adatkezelési tájékoztatót
                      </a>
                      , és hozzájárulok, hogy e-mailben megkeress.
                    </span>
                  </label>

                  {error && <p className="mt-3 text-sm text-danger">{error}</p>}

                  <button type="submit" disabled={sending} className={`${primaryBtn} mt-6`}>
                    {sending ? "Küldés…" : "Kérem a teljes listát"}
                    {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
                  </button>
                </form>
              )
            )
          }
        />
      )}
    </div>
  );
}

function Result({ result, clientValue, setClientValue, restart, gate }) {
  const { leadRate, closeRate } = defaultAssumptions;
  const value = Number(clientValue.replace(/\D/g, "")) || null;
  const est = estimate(result.keywords, value);

  if (!result.keywords.length) {
    return (
      <div className="mt-10 max-w-2xl rounded-2xl border border-paper/10 bg-night-2 p-6 md:p-8">
        <h2 className="type-h4 font-bold">Erre nem találtam mérhető keresést</h2>
        <p className="mt-2 text-base text-paper/70">
          A Google szerint ezekre a szolgáltatásokra havonta túl kevesen keresnek ahhoz, hogy számot mondjak. Ilyenkor
          gyakran a Google Térkép vagy az ajánlások hoznak több ügyfelet – írj, és megnézem, neked mi működne.
        </p>
        <button type="button" onClick={restart} className="mt-5 text-base font-medium text-highlight underline underline-offset-4">
          Új keresés
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="type-h3 font-bold">{result.name}</h2>
        <button type="button" onClick={restart} className="text-base font-medium text-paper/60 underline underline-offset-4 hover:text-paper">
          Új keresés
        </button>
      </div>

      {/* 3 szám egy sorban (mobilon 2+1), a forintos tartomány alatta teljes szélességben — egy cellában tördelődne */}
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 lg:grid-cols-3">
        <Stat label="Havi keresés" value={fmt(est.totalVolume)} />
        <Stat label="Havi látogató nálad" value={`${fmt(est.visitors[0])}–${fmt(est.visitors[1])}`} />
        {/* évesen: az első oldali arányokkal a havi szám gyakran 0–1 lenne */}
        <Stat label="Érdeklődő évente" value={`${fmt(est.leads[0] * 12)}–${fmt(est.leads[1] * 12)}`} className="max-lg:col-span-2" />
        {value && (
          <Stat
            label="Alsóhangon 1 év alatt szerzett új ügyfelek értéke"
            value={
              <>
                <span className="whitespace-nowrap">{fmtFt(est.yearlyValue[0])}</span> –{" "}
                <span className="whitespace-nowrap">{fmtFt(est.yearlyValue[1])}</span>
              </>
            }
            highlight
            className="col-span-2 lg:col-span-3"
          />
        )}
      </dl>

      {/* ügyfélérték utólag is beírható/módosítható — tiszta JS újraszámolás, nincs új lekérdezés */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor="kk-value-result" className="text-sm text-paper/55">
          Mennyit ér neked 1 ügyfél 1 év alatt?
        </label>
        <div className="relative max-w-xs">
          <input
            id="kk-value-result"
            inputMode="numeric"
            className={`${input} pr-12 py-2`}
            value={value ? fmt(value) : clientValue}
            onChange={(e) => setClientValue(e.target.value.replace(/[^\d\s]/g, ""))}
            placeholder="pl. 150 000"
            maxLength={13}
          />
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-base text-paper/45">Ft</span>
        </div>
      </div>

      {/* tölcsér fő lépése: hívás (vázlat csak utána) — lásd projektek/Social Media/tolcser.md */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-accent/30 bg-accent/[0.07] p-6 md:p-8">
        <div className="max-w-xl">
          <h3 className="type-h4 font-bold">Mit jelent ez a te vállalkozásodnak?</h3>
          <p className="mt-1 text-base text-paper/70">
            {booking.durationMin} percben átbeszéljük az eredményt, és ha van értelme, csinálok neked egy ingyenes
            weboldal-vázlatot.
          </p>
        </div>
        <BookingModal
          primary
          label={`Beszéljük át ${booking.durationMin} percben`}
          defaultMessage={`Kulcsszó-kalkulátor: ${result.name} – ${fmt(est.totalVolume)} keresés/hó.`}
        />
      </div>

      <table className="mt-12 w-full text-base">
        <thead>
          <tr className="border-b border-paper/10 text-left text-sm text-paper/55">
            <th className="py-3 font-medium">Kulcsszó</th>
            <th className="py-3 text-right font-medium">Havi keresés</th>
          </tr>
        </thead>
        <tbody>
          {result.keywords.slice(0, FREE_ROWS).map((k) => (
            <tr key={k.keyword} className="border-b border-paper/10">
              <td className="py-3 pr-4 text-paper/80">{k.keyword}</td>
              <td className="py-3 text-right tabular-nums text-paper">{fmt(k.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {gate}

      <p className="mt-10 max-w-3xl text-sm text-paper/45">
        Feltételezések: {pct(CTR[0])}–{pct(CTR[1])} kattintási arány a Google első oldalán (4–10. hely),{" "}
        {pct(leadRate[0])}–{pct(leadRate[1])} látogatóból lesz érdeklődő, {pct(closeRate[0])}–{pct(closeRate[1])}{" "}
        érdeklődőből ügyfél. Az ügyfélérték: havi keresés × kattintási arány × érdeklődő-arány × ügyfél-arány × 12
        hónap × 1 ügyfél éves értéke; az alsó érték a legóvatosabb, a felső a legkedvezőbb arányokkal. Ha az első három találat közé kerülsz,
        ennek akár többszöröse is lehet. Csak a szolgáltatót kereső kulcsszavakkal számolok – a témára, hírre vagy
        képzésre keresők kimaradnak. Keresésszámok: Google Ads, Magyarország, {result.fetchedAt}.
      </p>
    </>
  );
}

function Stat({ label: text, value, highlight, className = "" }) {
  return (
    <div className={`bg-night-2 p-5 md:p-6 ${className}`}>
      <dt className="text-sm text-paper/55">{text}</dt>
      <dd className={`mt-2 font-bold tabular-nums ${highlight ? "type-h3 text-highlight" : "type-h4 text-paper"}`}>{value}</dd>
    </div>
  );
}
