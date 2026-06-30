import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import IntervalRuler, { type RulerStop } from '../../../primitives/IntervalRuler/IntervalRuler';
import styles from './SegundaCuartaSection.module.css';

// 3.3.1 · Segunda mayor y cuarta justa (recap). Los dos intervalos que van a
// reemplazar la tercera para formar los suspendidos (§3.3). Datos del source of
// truth de T3.
const ROWS = [
  { role: '2M', semis: 2, code: 'sus2' },
  { role: '4J', semis: 5, code: 'sus4' },
] as const;

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
  const h = t('t3.s331.table_headers', { returnObjects: true }) as Record<string, string>;

  return (
    <section id="s-t3-segunda-cuarta" className={styles.section}>
      <SectionLabel text={t('t3.s331.label')} />
      <h2>{t('t3.s331.title')}</h2>

      <p className={styles.text}>{t('t3.s331.intro')}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{h.interval}</th>
              <th scope="col">{h.semitones}</th>
              <th scope="col">{h.use}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.role}>
                <th scope="row">{r.role}</th>
                <td>{r.semis}</td>
                <td>{r.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IntervalRuler stops={RULER_STOPS} maxSemis={7} ariaLabel={t('t3.s331.ruler_aria')} />
      <p className={styles.caption}>{t('t3.s331.legend')}</p>
    </section>
  );
}
