import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const labelDark = isDe ? 'Dunkel' : 'Oscuro';
  const labelLight = isDe ? 'Hell' : 'Claro';

  return (
    <div className={styles.wrap} onClick={toggleTheme}>
      <span className={styles.label}>{theme === 'dark' ? labelDark : labelLight}</span>
      <div className={theme === 'light' ? styles.toggleOn : styles.toggle} />
    </div>
  );
}
