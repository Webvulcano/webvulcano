// Az AI-útmutató PDF-jeinek előállítása a HTML-sablonból (npm run utmutato, helyi Chrome kell hozzá).
// Kimenet: public/utmutato/*.pdf: az általános, letölthető PDF.
//          content/utmutato/base.pdf + fills.json: üres helyes alap és a helyek adatai a szervernek (src/lib/guidePdf.js).
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DIR = path.join(process.cwd(), "content/utmutato");
const TEMPLATE = path.join(DIR, "chatgpt-ajanlas-utmutato.html");
const PUBLIC_PDF = path.join(process.cwd(), "public/utmutato/chatgpt-ajanlas-utmutato.pdf");
const PDF_OPTIONS = { printBackground: true, preferCSSPageSize: true };
const PX_TO_PT = 0.75;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--allow-file-access-from-files"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 }); // A4, 96 dpi
  await page.emulateMediaType("print");
  await page.goto(pathToFileURL(TEMPLATE).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready.then(() => true));

  await page.pdf({ ...PDF_OPTIONS, path: PUBLIC_PDF });

  // Minden helyhez: oldal, x, alapvonal, elérhető szélesség, betűméret, vastagság, szín.
  const fills = await page.evaluate(() => {
    const pages = [...document.querySelectorAll(".page")];
    const result = {};
    document.querySelectorAll("[data-fill]").forEach((el) => {
      const probe = document.createElement("span");
      probe.style.cssText = "display:inline-block;width:0;height:0";
      el.prepend(probe);
      const baseline = probe.getBoundingClientRect().bottom;
      const left = probe.getBoundingClientRect().left;
      probe.remove();
      const sheet = el.closest(".page");
      const style = getComputedStyle(el);
      const box = el.closest("p, li");
      const boxStyle = getComputedStyle(box);
      result[el.dataset.fill] = {
        page: pages.indexOf(sheet),
        x: left - sheet.getBoundingClientRect().left,
        y: baseline - sheet.getBoundingClientRect().top,
        maxWidth: box.getBoundingClientRect().right - parseFloat(boxStyle.paddingRight) - left,
        size: parseFloat(style.fontSize),
        weight: style.fontWeight,
        color: style.color.match(/[\d.]+/g).slice(0, 3).map((c) => Number(c) / 255),
      };
    });
    return result;
  });
  for (const fill of Object.values(fills)) {
    for (const key of ["x", "y", "maxWidth", "size"]) fill[key] = Number((fill[key] * PX_TO_PT).toFixed(3));
  }
  await writeFile(path.join(DIR, "fills.json"), `${JSON.stringify(fills, null, 2)}\n`);

  await page.addStyleTag({ content: "[data-fill] { visibility: hidden; }" });
  await page.pdf({ ...PDF_OPTIONS, path: path.join(DIR, "base.pdf") });
} finally {
  await browser.close();
}
