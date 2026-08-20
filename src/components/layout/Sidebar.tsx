import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import { TOC_SECTIONS } from '../../config/tocConfig';
import { useActiveSection } from '../../hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';
import MuteToggle from './MuteToggle';
import TonicSelector from './TonicSelector';
import OctaveSelector from './OctaveSelector';
import DynamicsSelector from './DynamicsSelector';
import styles from './Sidebar.module.css';

const SECTIONS = [
  { id: 't1', path: '/t1', labelKey: 'nav.t1' },
  { id: 't2', path: '/t2', labelKey: 'nav.t2' },
  { id: 't3', path: '/t3', labelKey: 'nav.t3' },
  { id: 't4', path: '/t4', labelKey: 'nav.t4' },
] as const;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('de') ? 'de' : 'es';
  const isDe = lang === 'de';
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const tocItems = TOC_SECTIONS[location.pathname] ?? [];
  const tocIds = useMemo(() => tocItems.map((s) => s.id), [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  const activeId = useActiveSection(tocIds);

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleTocClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={isDe ? 'Menü öffnen' : 'Abrir menú'}
      >
        ☰
      </button>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <nav className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          {isDe ? <>Gitarren-<span>theorie</span></> : <>Teoría de <span>Guitarra</span></>}
        </div>

        {SECTIONS.map((s) => (
          <div key={s.id}>
            <button
              className={isActive(s.path) ? styles.linkActive : styles.link}
              onClick={() => handleNav(s.path)}
            >
              {t(s.labelKey)}
            </button>
            {isActive(s.path) && tocItems.length > 0 && (
              <div className={styles.tocList}>
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    className={activeId === item.id ? styles.tocItemActive : styles.tocItem}
                    onClick={() => handleTocClick(item.id)}
                  >
                    {item.labelKey ? t(item.labelKey) : item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className={styles.themeArea}>
          <ThemeToggle />
          <MuteToggle />
          <DynamicsSelector />
          <TonicSelector />
          <OctaveSelector />
          <div className={styles.langWrap}>
            <span className={styles.langLabel}>{isDe ? 'SPRACHE' : 'IDIOMA'}</span>
            <div className={styles.langChips}>
              <button
                className={lang === 'es' ? styles.langChipActive : styles.langChip}
                onClick={() => i18n.changeLanguage('es')}
              >
                ES
              </button>
              <button
                className={lang === 'de' ? styles.langChipActive : styles.langChip}
                onClick={() => i18n.changeLanguage('de')}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
