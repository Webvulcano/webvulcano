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
