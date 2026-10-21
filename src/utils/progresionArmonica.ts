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

// Reunión 19/10/26: "el rojo suena más fuerte que todos; el morado y el
// amarillo más fuerte que el verde… de alguna manera sutil". Factor sobre la
// voz, por debajo de la dinámica general (pp…ff) que elige el estudiante.
export const GANANCIA_POR_ROL: Record<RolArmonico, number> = {
  tense: 1,
  mediumTense: 0.85,
  medium: 0.85,
  stable: 0.72,
};

/** Los nodos de escala de §1.4 y §1.5 usan su propio vocabulario de color. */
export type RolDeNotaEnEscala = 'tonic' | 'stable' | 'intermediate' | 'tense';
const ROL_ARMONICO_DE_NOTA: Record<RolDeNotaEnEscala, RolArmonico> = {
  tonic: 'stable',
  stable: 'stable',
  intermediate: 'medium',
  tense: 'tense',
};
export const gananciaDeNotaEnEscala = (rol: RolDeNotaEnEscala) =>
  GANANCIA_POR_ROL[ROL_ARMONICO_DE_NOTA[rol]];

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

// Reunión 19/10/26: al elegir una tonalidad menor "se desbloquean dos acordes:
// el quinto mayor y el séptimo disminuido", importados de la menor armónica
// para que la menor tenga dominante. Van además de los siete naturales (el v
// menor natural sigue disponible). El III+ queda fuera (D4 del plan).
const GRADOS_MENOR_ARMONICA = ['V', 'vii°'] as const;

export function gradosArmonicosDe(modo: Modo): readonly GradoDiatonico[] {
  return modo === 'menor' ? GRADOS_MENOR_ARMONICA : [];
}

export function esGradoArmonico(modo: Modo, id: GradoId): boolean {
  return (gradosArmonicosDe(modo) as readonly string[]).includes(id);
}

// Un sus reemplaza la 3ª: sobre un acorde con 5ª disminuida (vii°, ii° en
// menor, el ii/x semidisminuido de un destino menor) deja de sonar a sus, así
// que esos no lo admiten (D11 del plan del 19/10: todos salvo los disminuidos).
export function admiteSus(modo: Modo, id: GradoId): boolean {
  if (id.startsWith('V/')) return true;
  if (id.startsWith('ii/')) {
    const destino = id.slice(3) as GradoDiatonico;
    return calidadDeGrado(modo, destino) === 'M';
  }
  return calidadDeGrado(modo, id as GradoDiatonico) !== 'dim';
}

function calidadDeGrado(modo: Modo, grado: GradoDiatonico): Calidad {
  if (esGradoArmonico(modo, grado)) return grado === 'V' ? 'M' : 'dim';
  return calidadesDe(modo)[gradosDe(modo).indexOf(grado)];
}

// Tocar una casilla con un sus armado: lo pone, lo cambia por el otro o, si
// ya tenía el mismo, lo quita. Casillas vacías o acordes que no lo admiten
// quedan igual.
export function aplicarSus(grid: Grid, indice: number, sus: Sus): Grid {
  const slot = grid[indice];
  if (!slot || !admiteSus(slot.tonalidad.modo, slot.degree)) return grid;
  const { sus: actual, ...resto } = slot;
  return colocarSlot(grid, indice, actual === sus ? resto : { ...resto, sus });
}

// La 7 la admite cualquier acorde; los sus, solo los que no tienen 5ª disminuida.
export function admiteModificador(modo: Modo, id: GradoId, modificador: Modificador): boolean {
  return modificador === '7' || admiteSus(modo, id);
}

// Reunión 19/10/26: "puede que no quiera yo todos con séptima, solo unos
// cuantos". La ficha 7 alterna la séptima de un solo acorde.
export function aplicarModificador(grid: Grid, indice: number, modificador: Modificador): Grid {
  if (modificador !== '7') return aplicarSus(grid, indice, modificador);
  const slot = grid[indice];
  if (!slot) return grid;
  return colocarSlot(grid, indice, { ...slot, septima: !slot.septima });
}

// Reunión 19/10/26: "agarro este botón y lo arrastro acá… va a sonar una, va a
// sonar dos, y luego va a seguir adelante". Un solo tramo de compases (base 0)
// que suena dos veces.
export type Repeticion = { inicio: number; fin: number } | null;
export type ExtremoRepeticion = 'inicio' | 'fin';

// Poner un extremo completa el tramo con el otro: ‖: solo termina en su propio
// compás; :‖ solo repite desde el principio, como en la partitura. Si quedan
// al revés, se intercambian.
export function marcarRepeticion(rep: Repeticion, extremo: ExtremoRepeticion, compas: number): NonNullable<Repeticion> {
  const otro = extremo === 'inicio' ? (rep?.fin ?? compas) : (rep?.inicio ?? 0);
  return { inicio: Math.min(compas, otro), fin: Math.max(compas, otro) };
}

// Al bajar la cantidad de compases el tramo se ajusta al último; si su inicio
// queda fuera, se quita.
export function ajustarRepeticion(rep: Repeticion, nCompases: number): Repeticion {
  if (!rep || rep.inicio >= nCompases) return null;
  return { inicio: rep.inicio, fin: Math.min(rep.fin, nCompases - 1) };
}

// La grilla en orden de reproducción: el tramo se copia detrás de sí mismo.
// `origen[i]` dice qué casilla real suena en la posición i (para el cabezal).
// El reloj, el metrónomo y la pausa trabajan sobre la grilla expandida sin
// saber que existe la repetición.
export function expandirRepeticion(
  grid: Grid,
  casillasPorCompas: number,
  rep: Repeticion,
): { grid: Grid; origen: number[] } {
  const origen = grid.map((_, i) => i);
  if (rep) {
    const finTramo = (rep.fin + 1) * casillasPorCompas;
    origen.splice(finTramo, 0, ...origen.slice(rep.inicio * casillasPorCompas, finTramo));
  }
  return { grid: origen.map((i) => grid[i]), origen };
}

// El botón general de séptimas: "si yo toco séptima, todos se pusieron séptimas".
export function fijarSeptimas(grid: Grid, septima: boolean): Grid {
  return grid.map((slot) => slot && { ...slot, septima });
}

// "Cada uno con sus tonizaciones, excepto el disminuido."
export function tonizacionesDeGrado(grado: GradoDiatonico): GradoId[] {
  return grado.endsWith('°') ? [] : [`V/${grado}`, `ii/${grado}`];
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
  if (esGradoArmonico(modo, id)) return 'tense';
  const i = gradosDe(modo).indexOf(id as GradoDiatonico);
  return ROL_POR_INDICE[i];
}

// Reunión 19/10/26 (modulación): cada casilla guarda la tonalidad en la que
// se colocó. Cambiar de tonalidad ya no transpone lo que estaba puesto: lo que
// sigue se coloca en la nueva, y la grilla marca dónde cambió.
export interface Tonalidad {
  armaduraId: string;
  modo: Modo;
}
// Reunión 19/10/26: sus2 / sus4 se aplican sobre un acorde ya colocado,
// independientes de la séptima ("una cosa es la séptima y otra la tríada").
export type Sus = 'sus2' | 'sus4';
export type Slot = { degree: GradoId; tonalidad: Tonalidad; sus?: Sus; septima?: boolean } | null;
/** Fichas que cambian un acorde ya colocado: los sus y la séptima. */
export type Modificador = Sus | '7';
export type Grid = Slot[];

export function mismaTonalidad(a: Tonalidad, b: Tonalidad): boolean {
  return a.armaduraId === b.armaduraId && a.modo === b.modo;
}

export function colocarSlot(grid: Grid, indice: number, slot: Slot): Grid {
  const nueva = grid.slice();
  nueva[indice] = slot;
  return nueva;
}

// Dónde empieza cada tramo de tonalidad: el primer acorde y cada acorde cuya
// tonalidad difiere de la del acorde anterior. Las casillas vacías no cortan.
export function puntosDeModulacion(grid: Grid): { indice: number; tonalidad: Tonalidad }[] {
  const puntos: { indice: number; tonalidad: Tonalidad }[] = [];
  grid.forEach((slot, indice) => {
    if (!slot) return;
    const previo = puntos[puntos.length - 1];
    if (!previo || !mismaTonalidad(previo.tonalidad, slot.tonalidad)) {
      puntos.push({ indice, tonalidad: slot.tonalidad });
    }
  });
  return puntos;
}

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

export interface ClickMetronomo {
  casilla: number;
  acento: boolean;
}

// Un clic por casilla, haya o no acordes en ella: el metrónomo marca el pulso
// de la grilla entera, también vacía (reunión 19/10/26: "apreté el metrónomo
// y no suena nada"). Acento en el 1, y también en el 4 en 6/8.
export function clicksDeMetronomo(nCasillas: number, compas: Compas): ClickMetronomo[] {
  const porCompas = CASILLAS_POR_COMPAS[compas];
  return Array.from({ length: nCasillas }, (_, casilla) => ({
    casilla,
    acento: ACENTOS[compas].includes(casilla % porCompas),
  }));
}

// Reanudar después de una pausa (reunión 19/10/26: "por si quiero pausarlo en
// algún momento y no tener que tragarme toda la progresión"). Los tiempos
// quedan relativos al punto de reanudación: el acorde que ya estaba sonando
// arranca en 0 con lo que le quedaba; los que terminaron antes se descartan.
export function eventosDesde(
  eventos: EventoAcorde[],
  desdeCasilla: number,
  paso: number,
): EventoAcorde[] {
  const corte = desdeCasilla * paso;
  return eventos
    .filter((ev) => ev.startMs + ev.durMs > corte)
    .map((ev) => {
      const inicio = Math.max(ev.startMs, corte);
      return { ...ev, startMs: inicio - corte, durMs: ev.startMs + ev.durMs - inicio };
    });
}

export function clicksDesde(clicks: ClickMetronomo[], desdeCasilla: number): ClickMetronomo[] {
  return clicks.filter((c) => c.casilla >= desdeCasilla);
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
