'use client'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import styles from './ProjektekHeader.module.css'

export default function ProjektekHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className={styles.sidebar}>
      <span />
      <div className={styles.middle}>
        <Link href="/" className={styles.backLink}>
          ← Vissza
        </Link>
      </div>
      <button onClick={toggleTheme} className={`unstyled-btn t-meta ${styles.themeToggle}`} aria-label="Téma váltás">
        {theme === 'dark' ? '☀' : '🌙'}
      </button>
    </nav>
  )
}
