import { useCallback, useMemo, useState } from 'react';
import { useChordPlayer } from '../../../hooks/useChordPlayer';
import { useUIStore } from '../../../stores/useUIStore';
import { secondaryDominants } from '../../../utils/noteCalculations';
import styles from './DominantesSecundarias.module.css';

const NOTE_DURATION = 1.3;
const ARPEGGIO_GAP_MS = 130;
const CHORD_GAP_MS = 700;

// §3.8 · Las 5 dominantes secundarias (V/x → grado tonizado). Cada tarjeta reproduce
// la dominante y su resolución al grado, mostrando que cualquier grado puede
// tratarse como una tónica temporal. Datos vía Tonal.js (secondaryDominants).
export default function DominantesSecundarias() {
  const tonic = useUIStore((s) => s.tonic);
  const { playChord, at, clear } = useChordPlayer(NOTE_DURATION);
  const [active, setActive] = useState<number | null>(null);
  const rows = useMemo(() => secondaryDominants(tonic), [tonic]);

  const playRow = useCallback(
    (idx: number) => {
      if (active !== null) return;
      setActive(idx);
      clear();
      playChord(rows[idx].dom.members, ARPEGGIO_GAP_MS);
      playChord(rows[idx].target.members, ARPEGGIO_GAP_MS, CHORD_GAP_MS);
      at(() => setActive(null), CHORD_GAP_MS + NOTE_DURATION * 1000);
    },
    [active, playChord, at, clear, rows],
  );

  return (
    <ul className={styles.list}>
      {rows.map((r, i) => (
        <li key={r.notation}>
          <button
            type="button"
            className={`${styles.row} ${active === i ? styles.rowActive : ''}`}
            onClick={() => playRow(i)}
            disabled={active !== null}
            aria-label={`${r.dom.cifrado} resuelve a ${r.target.cifrado} (${r.notation})`}
          >
            <span className={styles.target}>{r.target.cifrado}</span>
            <span className={styles.arrow} aria-hidden="true">↑</span>
            <span className={styles.dom}>{r.dom.cifrado}</span>
            <span className={styles.notation}>{r.notation}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
