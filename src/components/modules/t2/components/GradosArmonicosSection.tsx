import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import GradosArmonicos from '../../../primitives/GradosArmonicos/GradosArmonicos';
import { useUIStore } from '../../../../stores/useUIStore';
import styles from './GradosArmonicosSection.module.css';

// Datos musicales (§2.6): los números romanos de los 7 grados, no UI copy.
// Nombre y carácter de cada grado vienen de i18n (degree_names/degree_characters).
const ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;

export default function GradosArmonicosSection() {
  const { t } = useTranslation();
  const tonalidad = useUIStore((s) => s.tonic);
  const pasos = t('t2.s47.procedure', { returnObjects: true }) as string[];
  const primitivaInstruccion = t('t2.s47.instruction');

  return (
    <section id="s-t2-grados" className={styles.section}>
      <SectionLabel text={t('t2.s47.label')} />
      <h2>{t('t2.s47.title')}</h2>

      <p className={styles.text}>{t('t2.s47.symmetry')}</p>
      <p className={styles.text}>{t('t2.s47.fractality')}</p>

      <h3 className={styles.subheading}>{t('t2.s47.procedure_title')}</h3>
      <ol className={styles.pasos}>
        {pasos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      <p className={styles.text}>{primitivaInstruccion}</p>

      <GradosArmonicos tonalidad={tonalidad} maxStep={3} />

      <p className={styles.patron}>{t('t2.s47.pattern')}</p>

      <h3 className={styles.subheading}>{t('t2.s47.table_title')}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.caracterTable}>
          <thead>
            <tr>
              <th scope="col">{t('t2.s47.table_headers.degree')}</th>
              <th scope="col">{t('t2.s47.table_headers.name')}</th>
              <th scope="col">{t('t2.s47.table_headers.character')}</th>
            </tr>
          </thead>
          <tbody>
            {ROMANS.map((roman, idx) => {
              const degreeKey = roman.replace('°', '');
              // Reunión 24/5/26: formato armónico (I/vi = reposo, ii/iii = medio,
              // IV = medio-tenso, V/vii = tenso).
              const harmonic =
                idx === 0 || idx === 5 ? 'stable'      :
                idx === 1 || idx === 2 ? 'medium'      :
                idx === 3              ? 'mediumTense' :
                                         'tense';
              return (
                <tr key={roman} data-harmonic={harmonic}>
                  <td className={styles.romanCell}>{roman}</td>
                  <td>{t(`t2.s47.degree_names.${degreeKey}` as never)}</td>
                  <td className={styles.caracterCell}>{t(`t2.s47.degree_characters.${degreeKey}` as never)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t2.s47.analysis_stable')}</p>
      <p className={styles.text}>{t('t2.s47.analysis_tense')}</p>
      <p className={styles.text}>{t('t2.s47.analysis_medium')}</p>
      <p className={styles.text}>{t('t2.s47.analysis_iv')}</p>

      <RuleNote>{t('t2.s47.tip')}</RuleNote>
    </section>
  );
}
