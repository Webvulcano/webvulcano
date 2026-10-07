'use client'
import { useState } from 'react'
import styles from './ContactForm.module.css'

const SIMPLYFORMS_ENDPOINT = 'https://api.simplyforms.app/v1/forms/VYZTnfTQ7dZffdCqFcvxSA'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const res = await fetch(SIMPLYFORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
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
      <section id="kapcsolat" className="section section-padded">
        <div className={styles.successWrap}>
          <p className="t-h2 c-white lh-tight-alt">Köszi az üzenetet!</p>
          <p className="t-lead c-muted">Hamarosan jelentkezem.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="kapcsolat" className="section section-padded">
      <h2 className="t-h2 c-white lh-tighter max-w-title mb-lg">Írj nekem</h2>

      <form onSubmit={handleSubmit} className={styles.formBody}>
        <div className={`form-row ${styles.row}`}>
          <div className="form-field">
            <label>Neved</label>
            <input className="form-input" type="text" placeholder="Kovács János" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input className="form-input" type="email" placeholder="janos@cegneve.hu" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="form-field">
          <label>Telefonszám</label>
          <input className="form-input" type="tel" placeholder="+36 20 123 4567" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Üzenet</label>
          <textarea
            className="form-textarea"
            placeholder="Miben segíthetek?"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? 'Küldés...' : 'Küldés'}
        </button>
        {error && <p className="t-tiny" style={{ color: '#ff4444', marginTop: '0.5rem' }}>{error}</p>}
      </form>
    </section>
  )
}
