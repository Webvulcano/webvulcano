export const site = {
  brand: "Webvulcano",
  // Kanonikus domain (www nélkül) — canonical, sitemap, OG, JSON-LD innen.
  url: "https://webvulcano.hu",
  owner: "Bognár Lehel",
  email: "info@webvulcano.hu",
  phone: "+36 30 904 1618",
  location: "Budapest",
  privacyUrl: "/adatkezeles",
  imprintUrl: "/impresszum",
  // Impresszum + adatkezelési tájékoztató. ⚠️ address: törvény szerint kötelező (Ekertv. 4. §, GDPR 13. cikk) —
  // amíg null, sehol nem jelenik meg. Beírva (pl. székhelyszolgáltató címe) mindkét oldalon látszik.
  legal: {
    name: "Bognár Lehel egyéni vállalkozó",
    address: null,
    // nyilvántartást vezető szerv: NAV (254/2018. (XII. 18.) Korm. rendelet 1. § (1))
    registry: "Nemzeti Adó- és Vámhivatal (egyéni vállalkozók nyilvántartása)",
    registryNo: "57400255",
    taxId: "59380074-1-28",
    vat: "Alanyi adómentes – az árak ÁFA-t nem tartalmaznak, és nem is kerül felszámításra.",
  },
  // Tárhelyszolgáltató (impresszum, Ekertv. 4. § h)). Forrás: vercel.com/legal/privacy-notice (2026-06-01), „Contact Us”.
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, USA",
    email: "privacy@vercel.com",
    web: "vercel.com",
  },
  cta: "Lépjünk kapcsolatba",
  ctaShort: "Kapcsolat",
  ctaHref: "/#kapcsolat",
  socials: [
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/webvulcano" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/webvulcano/" },
    { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/people/WebVulcano/61594139248272/" },
  ],
};

// Abszolút (/#…) linkek: a főoldalon oldalon belüli ugrás, aloldalról visszavisznek.
export const navLinks = [
  { href: "/#munkaim", label: "Munkáim" },
  { href: "/#folyamat", label: "Folyamat" },
  { href: "/#arak", label: "Árak" },
  { href: "/#gyik", label: "GYIK" },
];
