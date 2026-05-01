import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate } from 'react-router-dom'
import LockScreen from './auth/LockScreen'
import './i18n'
import './global.css'

export default function App() {
  const { t } = useTranslation()
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem('site-unlocked') === 'true'
  )

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.06em',
        }}
      >
        {t('site.title')}
      </header>
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-xl)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--muted)' }}>Sitio en desarrollo</p>
        <Routes>
          <Route path="/" element={<Navigate to="/t1" replace />} />
          <Route path="/t1/*" element={<div>{t('nav.t1')}</div>} />
          <Route path="/t2/*" element={<div>{t('nav.t2')}</div>} />
        </Routes>
      </main>
    </div>
  )
}
