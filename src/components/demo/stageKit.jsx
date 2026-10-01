"use client";

import { useEffect, useEffectEvent, useState } from "react";

// Közös építőkockák a kipróbálható demók színpadaihoz (EmailStages, TicketStages).

export const ease = [0.22, 1, 0.36, 1];
export const fly = { type: "spring", stiffness: 90, damping: 16 };

// Idővonal: times[i] ms-nál phase = i + 1 (onStep(i)), az utolsó után 700 ms-mal onDone().
// reduced: minden azonnal a végállapotba ugrik.
export function usePhase(times, { onStep, onDone, reduced }) {
  const [phase, setPhase] = useState(0);
  const fire = useEffectEvent((i) => {
    setPhase(i + 1);
    onStep?.(i);
  });
  const finish = useEffectEvent(() => onDone?.());
  useEffect(() => {
    const ids = times.map((ms, i) =>
      setTimeout(() => fire(i), reduced ? 0 : ms),
    );
    ids.push(
      setTimeout(() => finish(), reduced ? 0 : times[times.length - 1] + 700),
    );
    return () => ids.forEach(clearTimeout);
  }, [times, reduced]);
  return phase;
}

// step: hány karakter jelenik meg 28 ms-onként.
export function Typewriter({ text, start, reduced, step = 2 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start || n >= text.length) return;
    const t = setTimeout(
      () => setN(reduced ? text.length : Math.min(text.length, n + step)),
      reduced ? 0 : 28,
    );
    return () => clearTimeout(t);
  }, [start, n, text, reduced, step]);
  return (
    <>
      {text.slice(0, n)}
      {start && n < text.length && (
        <span className="demo-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-paper/70" />
      )}
    </>
  );
}

export const rise = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease },
};
