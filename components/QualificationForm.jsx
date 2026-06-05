'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './QualificationForm.module.css'

const CHALLENGES = [
  'Nem találnak rám a Google-ön',
  'Kevés megkeresés / érdeklődő jön',
  'Elavult vagy nem profi a weboldalunk',
  'Lassú a weboldalunk',
  'Sok időt töltök ismétlődő feladatokkal',
]

export default function QualificationForm() {
  const [website, setWebsite] = useState('')
  const [noWebsite, setNoWebsite] = useState(false)
  const [challenges, setChallenges] = useState([])
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const sectionRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.querySelectorAll('.reveal').forEach(r => r.classList.add('visible')); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  function toggleChallenge(c) {
    setChallenges(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!consent) {
      setError('Kérlek fogadd el az adatkezelési tájékoztatót.')
      return
    }
    setSending(true)
    setError('')

    const formData = new FormData()
    formData.append('access_key', '9236e513-d688-4a37-9bfe-ee9894175975')
    formData.append('subject', `Név: ${name}`)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('website', noWebsite ? 'Nincs weboldala' : website)
    formData.append('challenges', challenges.join(', ') || 'Nem választott')
    formData.append('description', description || 'Nem írt leírást')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
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
      <section id="form" className="section section-screen section-center section-padded">
        <div className={styles.successWrap}>
          <div className="divider-v" />
          <p className="t-h2 c-white lh-tight-alt" style={{whiteSpace: 'nowrap'}}>
            Fejlődésre fel! <span className="cursive c-accent-l">:)</span>
          </p>
          <p className="t-lead c-muted">
            24–48 órán belül személyesen visszajelzek.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="form" ref={sectionRef} className="section section-screen section-center section-padded">
      <div className="reveal divider-v mb-lg" />

      <div className={`reveal ${styles.header}`}>
        <p className="t-h2 c-white lh-tighter max-w-title">
          Kérem a díjmentes{' '}
          <span className="cursive c-body">auditot</span>
        </p>
        <p className="t-lead reveal reveal-delay-1 c-dim mt-sm max-w-sub">
          2 perc kitölteni. 48 órán belül küldöm a személyes elemzésed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formBody}>

        <div className="form-field reveal reveal-delay-1">
          <label>Mi a weboldalad címe?</label>
          <input
            className="form-input"
            type="text"
            placeholder="pelda.hu"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            disabled={noWebsite}
          />
          <div
            className={styles.noWebsite}
            onClick={() => { setNoWebsite(prev => !prev); if (!noWebsite) setWebsite('') }}
          >
            <span className={`${styles.check}${noWebsite ? ` ${styles.checked}` : ''}`} />
            <span className="t-tiny c-dim">Nincs weboldalam</span>
          </div>
        </div>

        <div className="form-field reveal reveal-delay-1">
          <label>Mi a legnagyobb kihívásod? (több is lehet)</label>
          <div className={`checkbox-group ${styles.optionGroup}`}>
            {CHALLENGES.map(c => (
              <div key={c} className={`checkbox-option${challenges.includes(c) ? ' selected' : ''}`} onClick={() => toggleChallenge(c)}>
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="form-field reveal reveal-delay-2">
          <label>Mivel foglalkozik a vállalkozásod, és mit szeretnél elérni?</label>
          <textarea
            ref={textareaRef}
            className="form-textarea"
            placeholder="Röviden: mivel foglalkozol, és mi a célod a következő hónapokban..."
            value={description}
            onChange={e => {
              setDescription(e.target.value)
              const ta = textareaRef.current
              if (ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px' }
            }}
            rows={1}
          />
        </div>

        <div className={`form-row reveal reveal-delay-3 ${styles.row}`}>
          <div className="form-field">
            <label>Neved</label>
            <input className="form-input" type="text" placeholder="Kovács János" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input className="form-input" type="email" placeholder="janos@cegneve.hu" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="reveal reveal-delay-3">
          <div className={styles.consent} onClick={() => setConsent(prev => !prev)}>
            <span className={`${styles.check}${consent ? ` ${styles.checked}` : ''}`} />
            <span className="t-tiny c-dim">
              Elolvastam és elfogadom az{' '}
              <Link href="/adatkezeles" target="_blank" className="contact-link" style={{ color: '#FF6102' }} onClick={e => e.stopPropagation()}>
                adatkezelési tájékoztatót
              </Link>
            </span>
          </div>
          <button type="submit" className="btn-primary" disabled={sending} style={{ marginTop: '1rem' }}>
            {sending ? 'Küldés...' : 'Kérem az auditot'}
          </button>
          {error && <p className="t-tiny" style={{ color: '#ff4444', marginTop: '0.5rem' }}>{error}</p>}
          <div className={styles.riskReversal}>
            <div className="scarcity-chip">
              <span className="scarcity-dot" />
              Havonta 5 vállalkozásnak
            </div>
            <p className="t-tiny c-faint mt-sm">
              Nem kötöd le magad. Nem küldök spamet. Egy személyes elemzést kapsz — ennyi.
            </p>
          </div>
        </div>

      </form>
    </section>
  )
}
