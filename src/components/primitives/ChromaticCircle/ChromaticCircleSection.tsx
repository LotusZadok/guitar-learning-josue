import SectionLabel from '../../shared/SectionLabel';
import ChromaticNode from './ChromaticNode';
import { ALL } from '../../../data/notes';
import styles from './ChromaticCircle.module.css';

const CX = 200, CY = 200, R = 140;

export default function ChromaticCircleSection() {
  return (
    <div className={styles.section}>
      <SectionLabel text="03 — Notas" />
      <h2>Círculo Cromático</h2>
      <p style={{ marginBottom: 20 }}>12 notas en orden ascendente por semitonos.</p>
      <div className={styles.wrap}>
        <svg className={styles.svg} viewBox="0 0 400 400">
          <circle cx={CX} cy={CY} r={R + 16} fill="none" style={{ stroke: 'var(--rule)' }} strokeWidth={0.5} />
          {['Círculo', 'Cromático'].map((t, i) => (
            <text key={t} x={CX} y={CY - 8 + i * 18} textAnchor="middle" style={{ fill: 'var(--muted)' }} fontSize={11}>
              {t}
            </text>
          ))}
          {ALL.map((note, i) => (
            <ChromaticNode key={note} note={note} index={i} cx={CX} cy={CY} r={R} />
          ))}
        </svg>
      </div>
    </div>
  );
}
