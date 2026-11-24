// Arnés de verificación de la lógica pura de T1.
// Se corre con `npm run verify:t1` (node --experimental-strip-types).
import { estadoAlIniciar, estadoTrasTick } from '../src/utils/procesos.ts';
import type { EstadoProceso } from '../src/utils/procesos.ts';
import { tablaCromaticaDesdeTonica, tonicChromatic } from '../src/utils/noteCalculations.ts';
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

resumen();
