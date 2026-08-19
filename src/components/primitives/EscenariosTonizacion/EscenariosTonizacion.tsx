import { useCallback, useMemo, useRef, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { tonizacionEscenarios } from '../../../utils/noteCalculations';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import styles from './EscenariosTonizacion.module.css';

const NOTE_DURATION = 1.3;
const ARPEGGIO_GAP_MS = 130;
const CHORD_GAP_MS = 900;

interface Props {
  /** Etiquetas de los dos escenarios; vienen de la sección (i18n). */
  labels: { mayor: string; menor: string };
}

// §3.8 · Los dos escenarios del profesor, lado a lado: qué calidad toma el 2º, el
// 5º y el 1er grado en cada uno. En mayor los tres están alterados por la
// tonización (II mayor, v menor, I mayor); en la relativa menor son las
// calidades naturales (ii°, v, i). Grados y cifrados salen de la tónica activa.
export default function EscenariosTonizacion({ labels }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const escenarios = useMemo(() => tonizacionEscenarios(tonic), [tonic]);
  const [modo, setModo] = useState<'mayor' | 'menor'>('mayor');
  const [playing, setPlaying] = useState<'bloque' | 'arpegio' | null>(null);
  const [activo, setActivo] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const grados = escenarios[modo];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const playChord = useCallback(
    (idx: number, delay: number, gap: number) => {
      grados[idx].chord.members.forEach((m, i) => {
        timers.current.push(
          setTimeout(() => playNote(m.chromatic, m.octave, NOTE_DURATION), delay + i * gap),
        );
      });
    },
    [grados, playNote],
  );

  const playCard = useCallback(
    (idx: number) => {
      if (playing) return;
      clearTimers();
      setActivo(idx);
      playChord(idx, 0, ARPEGGIO_GAP_MS);
      timers.current.push(setTimeout(() => setActivo(null), NOTE_DURATION * 1000));
    },
    [clearTimers, playChord, playing],
  );

  const playAll = useCallback(
    (mode: 'bloque' | 'arpegio') => {
      if (playing) return;
      clearTimers();
      setPlaying(mode);
      grados.forEach((_, idx) => {
        timers.current.push(
          setTimeout(() => {
            setActivo(idx);
            playChord(idx, 0, mode === 'arpegio' ? ARPEGGIO_GAP_MS : 0);
          }, idx * CHORD_GAP_MS),
        );
      });
      timers.current.push(
        setTimeout(
          () => {
            setPlaying(null);
            setActivo(null);
          },
          grados.length * CHORD_GAP_MS + NOTE_DURATION * 500,
        ),
      );
    },
    [clearTimers, grados, playChord, playing],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.selector} role="group" aria-label={`${labels.mayor} / ${labels.menor}`}>
        {(['mayor', 'menor'] as const).map((k) => (
          <button
            key={k}
            type="button"
            className={k === modo ? styles.chipActive : styles.chip}
            aria-pressed={k === modo}
            onClick={() => setModo(k)}
            disabled={playing != null}
          >
            {labels[k]}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        {grados.map((g, i) => (
          <button
            key={g.roman}
            type="button"
            className={`${styles.card} ${activo === i ? styles.cardActive : ''}`}
            onClick={() => playCard(i)}
            disabled={playing != null}
            aria-label={g.chord.cifrado}
          >
            <span className={styles.roman}>{g.roman}</span>
            <span className={styles.cifrado}>{g.chord.cifrado}</span>
          </button>
        ))}
      </div>

      <div className={styles.audioRow}>
        <PlaybackButton
          mode="bloque"
          onClick={() => playAll('bloque')}
          playing={playing === 'bloque'}
          disabled={playing != null}
        />
        <PlaybackButton
          mode="arpegio"
          onClick={() => playAll('arpegio')}
          playing={playing === 'arpegio'}
          disabled={playing != null}
        />
      </div>
    </div>
  );
}
