// Strukturált adat (schema.org JSON-LD) — a <JsonLd> komponens rendereli.
import { site } from "@/data/site";

const abs = (path = "/") => new URL(path, site.url).toString();
const businessId = `${site.url}/#business`;

// Oldalankénti metadata: canonical + OG/Twitter ugyanazzal a címmel/leírással.
// Kell minden oldalra, különben az aloldal a főoldal OG-címét örökölné a layoutból.
// title: a layout sablonja („%s | WebVulcano”) teszi mögé a márkanevet.
// Saját openGraph objektum mellett a fájl-alapú opengraph-image nem öröklődik → a képet itt adjuk meg.
const ogImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: `${site.brand} – weboldalkészítés Budapesten, Bognár Lehel`,
};

export function pageMeta({ title, description, path }) {
  const ogTitle = `${title} | ${site.brand}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      type: "website",
      locale: "hu_HU",
      siteName: site.brand,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [ogImage] },
  };
}

// Helyi vállalkozás: összeköti az oldalt a Google Cégprofillal és a közösségi profilokkal.
// Több entitás egy scriptben: @graph (nem nyers tömb — azt egyes parserek, pl. Safari, nem kezelik).
export function graphSchema(...items) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map(({ "@context": _, ...rest }) => rest),
  };
}

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    // Explicit Organization is: sok AI/SEO-crawler csak a literális Organization típust ismeri fel.
    "@type": ["Organization", "ProfessionalService"],
    "@id": businessId,
    name: site.brand,
    legalName: site.legal.name,
    url: site.url,
    logo: abs("/brand/logo.webp"),
    image: abs("/opengraph-image.jpg"),
    description:
      "Egyedi, gyors weboldal budapesti vállalkozásoknak, ami érdeklődőt hoz. Díjmentes vázlat, átlátható ár, mérhető eredmény.",
    email: site.email,
    // E.164 (szóköz nélkül): +36309041618
    telephone: site.phone.replace(/\s/g, ""),
    priceRange: "120 000–450 000 Ft",
    address: { "@type": "PostalAddress", addressLocality: site.location, addressCountry: "HU" },
    areaServed: { "@type": "City", name: site.location },
    founder: { "@type": "Person", name: site.owner },
    sameAs: site.socials.map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.brand,
    url: site.url,
    inLanguage: "hu-HU",
    publisher: { "@id": businessId },
  };
}

// Tartalmi aloldal: ki írta, mikor frissült (dateModified: ISO dátum, kézzel karbantartva).
export function webPageSchema({ path, name, description, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: "hu-HU",
    dateModified,
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": businessId },
    author: { "@type": "Person", name: site.owner },
  };
}

// Csomagok árakkal. items: a content.js `pricing` tömbje (offer: { price } | { minPrice } | { maxPrice }, Ft).
export function offerCatalogSchema({ path, name, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${abs(path)}#csomagok`,
    name,
    itemListElement: items.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.text,
      priceCurrency: "HUF",
      ...(p.offer.price
        ? { price: p.offer.price }
        : { priceSpecification: { "@type": "PriceSpecification", priceCurrency: "HUF", ...p.offer } }),
      seller: { "@id": businessId },
    })),
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

// crumbs: [{ name, path }] — a főoldal automatikusan az első elem.
export function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Főoldal", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}
