// Alap feltételezések a kulcsszó-kalkulátor becsléséhez (óvatos min – max).
// Külön fájl, hogy a kliens ne húzza be a kiszámolt kulcsszólistákat (index.js).
export const defaultAssumptions = {
  leadRate: [0.02, 0.05], // látogató → érdeklődő
  closeRate: [0.2, 0.3], // érdeklődő → ügyfél
};
