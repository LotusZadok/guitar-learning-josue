import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import NoteSelector from '../../../shared/NoteSelector';
import Prose from '../../../shared/Prose/Prose';
import IntervalsSection from '../../../primitives/Intervals/IntervalsSection';
import { useUIStore } from '../../../../stores/useUIStore';
import { ALL } from '../../../../data/notes';
import { majorScaleSpelled } from '../../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import {
  INTERVALOS_13_HEAD,
  INTERVALOS_13_ROW,
  INTERVALOS_PROCEDIMIENTO_TITULO,
  INTERVALOS_PROCEDIMIENTO_TITULO_DE,
  INTERVALOS_PROCEDIMIENTO_PASOS,
  INTERVALOS_PROCEDIMIENTO_PASOS_DE,
  INTERVALOS_RESULTADO_G,
  INTERVALOS_RESULTADO_G_DE,
  INTERVALOS_OCTAVA,
  INTERVALOS_OCTAVA_DE,
} from '../data/literalContent';
import styles from './IntervalosSection.module.css';

const GRADE_LABELS = ['T', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

function renderStep(step: string | ProseSegment) {
  return typeof step === 'string' ? step : <Prose segment={step} />;
}

export default function IntervalosSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);
  const spelledScale = useMemo(() => majorScaleSpelled(tonic), [tonic]);

  const procedimientoTitulo = locale === 'de'
    ? INTERVALOS_PROCEDIMIENTO_TITULO_DE
    : INTERVALOS_PROCEDIMIENTO_TITULO;
  const procedimientoPasos = locale === 'de'
    ? INTERVALOS_PROCEDIMIENTO_PASOS_DE
    : INTERVALOS_PROCEDIMIENTO_PASOS;
  const resultadoG = locale === 'de' ? INTERVALOS_RESULTADO_G_DE : INTERVALOS_RESULTADO_G;
  const octava = locale === 'de' ? INTERVALOS_OCTAVA_DE : INTERVALOS_OCTAVA;

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t1.s04.label')} />
      <h2>{t('t1.s04.title')}</h2>

      <p className={styles.text}>{t('t1.s04.intro')}</p>

      <NoteSelector
        notes={[...ALL]}
        selected={tonic}
        onSelect={(n) => setTonic(n as ChromaticNote)}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {GRADE_LABELS.map((g) => (
                <th key={g} scope="col">{g}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {spelledScale.map((n, i) => (
                <td key={i}>{n}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t1.s04.quality_intro')}</p>

      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.tableIntervals}`}>
          <thead>
            <tr>
              {INTERVALOS_13_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {INTERVALOS_13_ROW.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{c}</th>
                ) : (
                  <td key={i}>{c}</td>
                ),
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className={styles.subheading}><Prose segment={procedimientoTitulo} /></h3>
      <ol className={styles.steps}>
        {procedimientoPasos.map((p, i) => (
          <li key={i}>{renderStep(p)}</li>
        ))}
      </ol>

      <p className={styles.resultado}><Prose segment={resultadoG} /></p>
      <p className={styles.text}><Prose segment={octava} /></p>

      <IntervalsSection />
    </section>
  );
}
