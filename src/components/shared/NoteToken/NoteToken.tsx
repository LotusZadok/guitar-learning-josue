import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { noteShort, tonicChromatic } from '../../../utils/noteCalculations';
import type { NoteSpelling, ChromaticNote } from '../../../types/music';
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

// Maps every NoteSpelling to its ChromaticNote (flat spellings → sharp enharmonic)
const SPELLING_TO_CHROMATIC: Record<NoteSpelling, ChromaticNote> = {
  C: 'C',   'C#': 'C#', D: 'D',   'D#': 'D#', E: 'E',
  F: 'F',   'F#': 'F#', G: 'G',   'G#': 'G#', A: 'A',
  'A#': 'A#', B: 'B',
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};

export type DiatonicRole = 'stable' | 'medium' | 'mediumTense' | 'tense';

interface NoteTokenProps {
  note: NoteSpelling;
  /** When provided, overrides the per-note chromatic color with the diatonic function color. */
  diatonicRole?: DiatonicRole;
  /**
   * Si es `false`, hacer clic solo reproduce la nota y NO cambia la tónica global.
   * Úsalo en tablas-resultado (grados, progresiones) donde las notas son derivadas
   * de la tónica activa y seleccionarlas transpondría la propia tabla. Default: true.
   */
  selectable?: boolean;
}

export default function NoteToken({ note, diatonicRole, selectable = true }: NoteTokenProps) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playNote } = useAudioEngine();
  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);
  const display = noteShort(note);
  const dataNote = DATA_NOTE[note];
  const chromatic = SPELLING_TO_CHROMATIC[note];
  const isTonic = chromatic === tonicChromatic(tonic);

  const handlePlay = () => {
    playNote(note, 4);
  };

  const handleClick = () => {
    if (selectable) setTonic(note);
    playNote(note, 4);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <span
      className={`${styles.token}${isTonic ? ` ${styles.tokenTonic}` : ''}`}
      data-note={dataNote}
      data-diatonic={diatonicRole}
      role="button"
      tabIndex={0}
      aria-label={selectable
        ? (isDe ? `${display} als Tonika auswählen` : `Seleccionar ${display} como tónica`)
        : (isDe ? `${display} anhören` : `Escuchar ${display}`)}
      aria-pressed={selectable ? isTonic : undefined}
      onMouseEnter={handlePlay}
      onFocus={handlePlay}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {display}
    </span>
  );
}
