'use client'
import { useEffect, useRef } from 'react'
import styles from './Works.module.css'

export default function ProjectCard({ project, last, index, compact }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <article
      ref={ref}
      className={`project-card reveal ${styles.card} ${!compact && last ? styles.cardLast : ''} ${compact ? styles.cardCompact : ''}`}
    >
      <div className={styles.cardHeader}>
        <span className="t-label c-dim">#{index + 1}</span>
      </div>

      <h3 className={`t-h2 c-white ${styles.title}`}>
        {project.title}<span className="cursive c-accent-l">{project.titleAccent}</span>
      </h3>

      <div className={`works-meta-grid ${styles.metaGrid}`}>
        {[['Megbízás típusa', project.roles], ['Elkészítés ideje', project.duration], ['Eszközök', project.tools], ['Státusz', project.status]].map(([k, v]) => (
          <div key={k}>
            <p className={styles.metaLabel}>{k}</p>
            <p className={styles.metaValue}>{v}</p>
          </div>
        ))}
      </div>

      <div className={styles.summaryGrid}>
        <div>
          <p className={styles.summaryLabel}>Összefoglaló</p>
          <p className="t-body c-body">{project.summary}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Eredmény</p>
          <p className="t-body c-body">{project.motivation}</p>
          {project.url && (
            <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="contact-link t-body c-strong mt-sm" style={{ display: 'inline-block' }}>
              {project.url}
            </a>
          )}
        </div>
      </div>

      {project.images?.length > 0 && (
        <div className={`gallery-grid ${styles.galleryGrid}`}>
          {project.images.map((src, i) => (
            <div key={i} className={`gallery-img ${styles.galleryImgWrap}`}>
              <img src={src} alt={`${project.title} screenshot`} className={styles.galleryImage} />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
