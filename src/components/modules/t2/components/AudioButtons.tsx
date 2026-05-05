import { useState, useCallback } from 'react';
import { useAudioEngine } from '../../../../hooks/useAudioEngine';
import styles from './AudioButtons.module.css';

interface Props {
  escala: string[];
  tonica: string;
  disabled?: boolean;
}

const ENHARMONIC_MAP: Record<string, { name: string; octaveAdj: number }> = {
  'Cb': { name: 'B', octaveAdj: -1 },
  'Fb': { name: 'E', octaveAdj: 0 },
  'E#': { name: 'F', octaveAdj: 0 },
  'B#': { name: 'C', octaveAdj: 1 },
};

function resolveNote(noteName: string): { name: string; octave: number } {
  const mapped = ENHARMONIC_MAP[noteName];
  if (mapped) return { name: mapped.name, octave: 4 + mapped.octaveAdj };
  return { name: noteName, octave: 4 };
}

export default function AudioButtons({ escala, tonica, disabled }: Props) {
  const { playNote } = useAudioEngine();
  const [playing, setPlaying] = useState(false);

  const playTonica = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    const { name, octave } = resolveNote(tonica);
    playNote(name, octave, 1.5);
    setTimeout(() => setPlaying(false), 1500);
  }, [tonica, playNote, playing]);

  const playEscala = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    escala.forEach((note, i) => {
      setTimeout(() => {
        const { name, octave } = resolveNote(note);
        playNote(name, octave, 1.2);
      }, i * 300);
    });
    setTimeout(() => setPlaying(false), escala.length * 300 + 1200);
  }, [escala, playNote, playing]);

  const isDisabled = disabled || playing;

  return (
    <div className={styles.wrap}>
      <button
        className={styles.btn}
        onClick={playEscala}
        disabled={isDisabled}
      >
        Escuchar escala
      </button>
      <button
        className={styles.btn}
        onClick={playTonica}
        disabled={isDisabled}
      >
        Escuchar tónica
      </button>
    </div>
  );
}
