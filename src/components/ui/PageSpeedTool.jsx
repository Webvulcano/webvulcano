"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { lcpOf, speedNote, speedNoteFoot } from "@/data/pagespeedNote";
import { site } from "@/data/site";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper placeholder:text-paper/40 outline-none transition focus:border-accent focus:bg-paper/[0.07]";
const label = "mb-1.5 block text-sm font-medium text-paper/70";
const primaryBtn =
  "glow-accent inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60";
const card = "rounded-2xl border border-paper/10 bg-night-2 p-5 md:p-6";

const ERRORS = {
  unreachable: "Ezt a címet nem tudtam megnyitni. Ellenőrizd, hogy elérhető-e az oldal, és próbáld újra.",
  busy: "A Google most túlterhelt, próbáld újra egy perc múlva.",
  limit: "Mára elfogyott a tesztelési kereted, próbáld újra holnap, vagy írj nekem.",
  invalid: "Ez nem tűnik érvényes weboldal-címnek, pl. pelda.hu.",
  failed: "Hiba történt a mérés közben, próbáld újra.",
};

// Lighthouse-küszöbök: 90+ jó, 50–89 javítható, 50 alatt rossz
const tone = (v) => (v >= 90 ? "text-highlight" : v >= 50 ? "text-decor" : "text-danger");
const vitalTone = (s) => (s >= 0.9 ? "text-highlight" : s >= 0.5 ? "text-decor" : "text-danger");

function Ring({ value, name }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className={`relative size-20 ${tone(value)}`}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xl font-bold text-paper">{value}</span>
      </div>
      <span className="text-sm font-medium text-paper/70">{name}</span>
    </div>
  );
}

export default function PageSpeedTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  // kapu: név + email + hozzájárulás → a javítandó tételek
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [issues, setIssues] = useState(null);
  const [gateError, setGateError] = useState("");

  async function measure(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pagespeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.status === 429) throw new Error(ERRORS.limit);
      if (res.status === 400) throw new Error(ERRORS.invalid);
      if (!data.success) throw new Error(ERRORS[data.error] ?? ERRORS.failed);
      setResult(data);
    } catch (err) {
      setError(err.message || ERRORS.failed);
    } finally {
      setLoading(false);
    }
  }

  async function unlock(e) {
    e.preventDefault();
    if (!consent) {
      setGateError("Kérlek, jelöld be a hozzájárulást, különben nem tudom megmutatni a tételeket.");
      return;
    }
    setSending(true);
    setGateError("");
    try {
      const res = await fetch("/api/pagespeed/reszletek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, consent, token: result.token }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setIssues(data.issues);
    } catch {
      setGateError("Hiba történt, ellenőrizd az e-mail címet, és próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setResult(null);
    setIssues(null);
    setError("");
    setGateError("");
  }

  const host = result ? new URL(result.url).host : "";
  const note = result ? speedNote(lcpOf(result.vitals)) : null;

  // Desktopon egy képernyő (globals.css: data-fit-screen), telefonon normál görgethető oldal.
  return (
    <div
      data-fit-screen
      className="pt-32 pb-16 lg:flex lg:h-dvh lg:flex-col lg:justify-center lg:pt-24 lg:pb-6"
    >
      {!result && <p className="text-sm font-medium tracking-label text-highlight uppercase">PageSpeed-teszt</p>}
      <h1 className={`${result ? "" : "mt-3"} type-h2 font-bold md:type-h1 ${result ? "sr-only" : ""}`}>Milyen gyors a weboldalad?</h1>

      {!result ? (
        <>
          <p className="mt-4 max-w-2xl text-lg text-paper/70">
            Írd be a címet, és 20 másodperc alatt megmutatom, mit lát a Google: sebességet, SEO-t, akadálymentességet, és mit érdemes elsőként javítani.
          </p>
          <form onSubmit={measure} className={`${card} mt-8 max-w-2xl md:p-8`}>
            <label htmlFor="ps-url" className="mb-3 block type-h4 font-bold">
              Mi a weboldalad címe?
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="ps-url"
                className={input}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="pelda.hu"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={300}
                required
              />
              <button type="submit" disabled={loading} className={`${primaryBtn} shrink-0`}>
                {loading ? "Mérem…" : "Mérés indítása"}
                {!loading && <Icon name="arrow" className="size-4" strokeWidth={2} />}
              </button>
            </div>
            {loading && (
              <div role="status" className="mt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-paper/10">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
                </div>
                <p className="mt-2 text-sm text-paper/60">Megnyitom az oldalt egy telefonon. Ez kb. 20 másodperc.</p>
              </div>
            )}
            {error && <p className="mt-4 text-sm text-danger">{error}</p>}
          </form>
        </>
      ) : (
        <div className="mt-4 grid gap-5 lg:mt-5 lg:grid-cols-[1.05fr_1fr]">
          <p className="text-base text-paper/70 lg:col-span-2">
            <strong className="font-bold text-paper">{host}</strong> – mobilos eredmény{" "}
            <button type="button" onClick={restart} className="ml-2 font-medium text-highlight underline underline-offset-4">
              Új teszt
            </button>
          </p>

          {note && (
            <div role="note" className="flex flex-col gap-1 rounded-2xl border border-danger/40 bg-danger/10 p-4 sm:flex-row sm:items-center sm:gap-6 md:px-6 lg:col-span-2">
              <p className="shrink-0 text-4xl leading-none font-bold text-danger">{note.big}</p>
              <div>
                <p className="text-xl leading-snug font-bold text-paper">{note.text}</p>
                <p className="mt-1 text-xs text-paper/55">{speedNoteFoot}</p>
              </div>
            </div>
          )}

          <section className={`${card} lg:max-h-[calc(100dvh-19rem)] lg:overflow-y-auto`} aria-label="Pontszámok">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {result.scores.map((s) => (
                <Ring key={s.key} value={s.value} name={s.label} />
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-paper/10 pt-4">
              {result.vitals.map((v) => (
                <div key={v.label}>
                  <dt className="text-xs leading-snug text-paper/60">{v.label}</dt>
                  <dd className={`mt-1 text-xl font-bold ${vitalTone(v.score)}`}>{v.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {issues ? (
            <section className={`${card} lg:max-h-[calc(100dvh-19rem)] lg:overflow-y-auto`} aria-label="Javítandó tételek">
              <h2 className="text-lg font-bold">Ezt javítsd először</h2>
              {issues.length ? (
                <div className="mt-3 divide-y divide-paper/10">
                  {issues.map((it, i) => (
                    <details key={it.id} name="ps-issue" open={i === 0} className="group py-2.5">
                      <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-on-accent">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 text-base leading-snug font-medium">
                          {it.title}
                          {it.savings && <span className="ml-2 text-sm font-normal text-highlight">{it.savings}</span>}
                        </span>
                        <Icon name="chevron" className="size-4 shrink-0 text-paper/60 transition-transform group-open:rotate-180" strokeWidth={2} />
                      </summary>
                      <div className="mt-2 space-y-2 pl-9 text-sm leading-relaxed">
                        {it.why && <p className="text-paper/75">{it.why}</p>}
                        {it.fix && (
                          <p className="text-paper/90">
                            <strong className="font-medium text-highlight">Megoldás: </strong>
                            {it.fix}
                          </p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-base text-paper/70">Nem találtam komoly javítanivalót, ez az oldal jól áll.</p>
              )}
              <p role="status" className="mt-4 flex items-start gap-2.5 border-t border-paper/10 pt-4 text-sm text-paper/75">
                <Icon name="mail" className="mt-0.5 size-4 shrink-0 text-highlight" strokeWidth={2} />
                <span>
                  A részletes útmutatót PDF-ben elküldöm a(z) <strong className="font-medium text-paper">{email}</strong> címre. Ha nem látod, nézd meg a spam mappát is.
                </span>
              </p>
            </section>
          ) : (
            <form onSubmit={unlock} className="rounded-2xl border border-highlight/25 bg-highlight/[0.06] p-5 md:p-6 lg:max-h-[calc(100dvh-19rem)] lg:overflow-y-auto">
              <h2 className="text-lg font-bold">
                {result.total > 0 ? `${result.total} javítandó tétel` : "Részletes javaslatok"}, ebből az 5 legfontosabb
              </h2>
              <p className="mt-1 text-sm text-paper/70">Add meg a neved és az e-mail címed, és megmutatom, mit érdemes elsőként javítani.</p>

              <div className="mt-4 grid gap-3">
                <div>
                  <label htmlFor="ps-name" className={label}>Név</label>
                  <input id="ps-name" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                </div>
                <div>
                  <label htmlFor="ps-email" className={label}>E-mail cím</label>
                  <input id="ps-email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                </div>
              </div>

              <label className="mt-3 flex items-start gap-2.5 text-sm text-paper/70">
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
                  , és hozzájárulok, hogy e-mailben megkeress, és elküldd az útmutatót.
                </span>
              </label>

              {gateError && <p className="mt-3 text-sm text-danger">{gateError}</p>}

              <button type="submit" disabled={sending} className={`${primaryBtn} mt-4`}>
                {sending ? "Küldés…" : "Megmutatom a tételeket"}
                {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
