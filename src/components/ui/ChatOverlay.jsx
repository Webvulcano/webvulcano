"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AiResults from "@/components/ui/AiResults";
import Icon from "@/components/ui/Icon";

// Ennyi px görgetés után tűnik el teljesen a ChatGPT-nézet.
const FADE_DISTANCE = 220;

// Teljes képernyős, ChatGPT-szerű nézet az AI-teszt válaszához. Az oldal alatta
// nem áll meg: görgetésre elhalványul, és ott vagyunk, ahol a látogató volt.
export default function ChatOverlay({ open, onClose, result, state, error, industry, city }) {
  const [fade, setFade] = useState(0);

  useEffect(() => {
    if (!open) return;
    const start = window.scrollY;

    function close() {
      onClose();
      setFade(0);
    }
    function onScroll() {
      const f = Math.min(1, Math.abs(window.scrollY - start) / FADE_DISTANCE);
      if (f >= 1) close();
      else setFade(f);
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Szerveren a result mindig null, így a portal csak kliensen fut.
  if (!result) return null;

  return createPortal(
    <div
      role="dialog"
      aria-label="ChatGPT válasza"
      aria-hidden={!open}
      // Inline opacity csak görgetés közben, különben a starting:-os belépő animáció nem fut.
      style={open && fade > 0 ? { opacity: 1 - fade } : undefined}
      className={`fixed inset-0 z-[70] flex-col bg-[#000] text-paper transition-all transition-discrete duration-300 ease-out starting:opacity-0 starting:scale-[0.98] motion-reduce:starting:scale-100 ${
        open ? "flex opacity-100" : "hidden opacity-0"
      } ${fade > 0.7 ? "pointer-events-none" : ""}`}
    >
      <header className="flex items-center justify-between px-5 py-4 md:px-6">
        <span className="flex items-center gap-1 text-lg font-semibold text-[#fff]">
          ChatGPT
          <svg viewBox="0 0 24 24" className="size-4 text-[#fff]/60" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
        <button
          type="button"
          onClick={() => {
            onClose();
            setFade(0);
          }}
          aria-label="Vissza az oldalra"
          className="grid size-10 place-items-center rounded-full text-[#fff]/70 transition-colors hover:bg-[#fff]/10 hover:text-[#fff]"
        >
          <Icon name="plus" className="size-5 rotate-45" strokeWidth={2} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-5 pt-6 pb-10 md:px-6">
          <div className="flex justify-end">
            <p className="rise max-w-[85%] rounded-3xl bg-[#0c1a86] px-5 py-3 text-base text-[#e3e6ff] md:text-lg">
              {result.question}
            </p>
          </div>

          <div className="mt-8 md:mt-10" aria-live="polite">
            <AiResults
              variant="chat"
              result={result}
              state={state}
              error={error}
              industry={industry}
              city={city}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-[#fff]/15 bg-[#0f0f0f] py-2.5 pr-2.5 pl-5">
          <Icon name="plus" className="size-5 shrink-0 text-[#fff]/50" strokeWidth={1.8} />
          <input
            disabled
            aria-label="Üzenet (letiltva)"
            placeholder="Kérdezd meg a ChatGPT-t"
            className="min-w-0 flex-1 cursor-not-allowed bg-transparent text-base text-[#fff] placeholder:text-[#fff]/45 focus:outline-none"
          />
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[#fff]/50" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#fff]/10 text-[#fff]/40">
            <Icon name="arrow" className="size-4 -rotate-90" strokeWidth={2} />
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
