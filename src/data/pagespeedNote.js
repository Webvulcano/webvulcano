// „Mennyi látogatót veszítesz?” – nem mérés, hanem iparági becslés a mért LCP-ből.
// Forrás: Google, „The Need for Mobile Speed” (2016): a mobilos látogatók 53%-a elhagyja az oldalt, ha az
// 3 másodpercnél tovább tölt (thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-site-load-time-statistics/).
// Pontos százalékot a látogatóról / az adott oldalról nem lehet mérni, ezért sávos szöveg, nem szám.
// Más, blogokban terjedő számot (pl. „1→5 mp: +90% lelépés”) nem használunk: elsődleges forrásuk nincs.
const GOOD_MS = 2500;
const ABANDON_MS = 3000;

export const speedNoteFoot = "Google kutatása szerint, a 3 másodpercnél lassabban betöltő mobil oldalakra (2016).";

// → { big, text } vagy null, ha az LCP a Google „jó” tartományában van (vagy nincs adat).
// big: a feltűnő, nagy kiírás; text: egyszerű, rövid mondat.
export function speedNote(lcpMs) {
  if (!Number.isFinite(lcpMs) || lcpMs <= GOOD_MS) return null;
  if (lcpMs > ABANDON_MS) {
    return { big: "kb. 50%", text: "Jelenleg a látogatóid fele elhagyja az oldalt, mielőtt az betöltene." };
  }
  // 2,5–3 mp: még nem érvényes az állítás, csak a határra figyelmeztetünk
  return { big: "3 mp", text: "Még épp elfér, de 3 másodperc fölött a látogatóid fele elhagyja az oldalt." };
}

export const lcpOf = (vitals) => vitals?.find((v) => v.id === "largest-contentful-paint")?.ms;
