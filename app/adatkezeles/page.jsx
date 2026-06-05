export const metadata = {
  title: 'Adatkezelési tájékoztató — webvulcano',
  description: 'Adatkezelési tájékoztató és GDPR információk.',
}

export default function AdatkezelesPage() {
  return (
    <main className="section section-padded" style={{ paddingTop: 'clamp(3rem,8vh,6rem)', paddingBottom: '4rem' }}>

      <h1 className="t-h2 c-white lh-tighter mb-lg">Adatkezelési tájékoztató</h1>
      <p className="t-tiny c-faint mb-lg">Utolsó frissítés: 2026. június 3.</p>

      <div className="privacy-content">

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">1. Az adatkezelő</h2>
          <p className="t-body c-body">
            Név: Bognár Lehel egyéni vállalkozó<br />
            Székhely: Magyarország<br />
            Email: info@webvulcano.hu<br />
            Weboldal: webvulcano.hu
          </p>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">2. A kezelt adatok köre</h2>
          <p className="t-body c-body">
            Az űrlap kitöltésekor az alábbi adatokat gyűjtjük:
          </p>
          <ul className="t-body c-body" style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', listStyle: 'disc' }}>
            <li>Név</li>
            <li>Email cím</li>
            <li>Weboldal URL (opcionális)</li>
            <li>Vállalkozással kapcsolatos információk (kihívások, leírás)</li>
          </ul>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">3. Az adatkezelés célja</h2>
          <p className="t-body c-body">
            A megadott adatokat kizárólag az alábbi célokra használjuk:
          </p>
          <ul className="t-body c-body" style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', listStyle: 'disc' }}>
            <li>Díjmentes weboldal audit elkészítése és visszaküldése</li>
            <li>Kapcsolatfelvétel az audit eredményeivel kapcsolatban</li>
          </ul>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">4. Az adatkezelés jogalapja</h2>
          <p className="t-body c-body">
            Az adatkezelés jogalapja az Ön önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont),
            amelyet az űrlap elküldésével ad meg.
          </p>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">5. Az adatkezelés időtartama</h2>
          <p className="t-body c-body">
            Az adatokat az audit elkészítésétől számított legfeljebb 1 évig tároljuk,
            vagy addig, amíg Ön a törlést nem kéri — amelyik előbb bekövetkezik.
          </p>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">6. Adattovábbítás</h2>
          <p className="t-body c-body">
            Az űrlap adatait a Web3Forms szolgáltatáson keresztül továbbítjuk email formájában.
            A Web3Forms adatvédelmi irányelvei elérhetők: web3forms.com. Harmadik félnek
            az adatokat nem adjuk tovább, nem értékesítjük.
          </p>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">7. Az Ön jogai</h2>
          <p className="t-body c-body">
            A GDPR alapján Ön jogosult:
          </p>
          <ul className="t-body c-body" style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', listStyle: 'disc' }}>
            <li>Tájékoztatást kérni a kezelt adatairól</li>
            <li>Adatai helyesbítését kérni</li>
            <li>Adatai törlését kérni</li>
            <li>Az adatkezelés korlátozását kérni</li>
            <li>Hozzájárulását bármikor visszavonni</li>
            <li>Panaszt tenni a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH)</li>
          </ul>
          <p className="t-body c-body mt-sm">
            Kérését az info@webvulcano.hu email címen nyújthatja be. A kérést legfeljebb 30 napon belül teljesítjük.
          </p>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">8. NAIH elérhetőségek</h2>
          <p className="t-body c-body">
            Nemzeti Adatvédelmi és Információszabadság Hatóság<br />
            Cím: 1055 Budapest, Falk Miksa utca 9-11.<br />
            Telefon: +36 (1) 391-1400<br />
            Email: ugyfelszolgalat@naih.hu<br />
            Web: naih.hu
          </p>
        </section>

        <section className="mb-lg">
          <h2 className="t-lead c-strong mb-sm">9. Cookie-k és sütik</h2>
          <p className="t-body c-body">
            A weboldal kizárólag a témaválasztás (világos/sötét mód) és a visszatérő
            látogató felismerése céljából használ localStorage-ot. Harmadik féltől származó
            sütiket nem alkalmazunk. Analitikai vagy reklámcélú cookie-kat nem használunk.
          </p>
        </section>

        <section>
          <h2 className="t-lead c-strong mb-sm">10. Módosítások</h2>
          <p className="t-body c-body">
            Fenntartjuk a jogot a tájékoztató módosítására. A módosítás dátumát az oldal tetején
            feltüntetjük.
          </p>
        </section>

      </div>
    </main>
  )
}
