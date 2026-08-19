import { Note, Interval, Scale, Key, Chord } from "tonal";
import { ALL, NOTE_ES } from "../data/notes";
import type { ChromaticNote, NoteInfo, Tonic } from "../types/music";

export function noteAtFret(
  openNote: ChromaticNote,
  openOct: number,
  fret: number,
): NoteInfo {
  const si = ALL.indexOf(openNote);
  const idx = (si + fret) % 12;
  const octUp = Math.floor((si + fret) / 12);
  return { note: ALL[idx], octave: openOct + octUp };
}

export function noteShort(n: string): string {
  return n.replace("#", "♯").replace(/^([A-G])b$/, "$1♭");
}

// German note naming: B → H, A#/Bb → B
export function noteShortDE(n: string): string {
  // First convert B → H, Bb → B
  let result = n.replace(/^B([#b]?)$/, (_match, acc) => {
    if (acc === "#") return "H♯";
    if (acc === "b") return "B";
    return "H";
  });
  // For all others, convert # to ♯ and b to ♭
  result = result.replace("#", "♯").replace(/^([A-G])b$/, "$1♭");
  return result;
}

export function noteDisplay(n: ChromaticNote): string {
  const map: Partial<Record<ChromaticNote, string>> = {
    "C#": "C♯/D♭",
    "D#": "D♯/E♭",
    "F#": "F♯/G♭",
    "G#": "G♯/A♭",
    "A#": "A♯/B♭",
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
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};
export function spelledNameES(spelling: string): string {
  const letter = spelling[0];
  const acc = spelling.slice(1).replace(/#/g, "♯").replace(/b/g, "♭");
  return (LETTER_ES[letter] ?? letter) + acc;
}

// === Major scale spelling (T1 §1.4 / §1.7) ===

// La tónica lleva su propia grafía (sostenido o bemol). La altura cromática para
// audio e índices se deriva con `tonicChromatic`; la ortografía de escalas/acordes
// respeta la grafía elegida (C♯ mayor usa sostenidos; D♭ mayor usa bemoles).
// Las 5 tónicas bemol del tipo `Tonic` siempre tienen un sostenido enarmónico
// equivalente (Tonal.js lo resuelve); las naturales/sostenidos pasan intactos.
export function tonicChromatic(tonic: Tonic): ChromaticNote {
  return (tonic.includes("b") ? Note.enharmonic(tonic) : tonic) as ChromaticNote;
}

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const MAJOR_INTERVALS = Scale.get("major").intervals.map(
  (iv) => Interval.semitones(iv) ?? 0,
);

function tonicSemitone(tonic: Tonic): number {
  return Note.chroma(tonic) ?? 0;
}

function spelledFromLetterAndSemi(letter: string, targetSemi: number): string {
  const naturalSemi = Note.chroma(letter) ?? 0;
  let diff = (targetSemi - naturalSemi + 12) % 12;
  if (diff > 6) diff -= 12;

  let acc = "";
  if (diff === 1) acc = "♯";
  else if (diff === -1) acc = "♭";
  else if (diff === 2) acc = "x";
  else if (diff === -2) acc = "♭♭";

  return letter + acc;
}

// Returns the 7 spelled grades of the major scale starting at `tonic`,
// preserving the rule of one letter per grade (with proper #/b accidentals).
// Output uses ♯ / ♭ glyphs ready for display.
export function majorScaleSpelled(tonic: Tonic): string[] {
  const startLetterIdx = LETTERS.indexOf(tonic[0] as (typeof LETTERS)[number]);
  const tonicSemi = tonicSemitone(tonic);
  const result: string[] = [];

  for (let i = 0; i < 7; i++) {
    const letter = LETTERS[(startLetterIdx + i) % 7];
    const targetSemi = (tonicSemi + MAJOR_INTERVALS[i]) % 12;
    result.push(spelledFromLetterAndSemi(letter, targetSemi));
  }
  return result;
}

// === Relativa menor natural (T3 §3.9/§3.10) ===

// Grados de la menor natural relativa, re-anclados en su propia tónica. Es el
// mismo array de `majorScaleSpelled(majorTonic)` (comparten armadura: mismas 7
// notas), rotado para empezar en el 6to grado (vi) — sin teoría nueva, la menor
// natural ES la mayor relativa leída desde otra tónica.
export function relativeMinorScaleSpelled(majorTonic: Tonic): string[] {
  const major = majorScaleSpelled(majorTonic);
  return [...major.slice(5), ...major.slice(0, 5)];
}

export type ChordType = "M" | "m" | "aug" | "dim";

export interface ChordMember {
  spelled: string; // e.g., "C♯", "E♭", "Cx" (double sharp)
  chromatic: ChromaticNote; // for audio engine
  octave: number;
  role: "T" | "3M" | "3m" | "5J" | "5aug" | "5dim";
}

// Build a triad from a tonic. Letters skip one each (T, third, fifth).
// Major:     T + 3M (4 s.t.) + 5J  (7 s.t.)
// Minor:     T + 3m (3 s.t.) + 5J  (7 s.t.)
// Augmented: T + 3M (4 s.t.) + 5aug (8 s.t.) — may produce double-sharp (x)
// Diminished:T + 3m (3 s.t.) + 5dim (6 s.t.) — may produce double-flat (♭♭)
export function chordSpelled(tonic: Tonic, type: ChordType): ChordMember[] {
  const startLetterIdx = LETTERS.indexOf(tonic[0] as (typeof LETTERS)[number]);
  const tonicSemi = tonicSemitone(tonic);
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic)); // chromatic index for audio
  const thirdSt = type === "M" || type === "aug" ? 4 : 3;
  const fifthSt = type === "aug" ? 8 : type === "dim" ? 6 : 7;
  const offsets: [number, number, number] = [0, thirdSt, fifthSt];
  const roles: ChordMember["role"][] = [
    "T",
    type === "M" || type === "aug" ? "3M" : "3m",
    type === "aug" ? "5aug" : type === "dim" ? "5dim" : "5J",
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
    const fa = Note.freq(`${a.chromatic}${a.octave}`) ?? 0;
    const fb = Note.freq(`${b.chromatic}${b.octave}`) ?? 0;
    return fa - fb;
  });
}

// === Ascending pitch sequences (principio "tónica = nota más grave") ===
// Convierte nombres con grafía libre (F#, Bb, Cb, E#, B#, …) a su clase de
// altura cromática 0–11, resolviendo enarmónicamente al equivalente sostenido
// que el motor de audio entiende.
export function pitchClass(spelled: string): number {
  const ascii = spelled.replace(/♯/g, "#").replace(/♭/g, "b");
  return Note.chroma(ascii) ?? 0;
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
export type IntervalQuality = "P" | "M" | "m" | "aug" | "dim";

const PERFECTABLE: Set<IntervalNumber> = new Set([1, 4, 5, 8]);
// Tonal.js usa códigos de calidad de una letra ('A' aumentada, 'd' disminuida)
// en vez de las palabras 'aug'/'dim' que usa la API pública de este módulo.
const TONAL_QUALITY: Record<IntervalQuality, string> = {
  P: "P",
  M: "M",
  m: "m",
  aug: "A",
  dim: "d",
};

function intervalSemitones(
  number: IntervalNumber,
  quality: IntervalQuality,
): number {
  const perfectable = PERFECTABLE.has(number);
  const allowed = perfectable
    ? quality === "P" || quality === "aug" || quality === "dim"
    : quality === "M" || quality === "m" || quality === "aug" || quality === "dim";
  if (!allowed) {
    throw new Error(
      perfectable
        ? `Intervalo ${number} no acepta calidad ${quality} (solo P/aug/dim)`
        : `Intervalo ${number} no acepta calidad ${quality} (solo M/m/aug/dim)`,
    );
  }
  return Interval.semitones(`${number}${TONAL_QUALITY[quality]}`) ?? 0;
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
  const startLetterIdx = LETTERS.indexOf(tonic[0] as (typeof LETTERS)[number]);
  const tonicSemi = tonicSemitone(tonic);
  const letter = LETTERS[(startLetterIdx + (number - 1)) % 7];
  const targetSemi = (tonicSemi + intervalSemitones(number, quality)) % 12;
  return spelledFromLetterAndSemi(letter, targetSemi);
}

// Construye una nota suelta desde la tónica para un intervalo dado: grafía + nota
// cromática (para audio) + octava ascendente (principio "tónica = piso"). Lo usa el
// árbol-constructor de acordes (§1.7) para los nodos 2 / 3m / 3M / 4 / 5J / 5d, que
// no son tríadas completas y por eso no salen de `chordSpelled`.
export interface IntervalMember {
  spelled: string;
  chromatic: ChromaticNote;
  octave: number;
}

export function intervalMemberFromTonic(
  tonic: Tonic,
  number: IntervalNumber,
  quality: IntervalQuality,
): IntervalMember {
  const semis = intervalSemitones(number, quality);
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
  const spelled = spelledIntervalFromTonic(tonic, number, quality);
  const chromatic = ALL[(tonicIdx + semis) % 12];
  const octave = 4 + Math.floor((tonicIdx + semis) / 12);
  return { spelled, chromatic, octave };
}

// Devuelve las 13 posiciones del círculo cromático desde la tónica, cada una con su
// ortografía estándar. Posiciones naturales tienen solo `sharp` (la nota natural);
// posiciones alteradas exponen ambas enarmonías estándar (C♯/D♭, etc.).
// Posición 0 = tónica; posición 12 = octava.
export interface CircleStep {
  semitones: number;
  sharp: string; // siempre presente (natural o sostenido)
  flat: string | null; // presente solo en posiciones alteradas
}

// Enarmonía estándar para los 5 sostenidos. Las notas naturales no tienen alteración aquí
// (B♯, E♯ son válidas musicalmente pero el método de Josué las excluye del círculo).
const STANDARD_FLAT: Partial<Record<ChromaticNote, string>> = {
  "C#": "D♭",
  "D#": "E♭",
  "F#": "G♭",
  "G#": "A♭",
  "A#": "B♭",
};
const NATURAL_DISPLAY: Partial<Record<ChromaticNote, string>> = {
  "C#": "C♯",
  "D#": "D♯",
  "F#": "F♯",
  "G#": "G♯",
  "A#": "A♯",
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
// Bb → F (not Fb) is a parallel exception when using flat spelling — see t1.s08 in i18n locales.
export function perfectFifth(tonic: ChromaticNote): ChordMember {
  const tonicIdx = ALL.indexOf(tonic);
  const startLetterIdx = LETTERS.indexOf(tonic[0] as (typeof LETTERS)[number]);
  // Fifth lives two letters ahead (T → 3rd → 5th, skipping one).
  const letter = LETTERS[(startLetterIdx + 4) % 7];
  const targetSemi = (tonicSemitone(tonic) + 7) % 12;
  const spelled = spelledFromLetterAndSemi(letter, targetSemi);
  const absChromIdx = (tonicIdx + 7) % 12;
  const octave = 4 + Math.floor((tonicIdx + 7) / 12);
  return { spelled, chromatic: ALL[absChromIdx], octave, role: "5J" };
}

// === Dominantes secundarias (§3.8), vía Tonal.js ===
// Convierte un cifrado ASCII de Tonal (A7, Bbmaj7, m7b5) a glifos ♯/♭ para la
// regla ♭-integral. En un cifrado, todo '#' es ♯ y toda 'b' minúscula es ♭
// (alteración de nota o de la 5ª); las palabras de calidad no usan 'b'.
function toGlyphCifrado(c: string): string {
  return c.replace(/#/g, "♯").replace(/b/g, "♭");
}

export interface ChordAudio {
  cifrado: string; // con glifos ♯/♭
  members: { chromatic: ChromaticNote; octave: number }[];
}

function chordAudio(chordName: string): ChordAudio {
  const notes = Chord.get(chordName).notes; // ej. ["A","C#","E","G"]
  const seq = spelledSequenceAscending(notes, 4);
  return {
    cifrado: toGlyphCifrado(chordName),
    members: seq.map((s) => ({ chromatic: s.name, octave: s.octave })),
  };
}

// === Escenarios de tonización (§3.8) ===
// Reunión 19/8/26. Los tres grados que el profesor usa para contrastar los dos
// escenarios. En mayor los tres aparecen ALTERADOS respecto de la escala (ese es
// el punto: tonizar cambia la calidad): el II se vuelve mayor (V/V), el V se
// vuelve menor (el ii de la tonalidad de IV) y el I se vuelve mayor-dominante
// (V/IV) — en Do: D7, Gm7, C7. En la relativa menor son las calidades naturales:
// ii° m7♭5, v m7, i m7 — en La menor: Bm7♭5, Em7, Am7.
const ASCII_CIFRADO = (c: string) => c.replace(/♯/g, "#").replace(/♭/g, "b");

export interface EscenarioGrado {
  roman: string;
  chord: ChordAudio;
}

export function tonizacionEscenarios(tonic: Tonic): {
  mayor: EscenarioGrado[];
  menor: EscenarioGrado[];
} {
  const may = majorScaleSpelled(tonic).map(ASCII_CIFRADO);
  const men = relativeMinorScaleSpelled(tonic).map(ASCII_CIFRADO);
  return {
    mayor: [
      { roman: "II7", chord: chordAudio(may[1] + "7") },
      { roman: "v", chord: chordAudio(may[4] + "m7") },
      { roman: "I7", chord: chordAudio(may[0] + "7") },
    ],
    menor: [
      { roman: "ii°", chord: chordAudio(men[1] + "m7b5") },
      { roman: "v", chord: chordAudio(men[4] + "m7") },
      { roman: "i", chord: chordAudio(men[0] + "m7") },
    ],
  };
}

export interface SecondaryDominant {
  notation: string; // "V/ii"
  dom: ChordAudio; // la dominante secundaria (ej. A7)
  target: ChordAudio; // el grado tonizado (ej. Dm7)
}

// Las 5 dominantes secundarias de una tonalidad mayor (grados ii..vi; el I es la
// tónica y el vii° no se toniza). Tonal ya las provee: `secondaryDominants` da
// el cifrado del acorde dominante y `chords` el grado diatónico destino.
export function secondaryDominants(tonic: Tonic): SecondaryDominant[] {
  const key = Key.majorKey(tonic);
  const romans = ["ii", "iii", "IV", "V", "vi"];
  return [1, 2, 3, 4, 5].map((i, k) => ({
    notation: `V/${romans[k]}`,
    dom: chordAudio(key.secondaryDominants[i]),
    target: chordAudio(key.chords[i]),
  }));
}
