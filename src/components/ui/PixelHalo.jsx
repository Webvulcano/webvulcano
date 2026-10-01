"use client";

import { useEffect, useRef } from "react";

// Kurzor-halo a pixelcsíkos szekcióra: a kurzor körül (HALO_R kocka sugarú kör) halvány kockák,
// a kör széle felé elfogyva. Egyetlen canvas az egész szekción, a PixelFade-csíkok ALATT: a
// csíkok sötét kockái eltakarják, az üres helyeiken átlátszik — így nincs illesztési varrat.
// A kockaháló a szekció bal felső sarkához igazodik; hogy az alsó (alulról számolt) csík hálójával
// is egybeessen, a szekció magasságát a cella többszörösére egészítjük ki (padding-bottom, <cell).
// Csak egérrel, csak mozgásra/görgetésre rajzol; csökkentett mozgásnál nem fut.
const HALO_R = 7; // kockában (~85px)
const HALO_A = 0.22; // a halo legerősebb pontjának átlátszatlansága

export default function PixelHalo({ className = "text-night", cell = 12 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let mx = -1e4;
    let my = -1e4;
    let glow = 0;
    let target = 0;

    const draw = () => {
      ctx.clearRect(0, 0, cols, rows);
      if (glow < 0.01) return;
      const r = canvas.getBoundingClientRect();
      const px = (mx - r.left) / cell;
      const py = (my - r.top) / cell;
      const c0 = Math.max(0, Math.floor(px - HALO_R));
      const c1 = Math.min(cols - 1, Math.ceil(px + HALO_R));
      const r0 = Math.max(0, Math.floor(py - HALO_R));
      const r1 = Math.min(rows - 1, Math.ceil(py + HALO_R));
      for (let row = r0; row <= r1; row++) {
        for (let c = c0; c <= c1; c++) {
          const t = 1 - Math.hypot(c + 0.5 - px, row + 0.5 - py) / HALO_R;
          if (t <= 0) continue;
          ctx.globalAlpha = HALO_A * glow * t * t * (3 - 2 * t); // smoothstep: lágy szél
          ctx.fillRect(c, row, 1, 1);
        }
      }
    };

    const frame = () => {
      raf = 0;
      if (glow !== target) {
        glow += (target - glow) * 0.12;
        if (Math.abs(target - glow) < 0.005) glow = target;
      }
      draw();
      if (glow !== target) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const section = canvas.parentElement;
    const size = () => {
      // magasság → a cella többszöröse (a kiegészítés nélküli magasságból számolva)
      const pad = parseFloat(section.style.paddingBottom) || 0;
      const base = section.getBoundingClientRect().height - pad;
      const next = Math.ceil(base / cell - 0.001) * cell - base;
      if (Math.abs(next - pad) > 0.01) section.style.paddingBottom = `${next}px`;
      const r = canvas.getBoundingClientRect();
      cols = Math.ceil(r.width / cell);
      rows = Math.ceil(r.height / cell);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr * cell, 0, 0, dpr * cell, 0, 0); // 1 egység = 1 kocka
      ctx.fillStyle = getComputedStyle(canvas).color;
      draw();
    };

    const onPointer = (e) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      const r = canvas.getBoundingClientRect();
      const pad = HALO_R * cell;
      target =
        mx > r.left - pad && mx < r.right + pad && my > r.top - pad && my < r.bottom + pad ? 1 : 0;
      kick();
    };

    const ro = new ResizeObserver(size);
    ro.observe(section);
    const io = new IntersectionObserver(([entry]) => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", kick);
      if (!entry.isIntersecting) return;
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", kick, { passive: true });
    });
    io.observe(canvas);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", kick);
      cancelAnimationFrame(raf);
      section.style.paddingBottom = "";
    };
  }, [cell]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 block size-full ${className}`}
    />
  );
}
