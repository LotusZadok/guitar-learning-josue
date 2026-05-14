import { useMemo } from 'react';
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
  INTERVALOS_DEF,
  INTERVALOS_CALIDAD,
  INTERVALOS_13_HEAD,
  INTERVALOS_13_ROW,
  INTERVALOS_PROCEDIMIENTO_TITULO,
  INTERVALOS_PROCEDIMIENTO_PASOS,
  INTERVALOS_RESULTADO_G,
  INTERVALOS_OCTAVA,
} from '../data/literalContent';
import styles from './IntervalosSection.module.css';

// Grade labels for the dynamic scale example (T = tónica; grados romanos invariantes).
const GRADE_LABELS = ['T', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

function renderStep(step: string | ProseSegment) {
  return typeof step === 'string' ? step : <Prose segment={step} />;
}

export default function IntervalosSection() {
  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);
  const spelledScale = useMemo(() => majorScaleSpelled(tonic), [tonic]);

  return (
    <section className={styles.section}>
      <SectionLabel text="03 · Intervalos" />
      <h2>Los 13 intervalos posibles dentro de una octava</h2>

      <p className={styles.text}>{INTERVALOS_DEF}</p>

      {/* Selector global de tónica — reemplaza la tabla estática T/2/.../8 */}
      <NoteSelector
        notes={[...ALL]}
        selected={tonic}
        onSelect={(n) => setTonic(n as ChromaticNote)}
      />

      {/* Fila de ejemplo dinámica: notas de la escala mayor para la tónica activa */}
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

      <p className={styles.text}>{INTERVALOS_CALIDAD}</p>

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

      <h3 className={styles.subheading}><Prose segment={INTERVALOS_PROCEDIMIENTO_TITULO} /></h3>
      <ol className={styles.steps}>
        {INTERVALOS_PROCEDIMIENTO_PASOS.map((p, i) => (
          <li key={i}>{renderStep(p)}</li>
        ))}
      </ol>

      <p className={styles.resultado}><Prose segment={INTERVALOS_RESULTADO_G} /></p>
      <p className={styles.text}><Prose segment={INTERVALOS_OCTAVA} /></p>

      <IntervalsSection />
    </section>
  );
}
