import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL, NOTE_COLORS, NOTE_ES, NOTE_DE } from '../../../data/notes';

import { perfectFifth, noteShort } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './ReglaQuinta.module.css';

const ARPEGGIO_GAP_MS = 400;
const NOTE_TAIL_MS = 380;

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
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playSequence } = useAudioEngine();
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
      playSequence(
        [
          { name: row.tonic, octave: 4 },
          { name: row.fifthChromatic, octave: row.fifthOctave },
        ],
        ARPEGGIO_GAP_MS,
        NOTE_TAIL_MS,
      );
      setTimeout(() => setPlaying({ tonic: row.tonic, step: 'fifth' }), ARPEGGIO_GAP_MS);
      setTimeout(() => setPlaying(null), ARPEGGIO_GAP_MS + NOTE_TAIL_MS + 300);
    },
    [playSequence, playing],
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
                <span className={styles.exceptionTag}>{isDe ? 'Ausnahme' : 'Excepción'}</span>
              )}
              <FifthNode
                chromatic={row.tonic}
                spelled={noteShort(row.tonic)}
                role="tonic"
                isPlaying={isRowPlaying && playing?.step === 'tonic'}
                isDimmed={isRowPlaying && playing?.step === 'fifth'}
                isDe={isDe}
              />
              <span className={styles.arrow} aria-hidden="true">→</span>
              <FifthNode
                chromatic={row.fifthChromatic}
                spelled={row.fifthSpelled}
                role="fifth"
                isPlaying={isRowPlaying && playing?.step === 'fifth'}
                isDimmed={isRowPlaying && playing?.step === 'tonic'}
                isDe={isDe}
              />
              <button
                className={styles.playBtn}
                onClick={() => handlePlay(row)}
                disabled={playing !== null}
                aria-label={isDe
                  ? `${NOTE_DE[row.tonic] ?? row.tonic} und seine reine Quinte ${row.fifthSpelled} hören`
                  : `Escuchar ${NOTE_ES[row.tonic]} y su quinta justa ${row.fifthSpelled}`}
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
  isDe?: boolean;
}

function FifthNode({ chromatic, spelled, role, isPlaying, isDimmed, isDe }: FifthNodeProps) {
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
      <span className={styles.nodeName}>{isDe ? (NOTE_DE[chromatic] ?? chromatic) : NOTE_ES[chromatic]}</span>
    </div>
  );
}
