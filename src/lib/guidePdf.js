// Személyre szabott AI-útmutató: a kész alap-PDF-be (npm run utmutato) írjuk a látogató szakmáját és városát.
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

const DIR = path.join(process.cwd(), "content/utmutato");
const MIN_SIZE = 7.5;

// A demó már helyesen ragozott kérdést kap („Kit ajánlasz, ha fodrász kell Pécsett?”), a ragozás innen jön.
const QUESTION = /^Kit ajánlasz, ha (.{2,60}) kell (.{2,60})\?$/;

// null: nem felismerhető a kérdés → marad a kész, általános PDF.
export function guideFills(question) {
  const match = typeof question === "string" ? question.trim().match(QUESTION) : null;
  if (!match) return null;
  const [text, industry, city] = match;
  return {
    question: `„${text}”`,
    headline: `„${industry.charAt(0).toUpperCase()}${industry.slice(1)} ${city} – [Neved / Vállalkozásod]”`,
  };
}

// Példányonként egyszer olvassuk be a fájlokat.
let assets;
function loadAssets() {
  assets ??= Promise.all([
    readFile(path.join(DIR, "base.pdf")),
    readFile(path.join(DIR, "fills.json"), "utf8").then(JSON.parse),
  ]).then(([base, slots]) => ({ base, slots }));
  return assets;
}

// A fonts/embed betűtípusok előre szűkítettek (latin + magyar). A pdf-lib saját { subset: true } módja
// ezeknél betűket hagy ki, ezért nem azt használjuk.
const fontBytes = new Map();
function loadFont(weight) {
  if (!fontBytes.has(weight)) fontBytes.set(weight, readFile(path.join(DIR, `fonts/embed/Inter-${weight}.ttf`)));
  return fontBytes.get(weight);
}

// null: a szöveg nem fér el, vagy olyan karaktere van, ami nincs a betűtípusban → általános PDF.
export async function renderGuidePdf(fills) {
  const { base, slots } = await loadAssets();
  const doc = await PDFDocument.load(base);
  doc.registerFontkit(fontkit);
  const pages = doc.getPages();

  for (const [key, text] of Object.entries(fills)) {
    const slot = slots[key];
    const font = await doc.embedFont(await loadFont(slot.weight));
    const glyphs = new Set(font.getCharacterSet());
    if ([...text].some((c) => !glyphs.has(c.codePointAt(0)))) return null;

    const width = font.widthOfTextAtSize(text, slot.size);
    const size = width > slot.maxWidth ? (slot.size * slot.maxWidth) / width : slot.size;
    if (size < MIN_SIZE) return null;

    const page = pages[slot.page];
    page.drawText(text, {
      x: slot.x,
      y: page.getHeight() - slot.y,
      size,
      font,
      color: rgb(...slot.color),
    });
  }
  return doc.save();
}
