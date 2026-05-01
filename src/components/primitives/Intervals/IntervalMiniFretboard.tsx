import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL } from '../../../data/notes';
import { INTERVAL_FB_POINTS } from '../../../data/intervals';
import { noteAtFret } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './Intervals.module.css';

interface Props {
  root: ChromaticNote;
}

export default function IntervalMiniFretboard({ root }: Props) {
  const { playNote } = useAudioEngine();
  const rootFret = (ALL.indexOf(root) - ALL.indexOf('E') + 12) % 12;

  return (
    <div className={styles.fbWrap}>
      <div className={styles.fb}>
        <div className={styles.nut} />
        {Array.from({ length: 15 }, (_, f) => {
          const point = INTERVAL_FB_POINTS.find((p) => p.offset + rootFret === f);
          const info = noteAtFret('E', 2, f);
          return (
            <div key={f} className={styles.fret}>
              <span className={styles.fretNum}>{f}</span>
              {point && (
                <div
                  className={styles.dot}
                  style={{ background: point.color }}
                  onClick={() => playNote(info.note, 2, 2)}
                >
                  {point.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
