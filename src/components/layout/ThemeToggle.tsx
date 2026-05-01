import { useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={styles.wrap} onClick={toggleTheme}>
      <span className={styles.label}>{theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
      <div className={theme === 'light' ? styles.toggleOn : styles.toggle} />
    </div>
  );
}
