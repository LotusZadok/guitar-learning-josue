import type { ChromaticNote, NaturalNote, NoteNameES } from '../types/music';

export const ALL: ChromaticNote[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const NATURALS: NaturalNote[] = ['C','D','E','F','G','A','B'];

export const NOTE_COLORS: Record<ChromaticNote, string> = {
  'C':'#c0392b','C#':'#a93226','D':'#e67e22','D#':'#d35400',
  'E':'#f1c40f','F':'#27ae60','F#':'#1e8449','G':'#2980b9',
  'G#':'#2471a3','A':'#8e44ad','A#':'#7d3c98','B':'#1abc9c',
};

export const NOTE_ES: Record<ChromaticNote, NoteNameES> = {
  'C':'Do','C#':'Do♯','D':'Re','D#':'Re♯','E':'Mi','F':'Fa',
  'F#':'Fa♯','G':'Sol','G#':'Sol♯','A':'La','A#':'La♯','B':'Si',
};

export const NOTE_FREQS: Record<string, number> = {};
(function buildFreqs() {
  const base: Record<string, number> = {
    'C':16.35,'C#':17.32,'D':18.35,'D#':19.45,'E':20.60,'F':21.83,
    'F#':23.12,'G':24.50,'G#':25.96,'A':27.50,'A#':29.14,'B':30.87,
  };
  for (let oct = 0; oct <= 8; oct++) {
    for (const [n, f] of Object.entries(base)) {
      NOTE_FREQS[n + oct] = f * Math.pow(2, oct);
    }
  }
})();
