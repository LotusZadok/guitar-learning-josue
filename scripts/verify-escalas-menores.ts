// Arnés de la escala menor armónica (lógica pura de noteCalculations).
// Se corre con `npm run verify:menor` (node --experimental-strip-types).
import {
  acordeMenorArmonica,
  gradosQueCambianEnArmonica,
  MENOR_ARMONICA,
  harmonicMinorScaleSpelled,
  pitchClass,
  progresionIIVI,
  relativeMinorScaleSpelled,
} from '../src/utils/noteCalculations.ts';
import { check, resumen } from './verify-helpers.ts';

console.log('\n— La escala (reunión 19/10/26: "sólo cambio la séptima nota un semitono arriba") —');
check('relativa de C: La menor armónica', harmonicMinorScaleSpelled('C'), ['A', 'B', 'C', 'D', 'E', 'F', 'G♯']);
check('relativa de F: Re menor armónica', harmonicMinorScaleSpelled('F'), ['D', 'E', 'F', 'G', 'A', 'B♭', 'C♯']);
const deB = harmonicMinorScaleSpelled('B');
check('relativa de B: Sol♯ menor armónica, con Fx', deB[6], 'Fx');
check('relativa de B: una letra por grado', new Set(deB.map((n) => n[0])).size, 7);
check('Fx suena como G (no cae al ?? 0)', pitchClass('Fx'), 7);
check('G♯ es la clase 8', pitchClass('G♯'), 8);

const TONICAS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'] as const;
for (const t of TONICAS) {
  const natural = relativeMinorScaleSpelled(t);
  const armonica = harmonicMinorScaleSpelled(t);
  check(`${t}: igual a la natural salvo la 7ª`, armonica.slice(0, 6), natural.slice(0, 6));
  check(`${t}: la 7ª sube un semitono`, (pitchClass(armonica[6]) - pitchClass(natural[6]) + 12) % 12, 1);
}

console.log('\n— Grados con séptima de La menor armónica —');
const notas = (g: number) => acordeMenorArmonica('C', g).notas;
check('i: A C E G♯ (menor Maj7)', notas(0), ['A', 'C', 'E', 'G♯']);
check('III: C E G♯ B (aumentado maj7)', notas(2), ['C', 'E', 'G♯', 'B']);
check('V: E G♯ B D (dominante 7)', notas(4), ['E', 'G♯', 'B', 'D']);
check('vii: G♯ B D F (disminuido 7)', notas(6), ['G♯', 'B', 'D', 'F']);
check(
  'romanos',
  [0, 1, 2, 3, 4, 5, 6].map((g) => acordeMenorArmonica('C', g).romano),
  ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
);
check(
  'cifrados',
  [0, 1, 2, 3, 4, 5, 6].map((g) => acordeMenorArmonica('C', g).cifrado),
  ['AmMaj7', 'Bm7♭5', 'Cmaj7♯5', 'Dm7', 'E7', 'Fmaj7', 'G♯°7'],
);

console.log('\n— Regresión: el ii°-V7-i de 3.10 sigue igual —');
check(
  'C menor: Bm7♭5, E7 con G♯, Am',
  progresionIIVI({ tonica: 'C', modo: 'menor', septimaEnI: false }).map((c) => c.notas.join(' ')),
  ['B D F A', 'E G♯ B D', 'A C E'],
);

console.log('\n— 4.4: qué acordes cambian con la sensible ("cuatro acordes diferentes", reunión 19/10/26) —');
check('con séptima cambian i, III, V y vii (los cuatro que tienen la 7ª)', gradosQueCambianEnArmonica(true), [0, 2, 4, 6]);
check('en tríadas el i no tiene la 7ª: cambian III, V y vii', gradosQueCambianEnArmonica(false), [2, 4, 6]);
check('tríadas de la menor armónica: m, dim, aug, m, M, M, dim', MENOR_ARMONICA.triadas, ['m', 'dim', 'aug', 'm', 'M', 'M', 'dim']);

resumen();
