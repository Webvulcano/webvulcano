"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/ui/Icon";
import { Typewriter, ease, fly, rise, usePhase } from "./stageKit";
import {
  followup,
  inbox,
  leadById,
  newLeadIds,
  notify,
  placeholders,
  template,
} from "@/data/emailDemo";

// Az email-demó „színpadai”: lépésenként egy animált jelenet. Mindegyik a saját idővonalán
// (usePhase) halad, a Notion-tábla változásait onApply(id)-vel jelzi a szülőnek (így a tábla
// az animációval együtt frissül), a végén onDone(). reduced: minden azonnal a végállapotba ugrik.
// A lead-kártya → táblasor és a boríték-repülés motion layoutId-vel megy.

const tones = {
  accent: "bg-accent/20 text-accent",
  highlight: "bg-highlight/20 text-highlight",
  paper: "bg-paper/15 text-paper",
};

export function Monogram({ lead, className = "size-8 text-xs" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg font-bold ${tones[lead.tone]} ${className}`}
    >
      {lead.mono}
    </span>
  );
}

function Envelope({ className = "h-8 w-11" }) {
  return (
    <span
      className={`grid place-items-center rounded-md bg-paper text-night shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] ${className}`}
    >
      <Icon name="mail" className="size-[62%]" strokeWidth={1.8} />
    </span>
  );
}

function Check({ className = "size-7" }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`grid place-items-center rounded-full bg-highlight text-night ${className}`}
    >
      <Icon name="check" className="size-[60%]" strokeWidth={3} />
    </motion.span>
  );
}

function Progress({ value }) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-paper/10">
      <motion.div
        className="h-full rounded-full bg-highlight"
        initial={false}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.6, ease }}
      />
    </div>
  );
}

// ---------- Indítás előtt ----------
export function StageIdle({ typing }) {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <motion.p
          animate={typing ? { opacity: 0.4 } : { y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="text-2xl text-highlight"
          aria-hidden="true"
        >
          ↑
        </motion.p>
        <p className="mt-3 text-sm text-paper/60">
          {typing ? (
            "Claude megkapta a parancsot…"
          ) : (
            <>
              Nyomd meg a <span className="text-paper">Futtatás</span> gombot —
              <br />
              végignézheted, mi történik minden reggel.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ---------- 1. Parancs ----------
const T_COMMAND = [150, 900, 2100];

function StageCommand(props) {
  const phase = usePhase(T_COMMAND, props);
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      {phase >= 1 && (
        <motion.div
          {...rise}
          className="self-end rounded-2xl rounded-br-md bg-accent px-4 py-2.5 font-mono text-sm text-on-accent"
        >
          send daily emails
        </motion.div>
      )}
      {phase >= 2 && (
        <motion.div {...rise} className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-highlight/20 text-highlight">
            <Icon name="bolt" className="size-4" />
          </span>
          <AnimatePresence mode="wait">
            {phase < 3 ? (
              <motion.div
                key="dots"
                exit={{ opacity: 0 }}
                className="flex gap-1.5 rounded-2xl rounded-tl-md bg-paper/10 px-4 py-3.5"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="typing-dot size-1.5 rounded-full bg-paper"
                    style={{ "--d": `${i * 150}ms` }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease }}
                className="w-full max-w-sm origin-top-left rounded-2xl rounded-tl-md border border-paper/10 bg-paper/[0.06] p-4"
              >
                <p className="text-sm text-paper/80">
                  Indítom a napi kört. A mai keret:
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["7", "új email"],
                    ["5", "emlékeztető"],
                  ].map(([n, label], i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.12 }}
                      className="rounded-xl bg-night/60 p-3"
                    >
                      <p className="text-2xl leading-none font-bold text-highlight">
                        {n}
                      </p>
                      <p className="mt-1 text-xs text-paper/60">{label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ---------- 2. Kontaktok a netről ----------
// 1: gépelés · 2: keresés · 3–5: találatok · 6–8: kártyák átrepülnek a Notion-táblába
const T_FETCH = [100, 1000, 1800, 2200, 2600, 3600, 4300, 5000];

function StageFetch({ onApply, ...props }) {
  const phase = usePhase(T_FETCH, {
    ...props,
    onStep: (i) => i >= 5 && onApply(newLeadIds[i - 5]),
  });
  const found = Math.max(0, Math.min(3, phase - 2));
  const saved = Math.max(0, phase - 5);
  const status =
    phase < 2
      ? "Keresés indul…"
      : phase < 5
        ? "Weboldalak átnézése, email címek kigyűjtése…"
        : saved < 3
          ? "Mentés az adatbázisba…"
          : "Mind a 3 bekerült az adatbázisba";

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-3 rounded-full border border-paper/15 bg-night/50 px-4 py-2.5">
        <Icon name="search" className="size-4 shrink-0 text-paper/50" />
        <motion.span
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{
            clipPath: phase >= 1 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          }}
          transition={{ duration: 0.8, ease: "linear" }}
          className="truncate text-sm text-paper"
        >
          villanyszerelő, kertész, szépségszalon · Budapest
        </motion.span>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate text-paper/55">{status}</span>
        <span className="shrink-0 text-highlight tabular-nums">
          {phase >= 6 ? `${saved}/3 mentve` : `${found} találat`}
        </span>
      </div>
      <Progress value={phase < 2 ? 0 : phase < 6 ? 0.15 + found * 0.28 : 1} />

      <div className="mt-1 grid flex-1 grid-cols-3 gap-2 sm:gap-3">
        {newLeadIds.map((id, i) => {
          const lead = leadById[id];
          if (i < saved) {
            return (
              <div
                key={id}
                className="grid place-items-center rounded-xl border border-dashed border-highlight/25 text-xs text-highlight/80"
              >
                Adatbázisban ✓
              </div>
            );
          }
          if (i >= found) {
            return (
              <div
                key={id}
                className={`rounded-xl border border-dashed border-paper/10 ${phase >= 2 ? "demo-shimmer" : ""}`}
              />
            );
          }
          return (
            <motion.div
              key={id}
              layoutId={`lead-${id}`}
              transition={fly}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-paper/15 bg-night-3 p-2.5 sm:p-3"
            >
              <Monogram
                lead={lead}
                className="size-7 text-xs sm:size-8 sm:text-xs"
              />
              <p className="mt-1 text-xs leading-tight font-medium text-paper sm:text-sm">
                {lead.company}
              </p>
              <p className="truncate text-xs text-paper/50">
                {lead.website}
              </p>
              <p className="truncate font-mono text-xs text-highlight/90 sm:text-xs">
                {lead.email}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 3. Sablon kitöltése ----------
// 1: sablon · 2–4: helyőrzők kitöltése · 5–6: következő leadek · 7: kész
const T_TEMPLATE = [200, 1100, 1600, 2100, 3300, 4200, 5000];

function Slot({ k, filled, lead }) {
  return (
    <span className="inline-grid">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={filled ? `${lead.id}-${k}` : "ph"}
          initial={{ opacity: 0, y: "0.5em", filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.5em", filter: "blur(4px)" }}
          transition={{ duration: 0.22 }}
          className={
            filled
              ? "rounded bg-highlight/20 px-1 font-medium text-highlight"
              : "rounded border border-dashed border-paper/35 px-1 font-mono text-[0.85em] text-paper/60"
          }
        >
          {filled ? lead[k] : placeholders[k]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Filled({ parts, filled, lead }) {
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <Slot key={i} k={p.key} filled={filled.includes(p.key)} lead={lead} />
    ),
  );
}

function StageTemplate(props) {
  const phase = usePhase(T_TEMPLATE, props);
  const index = phase >= 6 ? 2 : phase >= 5 ? 1 : 0;
  const lead = leadById[newLeadIds[index]];
  const filled = ["company", "person", "website"].slice(
    0,
    index > 0 ? 3 : Math.max(0, phase - 1),
  );
  const done = (i) =>
    i < index || (i === index && filled.length === 3 && phase >= 4);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2">
        {newLeadIds.map((id, i) => (
          <span
            key={id}
            className={`flex min-w-0 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-xs transition-colors duration-300 ${
              i === index && phase >= 1
                ? "border-highlight/50 bg-highlight/10 text-paper"
                : "border-paper/10 text-paper/50"
            }`}
          >
            <Monogram
              lead={leadById[id]}
              className="size-5 rounded-full text-xs"
            />
            <span className="hidden truncate sm:inline">
              {leadById[id].company.split(" ")[0]}
            </span>
            {done(i) && (
              <Icon
                name="check"
                className="size-3.5 text-highlight"
                strokeWidth={3}
              />
            )}
          </span>
        ))}
        <span className="ml-auto shrink-0 text-xs text-highlight tabular-nums">
          {phase >= 7
            ? "3 egyedi email kész"
            : `${index + (filled.length === 3 ? 1 : 0)}/3`}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 12 }}
        transition={{ duration: 0.45, ease }}
        className="relative flex-1"
      >
        {/* A már kész emailek „kupaca” a kártya mögött */}
        {[1, 2].map((n) => (
          <motion.div
            key={n}
            aria-hidden="true"
            initial={false}
            animate={{
              opacity: index >= n || phase >= 7 ? 1 : 0,
              rotate: n === 1 ? -2.5 : 2.5,
            }}
            className="absolute inset-0 rounded-2xl border border-paper/10 bg-paper/[0.04]"
          />
        ))}
        <div className="relative h-full rounded-2xl border border-paper/15 bg-night-3 p-4 text-sm sm:p-5">
          <div className="flex items-center gap-2 border-b border-paper/10 pb-3 text-xs text-paper/50">
            <span>Címzett:</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={lead.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="font-mono text-paper/80"
              >
                {lead.email}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="mt-3 font-medium leading-relaxed text-paper">
            <Filled parts={template.subject} filled={filled} lead={lead} />
          </p>
          <p className="mt-2 leading-relaxed text-paper/70">
            <Filled parts={template.body} filled={filled} lead={lead} />
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ---------- 4. Kiküldés ----------
// 2/5/7: boríték kirepül · 3/6/8: kézbesítve · 4–5, 6–7 között: szünet (spam-védelem)
const T_SEND = [200, 800, 1700, 2000, 2800, 3700, 4400, 5300];

function StageSend(props) {
  const phase = usePhase(T_SEND, props);
  const sent = phase >= 7 ? 3 : phase >= 5 ? 2 : phase >= 2 ? 1 : 0;
  const delivered = phase >= 8 ? 3 : phase >= 6 ? 2 : phase >= 3 ? 1 : 0;
  const waiting = phase === 4 || phase === 6;

  return (
    <div className="grid h-full grid-cols-[76px_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-24 w-full rounded-2xl border border-paper/15 bg-night/50">
          {newLeadIds.map(
            (id, i) =>
              i >= sent && (
                <motion.div
                  key={id}
                  layoutId={`env-${id}`}
                  transition={fly}
                  className="absolute left-1/2 -ml-[22px]"
                  style={{
                    top: 16 + (2 - i) * 11,
                    zIndex: 3 - i,
                    rotate: (i - 1) * 5,
                  }}
                >
                  <Envelope />
                </motion.div>
              ),
          )}
        </div>
        <p className="text-xs text-paper/55">Kimenő · {3 - sent}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        {newLeadIds.map((id, i) => {
          const lead = leadById[id];
          const ok = i < delivered;
          return (
            <div
              key={id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-500 ${
                ok
                  ? "border-highlight/40 bg-highlight/[0.07]"
                  : "border-paper/10 bg-paper/[0.03]"
              }`}
            >
              <Monogram lead={lead} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-paper">{lead.company}</p>
                <p className="truncate text-xs text-paper/45">
                  {ok ? (
                    "Kézbesítve"
                  ) : (
                    <span className="font-mono">{lead.email}</span>
                  )}
                </p>
              </div>
              <div className="grid h-9 w-11 shrink-0 place-items-center">
                {i < sent && !ok && (
                  <motion.div layoutId={`env-${id}`} transition={fly}>
                    <Envelope className="h-7 w-9" />
                  </motion.div>
                )}
                {ok && <Check />}
              </div>
            </div>
          );
        })}
        <div className="mt-1 flex h-5 items-center justify-between gap-3 text-xs">
          <AnimatePresence>
            {waiting && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="truncate text-paper/55"
              >
                ⏱ Szünet · spam-védelem
              </motion.span>
            )}
          </AnimatePresence>
          <span className="ml-auto shrink-0 text-highlight tabular-nums">
            Elküldve {delivered}/3
          </span>
        </div>
        <Progress value={delivered / 3} />
      </div>
    </div>
  );
}

// ---------- 5. Notion frissítés ----------
// Leadenként: rekord-kártya → státusz vált → dátum lapoz → sor frissül a táblában.
const T_NOTION = [200, 800, 1300, 1700, 2500, 2900, 3600, 4000];
const NOTION_FLIP = [2, 6, 8]; // melyik fázistól frissült az adott lead

function StageNotion({ onApply, ...props }) {
  const phase = usePhase(T_NOTION, {
    ...props,
    onStep: (i) => {
      if (i === 3) onApply("toth");
      if (i === 5) onApply("zoldag");
      if (i === 7) onApply("bella");
    },
  });
  const index = phase >= 7 ? 2 : phase >= 5 ? 1 : 0;
  const lead = leadById[newLeadIds[index]];
  const statusDone = phase >= NOTION_FLIP[index];
  const dateDone = index === 0 ? phase >= 3 : statusDone;
  const count = phase >= 8 ? 3 : phase >= 6 ? 2 : phase >= 4 ? 1 : 0;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-paper/55">Adatbázis · rekord frissítése</span>
        <span className="text-highlight tabular-nums">Frissítve {count}/3</span>
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {phase >= 1 && (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease }}
              className="h-full rounded-2xl border border-paper/15 bg-night-3 p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <Monogram lead={lead} className="size-9 text-xs" />
                <p className="text-base font-medium text-paper">
                  {lead.company}
                </p>
              </div>
              <dl className="mt-4 grid grid-cols-[6.5rem_1fr] items-center gap-x-3 gap-y-3 text-sm">
                <dt className="text-paper/45">Státusz</dt>
                <dd className="h-7">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={statusDone ? "sent" : "new"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusDone
                          ? "bg-paper/15 text-paper"
                          : "bg-paper/10 text-paper/70"
                      }`}
                    >
                      {statusDone ? "Email elküldve" : "Nincs elkezdve"}
                    </motion.span>
                  </AnimatePresence>
                </dd>
                <dt className="text-paper/45">Első email</dt>
                <dd className="text-paper/80">ma</dd>
                <dt className="text-paper/45">Következő</dt>
                <dd className="[perspective:400px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={dateDone ? "next" : "empty"}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex items-baseline gap-1 rounded-lg px-2.5 py-1 ${
                        dateDone
                          ? "bg-accent/15 text-accent"
                          : "bg-paper/[0.06] text-paper/40"
                      }`}
                    >
                      {dateDone ? (
                        <>
                          <strong className="text-base">+3</strong> nap ·
                          emlékeztető
                        </>
                      ) : (
                        "—"
                      )}
                    </motion.span>
                  </AnimatePresence>
                </dd>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------- 6. Válaszok ellenőrzése ----------
// 2–4: szkenner a leveleken · 4: találat (Napfény) · 7: Kovács — nincs válasz
const T_INBOX = [200, 700, 1100, 1500, 2300, 2900, 3300, 3900];
const ROW = 36;

function StageInbox({ onApply, ...props }) {
  const phase = usePhase(T_INBOX, {
    ...props,
    onStep: (i) => {
      if (i === 4) onApply("napfeny");
      if (i === 7) onApply("kovacs");
    },
  });
  const scan = [null, null, 0, 1, 2, 2, 3, 4, null][phase] ?? null;
  const matched = phase >= 4;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-paper/55">Postafiók · beérkezett</span>
        <span className="text-highlight">
          {matched ? "1 válasz leadtől" : "Keresés…"}
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-paper/10 bg-night/40"
      >
        {scan !== null && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 border-y border-highlight/40 bg-highlight/10"
            style={{ height: ROW }}
            initial={false}
            animate={{ y: scan * ROW }}
            transition={{ duration: 0.3, ease }}
          />
        )}
        {inbox.map((m, i) => {
          const hit = m.lead && matched;
          return (
            <div
              key={i}
              className={`relative flex items-center gap-3 px-3 text-sm ${i > 0 ? "border-t border-paper/[0.06]" : ""} ${hit ? "bg-highlight/15" : ""}`}
              style={{ height: ROW }}
            >
              <span
                className={`w-28 shrink-0 truncate sm:w-36 ${hit ? "font-medium text-paper" : "text-paper/60"}`}
              >
                {m.from}
              </span>
              <span
                className={`min-w-0 flex-1 truncate ${hit ? "text-paper/85" : "text-paper/40"}`}
              >
                {m.subject}
              </span>
              {hit && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden shrink-0 rounded-full bg-highlight px-2 py-0.5 text-xs font-bold text-night uppercase sm:inline"
                >
                  Lead!
                </motion.span>
              )}
            </div>
          );
        })}
      </motion.div>
      <AnimatePresence>
        {phase >= 7 && (
          <motion.div
            {...rise}
            className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/[0.07] px-3 py-2 text-sm"
          >
            <span aria-hidden="true">⏰</span>
            <span className="min-w-0 truncate text-paper/80">
              Kovács Autómosó — 3 napja nincs válasz → emlékeztető jön
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- 7. Emlékeztető ----------
// 1: levél · 2: gépel · 3: kirepül · 4: kézbesítve · 5: idővonal
const T_FOLLOWUP = [200, 450, 2700, 3600, 4100];
const followSteps = ["Első email", "1. emlékeztető", "2. emlékeztető", "Leáll"];

function StageFollowup({ onApply, reduced, ...props }) {
  const phase = usePhase(T_FOLLOWUP, {
    ...props,
    reduced,
    onStep: (i) => i === 3 && onApply("kovacs"),
  });
  const lead = leadById.kovacs;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
        <motion.div
          {...rise}
          className="relative rounded-2xl border border-paper/15 bg-night-3 p-4 text-sm"
        >
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-paper/60">{lead.email}</span>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
              1. emlékeztető
            </span>
          </div>
          <p className="mt-3 min-h-[4.5em] leading-relaxed text-paper/80">
            <Typewriter text={followup} start={phase >= 2} reduced={reduced} />
          </p>
          <div className="absolute right-4 bottom-4">
            {phase < 3 && (
              <motion.div layoutId="env-followup" transition={fly}>
                <Envelope className="h-7 w-9" />
              </motion.div>
            )}
          </div>
        </motion.div>

        <div
          className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors duration-500 sm:flex-col sm:justify-center sm:text-center ${
            phase >= 4
              ? "border-highlight/40 bg-highlight/[0.07]"
              : "border-paper/10"
          }`}
        >
          <Monogram lead={lead} className="size-10 text-sm" />
          <p className="flex-1 text-sm text-paper sm:flex-none">
            {lead.company}
          </p>
          <div className="grid h-9 w-11 place-items-center">
            {phase === 3 && (
              <motion.div layoutId="env-followup" transition={fly}>
                <Envelope className="h-7 w-9" />
              </motion.div>
            )}
            {phase >= 4 && <Check />}
          </div>
        </div>
      </div>

      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0.35 }}
        className="grid grid-cols-4 gap-2 text-xs sm:text-xs"
      >
        {followSteps.map((label, i) => {
          const state =
            i === 0 || (i === 1 && phase >= 4)
              ? "done"
              : i === 1
                ? "now"
                : "todo";
          return (
            <li key={label} className="flex flex-col gap-1.5">
              <span
                className={`h-1 rounded-full ${state === "done" ? "bg-highlight" : state === "now" ? "bg-accent" : "bg-paper/15"}`}
              />
              <span
                className={state === "todo" ? "text-paper/45" : "text-paper/80"}
              >
                {label}
                {i === 2 && (
                  <span className="block text-paper/40">4 nap múlva</span>
                )}
              </span>
            </li>
          );
        })}
      </motion.ol>
    </div>
  );
}

// ---------- 8. Érdeklődő ----------
// 1: telefon · 2: értesítés · 3: vázlat gépelése · 4: státusz · 5: összegzés
const T_INTERESTED = [200, 800, 1900, 4700, 5300];

function Toast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-2xl bg-paper/90 p-3 text-night shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)]"
    >
      <p className="flex items-center gap-1.5 text-xs font-medium tracking-label uppercase opacity-60">
        <Icon name="bolt" className="size-3" /> Claude · most
      </p>
      <p className="mt-1 text-xs leading-snug font-bold">{notify.title}</p>
      <p className="mt-0.5 text-xs leading-snug opacity-75">{notify.reply}</p>
    </motion.div>
  );
}

function StageInterested({ onApply, reduced, ...props }) {
  const phase = usePhase(T_INTERESTED, {
    ...props,
    reduced,
    onStep: (i) => i === 3 && onApply("napfeny"),
  });

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-[170px_minmax(0,1fr)]">
        {/* Telefon (sm+) — mobilon csak az értesítés */}
        <motion.div
          {...rise}
          className="relative hidden overflow-hidden rounded-[26px] border-4 border-paper/15 bg-gradient-to-b from-night-3 to-night px-2.5 pt-5 sm:block"
        >
          <p className="text-center text-2xl font-light text-paper/80 tabular-nums">
            9:41
          </p>
          <div className="mt-3">{phase >= 2 && <Toast />}</div>
        </motion.div>
        <div className="sm:hidden">{phase >= 2 && <Toast />}</div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 12 }}
          className="flex flex-col rounded-2xl border border-paper/15 bg-night-3 p-4 text-sm"
        >
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="tracking-label text-paper/50 uppercase">
              Válaszvázlat
            </span>
            <AnimatePresence>
              {phase >= 4 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-highlight px-2 py-0.5 font-medium text-night"
                >
                  Jóváhagyásra vár
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-3 leading-relaxed text-paper/80">
            <Typewriter
              text={notify.draft}
              start={phase >= 3}
              reduced={reduced}
            />
          </p>
        </motion.div>
      </div>

      <div className="hidden min-h-8 shrink-0 flex-wrap items-center gap-2 text-xs sm:flex">
        {phase >= 5 &&
          ["3 új email", "1 emlékeztető", "1 érdeklődő", "kb. 1 perc"].map(
            (t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-full border border-highlight/30 bg-highlight/10 px-2.5 py-1 text-highlight"
              >
                {t}
              </motion.span>
            ),
          )}
      </div>
    </div>
  );
}

export const stages = [
  StageCommand,
  StageFetch,
  StageTemplate,
  StageSend,
  StageNotion,
  StageInbox,
  StageFollowup,
  StageInterested,
];
