"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/ui/Icon";

// A demók komponense név szerint (a szerveres page.js függvényt nem adhat át kliensnek).
const demos = {
  email: dynamic(() => import("./EmailDemo")),
  ticket: dynamic(() => import("./TicketDemo")),
  review: dynamic(() => import("./ReviewDemo")),
};

// Kipróbálható demó az aloldalon + teljes képernyős overlay. A főoldalról ?demo=1-gyel érkezve
// az overlay azonnal nyílik, és a demó magától indul (görgetés nélkül minden látszik). Nyitva
// csak az overlay-példány él, hogy ne fusson két idővonal párhuzamosan.
export default function DemoFullscreen({ demo, title }) {
  const Demo = demos[demo];
  const [open, setOpen] = useState(false);
  const openButton = useRef(null);
  const dialog = useRef(null);

  // ?demo=1 csak kliensen olvasható (statikus oldal) — hidratálás után nyit.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "1")
      setOpen(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const close = () => {
    setOpen(false);
    const url = new URL(window.location.href);
    if (url.searchParams.has("demo")) {
      url.searchParams.delete("demo");
      window.history.replaceState(window.history.state, "", url);
    }
    // Bezárás után az oldal tetejére ugrik (a scroll-lock feloldása után); a fókusz görgetés
    // nélkül kerül vissza a gombra.
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      openButton.current?.focus({ preventScroll: true });
    }, 0);
  };

  // Nyitva: az oldal nem görget, Esc bezár, a fókusz a dialógra kerül.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          ref={openButton}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2 text-sm font-medium text-paper/80 transition hover:border-paper/40 hover:text-paper"
        >
          <Icon name="expand" className="size-4" strokeWidth={2} />
          Teljes képernyő
        </button>
      </div>

      {!open && <Demo />}

      {open &&
        createPortal(
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} – demó`}
            tabIndex={-1}
            className="fixed inset-0 z-[100] flex h-dvh flex-col bg-night text-paper outline-none"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-paper/10 px-4 py-3 lg:px-8">
              <p className="min-w-0 flex-1 truncate text-sm font-medium tracking-label uppercase">
                <span className="text-highlight">Demó</span>
                <span className="text-paper/70"> · {title}</span>
              </p>
              <Link
                href="/#kapcsolat"
                className="hidden shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover sm:inline-flex"
              >
                Kérek ilyet
                <Icon name="arrow" className="size-4" strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Demó bezárása"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-paper/15 text-paper/80 transition hover:border-paper/40 hover:text-paper"
              >
                <Icon name="close" className="size-5" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="container-x h-full py-3 lg:py-8">
                <Demo fullscreen autoStart />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
