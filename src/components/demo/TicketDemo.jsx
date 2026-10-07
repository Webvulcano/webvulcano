"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import Icon from "@/components/ui/Icon";
import { steps, tableAt } from "@/data/ticketDemo";
import { ServiceChip, StageIdle, TypeChip, stages } from "./TicketStages";

// Kipróbálható szimuláció: hibajegyek érkeznek, az AI elolvassa, átnevezi, kategorizálja őket,
// végül egy hosszú jegyről összefoglalót készít. step = -1: indítás előtt. Minden lépés egy
// animált színpad (TicketStages.jsx); ha végzett (stepDone), auto-lejátszásnál GAP_MS múlva jön
// a következő. Az összefoglaló-lépés (SUMMARY_STEP) megáll: a gombot a látogató nyomja meg
// (summarized), utána a lejátszás folytatódik az eredmény-összesítéssel.
// applied: az aktuális lépés listaváltozásai közül a színpad által már alkalmazottak.
const GAP_MS = 2600; // szünet két lépés között, hogy a végállapot is olvasható legyen
const pad = (n) => String(n).padStart(2, "0");
const SUMMARY_STEP = steps.length - 2;

// fullscreen: teljes képernyős overlay-elrendezés (DemoFullscreen) — kitölti a magasságot,
// mobilon csak a panel látszik. autoStart: megnyitáskor magától indul.
export default function TicketDemo({ fullscreen = false, autoStart = false }) {
  const [step, setStep] = useState(-1);
  const [applied, setApplied] = useState([]);
  const [stepDone, setStepDone] = useState(false);
  const [runId, setRunId] = useState(0); // minden (újra)indításnál új színpad-példány
  const [playing, setPlaying] = useState(false);
  const [summarized, setSummarized] = useState(false);
  const [view, setView] = useState("log"); // alsó panel: "log" vagy "list" — egyszerre csak egy
  const reduced = !!useReducedMotion();
  const logRef = useRef(null);

  // Új lépésnél a napló jön előre (a színpad apply-ja majd átvált a listára).
  const go = (i) => {
    setView("log");
    setStep(i);
    setApplied([]);
    setStepDone(false);
    setSummarized(false);
    setRunId((r) => r + 1);
  };

  // Auto-lejátszás: a színpad végeztével lép tovább (az utolsó lépésnél nincs hová).
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
  }, [step, view, summarized, reduced]);

  const run = () => {
    go(0);
    setPlaying(true);
  };

  // Teljes képernyős megnyitáskor magától indul (kis szünettel, hogy a belépő animáció lefusson).
  const autoRun = useEffectEvent(run);
  useEffect(() => {
    if (!autoStart) return;
    const t = setTimeout(() => autoRun(), 500);
    return () => clearTimeout(t);
  }, [autoStart]);

  const jump = (i) => {
    setPlaying(false);
    go(Math.max(0, Math.min(steps.length - 1, i)));
  };

  const reset = () => {
    setPlaying(false);
    go(-1);
  };

  // a kattintás után a lejátszás magától megy tovább az eredményre
  const summarize = () => {
    setSummarized(true);
    setPlaying(true);
  };

  // Listaváltozásnál a lista jön előre, hogy látsszon a frissülés.
  const apply = (id) => {
    setView("list");
    setApplied((a) => (a.includes(id) ? a : [...a, id]));
  };
  const finishStep = () => setStepDone(true);

  const started = step >= 0;
  // teljes képernyőn mobilon alacsonyabb, hogy a színpad kiférjen
  const logHeight = fullscreen ? "h-20 lg:h-[13rem]" : "h-[13rem]";
  const done = step === steps.length - 1;
  const waiting = step === SUMMARY_STEP && !summarized; // a látogató kattintására vár
  const rows = tableAt(step, stepDone ? null : applied);
  const current = started ? steps[step] : null;
  // hideLog-os lépésnél (eredmény) az alsó panel becsukódik, a színpad pont ennyivel nő
  // (fülsor ~34 px + napló + vonal) → a panel teljes magassága nem változik, nem ugrál.
  // Nincs indítósor (a Futtatás gomb a kezdő színpadon van) → +4rem a színpadnak.
  const collapsed = !!current?.hideLog;
  const stageHeight = fullscreen
    ? collapsed
      ? "h-[clamp(419px,calc(100dvh-17.8rem),599px)] lg:h-[clamp(547px,calc(100dvh-14.3rem),727px)]"
      : "h-[clamp(304px,calc(100dvh-25rem),484px)] lg:h-[clamp(304px,calc(100dvh-29.5rem),484px)]"
    : collapsed
      ? "h-[687px] sm:h-[607px]"
      : "h-[444px] sm:h-[364px]";
  const Stage = started ? stages[step] : null;
  // az összefoglaló-lépés naplója csak a kattintás után jelenik meg
  const logSteps = steps
    .slice(0, step + 1)
    .map((s, i) =>
      i === SUMMARY_STEP && waiting
        ? { ...s, log: ["● Összefoglalóra vár…"] }
        : s,
    );

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-14 ${fullscreen ? "h-full lg:grid-rows-1" : ""}`}
      >
        {/* Lépések */}
        <ol
          className={
            fullscreen
              ? "hidden max-h-full min-h-0 overflow-y-auto lg:order-1 lg:block lg:self-center"
              : "order-2 lg:order-1"
          }
        >
          {steps.map((s, i) => {
            const active = i === step;
            const past = i < step || (i === step && done);
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
        <div
          className={
            fullscreen
              ? "min-w-0 lg:order-2 lg:self-center"
              : "order-1 min-w-0 lg:order-2 lg:sticky lg:top-24 lg:self-start"
          }
        >
          <LayoutGroup>
            <div className="noise overflow-hidden rounded-2xl border border-paper/10 bg-night-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              {/* Fejléc */}
              <div
                className={`flex items-center justify-between gap-4 border-b border-paper/10 px-5 py-3 ${fullscreen ? "max-lg:hidden" : ""}`}
              >
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-paper/20" />
                  <span className="size-2.5 rounded-full bg-paper/20" />
                  <span className="size-2.5 rounded-full bg-paper/20" />
                </div>
                <p className="truncate text-xs font-medium tracking-label text-paper/60 uppercase">
                  {current
                    ? `${pad(step + 1)} / ${pad(steps.length)} · ${current.tag}`
                    : "Otobo · Gemini · demó"}
                </p>
              </div>

              {/* Aktuális lépés — csak mobilon, ahol a lépéslista a panel alatt van */}
              {current && (
                <div
                  key={step}
                  className="demo-line border-b border-paper/10 px-5 py-4 lg:hidden"
                >
                  <p className="flex items-baseline justify-between gap-3 font-medium text-paper">
                    {current.title}
                    {fullscreen && (
                      <span className="shrink-0 text-xs tracking-label text-paper/50 uppercase">
                        {pad(step + 1)} / {pad(steps.length)}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-paper/65">{current.text}</p>
                </div>
              )}

              {/* Színpad */}
              <div
                className={`relative border-b border-paper/10 px-5 py-5 transition-[height] duration-500 ease-out ${stageHeight}`}
              >
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
                        summarized={summarized}
                        onSummarize={summarize}
                      />
                    ) : (
                      <StageIdle onRun={run} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Összecsukható alsó rész (hideLog-os lépésnél 0 magasság, nem fókuszálható) */}
              <div
                inert={collapsed}
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  {/* Alsó panel — napló VAGY jegylista, fülekkel */}
                  <div
                    role="tablist"
                    className="flex gap-1 border-b border-paper/10 px-3 pt-2.5"
                  >
                    {[
                      ["log", "Napló"],
                      ["list", `Jegyek (${rows.length})`, "Otobo · "],
                    ].map(([id, label, prefix]) => (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={view === id}
                        onClick={() => setView(id)}
                        className={`-mb-px border-b-2 px-2.5 pb-2 text-xs font-medium tracking-label whitespace-nowrap uppercase transition-colors ${
                          view === id
                            ? "border-highlight text-paper"
                            : "border-transparent text-paper/45 hover:text-paper/80"
                        }`}
                      >
                        {prefix && (
                          <span className="hidden sm:inline">{prefix}</span>
                        )}
                        {label}
                      </button>
                    ))}
                  </div>

                  {view === "log" ? (
                    <div
                      ref={logRef}
                      aria-live="polite"
                      className={`${logHeight} overflow-y-auto bg-night/40 px-5 py-3 font-mono text-xs leading-relaxed [mask-image:linear-gradient(to_bottom,transparent,black_1.1rem)]`}
                    >
                      {!started && (
                        <p className="text-paper/35">
                          $ várakozás bejövő jegyekre…
                        </p>
                      )}
                      {logSteps.map((s, i) =>
                        s.log.map((line, j) => (
                          <p
                            key={`${i}-${j}-${line}`}
                            className={`demo-line whitespace-pre-wrap ${i === step ? "text-paper/85" : "text-paper/35"}`}
                            style={{ "--d": `${j * 180}ms` }}
                          >
                            {line}
                          </p>
                        )),
                      )}
                    </div>
                  ) : (
                    <div className={`${logHeight} overflow-hidden px-5 py-3`}>
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 pb-1.5 text-xs text-paper/40">
                        <span>Jegy</span>
                        <span>Kategória</span>
                      </div>
                      <div className="flex flex-col">
                        {rows.map((r) => (
                          <motion.div
                            key={r.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className={`-mx-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg border-t border-paper/[0.07] px-2 py-2 transition-colors duration-700 ${
                              r.changed
                                ? "bg-highlight/[0.09] ring-1 ring-highlight/25 ring-inset"
                                : ""
                            }`}
                          >
                            <span className="min-w-0">
                              <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                  key={r.renamed ? "new" : "raw"}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.3 }}
                                  className={`block truncate text-sm ${r.renamed ? "text-paper/90" : "font-mono text-paper/50"}`}
                                >
                                  {r.renamed ? r.title : `„${r.raw}”`}
                                </motion.span>
                              </AnimatePresence>
                              <span className="flex items-center gap-2 text-xs text-paper/40">
                                {r.no}
                                {r.comments && <span>💬 {r.comments}</span>}
                                {r.summarized && (
                                  <span className="text-highlight">
                                    ✦ összefoglalva
                                  </span>
                                )}
                              </span>
                            </span>
                            <span className="flex gap-1">
                              {r.categorized ? (
                                <>
                                  <TypeChip type={r.type} />
                                  <ServiceChip
                                    service={r.service}
                                    className="hidden sm:inline"
                                  />
                                </>
                              ) : (
                                <span className="rounded-full border border-dashed border-paper/20 px-2 py-0.5 text-xs text-paper/35">
                                  ?
                                </span>
                              )}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vezérlés */}
              <div
                className={`flex flex-wrap items-center gap-2 border-paper/10 px-5 py-3 text-sm ${collapsed ? "" : "border-t"}`}
              >
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
                  onClick={() =>
                    !started ? run() : waiting ? summarize() : jump(step + 1)
                  }
                  disabled={done}
                  className="rounded-full border border-paper/15 px-3.5 py-1.5 text-paper/80 transition hover:border-paper/40 disabled:opacity-35"
                >
                  Következő →
                </button>
                {started && !done && !waiting && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Szünet" : "Lejátszás"}
                    className="rounded-full px-3.5 py-1.5 text-paper/60 transition hover:text-paper"
                  >
                    {playing ? "❚❚" : "▶"}
                    <span className={fullscreen ? "max-sm:hidden" : ""}>
                      {playing ? " Szünet" : " Lejátszás"}
                    </span>
                  </button>
                )}
                {started && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Alaphelyzet"
                    className="ml-auto rounded-full px-3.5 py-1.5 text-paper/50 transition hover:text-paper"
                  >
                    ↺
                    <span className={fullscreen ? "max-sm:hidden" : ""}>
                      {" "}
                      Alaphelyzet
                    </span>
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
