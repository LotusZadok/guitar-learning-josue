import { ALL, NOTE_ES, NOTE_FREQS } from '../data/notes';
import type { ChromaticNote, NoteInfo, Tonic } from '../types/music';

export function noteAtFret(openNote: ChromaticNote, openOct: number, fret: number): NoteInfo {
  const si = ALL.indexOf(openNote);
  const idx = (si + fret) % 12;
  const octUp = Math.floor((si + fret) / 12);
  return { note: ALL[idx], octave: openOct + octUp };
}

export function noteShort(n: string): string {
  return n.replace('#', '♯').replace(/^([A-G])b$/, '$1♭');
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

// Nombre en latín (solfeo) que RESPETA la grafía elegida: Db → "Re♭", no "Do♯".
// `noteNameES`/`NOTE_ES` enarmonizan al sostenido (bueno para identidad cromática),
// pero al nombrar la tónica/nota con su grafía hay que conservar el bemol.
const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};
export function spelledNameES(spelling: string): string {
  const letter = spelling[0];
  const acc = spelling.slice(1).replace(/#/g, '♯').replace(/b/g, '♭');
  return (LETTER_ES[letter] ?? letter) + acc;
}

// === Major scale spelling (T1 §1.4 / §1.7) ===

// La tónica lleva su propia grafía (sostenido o bemol). La altura cromática para
// audio e índices se deriva con `tonicChromatic`; la ortografía de escalas/acordes
// respeta la grafía elegida (C♯ mayor usa sostenidos; D♭ mayor usa bemoles).
const FLAT_TO_SHARP: Record<string, ChromaticNote> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
};

export function tonicChromatic(tonic: Tonic): ChromaticNote {
  return (FLAT_TO_SHARP[tonic] ?? tonic) as ChromaticNote;
}

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const NATURAL_SEMITONE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;

function tonicSemitone(tonic: Tonic): number {
  const letter = tonic[0];
  const acc = tonic[1];
  const delta = acc === '#' ? 1 : acc === 'b' ? -1 : 0;
  return (NATURAL_SEMITONE[letter] + delta + 12) % 12;
}

function spelledFromLetterAndSemi(letter: string, targetSemi: number): string {
  const naturalSemi = NATURAL_SEMITONE[letter];
  let diff = (targetSemi - naturalSemi + 12) % 12;
  if (diff > 6) diff -= 12;

  let acc = '';
  if (diff === 1) acc = '♯';
  else if (diff === -1) acc = '♭';
  else if (diff === 2) acc = 'x';
  else if (diff === -2) acc = '♭♭';

  return letter + acc;
}

// Returns the 7 spelled grades of the major scale starting at `tonic`,
// preserving the rule of one letter per grade (with proper #/b accidentals).
// Output uses ♯ / ♭ glyphs ready for display.
export function majorScaleSpelled(tonic: Tonic): string[] {
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

export type ChordType = 'M' | 'm' | 'aug' | 'dim';

export interface ChordMember {
  spelled: string;        // e.g., "C♯", "E♭", "Cx" (double sharp)
  chromatic: ChromaticNote; // for audio engine
  octave: number;
  role: 'T' | '3M' | '3m' | '5J' | '5aug' | '5dim';
}

// Build a triad from a tonic. Letters skip one each (T, third, fifth).
// Major:     T + 3M (4 s.t.) + 5J  (7 s.t.)
// Minor:     T + 3m (3 s.t.) + 5J  (7 s.t.)
// Augmented: T + 3M (4 s.t.) + 5aug (8 s.t.) — may produce double-sharp (x)
// Diminished:T + 3m (3 s.t.) + 5dim (6 s.t.) — may produce double-flat (♭♭)
export function chordSpelled(tonic: Tonic, type: ChordType): ChordMember[] {
  const startLetterIdx = LETTERS.indexOf(tonic[0] as typeof LETTERS[number]);
  const tonicSemi = tonicSemitone(tonic);
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic)); // chromatic index for audio
  const thirdSt = (type === 'M' || type === 'aug') ? 4 : 3;
  const fifthSt  = type === 'aug' ? 8 : type === 'dim' ? 6 : 7;
  const offsets: [number, number, number] = [0, thirdSt, fifthSt];
  const roles: ChordMember['role'][] = [
    'T',
    (type === 'M' || type === 'aug') ? '3M' : '3m',
    type === 'aug' ? '5aug' : type === 'dim' ? '5dim' : '5J',
  ];

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

// Reorders chord members so each successive note is higher than the previous.
// Prevents arpeggio from playing a descending leap when octave wraps backward.
export function ensureAscending(members: ChordMember[]): ChordMember[] {
  return [...members].sort((a, b) => {
    const fa = NOTE_FREQS[`${a.chromatic}${a.octave}`] ?? 0;
    const fb = NOTE_FREQS[`${b.chromatic}${b.octave}`] ?? 0;
    return fa - fb;
  });
}

// === Ascending pitch sequences (principio "tónica = nota más grave") ===
// Convierte nombres con grafía libre (F#, Bb, Cb, E#, B#, …) a su clase de
// altura cromática 0–11, resolviendo enarmónicamente al equivalente sostenido
// que el motor de audio entiende.
export function pitchClass(spelled: string): number {
  const letter = spelled[0] as keyof typeof NATURAL_SEMITONE;
  let delta = 0;
  for (const ch of spelled.slice(1)) {
    if (ch === '#' || ch === '♯') delta += 1;
    else if (ch === 'b' || ch === '♭') delta -= 1;
    else if (ch === 'x') delta += 2;
  }
  return ((NATURAL_SEMITONE[letter] ?? 0) + delta + 24) % 12;
}

// Ordena una secuencia de notas (por nombre) en alturas ascendentes: la primera
// es la más grave y cada nota siguiente sube de octava si su clase de altura no
// es estrictamente mayor que la anterior. Devuelve nombres cromáticos (sharp)
// listos para el motor de audio. `closeOctave` añade la tónica una octava arriba.
export function spelledSequenceAscending(
  names: string[],
  baseOctave = 4,
  closeOctave = false,
): { name: ChromaticNote; octave: number }[] {
  const result: { name: ChromaticNote; octave: number }[] = [];
  let prevPc = -1;
  let octave = baseOctave;
  for (const n of names) {
    const pc = pitchClass(n);
    if (pc <= prevPc) octave++;
    result.push({ name: ALL[pc], octave });
    prevPc = pc;
  }
  if (closeOctave && names.length > 0) {
    // La octava de cierre es exactamente UNA arriba de la tónica inicial
    // (baseOctave + 1), no una arriba de la última nota: si la escala envolvió
    // octava internamente (toda escala que cruza C), `octave` ya subió y cerrar
    // con `octave + 1` saltaba 2 octavas. La 8va justa siempre es base + 1.
    result.push({ name: ALL[pitchClass(names[0])], octave: baseOctave + 1 });
  }
  return result;
}

// Reunión 9/6/26 (principio "tónica = piso"): octava que coloca una nota suelta
// EN o POR ENCIMA de la tónica activa. Cuando un componente reproduce notas
// individuales ancladas a una tonalidad (prosa, tablas), la tónica es la nota
// más grave posible y todo lo demás orbita ascendiendo desde ella dentro de
// [tónica, tónica + 8va). `base` es la octava de referencia de la tónica (4,
// la base que asume el motor antes del transpositor global de octava).
// Los contextos de identidad absoluta (círculo cromático, rueda de quintas)
// NO usan este helper: presentan las 12 notas a octava fija a propósito.
export function octaveAboveTonic(tonic: Tonic, note: string, base = 4): number {
  return pitchClass(note) >= pitchClass(tonic) ? base : base + 1;
}

// === Generalized enharmonic interval spelling (reunión 24/5/26) ===
// Regla: el número del intervalo determina la LETRA; la calidad la alteración.
// Una 3ra de G es siempre B (B♭ o B). Una 4ta de F es siempre B (B♭ o B), nunca A#.

export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type IntervalQuality = 'P' | 'M' | 'm' | 'aug' | 'dim';

const DIATONIC_MAJOR_SEMITONES: Record<IntervalNumber, number> = {
  1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12,
};
const PERFECTABLE: Set<IntervalNumber> = new Set([1, 4, 5, 8]);

function intervalSemitones(number: IntervalNumber, quality: IntervalQuality): number {
  const base = DIATONIC_MAJOR_SEMITONES[number];
  if (PERFECTABLE.has(number)) {
    if (quality === 'P') return base;
    if (quality === 'aug') return base + 1;
    if (quality === 'dim') return base - 1;
    throw new Error(`Intervalo ${number} no acepta calidad ${quality} (solo P/aug/dim)`);
  }
  if (quality === 'M') return base;
  if (quality === 'm') return base - 1;
  if (quality === 'aug') return base + 1;
  if (quality === 'dim') return base - 2;
  throw new Error(`Intervalo ${number} no acepta calidad ${quality} (solo M/m/aug/dim)`);
}

// Devuelve la ortografía del intervalo desde la tónica (con la letra correcta y alteración).
// Ej.: spelledIntervalFromTonic('F', 4, 'P') === 'B♭'
//      spelledIntervalFromTonic('G', 3, 'M') === 'B'
//      spelledIntervalFromTonic('A', 2, 'M') === 'B'  (nunca A♯)
export function spelledIntervalFromTonic(
  tonic: Tonic,
  number: IntervalNumber,
  quality: IntervalQuality,
): string {
  const startLetterIdx = LETTERS.indexOf(tonic[0] as typeof LETTERS[number]);
  const tonicSemi = tonicSemitone(tonic);
  const letter = LETTERS[(startLetterIdx + (number - 1)) % 7];
  const targetSemi = (tonicSemi + intervalSemitones(number, quality)) % 12;
  return spelledFromLetterAndSemi(letter, targetSemi);
}

// Devuelve las 13 posiciones del círculo cromático desde la tónica, cada una con su
// ortografía estándar. Posiciones naturales tienen solo `sharp` (la nota natural);
// posiciones alteradas exponen ambas enarmonías estándar (C♯/D♭, etc.).
// Posición 0 = tónica; posición 12 = octava.
export interface CircleStep {
  semitones: number;
  sharp: string;            // siempre presente (natural o sostenido)
  flat: string | null;      // presente solo en posiciones alteradas
}

// Enarmonía estándar para los 5 sostenidos. Las notas naturales no tienen alteración aquí
// (B♯, E♯ son válidas musicalmente pero el método de Josué las excluye del círculo).
const STANDARD_FLAT: Partial<Record<ChromaticNote, string>> = {
  'C#': 'D♭', 'D#': 'E♭', 'F#': 'G♭', 'G#': 'A♭', 'A#': 'B♭',
};
const NATURAL_DISPLAY: Partial<Record<ChromaticNote, string>> = {
  'C#': 'C♯', 'D#': 'D♯', 'F#': 'F♯', 'G#': 'G♯', 'A#': 'A♯',
};

export function spelledChromaticCircle(tonic: Tonic): CircleStep[] {
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
  return Array.from({ length: 13 }, (_, i) => {
    const note = ALL[(tonicIdx + i) % 12];
    const flat = STANDARD_FLAT[note] ?? null;
    const sharp = NATURAL_DISPLAY[note] ?? note;
    return { semitones: i, sharp, flat };
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
