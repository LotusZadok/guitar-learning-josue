import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LockScreen.module.css'

const CORRECT_HASH =
  '0c7039d7128c3899d661eb3602ea6baa1330d2c4f0d1b6a0f59c9238f48348e9'

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

type Props = {
  onUnlock: () => void
}

export default function LockScreen({ onUnlock }: Props) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const hash = await sha256Hex(password)
    if (hash === CORRECT_HASH) {
      localStorage.setItem('site-unlocked', 'true')
      onUnlock()
    } else {
      setError(true)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.wrapper}>
      <div className={styles.identity}>
        <span className={styles.identityEyebrow}>Apuntes de</span>
        <span className={styles.identityTitle}>Guitarra</span>
        <span className={styles.identitySubtitle}>Prof. Josué Barquero</span>
      </div>
      <form className={styles.card} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="lock-password">
          {t('lock.prompt')}
        </label>
        <input
          id="lock-password"
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError(false)
          }}
          autoFocus
        />
        {error && <p className={styles.error} role="alert">{t('lock.error')}</p>}
        <button
          className={styles.button}
          type="submit"
          disabled={submitting || password.length === 0}
        >
          {t('lock.submit')}
        </button>
      </form>
      </div>
    </div>
  )
}
