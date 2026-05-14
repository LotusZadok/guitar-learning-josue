import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import ThemeToggle from './ThemeToggle';
import MuteToggle from './MuteToggle';
import TonicSelector from './TonicSelector';
import styles from './Sidebar.module.css';

const SECTIONS = [
  { id: 't1', path: '/t1', labelKey: 'nav.t1' },
  { id: 't2', path: '/t2', labelKey: 'nav.t2' },
] as const;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <nav className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          Apuntes de <span>Guitarra</span>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={isActive(s.path) ? styles.linkActive : styles.link}
            onClick={() => handleNav(s.path)}
          >
            {t(s.labelKey)}
          </button>
        ))}
        <div className={styles.themeArea}>
          <ThemeToggle />
          <MuteToggle />
          <TonicSelector />
        </div>
      </nav>
    </>
  );
}
