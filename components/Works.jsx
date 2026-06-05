'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './Works.module.css'
import { projects } from './projectlist'
import ProjectCard from './ProjectCard'

const featured = projects.filter(p => p.featured)

export default function Works() {
  const headerRef = useRef(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="works" className="section section-padded">
      <p ref={headerRef} className={`reveal t-meta c-dim ${styles.header}`}>
        Így segítettem vállalkozásoknak
      </p>
      {featured.map((p, i) => <ProjectCard key={i} project={p} last={i === featured.length - 1} index={i} />)}

      <div className={styles.moreWrap}>
        <Link href="/projektek" className="btn-primary">Összes projekt →</Link>
      </div>
    </section>
  )
}
