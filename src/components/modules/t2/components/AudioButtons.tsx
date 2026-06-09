import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../../hooks/useAudioEngine';
import { pitchClass, spelledSequenceAscending } from '../../../../utils/noteCalculations';
import { ALL } from '../../../../data/notes';
import styles from './AudioButtons.module.css';

interface Props {
  escala: string[];
  tonica: string;
  disabled?: boolean;
}

const SCALE_GAP_MS = 300;

type PlayingAction = 'escala' | 'tonica' | null;

export default function AudioButtons({ escala, tonica, disabled }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playNote, playSequence } = useAudioEngine();
  const [playingAction, setPlayingAction] = useState<PlayingAction>(null);

  const playing = playingAction !== null;

  const playTonica = useCallback(() => {
    if (playing) return;
    setPlayingAction('tonica');
    playNote(ALL[pitchClass(tonica)], 4, 1.5);
    setTimeout(() => setPlayingAction(null), 1500);
  }, [tonica, playNote, playing]);

  const playEscala = useCallback(() => {
    if (playing) return;
    setPlayingAction('escala');
    // Tónica como nota más grave, ascendiendo y cerrando en la octava.
    const notes = spelledSequenceAscending(escala, 4, true);
    playSequence(notes, SCALE_GAP_MS);
    setTimeout(() => setPlayingAction(null), notes.length * SCALE_GAP_MS + 200);
  }, [escala, playSequence, playing]);

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
