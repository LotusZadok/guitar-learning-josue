import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import DominanteResolucion from '../../../primitives/DominanteResolucion/DominanteResolucion';
import styles from './DominanteSection.module.css';

// 3.6 · Dominante X7 (V7). El acorde de séptima sobre el 5º grado, su tritono
// interno, y la resolución V7 → I por conducción de voces.
export default function DominanteSection() {
  const { t } = useTranslation();

  return (
    <section id="s-t3-dominante" className={styles.section}>
      <SectionLabel text={t('t3.s36.label')} />
      <h2>{t('t3.s36.title')}</h2>

      <p className={styles.text}>{t('t3.s36.intro')}</p>

      <DominanteResolucion />

      <p className={styles.text}>{t('t3.s36.resolution')}</p>
    </section>
  );
}
