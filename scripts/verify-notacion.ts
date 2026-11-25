// Arnés de verificación de la notación (formatNote y afines).
// Se corre con `npm run verify:notacion` (node --experimental-strip-types).
import { readFileSync } from 'node:fs';
import { formatChordSymbol, formatNote, intervalLabel, intervalMemberFromTonic, nombreNota, pitchClass } from '../src/utils/noteCalculations.ts';
import { BUILDER_17, BUILDER_312, BUILDER_32, BUILDER_33, BUILDER_34, BUILDER_43 } from '../src/components/primitives/AcordesBuilder/configs.ts';
import { ALL, NOTE_DE } from '../src/data/notes.ts';
import { check, resumen } from './verify-helpers.ts';

console.log('\n· formatNote: un solo formateador (reunión 22/11/26, #8, #5; D5 letra + glifo) ·');
check('es: F# → F♯', formatNote('F#', 'es'), 'F♯');
check('es: Bb y B♭ → B♭', [formatNote('Bb', 'es'), formatNote('B♭', 'es')], ['B♭', 'B♭']);
check('es: Bbb → B♭♭, E# → E♯', [formatNote('Bbb', 'es'), formatNote('E#', 'es')], ['B♭♭', 'E♯']);
check('es: doble sostenido como x (D7)', formatNote('Fx', 'es'), 'Fx');
check('de: B → H', formatNote('B', 'de'), 'H');
check('de: Bb y B♭ → B', [formatNote('Bb', 'de'), formatNote('B♭', 'de')], ['B', 'B']);
check('de: nombres alemanes (profesor, 24/11): C#, Eb, Ab, Db, Gb → Cis, Es, As, Des, Ges',
  ['C#', 'Eb', 'Ab', 'Db', 'Gb', 'C'].map((n) => formatNote(n, 'de')), ['Cis', 'Es', 'As', 'Des', 'Ges', 'C']);
check('de: B# → His, Bbb → Heses, Fx → Fisis, E# → Eis, Cb → Ces',
  ['B#', 'Bbb', 'Fx', 'E#', 'Cb'].map((n) => formatNote(n, 'de')), ['His', 'Heses', 'Fisis', 'Eis', 'Ces']);
check('es: formatear lo ya formateado no cambia nada',
  ['C', 'F#', 'Bb', 'Bbb', 'E#', 'Fx'].filter((n) => formatNote(formatNote(n, 'es'), 'es') !== formatNote(n, 'es')), []);
check('es: la altura no cambia', ['F#', 'Bb', 'Bbb', 'E#', 'Cb'].filter((n) => pitchClass(formatNote(n, 'es')) !== pitchClass(n)), []);
check('de: Mi♭ mayor se nombra Es, nunca Dis', formatNote('Eb', 'de'), 'Es');
check('NOTE_DE coincide con formatNote en las 12 notas', ALL.filter((c) => NOTE_DE[c] !== formatNote(c, 'de')), []);

console.log('\n· formatChordSymbol: cifrados en T2 a T5 (reunión 22/11/26, #8, #5) ·');
check('de: Bm → Hm', formatChordSymbol('Bm', 'de'), 'Hm');
check('de: Bbmaj7 y B♭maj7 → Bmaj7', [formatChordSymbol('Bbmaj7', 'de'), formatChordSymbol('B♭maj7', 'de')], ['Bmaj7', 'Bmaj7']);
check('de: los cifrados siguen con letra + glifo (F♯m7, E♭maj7)', [formatChordSymbol('F#m7', 'de'), formatChordSymbol('Ebmaj7', 'de')], ['F♯m7', 'E♭maj7']);
check('es: F#m7 → F♯m7', formatChordSymbol('F#m7', 'es'), 'F♯m7');
check('es: Bm7b5 → Bm7♭5, la b de la quinta también', formatChordSymbol('Bm7b5', 'es'), 'Bm7♭5');
check('es: F##dim → Fxdim', formatChordSymbol('F##dim', 'es'), 'Fxdim');
check('es: idempotente', formatChordSymbol(formatChordSymbol('Ebmaj7', 'es'), 'es'), 'E♭maj7');

console.log('\n· intervalLabel: abreviaturas en alemán (reunión 22/11/26, #9, #10; D6) ·');
check('de: m, M, J, d, a → K, G, R, V, Ü con el número primero',
  ['3m', '3M', '4J', '5d', '4a', '8J', '7d'].map((c) => intervalLabel(c, 'de')), ['3K', '3G', '4R', '5V', '4Ü', '8R', '7V']);
check('de: el tritono doble y la tónica', [intervalLabel('4a/5d', 'de'), intervalLabel('T', 'de')], ['4Ü/5V', 'T']);
check('es: sin cambios', ['3m', '3M', '4J', '5d', '4a/5d', 'T'].map((c) => intervalLabel(c, 'es')), ['3m', '3M', '4J', '5d', '4a/5d', 'T']);

console.log('\n· Ola 8a: nombres de acorde y de nota por idioma (reunión 22/11/26, #10) ·');
const locales = ['es', 'de'].map((l) => JSON.parse(readFileSync(`src/i18n/locales/${l}.json`, 'utf-8').trim())); // trim quita el BOM de los JSON
const calidades = [...new Set([BUILDER_17, BUILDER_312, BUILDER_32, BUILDER_33, BUILDER_34, BUILDER_43].flatMap((c) => c.chords.map((a) => a.calidad)))];
check('cada calidad de las 5 configs tiene nombre en common.chord_names de es y de',
  calidades.filter((q) => locales.some((j) => typeof j.common.chord_names?.[q] !== 'string')), []);
check('es: los nombres de siempre (menor, disminuido 7)',
  [locales[0].common.chord_names?.minor, locales[0].common.chord_names?.diminished7], ['menor', 'disminuido 7']);
check('nombreNota: es en solfeo con su grafía, de con el nombre alemán',
  [nombreNota('Db', 'es'), nombreNota('C#', 'es'), nombreNota('Db', 'de'), nombreNota('B', 'de'), nombreNota('Bb', 'de')],
  ['Re♭', 'Do♯', 'Des', 'H', 'B']);

console.log('\n· 4.3 Acordes aumentados (borrador del 19/10/26) ·');
const aumentado = (t: 'C' | 'Eb' | 'F#' | 'B') => [1, 3, 5].map((n) => intervalMemberFromTonic(t, n as 1 | 3 | 5, n === 1 ? 'P' : n === 3 ? 'M' : 'aug').spelled);
check('T + 3M + 5a: Do = C E G♯, Mi♭ = E♭ G B, Fa♯ = F♯ A♯ Cx, Si = B D♯ Fx',
  [aumentado('C'), aumentado('Eb'), aumentado('F#'), aumentado('B')],
  [['C', 'E', 'G♯'], ['E♭', 'G', 'B'], ['F♯', 'A♯', 'Cx'], ['B', 'D♯', 'Fx']]);
check('el árbol 4.3 arma el mayor y el aumentado desde la 3M', BUILDER_43.chords.map((c) => [c.path.join(' '), c.cifrado, c.calidad]),
  [['3M 5', 'M', 'major'], ['3M 5a', '+', 'augmented']]);
check('cifrado del aumentado: C+, en alemán H+ para B', [formatChordSymbol('C+', 'es'), formatChordSymbol('B+', 'de')], ['C+', 'H+']);
check('la quinta aumentada se rotula 5a / 5Ü', [intervalLabel('5a', 'es'), intervalLabel('5a', 'de')], ['5a', '5Ü']);

resumen();
