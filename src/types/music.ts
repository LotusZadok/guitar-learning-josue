export type ChromaticNote =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Spelling permisivo: incluye los 12 cromáticos con sostenidos (ChromaticNote)
// más las 5 enarmonías bemoles que el método de Josué utiliza en prosa.
// Audio y color resuelven enarmónicamente al sharp equivalente.
export type NoteSpelling =
  | ChromaticNote
  | 'Db' | 'Eb' | 'Gb' | 'Ab' | 'Bb';

// Tónica seleccionable: las 12 alturas con sostenido (ChromaticNote) más las 5
// enarmonías bemoles. La grafía elegida determina la ortografía de escalas y
// acordes — C♯ mayor y D♭ mayor suenan igual pero se escriben distinto.
export type Tonic = NoteSpelling;

export type NoteNameES =
  | 'Do' | 'Do♯' | 'Re' | 'Re♯' | 'Mi' | 'Fa'
  | 'Fa♯' | 'Sol' | 'Sol♯' | 'La' | 'La♯' | 'Si';

export interface NoteInfo {
  note: ChromaticNote;
  octave: number;
}

export type TriadType = 'Mayor' | 'Menor' | 'Disminuida';

export interface Triad {
  root: NaturalNote;
  notes: [NaturalNote, NaturalNote, NaturalNote];
  type: TriadType;
}

export type CagedLetter = 'C' | 'A' | 'G' | 'E' | 'D';

export interface CagedShape {
  letter: CagedLetter;
  name: string;
  description: string;
  frets: (number | null)[];
}

export interface CagedConnectedPosition {
  stringIndex: number;
  fret: number;
}

export interface ScalePattern {
  id: string;
  name: string;
  intervals: number[];
}

export interface IntervalDefinition {
  name: string;
  semitones: number;
  description: string;
  color: string;
}

export type ThemeMode = 'dark' | 'light';

export type DiatonicDegree = 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii°';
