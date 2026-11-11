// A leggyakoribb Lighthouse-auditok magyarul, vállalkozóbarát nyelven:
// [cím, mi a gond és mit jelent a látogatónak, mi a megoldás].
// Ami nincs a listában, ott a Google magyar címe és leírása jön (lásd lib/pagespeed.js).
const texts = {
  "render-blocking-resources": [
    "Az oldal megjelenését blokkoló fájlok",
    "A böngésző előbb letölt és feldolgoz néhány háttérfájlt, és csak utána rajzolja ki az oldalt. Eközben a látogató üres képernyőt lát, és sokan ilyenkor már továbblépnek.",
    "A fontos fájlokat az oldal elejére emelik, a többit háttérben, késleltetve töltik be. Így a látogató azonnal látja a tartalmat.",
  ],
  "unused-javascript": [
    "Felesleges JavaScript",
    "Az oldal olyan programkódot is letölt, amit soha nem használ. A telefonnak ezt le kell töltenie és fel kell dolgoznia, ami lassítja az oldalt, főleg mobilneten.",
    "A kódot szétválasztják, hogy minden oldal csak azt töltse le, amire valóban szüksége van, a nem használt részeket pedig eltávolítják.",
  ],
  "unused-css-rules": [
    "Felesleges stíluslapok (CSS)",
    "Az oldal olyan kinézeti szabályokat is letölt, amik egyetlen elemre sem vonatkoznak. Ez felesleges adat, amit a látogatónak végig kell várnia.",
    "A használaton kívüli szabályokat kitakarítják, és csak az adott oldalhoz szükséges stílus töltődik be.",
  ],
  "unminified-javascript": [
    "Tömörítetlen JavaScript",
    "A programkód olvasható formában, felesleges szóközökkel és megjegyzésekkel érkezik, ezért nagyobb a fájl, mint kellene.",
    "Egy automatikus lépéssel összezsugorítható a kód, tartalmi változtatás nélkül. Ez adatot spórol, és gyorsabb lesz az oldal.",
  ],
  "unminified-css": [
    "Tömörítetlen stíluslapok (CSS)",
    "A kinézeti szabályok olvasható formában, felesleges szóközökkel érkeznek, ezért nagyobb a fájl, mint kellene.",
    "Egy automatikus lépéssel összezsugorítható a CSS, tartalmi változtatás nélkül.",
  ],
  "uses-optimized-images": [
    "Túl nehéz képek",
    "A képek jóval nagyobb fájlméretűek, mint amekkorára a megjelenítésükhöz szükség van. Ez a leggyakoribb oka a lassú oldalaknak: mobilneten sokáig tart letölteni őket.",
    "A képeket tömörítik, hogy ugyanúgy nézzenek ki, de akár a felére-harmadára csökkenjen a méretük.",
  ],
  "modern-image-formats": [
    "Elavult képformátum",
    "A képek régi formátumban (JPG, PNG) vannak, pedig a modern formátumok ugyanazt a minőséget kisebb fájlban tudják.",
    "A képeket WebP vagy AVIF formátumra cserélik, ez általában 25–50%-kal kisebb fájlt jelent.",
  ],
  "uses-responsive-images": [
    "Túl nagy képek kis kijelzőre",
    "A telefon is ugyanazt a hatalmas, asztali gépekre szánt képet tölti le, amit egy nagy monitor. Így fölöslegesen sok adatot kell letöltenie.",
    "Több méretben készítik el a képeket, és a böngésző mindig a kijelzőnek megfelelőt kapja meg.",
  ],
  "offscreen-images": [
    "Azonnal betöltődő, még nem látszó képek",
    "Az oldal az összes képet egyszerre tölti be, azokat is, amik még nem látszanak, mert lejjebb vannak. Ez feleslegesen lassítja az első megjelenést.",
    "A lejjebb lévő képek csak akkor töltődnek be, amikor a látogató odagörget (lusta betöltés).",
  ],
  "efficient-animated-content": [
    "Nehéz animált tartalom",
    "A mozgó képek (animált GIF-ek) nagyon nagy fájlok, és lassítják az oldalt.",
    "A GIF-eket videóra vagy WebP-re cserélik, ami töredék méretű, ugyanúgy mozog.",
  ],
  "uses-text-compression": [
    "Nincs szövegtömörítés",
    "A szerver a szöveges fájlokat (kód, stílus) tömörítés nélkül küldi el, ezért többet kell letölteni, mint szükséges.",
    "A szerveren bekapcsolják a gzip vagy brotli tömörítést. Ez pár perces beállítás, ritka az ennyire gyors nyereség.",
  ],
  "server-response-time": [
    "Lassú szerverválasz",
    "A weboldal szervere sokáig gondolkodik, mielőtt válaszol. Ez minden egyes oldalbetöltést késlelteti, bármilyen gyors is a többi.",
    "Jobb tárhelyre vagy gyorsítótárazásra (cache) van szükség, így az oldalakat nem kell minden látogatásnál újra összeállítani.",
  ],
  "uses-long-cache-ttl": [
    "Rövid gyorsítótárazás",
    "A visszatérő látogató böngészője újra letölti azokat a fájlokat, amiket már egyszer megkapott. Ez lassabb betöltést jelent számára.",
    "A szerveren beállítják, hogy a böngésző hosszabb ideig megőrizze a ritkán változó fájlokat (képek, betűtípusok, stílus).",
  ],
  redirects: [
    "Felesleges átirányítások",
    "Az oldal címe több átirányításon megy keresztül, mielőtt a látogató megérkezik. Minden átirányítás egy plusz várakozás, mielőtt a betöltés egyáltalán elkezdődne.",
    "A címeket úgy állítják be, hogy egyből a végleges oldalra mutassanak (például a http, a www nélküli és a www-s változat között ne legyen lánc).",
  ],
  "dom-size": [
    "Túl bonyolult oldalszerkezet",
    "Az oldal túl sok elemből áll, ezért a böngészőnek sok munkája van a megjelenítéssel. Régebbi telefonokon ettől lassúnak és akadósnak érződik.",
    "Az oldalszerkezetet egyszerűsítik, a hosszú listákat és ismétlődő blokkokat csak szükség esetén töltik be.",
  ],
  "font-display": [
    "A betűtípus késleltetheti a szöveget",
    "Amíg a weboldal egyedi betűtípusa letöltődik, a szöveg láthatatlan marad, a látogató pedig üres helyet lát.",
    "Beállítják, hogy addig egy tartalék betűtípussal jelenjen meg a szöveg, és a végleges betűtípus csak utána cserélődjön be.",
  ],
  "bootup-time": [
    "Sok JavaScript-futtatás",
    "A telefon processzora sokáig dolgozik a program kódján, mire az oldal használható lesz. Gyengébb készülékeken ez különösen érződik.",
    "A kód mennyiségét csökkentik, és a nem azonnal szükséges részeket később töltik be.",
  ],
  "mainthread-work-breakdown": [
    "Túl sok háttérmunka a böngészőben",
    "Amíg a böngésző sokat dolgozik a háttérben, az oldal nem reagál a koppintásra vagy a görgetésre. A látogató ezt „lefagyásnak” érzi.",
    "Csökkentik és szétosztják a feldolgozandó munkát, így az oldal végig használható marad.",
  ],
  "third-party-summary": [
    "Külső szolgáltatások lassítják az oldalt",
    "Az oldalba beágyazott külső szolgáltatások (követőkódok, chat, térkép, közösségi gombok) mind külön letöltenek valamit, és együtt jelentősen lassítják az oldalt.",
    "Átnézik, melyikre van valóban szükség. A feleslegeseket kiveszik, a többit pedig késleltetve töltik be.",
  ],
  "third-party-cookies": [
    "Külső szolgáltatások sütit (cookie-t) tesznek le",
    "Az oldalra beágyazott külső szolgáltatások (például követőkódok) a látogató gépén sütiket helyeznek el. A böngészők ezeket egyre inkább tiltják, és adatkezelési szempontból is hozzájárulást igényelnek.",
    "Megnézik, melyik szolgáltatásra van szükség, a feleslegeseket eltávolítják, a többihez pedig rendezik a hozzájárulás-kérést (cookie-sáv).",
  ],
  "total-byte-weight": [
    "Túl nagy az oldal összmérete",
    "Az oldal összesen nagyon sok adatot tölt le. Lassabb mobilneten ez másodpercekkel hosszabbítja a várakozást, és a látogató adatkeretét is felemészti.",
    "A képek tömörítésével és a felesleges fájlok kivételével az oldal mérete jelentősen csökkenthető.",
  ],
  "lcp-lazy-loaded": [
    "A fő kép későn tölt be",
    "A képernyő tetején lévő legnagyobb képet az oldal késleltetve tölti be, pedig ez az, amire a látogató először néz. Ettől az oldal lassúnak tűnik.",
    "A látható felső kép töltődjön be elsőként, a lusta betöltés csak a lejjebb lévő képekre vonatkozzon.",
  ],
  "largest-contentful-paint-element": [
    "A legnagyobb elem lassan jelenik meg",
    "Ez az az elem (általában egy nagy kép vagy főcím), amire a látogató a legtovább vár. A Google ezt az időt a legfontosabb sebességmutatók között méri.",
    "Ezt az elemet érdemes elsőként gyorsítani: megfelelő méretű képpel, előtöltéssel és kevesebb blokkoló fájllal.",
  ],
  "layout-shifts": [
    "Az oldal elemei ugrálnak",
    "Betöltés közben a tartalom elmozdul (például a kép megjelenik, és lejjebb tolja a szöveget). A látogató mellékattint, vagy elveszíti, hol tartott az olvasásban.",
    "A képeknek és a beágyazott elemeknek előre fenntartják a helyét, így semmi nem ugrik el betöltés közben.",
  ],
  "unsized-images": [
    "Méret nélküli képek",
    "A képeknél nincs megadva a méret, ezért a böngésző csak betöltés után tudja, mennyi helyet foglalnak. Addig a szöveg ugrál.",
    "Minden képhez megadják a szélességet és a magasságot, így a hely előre le van foglalva.",
  ],
  "image-alt": [
    "Hiányzó képleírások",
    "A képekhez nincs rövid leírás. A látássérültek képernyőolvasója nem tudja felolvasni őket, a Google pedig nem érti, mi látható rajtuk.",
    "Minden fontos képhez rövid, tartalmas leírást (alt szöveget) írnak. Ez az akadálymentesség mellett a képkeresésből is hozhat látogatót.",
  ],
  "color-contrast": [
    "Gyenge színkontraszt",
    "Néhány szöveg színe túl közel van a háttér színéhez, ezért nehezen olvasható. Főleg napfényben a telefonon, vagy gyengébb látásúaknak okoz gondot.",
    "A színeket úgy módosítják, hogy a szöveg és a háttér között elég nagy legyen a különbség. A márka színei megmaradhatnak.",
  ],
  "button-name": [
    "Gombok név nélkül",
    "Van olyan gomb, aminek nincs szöveges neve (például csak egy ikon). A képernyőolvasó nem tudja megmondani, mire való.",
    "A gombokhoz rövid, leíró nevet adnak (például „Menü megnyitása”).",
  ],
  "link-name": [
    "Linkek név nélkül",
    "Van olyan link, aminek nincs olvasható szövege (például csak egy kép vagy ikon). A képernyőolvasó és a Google sem tudja, hová vezet.",
    "Minden linkhez érthető szöveget vagy leírást adnak, hogy egyértelmű legyen a céljuk.",
  ],
  label: [
    "Űrlapmezők felirat nélkül",
    "Az űrlap egyes mezőihez nincs hozzárendelt felirat. A képernyőolvasó nem tudja, mit kell beírni, és a kattintási terület is kisebb.",
    "Minden mezőhöz tartozó feliratot rendelnek, így érthetőbb és könnyebben kitölthető az űrlap.",
  ],
  "heading-order": [
    "Rossz címsor-sorrend",
    "A címsorok szintjei nincsenek logikus sorrendben (például a főcímet egyből egy harmadszintű cím követi). Ez megzavarja a képernyőolvasót, és a Google-nek is nehezebb értelmeznie az oldal szerkezetét.",
    "A címsorokat sorrendbe teszik, hogy az oldal tartalma átlátható vázlatot adjon.",
  ],
  "document-title": [
    "Hiányzó oldalcím",
    "Az oldalnak nincs címe. Ez jelenik meg a Google találati listájában és a böngészőfülön, ezért ennek hiányában nehéz rákattintani.",
    "Minden oldalnak egyedi, beszédes címet adnak (kb. 50–60 karakter, benne a szolgáltatás és a város).",
  ],
  "meta-description": [
    "Hiányzó meta leírás",
    "A Google nem kap rövid összefoglalót az oldalról, ezért ő választ ki valamit, ami gyakran nem hívogató. Ez a szöveg jelenik meg a találatod alatt, és ettől függ, hogy rákattintanak-e.",
    "Minden fontos oldalhoz 140–160 karakteres, meggyőző leírást írnak, benne azzal, amit keres a látogató.",
  ],
  "link-text": [
    "Semmitmondó linkszövegek",
    "Az olyan linkek, mint a „Tovább” vagy „Részletek”, nem mondják meg, hová vezetnek. Ez a látogatónak és a Google-nek is kevés információ.",
    "A linkek szövegét úgy írják át, hogy önmagában is érthető legyen (például „Árak megtekintése”).",
  ],
  "crawlable-anchors": [
    "A Google nem követi egyes linkeket",
    "Néhány link nem valódi hivatkozás (például egy gomb, ami csak kódból visz tovább). A Google ezeket nem követi, így a mögöttük lévő oldalak kimaradhatnak a keresőből.",
    "A navigációs elemeket valódi linkekre cserélik, hogy minden oldal megtalálható legyen.",
  ],
  "is-crawlable": [
    "A Google nem indexelheti az oldalt",
    "Valami megtiltja, hogy az oldal megjelenjen a Google-ben. Ez gyakran egy elfelejtett „noindex” beállítás, amit fejlesztés közben tettek be.",
    "Megkeresik és eltávolítják a tiltást. Ez sürgős: addig az oldalt senki nem találja meg keresésből.",
  ],
  "http-status-code": [
    "Hibás oldalválasz",
    "Az oldal hibakóddal válaszol (például 404 vagy 500). A Google az ilyen oldalakat kihagyja, a látogató pedig hibaüzenetet lát.",
    "Megkeresik és javítják a hibát, vagy a megszűnt oldalt átirányítják a megfelelő új címre.",
  ],
  "robots-txt": [
    "Hibás robots.txt",
    "Ez a fájl mondja meg a keresőknek, mit nézhetnek meg az oldalon. Ha hibás, a Google nem biztos, hogy megtalálja a fontos oldalakat.",
    "A fájlt kijavítják, és ellenőrzik, hogy ne zárjon ki semmi fontosat.",
  ],
  canonical: [
    "Hibás kanonikus cím",
    "A Google nem tudja egyértelműen, melyik az oldalad „hivatalos” változata, ezért ugyanannak a tartalomnak több változata versenghet egymással a találatok között.",
    "Minden oldalhoz megadják a helyes kanonikus címet.",
  ],
  viewport: [
    "Nincs mobil nézet beállítva",
    "Telefonon az oldal egy lekicsinyített asztali nézetként jelenik meg, amit csak nagyítással lehet olvasni. A Google emiatt rosszabbra is értékelheti.",
    "Beállítják a mobil nézetet, hogy az oldal minden kijelzőhöz igazodjon.",
  ],
  "is-on-https": [
    "Nem biztonságos kapcsolat",
    "Az oldal nem titkosított (nem https) kapcsolaton érhető el. A böngésző „Nem biztonságos” figyelmeztetést mutat, ami elriasztja a látogatót, és a Google is rosszabbra értékeli.",
    "SSL-tanúsítványt állítanak be (ez a legtöbb tárhelyen ingyenes), és minden címet átirányítanak a https verzióra.",
  ],
  "errors-in-console": [
    "Hibák az oldal kódjában",
    "Az oldal programkódja hibát jelez. Ettől egyes funkciók (például egy űrlap vagy menü) nem működhetnek rendesen, bár a látogató ezt nem mindig veszi észre.",
    "A hibákat egyenként megkeresik és javítják, így minden funkció megbízhatóan működik.",
  ],
  "tap-targets": [
    "Túl kicsi, egymáshoz közeli gombok",
    "Telefonon nehéz eltalálni a megfelelő gombot vagy linket, mert túl kicsik, vagy túl közel vannak egymáshoz. A látogató elégedetlenül mellékattint.",
    "A gombok és linkek méretét és távolságát növelik, hogy ujjal is könnyen kezelhetők legyenek.",
  ],
};

// A Lighthouse újabb verziói néhány auditot „insight” néven újra kiadnak: ugyanaz a szöveg.
const aliases = {
  "render-blocking-insight": "render-blocking-resources",
  "image-delivery-insight": "uses-optimized-images",
  "font-display-insight": "font-display",
  "dom-size-insight": "dom-size",
  "cache-insight": "uses-long-cache-ttl",
  "third-parties-insight": "third-party-summary",
  "document-latency-insight": "server-response-time",
  "viewport-insight": "viewport",
  "cls-culprits-insight": "layout-shifts",
  "lcp-discovery-insight": "largest-contentful-paint-element",
  "legacy-javascript-insight": "unused-javascript",
  "duplicated-javascript-insight": "unused-javascript",
};

export const auditIds = Object.keys(texts);

export const auditText = new Proxy(texts, {
  get: (t, id) => t[id] ?? t[aliases[id]],
});
