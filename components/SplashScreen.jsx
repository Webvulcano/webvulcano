'use client'
import { useEffect, useLayoutEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

const firstGreetings = [
  'Örülök hogy itt vagy!',
  'Üdvözöllek!',
  'Köszöntelek!',
  'Hahó, jó látni!',
  'Szia!',
  'Üdv, jó hogy itt vagy!',
  'Helló!',
]

const returningGreetings = [
  'Örülök hogy újra itt vagy!',
  'Jó újra látni!',
  'Üdv újra!',
  'Ezer éve! Jó újra látni!',
  'Örülök hogy itt vagy! Érezd magad otthon!',
]

// Module-level: resets on full page reload, persists during client-side nav
let splashShownThisSession = false
const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const [greeting, setGreeting] = useState('')

  const shouldSkip = splashShownThisSession || initialPath !== '/'

  // Runs before paint — instant skip on client nav or refresh from other page
  useLayoutEffect(() => {
    if (shouldSkip) {
      document.body.classList.add('no-reveal')
    }
  }, [shouldSkip])

  useEffect(() => {
    if (shouldSkip) return
    splashShownThisSession = true

    // Show splash
    setVisible(true)

    window.scrollTo(0, 0)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    const visited = localStorage.getItem('wv-visited')
    if (visited) {
      setGreeting(returningGreetings[Math.floor(Math.random() * returningGreetings.length)])
    } else {
      setGreeting(firstGreetings[Math.floor(Math.random() * firstGreetings.length)])
      localStorage.setItem('wv-visited', '1')
    }

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const fadeTimer = setTimeout(() => setFading(true), 1400)
    const hideTimer = setTimeout(() => {
      setVisible(false)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }, 2000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  if (!visible) return null

  return (
    <div className={styles.overlay} style={{ opacity: fading ? 0 : 1 }}>
      <p className={styles.text}>
        {greeting}
      </p>
    </div>
  )
}
