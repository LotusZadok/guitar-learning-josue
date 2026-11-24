// Arnés de verificación del tempo del laboratorio (lógica pura de utils/tempo).
// Se corre con `npm run verify:tempo` (node --experimental-strip-types).
import { parsearBpm, terminoTempo } from '../src/utils/tempo.ts';
import { check, resumen } from './verify-helpers.ts';

console.log('\n· tempo escribible (reunión 22/11/26, #2) ·');
check('vacío deja el anterior', parsearBpm('', 90), 90);
check('texto no numérico deja el anterior', parsearBpm('abc', 90), 90);
check('bajo el mínimo se acota a 40', parsearBpm('30', 90), 40);
check('sobre el máximo se acota a 200', parsearBpm('250', 90), 200);
check('decimal se redondea', parsearBpm('92.6', 90), 93);
check('un valor válido queda igual', parsearBpm('120', 90), 120);

console.log('\n· término del tempo por rango (reunión 22/11/26, #4; tabla del profesor del 24/11) ·');
const casos: [number, string[]][] = [
  [40, ['Largo']], [59, ['Largo']], [60, ['Adagio']], [75, ['Adagio']], [76, ['Andante']], [107, ['Andante']],
  [108, ['Moderato']], [119, ['Moderato']], [120, ['Allegro']], [139, ['Allegro']],
  [140, ['Vivace']], [168, ['Vivace']], [200, ['Vivace']],
];
check('cada BPM cae en un solo término; Allegro llega hasta 140 (el profesor, 24/11)',
  casos.filter(([bpm, esperado]) => JSON.stringify(terminoTempo(bpm)) !== JSON.stringify(esperado)).map(([b]) => b), []);

resumen();
