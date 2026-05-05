import { EXCEPCION_F_COMPLETA } from '../data/literalContent';
import styles from './FExceptionBanner.module.css';

export default function FExceptionBanner() {
  return (
    <div className={styles.banner}>
      <strong className={styles.title}>Excepción</strong>
      <p className={styles.text}>{EXCEPCION_F_COMPLETA}</p>
    </div>
  );
}
