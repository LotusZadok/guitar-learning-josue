import { useCallback, useMemo, useRef, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL } from '../../../data/notes';
import {
  majorScaleSpelled,
  pitchClass,
  relativeMinorScaleSpelled,
  spelledIntervalFromTonic,
  spelledSequenceAscending,
} from '../../../utils/noteCalculations';
import type { Tonic } from '../../../types/music';
import styles from './ProgresionIIVI.module.css';

interface Props {
  /** Etiquetas de función por acorde (ii, V7, I / ii°, V7, i). Vienen de la sección (i18n). */
  functions: string[];
  /** T3 §3.10: ii°-V7-i sobre la relativa menor natural (misma armadura que
   *  `tonic`, rotada), en vez de ii-V-I mayor. */
  relativeMinor?: boolean;
}

type Role = 'medium' | 'tense' | 'stable';

interface ProgressionDef {
  roman: string;
  rootIdx: number;
  suffix: string;
  degrees: number[];
  role: Role;
  /** Solo V7 menor: sube la sensible natural (♭VII) a la 7M de la tónica menor
   *  (menor armónica) para que el V suene dominante en vez de menor natural. */
  raise7?: boolean;
}

// La progresión ii-V-I con séptimas diatónicas. Cada acorde deriva de la escala
// mayor de la tónica activa (terceras apiladas). El arco de tensión: subdominante
// (media) → dominante (alta) → tónica (resolución).
const DEFS_MAJOR: ProgressionDef[] = [
  { roman: 'ii', rootIdx: 1, suffix: 'm7', degrees: [1, 3, 5, 0], role: 'medium' },
  { roman: 'V7', rootIdx: 4, suffix: '7', degrees: [4, 6, 1, 3], role: 'tense' },
  { roman: 'I', rootIdx: 0, suffix: 'maj7', degrees: [0, 2, 4, 6], role: 'stable' },
];

// ii°-V7-i menor (§3.10): ii° y el i (tríada) salen directo de la menor natural
// relativa (mismas notas que la mayor, rotadas — ver GradosArmonicos §3.9). El
// V7 es el único que se aparta de la escala natural: pide la sensible elevada.
const DEFS_MINOR: ProgressionDef[] = [
  { roman: 'ii°', rootIdx: 1, suffix: 'm7♭5', degrees: [1, 3, 5, 0], role: 'medium' },
  { roman: 'V7', rootIdx: 4, suffix: '7', degrees: [4, 6, 1, 3], role: 'tense', raise7: true },
  { roman: 'i', rootIdx: 0, suffix: 'm', degrees: [0, 2, 4], role: 'stable' },
];

const NOTE_DURATION = 1.4;
const ARPEGGIO_GAP_MS = 150;
const CHORD_GAP_MS = 1100;

export default function ProgresionIIVI({ functions, relativeMinor = false }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [playing, setPlaying] = useState<'bloque' | 'arpegio' | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const chords = useMemo(() => {
    const defs = relativeMinor ? DEFS_MINOR : DEFS_MAJOR;
    const scale = relativeMinor ? relativeMinorScaleSpelled(tonic) : majorScaleSpelled(tonic);
    return defs.map((d) => {
      let notes = d.degrees.map((g) => scale[g]);
      if (d.raise7) {
        const minorTonicAscii = scale[0].replace('♯', '#').replace('♭', 'b') as Tonic;
        const raised = spelledIntervalFromTonic(minorTonicAscii, 7, 'M');
        notes = notes.map((n) => (n === scale[6] ? raised : n));
      }
      const seq = spelledSequenceAscending(notes, 4);
      return {
        roman: d.roman,
        role: d.role,
        cifrado: scale[d.rootIdx] + d.suffix,
        members: notes.map((sp, i) => ({ chromatic: ALL[pitchClass(sp)], octave: seq[i].octave })),
      };
    });
  }, [tonic, relativeMinor]);

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

  // Bloque = las cuatro notas de cada acorde juntas; arpegio = desplegadas. En
  // ambos casos los tres acordes siguen encadenados con CHORD_GAP_MS.
  const playProgression = useCallback(
    (mode: 'bloque' | 'arpegio') => {
      if (playing) return;
      setPlaying(mode);
      clearTimers();
      chords.forEach((_, idx) => {
        const t = setTimeout(() => {
          setActiveCard(idx);
          playChord(idx, mode === 'arpegio' ? ARPEGGIO_GAP_MS : 0);
        }, idx * CHORD_GAP_MS);
        timers.current.push(t);
      });
      const end = setTimeout(() => {
        setPlaying(null);
        setActiveCard(null);
      }, chords.length * CHORD_GAP_MS + NOTE_DURATION * 500);
      timers.current.push(end);
    },
    [chords, clearTimers, playChord, playing],
  );

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
              disabled={playing != null}
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

      <div className={styles.audioRow}>
        <PlaybackButton
          mode="bloque"
          onClick={() => playProgression('bloque')}
          playing={playing === 'bloque'}
          disabled={playing != null}
        />
        <PlaybackButton
          mode="arpegio"
          onClick={() => playProgression('arpegio')}
          playing={playing === 'arpegio'}
          disabled={playing != null}
        />
      </div>
    </div>
  );
}
