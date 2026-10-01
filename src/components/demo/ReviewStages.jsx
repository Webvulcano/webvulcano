"use client";

import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/ui/Icon";
import {
  business,
  days,
  email,
  events,
  recap,
  review,
} from "@/data/reviewDemo";
import { Typewriter, ease, rise, usePhase } from "./stageKit";

// Az értékelés-gyűjtő demó „színpadai”: lépésenként egy animált jelenet a saját idővonalán
// (usePhase). Az ügyféllista változásait onApply(id)-vel jelzik, a végén onDone().

function Stars({ n = 5, className = "size-4" }) {
  return (
    <span className="flex text-[#f5b400]" aria-label={`${n} csillag`}>
      {Array.from({ length: n }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-hidden="true"
        >
          <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z" />
        </svg>
      ))}
    </span>
  );
}

// ---------- Indítás előtt ----------
export function StageIdle() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <motion.p
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="text-2xl text-highlight"
          aria-hidden="true"
        >
          ↑
        </motion.p>
        <p className="mt-3 text-sm text-paper/60">
          Nyomd meg a <span className="text-paper">Futtatás</span> gombot —
          <br />
          így lesz egy lezárt munkából Google-értékelés.
        </p>
      </div>
    </div>
  );
}

// ---------- 1. Naptár ----------
const T_CAL = [200, 900, 2000, 2700];
const HOURS = [8, 17];
const pct = (h) => ((h - HOURS[0]) / (HOURS[1] - HOURS[0])) * 100;

function StageCalendar({ onApply, ...props }) {
  const phase = usePhase(T_CAL, {
    ...props,
    onStep: (i) => i === 3 && onApply("kata"),
  });

  return (
    <div className="flex h-full flex-col gap-3">
      <motion.div {...rise} className="grid min-h-0 flex-1 grid-cols-5 gap-1.5">
        {days.map((d, di) => (
          <div key={d} className="flex min-h-0 flex-col">
            <p
              className={`pb-1 text-center text-xs ${di === 1 ? "font-medium text-highlight" : "text-paper/45"}`}
            >
              {d}
            </p>
            <div className="relative flex-1 rounded-lg bg-night-3/60">
              {events
                .filter((e) => e.day === di)
                .map((e) => {
                  const job = !!e.client;
                  const finished = job && phase >= 2;
                  return (
                    <div
                      key={e.title}
                      className={`absolute inset-x-1 overflow-hidden rounded-md px-1.5 py-1 text-xs leading-tight transition-colors duration-500 sm:text-xs ${
                        finished
                          ? "bg-highlight/20 text-paper ring-1 ring-highlight/60"
                          : job
                            ? "bg-accent/20 text-paper/85"
                            : "bg-paper/10 text-paper/60"
                      }`}
                      style={{
                        top: `${pct(e.from)}%`,
                        height: `${pct(e.to) - pct(e.from)}%`,
                      }}
                    >
                      {e.title}
                      {finished && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-1 flex w-fit items-center gap-0.5 rounded bg-highlight px-1 font-bold text-night"
                        >
                          <Icon
                            name="check"
                            className="size-2.5"
                            strokeWidth={3}
                          />{" "}
                          Kész
                        </motion.span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </motion.div>
      <p
        className={`text-center text-sm text-paper/60 transition-opacity duration-500 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}
      >
        Kedd 16:00 — a munka véget ért. Szabó Kata felkerül a listára.
      </p>
    </div>
  );
}

// ---------- 2. Várakozás ----------
const waitDays = [
  { d: "Kedd", t: "16:00", note: "munka vége" },
  { d: "Szerda", t: "", note: "hagy időt kipróbálni" },
  { d: "Csütörtök", t: "10:00", note: "küldés ideje" },
];
const T_WAIT = [200, 1100, 2000, 2700];

function StageWait({ onApply, ...props }) {
  const phase = usePhase(T_WAIT, {
    ...props,
    onStep: (i) => i === 3 && onApply("kata"),
  });

  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="relative grid grid-cols-3 gap-2">
        <div className="absolute inset-x-[16%] top-5 h-0.5 bg-paper/10">
          <motion.div
            className="h-full bg-highlight"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(phase - 1, 2)) * 50}%` }}
            transition={{ duration: 0.8, ease }}
          />
        </div>
        {waitDays.map((w, i) => {
          const on = phase >= i + 1;
          return (
            <div key={w.d} className="relative text-center">
              <span
                className={`mx-auto grid size-10 place-items-center rounded-full border-2 text-sm font-bold transition-colors duration-500 ${
                  on
                    ? "border-highlight bg-highlight text-night"
                    : "border-paper/20 bg-night-2 text-paper/40"
                }`}
              >
                {i + 1}.
              </span>
              <p
                className={`mt-2 text-sm font-medium ${on ? "text-paper" : "text-paper/40"}`}
              >
                {w.d} {w.t}
              </p>
              <p
                className={`text-xs ${on ? "text-paper/60" : "text-paper/30"}`}
              >
                {w.note}
              </p>
            </div>
          );
        })}
      </div>
      <p
        className={`text-center text-sm text-paper/60 transition-opacity duration-500 ${phase >= 4 ? "opacity-100" : "opacity-0"}`}
      >
        Nem azonnal, nem tolakodóan — amikor még friss az élmény.
      </p>
    </div>
  );
}

// ---------- 3. Email ----------
const T_MAIL = [200, 700, 1200, 1200 + email.body.length * 14 + 400];

function StageEmail({ reduced, ...props }) {
  const phase = usePhase(T_MAIL, { ...props, reduced });

  return (
    <motion.div
      {...rise}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-paper/10 bg-night-3 p-4 text-sm"
    >
      <p className="text-xs text-paper/50">
        Címzett: <span className="text-paper/80">{email.to}</span>
      </p>
      <p
        className={`mt-1.5 border-b border-paper/10 pb-2 font-medium text-paper transition-opacity duration-300 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}
      >
        {email.subject}
      </p>
      <p className="mt-2.5 leading-relaxed text-paper/80">
        <Typewriter text={email.body} start={phase >= 3} reduced={reduced} />
      </p>
      <span
        className={`mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-highlight px-3.5 py-1.5 text-xs font-medium text-night transition-opacity duration-500 ${phase >= 4 ? "opacity-100" : "opacity-0"}`}
      >
        <Stars n={1} className="size-3.5" /> Értékelés a Google-ön
      </span>
    </motion.div>
  );
}

// ---------- 4. Küldés ----------
const sendSteps = ["Elküldve", "Kézbesítve", "Megnyitva", "Linkre kattintott"];
const T_SEND = [200, 1000, 1700, 2600, 3500];

function StageSend({ onApply, ...props }) {
  const phase = usePhase(T_SEND, {
    ...props,
    onStep: (i) => i === 4 && onApply("kata"),
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <motion.span
        initial={{ x: -80, opacity: 0, rotate: -8 }}
        animate={phase >= 1 ? { x: 0, opacity: 1, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="grid h-14 w-20 place-items-center rounded-lg bg-paper text-night shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
      >
        <Icon name="mail" className="size-8" strokeWidth={1.8} />
      </motion.span>
      <ol className="grid w-full max-w-md grid-cols-4 gap-2">
        {sendSteps.map((s, i) => {
          const on = phase >= i + 2;
          return (
            <li key={s} className="text-center">
              <span
                className={`mx-auto block h-1 rounded-full transition-colors duration-500 ${on ? "bg-highlight" : "bg-paper/10"}`}
              />
              <span
                className={`mt-2 block text-xs ${on ? "text-paper" : "text-paper/35"}`}
              >
                {on && "✓ "}
                {s}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------- 5. Google-értékelés ----------
const T_REVIEW = [200, 900, 1700, 2600];

function StageReview({ onApply, reduced, ...props }) {
  const phase = usePhase(T_REVIEW, {
    ...props,
    reduced,
    onStep: (i) => i === 3 && onApply("kata"),
  });
  const s = phase >= 4 ? review.after : review.before;

  return (
    <div className="flex h-full flex-col gap-3">
      <motion.div
        {...rise}
        className="flex items-center gap-3 rounded-xl border border-paper/10 bg-night-3 px-4 py-3"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-lg font-bold text-night">
          G
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-paper">
            {business.name}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-paper/60">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={s.rating}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={phase >= 4 ? "font-bold text-highlight" : ""}
              >
                {s.rating}
              </motion.span>
            </AnimatePresence>
            <Stars className="size-3" />
            <span className="tabular-nums">({s.count})</span>
          </span>
        </span>
      </motion.div>

      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="rounded-xl border border-highlight/30 bg-highlight/[0.06] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-paper">
                {review.name}
              </span>
              <span className="rounded-full bg-highlight px-2 py-0.5 text-xs font-bold text-night uppercase">
                Új
              </span>
            </div>
            <div className="mt-1">
              <Stars />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-paper/80">
              <Typewriter
                text={review.text}
                start={phase >= 3}
                reduced={reduced}
                step={3}
              />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- 6. Eredmény ----------
const T_RECAP = [200, 900, 1500, 2300];

function StageRecap(props) {
  const phase = usePhase(T_RECAP, props);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid min-h-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-3">
        <motion.div
          {...rise}
          className="rounded-xl border border-paper/10 bg-night-3/60 px-4 py-3"
        >
          <p className="text-xs tracking-label text-paper/45 uppercase">
            Előtte
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-paper/55">
            <li>– „majd megkérem…” — és elmarad</li>
            <li>– kínos utánaírni</li>
            <li>– havonta 1–2 értékelés, ha szerencséd van</li>
          </ul>
        </motion.div>
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.6 }}
          className="hidden self-center text-xl text-highlight sm:block"
          aria-hidden="true"
        >
          →
        </motion.span>
        <div
          className={`rounded-xl border border-highlight/30 bg-highlight/[0.05] px-4 py-3 transition-opacity duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-xs tracking-label text-highlight uppercase">
            Utána
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-paper/90">
            <li>✓ minden munka után kimegy a kérés</li>
            <li>✓ a te hangodon, a megfelelő napon</li>
            <li className="flex items-center gap-1.5">
              ✓ <Stars className="size-3.5" /> gyűlnek maguktól
            </li>
          </ul>
        </div>
      </div>
      <div className="flex min-h-7 shrink-0 flex-wrap gap-1.5 sm:gap-2">
        {phase >= 3 &&
          recap.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-full border border-highlight/30 bg-highlight/10 px-2 py-0.5 text-xs text-highlight sm:px-2.5 sm:py-1 sm:text-xs"
            >
              {t}
            </motion.span>
          ))}
      </div>
    </div>
  );
}

export const stages = [
  StageCalendar,
  StageWait,
  StageEmail,
  StageSend,
  StageReview,
  StageRecap,
];
