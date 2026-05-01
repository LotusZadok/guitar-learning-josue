import type { ChromaticNote } from '../types/music';

interface StringConfig {
  note: ChromaticNote;
  octave: number;
  label: string;
  color: string;
  thickness: number;
}

export const STRINGS_OPEN: StringConfig[] = [
  { note: 'E', octave: 4, label: '1ª Mi', color: 'var(--string1)', thickness: 1 },
  { note: 'B', octave: 3, label: '2ª Si', color: 'var(--string2)', thickness: 1 },
  { note: 'G', octave: 3, label: '3ª Sol', color: 'var(--string3)', thickness: 1.5 },
  { note: 'D', octave: 3, label: '4ª Re', color: 'var(--string4)', thickness: 2 },
  { note: 'A', octave: 2, label: '5ª La', color: 'var(--string5)', thickness: 2.5 },
  { note: 'E', octave: 2, label: '6ª Mi', color: 'var(--string6)', thickness: 3 },
];
