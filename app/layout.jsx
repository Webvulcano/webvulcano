import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import Nav from '@/components/Nav'

export const metadata = {
  title: 'webvulcano — weboldal & automatizáció',
  description: 'Meséld el a vállalkozásod. Én elkezdelek segíteni — teljesen ingyen.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3CPJH01PF0"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3CPJH01PF0');
        `}} />
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
      </head>
      <body>
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
