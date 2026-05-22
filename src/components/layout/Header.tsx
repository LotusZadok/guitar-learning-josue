import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

export default function Header() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>
        {isDe ? 'E-Gitarre / Akustikgitarre' : 'Guitarra Eléctrica / Acústica'}
      </div>
      <h1 className={styles.title}>
        {isDe ? (
          <>Gitarren-<br /><span>theorie</span></>
        ) : (
          <>Teoría de<br /><span>Guitarra</span></>
        )}
      </h1>
    </header>
  );
}
