// A PageSpeed-útmutató PDF tartalma (scripts/build-pagespeed-guide.mjs): auditonként
// a csoport, a javítás lépései (vállalkozónak) és egy mondat, amit a webfejlesztőnek lehet továbbítani.
// A címek és a „mi a gond” szövegek a pagespeedAudits.js-ből jönnek.
export const guideGroups = [
  { key: "speed", title: "Sebesség", intro: "Ezeken múlik, mennyit vár a látogató, mielőtt az oldalad megjelenik. Minden másodperc számít: a lassú oldalt sokan be sem várják." },
  { key: "seo", title: "Keresők és megtalálhatóság", intro: "Ezek döntik el, hogy a Google megtalálja-e az oldalad, és hogy a találatod hívogató-e." },
  { key: "access", title: "Használhatóság és akadálymentesség", intro: "Ezek azt döntik el, hogy mindenki tudja-e használni az oldalad: telefonon, napfényben, vagy gyengébb látással is." },
  { key: "trust", title: "Biztonság és megbízhatóság", intro: "Ezek azt döntik el, hogy a látogató bízik-e az oldaladban, és hogy minden működik-e rajta." },
];

export const guides = {
  "render-blocking-resources": {
    group: "speed",
    steps: [
      "Kérj a webfejlesztődtől egy PageSpeed-mérést az oldalra, és kérdezd meg, mely fájlok blokkolják a megjelenítést.",
      "WordPress esetén egy gyorsító bővítménnyel (pl. WP Rocket, Perfmatters) bekapcsolható a „CSS/JS késleltetése”. Kapcsold be, majd nézd át az oldalt, hogy minden jól néz-e ki.",
      "Ellenőrizd újra a PageSpeed-tesztet. Ha valami elromlott, kapcsold ki az utolsó beállítást.",
    ],
    dev: "Kritikus CSS inline, a többi stílus és a nem kritikus JS defer/async vagy dinamikus betöltéssel.",
  },
  "unused-javascript": {
    group: "speed",
    steps: [
      "Nézd át, milyen bővítményeket és külső szkripteket használsz (chat, követők, csúszkák). Ami nem kell, szedd ki.",
      "Kérd meg a fejlesztődet, hogy a nagy JavaScript-csomagot bontsa szét oldalankénti kisebb darabokra.",
      "WordPress esetén a felesleges bővítményeket kapcsold ki, vagy oldalanként tiltsd le (pl. Asset CleanUp).",
    ],
    dev: "Code splitting, tree shaking, a nem használt függőségek eltávolítása; a harmadik fél szkripteket lazy betöltéssel.",
  },
  "unused-css-rules": {
    group: "speed",
    steps: [
      "Ha sok sablon- vagy bővítmény-stílus van az oldalon, kérd meg a fejlesztődet, hogy nézze át, melyik kell valójában.",
      "WordPress esetén a „Nem használt CSS eltávolítása” funkció (pl. WP Rocket, Asset CleanUp) automatikusan elvégzi.",
      "Ha saját készítésű az oldal, a build eszköz (pl. Tailwind, PurgeCSS) kitakarítja a használaton kívüli szabályokat.",
    ],
    dev: "Nem használt CSS eltávolítása (PurgeCSS/Tailwind purge/Critical CSS), oldalanként csak a szükséges stílus betöltése.",
  },
  "unminified-javascript": {
    group: "speed",
    steps: [
      "Kérd meg a fejlesztődet, hogy kapcsolja be a JavaScript összezsugorítását (minify) élesben.",
      "WordPress esetén a gyorsító bővítményekben van „JS minify” kapcsoló. Kapcsold be, és ellenőrizd az oldalt.",
      "Mérd újra a PageSpeed-tesztet. Ha minden működik, kész.",
    ],
    dev: "Production buildben minify (Terser/esbuild); gyorsítótár-bővítménynél a JS minify kapcsoló.",
  },
  "unminified-css": {
    group: "speed",
    steps: [
      "Kérd meg a fejlesztődet, hogy kapcsolja be a CSS összezsugorítását (minify) élesben.",
      "WordPress esetén a gyorsító bővítményekben van „CSS minify” kapcsoló.",
      "Mérd újra a tesztet.",
    ],
    dev: "Production buildben CSS minify (cssnano/Lightning CSS); gyorsítótár-bővítménynél a CSS minify kapcsoló.",
  },
  "uses-optimized-images": {
    group: "speed",
    steps: [
      "Nyisd meg a squoosh.app oldalt, húzd be a képet, és állítsd a minőséget kb. 75–80%-ra. A kép szemmel alig változik, a fájl a töredéke lesz.",
      "Töltsd fel a tömörített képet az oldalra az eredeti helyett.",
      "WordPress esetén egy bővítmény (pl. ShortPixel, Imagify) az összes meglévő képet automatikusan tömöríti.",
      "Célszám: egy átlagos kép ne legyen 200 KB-nál nagyobb, a nagy hero kép se 400 KB fölött.",
    ],
    dev: "Képek tömörítése (kb. q75–80), build- vagy feltöltéskor automatikus optimalizálás (pl. next/image, ShortPixel).",
  },
  "modern-image-formats": {
    group: "speed",
    steps: [
      "A squoosh.app-on válaszd a WebP formátumot, és mentsd el a képet. Ugyanaz a minőség, kisebb fájl.",
      "WordPress esetén a képoptimalizáló bővítményekben van „WebP konvertálás” kapcsoló.",
      "A régi képeket cseréld le az újakra, és ellenőrizd, hogy mindenhol megjelennek-e.",
    ],
    dev: "Képek WebP/AVIF formátumban kiszolgálva, <picture> fallbackkel vagy automatikus formátumválasztással.",
  },
  "uses-responsive-images": {
    group: "speed",
    steps: [
      "Kérd meg a fejlesztődet, hogy a képeket több méretben (pl. 400, 800, 1600 px széles) állítsa elő.",
      "A böngésző automatikusan a kijelzőhöz illőt választja, így a telefon nem tölti le a nagy asztali képet.",
      "WordPress esetén ezt alapból kezeli a rendszer (srcset), ha a sablon a „fő képet” használja, és nem a nyers fájl URL-jét.",
    ],
    dev: "srcset és sizes attribútumok a képeken, megfelelő méretű változatok előállításával.",
  },
  "offscreen-images": {
    group: "speed",
    steps: [
      "Kapcsold be a lusta betöltést (lazy loading): a lejjebb lévő képek csak akkor töltődnek, amikor odagörget a látogató.",
      "WordPress esetén ez alapból be van kapcsolva újabb verzióknál, vagy a gyorsító bővítményekben beállítható.",
      "A képernyő tetején lévő (első) képnél ezt ne használd, mert az késve jelenne meg.",
    ],
    dev: "loading=\"lazy\" a nem látható képekre; az első (LCP) képre loading=\"eager\" és fetchpriority=\"high\".",
  },
  "efficient-animated-content": {
    group: "speed",
    steps: [
      "Keresd meg az oldalon az animált GIF-eket.",
      "Cseréld le őket rövid, hang nélküli videóra (MP4/WebM) vagy animált WebP-re.",
      "Ez a legtöbbször 80–90%-kal kisebb fájlt jelent.",
    ],
    dev: "Animált GIF-ek cseréje <video autoplay muted loop playsinline> elemre (MP4/WebM).",
  },
  "uses-text-compression": {
    group: "speed",
    steps: [
      "Kérdezd meg a tárhelyszolgáltatódat, hogy be van-e kapcsolva a gzip vagy brotli tömörítés.",
      "A legtöbb tárhelyen egy kapcsoló vagy egy bejegyzés a beállításokban. Kérd meg őket, hogy kapcsolják be.",
      "Cloudflare használata esetén ez alapból bekapcsolt.",
    ],
    dev: "gzip/brotli tömörítés a szerveren a szöveges kiszolgáláshoz (HTML, CSS, JS, JSON, SVG).",
  },
  "server-response-time": {
    group: "speed",
    steps: [
      "Kérdezd meg a tárhelyszolgáltatódat, milyen csomagot használsz, és van-e gyorsítótár (cache) bekapcsolva.",
      "WordPress esetén kapcsolj be oldal-gyorsítótárat (pl. WP Rocket, LiteSpeed Cache): az oldalak előre elkészülnek, nem kell minden látogatásnál újra összerakni.",
      "Ha így sem javul, érdemes jobb tárhelyre vagy CDN-re (pl. Cloudflare) váltani.",
    ],
    dev: "Szerveroldali cache, adatbázis- és lekérdezés-optimalizálás, CDN; cél: TTFB 800 ms alatt.",
  },
  "uses-long-cache-ttl": {
    group: "speed",
    steps: [
      "Kérd meg a tárhelyszolgáltatódat vagy a fejlesztődet, hogy a képeket, betűtípusokat és stílusfájlokat 1 évre gyorsítótárazzák.",
      "WordPress esetén a gyorsító bővítmények ezt automatikusan beállítják („Browser caching”).",
      "A fájlok neve változzon, ha tartalmuk megváltozik, így a frissítés nem ütközik a cache-sel.",
    ],
    dev: "Cache-Control: public, max-age=31536000, immutable a verziózott statikus fájlokra.",
  },
  redirects: {
    group: "speed",
    steps: [
      "Írd be az oldalad címét négy változatban (http/https, www-vel és anélkül), és nézd meg, hová visznek. Mindegyiknek egyetlen lépésben a végleges címre kell vinnie.",
      "Ha láncot látsz (A → B → C), kérd meg a fejlesztődet, hogy az A egyenesen a C-re mutasson.",
      "Ellenőrizd a belső linkeket is: mindig a végleges címet használd.",
    ],
    dev: "Átirányítási láncok megszüntetése: minden változat egyetlen 301-gyel a kanonikus https címre; belső linkek a végleges URL-re.",
  },
  "dom-size": {
    group: "speed",
    steps: [
      "Nézd át az oldalt: vannak-e nagyon hosszú listák vagy sok ismétlődő blokk, amik valójában nem kellenek?",
      "Bontsd a hosszú oldalt kisebb oldalakra, vagy a ritkán olvasott részeket csukd össze.",
      "Kérd meg a fejlesztődet, hogy az egymásba ágyazott, felesleges elemeket egyszerűsítse.",
    ],
    dev: "DOM-méret csökkentése: kevesebb egymásba ágyazott elem, virtualizált hosszú listák, lapozás.",
  },
  "font-display": {
    group: "speed",
    steps: [
      "Kérd meg a fejlesztődet, hogy az egyedi betűtípusnál állítsa be: addig mutasson tartalék betűtípust, amíg a végleges betölt.",
      "Ha Google Fontst használsz, az URL végére írd: &display=swap.",
      "Csökkentheted a betűtípus-változatok számát is: ritkán kell 5-6 vastagság.",
    ],
    dev: "font-display: swap (vagy optional) az @font-face szabályokban, kritikus betűtípusok preloadolása.",
  },
  "bootup-time": {
    group: "speed",
    steps: [
      "Szedd ki a feleslegesen betöltött kódokat: elavult követők, régi bővítmények, nem használt csúszkák.",
      "Kérd meg a fejlesztődet, hogy a nagy JavaScript-fájlokat bontsa fel, és a nem azonnal szükséges részeket később töltse be.",
      "Új funkciók előtt kérdezd meg, mennyit lassítanak az oldalon.",
    ],
    dev: "JS-futtatási idő csökkentése: code splitting, lazy betöltés, a nehéz bővítmények és könyvtárak cseréje.",
  },
  "mainthread-work-breakdown": {
    group: "speed",
    steps: [
      "Szedd ki a feleslegesen betöltött külső szkripteket és bővítményeket.",
      "Kérd meg a fejlesztődet, hogy a hosszú, egyben futó műveleteket bontsa kisebb részekre.",
      "Mérd újra a tesztet minden egyes változtatás után, így látod, mi segített.",
    ],
    dev: "Long taskok bontása, nehéz számítások Web Workerbe, kevesebb és késleltetett harmadik fél szkript.",
  },
  "third-party-summary": {
    group: "speed",
    steps: [
      "Írd össze, milyen külső szolgáltatások futnak az oldalon (követőkód, chat, hirdetések, térkép, közösségi gombok).",
      "Töröld azokat, amiket nem használsz vagy nem nézel (pl. régi statisztikák, egy elfelejtett próbaverzió).",
      "A többit kérd meg a fejlesztődet, hogy késleltetve töltse be (pl. csak görgetés vagy kattintás után). A Google Tag Managerben is szabályozható.",
    ],
    dev: "Harmadik fél szkriptek audit, felesleges eltávolítása, a maradék defer/lazy vagy facade mintával (pl. YouTube, chat).",
  },
  "third-party-cookies": {
    group: "speed",
    steps: [
      "Nézd meg a cookie-sávodban vagy a böngésző fejlesztői eszközeiben, mely szolgáltatások tesznek le sütit.",
      "Távolítsd el, amire nincs szükséged (régi hirdetési, követő vagy közösségi beágyazás).",
      "A maradékhoz állíts be megfelelő cookie-sávot, amiben a látogató hozzájárulhat vagy elutasíthat.",
    ],
    dev: "Harmadik fél sütik inventúrája, felesleges szolgáltatások kivétele, hozzájárulás-kezelés (CMP) a maradékhoz.",
  },
  "total-byte-weight": {
    group: "speed",
    steps: [
      "Kezdd a képekkel: tömörítsd őket (lásd a „Túl nehéz képek” részt), mert általában ez teszi ki az oldal méretének nagy részét.",
      "Cseréld le a nagy videókat külső hosztolásra (pl. YouTube), vagy tömörítsd őket.",
      "Töröld a használaton kívüli bővítményeket és letöltött fájlokat.",
    ],
    dev: "Összméret csökkentése: kép- és videótömörítés, felesleges függőségek elhagyása; cél: 1–2 MB alatti kezdőoldal.",
  },
  "lcp-lazy-loaded": {
    group: "speed",
    steps: [
      "Keresd meg az oldal tetején lévő legnagyobb képet. Ennél kapcsold ki a lusta betöltést.",
      "Kérd meg a fejlesztődet, hogy ez a kép kapjon magas prioritást (fetchpriority=\"high\") és előtöltést.",
      "Mérd újra az oldalt. A „Fő tartalom betölt (LCP)” érték javulni fog.",
    ],
    dev: "Az LCP-kép: ne legyen loading=\"lazy\", kapjon fetchpriority=\"high\" és <link rel=\"preload\"> megfelelő sizes-szal.",
  },
  "largest-contentful-paint-element": {
    group: "speed",
    steps: [
      "Nézd meg a PageSpeed-eredményben, mi a legnagyobb elem (általában egy fő kép vagy cím).",
      "Ha kép: tömörítsd, használj megfelelő méretet, és töltsd be elsőként.",
      "Ha szöveg: ellenőrizd, hogy a betűtípus ne késleltesse a megjelenést.",
    ],
    dev: "LCP-elem gyorsítása: megfelelő méret és formátum, preload, a blokkoló erőforrások csökkentése, gyors szerverválasz.",
  },
  "layout-shifts": {
    group: "speed",
    steps: [
      "Töltsd be lassított hálózaton az oldalt (böngésző fejlesztői eszközök → Network → Slow 4G), és figyeld, mi ugrik.",
      "Minden képnek és beágyazott elemnek (videó, térkép, hirdetés) adj meg előre fix méretet vagy képarányt.",
      "A később betöltődő elemek (pl. cookie-sáv, banner) ne tolják le a tartalmat. Foglalj nekik előre helyet.",
    ],
    dev: "CLS csökkentése: width/height vagy aspect-ratio minden médiára, helyfoglalás dinamikus elemeknek, font-display swap size-adjusttal.",
  },
  "unsized-images": {
    group: "speed",
    steps: [
      "Kérd meg a fejlesztődet, hogy minden képnél adja meg a szélességet és a magasságot.",
      "WordPress esetén a legtöbb sablon ezt automatikusan megteszi, ha a képet a médiatárból szúrod be.",
      "Ellenőrizd a tesztben az „Elmozdulás (CLS)” értéket: 0,1 alatt jó.",
    ],
    dev: "width és height attribútumok (vagy aspect-ratio) minden <img>-en.",
  },
  "document-title": {
    group: "seo",
    steps: [
      "Add meg minden oldalnak az egyedi címét. WordPress esetén ezt egy SEO-bővítmény (Yoast, Rank Math) mezőjében tudod.",
      "Írj 50–60 karakteres, beszédes címet: a szolgáltatás, a város és a név szerepeljen benne (pl. „Fogorvos Budapest XI. | Példa Rendelő”).",
      "Minden oldalnak más legyen a címe.",
    ],
    dev: "Egyedi, 50–60 karakteres <title> minden oldalon, a fő kulcsszóval és a márkanévvel.",
  },
  "meta-description": {
    group: "seo",
    steps: [
      "Írj minden fontos oldalhoz 140–160 karakteres leírást: mit kap itt a látogató, és miért érdemes rákattintania.",
      "Építsd bele a szolgáltatást és a várost, és zárd cselekvésre ösztönzéssel (pl. „Kérj időpontot még ma”).",
      "WordPress esetén a SEO-bővítmény leírás-mezőjében add meg.",
    ],
    dev: "Egyedi meta description minden oldalon (140–160 karakter), kulcsszóval és cselekvésre hívással.",
  },
  "link-text": {
    group: "seo",
    steps: [
      "Keresd meg az oldalon az olyan linkeket, mint „Tovább”, „Részletek”, „Kattints ide”.",
      "Írd át őket, hogy önmagukban érthetők legyenek (pl. „Fogfehérítés árai”, „Időpontfoglalás”).",
      "Ez a látogatónak és a Google-nek is segít.",
    ],
    dev: "Leíró linkszövegek a generikus „Tovább/Részletek” helyett; ha a dizájn kényszeríti, aria-label.",
  },
  "crawlable-anchors": {
    group: "seo",
    steps: [
      "Kérd meg a fejlesztődet, hogy a menü és a belső navigáció valódi linkekből (<a href>) álljon, ne csak kattintásra működő gombokból.",
      "Próbáld ki: jobb gomb egy menüpontra, és látod-e a „Link megnyitása új lapon” opciót? Ha nem, nem valódi link.",
      "Ellenőrizd a tesztet újra.",
    ],
    dev: "Navigáció valódi <a href> elemekkel, ne onclick/JS-alapú routing href nélkül.",
  },
  "is-crawlable": {
    group: "seo",
    steps: [
      "Ez sürgős: kérd meg a fejlesztődet, hogy nézze meg, nincs-e az oldalon „noindex” beállítás.",
      "WordPress esetén: Beállítások → Olvasás → ne legyen bejelölve a „Keresőmotorok ne indexeljék az oldalt”.",
      "A javítás után a Google Search Console-ban kérd az oldal újraindexelését.",
    ],
    dev: "A noindex meta/X-Robots-Tag és a robots.txt tiltások eltávolítása az indexelendő oldalakról.",
  },
  "http-status-code": {
    group: "seo",
    steps: [
      "Nyisd meg az oldalt böngészőben: tényleg hibát lát a látogató?",
      "Ha az oldal megszűnt, irányítsd át egy megfelelő új oldalra (301-es átirányítás).",
      "Ha működnie kellene, kérd meg a fejlesztődet vagy a tárhelyedet, hogy nézzék meg a szerver hibanaplóját.",
    ],
    dev: "Az oldal 200-as válasza; megszűnt oldalakra 301 átirányítás, szerverhiba (5xx) javítása.",
  },
  "robots-txt": {
    group: "seo",
    steps: [
      "Nyisd meg a sajátoldal.hu/robots.txt címet. Ha hibaüzenetet vagy furcsa tartalmat látsz, hibás.",
      "Egy egyszerű, működő fájl: „User-agent: *” és „Allow: /”, plusz a sitemap címe.",
      "Kérd meg a fejlesztődet, hogy ellenőrizze, nem tilt-e ki fontos oldalakat.",
    ],
    dev: "Valid robots.txt: ne tiltsa a fontos oldalakat, hivatkozzon a sitemap.xml-re.",
  },
  canonical: {
    group: "seo",
    steps: [
      "Kérd meg a fejlesztődet, hogy minden oldalhoz állítson be kanonikus címet (az oldal saját, végleges címe).",
      "WordPress esetén a SEO-bővítmények ezt automatikusan kezelik. Ellenőrizd, hogy a beállítás be van-e kapcsolva.",
      "Ellenőrizd, hogy a kanonikus cím https-t és a helyes, preferált domain-változatot használja.",
    ],
    dev: "Érvényes, abszolút <link rel=\"canonical\"> minden indexelendő oldalon, a preferált domain-változatra mutatva.",
  },
  viewport: {
    group: "seo",
    steps: [
      "Nyisd meg az oldalt a telefonodon: kicsi, lekicsinyített asztali nézetet látsz?",
      "Kérd meg a fejlesztődet, hogy adja hozzá a mobil nézetet beállító sort az oldal fejlécébe.",
      "Ellenőrizd, hogy a szöveg telefonon is nagyítás nélkül olvasható-e.",
    ],
    dev: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> és reszponzív elrendezés.",
  },
  "image-alt": {
    group: "access",
    steps: [
      "Minden képhez írj egy rövid leírást: mit látni rajta (pl. „Fogorvos vizsgálja a páciens fogát”).",
      "WordPress esetén a Médiatárban a kép „Alternatív szöveg” mezőjébe írd.",
      "Dísz-képeknél (pl. csak díszítő vonal) hagyd üresen az alt szöveget, ne töltsd ki feleslegesen.",
    ],
    dev: "Informatív képekre leíró alt szöveg; dekoratív képekre üres alt=\"\".",
  },
  "color-contrast": {
    group: "access",
    steps: [
      "Nyisd meg a webaim.org/resources/contrastchecker oldalt. Írd be a szöveg és a háttér színkódját.",
      "Ha a „Normal Text” kimenetén „Fail” szerepel, sötétítsd a szöveget (vagy világosítsd a hátteret), amíg „Pass” lesz.",
      "Különösen figyelj a szürke szövegre világos háttéren, és a gombok szövegére. Célarány: legalább 4,5:1.",
    ],
    dev: "Szín-kontraszt: normál szövegnél legalább 4,5:1, nagy szövegnél 3:1 (WCAG AA).",
  },
  "button-name": {
    group: "access",
    steps: [
      "Keresd meg azokat a gombokat, amiken csak ikon van (pl. menü, keresés, bezárás).",
      "Kérd meg a fejlesztődet, hogy mindegyikhez adjon szöveges nevet (pl. „Menü megnyitása”).",
      "Próbáld ki képernyőolvasóval (a Mac-en VoiceOver, Cmd+F5), hogy érthető-e.",
    ],
    dev: "Ikon-gombokra aria-label vagy rejtett szöveg, pl. aria-label=\"Menü megnyitása\".",
  },
  "link-name": {
    group: "access",
    steps: [
      "Keresd meg azokat a linkeket, amiken csak kép vagy ikon van (pl. közösségi ikonok, logó).",
      "Add meg mindegyiknek a nevét (pl. „Facebook-oldalunk”, „Kezdőlap”).",
      "Ellenőrizd újra a tesztet.",
    ],
    dev: "Kép- és ikon-linkekre aria-label vagy leíró alt/szöveg.",
  },
  label: {
    group: "access",
    steps: [
      "Nézd meg az űrlapjaidat: minden mező fölött látszik-e a felirata (Név, E-mail)?",
      "Ha csak halvány segédszöveg (placeholder) van bent, az nem elég. Adj minden mezőnek tényleges feliratot.",
      "Kérd meg a fejlesztődet, hogy a feliratot kösse össze a mezővel (for/id), hogy a feliratra kattintva a mező aktiválódjon.",
    ],
    dev: "Minden űrlapmezőhöz <label for> vagy aria-label; a placeholder nem helyettesíti.",
  },
  "heading-order": {
    group: "access",
    steps: [
      "Az oldalon egyetlen főcímet (H1) használj, abban a fő üzenettel.",
      "A fejezetcímek H2, az alcímek H3 legyenek, ne ugorj szintet (ne H2 után H4).",
      "Ne a méret miatt válassz címsort, hanem a tartalom szerkezete szerint. A méretet a stílus állítja.",
    ],
    dev: "Logikus címsor-hierarchia (h1 → h2 → h3), szintugrások nélkül; a vizuális méret CSS-ből.",
  },
  "tap-targets": {
    group: "access",
    steps: [
      "Telefonon próbáld meg ujjal megnyomni a menüpontokat és a gombokat. Mellékattintasz?",
      "Kérd meg a fejlesztődet, hogy a gombok és linkek legyenek legalább 44×44 pixelesek, és legyen köztük hely.",
      "Különösen a lábléc és a lista-linkek érdemelnek figyelmet.",
    ],
    dev: "Érintési célpontok min. 44×44 px (vagy 24 px + térköz), megfelelő távolsággal.",
  },
  "is-on-https": {
    group: "trust",
    steps: [
      "Kérd meg a tárhelyszolgáltatódat, hogy kapcsolja be az SSL-tanúsítványt (a legtöbb tárhelyen ingyenes, pl. Let's Encrypt).",
      "Állíttasd be, hogy minden http cím automatikusan átirányítson a https verzióra.",
      "Ellenőrizd, hogy nincs-e az oldalon http-s kép vagy fájl („vegyes tartalom”).",
    ],
    dev: "HTTPS minden oldalon, http → https 301, HSTS, a vegyes tartalom (http erőforrások) megszüntetése.",
  },
  "errors-in-console": {
    group: "trust",
    steps: [
      "Kérd meg a fejlesztődet, hogy nézze át a böngésző fejlesztői konzolját (F12 → Console).",
      "A piros hibák okait javítsa meg, vagy tüntesse el a hibát okozó, hiányzó fájlokat és elavult kódokat.",
      "Teszteld az űrlapokat, menüt és gombokat, mert ezek tipikusan emiatt romlanak el.",
    ],
    dev: "A konzolhibák (JS-kivételek, 404-es erőforrások, CORS) elhárítása.",
  },
};
