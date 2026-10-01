"use client";

import { useEffect, useRef } from "react";

// Kitűzött (sticky), görgetés-vezérelt jelenet. A szekció magas, benne egy képernyőnyi színpad
// tapad; a JS csak a görgetés-haladást (--s, képernyőben) írja minden frame-ben — minden mozgás
// ebből számolódik CSS-ben (globals.css → „Kitűzött görgetés-jelenet”), nincs időzített animáció:
// lassan görgetve lassan, visszafelé visszafelé megy.
//
// steps: küszöbök képernyőben, attól mérve, hogy a szekció teteje eléri a viewport tetejét.
// A [data-story-in] (--k) a k. küszöbnél, a [data-story-out] (--o) az o. küszöbnél indul — a JS
// ezt --t-ként írja rájuk. A 0. küszöb a címkártya helyére úszásáé (--t0).
// length: a kitűzött szakasz hossza képernyőben → a szekció (1 + length) · 100svh magas.
// [data-story-card]: kezdetben a szöveg közepe a színpad közepén áll, cardScale-lel nagyítva
// (címkártya); a szekció felúszása közben homályból előjön, az 1. küszöbtől a helyére úszik. Az odavezető eltolást (--cx/--cy) itt mérjük.
// Csak lg-től és teljes mozgásnál — a CSS ugyanerre a feltételre kapcsol, egyébként normál folyás.
// Megállás nincs: a görgetés mindig natív, az átfedő küszöbök miatt mindig mozog valami.
const QUERY = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

export default function ScrollStory({
  as: Tag = "section",
  steps,
  length,
  cardScale = 1.25,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const key = steps.join(",");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stage = el.firstElementChild;
    const card = el.querySelector("[data-story-card]");
    const thresholds = key.split(",").map(Number);
    const mq = window.matchMedia(QUERY);
    let raf = 0;

    // Minden belépő/kilépő elem megkapja a saját küszöbét (--t), képernyőben.
    const at = (n, name) =>
      thresholds[Number(n.style.getPropertyValue(name)) - 1] ?? 0;
    el.style.setProperty("--t0", String(thresholds[0] ?? 0));
    el.querySelectorAll("[data-story-in]").forEach((n) =>
      n.style.setProperty("--t", at(n, "--k")),
    );
    el.querySelectorAll("[data-story-out]").forEach((n) =>
      n.style.setProperty("--t", at(n, "--o")),
    );

    // Az offset-lánc transform nélküli (layout) helyet ad, így a cím épp futó animációja nem
    // zavarja. A szöveg a dobozánál keskenyebb lehet (tördelés): a sorok tényleges befoglalóját
    // egy Range adja — ez transformált, ezért a doboz mért/valós szélességének arányával
    // (= aktuális skála) visszaosztjuk.
    const measure = () => {
      if (!card || !mq.matches) return;
      let x = 0;
      let y = 0;
      for (let n = card; n && n !== stage; n = n.offsetParent) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      const box = card.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(card);
      const text = range.getBoundingClientRect();
      const s = box.width / card.offsetWidth || 1;
      // a szöveg közepe a doboz közepéhez képest (skála nélkül)
      const dx = (text.left + text.width / 2 - (box.left + box.width / 2)) / s;
      const dy = (text.top + text.height / 2 - (box.top + box.height / 2)) / s;
      const top = parseFloat(getComputedStyle(stage).paddingTop) || 0;
      const cx =
        stage.clientWidth / 2 - (x + card.offsetWidth / 2) - dx * cardScale;
      const cy =
        top +
        (stage.clientHeight - top) / 2 -
        (y + card.offsetHeight / 2) -
        dy * cardScale;
      el.style.setProperty("--cx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--cy", `${cy.toFixed(1)}px`);
    };

    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const s = -el.getBoundingClientRect().top / window.innerHeight;
      el.style.setProperty(
        "--s",
        Math.max(-1, Math.min(s, length + 1)).toFixed(4),
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    onResize();
    document.fonts?.ready.then(onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    if (card) ro.observe(card);
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [key, length, cardScale]);

  return (
    <Tag
      ref={ref}
      data-story
      className={className}
      style={{ "--len": length, "--card-scale": cardScale }}
      {...rest}
    >
      <div data-story-stage>{children}</div>
    </Tag>
  );
}
