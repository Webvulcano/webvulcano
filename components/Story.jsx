'use client'
import { useEffect, useRef } from 'react'
import styles from './Story.module.css'

const AUDIT_ITEMS = [
  { icon: '◉', title: 'Weboldal audit', desc: 'Mi működik, mi nem — pontról pontra.' },
  { icon: '◉', title: 'SEO elemzés', desc: 'Hol veszítesz látogatókat a Google-ön.' },
  { icon: '◉', title: 'Sebesség teszt', desc: 'Miért lassú az oldalad és hogyan javítható.' },
  { icon: '◉', title: 'Automatizációs javaslat', desc: 'Mit lehet egyszerűsíteni a folyamataidban.' },
]

export default function Story() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.querySelectorAll('.reveal').forEach(r => r.classList.add('visible'))
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  function scrollToForm(e) {
    e.preventDefault()
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="story" ref={sectionRef} className={`section section-padded ${styles.story}`}>
      <div className="reveal divider-v mb-lg" />

      <p className="reveal t-meta c-dim mb-lg">
        Mit kapsz díjmentesen?
      </p>

      <div className={`reveal ${styles.grid}`}>
        {AUDIT_ITEMS.map((item, i) => (
          <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 3)} ${styles.card}`}>
            <span className={styles.icon}>{item.icon}</span>
            <div>
              <p className="t-lead c-white">{item.title}</p>
              <p className="t-body c-muted mt-xs">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`reveal reveal-delay-2 ${styles.reversal}`}>
        <p className="t-body c-dim">
          Nincs rejtett költség. Nincs kötelezettség.
        </p>
      </div>

      <div className="reveal reveal-delay-3 mt-lg">
        <a href="#form" onClick={scrollToForm}>
          <button className="btn-primary">Kezdjük el — 2 perc →</button>
        </a>
      </div>
    </section>
  )
}
