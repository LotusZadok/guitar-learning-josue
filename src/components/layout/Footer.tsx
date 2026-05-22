import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export default function Footer() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  return (
    <footer className={styles.footer}>
      <div className={styles.text}>
        {isDe ? 'Gitarren-Notizen · Persönliche Referenz' : 'Apuntes Guitarra · Referencia Personal'}
      </div>
      <div className={styles.text}>
        {isDe ? 'EADGBE · 12 Töne · CAGED-System' : 'EADGBE · 12 Notas · Sistema CAGED'}
      </div>
    </footer>
  );
}
