import type { KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { noteShort } from '../../../utils/noteCalculations';
import type { NoteSpelling } from '../../../types/music';
import styles from './NoteToken.module.css';

// Mapea cada spelling al `data-note` que selecciona el `--note-X` correcto.
// Bemoles enarmonizan al sostenido (Bb → a-sharp) porque el sistema sólo
// tiene 12 hues y `--note-a-sharp` cubre la nota cromática A♯/B♭.
const DATA_NOTE: Record<NoteSpelling, string> = {
  C: 'c',
  'C#': 'c-sharp',
  D: 'd',
  'D#': 'd-sharp',
  E: 'e',
  F: 'f',
  'F#': 'f-sharp',
  G: 'g',
  'G#': 'g-sharp',
  A: 'a',
  'A#': 'a-sharp',
  B: 'b',
  Db: 'c-sharp',
  Eb: 'd-sharp',
  Gb: 'f-sharp',
  Ab: 'g-sharp',
  Bb: 'a-sharp',
};

interface NoteTokenProps {
  note: NoteSpelling;
}

export default function NoteToken({ note }: NoteTokenProps) {
  const { playNote } = useAudioEngine();
  const display = noteShort(note);
  const dataNote = DATA_NOTE[note];

  const handlePlay = () => {
    playNote(note, 4);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <span
      className={styles.token}
      data-note={dataNote}
      role="button"
      tabIndex={0}
      aria-label={`Reproducir nota ${display}`}
      onMouseEnter={handlePlay}
      onFocus={handlePlay}
      onKeyDown={handleKeyDown}
    >
      {display}
    </span>
  );
}
