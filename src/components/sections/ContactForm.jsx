"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3.5 text-base text-paper placeholder:text-paper/45 outline-none transition focus:border-accent focus:bg-paper/[0.07] disabled:opacity-40";
const label = "mb-2.5 block text-sm font-medium text-paper/70";

// Kattintgatós minősítő kérdőív, doboz nélkül: felül a kérdés címként, alatta válaszkártyák.
// Kártyára kattintva automatikusan lép tovább (vissza gomb nincs). Az utolsó lépés: név + email + telefon + adatkezelési
// pipa → /api/lead (Airtable). A 4 válasz a Goal mezőbe megy egy sorban, az 1. a Painpointba is.
const questions = [
  {
    id: "weboldal",
    label: "Weboldal",
    q: "Van már weboldalad?",
    options: [
      "Nincs még",
      "Van, de régi vagy nem hoz ügyfelet",
      "Van, de újat szeretnék",
    ],
  },
  {
    id: "cel",
    label: "Cél",
    q: "Mi a legfontosabb cél?",
    options: [
      "Több telefon és foglalás",
      "Találjanak meg a Google-ön",
      "Profibb megjelenés",
      "Még nem tudom",
    ],
  },
  {
    id: "csomag",
    label: "Csomag",
    q: "Milyen weboldalban gondolkodsz?",
    options: [
      "Landing oldal",
      "Üzleti weboldal",
      "Egyedi funkciókkal",
      "Még nem tudom",
    ],
  },
  {
    id: "mikor",
    label: "Mikorra",
    q: "Mikorra kellene?",
    options: [
      "Minél előbb",
      "1–2 hónapon belül",
      "Csak tájékozódom",
    ],
  },
];
const totalSteps = questions.length + 1;
const cols = { 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export default function ContactForm() {
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(0); // 0–3: kérdések, 4: elérhetőség
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [consentError, setConsentError] = useState(false); // a tájékoztató-pipa hibája közvetlenül a pipa fölött jelenik meg

  const [leaving, setLeaving] = useState(false); // válasz után a kártyák kiúsznak, csak utána jön a következő kérdés
  const [pressed, setPressed] = useState(null); // érintőképernyőn: a megkoppintott kártya, amíg lefut a kitöltés
  const pointerType = useRef("mouse");

  const current = questions[step];

  function go(next) {
    setStep(next);
    // lépésváltáskor a kérdés címe legyen látható (mobilon a lenti kártyára kattintva kicsúszna)
    requestAnimationFrame(() =>
      document.getElementById("kapcsolat-lepes")?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  }

  // a hover-kitöltés kiindulópontja: ahol a kurzor belép / kilép a kártyán
  // A kör átmérője épp akkora, hogy a kiindulópontból a legtávolabbi sarkot is lefedje.
  // Kilépéskor csak akkor tesszük át a kilépési pontra, ha a kör már teljesen kinyílt —
  // különben zsugorodás/nyílás közben átugrana (ez okozta az akadást gyors ki-be mozgatásnál).
  function setOrigin(e) {
    const el = e.currentTarget;
    if (e.type === "pointerleave") {
      const fill = el.querySelector("[data-fill]");
      if (!fill || getComputedStyle(fill).scale !== "1") return;
    }
    const r = el.getBoundingClientRect();
    // gyors egérmozgásnál a belépő/kilépő pont kívül eshet a kártyán → a széléhez szorítjuk
    const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
    const y = Math.min(Math.max(e.clientY - r.top, 0), r.height);
    const d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--d", `${Math.ceil(d)}px`);
  }

  function choose(id, value) {
    setAnswers((a) => ({ ...a, [id]: value }));
    go(step + 1);
  }

  // Egérnél a hover már kitöltötte a kártyát → azonnal lép. Érintésnél nincs hover, ezért
  // koppintásra a koppintás pontjából lefut ugyanaz a fehér kitöltés, és csak utána lép tovább.
  function handleCardClick(e, id, value) {
    if (pressed || leaving) return;
    if (pointerType.current === "mouse") {
      leave(id, value);
      return;
    }
    if (e.clientX || e.clientY) setOrigin(e);
    setPressed(value);
    setTimeout(() => leave(id, value), 650);
  }

  // kiúszás (lépcsőzetesen, kb. 0,4 mp) → következő kérdés; az új kártyák a card-in animációval jönnek be
  function leave(id, value) {
    setLeaving(true);
    setTimeout(() => {
      setLeaving(false);
      setPressed(null);
      choose(id, value);
    }, 420);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent) {
      setConsentError(true);
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
          phone,
          painpoint: answers.weboldal || "",
          goal: questions.map((q) => `${q.label}: ${answers[q.id] || "–"}`).join(" · "),
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
    <section id="kapcsolat" className="relative isolate overflow-clip bg-night text-paper [color-scheme:dark]">
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -z-10 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]"
      />

      <div className="container-x py-24 lg:py-36">
        <div className="mx-auto max-w-5xl text-center">
          {submitted ? (
            // beküldés után a szekció-cím is eltűnik, csak a visszajelzés marad
            <div className="flex flex-col items-center" role="status">
              <span className="grid size-16 place-items-center rounded-full bg-highlight/15 text-highlight">
                <Icon name="check" className="size-8" strokeWidth={2.2} />
              </span>
              <p className="mt-6 type-h3 font-bold text-balance">Örülök, hogy írtál!</p>
               <p className="text-paper/80">Hamarosan visszajelzek!</p>
            </div>
          ) : (
            <>
              <h2 className="mx-auto max-w-[22ch] type-h2 font-bold text-balance">
                Engedd meg, hogy támogassam a munkádat
              </h2>

              {/* haladás: pöttyök + vissza */}
              <div id="kapcsolat-lepes" className="mt-8 flex scroll-mt-28 items-center justify-center gap-4">
                <ol className="flex items-center gap-2" aria-label={`${step + 1}. lépés / ${totalSteps}`}>
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <li
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === step ? "w-8 bg-accent" : i < step ? "w-2 bg-accent/60" : "w-2 bg-paper/15"
                      }`}
                    />
                  ))}
                </ol>
              </div>

              {current ? (
                <div className="mt-12">
                  <p className="text-sm font-medium tracking-label text-highlight uppercase">
                    {step + 1}. kérdés / {questions.length}
                  </p>
                  <h3 className="mt-3 type-h3 font-bold">{current.q}</h3>

                  <div className={`mt-10 grid gap-4 text-left ${cols[current.options.length]}`}>
                    {current.options.map((opt, i) => {
                      const selected = answers[current.id] === opt;
                      return (
                        <button
                          key={`${current.id}-${opt}`}
                          type="button"
                          aria-pressed={selected}
                          data-pressed={pressed === opt || undefined}
                          onPointerDown={(e) => (pointerType.current = e.pointerType)}
                          onClick={(e) => handleCardClick(e, current.id, opt)}
                          onPointerEnter={setOrigin}
                          onPointerLeave={setOrigin}
                          style={{ animationDelay: `${i * 70}ms`, transitionDelay: leaving ? `${i * 50}ms` : "0ms" }}
                          className={`animate-card-in transition-[opacity,translate] duration-300 ease-in ${
                            leaving ? "translate-y-4 opacity-0" : ""
                          } group relative isolate flex items-center justify-center overflow-hidden rounded-2xl bg-night-2 p-5 sm:bg-gradient-to-b sm:from-night-2 sm:to-night-3 text-center text-balance text-lg font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-32 sm:p-6`}
                        >
                          {/* hover: a kurzor belépési pontjából kinyíló fehér kör. Saját rétegen (will-change), csak a
                              mérete animál → nincs újrafestés. Billentyűzetnél középről nyílik. */}
                          <span
                            aria-hidden="true"
                            data-fill
                            className="pointer-events-none absolute top-[var(--y,50%)] left-[var(--x,50%)] -z-10 aspect-square w-[var(--d,250%)] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[#fff] transition-transform duration-900 ease-out will-change-transform group-hover:scale-100 group-focus-visible:scale-100 group-data-pressed:scale-100"
                          />
                          {/* a felirat külön elem a kör fölött, rövid színváltással */}
                          <span className="transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent group-data-pressed:text-accent">
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="animate-card-in mx-auto mt-12 max-w-xl space-y-6 text-left">
                  <div className="text-center">
                    <p className="text-sm font-medium tracking-label text-highlight uppercase">Utolsó lépés</p>
                    <h3 className="mt-3 type-h3 font-bold">Hol érlek el?</h3>
                  </div>
                  <div>
                    <label htmlFor="name" className={label}>
                      Hogy szólíthatlak?
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
                      autoFocus
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
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
                    <div>
                      <label htmlFor="phone" className={label}>
                        Telefonszám
                      </label>
                      <input
                        id="phone"
                        className={input}
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+36 30 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    {consentError && (
                      <p role="alert" className="mb-3 text-sm font-medium text-danger">
                        Kérlek, jelöld be, hogy megismerted az adatkezelési tájékoztatót.
                      </p>
                    )}
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-paper/70">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 shrink-0 accent-accent"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e.target.checked) setConsentError(false);
                        }}
                      />
                      <span>
                        Megismertem az{" "}
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
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-base font-medium text-on-accent glow-accent transition hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
                    >
                      {sending ? "Küldés…" : "Küldés"}
                      {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
                    </button>
                    {error && (
                      <p role="alert" className="text-sm text-danger">
                        {error}
                      </p>
                    )}
                  </div>
                </form>
              )}

            </>
          )}
        </div>
      </div>
    </section>
  );
}
