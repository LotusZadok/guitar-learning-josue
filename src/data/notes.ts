import type { ChromaticNote, NaturalNote, NoteNameES } from '../types/music';

export const ALL: ChromaticNote[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const NATURALS: NaturalNote[] = ['C','D','E','F','G','A','B'];

export const NOTE_COLORS: Record<ChromaticNote, string> = {
  'C':'var(--note-c)','C#':'var(--note-c-sharp)','D':'var(--note-d)','D#':'var(--note-d-sharp)',
  'E':'var(--note-e)','F':'var(--note-f)','F#':'var(--note-f-sharp)','G':'var(--note-g)',
  'G#':'var(--note-g-sharp)','A':'var(--note-a)','A#':'var(--note-a-sharp)','B':'var(--note-b)',
};

export const NOTE_ES: Record<ChromaticNote, NoteNameES> = {
  'C':'Do','C#':'Do♯','D':'Re','D#':'Re♯','E':'Mi','F':'Fa',
  'F#':'Fa♯','G':'Sol','G#':'Sol♯','A':'La','A#':'La♯','B':'Si',
};

// Nombre en solfeo derivado de la grafía (no de la cromática), para que coincida
// con el glifo que se muestra. Mapea la letra y conserva ♭/♯.
const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};

export function spelledToES(spelled: string): string {
  return (LETTER_ES[spelled[0]] ?? spelled[0]) + spelled.slice(1);
}

