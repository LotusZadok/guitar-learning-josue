import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ProgresionIIVI from '../../../primitives/ProgresionIIVI/ProgresionIIVI';
import styles from './ProgresionMenorSection.module.css';

// 3.10 · Progresiones armónicas en escala menor (ii°-V7-i). Reutiliza
// ProgresionIIVI (§3.7): misma primitiva, con la relativa menor natural y la
// sensible elevada del V7 (menor armónica) en vez de ii-V-I mayor.
export default function ProgresionMenorSection() {
  const { t } = useTranslation();
  const functions = t('t3.s310.functions', { returnObjects: true }) as string[];

  return (
    <section id="s-t3-progresion-menor" className={styles.section}>
      <SectionLabel text={t('t3.s310.label')} />
      <h2>{t('t3.s310.title')}</h2>

      <p className={styles.text}>{t('t3.s310.intro')}</p>

      <ProgresionIIVI functions={functions} relativeMinor />

      <p className={styles.text}>{t('t3.s310.explain')}</p>
    </section>
  );
}
