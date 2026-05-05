import { useCallback, useMemo, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { perfectFifth, noteShort } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './ReglaQuinta.module.css';

const ARPEGGIO_GAP_MS = 250;
const NOTE_DURATION = 1.4;

// §1.8 exception in sharp notation:
// B (natural tonic) → 5J = F♯ (not F natural that the "natural-copies-natural" rule would suggest).
const EXCEPTION_TONICS = new Set<ChromaticNote>(['B']);

interface FifthRow {
  tonic: ChromaticNote;
  fifthSpelled: string;
  fifthChromatic: ChromaticNote;
  fifthOctave: number;
  isException: boolean;
}

export default function ReglaQuinta() {
  const { playNote } = useAudioEngine();
  const [playingTonic, setPlayingTonic] = useState<ChromaticNote | null>(null);

  const rows = useMemo<FifthRow[]>(
    () =>
      ALL.map((tonic) => {
        const fifth = perfectFifth(tonic);
        return {
          tonic,
          fifthSpelled: fifth.spelled,
          fifthChromatic: fifth.chromatic,
          fifthOctave: fifth.octave,
          isException: EXCEPTION_TONICS.has(tonic),
        };
      }),
    [],
  );

  const handlePlay = useCallback(
    (row: FifthRow) => {
      if (playingTonic) return;
      setPlayingTonic(row.tonic);
      playNote(row.tonic, 4, NOTE_DURATION);
      setTimeout(
        () => playNote(row.fifthChromatic, row.fifthOctave, NOTE_DURATION),
        ARPEGGIO_GAP_MS,
      );
      setTimeout(() => setPlayingTonic(null), ARPEGGIO_GAP_MS + NOTE_DURATION * 1000);
    },
    [playNote, playingTonic],
  );

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {rows.map((row) => (
          <li
            key={row.tonic}
            className={row.isException ? styles.rowException : styles.row}
          >
            {row.isException && (
              <span className={styles.exceptionTag}>Excepción</span>
            )}
            <FifthNode chromatic={row.tonic} spelled={noteShort(row.tonic)} role="tonic" />
            <span className={styles.arrow} aria-hidden="true">→</span>
            <FifthNode
              chromatic={row.fifthChromatic}
              spelled={row.fifthSpelled}
              role="fifth"
            />
            <button
              className={styles.playBtn}
              onClick={() => handlePlay(row)}
              disabled={playingTonic !== null}
              aria-label={`Escuchar ${NOTE_ES[row.tonic]} y su quinta justa ${row.fifthSpelled}`}
            >
              ▶
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FifthNodeProps {
  chromatic: ChromaticNote;
  spelled: string;
  role: 'tonic' | 'fifth';
}

function FifthNode({ chromatic, spelled, role }: FifthNodeProps) {
  return (
    <div className={role === 'tonic' ? styles.nodeTonic : styles.nodeFifth}>
      <svg viewBox="0 0 56 56" className={styles.nodeSvg} aria-hidden="true">
        <circle cx={28} cy={28} r={22} fill={NOTE_COLORS[chromatic]} />
        <text x={28} y={30} className={styles.nodeLetter}>
          {spelled}
        </text>
      </svg>
      <span className={styles.nodeName}>{NOTE_ES[chromatic]}</span>
    </div>
  );
}
