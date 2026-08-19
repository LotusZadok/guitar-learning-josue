// Arnés de verificación de la lógica pura del constructor de progresiones.
// Se corre con `npm run verify:constructor` (node --experimental-strip-types).
// Importa el .ts real: por eso `progresionArmonica.ts` no puede tener imports
// en runtime — Node no resuelve especificadores .ts sin extensión.
import {
  CASILLAS_POR_COMPAS,
  MUNDO_POR_COMPAS,
  ACENTOS,
  crearGrid,
  msPorCasilla,
  duracionTotalMs,
  gridToEvents,
  gradosDe,
  tonizacionesDe,
  esTonizable,
  rolDe,
  casillaEn,
  type Grid,
} from '../src/utils/progresionArmonica.ts';

let fallos = 0;
function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  if (a === b) {
    console.log(`  ok  ${nombre}`);
  } else {
    fallos++;
    console.log(`FALLA  ${nombre}\n       esperado ${b}\n       obtenido ${a}`);
  }
}
function checkCasi(nombre: string, real: number, esperado: number, tol = 0.01) {
  if (Math.abs(real - esperado) <= tol) console.log(`  ok  ${nombre}`);
  else { fallos++; console.log(`FALLA  ${nombre}\n       esperado ~${esperado}\n       obtenido ${real}`); }
}

console.log('\n— Compases —');
check('casillas 2/4', CASILLAS_POR_COMPAS['2/4'], 2);
check('casillas 3/4', CASILLAS_POR_COMPAS['3/4'], 3);
check('casillas 4/4', CASILLAS_POR_COMPAS['4/4'], 4);
check('casillas 6/8', CASILLAS_POR_COMPAS['6/8'], 6);
check('4/4 es binario', MUNDO_POR_COMPAS['4/4'], 'binario');
check('6/8 es ternario', MUNDO_POR_COMPAS['6/8'], 'ternario');
check('6/8 acentua 1 y 4', ACENTOS['6/8'], [0, 3]);
check('3/4 acentua solo el 1', ACENTOS['3/4'], [0]);

console.log('\n— Aritmetica de BPM —');
checkCasi('3/4 @90: casilla', msPorCasilla('3/4', 90), 666.67);
checkCasi('3/4 @90: un compas', duracionTotalMs(crearGrid('3/4', 1), '3/4', 90), 2000);
checkCasi('6/8 @90: casilla', msPorCasilla('6/8', 90), 222.22);
checkCasi('6/8 @90: un compas', duracionTotalMs(crearGrid('6/8', 1), '6/8', 90), 1333.33);
checkCasi('4/4 @120: casilla', msPorCasilla('4/4', 120), 500);

console.log('\n— Grilla —');
check('crearGrid 4/4 x2 = 8 casillas vacias', crearGrid('4/4', 2), new Array(8).fill(null));

console.log('\n— Relleno y corte —');
const g1: Grid = [{ degree: 'I' }, null, null, { degree: 'V' }];
check(
  'el acorde se sostiene hasta el siguiente y el ultimo llega al final',
  gridToEvents(g1, '4/4', 120),
  [
    { degree: 'I', startMs: 0, durMs: 1500, slotIndex: 0 },
    { degree: 'V', startMs: 1500, durMs: 500, slotIndex: 3 },
  ],
);

const g2: Grid = [null, { degree: 'I' }, null, null];
check(
  'casilla vacia inicial = silencio, no adelanta el acorde',
  gridToEvents(g2, '4/4', 120),
  [{ degree: 'I', startMs: 500, durMs: 1500, slotIndex: 1 }],
);

check('grilla vacia no produce eventos', gridToEvents([null, null], '2/4', 120), []);

const g3: Grid = [{ degree: 'I' }, { degree: 'ii' }, { degree: 'V' }];
check(
  'acordes contiguos duran una casilla cada uno',
  gridToEvents(g3, '3/4', 60),
  [
    { degree: 'I', startMs: 0, durMs: 1000, slotIndex: 0 },
    { degree: 'ii', startMs: 1000, durMs: 1000, slotIndex: 1 },
    { degree: 'V', startMs: 2000, durMs: 1000, slotIndex: 2 },
  ],
);

const g4: Grid = [{ degree: 'I' }, null, null, null, null, null];
check(
  'un solo acorde ocupa el compas entero de 6/8',
  gridToEvents(g4, '6/8', 90).map((e) => ({ d: e.degree, ms: Math.round(e.durMs) })),
  [{ d: 'I', ms: 1333 }],
);

console.log('\n— Cabezal —');
check('al arrancar suena la casilla 0', casillaEn(0, '4/4', 120, 4), 0);
check('a 1200ms de 4/4@120 va por la casilla 2', casillaEn(1200, '4/4', 120, 4), 2);
check('pasado el final devuelve -1', casillaEn(2500, '4/4', 120, 4), -1);

console.log('\n— Vocabulario de grados —');
check('grados mayores', gradosDe('mayor'), ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
check('grados menores', gradosDe('menor'), ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII']);
check('el I no se toniza', esTonizable('mayor', 0), false);
check('el vii° no se toniza', esTonizable('mayor', 6), false);
check('el ii si se toniza', esTonizable('mayor', 1), true);
check('el i menor no se toniza', esTonizable('menor', 0), false);
check('el ii° menor no se toniza', esTonizable('menor', 1), false);
check('el ♭III si se toniza', esTonizable('menor', 2), true);
check('tonizaciones del ii', tonizacionesDe('mayor', 1), ['V/ii', 'ii/ii']);
check('tonizaciones del vii°', tonizacionesDe('mayor', 6), []);
check(
  'los 5 destinos tonizables en mayor',
  gradosDe('mayor').filter((_, i) => esTonizable('mayor', i)),
  ['ii', 'iii', 'IV', 'V', 'vi'],
);
check(
  'los 5 destinos tonizables en menor',
  gradosDe('menor').filter((_, i) => esTonizable('menor', i)),
  ['♭III', 'iv', 'v', '♭VI', '♭VII'],
);

console.log('\n— Roles de color —');
check('el I es reposo', rolDe('mayor', 'I'), 'stable');
check('el IV es medio-tenso', rolDe('mayor', 'IV'), 'mediumTense');
check('el V es tenso', rolDe('mayor', 'V'), 'tense');
check('el vi es reposo', rolDe('mayor', 'vi'), 'stable');
check('toda V/x es tensa', rolDe('mayor', 'V/ii'), 'tense');
check('toda ii/x es media', rolDe('mayor', 'ii/vi'), 'medium');
check('el ii° menor no se confunde con ii/x', rolDe('menor', 'ii°'), 'medium');

console.log(fallos === 0 ? '\nTODO OK\n' : `\n${fallos} FALLAS\n`);
process.exit(fallos === 0 ? 0 : 1);
