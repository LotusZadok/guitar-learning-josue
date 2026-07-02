import { useCallback, useMemo, useRef, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { secondaryDominants, type ChordAudio } from '../../../utils/noteCalculations';
import styles from './DominantesSecundarias.module.css';

const NOTE_DURATION = 1.3;
const ARPEGGIO_GAP_MS = 130;
const CHORD_GAP_MS = 700;

// §3.8 · Las 5 dominantes secundarias (V/x → grado tonizado). Cada fila reproduce
// la dominante y su resolución al grado, mostrando que cualquier grado puede
// tratarse como una tónica temporal. Datos vía Tonal.js (secondaryDominants).
export default function DominantesSecundarias() {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [active, setActive] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rows = useMemo(() => secondaryDominants(tonic), [tonic]);

  const playChord = useCallback(
    (chord: ChordAudio, delay: number) => {
      chord.members.forEach((m, i) => {
        const t = setTimeout(
          () => playNote(m.chromatic, m.octave, NOTE_DURATION),
          delay + i * ARPEGGIO_GAP_MS,
        );
        timers.current.push(t);
      });
    },
    [playNote],
  );

  const playRow = useCallback(
    (idx: number) => {
      if (active !== null) return;
      setActive(idx);
      timers.current.forEach(clearTimeout);
      timers.current = [];
      playChord(rows[idx].dom, 0);
      playChord(rows[idx].target, CHORD_GAP_MS);
      const end = setTimeout(() => setActive(null), CHORD_GAP_MS + NOTE_DURATION * 1000);
      timers.current.push(end);
    },
    [active, playChord, rows],
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
            <span className={styles.notation}>{r.notation}</span>
            <span className={styles.dom}>{r.dom.cifrado}</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
            <span className={styles.target}>{r.target.cifrado}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
