'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './CookieConsent.module.css'

function loadAnalytics() {
  if (window.__wvAnalyticsLoaded) return
  window.__wvAnalyticsLoaded = true

  const clarity = document.createElement('script')
  clarity.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "x27c3zfleu");
  `
  document.head.appendChild(clarity)

  const gtagSrc = document.createElement('script')
  gtagSrc.async = true
  gtagSrc.src = 'https://www.googletagmanager.com/gtag/js?id=G-3CPJH01PF0'
  document.head.appendChild(gtagSrc)

  const gtagInit = document.createElement('script')
  gtagInit.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-3CPJH01PF0');
  `
  document.head.appendChild(gtagInit)
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wv-cookie-consent')
    if (saved === 'accepted') {
      loadAnalytics()
    } else if (saved !== 'rejected') {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('wv-cookie-consent', 'accepted')
    loadAnalytics()
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('wv-cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie hozzájárulás">
      <p className={styles.text}>
        Az oldal a látogatottság mérésére és a felhasználói élmény javítására
        elemző sütiket használ (Google Analytics, Microsoft Clarity). Bővebben az{' '}
        <Link href="/adatkezeles" target="_blank" className={styles.link}>
          adatkezelési tájékoztatóban
        </Link>.
      </p>
      <div className={styles.actions}>
        <button className={styles.reject} onClick={reject}>Elutasítom</button>
        <button className={styles.accept} onClick={accept}>Elfogadom</button>
      </div>
    </div>
  )
}
