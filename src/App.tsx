import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LockScreen from './auth/LockScreen'
import AppShell from './components/layout/AppShell'
import T1Module from './components/modules/t1/T1Module'
import T2Module from './components/modules/t2/T2Module'
import T3Module from './components/modules/t3/T3Module'
import T4Module from './components/modules/t4/T4Module'
import './i18n'
import './global.css'

export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    // Con el almacenamiento bloqueado, getItem tira: se pide la contraseña en vez de pantalla en blanco.
    try {
      return localStorage.getItem('site-unlocked') === 'true'
    } catch {
      return false
    }
  })

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/t1" replace />} />
        <Route path="/t1/*" element={<T1Module />} />
        <Route path="/t2/*" element={<T2Module />} />
        <Route path="/t3/*" element={<T3Module />} />
        <Route path="/t4/*" element={<T4Module />} />
        <Route path="*" element={<Navigate to="/t1" replace />} />
      </Routes>
    </AppShell>
  )
}
