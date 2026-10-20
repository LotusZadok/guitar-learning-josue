import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import IntervalRuler, { type RulerStop } from '../../../primitives/IntervalRuler/IntervalRuler';
import styles from './SegundaCuartaSection.module.css';

// 3.3.1 · Segunda mayor y cuarta justa (recap). Los dos intervalos que van a
// reemplazar la tercera para formar los suspendidos (§3.3).

// Regla: T → 2 → [3m, 3M de referencia] → 4 → 5J. La 2ª y la 4ª flanquean la
// tercera (que reemplazarán); las terceras se muestran atenuadas como referencia.
const RULER_STOPS: RulerStop[] = [
  { role: 'T', number: 1, quality: 'P', semis: 0 },
  { role: '2', number: 2, quality: 'M', semis: 2, showSemis: true },
  { role: '3m', number: 3, quality: 'm', semis: 3, reference: true },
  { role: '3M', number: 3, quality: 'M', semis: 4, reference: true },
  { role: '4', number: 4, quality: 'P', semis: 5, showSemis: true },
  { role: '5', number: 5, quality: 'P', semis: 7 },
];

export default function SegundaCuartaSection() {
  const { t } = useTranslation();

  return (
    <section id="s-t3-segunda-cuarta" className={styles.section}>
      <SectionLabel text={t('t3.s331.label')} />
      <h2>{t('t3.s331.title')}</h2>

      <p className={styles.text}>{t('t3.s331.intro')}</p>

      <IntervalRuler stops={RULER_STOPS} maxSemis={7} ariaLabel={t('t3.s331.ruler_aria')} />
      <RuleNote>{t('t3.s331.legend')}</RuleNote>
    </section>
  );
}
