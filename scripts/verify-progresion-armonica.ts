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
  clicksDeMetronomo,
  clicksDesde,
  eventosDesde,
  colocarSlot,
  puntosDeModulacion,
  gradosArmonicosDe,
  tonizacionesDeGrado,
  admiteSus,
  aplicarSus,
  type Grid,
  type Tonalidad,
  type Compas,
} from '../src/utils/progresionArmonica.ts';
import { check, checkCasi, resumen } from './verify-helpers.ts';

const DO: Tonalidad = { armaduraId: 'C', modo: 'mayor' };
const SOL: Tonalidad = { armaduraId: 'G', modo: 'mayor' };
const slot = (degree: string, tonalidad: Tonalidad = DO) => ({ degree, tonalidad }) as NonNullable<Grid[number]>;

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
const g1: Grid = [slot('I'), null, null, slot('V')];
check(
  'el acorde se sostiene hasta el siguiente y el ultimo llega al final',
  gridToEvents(g1, '4/4', 120),
  [
    { degree: 'I', startMs: 0, durMs: 1500, slotIndex: 0 },
    { degree: 'V', startMs: 1500, durMs: 500, slotIndex: 3 },
  ],
);

const g2: Grid = [null, slot('I'), null, null];
check(
  'casilla vacia inicial = silencio, no adelanta el acorde',
  gridToEvents(g2, '4/4', 120),
  [{ degree: 'I', startMs: 500, durMs: 1500, slotIndex: 1 }],
);

check('grilla vacia no produce eventos', gridToEvents([null, null], '2/4', 120), []);

const g3: Grid = [slot('I'), slot('ii'), slot('V')];
check(
  'acordes contiguos duran una casilla cada uno',
  gridToEvents(g3, '3/4', 60),
  [
    { degree: 'I', startMs: 0, durMs: 1000, slotIndex: 0 },
    { degree: 'ii', startMs: 1000, durMs: 1000, slotIndex: 1 },
    { degree: 'V', startMs: 2000, durMs: 1000, slotIndex: 2 },
  ],
);

const g4: Grid = [slot('I'), null, null, null, null, null];
check(
  'un solo acorde ocupa el compas entero de 6/8',
  gridToEvents(g4, '6/8', 90).map((e) => ({ d: e.degree, ms: Math.round(e.durMs) })),
  [{ d: 'I', ms: 1333 }],
);

console.log('\n— Cabezal —');
check('al arrancar suena la casilla 0', casillaEn(0, '4/4', 120, 4), 0);
check('a 1200ms de 4/4@120 va por la casilla 2', casillaEn(1200, '4/4', 120, 4), 2);
check('pasado el final devuelve -1', casillaEn(2500, '4/4', 120, 4), -1);

function bordesMal(compas: Compas, bpm: number, total: number): number[] {
  const paso = msPorCasilla(compas, bpm);
  const malas: number[] = [];
  for (let i = 0; i < total; i++) if (casillaEn(i * paso, compas, bpm, total) !== i) malas.push(i);
  return malas;
}
check('6/8 @90: ningun borde de casilla cae en la casilla anterior', bordesMal('6/8', 90, 48), []);
check('6/8 @58: ningun borde de casilla cae en la casilla anterior', bordesMal('6/8', 58, 48), []);
check('3/4 @63: ningun borde de casilla cae en la casilla anterior', bordesMal('3/4', 63, 48), []);

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

console.log('\n— Metronomo —');
// Reunión 19/10/26: con la grilla vacía el metrónomo no sonaba. Un clic por
// casilla, haya o no acordes.
check(
  '6/8 x2: 12 clics, acento en 0 3 6 9',
  clicksDeMetronomo(12, '6/8').map((c, i) => (c.acento ? i : -1)).filter((i) => i >= 0),
  [0, 3, 6, 9],
);
check('6/8 x2: 12 clics', clicksDeMetronomo(12, '6/8').length, 12);
check(
  '4/4 x1: 4 clics, acento solo en el 1',
  clicksDeMetronomo(4, '4/4').map((c) => c.acento),
  [true, false, false, false],
);
check('cada clic sabe su casilla', clicksDeMetronomo(3, '3/4').map((c) => c.casilla), [0, 1, 2]);

console.log('\n— Pausa y reanudación (reunión 19/10/26) —');
// 4/4 @120 → 500 ms por casilla. I en 0 (dura 2 casillas), V en 2 (dura 2).
const gridPausa: Grid = [slot('I'), null, slot('V'), null];
const evPausa = gridToEvents(gridPausa, '4/4', 120);
check('desde 0 no cambia nada', eventosDesde(evPausa, 0, 500), evPausa);
check(
  'pausa en la casilla 1: el I suena lo que le queda, el V corre al inicio',
  eventosDesde(evPausa, 1, 500).map((e) => [e.degree, e.startMs, e.durMs]),
  [['I', 0, 500], ['V', 500, 1000]],
);
check(
  'pausa en la casilla 2: el I ya terminó',
  eventosDesde(evPausa, 2, 500).map((e) => [e.degree, e.startMs, e.durMs]),
  [['V', 0, 1000]],
);
check(
  'pausa en la casilla 3: el metrónomo arranca en la 3',
  clicksDesde(clicksDeMetronomo(4, '4/4'), 3).map((c) => c.casilla),
  [3],
);

console.log('\n— Modulación (reunión 19/10/26) —');
const vacia: Grid = [null, null, null, null];
const conI = colocarSlot(vacia, 1, slot('I', DO));
check('colocarSlot guarda grado y tonalidad', conI[1], { degree: 'I', tonalidad: DO });
check('colocarSlot no muta la grilla original', vacia[1], null);
const modulada: Grid = [slot('I', DO), null, slot('IV', DO), slot('V', SOL), slot('I', SOL)];
check(
  'puntosDeModulacion: el primer acorde y cada cambio de tonalidad',
  puntosDeModulacion(modulada),
  [{ indice: 0, tonalidad: DO }, { indice: 3, tonalidad: SOL }],
);
check('sin modulación hay un solo tramo', puntosDeModulacion([slot('I'), slot('V')]).length, 1);
check('grilla vacía: sin tramos', puntosDeModulacion(vacia), []);

console.log('\n— Grados de la menor armónica (reunión 19/10/26) —');
check('en menor se desbloquean V y vii°', gradosArmonicosDe('menor'), ['V', 'vii°']);
check('en mayor no hay grados extra', gradosArmonicosDe('mayor'), []);
check('el V armónico es tenso', rolDe('menor', 'V'), 'tense');
check('el vii° armónico es tenso', rolDe('menor', 'vii°'), 'tense');
check('el V armónico se toniza', tonizacionesDeGrado('V'), ['V/V', 'ii/V']);
check('el vii° no se toniza ("los disminuidos no tienen tonizaciones")', tonizacionesDeGrado('vii°'), []);
check('los siete naturales de menor siguen igual', gradosDe('menor'), ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII']);

console.log('\n— sus2 / sus4 sobre la grilla —');
check('los acordes mayores y menores admiten sus', ['I', 'ii', 'V', 'vi'].map((g) => admiteSus('mayor', g as never)), [true, true, true, true]);
check('el vii° no admite sus', admiteSus('mayor', 'vii°'), false);
check('el ii° menor no admite sus', admiteSus('menor', 'ii°'), false);
check('el vii° de la armónica no admite sus', admiteSus('menor', 'vii°'), false);
check('el V de la armónica sí', admiteSus('menor', 'V'), true);
check('V/x siempre admite sus', admiteSus('mayor', 'V/ii'), true);
check('ii/x hacia un menor es semidisminuido: no', admiteSus('mayor', 'ii/vi'), false);
check('ii/x hacia un mayor es menor: sí', admiteSus('mayor', 'ii/V'), true);
const conV: Grid = [slot('V'), null];
const susV = aplicarSus(conV, 0, 'sus4');
check('aplicarSus pone el sus en la casilla', susV[0], { degree: 'V', tonalidad: DO, sus: 'sus4' });
check('el mismo sus otra vez lo quita', aplicarSus(susV, 0, 'sus4')[0], { degree: 'V', tonalidad: DO });
check('el otro sus lo reemplaza', aplicarSus(susV, 0, 'sus2')[0], { degree: 'V', tonalidad: DO, sus: 'sus2' });
check('sobre una casilla vacía no hace nada', aplicarSus(conV, 1, 'sus4'), conV);
check('sobre un acorde que no lo admite no hace nada', aplicarSus([slot('vii°')], 0, 'sus4'), [slot('vii°')]);
check('aplicarSus no muta la grilla', conV[0], { degree: 'V', tonalidad: DO });

resumen();
