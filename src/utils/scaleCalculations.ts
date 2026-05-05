import { ALL } from '../data/notes';
import type { ChromaticNote } from '../types/music';

export function getScaleNotes(root: ChromaticNote, intervals: number[]): Set<ChromaticNote> {
  const rootIdx = ALL.indexOf(root);
  const notes = new Set<ChromaticNote>();
  for (const interval of intervals) {
    notes.add(ALL[(rootIdx + interval) % 12]);
  }
  return notes;
}
