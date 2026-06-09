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
   * Octava en la que suena la nota. Default 4. Permite que notas apiladas (p.ej.
   * la fila de tríada en §2.6) suenen en orden ascendente pasando octavas crecientes.
   */
  octave?: number;
}

// Reunión 9/6/26: hacer clic en una nota SOLO la reproduce; ya no cambia la
// tónica global (eso confundía en prosa y tablas). La tónica se cambia únicamente
// desde el selector del sidebar. Se conserva el resaltado de la tónica activa.
export default function NoteToken({ note, diatonicRole, octave = 4 }: NoteTokenProps) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playNote } = useAudioEngine();
  const tonic = useUIStore((s) => s.tonic);
  const display = noteShort(note);
  const dataNote = DATA_NOTE[note];
  const chromatic = SPELLING_TO_CHROMATIC[note];
  const isTonic = chromatic === tonicChromatic(tonic);

  const handlePlay = () => {
    playNote(note, octave);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <span
      className={`${styles.token}${isTonic ? ` ${styles.tokenTonic}` : ''}`}
      data-note={dataNote}
      data-diatonic={diatonicRole}
      role="button"
      tabIndex={0}
      aria-label={isDe ? `${display} anhören` : `Escuchar ${display}`}
      onMouseEnter={handlePlay}
      onFocus={handlePlay}
      onClick={handlePlay}
      onKeyDown={handleKeyDown}
    >
      {display}
    </span>
  );
}
