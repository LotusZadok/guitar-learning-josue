import { useCallback, useMemo, useRef, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL } from '../../../data/notes';
import { majorScaleSpelled, pitchClass, spelledSequenceAscending } from '../../../utils/noteCalculations';
import styles from './ProgresionIIVI.module.css';

interface Props {
  /** Etiquetas de función por acorde (ii, V7, I). Vienen de la sección (i18n). */
  functions: string[];
  playLabel: string;
}

type Role = 'medium' | 'tense' | 'stable';

// La progresión ii-V-I con séptimas diatónicas. Cada acorde deriva de la escala
// mayor de la tónica activa (terceras apiladas). El arco de tensión: subdominante
// (media) → dominante (alta) → tónica (resolución).
const DEFS: { roman: string; rootIdx: number; suffix: string; degrees: number[]; role: Role }[] = [
  { roman: 'ii', rootIdx: 1, suffix: 'm7', degrees: [1, 3, 5, 0], role: 'medium' },
  { roman: 'V7', rootIdx: 4, suffix: '7', degrees: [4, 6, 1, 3], role: 'tense' },
  { roman: 'I', rootIdx: 0, suffix: 'maj7', degrees: [0, 2, 4, 6], role: 'stable' },
];

const NOTE_DURATION = 1.4;
const ARPEGGIO_GAP_MS = 150;
const CHORD_GAP_MS = 1100;

export default function ProgresionIIVI({ functions, playLabel }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [playing, setPlaying] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const chords = useMemo(() => {
    const scale = majorScaleSpelled(tonic);
    return DEFS.map((d) => {
      const notes = d.degrees.map((g) => scale[g]);
      const seq = spelledSequenceAscending(notes, 4);
      return {
        roman: d.roman,
        role: d.role,
        cifrado: scale[d.rootIdx] + d.suffix,
        members: notes.map((sp, i) => ({ chromatic: ALL[pitchClass(sp)], octave: seq[i].octave })),
      };
    });
  }, [tonic]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const playChord = useCallback(
    (idx: number, gap = ARPEGGIO_GAP_MS) => {
      chords[idx].members.forEach((m, i) => {
        const t = setTimeout(() => playNote(m.chromatic, m.octave, NOTE_DURATION), i * gap);
        timers.current.push(t);
      });
    },
    [chords, playNote],
  );

  const playCard = useCallback(
    (idx: number) => {
      if (playing) return;
      setActiveCard(idx);
      playChord(idx);
      const t = setTimeout(() => setActiveCard(null), NOTE_DURATION * 1000);
      timers.current.push(t);
    },
    [playChord, playing],
  );

  const playProgression = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    clearTimers();
    chords.forEach((_, idx) => {
      const t = setTimeout(() => {
        setActiveCard(idx);
        playChord(idx);
      }, idx * CHORD_GAP_MS);
      timers.current.push(t);
    });
    const end = setTimeout(() => {
      setPlaying(false);
      setActiveCard(null);
    }, chords.length * CHORD_GAP_MS + NOTE_DURATION * 500);
    timers.current.push(end);
  }, [chords, clearTimers, playChord, playing]);

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {chords.map((c, i) => (
          <div key={c.roman} className={styles.group}>
            <button
              type="button"
              className={`${styles.card} ${activeCard === i ? styles.cardActive : ''}`}
              data-role={c.role}
              onClick={() => playCard(i)}
              disabled={playing}
              aria-label={`${c.cifrado}, ${functions[i]}`}
            >
              <span className={styles.roman}>{c.roman}</span>
              <span className={styles.cifrado}>{c.cifrado}</span>
              <span className={styles.function}>{functions[i]}</span>
            </button>
            {i < chords.length - 1 && <span className={styles.arrow} aria-hidden="true">→</span>}
          </div>
        ))}
      </div>

      <button type="button" className={styles.playBtn} onClick={playProgression} disabled={playing}>
        {playLabel}
      </button>
    </div>
  );
}
