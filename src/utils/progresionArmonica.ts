// Lógica pura del constructor de progresiones (T4).
//
// IMPORTANTE: este archivo NO puede tener imports en runtime. Se verifica con
// `npm run verify:constructor`, que corre en Node con --experimental-strip-types
// y no resuelve especificadores .ts sin extensión. Si algo necesita `tonal` o
// `noteCalculations`, va en `progresionAcordes.ts`.

export type Compas = '2/4' | '3/4' | '4/4' | '6/8';
export type Mundo = 'binario' | 'ternario';
export type Modo = 'mayor' | 'menor';

// Mismo union que `DiatonicRole` en shared/NoteToken. Se redeclara acá para
// mantener el archivo sin imports; TypeScript los trata como asignables entre
// sí por ser unions de literales idénticos.
export type RolArmonico = 'stable' | 'medium' | 'mediumTense' | 'tense';

// Orden de presentación: los dos binarios primero, luego los dos ternarios —
// los "dos mundos" del profesor.
export const COMPASES: Compas[] = ['2/4', '4/4', '3/4', '6/8'];

export const CASILLAS_POR_COMPAS: Record<Compas, number> = {
  '2/4': 2,
  '4/4': 4,
  '3/4': 3,
  '6/8': 6,
};

export const MUNDO_POR_COMPAS: Record<Compas, Mundo> = {
  '2/4': 'binario',
  '4/4': 'binario',
  '3/4': 'ternario',
  '6/8': 'ternario',
};

// Índices de casilla (dentro del compás) que llevan acento. El 6/8 se agrupa
// 3+3, así que el 4 es el segundo pulso principal.
export const ACENTOS: Record<Compas, number[]> = {
  '2/4': [0],
  '4/4': [0],
  '3/4': [0],
  '6/8': [0, 3],
};

// Cuántas casillas entran en un pulso principal. El BPM se refiere SIEMPRE al
// pulso principal: negra en los x/4, negra con puntillo en 6/8 (que contiene
// 3 corcheas). Así "tortuga → conejo" significa lo mismo en los dos mundos.
const CASILLAS_POR_PULSO: Record<Compas, number> = {
  '2/4': 1,
  '4/4': 1,
  '3/4': 1,
  '6/8': 3,
};

const GRADOS_MAYOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;
const GRADOS_MENOR = ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'] as const;

export type GradoDiatonico = (typeof GRADOS_MAYOR)[number] | (typeof GRADOS_MENOR)[number];
export type GradoId = GradoDiatonico | `V/${GradoDiatonico}` | `ii/${GradoDiatonico}`;

export function gradosDe(modo: Modo): readonly GradoDiatonico[] {
  return modo === 'mayor' ? GRADOS_MAYOR : GRADOS_MENOR;
}

export type Calidad = 'M' | 'm' | 'dim';

// Mismas tablas que GradosArmonicos (QUALITIES / QUALITIES_MINOR).
const CALIDAD_MAYOR: readonly Calidad[] = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];
const CALIDAD_MENOR: readonly Calidad[] = ['m', 'dim', 'M', 'm', 'm', 'M', 'M'];

export function calidadesDe(modo: Modo): readonly Calidad[] {
  return modo === 'mayor' ? CALIDAD_MAYOR : CALIDAD_MENOR;
}

// Formato armónico heredado de GradosArmonicos (reunión 24/5/26): I y vi
// reposo · ii y iii medio · IV medio-tenso · V y vii tenso. Es un mapeo por
// índice de grado (tónica, supertónica, ...), no atado al modo.
const ROL_POR_INDICE: readonly RolArmonico[] = [
  'stable',
  'medium',
  'medium',
  'mediumTense',
  'tense',
  'stable',
  'tense',
];

// Un grado es tonizable si su acorde es mayor o menor: la tónica queda fuera
// (su V/I ya está en el banco como V) y los disminuidos no se tonizan.
export function esTonizable(modo: Modo, indice: number): boolean {
  if (indice === 0) return false;
  return calidadesDe(modo)[indice] !== 'dim';
}

export function tonizacionesDe(modo: Modo, indice: number): GradoId[] {
  if (!esTonizable(modo, indice)) return [];
  const g = gradosDe(modo)[indice];
  return [`V/${g}`, `ii/${g}`];
}

// El rol de color de una tonización sale de su función, no de una tabla nueva:
// V/x es un dominante (tenso), ii/x es una subdominante (medio).
//
// Precondición: `id` (cuando no es una tonización V/x o ii/x) debe pertenecer
// al vocabulario de `modo` — p. ej. no llamar `rolDe('mayor', 'iv')`. La
// función no valida esto; es responsabilidad del llamador mantener la grilla
// coherente con el modo elegido.
export function rolDe(modo: Modo, id: GradoId): RolArmonico {
  if (id.startsWith('V/')) return 'tense';
  if (id.startsWith('ii/')) return 'medium';
  const i = gradosDe(modo).indexOf(id as GradoDiatonico);
  return ROL_POR_INDICE[i];
}

export type Slot = { degree: GradoId } | null;
export type Grid = Slot[];

export function crearGrid(compas: Compas, nCompases: number): Grid {
  return new Array<Slot>(nCompases * CASILLAS_POR_COMPAS[compas]).fill(null);
}

export function msPorCasilla(compas: Compas, bpm: number): number {
  return 60000 / bpm / CASILLAS_POR_PULSO[compas];
}

export function duracionTotalMs(grid: Grid, compas: Compas, bpm: number): number {
  return grid.length * msPorCasilla(compas, bpm);
}

export interface EventoAcorde {
  degree: GradoId;
  startMs: number;
  durMs: number;
  slotIndex: number;
}

// La regla del profesor, literal: un acorde suena desde su casilla hasta la
// siguiente casilla ocupada, o hasta el final de la grilla. Las casillas vacías
// antes del primer acorde son silencio.
export function gridToEvents(grid: Grid, compas: Compas, bpm: number): EventoAcorde[] {
  const paso = msPorCasilla(compas, bpm);
  const eventos: EventoAcorde[] = [];
  grid.forEach((slot, i) => {
    if (!slot) return;
    const previo = eventos[eventos.length - 1];
    // El evento anterior se corrige acá: su duración provisional (hasta el
    // final de la grilla) se recorta ahora que apareció el siguiente acorde.
    if (previo) previo.durMs = (i - previo.slotIndex) * paso;
    eventos.push({
      degree: slot.degree,
      startMs: i * paso,
      durMs: (grid.length - i) * paso,
      slotIndex: i,
    });
  });
  return eventos;
}

// Qué casilla está sonando en un instante dado. Devuelve -1 antes del primer
// acorde. Lo usa el cabezal visual, que lee el reloj de audio.
export function casillaEn(ms: number, compas: Compas, bpm: number, total: number): number {
  // El epsilon absorbe la deriva de coma flotante: `gridToEvents` produce
  // startMs = i * paso, y dividir de vuelta no siempre devuelve i exacto
  // (6/8 @90 falla en las casillas 31 y 45 sin esto). Sin el epsilon el
  // cabezal parpadea hacia atrás justo en el borde de casilla.
  const i = Math.floor(ms / msPorCasilla(compas, bpm) + 1e-6);
  return i < 0 || i >= total ? -1 : i;
}
