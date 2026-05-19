import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL } from '../../../data/notes';
import { majorScaleSpelled } from '../../../utils/noteCalculations';
import NoteToken from '../../shared/NoteToken/NoteToken';
import type { ChromaticNote, DiatonicDegree, NoteSpelling } from '../../../types/music';
import { PROGRESIONES_DATA } from '../../modules/t2/data/literalContent';
import styles from './ProgresionesArmonicas.module.css';

interface Props {
  tonalidad: ChromaticNote;
}

type PlayMode = 'arpegio' | 'bloque';

const DEGREE_TO_IDX: Record<DiatonicDegree, number> = {
  'I': 0, 'ii': 1, 'iii': 2, 'IV': 3, 'V': 4, 'vi': 5, 'vii°': 6,
};
const QUALITIES = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'] as const;
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;

const ARPEGGIO_GAP_MS = 220;
const CHORD_GAP_MS = 400;
const NOTE_DURATION = 1.4;
const FIRE_DEBOUNCE_MS = 150;

// 17 spellings cubiertos por NoteToken (12 sostenidos + 5 enarmonías bemol).
const VALID_SPELLINGS: ReadonlySet<string> = new Set([
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb',
]);

interface DiatonicNote {
  spelled: string;
  ascii: string;
  chromatic: ChromaticNote;
  octave: number;
}

function buildDiatonic(tonic: ChromaticNote): DiatonicNote[] {
  const tIdx = ALL.indexOf(tonic);
  const spelled = majorScaleSpelled(tonic);
  return MAJOR_INTERVALS.map((semis, i) => ({
    spelled: spelled[i],
    ascii: spelled[i].replace('♯', '#').replace('♭', 'b'),
    chromatic: ALL[(tIdx + semis) % 12],
    octave: 4 + Math.floor((tIdx + semis) / 12),
  }));
}

// Reused inline from GradosArmonicos — second consumer doesn't justify extraction yet.
function chordMemberOctave(diatonic: DiatonicNote[], gradeIdx: number, offset: number): number {
  const wraps = gradeIdx + offset >= 7 ? 1 : 0;
  return diatonic[(gradeIdx + offset) % 7].octave + wraps;
}

function chordLabel(diatonic: DiatonicNote[], gradeIdx: number): string {
  const q = QUALITIES[gradeIdx];
  const root = diatonic[gradeIdx].spelled;
  if (q === 'M') return root;
  if (q === 'm') return root + 'm';
  return root + '°';
}

export default function ProgresionesArmonicas({ tonalidad }: Props) {
  const [playMode, setPlayMode] = useState<PlayMode>('arpegio');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeChordIdx, setActiveChordIdx] = useState<number | null>(null);
  const { playNote } = useAudioEngine();
  const lastFireRef = useRef<number>(0);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playingIdRef = useRef<string | null>(null);

  const diatonic = useMemo(() => buildDiatonic(tonalidad), [tonalidad]);

  const clearAll = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    playingIdRef.current = null;
    setPlayingId(null);
    setActiveChordIdx(null);
  }, []);

  // Cancel playback when tonic or playMode changes
  useEffect(() => { clearAll(); }, [tonalidad, clearAll]);
  useEffect(() => { clearAll(); }, [playMode, clearAll]);

  // Cleanup on unmount
  useEffect(() => () => { timeoutRefs.current.forEach(clearTimeout); }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timeoutRefs.current.push(t);
  }, []);

  const playRow = useCallback(
    (rowId: string, grados: ReadonlyArray<DiatonicDegree>) => {
      const now = performance.now();
      if (now - lastFireRef.current < FIRE_DEBOUNCE_MS) return;
      lastFireRef.current = now;

      if (playingIdRef.current === rowId) {
        clearAll();
        return;
      }

      clearAll();
      playingIdRef.current = rowId;
      setPlayingId(rowId);

      grados.forEach((degree, chordIdx) => {
        const chordStart = chordIdx * CHORD_GAP_MS;
        schedule(() => setActiveChordIdx(chordIdx), chordStart);

        const gradeIdx = DEGREE_TO_IDX[degree];
        const root = diatonic[gradeIdx];
        const third = diatonic[(gradeIdx + 2) % 7];
        const fifth = diatonic[(gradeIdx + 4) % 7];
        const rootOct = root.octave;
        const thirdOct = chordMemberOctave(diatonic, gradeIdx, 2);
        const fifthOct = chordMemberOctave(diatonic, gradeIdx, 4);

        if (playMode === 'bloque') {
          schedule(() => {
            playNote(root.chromatic, rootOct, NOTE_DURATION);
            playNote(third.chromatic, thirdOct, NOTE_DURATION);
            playNote(fifth.chromatic, fifthOct, NOTE_DURATION);
          }, chordStart);
        } else {
          schedule(() => playNote(root.chromatic, rootOct, NOTE_DURATION), chordStart);
          schedule(() => playNote(third.chromatic, thirdOct, NOTE_DURATION), chordStart + ARPEGGIO_GAP_MS);
          schedule(() => playNote(fifth.chromatic, fifthOct, NOTE_DURATION), chordStart + ARPEGGIO_GAP_MS * 2);
        }
      });

      const totalTime = (grados.length - 1) * CHORD_GAP_MS + NOTE_DURATION * 1000 + 300;
      schedule(() => {
        if (playingIdRef.current === rowId) clearAll();
      }, totalTime);
    },
    [diatonic, playMode, playNote, clearAll, schedule],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.modeRow} role="group" aria-label="Modo de reproducción">
        <span className={styles.modeLabel}>Reproducción:</span>
        {(['arpegio', 'bloque'] as PlayMode[]).map((m) => (
          <button
            key={m}
            className={playMode === m ? styles.modeActive : styles.modeBtn}
            onClick={() => setPlayMode(m)}
            aria-pressed={playMode === m}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.rows}>
        {PROGRESIONES_DATA.map((row) => {
          const isPlaying = playingId === row.id;
          return (
            <ProgressionRow
              key={row.id}
              id={row.id}
              label={row.label}
              grados={row.grados}
              diatonic={diatonic}
              isPlaying={isPlaying}
              activeChordIdx={isPlaying ? activeChordIdx : null}
              onPlay={playRow}
            />
          );
        })}
      </div>
    </div>
  );
}

interface RowProps {
  id: string;
  label: string;
  grados: ReadonlyArray<DiatonicDegree>;
  diatonic: DiatonicNote[];
  isPlaying: boolean;
  activeChordIdx: number | null;
  onPlay: (id: string, grados: ReadonlyArray<DiatonicDegree>) => void;
}

function ProgressionRow({ id, label, grados, diatonic, isPlaying, activeChordIdx, onPlay }: RowProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay(id, grados);
      }
    },
    [id, grados, onPlay],
  );

  const ariaLabel = `Reproducir progresión ${label}: ${grados.join(' ')}`;

  return (
    <div className={`${styles.row} ${isPlaying ? styles.rowPlaying : ''}`}>
      <button
        type="button"
        className={styles.playBtn}
        onClick={() => onPlay(id, grados)}
        onKeyDown={handleKey}
        aria-label={ariaLabel}
        aria-pressed={isPlaying}
      >
        {isPlaying ? '■' : '▶'}
      </button>

      <span className={styles.rowLabel}>{label}</span>

      <div className={styles.chords}>
        {grados.map((degree, i) => {
          const gradeIdx = DEGREE_TO_IDX[degree];
          const label_chord = chordLabel(diatonic, gradeIdx);
          const rootAscii = diatonic[gradeIdx].ascii;
          const isActive = activeChordIdx === i;

          return (
            <div key={i} className={styles.chordGroup}>
              {i > 0 && <span className={styles.sep} aria-hidden="true">·</span>}
              <div className={`${styles.chordPair} ${isActive ? styles.chordHighlight : ''}`}>
                <span className={styles.degreeChip}>
                  <DegreeGlyph degree={degree} />
                </span>
                <span className={styles.chordChip}>
                  {VALID_SPELLINGS.has(rootAscii) ? (
                    <NoteToken note={rootAscii as NoteSpelling} />
                  ) : (
                    <span className={styles.rawNote}>{label_chord}</span>
                  )}
                  {VALID_SPELLINGS.has(rootAscii) && (
                    <span className={styles.chordSuffix}>{QUALITIES[gradeIdx] === 'm' ? 'm' : QUALITIES[gradeIdx] === 'dim' ? '°' : ''}</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DegreeGlyph({ degree }: { degree: DiatonicDegree }) {
  if (degree === 'vii°') {
    return <span className={styles.romanDim}>{degree}</span>;
  }
  const isMajor = degree === degree.toUpperCase();
  return (
    <span className={isMajor ? styles.romanMajor : styles.romanMinor}>{degree}</span>
  );
}
