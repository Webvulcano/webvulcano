"use client";

import { useState } from "react";
import Accent from "@/components/ui/Accent";
import Icon from "@/components/ui/Icon";
import { challenges } from "@/data/content";
import { site } from "@/data/site";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3.5 text-base text-paper placeholder:text-paper/45 outline-none transition focus:border-accent focus:bg-paper/[0.07] disabled:opacity-40";
const label = "mb-2.5 block text-sm font-medium text-paper/70";

const promises = [
  "Ingyen vázlat – előbb látod, csak utána döntesz",
  "24\u00a0órán belül személyesen visszajelzek",
  "Nem kötöd le magad, nem küldök spamet",
];

// Logika: kod/webvulcano/components/QualificationForm.jsx (fő oldal), új stílussal.
export default function ContactForm() {
  const [website, setWebsite] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [picked, setPicked] = useState([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggle(c) {
    setPicked((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent) {
      setError("Kérlek, fogadd el az adatkezelési tájékoztatót.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          website: noWebsite ? "" : website,
          painpoint: picked.join(", ") || "Nem választott",
          goal: description || "Nem írt leírást",
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError("Hiba történt, próbáld újra.");
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="kapcsolat" className="relative isolate overflow-clip bg-night text-paper">
      <div
        aria-hidden="true"
        className="absolute top-1/3 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px]"
      />

      <div className="container-x grid gap-14 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:py-36">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <p
            data-reveal
            className="text-sm font-medium tracking-eyebrow text-paper/60 uppercase"
          >
            Kapcsolat
          </p>
          <h2
            data-reveal
            style={{ "--d": "80ms" }}
            className="mt-6 text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            Kérem a díjmentes <Accent className="text-muted-soft">vázlatot</Accent>
          </h2>
          <p
            data-reveal
            style={{ "--d": "140ms" }}
            className="mt-6 max-w-[40ch] text-base text-paper/70 md:text-lg"
          >
            Két perc kitölteni. Utána megnézem a vállalkozásod, és elkészítem az első vázlatot.
          </p>

          <ul className="mt-10 space-y-4">
            {promises.map((p, i) => (
              <li
                key={p}
                data-reveal
                style={{ "--d": `${200 + i * 70}ms` }}
                className="flex items-center gap-3 text-base text-paper/85"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-highlight/15 text-highlight">
                  <Icon name="check" className="size-3.5" strokeWidth={2.4} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${site.email}`}
            className="mt-10 inline-flex items-center gap-2.5 text-base text-paper/70 transition hover:text-paper"
          >
            <Icon name="mail" className="size-5" />
            {site.email}
          </a>
        </div>

        <div className="noise rounded-[24px] border border-paper/10 bg-night-2/80 p-6 [color-scheme:dark] backdrop-blur sm:p-10">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
              <span className="grid size-14 place-items-center rounded-full bg-highlight/15 text-highlight">
                <Icon name="check" className="size-7" strokeWidth={2.2} />
              </span>
              <p className="mt-6 text-2xl font-bold">
                Köszi! Már nézem is a vállalkozásod.
              </p>
              <p className="mt-3 text-base text-paper/70">24&nbsp;órán belül személyesen visszajelzek.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label htmlFor="website" className={label}>
                  Mi a weboldalad címe?
                </label>
                <input
                  id="website"
                  className={input}
                  type="text"
                  placeholder="pelda.hu"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={noWebsite}
                />
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2.5 text-sm text-paper/70">
                  <input
                    type="checkbox"
                    className="size-4 accent-accent"
                    checked={noWebsite}
                    onChange={(e) => {
                      setNoWebsite(e.target.checked);
                      if (e.target.checked) setWebsite("");
                    }}
                  />
                  Nincs weboldalam
                </label>
              </div>

              <fieldset>
                <legend className={label}>Mi a legnagyobb kihívásod? (több is lehet)</legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {challenges.map((c) => {
                    const on = picked.includes(c);
                    return (
                      <label
                        key={c}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base transition ${
                          on
                            ? "border-accent bg-accent/15 text-paper"
                            : "border-paper/10 bg-paper/[0.03] text-paper/70 hover:border-paper/25"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={on}
                          onChange={() => toggle(c)}
                        />
                        <span
                          className={`grid size-4 shrink-0 place-items-center rounded border ${
                            on ? "border-accent bg-accent" : "border-paper/30"
                          }`}
                        >
                          {on && <Icon name="check" className="size-3 text-on-accent" strokeWidth={3} />}
                        </span>
                        {c}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="description" className={label}>
                  Mivel foglalkozik a vállalkozásod, és mit szeretnél elérni?
                </label>
                <textarea
                  id="description"
                  className={`${input} min-h-[110px] resize-y`}
                  placeholder="Röviden: mivel foglalkozol, és mi a célod…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={label}>
                    Neved
                  </label>
                  <input
                    id="name"
                    className={input}
                    type="text"
                    autoComplete="name"
                    placeholder="Kovács János"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={label}>
                    Email
                  </label>
                  <input
                    id="email"
                    className={input}
                    type="email"
                    autoComplete="email"
                    placeholder="janos@cegneve.hu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-paper/70">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-accent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Elolvastam és elfogadom az{" "}
                  <a
                    href={site.privacyUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-paper underline decoration-paper/30 underline-offset-[0.2em] hover:decoration-paper"
                  >
                    adatkezelési tájékoztatót
                  </a>
                  .
                </span>
              </label>

              <div>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-on-accent glow-accent transition hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
                >
                  {sending ? "Küldés…" : "Kérem a vázlatot"}
                  {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
                </button>
                {error && (
                  <p role="alert" className="mt-3 text-sm text-danger">
                    {error}
                  </p>
                )}
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-paper/10 px-3 py-1.5 text-sm text-paper/70">
                  <span className="size-1.5 rounded-full bg-highlight shadow-[0_0_8px_var(--color-highlight)]" />
                  Havonta csak 5&nbsp;vállalkozásnak
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
