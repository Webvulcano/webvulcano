import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import Nav from '@/components/Nav'
import CookieConsent from '@/components/CookieConsent'

export const metadata = {
  title: 'Weboldal készítés Budapest — ingyenes terv | webvulcano',
  description: 'Ingyenes weboldal-terv budapesti vállalkozásoknak. Gyors, modern weboldal, ami mérhetően hoz érdeklődőt.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'webvulcano',
  url: 'https://www.webvulcano.hu',
  email: 'info@webvulcano.hu',
  areaServed: {
    '@type': 'City',
    name: 'Budapest',
  },
  priceRange: '80000-200000 HUF',
  description: 'Weboldal készítés Budapesten — modern, gyors, konverzióra optimalizált weboldalak helyi vállalkozásoknak.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('wv-theme');
              document.documentElement.setAttribute('data-theme', (t === 'dark') ? 'dark' : 'light');
            } catch(e) {
              document.documentElement.setAttribute('data-theme', 'light');
            }
          })();
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Nav />
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
