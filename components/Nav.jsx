'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import styles from './Nav.module.css'

const MENU = [['home', 'Home'], ['story', 'Szolgáltatás'], ['works', 'Eredmények'], ['form', 'Audit']]
const CENTER = (MENU.length - 1) / 2 // 1.5
const STEP = 26

// Container: stagger children in/out
const listVariants = {
  initial: {},
  enter: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
}

// Each menu item: converges toward vertical center on exit, unfolds from center on enter
const itemVariants = {
  initial: (i) => ({ opacity: 0, y: (CENTER - i) * STEP }),
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: (i) => ({ opacity: 0, y: (CENTER - i) * STEP, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }),
}

const backVariants = {
  initial: { opacity: 0, scale: 0.85, y: 0 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
}

export default function Nav() {
  const pathname = usePathname()
  const mode = (pathname === '/projektek' || pathname === '/adatkezeles') ? 'back' : 'home'
  const [active, setActive] = useState('home')
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (mode !== 'home') return
    const sections = ['home', 'story', 'works', 'form'].map(id => document.getElementById(id)).filter(Boolean)
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { threshold: 0, rootMargin: '-10% 0px -80% 0px' })
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [mode])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav-sidebar ${styles.sidebar}`}>
      <Link href="/" className="t-meta unstyled-btn c-white">
        🌋
      </Link>

      <div className={styles.linksWrap}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'home' ? (
            <motion.ul
              key="home"
              className={`nav-links ${styles.links}`}
              variants={listVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {MENU.map(([id, label], i) => (
                <motion.li key={id} custom={i} variants={itemVariants}>
                  <button
                    onClick={() => scrollTo(id)}
                    className={`${styles.link} ${active === id ? styles.linkActive : ''}`}
                    style={{ color: active === id ? '#FF6102' : 'var(--color-text-muted)' }}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="back"
              className={`nav-links ${styles.links}`}
              variants={backVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Link href={pathname === '/adatkezeles' ? '/#form' : '/'} className={styles.link} style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                ←&nbsp;Vissza
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*<button onClick={toggleTheme} className={`unstyled-btn t-meta ${styles.themeToggle}`} aria-label="Téma váltás">
        {theme === 'dark' ? '☀' : '🌙'}
      </button>*/}
    </nav>
  )
}
