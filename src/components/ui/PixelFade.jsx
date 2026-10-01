"use client";

import { useEffect, useRef } from "react";

// Pixeles átmenet két szekció határán: a szín kockákra töredezve fogy el.
// Szabálytalan: seedelt véletlen (determinisztikus → SSR/kliens egyezik), soronként csökkenő
// sűrűséggel. Statikusan (SSR, JS nélkül, csökkentett mozgásnál) egyetlen SVG <path> — a kockák
// vízszintes futamokba vonva. Betöltés után egy canvas veszi át ugyanazzal a mintával, és
// FPS-szel néhány kockát újrasorsol (digitális zaj); a soronkénti sűrűség, így a fogyó forma
// megmarad. Csak akkor fut, ha a csík látszik. A kurzor-halo külön réteg a csík alatt
// (PixelHalo.jsx): az üres helyeken át látszik.
const COLS = 200; // 200 × 12px = 2400px széles, nincs látható ismétlődés
const ROWS = 10;
const FPS = 2;
const FLIPS = 6; // ennyi kockát sorsol újra képkockánként (a 2000-ből)

const density = (r) => Math.pow(1 - (r + 0.5) / ROWS, 1.3); // felül sűrű, alul ritka

function rng(seed) {
  // mulberry32
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGrid(seed) {
  const rand = rng(seed);
  const grid = new Uint8Array(ROWS * COLS);
  for (let r = 0; r < ROWS; r++) {
    const d = density(r);
    for (let c = 0; c < COLS; c++) grid[r * COLS + c] = rand() < d ? 1 : 0;
  }
  return grid;
}

function buildPath(grid) {
  let d = "";
  for (let r = 0; r < ROWS; r++) {
    let run = -1;
    for (let c = 0; c <= COLS; c++) {
      const on = c < COLS && grid[r * COLS + c] === 1;
      if (on && run < 0) run = c;
      if (!on && run >= 0) {
        d += `M${run} ${r}h${c - run}v1h${run - c}z`;
        run = -1;
      }
    }
  }
  return d;
}

const SEED = { top: 7, bottom: 23 };
const PATH = { top: buildPath(buildGrid(SEED.top)), bottom: buildPath(buildGrid(SEED.bottom)) };

// cell: egy kocka mérete px-ben. flip: alulra (a minta felfelé ritkul).
export default function PixelFade({ className = "text-night", cell = 12, flip = false }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const which = flip ? "bottom" : "top";

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !svg || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const grid = buildGrid(SEED[which]);
    const rand = rng(SEED[which] * 7919 + 1); // a zaj saját sorozata
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = COLS * cell * dpr;
    canvas.height = ROWS * cell * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr * cell, dpr * cell); // 1 egység = 1 kocka
    ctx.fillStyle = getComputedStyle(canvas).color;
    for (let i = 0; i < grid.length; i++) if (grid[i]) ctx.fillRect(i % COLS, (i / COLS) | 0, 1, 1);
    // ugyanaz a minta → a csere nem látszik
    canvas.hidden = false;
    svg.style.display = "none";

    let raf = 0;
    let last = 0;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 1000 / FPS) return;
      last = now;
      for (let k = 0; k < FLIPS; k++) {
        const i = (rand() * grid.length) | 0;
        const r = (i / COLS) | 0;
        const on = rand() < density(r) ? 1 : 0;
        if (on === grid[i]) continue;
        grid[i] = on;
        if (on) ctx.fillRect(i % COLS, r, 1, 1);
        else ctx.clearRect(i % COLS, r, 1, 1);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      canvas.hidden = true;
      svg.style.display = "";
    };
  }, [which, cell]);

  const w = COLS * cell;
  const h = ROWS * cell;
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 overflow-hidden ${flip ? "bottom-0" : "top-0"} ${className}`}
      style={{ height: h }}
    >
      <svg
        ref={svgRef}
        width={w}
        height={h}
        viewBox={`0 0 ${COLS} ${ROWS}`}
        shapeRendering="crispEdges"
        className={`block ${flip ? "-scale-y-100" : ""}`}
      >
        <path d={PATH[which]} fill="currentColor" />
      </svg>
      <canvas
        ref={canvasRef}
        hidden
        className={`block ${flip ? "-scale-y-100" : ""}`}
        style={{ width: w, height: h }}
      />
    </div>
  );
}
