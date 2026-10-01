"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import Icon from "@/components/ui/Icon";
import { command, statuses, steps, tableAt } from "@/data/emailDemo";
import { Monogram, StageIdle, stages } from "./EmailStages";

// Kipróbálható szimuláció: a látogató „beírja” a parancsot, és lépésenként végigmegy a napi
// email-kör. step = -1: indítás előtt. Minden lépés egy animált színpad (EmailStages.jsx); ha
// a színpad végzett (stepDone), auto-lejátszásnál GAP_MS múlva jön a következő.
// applied: az aktuális lépés Notion-változásai közül a színpad által már alkalmazottak.
const GAP_MS = 1100;
const TYPE_MS = 55;
const pad = (n) => String(n).padStart(2, "0");

export default function EmailDemo() {
  const [step, setStep] = useState(-1);
  const [applied, setApplied] = useState([]);
  const [stepDone, setStepDone] = useState(false);
  const [runId, setRunId] = useState(0); // minden (újra)indításnál új színpad-példány
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState("log"); // alsó panel: "log" vagy "notion" — egyszerre csak egy
  const reduced = !!useReducedMotion();
  const logRef = useRef(null);

  // Új lépésnél a napló jön előre (a színpad apply-ja majd átvált a Notionre).
  const go = (i) => {
    setView("log");
    setStep(i);
    setApplied([]);
    setStepDone(false);
    setRunId((r) => r + 1);
  };

  // Gépelés-animáció, utána indul az 1. lépés.
  useEffect(() => {
    if (!typing) return;
    const finished = typed.length >= command.length;
    const t = setTimeout(
      () => {
        if (finished) {
          setTyping(false);
          go(0);
          setPlaying(true);
        } else {
          setTyped(command.slice(0, typed.length + 1));
        }
      },
      finished ? 350 : TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [typing, typed]);

  // Auto-lejátszás: a színpad végeztével lép tovább.
  useEffect(() => {
    if (!playing || !stepDone || step >= steps.length - 1) return;
    const t = setTimeout(() => go(step + 1), GAP_MS);
    return () => clearTimeout(t);
  }, [playing, stepDone, step]);

  // A napló mindig az utolsó sorra görget (csak a saját dobozán belül).
  useEffect(() => {
    const el = logRef.current;
    if (el)
      el.scrollTo({
        top: el.scrollHeight,
        behavior: reduced ? "auto" : "smooth",
      });
  }, [step, view, reduced]);

  const run = () => {
    if (typing) return;
    if (reduced) {
      setTyped(command);
      go(0);
      setPlaying(true);
      return;
    }
    setTyped("");
    setStep(-1);
    setPlaying(false);
    setTyping(true);
  };

  const jump = (i) => {
    setTyping(false);
    setTyped(command);
    setPlaying(false);
    go(Math.max(0, Math.min(steps.length - 1, i)));
  };

  const reset = () => {
    setPlaying(false);
    setTyping(false);
    setTyped("");
    go(-1);
  };

  // Notion-változásnál a tábla jön előre, hogy a lead-kártya → sor animáció látsszon.
  const apply = (id) => {
    setView("notion");
    setApplied((a) => (a.includes(id) ? a : [...a, id]));
  };
  const finishStep = () => setStepDone(true);

  const started = step >= 0;
  const done = step === steps.length - 1;
  const rows = tableAt(step, stepDone ? null : applied);
  const current = started ? steps[step] : null;
  const Stage = started ? stages[step] : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-14">
        {/* Lépések */}
        <ol className="order-2 lg:order-1">
          {steps.map((s, i) => {
            const active = i === step;
            const past = i < step;
            return (
              <li
                key={s.title}
                className="border-t border-paper/10 last:border-b"
              >
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={active ? "step" : undefined}
                  className="group flex w-full gap-5 py-5 text-left"
                >
                  <span
                    className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-sm font-medium transition-colors ${
                      active
                        ? "border-highlight bg-highlight text-night"
                        : past
                          ? "border-highlight/50 text-highlight"
                          : "border-paper/20 text-paper/60 group-hover:border-paper/50"
                    }`}
                  >
                    {past ? (
                      <Icon name="check" className="size-4" strokeWidth={2.5} />
                    ) : (
                      pad(i + 1)
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-lg font-medium transition-colors ${active ? "text-paper" : "text-paper/70 group-hover:text-paper"}`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <span className="overflow-hidden">
                        <span className="mt-2 block max-w-[46ch] text-base text-paper/65">
                          {s.text}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Élő panel */}
        <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <LayoutGroup>
            <div className="noise overflow-hidden rounded-2xl border border-paper/10 bg-night-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              {/* Fejléc */}
              <div className="flex items-center justify-between gap-4 border-b border-paper/10 px-5 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-paper/20" />
                  <span className="size-2.5 rounded-full bg-paper/20" />
                  <span className="size-2.5 rounded-full bg-paper/20" />
                </div>
                <p className="truncate text-xs font-medium tracking-label text-paper/60 uppercase">
                  {current
                    ? `${pad(step + 1)} / ${pad(steps.length)} · ${current.tag}`
                    : "Claude · demó"}
                </p>
              </div>

              {/* Aktuális lépés — csak mobilon, ahol a lépéslista a panel alatt van */}
              {current && (
                <div
                  key={step}
                  className="demo-line border-b border-paper/10 px-5 py-4 lg:hidden"
                >
                  <p className="font-medium text-paper">{current.title}</p>
                  <p className="mt-1 text-sm text-paper/65">{current.text}</p>
                </div>
              )}

              {/* Parancssor */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run();
                }}
                className="flex items-center gap-3 border-b border-paper/10 px-5 py-3.5"
              >
                <span className="font-mono text-highlight" aria-hidden="true">
                  ›
                </span>
                <input
                  value={typed}
                  readOnly
                  placeholder={command}
                  aria-label="Parancs Claude-nak"
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm text-paper outline-none placeholder:text-paper/35 sm:text-base"
                />
                {typing && (
                  <span
                    className="demo-caret h-5 w-2 bg-paper/70"
                    aria-hidden="true"
                  />
                )}
                <button
                  type="submit"
                  disabled={typing}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  {started ? "Újra" : "Futtatás"}
                  <Icon name="arrow" className="size-4" strokeWidth={2} />
                </button>
              </form>

              {/* Színpad */}
              <div className="relative h-[380px] border-b border-paper/10 px-5 py-5 sm:h-[300px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={started ? runId : "idle"}
                    className="h-full"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {Stage ? (
                      <Stage
                        onApply={apply}
                        onDone={finishStep}
                        reduced={reduced}
                      />
                    ) : (
                      <StageIdle typing={typing} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Alsó panel — napló VAGY Notion-tábla, fülekkel (egymás alatt nem férnek el) */}
              <div
                role="tablist"
                className="flex gap-1 border-b border-paper/10 px-3 pt-2.5"
              >
                {[
                  ["log", "Napló"],
                  ["notion", `Adatbázis · Leadek (${rows.length})`],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={view === id}
                    onClick={() => setView(id)}
                    className={`-mb-px border-b-2 px-2.5 pb-2 text-xs font-medium tracking-label uppercase transition-colors ${
                      view === id
                        ? "border-highlight text-paper"
                        : "border-transparent text-paper/45 hover:text-paper/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {view === "log" ? (
                <div
                  ref={logRef}
                  aria-live="polite"
                  className="h-[15.5rem] overflow-y-auto bg-night/40 px-5 py-3 font-mono text-xs leading-relaxed [mask-image:linear-gradient(to_bottom,transparent,black_1.1rem)]"
                >
                  {!started && (
                    <p className="text-paper/35">$ várakozás a parancsra…</p>
                  )}
                  {steps.slice(0, step + 1).map((s, i) =>
                    s.log.map((line, j) => (
                      <p
                        key={`${i}-${j}`}
                        className={`demo-line whitespace-pre-wrap ${i === step ? "text-paper/85" : "text-paper/35"}`}
                        style={{ "--d": `${j * 180}ms` }}
                      >
                        {line}
                      </p>
                    )),
                  )}
                </div>
              ) : (
                /* Notion-tábla — a sorok layoutId-je egyezik a színpad lead-kártyáiéval */
                <div className="h-[15.5rem] overflow-hidden px-5 py-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_10.5rem] gap-x-3 pb-1.5 text-xs text-paper/40 sm:grid-cols-[minmax(0,1fr)_10.5rem_4.5rem]">
                    <span>Cég</span>
                    <span>Státusz</span>
                    <span className="hidden sm:block">Következő</span>
                  </div>
                  <div className="flex flex-col">
                    {rows.map((r) => (
                      <motion.div
                        key={r.id}
                        layoutId={`lead-${r.id}`}
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 90,
                          damping: 16,
                        }}
                        className={`-mx-2 grid grid-cols-[minmax(0,1fr)_10.5rem] items-center gap-x-3 rounded-lg border-t border-paper/[0.07] px-2 py-1.5 transition-colors duration-700 sm:grid-cols-[minmax(0,1fr)_10.5rem_4.5rem] ${
                          r.changed
                            ? "bg-highlight/[0.09] ring-1 ring-highlight/25 ring-inset"
                            : ""
                        }`}
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex min-w-0 items-center gap-2"
                        >
                          <Monogram lead={r} className="size-6 text-xs" />
                          <span className="truncate text-sm text-paper/85">
                            {r.company}
                          </span>
                        </motion.span>
                        <span className="grid">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={r.status}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.3 }}
                              className={`inline-block justify-self-start rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${statuses[r.status].className}`}
                            >
                              {statuses[r.status].label}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                        <span className="hidden text-sm text-paper/55 sm:block">
                          {r.next}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vezérlés */}
              <div className="flex flex-wrap items-center gap-2 border-t border-paper/10 px-5 py-3 text-sm">
                <button
                  type="button"
                  onClick={() => jump(step - 1)}
                  disabled={step <= 0}
                  className="rounded-full border border-paper/15 px-3.5 py-1.5 text-paper/80 transition hover:border-paper/40 disabled:opacity-35"
                >
                  ← Előző
                </button>
                <button
                  type="button"
                  onClick={() => (started ? jump(step + 1) : run())}
                  disabled={done || typing}
                  className="rounded-full border border-paper/15 px-3.5 py-1.5 text-paper/80 transition hover:border-paper/40 disabled:opacity-35"
                >
                  Következő →
                </button>
                {started && !done && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className="rounded-full px-3.5 py-1.5 text-paper/60 transition hover:text-paper"
                  >
                    {playing ? "❚❚ Szünet" : "▶ Lejátszás"}
                  </button>
                )}
                {started && (
                  <button
                    type="button"
                    onClick={reset}
                    className="ml-auto rounded-full px-3.5 py-1.5 text-paper/50 transition hover:text-paper"
                  >
                    ↺ Alaphelyzet
                  </button>
                )}
              </div>
            </div>
          </LayoutGroup>
        </div>
      </div>
    </MotionConfig>
  );
}
