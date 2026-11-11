// PageSpeed-összefoglaló PDF: a látogató saját mérési eredményéből készül (max. 5 oldal).
// Szerveroldali modul; betűtípus: content/pagespeed-pdf/fonts (Inter TTF, latin + magyar), a pdf-lib + fontkit rajzolja.
// Fontos: a pdf-lib a fájlt nyersen ágyazza be, ezért TTF kell (a WOFF nem érvényes a PDF-ben).
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import { lcpOf, speedNote, speedNoteFoot } from "@/data/pagespeedNote";
import { site } from "@/data/site";
import { TOP_ISSUES, buildIssue } from "@/lib/pagespeed";

const W = 595.28;
const H = 841.89;
const M = 46;
const CW = W - 2 * M;
const FOOT = 40; // lábléc magassága

const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const C = {
  ink: hex("#2e3033"),
  body: hex("#4a4d51"),
  muted: hex("#7c8085"),
  teal: hex("#1e7c85"),
  teal2: hex("#2bb3c0"),
  cream: hex("#fbf7f2"),
  line: hex("#e6e1da"),
  white: hex("#ffffff"),
  good: hex("#1e7c85"),
  mid: hex("#d9a441"),
  bad: hex("#e0714a"),
};
const scoreColor = (v) => (v >= 90 ? C.good : v >= 50 ? C.mid : C.bad);
const vitalColor = (s) => (s >= 0.9 ? C.good : s >= 0.5 ? C.mid : C.bad);

const fontFiles = { regular: "Inter-400.ttf", bold: "Inter-700.ttf" };
let fontBytes;
function loadFonts() {
  fontBytes ??= Promise.all(
    Object.values(fontFiles).map((f) => readFile(path.join(process.cwd(), "content/pagespeed-pdf/fonts", f))),
  );
  return fontBytes;
}

export async function renderSummaryPdf(data) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const [regBytes, boldBytes] = await loadFonts();
  const reg = await doc.embedFont(regBytes);
  const bold = await doc.embedFont(boldBytes);
  const sets = new Map([
    [reg, new Set(reg.getCharacterSet())],
    [bold, new Set(bold.getCharacterSet())],
  ]);
  // a betűtípusban nem szereplő karaktert elhagyjuk, különben a pdf-lib hibát dob
  const safe = (s, font) =>
    [...String(s).replace(/ /g, " ")]
      .filter((ch) => sets.get(font).has(ch.codePointAt(0)))
      .join("");
  const wrap = (s, font, size, width) => {
    const lines = [];
    let line = "";
    for (const word of safe(s, font).split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(next, size) > width) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };

  let page;
  let y;
  const addPage = () => {
    page = doc.addPage([W, H]);
    y = H - M;
  };
  const need = (h) => {
    if (y - h < M + FOOT) addPage();
  };
  const LH = 1.42;
  const draw = (lines, { x = M, size, font = reg, color = C.body }) => {
    for (const line of lines) {
      page.drawText(line, { x, y: y - size, size, font, color });
      y -= size * LH;
    }
  };
  const textHeight = (lines, size) => lines.length * size * LH;

  const host = new URL(data.url).host.replace(/^www\./, "");
  const date = new Date().toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Budapest" });
  const items = data.items.map(buildIssue);
  const top = items.slice(0, TOP_ISSUES);
  const rest = items.slice(TOP_ISSUES);
  const perf = data.scores.find((s) => s.key === "performance")?.value ?? 100;

  // ── 1. oldal: fejléc, pontszámok, összegzés
  addPage();
  page.drawRectangle({ x: 0, y: H - 148, width: W, height: 148, color: C.ink });
  page.drawText("WebVulcano", { x: M, y: H - 40, size: 11, font: bold, color: C.cream });
  page.drawText("PAGESPEED-ÖSSZEFOGLALÓ", { x: M, y: H - 78, size: 8.5, font: bold, color: C.teal2 });
  page.drawText(safe(host, bold), { x: M, y: H - 108, size: 26, font: bold, color: C.cream });
  page.drawText(safe(`Mobilos eredmény · ${date}`, reg), { x: M, y: H - 129, size: 9.5, font: reg, color: hex("#c9cdd1") });
  y = H - 148 - 20;

  const gap = 10;
  const cardW = (CW - gap * (data.scores.length - 1)) / data.scores.length;
  const cardH = 80;
  data.scores.forEach((s, i) => {
    const x = M + i * (cardW + gap);
    page.drawRectangle({ x, y: y - cardH, width: cardW, height: cardH, color: C.cream, borderColor: C.line, borderWidth: 0.6 });
    page.drawText(String(s.value), { x: x + 12, y: y - 37, size: 28, font: bold, color: scoreColor(s.value) });
    page.drawText(safe(s.label, reg), { x: x + 12, y: y - 54, size: 8.5, font: reg, color: C.muted });
    page.drawRectangle({ x: x + 12, y: y - 68, width: cardW - 24, height: 4, color: C.line });
    page.drawRectangle({ x: x + 12, y: y - 68, width: ((cardW - 24) * s.value) / 100, height: 4, color: scoreColor(s.value) });
  });
  y -= cardH + 14;

  if (data.vitals?.length) {
    const colW = CW / data.vitals.length;
    data.vitals.forEach((v, i) => {
      const x = M + i * colW;
      page.drawText(safe(v.label, reg), { x, y: y - 9, size: 8.5, font: reg, color: C.muted });
      page.drawText(safe(v.value, bold), { x, y: y - 28, size: 15, font: bold, color: vitalColor(v.score) });
    });
    y -= 44;
  }

  const verdict =
    perf >= 90
      ? "Az oldalad mobilon gyors. Az alábbiak finomhangolások, amelyekkel még többet kihozhatsz belőle."
      : perf >= 50
        ? "Az oldalad mobilon közepes sebességű: a látogatók egy része már türelmetlen. Az alábbi javítások érezhetően gyorsítanak rajta."
        : "Az oldalad mobilon lassú. A látogatók jelentős része nem várja meg, hogy betöltsön, ezért itt van a legnagyobb nyereség. Az alábbi tételekkel érdemes kezdeni.";
  y -= 6;
  draw(wrap("Röviden", bold, 15, CW), { size: 15, font: bold, color: C.ink });
  y -= 4;
  draw(wrap(verdict, reg, 10.5, CW), { size: 10.5 });
  const note = speedNote(lcpOf(data.vitals));
  if (note) {
    // feltűnő doboz: nagy szám + magyarázat
    const textLines = wrap(note.text, bold, 12.5, CW - 150);
    const footLines = wrap(speedNoteFoot, reg, 8, CW - 150);
    const boxH = Math.max(60, textHeight(textLines, 12.5) + textHeight(footLines, 8) + 26);
    need(boxH + 14);
    y -= 8;
    page.drawRectangle({ x: M, y: y - boxH, width: CW, height: boxH, color: hex("#fdf0ea"), borderColor: C.bad, borderWidth: 0.9 });
    page.drawText(safe(note.big, bold), { x: M + 14, y: y - boxH / 2 - 9, size: 27, font: bold, color: C.bad });
    const top = y;
    y -= 13;
    draw(textLines, { x: M + 136, size: 12.5, font: bold, color: C.ink });
    draw(footLines, { x: M + 136, size: 8, color: C.muted });
    y = top - boxH - 6;
  }
  y -= 4;
  draw(
    wrap(
      `A teszt összesen ${data.total} javítandó tételt talált. Ebből az ${top.length} legfontosabbat részletesen leírom, hogy mi a gond, és hogyan javíthatod.`,
      reg,
      10.5,
      CW,
    ),
    { size: 10.5 },
  );
  y -= 14;

  // ── a legfontosabb tételek (egy tétel nem törik két oldalra)
  top.forEach((it, i) => {
    const titleLines = wrap(it.title, bold, 13, CW - 34);
    const whyLines = wrap(it.why, reg, 10, CW);
    const steps = it.steps.slice(0, 3).map((st) => wrap(st, reg, 9.5, CW - 26));
    const devLines = it.dev ? wrap(`Add át a fejlesztődnek: ${it.dev}`, reg, 8.5, CW - 20) : [];
    const stepsH = steps.reduce((sum, l) => sum + textHeight(l, 9.5) + 3, 0);
    const h =
      textHeight(titleLines, 13) + (it.savings ? 12 : 0) + 6 + textHeight(whyLines, 10) +
      (steps.length ? 18 + stepsH : 0) + (devLines.length ? textHeight(devLines, 8.5) + 22 : 0) + 22;
    need(h);

    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: C.line });
    y -= 14;
    page.drawCircle({ x: M + 10, y: y - 7, size: 10, color: C.teal });
    const nStr = String(i + 1);
    page.drawText(nStr, { x: M + 10 - bold.widthOfTextAtSize(nStr, 10) / 2, y: y - 10.5, size: 10, font: bold, color: C.white });
    const titleTop = y;
    draw(titleLines, { x: M + 30, size: 13, font: bold, color: C.ink });
    if (it.savings) {
      page.drawText(safe(it.savings, reg), { x: M + 30, y: y - 9, size: 9, font: reg, color: C.teal });
      y -= 12;
    }
    y = Math.min(y, titleTop - 20);
    y -= 6;
    draw(whyLines, { size: 10 });
    if (steps.length) {
      y -= 6;
      page.drawText("ÍGY JAVÍTSD", { x: M, y: y - 8, size: 8, font: bold, color: C.teal });
      y -= 16;
      steps.forEach((lines, n) => {
        page.drawText(`${n + 1}.`, { x: M, y: y - 9.5, size: 9.5, font: bold, color: C.teal });
        draw(lines, { x: M + 16, size: 9.5 });
        y -= 3;
      });
    }
    if (devLines.length) {
      y -= 4;
      const boxH = textHeight(devLines, 8.5) + 12;
      page.drawRectangle({ x: M, y: y - boxH, width: CW, height: boxH, color: C.cream });
      y -= 6;
      draw(devLines, { x: M + 10, size: 8.5, color: C.body });
      y -= 6;
    }
    y -= 14;
  });

  // ── további tételek + következő lépés
  if (rest.length) {
    need(40 + rest.length * 14);
    draw(wrap("További tételek", bold, 13, CW), { size: 13, font: bold, color: C.ink });
    y -= 2;
    draw(wrap("Ezekkel az első öt javítása után érdemes foglalkozni:", reg, 10, CW), { size: 10 });
    y -= 4;
    rest.forEach((it) => {
      page.drawCircle({ x: M + 4, y: y - 6, size: 2, color: C.teal });
      draw(wrap(it.title, reg, 10, CW - 16), { x: M + 14, size: 10, color: C.body });
    });
    y -= 12;
  }

  const nextLines = [
    "Kezdd az 1. tétellel, mert annak van a legnagyobb hatása.",
    `Egy-egy javítás után mérj újra: ${site.url.replace("https://", "")}/pagespeed-teszt`,
    "Ha bármilyen kérdésed felmerülne a javításokkal kapcsolatban, keress bátran!",
  ].map((t) => wrap(t, reg, 10, CW - 50));
  const boxH = 70 + nextLines.reduce((sum, l) => sum + textHeight(l, 10) + 3, 0) + 40;
  need(boxH);
  page.drawRectangle({ x: M, y: y - boxH, width: CW, height: boxH, color: C.ink });
  y -= 18;
  page.drawText("Mi legyen a következő lépés?", { x: M + 20, y: y - 14, size: 14, font: bold, color: C.cream });
  y -= 36;
  nextLines.forEach((lines, n) => {
    page.drawText(`${n + 1}.`, { x: M + 20, y: y - 10, size: 10, font: bold, color: C.teal2 });
    draw(lines, { x: M + 38, size: 10, color: hex("#e8e4dd") });
    y -= 3;
  });
  y -= 6;
  page.drawText(safe(`${site.owner}  ·  ${site.email}  ·  ${site.phone}`, bold), { x: M + 20, y: y - 10, size: 10, font: bold, color: C.cream });

  // ── lábléc minden oldalon
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText(safe(`WebVulcano  ·  PageSpeed-összefoglaló  ·  ${host}`, reg), { x: M, y: 28, size: 8, font: reg, color: C.muted });
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, { x: W - M - reg.widthOfTextAtSize(label, 8), y: 28, size: 8, font: reg, color: C.muted });
  });

  return doc.save();
}
