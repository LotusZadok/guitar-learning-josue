// Arnés de verificación de la notación (formatNote y afines).
// Se corre con `npm run verify:notacion` (node --experimental-strip-types).
import { formatChordSymbol, formatNote, intervalLabel, pitchClass } from '../src/utils/noteCalculations.ts';
import { ALL, NOTE_DE } from '../src/data/notes.ts';
import { check, resumen } from './verify-helpers.ts';

console.log('\n· formatNote: un solo formateador (reunión 22/11/26, #8, #5; D5 letra + glifo) ·');
check('es: F# → F♯', formatNote('F#', 'es'), 'F♯');
check('es: Bb y B♭ → B♭', [formatNote('Bb', 'es'), formatNote('B♭', 'es')], ['B♭', 'B♭']);
check('es: Bbb → B♭♭, E# → E♯', [formatNote('Bbb', 'es'), formatNote('E#', 'es')], ['B♭♭', 'E♯']);
check('es: doble sostenido como x (D7)', formatNote('Fx', 'es'), 'Fx');
check('de: B → H', formatNote('B', 'de'), 'H');
check('de: Bb y B♭ → B', [formatNote('Bb', 'de'), formatNote('B♭', 'de')], ['B', 'B']);
check('de: Eb → E♭ (letra + glifo)', formatNote('Eb', 'de'), 'E♭');
check('de: B# → H♯, Bbb → H♭♭', [formatNote('B#', 'de'), formatNote('Bbb', 'de')], ['H♯', 'H♭♭']);
check('es: formatear lo ya formateado no cambia nada',
  ['C', 'F#', 'Bb', 'Bbb', 'E#', 'Fx'].filter((n) => formatNote(formatNote(n, 'es'), 'es') !== formatNote(n, 'es')), []);
check('es: la altura no cambia', ['F#', 'Bb', 'Bbb', 'E#', 'Cb'].filter((n) => pitchClass(formatNote(n, 'es')) !== pitchClass(n)), []);
check('de: Mi♭ mayor se nombra E♭, nunca Dis', formatNote('Eb', 'de'), 'E♭');
check('NOTE_DE coincide con formatNote en las 12 notas', ALL.filter((c) => NOTE_DE[c] !== formatNote(c, 'de')), []);

console.log('\n· formatChordSymbol: cifrados en T2 a T5 (reunión 22/11/26, #8, #5) ·');
check('de: Bm → Hm', formatChordSymbol('Bm', 'de'), 'Hm');
check('de: Bbmaj7 y B♭maj7 → Bmaj7', [formatChordSymbol('Bbmaj7', 'de'), formatChordSymbol('B♭maj7', 'de')], ['Bmaj7', 'Bmaj7']);
check('es: F#m7 → F♯m7', formatChordSymbol('F#m7', 'es'), 'F♯m7');
check('es: Bm7b5 → Bm7♭5, la b de la quinta también', formatChordSymbol('Bm7b5', 'es'), 'Bm7♭5');
check('es: F##dim → Fxdim', formatChordSymbol('F##dim', 'es'), 'Fxdim');
check('es: idempotente', formatChordSymbol(formatChordSymbol('Ebmaj7', 'es'), 'es'), 'E♭maj7');

console.log('\n· intervalLabel: abreviaturas en alemán (reunión 22/11/26, #9, #10; D6) ·');
check('de: m, M, J, d, a → K, G, R, V, Ü con el número primero',
  ['3m', '3M', '4J', '5d', '4a', '8J', '7d'].map((c) => intervalLabel(c, 'de')), ['3K', '3G', '4R', '5V', '4Ü', '8R', '7V']);
check('de: el tritono doble y la tónica', [intervalLabel('4a/5d', 'de'), intervalLabel('T', 'de')], ['4Ü/5V', 'T']);
check('es: sin cambios', ['3m', '3M', '4J', '5d', '4a/5d', 'T'].map((c) => intervalLabel(c, 'es')), ['3m', '3M', '4J', '5d', '4a/5d', 'T']);

resumen();
