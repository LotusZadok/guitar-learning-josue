import { useMemo } from 'react';
import SectionLabel from '../../../shared/SectionLabel';
import Prose from '../../../shared/Prose/Prose';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { useUIStore } from '../../../../stores/useUIStore';
import { chordSpelled } from '../../../../utils/noteCalculations';
import {
  ACORDES_INTRO,
  ACORDES_DEFINICIONES,
  ACORDES_DIFF,
  ACORDES_NOMENCLATURA_INTRO,
  ACORDES_NOMENCLATURA,
  ACORDES_PROCEDIMIENTO_TITULO,
  ACORDES_PROCEDIMIENTO_PASOS,
  ACORDES_EJEMPLO_PASOS,
  ACORDES_PRIMITIVA_TITULO,
} from '../data/literalContent';
import styles from './AcordesSection.module.css';

export default function AcordesSection() {
  const tonic = useUIStore((s) => s.tonic);
  const chordM = useMemo(() => chordSpelled(tonic, 'M'), [tonic]);
  const chordm = useMemo(() => chordSpelled(tonic, 'm'), [tonic]);

  return (
    <section className={styles.section}>
      <SectionLabel text="07 · Acordes" />
      <h2>Acordes mayores y menores</h2>

      <p className={styles.text}>{ACORDES_INTRO}</p>

      <ul className={styles.defList}>
        {ACORDES_DEFINICIONES.map((d) => (
          <li key={d.tipo}>
            <strong>{d.tipo}</strong> = <span className={styles.formula}>{d.formula}</span> · {d.desc}
          </li>
        ))}
      </ul>

      <p className={styles.text}>{ACORDES_DIFF}</p>

      <h3 className={styles.subheading}>{ACORDES_NOMENCLATURA_INTRO}</h3>
      <ul className={styles.nomList}>
        {ACORDES_NOMENCLATURA.map((n) => (
          <li key={n.regla}>
            <strong>{n.regla}:</strong>{' '}
            {typeof n.desc === 'string' ? n.desc : <Prose segment={n.desc} />}
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{ACORDES_PROCEDIMIENTO_TITULO}</h3>
      <ol className={styles.steps}>
        {ACORDES_PROCEDIMIENTO_PASOS.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{tonic} mayor</h3>
      <ol className={styles.steps}>
        {ACORDES_EJEMPLO_PASOS.map((p, i) => (
          <li key={i}><Prose segment={p} /></li>
        ))}
      </ol>

      <p className={styles.resultado}>
        {tonic} mayor = {chordM.map((m) => m.spelled).join('  ')}
      </p>
      <p className={styles.text}>
        {tonic} menor = {chordm.map((m) => m.spelled).join('  ')}
      </p>

      <h3 className={styles.subheading}>{ACORDES_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>
        Tónica activa: <strong>{tonic}</strong> · elegí una calidad (mayor o menor) para construir el acorde. Escuchalo bloque o arpegiado.
      </p>
      <AcordesBuilder />
    </section>
  );
}
