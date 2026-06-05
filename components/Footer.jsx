'use client'
import { useState } from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText('info@webvulcano.hu')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <footer className={styles.footer}>
      <p className="t-tiny c-faint">© 2026 webvulcano</p>
      <p className="t-tiny c-faint" style={{ position: 'relative' }}>
        kapcsolat:{' '}
        <span className={styles.email} onClick={copyEmail}>
          info@webvulcano.hu
          {copied && <span className={styles.tooltip}>✓ Másolva</span>}
        </span>
      </p>
    </footer>
  )
}
