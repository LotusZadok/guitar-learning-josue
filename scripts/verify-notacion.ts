// Arnés de verificación de la notación (formatNote y afines).
// Se corre con `npm run verify:notacion` (node --experimental-strip-types).
import { formatNote, pitchClass } from '../src/utils/noteCalculations.ts';
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

resumen();
