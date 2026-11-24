import { Note, Interval, Scale, Key, Chord } from "tonal";
import { ALL } from "../data/notes.ts";
import type { ChromaticNote, NoteSpelling, Tonic } from "../types/music";

// Reunión 22/11/26 (#8, #5; D5): un solo formateador para mostrar una nota.
// Acepta grafía ASCII o con glifo (F#, F♯, Bb, B♭, Bbb, Fx) y devuelve letra +
// glifo. En alemán solo cambia la letra B: B → H y B♭ → B (H♯, H♭♭). Nunca se
// pasa a playNote: Note.freq('H4') es null.
const ALTERACION_GLIFO: Record<string, string> = {
  "": "", "#": "♯", "♯": "♯", b: "♭", "♭": "♭", bb: "♭♭", "♭♭": "♭♭", x: "x", "##": "x", "♯♯": "x",
};

export function formatNote(grafia: string, lang: string): string {
  const m = /^([A-G])(.*)$/.exec(grafia);
  const alteracion = m ? ALTERACION_GLIFO[m[2]] : undefined;
  if (!m || alteracion === undefined) {
    console.warn(`formatNote: grafía no reconocida "${grafia}"`);
    return grafia;
  }
  const letra = m[1];
  if (lang === "de" && letra === "B") return alteracion === "♭" ? "B" : `H${alteracion}`;
  return letra + alteracion;
}

// Un cifrado (A7, Bbmaj7, F#m7b5, F##dim) para mostrar: la fundamental pasa por
// `formatNote` (en alemán Bm → Hm, B♭maj7 → Bmaj7) y en el sufijo todo '#' es ♯
// y toda 'b' minúscula es ♭ (regla ♭ integral; las calidades no usan 'b').
export function formatChordSymbol(cifrado: string, lang: string): string {
  const m = /^([A-G](?:##|♯♯|#|♯|x|bb|♭♭|b|♭)?)(.*)$/.exec(cifrado);
  if (!m) {
    console.warn(`formatChordSymbol: cifrado no reconocido "${cifrado}"`);
    return cifrado;
  }
  return formatNote(m[1], lang) + m[2].replace(/#/g, "♯").replace(/b/g, "♭");
}

// Reunión 22/11/26 (#9, #10; D6): en alemán los intervalos usan K (klein),
// G (groß), R (rein), V (vermindert) y Ü (übermäßig), con el número primero
// como en español (3K, 5R). Los códigos internos ('3m', '5d') no cambian: son
// los roles de los árboles y de los tests; solo se traducen al dibujar.
const CALIDAD_DE: Record<string, string> = { m: "K", M: "G", J: "R", d: "V", a: "Ü" };

export function intervalLabel(codigo: string, lang: string): string {
  if (lang !== "de") return codigo;
  return codigo.replace(/(\d)([mMJda])/g, (_, n: string, q: string) => n + CALIDAD_DE[q]);
}

export function noteShort(n: string): string {
  return formatNote(n, "es");
}

export function noteShortDE(n: string): string {
  return formatNote(n, "de");
}

// Nombre en latín (solfeo) que RESPETA la grafía elegida: Db → "Re♭", no "Do♯".
// `NOTE_ES` enarmoniza al sostenido (bueno para identidad cromática), pero al
// nombrar la tónica/nota con su grafía hay que conservar el bemol.
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

// Datos musicales (§1.2): las 12 notas del círculo cromático, desde La.
const CC_TABLA = [
  "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab",
] as const;

export function tablaCromaticaDesdeTonica(tonic: Tonic): string[] {
  const offset = ALL.indexOf(tonicChromatic(tonic)) - ALL.indexOf("A");
  return CC_TABLA.map((_, i) => CC_TABLA[(i + offset + 12) % 12]);
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

// La menor armónica de la relativa: la natural con la 7ª subida un semitono
// (reunión 19/10/26: "sólo voy a cambiar la séptima nota un semitono arriba").
// La sensible se deletrea como 7M de la tónica menor, así que conserva su
// letra (G♯ y no A♭; Fx en Sol♯ menor).
export function harmonicMinorScaleSpelled(majorTonic: Tonic): string[] {
  const natural = relativeMinorScaleSpelled(majorTonic);
  const tonicaMenor = aAscii(natural[0]) as Tonic;
  return [...natural.slice(0, 6), spelledIntervalFromTonic(tonicaMenor, 7, "M")];
}

// Los siete grados con séptima de la menor armónica, terceras apiladas sobre
// la escala. El cifrado del III aumentado con 7M (maj7♯5) y el del menor con
// 7M (mMaj7, D10 del plan del 19/10) siguen la convención del resto de la app.
const MENOR_ARMONICA = {
  romanos: ["i", "ii°", "III+", "iv", "V", "VI", "vii°"],
  sufijos: ["mMaj7", "m7♭5", "maj7♯5", "m7", "7", "maj7", "°7"],
} as const;

export function acordeMenorArmonica(
  majorTonic: Tonic,
  grado: number,
): { romano: string; cifrado: string; notas: string[] } {
  const escala = harmonicMinorScaleSpelled(majorTonic);
  return {
    romano: MENOR_ARMONICA.romanos[grado],
    cifrado: escala[grado] + MENOR_ARMONICA.sufijos[grado],
    notas: [0, 2, 4, 6].map((k) => escala[(grado + k) % 7]),
  };
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

// Reunión 22/11/26 (#15, "planetas"; #12): un acorde, intervalo o escala escrito
// sube desde su primera nota. La primera se ancla a la tónica y cada nota
// siguiente sube; una nota repetida (la 8J) suena una octava arriba.
export function octavasDesdeRaiz(tonic: Tonic, notas: string[]): number[] {
  if (notas.length === 0) return [];
  return spelledSequenceAscending(notas, octaveAboveTonic(tonic, notas[0])).map((n) => n.octave);
}

// Reunión 22/11/26 (#24): en los ejemplos de quintas cada nota se mide contra la
// raíz (la primera), no contra la anterior: "Si → Fa♯ (no Fa)" deja las dos
// quintas sobre Si, y una raíz enarmónica nueva (La♯ tras Si♭ → Fa) vuelve abajo.
export function octavasDesdeLaPrimera(tonic: Tonic, notas: string[]): number[] {
  if (notas.length === 0) return [];
  const raiz = notas[0] as Tonic;
  const base = octaveAboveTonic(tonic, raiz);
  return notas.map((n) => octaveAboveTonic(raiz, n, base));
}

// §1.3 (reunión 22/11/26, #7): los pasos 1 y 2 del procedimiento y el
// Resultado, como tres filas de 13 celdas alineadas con T…8J.
// Letra de cada intervalo (0–12 semitonos); el tritono lleva las dos letras.
const LETTER_OFFSETS_13 = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 0] as const;
const TRITONO = 6;

export interface FilasDeIntervalos {
  letras: string[];
  cromatico: NoteSpelling[][];
  resultado: NoteSpelling[][];
}

export function filasDeIntervalos(tonic: Tonic): FilasDeIntervalos {
  const letra0 = LETTERS.indexOf(tonic[0] as (typeof LETTERS)[number]);
  const letraEn = (offset: number) => LETTERS[(letra0 + offset) % 7];
  const letras = LETTER_OFFSETS_13.map((o, i) =>
    i === TRITONO ? `${letraEn(3)}-${letraEn(4)}` : letraEn(o),
  );
  const cromatico = spelledChromaticCircle(tonic).map(({ sharp, flat }) =>
    [sharp, flat].filter((n): n is string => n !== null).map((n) => aAscii(n) as NoteSpelling),
  );
  // Resultado: la grafía cuya letra coincide con el paso 1; el tritono muestra las dos.
  const resultado = cromatico.map((grafias, i) =>
    grafias.length === 1 || i === TRITONO
      ? grafias
      : [grafias.find((g) => g[0] === letras[i]) ?? grafias[0]],
  );
  return { letras, cromatico, resultado };
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

// === Familias del dim7 (§3.2) ===
// Las tres familias, con la grafía que usa el método (G♭ y no F♯ en la de C°,
// B♭ y no A♯ en la de C♯°). Reunión 19/10/26: cada nota alterada muestra
// también su enarmonía ("la bemol saldría como sol sostenido también
// disminuido... yo utilizo a veces más los nombres sostenidos").
export interface MiembroDim7 {
  note: ChromaticNote;
  grafia: string;
  enarmonia?: string;
}

function enarmoniaDe(note: ChromaticNote, grafia: string): string | undefined {
  const bemol = STANDARD_FLAT[note];
  const sostenido = NATURAL_DISPLAY[note];
  if (!bemol || !sostenido) return undefined;
  return grafia === bemol ? sostenido : bemol;
}

const miembro = (note: ChromaticNote, grafia: string): MiembroDim7 => {
  const enarmonia = enarmoniaDe(note, grafia);
  return enarmonia ? { note, grafia, enarmonia } : { note, grafia };
};

export const FAMILIAS_DIM7: { simbolo: string; simboloEnarmonico?: string; miembros: MiembroDim7[] }[] = [
  {
    simbolo: "C°",
    miembros: [miembro("C", "C"), miembro("D#", "E♭"), miembro("F#", "G♭"), miembro("A", "A")],
  },
  {
    simbolo: "C♯°",
    simboloEnarmonico: "D♭°",
    miembros: [miembro("C#", "C♯"), miembro("E", "E"), miembro("G", "G"), miembro("A#", "B♭")],
  },
  {
    simbolo: "D°",
    miembros: [miembro("D", "D"), miembro("F", "F"), miembro("G#", "A♭"), miembro("B", "B")],
  },
];

export function spelledChromaticCircle(tonic: Tonic): CircleStep[] {
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
  return Array.from({ length: 13 }, (_, i) => {
    const note = ALL[(tonicIdx + i) % 12];
    const flat = STANDARD_FLAT[note] ?? null;
    const sharp = NATURAL_DISPLAY[note] ?? note;
    return { semitones: i, sharp, flat };
  });
}

export function aAscii(s: string): string {
  return s.replace(/♯/g, "#").replace(/♭/g, "b");
}

// Las grafías que NoteToken sabe colorear y sonar; el resto (B♭♭, F♭, E♯…) va
// como texto plano con glifo (DESIGN §5 "NoteToken en Tablas").
const NOTE_SPELLINGS = new Set<string>([
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Db", "Eb", "Gb", "Ab", "Bb",
]);

export function esNoteSpelling(s: string): s is NoteSpelling {
  return NOTE_SPELLINGS.has(s);
}

// Las grafías del círculo cromático en esa posición que no son la correcta: la
// aclaración del paso 2 de §1.7 ("es B♭♭, no A").
export function otrasGrafias(tonic: Tonic, semis: number, grafia: string): string[] {
  const { sharp, flat } = spelledChromaticCircle(tonic)[semis];
  return [sharp, flat].filter((n): n is string => n !== null && n !== grafia);
}

// Reunión 22/11/26 (#19): el paso 1 de §1.7 escribe solo las letras de la tríada.
export function letrasDeTriada(tonic: Tonic): string[] {
  return chordSpelled(tonic, "M").map((m) => m.spelled[0]);
}

// Reunión 22/11/26 (#21): el conteo cromático de §1.7, de la tónica a su tercera
// o quinta. La tónica conserva su grafía ("Sol bemol no es Fa sostenido") y la
// llegada respeta la letra del paso 1 (3m de Sol♭ = Si♭♭); en el medio quedan
// las dos grafías del círculo cromático.
export interface PasoCromatico {
  notas: string[];
  semis: number;
  octava: number;
}

export function pasoSemitonos(
  tonic: Tonic,
  numero: IntervalNumber,
  calidad: IntervalQuality,
): PasoCromatico[] {
  const llegada = intervalSemitones(numero, calidad);
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
  const circulo = spelledChromaticCircle(tonic);
  return Array.from({ length: llegada + 1 }, (_, semis) => {
    const notas =
      semis === 0 ? [noteShort(tonic)]
      : semis === llegada ? [spelledIntervalFromTonic(tonic, numero, calidad)]
      : [circulo[semis].sharp, circulo[semis].flat].filter((n): n is string => n !== null);
    return { notas, semis, octava: 4 + Math.floor((tonicIdx + semis) / 12) };
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
export interface ChordAudio {
  cifrado: string; // con glifos ♯/♭
  members: { chromatic: ChromaticNote; octave: number }[];
}

function chordAudio(chordName: string): ChordAudio {
  const notes = Chord.get(chordName).notes; // ej. ["A","C#","E","G"]
  const seq = spelledSequenceAscending(notes, 4);
  return {
    cifrado: formatChordSymbol(chordName, "es"),
    members: seq.map((s) => ({ chromatic: s.name, octave: s.octave })),
  };
}

// === ii-V-I (§3.7, §3.10) y escenarios de tonización (§3.8) ===
export type RolIIVI = "medium" | "tense" | "stable";

export interface AcordeIIVI {
  cifrado: string; // con glifos ♯/♭
  notas: string[]; // grafía con glifos, desde la fundamental
  rol: RolIIVI;
}

interface DefIIVI {
  grado: number; // índice de la fundamental en la escala
  sufijo: string;
  voces: number[]; // índices de escala, terceras apiladas
  rol: RolIIVI;
  sensibleElevada?: boolean;
}

// ii-V-I mayor con séptimas diatónicas: subdominante (media) → dominante
// (alta) → tónica (resolución).
const IIVI_MAYOR: DefIIVI[] = [
  { grado: 1, sufijo: "m7", voces: [1, 3, 5, 0], rol: "medium" },
  { grado: 4, sufijo: "7", voces: [4, 6, 1, 3], rol: "tense" },
  { grado: 0, sufijo: "maj7", voces: [0, 2, 4, 6], rol: "stable" },
];

// ii°-V7-i sobre la relativa menor natural. El V7 es el único que se aparta de
// la escala natural: sube la sensible (menor armónica) para sonar dominante.
const IIVI_MENOR: DefIIVI[] = [
  { grado: 1, sufijo: "m7♭5", voces: [1, 3, 5, 0], rol: "medium" },
  { grado: 4, sufijo: "7", voces: [4, 6, 1, 3], rol: "tense", sensibleElevada: true },
];
const I_MENOR_TRIADA: DefIIVI = { grado: 0, sufijo: "m", voces: [0, 2, 4], rol: "stable" };
const I_MENOR_SEPTIMA: DefIIVI = { grado: 0, sufijo: "m7", voces: [0, 2, 4, 6], rol: "stable" };

// `tonica` es la tónica MAYOR activa: en modo menor se usa su relativa (misma
// armadura). `septimaEnI` existe porque §3.10 muestra el i como tríada
// (decisión de su ola) y §3.8 lo pide con séptima ("todos deberían tener
// séptima, o ninguno").
export function progresionIIVI({
  tonica,
  modo,
  septimaEnI,
}: {
  tonica: Tonic;
  modo: "mayor" | "menor";
  septimaEnI: boolean;
}): AcordeIIVI[] {
  const escala = modo === "mayor" ? majorScaleSpelled(tonica) : relativeMinorScaleSpelled(tonica);
  const sensible = harmonicMinorScaleSpelled(tonica)[6];
  const defs =
    modo === "mayor" ? IIVI_MAYOR : [...IIVI_MENOR, septimaEnI ? I_MENOR_SEPTIMA : I_MENOR_TRIADA];
  return defs.map((d) => ({
    cifrado: escala[d.grado] + d.sufijo,
    notas: d.voces.map((v) =>
      d.sensibleElevada && v === 6 ? sensible : escala[v],
    ),
    rol: d.rol,
  }));
}

// === Dominante y vii° (§3.6.2) ===
// Los dos acordes de la tonalidad que llevan el tritono (4º y 7º grados) y por
// eso resuelven al I. Reunión 19/10/26: cada voz dice qué intervalo es dentro
// del acorde y, si es del tritono, qué sensible es: la tonal es el 7º grado
// de la escala y la modal el 4º.
export type OrigenDominante = "V7" | "vii";
export type IntervaloEnAcorde = "T" | "3M" | "3m" | "5J" | "5d" | "7m";

export interface VozDominante {
  nota: string; // grafía con glifos
  grado: number; // índice en la escala mayor
  intervalo: IntervaloEnAcorde;
  tritono: boolean;
  sensible?: "tonal" | "modal";
}

const DOMINANTES: Record<
  OrigenDominante,
  { roman: string; sufijo: string; grados: number[]; intervalos: IntervaloEnAcorde[] }
> = {
  V7: { roman: "V7", sufijo: "7", grados: [4, 6, 1, 3], intervalos: ["T", "3M", "5J", "7m"] },
  vii: { roman: "vii°", sufijo: "m7♭5", grados: [6, 1, 3, 5], intervalos: ["T", "3m", "5d", "7m"] },
};

const SENSIBLE_POR_GRADO: Record<number, "tonal" | "modal"> = { 6: "tonal", 3: "modal" };

export function acordeDominante(
  tonica: Tonic,
  origen: OrigenDominante,
): { roman: string; cifrado: string; voces: VozDominante[] } {
  const escala = majorScaleSpelled(tonica);
  const def = DOMINANTES[origen];
  return {
    roman: def.roman,
    cifrado: escala[def.grados[0]] + def.sufijo,
    voces: def.grados.map((grado, i) => {
      const sensible = SENSIBLE_POR_GRADO[grado];
      return {
        nota: escala[grado],
        grado,
        intervalo: def.intervalos[i],
        tritono: sensible !== undefined,
        ...(sensible ? { sensible } : {}),
      };
    }),
  };
}

// Reunión 19/10/26: los dos escenarios son el ii-V-I mayor y el ii°-V7-i de
// la relativa menor, todos con séptima ("el primero debería ser maj7, el
// quinto dominante y el segundo menor7"; en menor "este debería ser mayor,
// La7"). La lectura anterior (grados alterados por la tonización: II7, v, I7)
// la refutó el profesor.
export interface EscenarioGrado {
  roman: string;
  chord: ChordAudio;
}

const ROMANOS_ESCENARIO = {
  mayor: ["ii7", "V7", "Imaj7"],
  menor: ["iiø7", "V7", "i7"],
} as const;

export function tonizacionEscenarios(tonic: Tonic): {
  mayor: EscenarioGrado[];
  menor: EscenarioGrado[];
} {
  const escenario = (modo: "mayor" | "menor"): EscenarioGrado[] =>
    progresionIIVI({ tonica: tonic, modo, septimaEnI: true }).map((acorde, i) => ({
      roman: ROMANOS_ESCENARIO[modo][i],
      chord: {
        cifrado: acorde.cifrado,
        members: spelledSequenceAscending(acorde.notas, 4).map((s) => ({
          chromatic: s.name,
          octave: s.octave,
        })),
      },
    }));
  return { mayor: escenario("mayor"), menor: escenario("menor") };
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
