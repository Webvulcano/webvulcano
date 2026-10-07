"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/ui/Icon";
import {
  comments,
  insights,
  recap,
  services,
  serviceNames,
  summary,
  ticketById,
  tickets,
  typeNames,
  types,
} from "@/data/ticketDemo";
import { Typewriter, ease, rise, usePhase } from "./stageKit";

// A ticketing-demó „színpadai”: lépésenként egy animált jelenet a saját idővonalán (usePhase).
// A jegylista változásait onApply(id)-vel jelzik a szülőnek, a végén onDone(). Az utolsó
// színpad a látogató kattintására vár (summarized / onSummarize a szülőtől).

export function TypeChip({ type, className = "" }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${types[type]} ${className}`}
    >
      {type}
    </span>
  );
}

export function ServiceChip({ service, className = "" }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${services[service]} ${className}`}
    >
      {service}
    </span>
  );
}

function Sparkle({ className = "size-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5 13.9 9 20.5 11 13.9 13 12 19.5 10.1 13 3.5 11 10.1 9Z" />
    </svg>
  );
}

// ---------- Indítás előtt ----------
// A Futtatás gomb itt van (nincs külön indítósor a panelen).
export function StageIdle({ onRun }) {
  return (
    <div className="grid h-full place-items-center text-center">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onRun}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          Futtatás
          <Icon name="arrow" className="size-4" strokeWidth={2} />
        </button>
        <p className="mt-4 text-sm text-paper/60">
          Végignézheted, mi történik egy hibajeggyel.
        </p>
      </div>
    </div>
  );
}

// ---------- 1. Beérkezés ----------
const T_ARRIVE = [200, 900, 1600, 2400, 3900]; // az utolsó: a felirat végiggépelődik

function StageArrive({ onApply, reduced, ...props }) {
  const phase = usePhase(T_ARRIVE, {
    ...props,
    reduced,
    onStep: (i) => i < tickets.length && onApply(tickets[i].id),
  });

  return (
    <div className="flex h-full flex-col gap-2.5">
      {tickets.map(
        (t, i) =>
          phase > i && (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease }}
              className="flex items-center gap-3 rounded-xl border border-paper/10 bg-night-3 px-4 py-3"
            >
              <span className="rounded-md bg-highlight px-1.5 py-0.5 text-xs font-bold text-night uppercase">
                Új
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-sm text-paper">
                  „{t.raw}”
                </span>
                <span className="block truncate text-xs text-paper/50">
                  {t.no} · {t.from} · {t.time}
                </span>
              </span>
              <span className="hidden rounded-full border border-dashed border-paper/25 px-2 py-0.5 text-xs text-paper/40 sm:inline">
                kategória: ?
              </span>
            </motion.div>
          ),
      )}
      <p className="mt-auto min-h-[2.5em] text-center text-sm text-paper/55">
        <Typewriter
          text="Címből senki nem tudja megmondani, mi a baj — és kihez tartozik."
          start={phase >= 4}
          reduced={reduced}
        />
      </p>
    </div>
  );
}

// ---------- 2. Az AI elolvassa ----------
const T_READ = [200, 900, 1500, 2100, 2700, 3300, 3900];
const first = tickets[0];
const keyOrder = first.body
  .filter((part) => typeof part !== "string")
  .map((part) => part.key);

function StageRead(props) {
  const phase = usePhase(T_READ, props);
  const reading = phase >= 1 && phase < 7;

  return (
    <div className="grid h-full gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <motion.div
        {...rise}
        className="relative flex flex-col overflow-hidden rounded-xl border border-paper/10 bg-night-3 p-4"
      >
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-paper/50">
            {first.no} · {first.from}
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={reading ? "r" : "d"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                reading
                  ? "bg-paper/10 text-paper/80"
                  : "bg-highlight text-night"
              }`}
            >
              <Sparkle className="size-3" />
              {reading ? "Gemini olvassa…" : "Elolvasva"}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="mt-3 font-mono text-sm text-paper">„{first.raw}”</p>
        <p className="mt-2 text-sm leading-relaxed text-paper/70">
          {first.body.map((part) => {
            if (typeof part === "string") return part;
            const on = phase >= 2 + keyOrder.indexOf(part.key);
            return (
              <mark
                key={part.key}
                className={`rounded px-0.5 transition-colors duration-500 ${
                  on
                    ? "bg-highlight/20 text-highlight"
                    : "bg-transparent text-paper/70"
                }`}
              >
                {part.key}
              </mark>
            );
          })}
        </p>
        {reading && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-highlight/15 to-transparent"
            initial={{ top: "-20%" }}
            animate={{ top: "100%" }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          />
        )}
      </motion.div>

      <div className="flex flex-col justify-center gap-2">
        <p className="text-xs tracking-label text-paper/45 uppercase">
          Amit megértett
        </p>
        {insights.map(
          ([label, value], i) =>
            phase >= 4 + i && (
              <motion.div
                key={label}
                {...rise}
                className="flex items-baseline justify-between gap-3 rounded-lg border border-highlight/20 bg-highlight/[0.06] px-3 py-2 text-sm"
              >
                <span className="text-paper/55">{label}</span>
                <span className="text-right font-medium text-paper">
                  {value}
                </span>
              </motion.div>
            ),
        )}
      </div>
    </div>
  );
}

// ---------- 3. Új cím ----------
const T_RENAME = [200, 900, 1500, 2900];

function StageRename({ onApply, reduced, ...props }) {
  const phase = usePhase(T_RENAME, {
    ...props,
    reduced,
    onStep: (i) => i === 3 && onApply(first.id),
  });

  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <motion.div
        {...rise}
        className="rounded-xl border border-paper/10 bg-night-3 p-4"
      >
        <p className="text-xs tracking-label text-paper/45 uppercase">
          Régi cím
        </p>
        <p
          className={`mt-1.5 font-mono text-base transition-all duration-500 ${
            phase >= 2
              ? "text-paper/35 line-through decoration-danger/70"
              : "text-paper"
          }`}
        >
          „{first.raw}”
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 12 }}
        transition={{ duration: 0.45, ease }}
        className="rounded-xl border border-highlight/30 bg-highlight/[0.06] p-4"
      >
        <p className="flex items-center gap-1.5 text-xs tracking-label text-highlight uppercase">
          <Sparkle className="size-3" /> Új cím · AI
        </p>
        <p className="mt-1.5 min-h-[3rem] text-base font-medium text-paper sm:min-h-0 sm:text-lg">
          <Typewriter text={first.title} start={phase >= 3} reduced={reduced} />
        </p>
      </motion.div>

      <p
        className={`text-center text-sm text-paper/55 transition-opacity duration-500 ${phase >= 4 ? "opacity-100" : "opacity-0"}`}
      >
        ✓ Mentve az Otoboba — a listában már így látszik.
      </p>
    </div>
  );
}

// ---------- 4. Kategorizálás ----------
// Jegyenként 3 fázis: megjelenik (+ új cím, „AI<span className="hidden sm:inline"> kategorizál</span>…”) · eszköztípus · jegytípus (+ onApply).
const T_CAT = tickets.flatMap((_, i) =>
  [200, 1150, 1800].map((ms) => ms + i * 2000),
);

function Options({ names, chosen, chips }) {
  return (
    <span className="flex gap-0.5 sm:gap-1">
      {names.map((n) => {
        const on = chosen === n;
        return (
          <span
            key={n}
            className={`rounded-full px-1.5 py-0.5 text-xs font-medium transition-all duration-300 sm:px-2 sm:text-xs ${
              on
                ? `${chips[n]} scale-105`
                : chosen
                  ? "text-paper/20"
                  : "border border-paper/10 text-paper/40"
            }`}
          >
            {n}
          </span>
        );
      })}
    </span>
  );
}

function StageCategorize({ onApply, ...props }) {
  const phase = usePhase(T_CAT, {
    ...props,
    onStep: (i) => i % 3 === 2 && onApply(tickets[(i - 2) / 3].id),
  });

  return (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {tickets.map((t, i) => {
        const p = phase - i * 3; // ennél a jegynél hol tart
        if (p < 1) return null;
        return (
          <motion.div
            key={t.id}
            {...rise}
            className={`rounded-xl border px-3 py-2 transition-colors duration-500 sm:px-4 sm:py-2.5 ${
              p >= 3
                ? "border-paper/10 bg-night-3"
                : "border-highlight/30 bg-highlight/[0.05]"
            }`}
          >
            <p className="flex min-w-0 items-center gap-2 text-sm">
              <span className="shrink-0 font-mono text-xs text-paper/45">
                {t.no}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium text-paper">
                {t.title}
              </span>
              <AnimatePresence mode="popLayout" initial={false}>
                {p < 3 ? (
                  <motion.span
                    key="busy"
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-paper/10 px-2 py-0.5 text-xs text-paper/80"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.6,
                        ease: "linear",
                      }}
                      className="grid"
                    >
                      <Sparkle className="size-3 text-highlight" />
                    </motion.span>
                    AI kategorizál…
                  </motion.span>
                ) : (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-highlight px-2 py-0.5 text-xs font-medium text-night"
                  >
                    <Sparkle className="size-3" /> AI
                    <span className="hidden sm:inline"> · kész</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2 sm:gap-x-4">
              <Options
                names={typeNames}
                chosen={p >= 2 ? t.type : null}
                chips={types}
              />
              <span
                className="hidden h-3 w-px bg-paper/15 sm:block"
                aria-hidden="true"
              />
              <Options
                names={serviceNames}
                chosen={p >= 3 ? t.service : null}
                chips={services}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------- 5. Hozzászólások ----------
const T_COMMENTS = [
  ...comments.map((_, i) => 250 + i * 380),
  250 + comments.length * 380 + 600,
];
const deep = ticketById.t3;

function Thread({ count, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [count]);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-1.5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_2.5rem)] ${className}`}
    >
      <div className="min-h-8 shrink-0" />
      {comments.slice(0, count).map((c) => (
        <motion.div
          key={`${c.time}-${c.who}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-sm ${
            c.system
              ? "bg-transparent text-xs text-paper/40 italic"
              : "bg-night-3 text-paper/80"
          }`}
        >
          <span
            className={`mr-2 text-xs ${c.system ? "" : "font-medium text-paper/55"}`}
          >
            {c.time} · {c.who}
          </span>
          {c.text}
        </motion.div>
      ))}
    </div>
  );
}

function DeepHeader({ count }) {
  return (
    <div className="flex items-center gap-2 border-b border-paper/10 pb-2.5">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-paper">
          <span className="mr-2 font-mono text-xs text-paper/45">
            {deep.no}
          </span>
          {deep.title}
        </span>
      </span>
      <TypeChip type={deep.type} className="hidden sm:inline" />
      <ServiceChip service={deep.service} className="hidden sm:inline" />
      <motion.span
        key={count}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="shrink-0 rounded-full bg-paper/10 px-2 py-0.5 text-xs text-paper/70 tabular-nums"
      >
        💬 {count}
      </motion.span>
    </div>
  );
}

function StageComments({ onApply, ...props }) {
  const phase = usePhase(T_COMMENTS, {
    ...props,
    onStep: (i) => i === comments.length - 1 && onApply(deep.id),
  });
  const count = Math.min(phase, comments.length);

  return (
    <div className="relative flex h-full flex-col">
      <DeepHeader count={count} />
      <Thread count={count} className="min-h-0 flex-1 pt-1" />
      {/* csattanó: a szál elhomályosul, középen nagy felirat */}
      <AnimatePresence>
        {phase > comments.length && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-0 top-10 grid place-items-center rounded-xl bg-night/75"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="px-4 text-center text-2xl leading-tight font-bold text-paper sm:text-3xl"
            >
              …és ezt most
              <br />
              <span className="text-highlight">ki olvassa végig?</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- 6. Összefoglaló (kattintásra) ----------
// Blokkonként: a gépelés ~28 ms / 2 karakter → a hosszhoz igazított kezdések.
const SUMMARY_STEP = 3; // karakter / 28 ms
const T_SUMMARY = (() => {
  const t = [150];
  for (const s of summary)
    t.push(t[t.length - 1] + 450 + (s.text.length / SUMMARY_STEP) * 28);
  return t;
})();

function SummaryRun({ onApply, reduced, ...props }) {
  const phase = usePhase(T_SUMMARY, {
    ...props,
    reduced,
    onStep: (i) => i === summary.length && onApply(deep.id),
  });
  // A szöveg hosszabb lehet a kártyánál: a doboz a gépeléssel együtt lefelé görget.
  const bodyRef = useRef(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    // minden begépelt karakternél (MutationObserver: renderelési ciklustól független)
    const mo = new MutationObserver(() => {
      el.scrollTop = el.scrollHeight;
    });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-highlight/30 bg-night-3 p-4"
    >
      <p className="flex items-center gap-1.5 text-xs font-medium tracking-label text-highlight uppercase">
        <Sparkle className="size-3.5" /> AI összefoglaló · {deep.no}
        <span className="ml-auto font-normal text-paper/40 normal-case">
          {comments.length} hozzászólásból
        </span>
      </p>
      <div
        ref={bodyRef}
        className="mt-3 min-h-0 flex-1 overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_1rem)] [scrollbar-width:none]"
      >
        <div className="flex flex-col gap-2.5 pt-2">
          {summary.map((s, i) => (
            <div
              key={s.label}
              className={`transition-opacity duration-300 ${phase >= i + 1 ? "opacity-100" : "opacity-0"}`}
            >
              <p className="text-xs font-medium text-paper/50">{s.label}</p>
              <p className="mt-0.5 text-sm leading-snug text-paper/90 sm:text-sm">
                <Typewriter
                  text={s.text}
                  start={phase >= i + 1}
                  reduced={reduced}
                  step={SUMMARY_STEP}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StageSummary({ summarized, onSummarize, ...props }) {
  if (summarized) return <SummaryRun {...props} />;

  return (
    <div className="relative flex h-full flex-col">
      <DeepHeader count={comments.length} />
      <Thread
        count={comments.length}
        className="min-h-0 flex-1 pt-1 opacity-35 blur-[1.5px]"
      />
      <div className="absolute inset-0 top-10 grid place-items-center">
        <div className="text-center">
          <motion.button
            type="button"
            onClick={onSummarize}
            {...rise}
            className="relative inline-flex items-center gap-2 rounded-full bg-highlight px-6 py-3 text-base font-medium text-night shadow-[0_10px_40px_-8px] shadow-highlight/50 transition hover:brightness-110"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full ring-2 ring-highlight"
              animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
            />
            <Sparkle />
            Összefoglaló
          </motion.button>
          <p className="mt-3 text-sm text-paper/60">Nyomd meg — ez a lényeg.</p>
        </div>
      </div>
    </div>
  );
}

// ---------- 7. Eredmény ----------
// Előtte (nyers jegyek) → utána (érthető cím + kategória + összefoglaló), alul összesítő chipek.
// Mobilon (sm alatt) egymás alatt: előtte = áthúzott chip-sor, ↓, utána = 2 soros címek, 2×2 chip.
const T_RECAP = [200, 900, 1300, 1700, 2100, 2700];
const RECAP_EXAMPLES = 2; // ennyi példajegy az előtte/utána összevetésben

function StageRecap(props) {
  const phase = usePhase(T_RECAP, props);
  const examples = tickets.slice(0, RECAP_EXAMPLES);

  return (
    <div className="flex h-full flex-col justify-center gap-3 sm:justify-start">
      <div className="grid gap-2 sm:min-h-0 sm:flex-1 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] sm:gap-3">
        {/* Előtte */}
        <motion.div
          {...rise}
          className="min-w-0 rounded-xl border border-paper/10 bg-night-3/60 px-3 py-2.5"
        >
          <p className="text-xs tracking-label text-paper/45 uppercase">
            Előtte
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5 sm:hidden">
            {examples.map((t) => (
              <span
                key={t.id}
                className="rounded-full border border-paper/10 px-2 py-0.5 font-mono text-xs text-paper/45 line-through decoration-paper/30"
              >
                „{t.raw}”
              </span>
            ))}
          </div>
          <ul className="mt-2 hidden flex-col gap-2 sm:flex">
            {examples.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate font-mono text-paper/50">
                  „{t.raw}”
                </span>
                <span className="shrink-0 rounded-full border border-dashed border-paper/20 px-1.5 text-xs text-paper/35">
                  ?
                </span>
              </li>
            ))}
            <li className="text-xs text-paper/40">
              💬 {comments.length} hozzászólás, végigolvasni
            </li>
          </ul>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.6 }}
          className="justify-self-center text-base leading-none text-highlight sm:self-center sm:text-xl"
          aria-hidden="true"
        >
          <span className="sm:hidden">↓</span>
          <span className="hidden sm:inline">→</span>
        </motion.span>

        {/* Utána */}
        <div
          className={`min-w-0 rounded-xl border border-highlight/30 bg-highlight/[0.05] px-3 py-2.5 transition-opacity duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}
        >
          <p className="flex items-center gap-1.5 text-xs tracking-label text-highlight uppercase">
            <Sparkle className="size-3" /> Utána
          </p>
          <ul className="mt-2 flex flex-col gap-2 sm:gap-1.5">
            {examples.map(
              (t, i) =>
                phase >= 3 + i && (
                  <motion.li
                    key={t.id}
                    {...rise}
                    className="flex items-start gap-2 text-sm sm:items-center"
                  >
                    <span className="line-clamp-2 min-w-0 flex-1 leading-snug text-paper/90 sm:line-clamp-1">
                      {t.title}
                    </span>
                    <TypeChip type={t.type} className="shrink-0 !text-xs" />
                  </motion.li>
                ),
            )}
            {phase >= 5 && (
              <motion.li {...rise} className="text-xs text-highlight">
                ✦ összefoglaló + javaslat a megoldásra
              </motion.li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid min-h-7 shrink-0 grid-cols-2 gap-1.5 text-xs sm:flex sm:flex-wrap sm:gap-2">
        {phase >= 6 &&
          recap.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="grid place-items-center rounded-xl border border-highlight/30 bg-highlight/10 px-2 py-1.5 text-center leading-tight text-highlight sm:rounded-full sm:px-2.5 sm:py-1"
            >
              {t}
            </motion.span>
          ))}
      </div>
    </div>
  );
}

export const stages = [
  StageArrive,
  StageRead,
  StageRename,
  StageCategorize,
  StageComments,
  StageSummary,
  StageRecap,
];
