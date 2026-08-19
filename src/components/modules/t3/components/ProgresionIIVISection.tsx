import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ProgresionIIVI from '../../../primitives/ProgresionIIVI/ProgresionIIVI';
import styles from './ProgresionIIVISection.module.css';

// 3.7 · ii-V-I (mayor). La progresión más característica de la música tonal:
// subdominante → dominante → tónica.
export default function ProgresionIIVISection() {
  const { t } = useTranslation();
  const functions = t('t3.s37.functions', { returnObjects: true }) as string[];

  return (
    <section id="s-t3-ii-v-i" className={styles.section}>
      <SectionLabel text={t('t3.s37.label')} />
      <h2>{t('t3.s37.title')}</h2>

      <p className={styles.text}>{t('t3.s37.intro')}</p>

      <ProgresionIIVI functions={functions} />

      <p className={styles.text}>{t('t3.s37.explain')}</p>
    </section>
  );
}
