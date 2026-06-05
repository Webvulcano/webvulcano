'use client'
import styles from './Hero.module.css'

export default function Hero() {
  function scrollToForm(e) {
    e.preventDefault()
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        <p className={`hero-fade t-meta c-dim ${styles.eyebrow}`}>
          webvulcano — weboldal & automatizáció
        </p>

        <h1 className={styles.headline}>
          <span className={`hero-fade ${styles.line1}`}>
            Meséld el a
          </span>
          <span className={`hero-fade ${styles.line2}`}>
            <span className="cursive">vállalkozásod.</span>
          </span>
        </h1>

        <p className={`hero-fade ${styles.sub}`}>
          Megmutatom, miért nem hoz ügyfelet a weboldalad —{' '}
          <span className="cursive c-white">díjmentesen.</span>
        </p>

        <div className={`hero-fade ${styles.cta}`}>
          <a href="#form" onClick={scrollToForm}>
            <button className="btn-primary">Kérem a díjmentes auditot →</button>
          </a>
        </div>

      </div>
    </section>
  )
}
