import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

type PlayingAction = 'escala' | 'tonica' | null;

export default function AudioButtons({ escala, tonica, disabled }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playNote } = useAudioEngine();
  const [playingAction, setPlayingAction] = useState<PlayingAction>(null);

  const playing = playingAction !== null;

  const playTonica = useCallback(() => {
    if (playing) return;
    setPlayingAction('tonica');
    const { name, octave } = resolveNote(tonica);
    playNote(name, octave, 1.5);
    setTimeout(() => setPlayingAction(null), 1500);
  }, [tonica, playNote, playing]);

  const playEscala = useCallback(() => {
    if (playing) return;
    setPlayingAction('escala');
    escala.forEach((note, i) => {
      setTimeout(() => {
        const { name, octave } = resolveNote(note);
        playNote(name, octave, 1.2);
      }, i * 300);
    });
    setTimeout(() => setPlayingAction(null), escala.length * 300 + 1200);
  }, [escala, playNote, playing]);

  const isDisabled = disabled || playing;

  return (
    <div className={styles.wrap}>
      <button
        className={playingAction === 'escala' ? styles.btnPlaying : styles.btn}
        onClick={playEscala}
        disabled={isDisabled}
      >
        {isDe ? 'Tonleiter hören' : 'Escuchar escala'}
      </button>
      <button
        className={playingAction === 'tonica' ? styles.btnPlaying : styles.btn}
        onClick={playTonica}
        disabled={isDisabled}
      >
        {isDe ? 'Tonika hören' : 'Escuchar tónica'}
      </button>
    </div>
  );
}
