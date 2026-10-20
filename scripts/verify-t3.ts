// Arnés de verificación de la teoría de T3 (lógica pura de noteCalculations).
// Se corre con `npm run verify:t3` (node --experimental-strip-types).
import {
  FAMILIAS_DIM7,
  acordeDominante,
  progresionIIVI,
  spelledIntervalFromTonic,
  tonizacionEscenarios,
} from '../src/utils/noteCalculations.ts';
import { BUILDER_312 } from '../src/components/primitives/AcordesBuilder/configs.ts';
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

console.log('\n— 3.6.2 dominante: voces del V7 y del vii° —');
const voces = (o: 'V7' | 'vii') =>
  acordeDominante('C', o).voces.map((v) => [v.nota, v.intervalo, v.tritono, v.sensible ?? '-']);
check('V7 en C: G(T) B(3M, tritono, tonal) D(5J) F(7m, tritono, modal)', voces('V7'), [
  ['G', 'T', false, '-'],
  ['B', '3M', true, 'tonal'],
  ['D', '5J', false, '-'],
  ['F', '7m', true, 'modal'],
]);
check('vii en C: B(T, tritono, tonal) D(3m) F(5d, tritono, modal) A(7m)', voces('vii'), [
  ['B', 'T', true, 'tonal'],
  ['D', '3m', false, '-'],
  ['F', '5d', true, 'modal'],
  ['A', '7m', false, '-'],
]);
check('cifrados', [acordeDominante('C', 'V7').cifrado, acordeDominante('C', 'vii').cifrado], ['G7', 'Bm7♭5']);
check('romanos (el vii lleva su círculo)', [acordeDominante('C', 'V7').roman, acordeDominante('C', 'vii').roman], ['V7', 'vii°']);
check('en F el vii es Em7♭5', acordeDominante('F', 'vii').cifrado, 'Em7♭5');

console.log('\n— 3.2 familias dim7 con enarmonías (reunión 19/10/26) —');
const familias = FAMILIAS_DIM7;
check(
  'las tres familias cubren las 12 notas sin repetir',
  new Set(familias.flatMap((f) => f.miembros.map((m) => m.note))).size,
  12,
);
check('cada familia tiene 4 notas', familias.map((f) => f.miembros.length), [4, 4, 4]);
const pares = familias.flatMap((f) => f.miembros.filter((m) => m.enarmonia).map((m) => `${m.grafia}/${m.enarmonia}`));
check('pares enarmónicos', pares.sort(), ['A♭/G♯', 'B♭/A♯', 'C♯/D♭', 'E♭/D♯', 'G♭/F♯'].sort());
check('las naturales no tienen enarmonía', familias[2].miembros.map((m) => m.enarmonia ?? '-'), ['-', '-', 'G♯', '-']);
check('símbolo enarmónico de la familia de C♯', familias[1].simboloEnarmonico, 'D♭°');

console.log('\n— 3.1.2 menor Maj7 (reunión 19/10/26) —');
const caminos312 = BUILDER_312.chords.map((c) => c.path.join('-'));
check('cada camino de BUILDER_312 es único', new Set(caminos312).size, caminos312.length);
check('BUILDER_312 incluye el menor Maj7', BUILDER_312.chords.find((c) => c.cifrado === 'mMaj7')?.path, ['3m', '5', '7M']);
const deletreo = (tonica: 'C' | 'G' | 'Bb', camino: readonly string[]) => [
  tonica.replace('b', '♭'),
  ...camino.map((rol) => {
    const n = BUILDER_312.nodes.find((x) => x.role === rol)!;
    return spelledIntervalFromTonic(tonica, n.number, n.quality);
  }),
];
check('mMaj7 en C', deletreo('C', ['3m', '5', '7M']), ['C', 'E♭', 'G', 'B']);
check('mMaj7 en G', deletreo('G', ['3m', '5', '7M']), ['G', 'B♭', 'D', 'F♯']);
check('mMaj7 en B♭', deletreo('Bb', ['3m', '5', '7M']), ['B♭', 'D♭', 'F', 'A']);

resumen();
