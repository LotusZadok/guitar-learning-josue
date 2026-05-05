export type ChromaticNote =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

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
