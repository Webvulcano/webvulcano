// Mentett ChatGPT-válasz (fodrász, Győr) tesztelésre: AI_MOCK=1 esetén ezt adja
// az /api/ai-ajanlas, így fejlesztés közben nem fogy az OpenAI-keret.
export const aiMockItems = [
  {
    name: "Hajcsapda Fodrászat",
    reason: "Győri fodrászszalon, amely helyi jelenléttel és friss online információval található meg.",
    rating: null,
    reviews: null,
  },
  {
    name: "Fanny's Fodrászat",
    reason: "Győrben működő fodrászat, amely saját weboldallal és helyi szolgáltatási információval rendelkezik.",
    rating: null,
    reviews: null,
  },
  {
    name: "ÁszFodrász Szalon / Haj-Ász Szalon",
    reason: "Győri fodrászszalon, amely hivatalos iskolai dokumentumban is szerepel helyi vállalkozásként.",
    rating: null,
    reviews: null,
  },
];

// Ennyit „gondolkodik” a mock, hogy a gépelő animáció is látszódjon.
export const aiMockDelay = 2500;
