import { ALL, NOTE_ES } from '../data/notes';
import type { ChromaticNote, NoteInfo } from '../types/music';

export function noteAtFret(openNote: ChromaticNote, openOct: number, fret: number): NoteInfo {
  const si = ALL.indexOf(openNote);
  const idx = (si + fret) % 12;
  const octUp = Math.floor((si + fret) / 12);
  return { note: ALL[idx], octave: openOct + octUp };
}

export function noteShort(n: string): string {
  return n.replace('#', '♯');
}

export function noteDisplay(n: ChromaticNote): string {
  const map: Partial<Record<ChromaticNote, string>> = {
    'C#': 'C♯/D♭', 'D#': 'D♯/E♭', 'F#': 'F♯/G♭', 'G#': 'G♯/A♭', 'A#': 'A♯/B♭',
  };
  return map[n] || n;
}

export function noteNameES(n: ChromaticNote): string {
  return NOTE_ES[n];
}
