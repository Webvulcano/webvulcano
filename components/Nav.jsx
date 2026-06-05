'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import styles from './Nav.module.css'

const MENU = [['home', 'Home'], ['story', 'Szolgáltatás'], ['works', 'Eredmények'], ['form', 'Audit']]
const CENTER = (MENU.length - 1) / 2
const STEP = 26
const BP_MOBILE = 950

const listVariants = {
  initial: {},
  enter: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
}

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

const overlayVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3, when: 'beforeChildren', staggerChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.25, when: 'afterChildren' } },
}

const overlayItemVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
}

export default function Nav() {
  const pathname = usePathname()
  const mode = (pathname === '/projektek' || pathname === '/adatkezeles') ? 'back' : 'home'
  const [active, setActive] = useState('home')
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BP_MOBILE}px)`)
    const handler = (e) => {
      setIsMobile(e.matches)
      if (!e.matches) setMenuOpen(false)
    }
    setIsMobile(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isMobile || mode !== 'home') return
    const hero = document.getElementById('home')
    if (!hero) return
    const obs = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting)
    }, { threshold: 0.4 })
    obs.observe(hero)
    return () => obs.disconnect()
  }, [isMobile, mode])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (mode !== 'home') return
    const sections = ['home', 'story', 'works', 'form'].map(id => document.getElementById(id)).filter(Boolean)
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { threshold: 0, rootMargin: '-10% 0px -80% 0px' })
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [mode])

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleMobileNav = useCallback((id) => {
    setMenuOpen(false)
    setTimeout(() => scrollTo(id), 100)
  }, [scrollTo])

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <>
        <nav className={`${styles.topbar} ${pastHero ? styles.topbarVisible : styles.topbarHidden}`}>
          <Link href="/" className={styles.topbarLogo}>
            🌋
          </Link>

          {mode === 'home' && (
            <button
              className={`btn-primary ${styles.topbarCta}`}
              onClick={() => { setMenuOpen(false); setTimeout(() => scrollTo('form'), 100) }}
            >
              Ingyenes Audit
            </button>
          )}

          {mode === 'home' ? (
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
            >
              <span /><span /><span />
            </button>
          ) : (
            <Link href={pathname === '/adatkezeles' ? '/#form' : '/'} className={styles.topbarBack}>
              ←&nbsp;Vissza
            </Link>
          )}
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={styles.overlay}
              variants={overlayVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <motion.ul className={styles.overlayLinks}>
                {MENU.filter(([id]) => id !== 'form').map(([id, label]) => (
                  <motion.li key={id} variants={overlayItemVariants}>
                    <button
                      className={`${styles.overlayLink} ${active === id ? styles.overlayLinkActive : ''}`}
                      onClick={() => handleMobileNav(id)}
                    >
                      {label}
                    </button>
                  </motion.li>
                ))}
                <motion.li key="form" variants={overlayItemVariants}>
                  <button
                    className="btn-primary"
                    onClick={() => handleMobileNav('form')}
                  >
                    Ingyenes Audit →
                  </button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  /* ── Desktop / Tablet ── */
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
    </nav>
  )
}
