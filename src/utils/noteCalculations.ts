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

// === Major scale spelling (T1 §1.4 / §1.7) ===

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const NATURAL_SEMITONE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;

function tonicSemitone(tonic: ChromaticNote): number {
  const letter = tonic[0];
  const sharp = tonic.length > 1;
  return (NATURAL_SEMITONE[letter] + (sharp ? 1 : 0)) % 12;
}

function spelledFromLetterAndSemi(letter: string, targetSemi: number): string {
  const naturalSemi = NATURAL_SEMITONE[letter];
  let diff = (targetSemi - naturalSemi + 12) % 12;
  if (diff > 6) diff -= 12;

  let acc = '';
  if (diff === 1) acc = '♯';
  else if (diff === -1) acc = '♭';
  else if (diff === 2) acc = '♯♯';
  else if (diff === -2) acc = '♭♭';

  return letter + acc;
}

// Returns the 7 spelled grades of the major scale starting at `tonic`,
// preserving the rule of one letter per grade (with proper #/b accidentals).
// Output uses ♯ / ♭ glyphs ready for display.
export function majorScaleSpelled(tonic: ChromaticNote): string[] {
  const startLetterIdx = LETTERS.indexOf(tonic[0] as typeof LETTERS[number]);
  const tonicSemi = tonicSemitone(tonic);
  const result: string[] = [];

  for (let i = 0; i < 7; i++) {
    const letter = LETTERS[(startLetterIdx + i) % 7];
    const targetSemi = (tonicSemi + MAJOR_INTERVALS[i]) % 12;
    result.push(spelledFromLetterAndSemi(letter, targetSemi));
  }
  return result;
}

export type ChordType = 'M' | 'm';

export interface ChordMember {
  spelled: string;        // e.g., "C♯", "E♭"
  chromatic: ChromaticNote; // for audio engine
  octave: number;
  role: 'T' | '3M' | '3m' | '5J';
}

// Build a major or minor triad from a tonic. Letters skip one each (T, third, fifth).
// Major = T + 3M (4 s.t.) + 5J (7 s.t.). Minor = T + 3m (3 s.t.) + 5J (7 s.t.).
// Octave numbering wraps when chromatic index exceeds 11 — so D + 7 s.t. = A4, but G + 7 s.t. = D5.
export function chordSpelled(tonic: ChromaticNote, type: ChordType): ChordMember[] {
  const startLetterIdx = LETTERS.indexOf(tonic[0] as typeof LETTERS[number]);
  const tonicSemi = tonicSemitone(tonic);
  const tonicIdx = ALL.indexOf(tonic);
  const thirdSt = type === 'M' ? 4 : 3;
  const offsets = [0, thirdSt, 7] as const;
  const roles: ChordMember['role'][] = ['T', type === 'M' ? '3M' : '3m', '5J'];

  return offsets.map((semis, i) => {
    const letter = LETTERS[(startLetterIdx + i * 2) % 7];
    const targetSemi = (tonicSemi + semis) % 12;
    const spelled = spelledFromLetterAndSemi(letter, targetSemi);
    const absChromIdx = (tonicIdx + semis) % 12;
    const octave = 4 + Math.floor((tonicIdx + semis) / 12);
    return {
      spelled,
      chromatic: ALL[absChromIdx],
      octave,
      role: roles[i],
    };
  });
}

// Returns the perfect-fifth pair for a tonic, honoring the §1.8 alteration-mirror rule.
// Most cases: 5J copies the alteration of the tonic. Exception: B → F♯ (not F).
// Bb → F (not Fb) is a parallel exception when using flat spelling — see literalContent.
export function perfectFifth(tonic: ChromaticNote): ChordMember {
  const tonicIdx = ALL.indexOf(tonic);
  const startLetterIdx = LETTERS.indexOf(tonic[0] as typeof LETTERS[number]);
  // Fifth lives two letters ahead (T → 3rd → 5th, skipping one).
  const letter = LETTERS[(startLetterIdx + 4) % 7];
  const targetSemi = (tonicSemitone(tonic) + 7) % 12;
  const spelled = spelledFromLetterAndSemi(letter, targetSemi);
  const absChromIdx = (tonicIdx + 7) % 12;
  const octave = 4 + Math.floor((tonicIdx + 7) / 12);
  return { spelled, chromatic: ALL[absChromIdx], octave, role: '5J' };
}
