import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import HashLinkScroll from "@/components/ui/HashLinkScroll";
import JsonLd from "@/components/ui/JsonLd";
import { site } from "@/data/site";
import { theme, themes } from "@/data/theme";
import { businessSchema, graphSchema, websiteSchema } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  // optikai méret tengely: 32px felett automatikusan a display-vágás (szorosabb, finomabb)
  axes: ["opsz"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  weight: "400",
});

const homeTitle = "Weboldalkészítés Budapesten | Webvulcano – Bognár Lehel";
const homeDescription =
  "Egyedi, gyors weboldal budapesti vállalkozásoknak, ami érdeklődőt hoz. Díjmentes vázlat, átlátható ár, mérhető eredmény, 3 hónap ingyen karbantartás.";

// Alap metadata (főoldal). Aloldalak: pageMeta() a src/lib/seo.js-ből (saját canonical + OG).
export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: homeTitle, template: `%s | ${site.brand}` },
  description: homeDescription,
  applicationName: site.brand,
  authors: [{ name: site.owner, url: site.url }],
  creator: site.owner,
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    type: "website",
    locale: "hu_HU",
    siteName: site.brand,
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription },
  // iOS Safari a telefonszámokat <a>-ba csomagolja hidratálás előtt → hydration mismatch.
  // A kattintható számok explicit tel: linkek.
  formatDetection: { telephone: false, email: false, address: false },
};

// Festés előtt fut: 1) .js osztály (reveal-animációk), 2) ?theme=<név> előnézet
// (csak a src/data/theme.js-ben felsorolt témák közül).
const bootScript = `document.documentElement.classList.add('js');try{var t=new URLSearchParams(location.search).get('theme');if(t&&${JSON.stringify(themes)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="hu"
      data-theme={theme}
      className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal animációk csak JS-sel rejtik el a tartalmat — JS nélkül minden látszik. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <JsonLd data={graphSchema(businessSchema(), websiteSchema())} />
        <Nav />
        {children}
        <Footer />
        <HashLinkScroll />
      </body>
    </html>
  );
}
