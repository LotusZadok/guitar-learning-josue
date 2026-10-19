import { useCallback, useMemo, useState } from 'react';
import { useChordPlayer } from '../../../hooks/useChordPlayer';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL } from '../../../data/notes';
import {
  pitchClass,
  progresionIIVI,
  spelledSequenceAscending,
} from '../../../utils/noteCalculations';
import styles from './ProgresionIIVI.module.css';

interface Props {
  /** Etiquetas de función por acorde (ii, V7, I / ii°, V7, i). Vienen de la sección (i18n). */
  functions: string[];
  /** T3 §3.10: ii°-V7-i sobre la relativa menor natural (misma armadura que
   *  `tonic`, rotada), en vez de ii-V-I mayor. */
  relativeMinor?: boolean;
}

// Los acordes (y su arco de tensión) salen de `progresionIIVI` en
// noteCalculations, compartido con los escenarios de §3.8. Aquí solo viven los
// romanos que muestra cada sección.
const ROMANS_MAJOR = ['ii', 'V7', 'I'];
const ROMANS_MINOR = ['ii°', 'V7', 'i'];

const NOTE_DURATION = 1.4;
const ARPEGGIO_GAP_MS = 150;
const CHORD_GAP_MS = 1100;

export default function ProgresionIIVI({ functions, relativeMinor = false }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  const { playChord, at, clear } = useChordPlayer(NOTE_DURATION);
  const [playing, setPlaying] = useState<'bloque' | 'arpegio' | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const chords = useMemo(() => {
    const romans = relativeMinor ? ROMANS_MINOR : ROMANS_MAJOR;
    const acordes = progresionIIVI({
      tonica: tonic,
      modo: relativeMinor ? 'menor' : 'mayor',
      septimaEnI: !relativeMinor,
    });
    return acordes.map((a, i) => {
      const seq = spelledSequenceAscending(a.notas, 4);
      return {
        roman: romans[i],
        role: a.rol,
        cifrado: a.cifrado,
        members: a.notas.map((sp, j) => ({ chromatic: ALL[pitchClass(sp)], octave: seq[j].octave })),
      };
    });
  }, [tonic, relativeMinor]);

  const playCard = useCallback(
    (idx: number) => {
      if (playing) return;
      setActiveCard(idx);
      playChord(chords[idx].members, ARPEGGIO_GAP_MS);
      at(() => setActiveCard(null), NOTE_DURATION * 1000);
    },
    [playChord, at, chords, playing],
  );

  // Bloque = las cuatro notas de cada acorde juntas; arpegio = desplegadas. En
  // ambos casos los tres acordes siguen encadenados con CHORD_GAP_MS.
  const playProgression = useCallback(
    (mode: 'bloque' | 'arpegio') => {
      if (playing) return;
      setPlaying(mode);
      clear();
      chords.forEach((_, idx) => {
        at(() => {
          setActiveCard(idx);
          playChord(chords[idx].members, mode === 'arpegio' ? ARPEGGIO_GAP_MS : 0);
        }, idx * CHORD_GAP_MS);
      });
      at(() => {
        setPlaying(null);
        setActiveCard(null);
      }, chords.length * CHORD_GAP_MS + NOTE_DURATION * 500);
    },
    [chords, clear, at, playChord, playing],
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
