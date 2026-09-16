'use client'
import { useState, useRef } from 'react'
import styles from './StarRating.module.css'

const GOOGLE_REVIEW_URL = 'https://g.page/r/CW-m9UHrgxbNECE/review'

export default function StarRating() {
  const [rated, setRated] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  function handleStarClick(stars) {
    if (stars >= 4) {
      window.location.href = GOOGLE_REVIEW_URL
      return
    }
    setRated(stars)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!comment.trim()) {
      setError('Kérlek írj pár szót, mit tehetnénk jobban.')
      return
    }
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars: rated, comment }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError('Hiba történt, próbáld újra.')
      }
    } catch {
      setError('Hiba történt, próbáld újra.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.successWrap}>
        <div className="divider-v" />
        <p className="t-h2 c-white lh-tight-alt">
          Köszönjük az őszinte visszajelzést.
        </p>
        <div className={styles.signatureText}>
          <p className="t-lead c-muted">
            A célom hogy egy emberközeli, átlátható és megbízható szolgáltatást nyújtsak.
          </p>
          <p className="t-lead c-muted">
            Nagyon sajnálom, hogy ez most nem sikerült! Köszönöm, hogy engem választottál — minden erőmmel azon leszek, hogy tanuljak a hibámból, és a lehető legjobb szolgáltatást nyújtsam a jövőben.
          </p>
          <p className={`t-lead ${styles.signature}`}>
            Üdvözlettel,<br />Bognár Lehel — WebVulcano 🌋
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="t-h2 c-white lh-tighter max-w-title">
        Mennyire voltál elégedett?
      </h1>
      <p className="t-lead c-dim mt-sm max-w-sub">
        Add meg őszintén, hány csillagot érdemel szolgáltatásunk.
      </p>

      <div className={styles.stars} onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            className={`${styles.star}${n <= (hovered ?? rated ?? 0) ? ` ${styles.filled}` : ''}`}
            aria-label={`${n} csillag`}
            onMouseEnter={() => setHovered(n)}
            onClick={() => handleStarClick(n)}
          >
            ★
          </button>
        ))}
      </div>

      {rated !== null && (
        <form onSubmit={handleSubmit} className={styles.followUp}>
          <div className="form-field">
            <label>Mit tehetnénk jobban?</label>
            <textarea
              ref={textareaRef}
              className="form-textarea"
              placeholder="Írd le röviden, mi volt a probléma..."
              value={comment}
              onChange={e => {
                setComment(e.target.value)
                const ta = textareaRef.current
                if (ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px' }
              }}
              rows={3}
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary" disabled={sending} style={{ marginTop: '1rem' }}>
            {sending ? 'Küldés...' : 'Elküldöm'}
          </button>
          {error && <p className="t-tiny" style={{ color: '#ff4444', marginTop: '0.5rem' }}>{error}</p>}
        </form>
      )}
    </div>
  )
}
