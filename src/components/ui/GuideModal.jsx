"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

export const guideTitle = "Így ajánljon téged is a ChatGPT";
export const guideSubtitle = "6 lépés, hogy bekerülj a top 3 közé";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper placeholder:text-paper/40 outline-none transition focus:border-accent focus:bg-paper/[0.07]";
const label = "mb-1.5 block text-sm font-medium text-paper/70";

// Útmutató-letöltés: gomb + felugró űrlap (név, e-mail, telefon) → /api/utmutato → PDF.
// Az iparág/város (ha van) a leadhez megy, hogy lásd, mire keresett rá.
export default function GuideModal({ industry = "", city = "", className = "" }) {
  const dialog = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function download(href) {
    const a = document.createElement("a");
    a.href = href;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
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
      const res = await fetch("/api/utmutato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, consent, industry, city }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setUrl(data.url);
      download(data.url);
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div
        className={`flex flex-wrap items-center gap-4 rounded-xl border border-highlight/25 bg-highlight/[0.06] p-4 ${className}`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight/15 text-highlight">
          <Icon name="rocket" className="size-5" strokeWidth={2} />
        </span>
        <p className="min-w-0 flex-1 basis-56 text-base text-paper">
          <span className="block text-sm font-medium tracking-label text-highlight uppercase">Ingyenes útmutató</span>
          <span className="font-bold">{guideTitle}</span>{" "}
          <span className="text-paper/70">– {guideSubtitle}</span>
        </p>
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-2.5 text-base font-medium whitespace-nowrap text-paper transition-colors hover:border-paper/60 hover:bg-paper/5"
        >
          Letöltöm ingyen
          <Icon name="arrow" className="size-4" strokeWidth={2} />
        </button>
      </div>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto w-[min(92vw,460px)] rounded-2xl border border-paper/10 bg-night-2 p-0 text-paper shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
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

          {url ? (
            <div className="py-4 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-highlight/15 text-highlight">
                <Icon name="check" className="size-6" strokeWidth={2.4} />
              </span>
              <h3 className="mt-4 text-xl font-bold">Indul a letöltés!</h3>
              <p className="mt-2 text-base text-paper/70">
                Ha nem indult el magától,{" "}
                <a href={url} download className="text-highlight underline underline-offset-4">
                  kattints ide
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate={false}>
              <p className="text-sm font-medium tracking-label text-highlight uppercase">Ingyenes útmutató</p>
              <h3 className="mt-2 pr-8 text-xl font-bold">{guideTitle}</h3>
              <p className="mt-1 text-base text-paper/70">
                {guideSubtitle}. Add meg az adataidat, és azonnal letöltheted.
              </p>

              <div className="mt-5 space-y-3.5">
                <div>
                  <label htmlFor="g-name" className={label}>Név</label>
                  <input id="g-name" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                </div>
                <div>
                  <label htmlFor="g-email" className={label}>E-mail cím</label>
                  <input id="g-email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                </div>
                <div>
                  <label htmlFor="g-phone" className={label}>Telefonszám</label>
                  <input id="g-phone" type="tel" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+36 30 904 1618" required />
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
                    , és hozzájárulok, hogy az útmutatóval kapcsolatban megkeress.
                  </span>
                </label>
              </div>

              {error && <p className="mt-3 text-sm text-danger">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="glow-accent mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {sending ? "Küldés…" : "Kérem az útmutatót"}
                {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
              </button>
              <p className="mt-3 text-center text-sm text-paper/45">Nem küldök spamet.</p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
