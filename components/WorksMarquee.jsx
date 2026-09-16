'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './WorksMarquee.module.css'

const CARD_IMAGE = '/projects/card-preview.png'
const HOLD_MS = 2000
const TRANSITION_MS = 600
const COPIES = 3
const SLOT_PERCENT = 114

const BADGES = {
  'm-i-k-eloteto': { chip: 'Webfejlesztés', big: 'M.I.K Előtető', small: 'Kész · React.js' },
  'hideg-email-automatizalo-asszisztens': { chip: 'AI automatizáció', big: '2-3 óra → 1 perc', small: 'napi időmegtakarítás' },
  'ticketing-rendszer-ai-integracio': { chip: 'AI automatizáció', big: 'havi 20 óra', small: 'megtakarítva fejenként' },
}

export default function WorksMarquee({ projects }) {
  const len = projects.length
  const [step, setStep] = useState(len)
  const [instant, setInstant] = useState(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (len < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      if (!pausedRef.current) setStep((s) => s + 1)
    }, HOLD_MS + TRANSITION_MS)
    return () => clearInterval(id)
  }, [len])

  useEffect(() => {
    if (len < 2 || step < len * (COPIES - 1)) return
    const t = setTimeout(() => {
      setInstant(true)
      setStep((s) => s - len)
    }, TRANSITION_MS + 50)
    return () => clearTimeout(t)
  }, [step, len])

  useEffect(() => {
    if (!instant) return
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)))
    return () => cancelAnimationFrame(raf)
  }, [instant])

  const nodes = []
  for (let c = 0; c < COPIES; c++) {
    projects.forEach((p, idx) => nodes.push({ key: c * len + idx, i: c * len + idx, project: p }))
  }

  return (
    <div
      className={styles.viewport}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className={styles.clip}>
        <div className={styles.stage}>
          {nodes.map(({ key, i, project }) => {
            const offset = i - step
            const abs = Math.abs(offset)
            const isCenter = offset === 0
            const hiddenFar = abs > 1
            const badge = BADGES[project.slug]

            return (
              <Link
                key={key}
                href={`/projektek#${project.slug}`}
                className={styles.slide}
                aria-hidden={hiddenFar ? 'true' : undefined}
                tabIndex={hiddenFar ? -1 : undefined}
                style={{
                  '--tx': `${offset * SLOT_PERCENT}%`,
                  '--z': isCenter ? 2 : 1,
                  opacity: hiddenFar ? 0 : isCenter ? 1 : 0.55,
                  transition: instant ? 'none' : undefined,
                  pointerEvents: hiddenFar ? 'none' : undefined,
                }}
              >
                <span className={styles.frame} aria-hidden="true" />
                <img
                  src={CARD_IMAGE}
                  alt={`${project.title} weboldal készítés Budapest`}
                  className={styles.image}
                  loading="lazy"
                />
                {isCenter && badge && (
                  <>
                    <span className={styles.chip}>{badge.chip}</span>
                    <div className={styles.statBadge}>
                      <div className={styles.statBig}>{badge.big}</div>
                      <div className={styles.statSmall}>{badge.small}</div>
                    </div>
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
