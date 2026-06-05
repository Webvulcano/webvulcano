'use client'
import { useEffect, useRef } from 'react'
import styles from './CompactProjectList.module.css'

function CompactCard({ project }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <article ref={ref} className={`reveal ${styles.card}`}>
      <div className={styles.cardTop}>
        <span className="t-label c-dim">{project.num}</span>
        <h3 className={`t-h3 c-white ${styles.title}`}>
          {project.title}
          {project.titleAccent && <span className="cursive c-accent-l">{project.titleAccent}</span>}
        </h3>
      </div>
      <div className={styles.meta}>
        {[['Típus', project.roles], ['Idő', project.duration], ['Eszközök', project.tools], ['Státusz', project.status]].map(([k, v]) => (
          <span key={k} className={styles.metaItem}>
            <span className="t-tiny c-faint">{k}:</span>{' '}
            <span className="t-tiny c-muted">{v}</span>
          </span>
        ))}
      </div>
      <p className="t-body c-body">{project.summary}</p>
      {project.url && (
        <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="contact-link t-body c-strong mt-xs" style={{ display: 'inline-block' }}>
          {project.url}
        </a>
      )}
    </article>
  )
}

export default function CompactProjectList({ projects }) {
  return (
    <div className={styles.list}>
      {projects.map((p, i) => <CompactCard key={i} project={p} />)}
    </div>
  )
}
