import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import GradosArmonicos from '../../../primitives/GradosArmonicos/GradosArmonicos';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  GRADOS_PROCEDIMIENTO_PASOS,
  GRADOS_PRIMITIVA_INSTRUCCION,
  GRADOS_NOMBRE_CARACTER,
} from '../data/literalContent';
import styles from './GradosArmonicosSection.module.css';

export default function GradosArmonicosSection() {
  const { t } = useTranslation();
  const tonalidad = useUIStore((s) => s.tonic);

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t2.s47.label')} />
      <h2>{t('t2.s47.title')}</h2>

      <p className={styles.text}>{t('t2.s47.symmetry')}</p>
      <p className={styles.text}>{t('t2.s47.fractality')}</p>

      <h3 className={styles.subheading}>{t('t2.s47.procedure_title')}</h3>
      {/* TODO i18n: sin clave — GRADOS_PROCEDIMIENTO_PASOS (array de 3 pasos) no mapea a de.json s47.steps */}
      <ol className={styles.pasos}>
        {GRADOS_PROCEDIMIENTO_PASOS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      {/* TODO i18n: sin clave — GRADOS_PRIMITIVA_INSTRUCCION */}
      <p className={styles.text}>{GRADOS_PRIMITIVA_INSTRUCCION}</p>

      <GradosArmonicos tonalidad={tonalidad} />

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
            {GRADOS_NOMBRE_CARACTER.map((g) => {
              const degreeKey = g.roman.replace('°', '');
              return (
                <tr key={g.roman}>
                  <td className={styles.romanCell}>{g.roman}</td>
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
