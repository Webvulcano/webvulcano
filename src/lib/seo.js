// Strukturált adat (schema.org JSON-LD) — a <JsonLd> komponens rendereli.
import { site } from "@/data/site";

const abs = (path = "/") => new URL(path, site.url).toString();
const businessId = `${site.url}/#business`;

// Oldalankénti metadata: canonical + OG/Twitter ugyanazzal a címmel/leírással.
// Kell minden oldalra, különben az aloldal a főoldal OG-címét örökölné a layoutból.
// title: a layout sablonja („%s | Webvulcano”) teszi mögé a márkanevet.
// Saját openGraph objektum mellett a fájl-alapú opengraph-image nem öröklődik → a képet itt adjuk meg.
const ogImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Webvulcano – weboldalkészítés Budapesten, Bognár Lehel",
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
    "@type": "ProfessionalService",
    "@id": businessId,
    name: site.brand,
    url: site.url,
    logo: abs("/brand/logo.webp"),
    image: abs("/opengraph-image.jpg"),
    description:
      "Egyedi, gyors weboldal budapesti vállalkozásoknak, ami érdeklődőt hoz. Díjmentes vázlat, átlátható ár, mérhető eredmény.",
    email: site.email,
    telephone: site.phone,
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
