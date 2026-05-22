import { useTranslation } from 'react-i18next';
import { EXCEPCION_F_COMPLETA, EXCEPCION_F_COMPLETA_DE } from '../data/literalContent';
import styles from './FExceptionBanner.module.css';

export default function FExceptionBanner() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const text = isDe ? EXCEPCION_F_COMPLETA_DE : EXCEPCION_F_COMPLETA;
  const title = isDe ? 'Ausnahme' : 'Excepción';

  return (
    <div className={styles.banner}>
      <strong className={styles.title}>{title}</strong>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
