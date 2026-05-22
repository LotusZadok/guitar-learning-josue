import { useCallback, useMemo, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { perfectFifth, noteShort } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './ReglaQuinta.module.css';

const ARPEGGIO_GAP_MS = 250;
const NOTE_DURATION = 1.4;

const EXCEPTION_TONICS = new Set<ChromaticNote>(['B']);

interface FifthRow {
  tonic: ChromaticNote;
  fifthSpelled: string;
  fifthChromatic: ChromaticNote;
  fifthOctave: number;
  isException: boolean;
}

// Tracks which row + which step (tonic / fifth) is currently playing
interface PlayingState {
  tonic: ChromaticNote;
  step: 'tonic' | 'fifth';
}

export default function ReglaQuinta() {
  const { playNote } = useAudioEngine();
  const [playing, setPlaying] = useState<PlayingState | null>(null);

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
      if (playing) return;
      setPlaying({ tonic: row.tonic, step: 'tonic' });
      playNote(row.tonic, 4, NOTE_DURATION);
      setTimeout(() => {
        setPlaying({ tonic: row.tonic, step: 'fifth' });
        playNote(row.fifthChromatic, row.fifthOctave, NOTE_DURATION);
      }, ARPEGGIO_GAP_MS);
      setTimeout(() => setPlaying(null), ARPEGGIO_GAP_MS + NOTE_DURATION * 1000);
    },
    [playNote, playing],
  );

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {rows.map((row) => {
          const isRowPlaying = playing?.tonic === row.tonic;
          return (
            <li
              key={row.tonic}
              className={row.isException ? styles.rowException : styles.row}
            >
              {row.isException && (
                <span className={styles.exceptionTag}>Excepción</span>
              )}
              <FifthNode
                chromatic={row.tonic}
                spelled={noteShort(row.tonic)}
                role="tonic"
                isPlaying={isRowPlaying && playing?.step === 'tonic'}
                isDimmed={isRowPlaying && playing?.step === 'fifth'}
              />
              <span className={styles.arrow} aria-hidden="true">→</span>
              <FifthNode
                chromatic={row.fifthChromatic}
                spelled={row.fifthSpelled}
                role="fifth"
                isPlaying={isRowPlaying && playing?.step === 'fifth'}
                isDimmed={isRowPlaying && playing?.step === 'tonic'}
              />
              <button
                className={styles.playBtn}
                onClick={() => handlePlay(row)}
                disabled={playing !== null}
                aria-label={`Escuchar ${NOTE_ES[row.tonic]} y su quinta justa ${row.fifthSpelled}`}
              >
                ▶
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface FifthNodeProps {
  chromatic: ChromaticNote;
  spelled: string;
  role: 'tonic' | 'fifth';
  isPlaying?: boolean;
  isDimmed?: boolean;
}

function FifthNode({ chromatic, spelled, role, isPlaying, isDimmed }: FifthNodeProps) {
  return (
    <div
      className={role === 'tonic' ? styles.nodeTonic : styles.nodeFifth}
      style={{ opacity: isDimmed ? 0.4 : 1, transition: 'opacity 0.2s' }}
    >
      <svg viewBox="0 0 56 56" className={styles.nodeSvg} aria-hidden="true">
        <circle cx={28} cy={28} r={22} fill={NOTE_COLORS[chromatic]} />
        {isPlaying && (
          <circle cx={28} cy={28} r={26} fill="none" stroke="var(--amber)" strokeWidth={2} />
        )}
        <text x={28} y={30} className={styles.nodeLetter}>
          {spelled}
        </text>
      </svg>
      <span className={styles.nodeName}>{NOTE_ES[chromatic]}</span>
    </div>
  );
}
