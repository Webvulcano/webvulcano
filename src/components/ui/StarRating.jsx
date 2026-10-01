"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

const GOOGLE_REVIEW_URL = "https://g.page/r/CW-m9UHrgxbNECE/review";

const input =
  "w-full rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper placeholder:text-paper/40 outline-none transition focus:border-accent focus:bg-paper/[0.07]";

// Értékelő: 4–5 csillag → Google-értékelés, 1–3 csillag → privát visszajelzés (/api/review → Airtable).
export default function StarRating() {
  const [rated, setRated] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function pick(stars) {
    if (stars >= 4) {
      window.location.assign(GOOGLE_REVIEW_URL);
      return;
    }
    setRated(stars);
  }

  async function submit(e) {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Kérlek, írj pár szót, mit tehettem volna jobban.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars: rated, comment }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Hiba történt, próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-[60ch]" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-highlight/15 text-highlight">
          <Icon name="check" className="size-7" strokeWidth={2.4} />
        </span>
        <h1 className="mt-8 type-h2 font-bold">Köszönöm az őszinte visszajelzést.</h1>
        <div className="mt-6 space-y-4 type-lead text-paper/70">
          <p>A célom, hogy emberközeli, átlátható és megbízható szolgáltatást nyújtsak.</p>
          <p>
            Nagyon sajnálom, hogy ez most nem sikerült. Köszönöm, hogy engem választottál – minden
            erőmmel azon leszek, hogy tanuljak belőle, és a lehető legjobb szolgáltatást nyújtsam.
          </p>
          <p className="font-serif text-paper/85 italic">
            Üdvözlettel,
            <br />
            {site.owner} – Webvulcano
          </p>
        </div>
      </div>
    );
  }

  const shown = hovered ?? rated ?? 0;

  return (
    <div className="max-w-[60ch]">
      <p className="text-sm font-medium tracking-eyebrow text-highlight uppercase">Értékelés</p>
      <h1 className="mt-4 type-h2 font-bold">Mennyire voltál elégedett?</h1>
      <p className="mt-4 type-lead text-paper/70">
        Add meg őszintén, hány csillagot érdemel a munkám.
      </p>

      <div className="mt-10 flex gap-2" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} csillag`}
            aria-pressed={rated === n}
            onMouseEnter={() => setHovered(n)}
            onFocus={() => setHovered(n)}
            onBlur={() => setHovered(null)}
            onClick={() => pick(n)}
            className={`text-5xl leading-none transition duration-200 ${
              n <= shown ? "scale-110 text-highlight" : "text-paper/20 hover:text-paper/40"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {rated !== null && (
        <form onSubmit={submit} className="mt-10 max-w-[560px]">
          <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium text-paper/70">
            Mit tehettem volna jobban?
          </label>
          <textarea
            id="review-comment"
            className={`${input} min-h-[120px] resize-y`}
            placeholder="Írd le röviden, mi volt a probléma…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            disabled={sending}
            className="glow-accent mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {sending ? "Küldés…" : "Elküldöm"}
            {!sending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
