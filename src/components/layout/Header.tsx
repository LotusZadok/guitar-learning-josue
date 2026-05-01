import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

const LANGUAGES = ['es', 'de'] as const;

export default function Header() {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage ?? i18n.language;

  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>Referencia Musical · Guitarra Eléctrica / Acústica</div>
      <h1 className={styles.title}>
        Apuntes de<br /><span>Guitarra</span>
      </h1>
      <div className={styles.sub}>"Las notas no suben — la mano baja"</div>
      <div className={styles.langSwitch}>
        {LANGUAGES.map((lng) => (
          <button
            key={lng}
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            className={currentLang === lng ? styles.langActive : styles.lang}
            aria-pressed={currentLang === lng}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
