// Arnés de verificación de la lógica pura de T1.
// Se corre con `npm run verify:t1` (node --experimental-strip-types).
import { caminoPorPaso, estadoAlIniciar, estadoTrasTick } from '../src/utils/procesos.ts';
import type { EstadoProceso } from '../src/utils/procesos.ts';
import {
  aAscii,
  cadenaDeTerceras,
  letrasDeTriada,
  majorScaleSpelled,
  octavasDesdeLaPrimera,
  octavasDesdeRaiz,
  otrasGrafias,
  pasoSemitonos,
  pitchClass,
  filasDeIntervalos,
  spelledIntervalFromTonic,
  tablaCromaticaDesdeTonica,
  tonicChromatic,
} from '../src/utils/noteCalculations.ts';
import { ALL } from '../src/data/notes.ts';
import { conOctavas } from '../src/utils/prose.ts';
import type { Tonic } from '../src/types/music.ts';
import { check, resumen } from './verify-helpers.ts';

console.log('\n— procesos paso a paso (reunión 22/11/26, #14) —');
// El profesor: el botón de pasos "salta directo al resultado". Con reducir
// movimiento activo, play() saltaba a maxSteps y nunca sonaban los pasos.
const reposo: EstadoProceso = { currentStep: 0, mode: 'idle', speed: 'normal' };
const MAX = 6;

check('play desde reposo va al paso 1, no al final', estadoAlIniciar(reposo, MAX), { currentStep: 1, mode: 'playing', speed: 'normal' });
check('play al final vuelve a empezar', estadoAlIniciar({ ...reposo, currentStep: MAX, mode: 'paused' }, MAX), { currentStep: 1, mode: 'playing', speed: 'normal' });
check('play en pausa a mitad sigue desde ahí', estadoAlIniciar({ ...reposo, currentStep: 3, mode: 'paused' }, MAX), { currentStep: 3, mode: 'playing', speed: 'normal' });

let s = estadoAlIniciar(reposo, MAX);
const recorrido = [s.currentStep];
while (s.mode === 'playing') {
  s = estadoTrasTick(s, MAX);
  recorrido.push(s.currentStep);
}
check('el tick recorre los pasos de a uno', recorrido, [1, 2, 3, 4, 5, 6, 6]);
check('al llegar al final se pausa', s.mode, 'paused');

console.log('\n· 1.2 la tabla cromática empieza en la tónica (reunión 22/11/26, #6) ·');
// El desplazamiento iba con el signo cambiado: solo acertaban La y Re♯/Mi♭.
const TONICAS: Tonic[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
check('con las 17 tónicas la celda 0 es la tónica',
  TONICAS.filter((t) => !tablaCromaticaDesdeTonica(t)[0].split('/').includes(tonicChromatic(t))), []);
check('Fa♯ empieza en F#/Gb', tablaCromaticaDesdeTonica('F#')[0], 'F#/Gb');
check('Si♭ empieza en A#/Bb', tablaCromaticaDesdeTonica('Bb')[0], 'A#/Bb');
check('Fa empieza en F y sigue F#/Gb', tablaCromaticaDesdeTonica('F').slice(0, 2), ['F', 'F#/Gb']);
check('La sigue empezando en A', tablaCromaticaDesdeTonica('A')[0], 'A');
check('siempre 12 notas distintas', new Set(tablaCromaticaDesdeTonica('Db')).size, 12);

console.log('\n· octavas: los acordes suben desde su raíz (reunión 22/11/26, #15, #12, #24) ·');
const midis = (notas: string[], octavas: number[]) => notas.map((n, i) => octavas[i] * 12 + pitchClass(n));
const sube = (m: number[]) => m.every((x, i) => i === 0 || x > m[i - 1]);

check('#15 tónica Sol, Mi-Sol-Si sube', sube(midis(['E', 'G', 'B'], octavasDesdeRaiz('G', ['E', 'G', 'B']))), true);
check('#12 1.3: con las 17 tónicas la 8J es la tónica una octava arriba y suena sobre la 7M',
  TONICAS.filter((t) => {
    const i0 = ALL.indexOf(tonicChromatic(t));
    const notas = Array.from({ length: 13 }, (_, i) => ALL[(i0 + i) % 12]);
    const oct = octavasDesdeRaiz(t, notas);
    return !(oct[12] === oct[0] + 1 && sube(midis(notas, oct)));
  }), []);
check('#12 1.4: con las 17 tónicas la 8J suena sobre la 7M',
  TONICAS.filter((t) => {
    const notas = [...majorScaleSpelled(t), t];
    const m = midis(notas, octavasDesdeRaiz(t, notas));
    return !(m[7] > m[6]);
  }), []);
check('#24 tónica Mi, Re → La: La sobre Re', sube(midis(['D', 'A'], octavasDesdeLaPrimera('E', ['D', 'A']))), true);
check('#24 Si → Fa♯ (no Fa): ambas quintas sobre Si', octavasDesdeLaPrimera('C', ['B', 'F#', 'F']), [4, 5, 5]);
check('#24 Si♭ → Fa, y La♯ vuelve a la raíz', octavasDesdeLaPrimera('C', ['Bb', 'F', 'A#']), [4, 5, 4]);
check('conOctavas pone la octava solo en las notas, en orden',
  conOctavas([{ type: 'note', value: 'D' }, { type: 'text', value: ' → ' }, { type: 'note', value: 'A' }], [4, 5]),
  [{ type: 'note', value: 'D', octave: 4 }, { type: 'text', value: ' → ' }, { type: 'note', value: 'A', octave: 5 }]);

console.log('\n· 1.7 pasos 1 y 2: solo letras y la tercera respeta la letra (reunión 22/11/26, #19, #21) ·');
check('#19 Re♭ da D F A', letrasDeTriada('Db'), ['D', 'F', 'A']);
check('#19 Fa♯ da F A C', letrasDeTriada('F#'), ['F', 'A', 'C']);
check('#19 Si♭ da B D F', letrasDeTriada('Bb'), ['B', 'D', 'F']);
const ultima = (p: ReturnType<typeof pasoSemitonos>) => p[p.length - 1];
check('#21 3m de Sol♭: empieza en G♭ y llega a B♭♭ con +3',
  [pasoSemitonos('Gb', 3, 'm')[0].notas, ultima(pasoSemitonos('Gb', 3, 'm'))], [['G♭'], { notas: ['B♭♭'], semis: 3, octava: 4 }]);
check('#21 3M de Do llega a E con +4', ultima(pasoSemitonos('C', 3, 'M')).notas, ['E']);
check('#21 3m de Si♭ llega a D♭', ultima(pasoSemitonos('Bb', 3, 'm')).notas, ['D♭']);
check('#21 los semitonos van de 0 a la llegada', pasoSemitonos('C', 5, 'P').map((p) => p.semis), [0, 1, 2, 3, 4, 5, 6, 7]);
check('#21 la 5J de Si sube de octava', ultima(pasoSemitonos('B', 5, 'P')), { notas: ['F♯'], semis: 7, octava: 5 });
check('#21 con las 17 tónicas la llegada coincide con spelledIntervalFromTonic',
  TONICAS.flatMap((t) => (['M', 'm'] as const).filter((q) => ultima(pasoSemitonos(t, 3, q)).notas[0] !== spelledIntervalFromTonic(t, 3, q)).map((q) => `${t} 3${q}`)), []);
check('#21 aclaración: 3m de Sol♭ es B♭♭, no A', otrasGrafias('Gb', 3, 'B♭♭'), ['A']);
check('#21 aclaración: 3M de La es C♯, no D♭', otrasGrafias('A', 4, 'C♯'), ['D♭']);
check('#21 sin aclaración: 3M de Do', otrasGrafias('C', 4, 'E'), []);
check('aAscii reemplaza todas las alteraciones', [aAscii('A♭♭'), aAscii('F♯')], ['Abb', 'F#']);

console.log('\n· 1.3 filas del procedimiento alineadas (reunión 22/11/26, #7) ·');
check('con las 17 tónicas las tres filas tienen 13 celdas',
  TONICAS.filter((t) => { const f = filasDeIntervalos(t); return f.letras.length !== 13 || f.cromatico.length !== 13 || f.resultado.length !== 13; }), []);
check('con las 17 tónicas la celda i del paso 2 suena igual que la columna i del Resultado',
  TONICAS.filter((t) => { const f = filasDeIntervalos(t); return f.cromatico.some((c, i) => pitchClass(c[0]) !== pitchClass(f.resultado[i][0])); }), []);
check('paso 1 en Do: letras por número de intervalo, tritono con dos letras', filasDeIntervalos('C').letras,
  ['C', 'D', 'D', 'E', 'E', 'F', 'F-G', 'G', 'A', 'A', 'B', 'B', 'C']);
check('paso 2 en Fa♯ empieza en F# y tiene los dos nombres', filasDeIntervalos('F#').cromatico.slice(0, 2), [['F#', 'Gb'], ['G']]);
check('Resultado en Fa: la 4J es Bb, el tritono B / Cb no: B', filasDeIntervalos('F').resultado.slice(5, 7), [['Bb'], ['B']]);

console.log('\n· 1.7 el árbol conserva la tercera elegida (reunión 22/11/26, #20) ·');
check('paso 1 (la tónica) conserva 3m y 5J', caminoPorPaso(1, '3m', '5'), ['3m', '5']);
check('en reposo el árbol queda libre', caminoPorPaso(0, '3m', '5'), undefined);
check('pasos 2 a 4 sin cambios', [2, 3, 4].map((p) => caminoPorPaso(p, '3m', '5d')), [['3m'], ['3m', '5d'], ['3m', '5d']]);

console.log('\n· 1.6 la cadena de terceras empieza en la tónica (reunión 22/11/26, #16; D4) ·');
check('Fa da F A C E G B D F', cadenaDeTerceras('F'), ['F', 'A', 'C', 'E', 'G', 'B', 'D', 'F']);
check('Do da C E G B D F A C', cadenaDeTerceras('C'), ['C', 'E', 'G', 'B', 'D', 'F', 'A', 'C']);
check('Si♭ empieza en la letra B', cadenaDeTerceras('Bb')[0], 'B');

resumen();
