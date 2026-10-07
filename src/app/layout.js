import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import HashLinkScroll from "@/components/ui/HashLinkScroll";
import { theme, themes } from "@/data/theme";

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

export const metadata = {
  title: "Weboldalkészítés Budapesten | Webvulcano – Bognár Lehel",
  description:
    "Egyedi, gyors weboldal budapesti vállalkozásoknak, ami érdeklődőt hoz. Díjmentes vázlat, átlátható ár, mérhető eredmény, 3 hónap ingyen karbantartás.",
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
        <Nav />
        {children}
        <Footer />
        <HashLinkScroll />
      </body>
    </html>
  );
}
