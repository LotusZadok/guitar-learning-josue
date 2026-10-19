// Arnés de verificación de la teoría de T3 (lógica pura de noteCalculations).
// Se corre con `npm run verify:t3` (node --experimental-strip-types).
import {
  progresionIIVI,
  tonizacionEscenarios,
} from '../src/utils/noteCalculations.ts';
import { check, resumen } from './verify-helpers.ts';

const cifrados = (gs: { chord: { cifrado: string } }[]) => gs.map((g) => g.chord.cifrado);
const romanos = (gs: { roman: string }[]) => gs.map((g) => g.roman);

console.log('\n— 3.8 escenarios (reunión 19/10/26) —');
// El profesor: "el primero debería ser maj7, el quinto dominante y el segundo
// menor7" (mayor) y "este debería ser mayor, La7" (menor).
const enF = tonizacionEscenarios('F');
check('F mayor: ii-V-I', cifrados(enF.mayor), ['Gm7', 'C7', 'Fmaj7']);
check('F menor: ii°-V-i de la relativa', cifrados(enF.menor), ['Em7♭5', 'A7', 'Dm7']);
const enC = tonizacionEscenarios('C');
check('C mayor: ii-V-I', cifrados(enC.mayor), ['Dm7', 'G7', 'Cmaj7']);
check('C menor: ii°-V-i de la relativa', cifrados(enC.menor), ['Bm7♭5', 'E7', 'Am7']);
// "Todos deberían tener séptima, o ninguno."
check('romanos mayor, todos con séptima', romanos(enC.mayor), ['ii7', 'V7', 'Imaj7']);
check('romanos menor, todos con séptima', romanos(enC.menor), ['iiø7', 'V7', 'i7']);
// El motor de audio recibe nombres cromáticos en sostenidos.
check('el V menor lleva la sensible elevada (G♯)', enC.menor[1].chord.members.map((m) => m.chromatic), ['E', 'G#', 'B', 'D']);

for (const t of ['C#', 'D#', 'G#', 'A#', 'Gb', 'Db'] as const) {
  const e = tonizacionEscenarios(t);
  check(`${t}: seis acordes de cuatro voces`, [...e.mayor, ...e.menor].map((g) => g.chord.members.length), [4, 4, 4, 4, 4, 4]);
  for (const modo of ['mayor', 'menor'] as const) {
    for (const c of progresionIIVI({ tonica: t, modo, septimaEnI: true })) {
      check(`${t} ${c.cifrado}: una letra por voz`, new Set(c.notas.map((n) => n[0])).size, 4);
    }
  }
}

console.log('\n— ii-V-I compartido con 3.7 y 3.10 —');
const notas = (cs: { notas: string[] }[]) => cs.map((c) => c.notas.join(' '));
check(
  'C mayor (3.7)',
  notas(progresionIIVI({ tonica: 'C', modo: 'mayor', septimaEnI: true })),
  ['D F A C', 'G B D F', 'C E G B'],
);
check(
  'C menor sin séptima en el i (3.10, igual que hoy)',
  notas(progresionIIVI({ tonica: 'C', modo: 'menor', septimaEnI: false })),
  ['B D F A', 'E G♯ B D', 'A C E'],
);
check(
  'cifrados de 3.10',
  progresionIIVI({ tonica: 'C', modo: 'menor', septimaEnI: false }).map((c) => c.cifrado),
  ['Bm7♭5', 'E7', 'Am'],
);

resumen();
