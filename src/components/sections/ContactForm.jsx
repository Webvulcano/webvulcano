"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Accent from "@/components/ui/Accent";
import BookingModal from "@/components/ui/BookingModal";
import CopyEmail from "@/components/ui/CopyEmail";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3.5 text-base text-paper placeholder:text-paper/45 outline-none transition focus:border-accent focus:bg-paper/[0.07] disabled:opacity-40";
const label = "mb-2.5 block text-sm font-medium text-paper/70";

const promises = [
  "Díjmentes vázlat – előbb látod, csak utána döntesz",
  "Csak akkor fizetsz, ha elégedett vagy a munkámmal",
  "Bármikor nemet mondhatsz, semmi kötelezettség",
];

// Logika: kod/webvulcano/components/QualificationForm.jsx (fő oldal), új stílussal.
// Mobilon (lg alatt) lecsupaszítva: nincs ígéret-lista és „Inkább beszéljünk?” szöveg, csak a
// cím + bevezető, az időpontfoglaló gomb, a „Kitöltöm az űrlapot” gomb és az elérhetőségek.
// Az űrlap mobilon popupban nyílik (formOpen); desktopon a jobb oszlopban áll, mint eddig.
export default function ContactForm() {
  const [website, setWebsite] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1); // űrlap-lépcső: 1 = weboldal + vállalkozás, 2 = elérhetőség
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [consentError, setConsentError] = useState(false); // a tájékoztató-pipa hibája közvetlenül a pipa fölött jelenik meg
  const [formOpen, setFormOpen] = useState(false);

  // mobilos popup: háttér-görgetés tiltása + Esc-re zárás
  useEffect(() => {
    if (!formOpen) return;
    // iOS Safari-n az overflow:hidden nem elég → a body-t kitűzzük (position: fixed) a jelenlegi
    // görgetési pozícióban, záráskor visszaállítjuk és visszagörgetünk.
    const root = document.documentElement;
    const body = document.body;
    const y = window.scrollY;
    const prev = { overflow: root.style.overflow, cssText: body.style.cssText };
    root.style.overflow = "hidden";
    Object.assign(body.style, { position: "fixed", top: `-${y}px`, left: "0", right: "0", width: "100%" });
    const onKey = (e) => e.key === "Escape" && setFormOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev.overflow;
      body.style.cssText = prev.cssText;
      const behavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      root.style.scrollBehavior = behavior;
      window.removeEventListener("keydown", onKey);
    };
  }, [formOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
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
          website: noWebsite ? "" : website,
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

  const card = (
          <div className="noise relative my-auto w-full self-center rounded-[24px] border border-paper/10 bg-night-2 p-5 pt-12 [color-scheme:dark] backdrop-blur sm:p-10 lg:my-0 lg:bg-night-2/80 lg:p-10">
            <button
              type="button"
              aria-label="Bezárás"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-paper/60 hover:bg-paper/10 hover:text-paper lg:hidden"
            >
              <Icon name="plus" className="size-4 rotate-45" strokeWidth={2} />
            </button>
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
                <span className="grid size-14 place-items-center rounded-full bg-highlight/15 text-highlight">
                  <Icon name="check" className="size-7" strokeWidth={2.2} />
                </span>
                <p className="mt-6 type-h3 font-bold">
                  Örülök hogy írtál! Már nézem is a vállalkozásod.
                </p>
                <p className="mt-3 text-base text-paper/70">24&nbsp;órán belül személyesen visszajelzek.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* két lépcső: 1) weboldal + vállalkozás, 2) elérhetőség + beküldés.
                    1. lépés kötelező mezői (required) → a „Tovább” csak kitöltve enged tovább. */}
                <div>
                  {/* cím csak desktopon (mobilon a popup már a „Kitöltöm az űrlapot” gombról nyílik) */}
                  <h3 className="mb-3 hidden type-h3 font-bold lg:block">Lépjünk kapcsolatba</h3>
                  <p className="text-sm font-medium tracking-label text-paper/55 uppercase">
                    {step}. lépés / 2
                  </p>
                </div>

                {step === 1 ? (
                  <>
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
                        required={!noWebsite}
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
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-on-accent glow-accent transition hover:bg-accent-hover sm:w-auto"
                    >
                      Tovább
                      <Icon name="arrow" className="size-4" strokeWidth={2} />
                    </button>
                  </>
                ) : (
                  <>
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
                      />
                    </div>

                    <div>
                    {consentError && (
                      <p role="alert" className="mb-3 text-sm font-medium text-danger">
                        Kérlek, fogadd el az adatkezelési tájékoztatót.
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
                    </div>

                    <div>
                      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            setError("");
                          }}
                          className="inline-flex items-center gap-2 text-sm font-medium text-paper/60 transition hover:text-paper"
                        >
                          <Icon name="arrow" className="size-4 rotate-180" strokeWidth={2} />
                          Vissza
                        </button>
                        <button
                          type="submit"
                          disabled={sending}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-on-accent glow-accent transition hover:bg-accent-hover disabled:opacity-60 sm:order-first sm:w-auto"
                        >
                          {sending ? "Küldés…" : "Kérem a vázlatot"}
                          {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
                        </button>
                      </div>
                      {error && (
                        <p role="alert" className="mt-3 text-sm text-danger">
                          {error}
                        </p>
                      )}
                      <p className="mt-4 text-sm text-paper/55">
                        24&nbsp;órán belül személyesen visszajelzek.
                      </p>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
  );

  return (
    <section id="kapcsolat" className="relative isolate overflow-clip bg-night text-paper">
      <div
        aria-hidden="true"
        className="absolute top-1/3 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px]"
      />

      <div className="container-x grid gap-14 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:py-36">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <h2
            data-reveal
            style={{ "--d": "80ms" }}
            className="mt-6 type-h2 font-bold"
          >
            Engedd meg hogy adjak neked egy <Accent className="text-muted-soft">ajándékot</Accent>
          </h2>
          <p
            data-reveal
            style={{ "--d": "140ms" }}
            className="mt-6 max-w-[40ch] text-base text-paper/70 md:text-lg"
          >
            Megnézem a vállalkozásod, és megtervezem az új weboldalad első vázlatát. Csak akkor
            fizetsz, ha tetszik, amit látsz.
          </p>

          <ul className="mt-10 hidden space-y-4 lg:block">
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

          <div data-reveal className="mt-8 lg:mt-10 lg:border-t lg:border-paper/10 lg:pt-8">
            <p className="hidden text-lg font-semibold lg:block">Inkább beszéljünk?</p>
            <p className="mt-2 hidden max-w-[40ch] text-base text-paper/70 lg:block">
              Foglalj egy 20&nbsp;perces online hívást, amikor neked jó és átbeszéljük, mire van szükséged.
            </p>
            <BookingModal className="lg:mt-5" />
            <div className="mt-3 lg:hidden">
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                aria-haspopup="dialog"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-medium text-on-accent glow-accent transition hover:bg-accent-hover"
              >
                Kitöltöm az űrlapot
                <Icon name="arrow" className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 lg:mt-10">
            <CopyEmail />
            {site.phone && (
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 text-base text-paper/70 transition hover:text-paper"
              >
                <Icon name="phone" className="size-5" />
                {site.phone}
              </a>
            )}
          </div>
        </div>

        {/* Desktopon: sima grid-oszlop. Mobilon rejtve; a „Kitöltöm az űrlapot” gomb popupban nyitja
            (portal a body-ba, hogy a szekció stacking contextje ne zárja be a fejléc/hero alá). */}
        {!formOpen && <div className="hidden lg:contents">{card}</div>}
        {formOpen &&
          createPortal(
            <div
              onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Díjmentes vázlat kérése"
              className="fixed inset-0 z-[200] flex justify-center overflow-y-auto overscroll-contain bg-black/60 p-3 text-paper backdrop-blur-sm lg:hidden"
            >
              {card}
            </div>,
            document.body
          )}
      </div>
    </section>
  );
}
