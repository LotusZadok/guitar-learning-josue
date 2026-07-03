import { useTranslation } from 'react-i18next';
import styles from './FExceptionBanner.module.css';

export default function FExceptionBanner() {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const text = t('t2.s43.f_exception');
  const title = isDe ? 'Ausnahme' : 'Excepción';

  return (
    <div className={styles.banner}>
      <strong className={styles.title}>{title}</strong>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
