import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import Prose from '../../../shared/Prose/Prose';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { useUIStore } from '../../../../stores/useUIStore';
import { chordSpelled } from '../../../../utils/noteCalculations';
import {
  ACORDES_EJEMPLO_PASOS,
  ACORDES_EJEMPLO_PASOS_DE,
} from '../data/literalContent';
import styles from './AcordesSection.module.css';

export default function AcordesSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const chordM = useMemo(() => chordSpelled(tonic, 'M'), [tonic]);
  const chordm = useMemo(() => chordSpelled(tonic, 'm'), [tonic]);

  const ejemploPasos = locale === 'de' ? ACORDES_EJEMPLO_PASOS_DE : ACORDES_EJEMPLO_PASOS;
  const procedure = t('t1.s07.procedure', { returnObjects: true }) as string[];

  return (
    <section id="s-acordes" className={styles.section}>
      <SectionLabel text={t('t1.s07.label')} />
      <h2>{t('t1.s07.title')}</h2>

      <p className={styles.text}>{t('t1.s07.intro')}</p>

      <ul className={styles.defList}>
        <li>{t('t1.s07.major_def')}</li>
        <li>{t('t1.s07.minor_def')}</li>
      </ul>

      <p className={styles.text}>{t('t1.s07.comparison')}</p>

      <h3 className={styles.subheading}>{t('t1.s07.notation_title')}</h3>
      <ul className={styles.nomList}>
        <li>{t('t1.s07.notation_major')}</li>
        <li>{t('t1.s07.notation_minor')}</li>
      </ul>

      <h3 className={styles.subheading}>{t('t1.s07.procedure_title')}</h3>
      <ol className={styles.steps}>
        {procedure.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{tonic} {t('common.major')}</h3>
      <ol className={styles.steps}>
        {ejemploPasos.map((p, i) => (
          <li key={i}><Prose segment={p} /></li>
        ))}
      </ol>

      <p className={styles.resultado}>
        {tonic} {t('common.major')} = {chordM.map((m) => m.spelled).join('  ')}
      </p>
      <p className={styles.text}>
        {tonic} {t('common.minor')} = {chordm.map((m) => m.spelled).join('  ')}
      </p>

      {/* TODO i18n: sin clave — ACORDES_PRIMITIVA_TITULO e instrucción */}
      <h3 className={styles.subheading}>Constructor de acordes</h3>
      <p className={styles.text}>
        Tónica activa: <strong>{tonic}</strong> · elegí una calidad (mayor o menor) para construir el acorde. Escuchalo bloque o arpegiado.
      </p>
      <AcordesBuilder />
    </section>
  );
}
