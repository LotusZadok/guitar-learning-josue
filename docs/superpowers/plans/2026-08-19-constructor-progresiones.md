# Constructor de progresiones (T4) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el constructor de progresiones armónicas del módulo T4: el estudiante elige armadura, modo, compás y número de compases, coloca grados y tonizaciones sobre los pulsos, y lo escucha con la regla de relleno/corte del profesor.

**Architecture:** Cuatro capas. Lógica pura sin imports (`progresionArmonica.ts`, verificable con `node --experimental-strip-types`) → resolución de acordes con `tonal` (`progresionAcordes.ts`) → estado en un store zustand sin efectos (`useConstructorStore`) → un único hook dueño del reloj (`useProgressionPlayback`) → cuatro primitivas tontas que solo reciben datos y callbacks. La sección T4 únicamente compone.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, zustand 5, tonal 6, react-i18next, CSS Modules. Sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-08-19-constructor-progresiones-design.md`

---

## Convenciones de este repo que hay que respetar

Leer antes de empezar. No son opcionales.

1. **`CLAUDE.md §5`**: todo cambio de frontend pasa por la doctrina. Cargar `PRODUCT.md`, `DESIGN.md` y `.impeccable/lessons-learned.md` antes de escribir CSS. Pasar la anti-checklist de 14 items antes de cada commit que toque UI.
2. **The Amber-Means-Sounding Rule** (`DESIGN.md §7`): el ámbar significa **solo** "está sonando". Ningún acento ámbar decorativo. El token CSS es **`var(--amber)`** (`src/global.css:10`, `#d4a017`). Ojo: `DESIGN.md` lo llama `ambar-pergamino` en su mapa de colores, pero **esa variable no existe en el CSS** — usarla no rompe el build ni avisa, simplemente cae a `currentcolor` y el estado "sonando" sale del color equivocado.
3. **Note-Color Quarantine**: los 12 hues `--note-X` solo visten notas individuales. Los tokens `--diatonic-*` solo visten grados dentro de una tonalidad activa. Este constructor habla de **grados**, así que usa `--diatonic-*` y **nunca** `--note-X`.
4. **The Chord-Symbol Case Rule**: los cifrados van en `'IBM Plex Mono'`, nunca en Bebas Neue (Bebas es all-caps y destruye `m7` vs `M7`).
5. **Commits sin trailer `Co-Authored-By`.**
6. **Idioma del código**: comentarios y nombres de dominio en español (el repo ya lo hace: `tonizacionEscenarios`, `esExcepcion`). Nombres de API de React/zustand en inglés.
7. **i18n**: toda copy visible va a `src/i18n/locales/es.json` y `de.json`. Los **datos musicales** (romanos, cifrados, tablas de calidad) NO van a i18n — viven como const del módulo consumidor (`DESIGN.md §7`).

---

## Estructura de archivos

**Crear:**

| Archivo | Responsabilidad |
|---|---|
| `src/utils/progresionArmonica.ts` | Lógica pura: compases, casillas, grados, roles, tonizables, `gridToEvents`. **Cero imports en runtime.** |
| `src/utils/progresionAcordes.ts` | Armaduras y resolución grado → acorde sonante. Usa `tonal` y `noteCalculations`. |
| `scripts/verify-progresion-armonica.ts` | Arnés de verificación de la lógica pura. |
| `src/stores/useConstructorStore.ts` | Estado del constructor. Sin efectos, sin audio, sin `persist`. |
| `src/hooks/useProgressionPlayback.ts` | Único dueño del reloj de reproducción. |
| `src/components/shared/RomanGlyph/RomanGlyph.tsx` + `.module.css` | Glifo de número romano con carril tipográfico y rol de color (extraído de `GradosArmonicos`). |
| `src/components/primitives/ArmaduraSelector/` | Banco de armaduras → par mayor/relativa menor. |
| `src/components/primitives/BancoGrados/` | Grados del modo activo con tonizaciones desplegables. |
| `src/components/primitives/GrillaProgresion/` | La grilla de compases y casillas. |
| `src/components/primitives/TransporteProgresion/` | Play/stop, BPM, metrónomo, loop. |
| `src/components/modules/t4/T4Module.tsx` + `.module.css` | Módulo T4. |
| `src/components/modules/t4/components/ConstructorProgresionesSection.tsx` + `.module.css` | La sección: solo compone. |

**Modificar:**

| Archivo | Cambio |
|---|---|
| `src/utils/noteCalculations.ts:368` | `function chordAudio` → `export function chordAudio` |
| `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx:331-345` | Borrar `RomanGlyph` local, importar el compartido |
| `src/components/primitives/GradosArmonicos/GradosArmonicos.module.css:165-187,250-258` | Borrar las reglas de `.romanMajor/.romanMinor/.romanDim` que se mudaron |
| `src/App.tsx` | Ruta `/t4/*` |
| `src/components/layout/Sidebar.tsx:15-18` | Entrada de nav `t4` |
| `src/config/tocConfig.ts` | Bloque `'/t4'` |
| `src/i18n/locales/es.json`, `de.json` | `nav.t4` y grupo `t4` |
| `package.json` | script `verify:constructor` |

---

## Task 1: Lógica pura — compases, grados y `gridToEvents`

**Files:**
- Create: `src/utils/progresionArmonica.ts`
- Create: `scripts/verify-progresion-armonica.ts`
- Modify: `package.json`

- [ ] **Step 1: Escribir el arnés de verificación (falla primero)**

Crear `scripts/verify-progresion-armonica.ts`:

```ts
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
```

Añadir a `package.json` en `"scripts"`, después de `"lint"`:

```json
    "verify:constructor": "node --experimental-strip-types scripts/verify-progresion-armonica.ts",
```

- [ ] **Step 2: Correr el arnés para verificar que falla**

```bash
npm run verify:constructor
```

Esperado: FALLA con `Cannot find module ... progresionArmonica.ts`.

- [ ] **Step 3: Escribir la implementación mínima**

Crear `src/utils/progresionArmonica.ts`:

```ts
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
export const CASILLAS_POR_PULSO: Record<Compas, number> = {
  '2/4': 1,
  '4/4': 1,
  '3/4': 1,
  '6/8': 3,
};

export const GRADOS_MAYOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;
export const GRADOS_MENOR = ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'] as const;

export type GradoDiatonico = (typeof GRADOS_MAYOR)[number] | (typeof GRADOS_MENOR)[number];
export type GradoId = GradoDiatonico | `V/${GradoDiatonico}` | `ii/${GradoDiatonico}`;

export function gradosDe(modo: Modo): readonly GradoDiatonico[] {
  return modo === 'mayor' ? GRADOS_MAYOR : GRADOS_MENOR;
}

export type Calidad = 'M' | 'm' | 'dim';

// Mismas tablas que GradosArmonicos (QUALITIES / QUALITIES_MINOR).
export const CALIDAD_MAYOR: readonly Calidad[] = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];
export const CALIDAD_MENOR: readonly Calidad[] = ['m', 'dim', 'M', 'm', 'm', 'M', 'M'];

export function calidadesDe(modo: Modo): readonly Calidad[] {
  return modo === 'mayor' ? CALIDAD_MAYOR : CALIDAD_MENOR;
}

// Formato armónico heredado de GradosArmonicos (reunión 24/5/26): I y vi
// reposo · ii y iii medio · IV medio-tenso · V y vii tenso. Es un mapeo por
// índice de grado (tónica, supertónica, ...), no atado al modo.
export const ROL_POR_INDICE: readonly RolArmonico[] = [
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
  const i = Math.floor(ms / msPorCasilla(compas, bpm));
  return i < 0 || i >= total ? -1 : i;
}
```

- [ ] **Step 4: Correr el arnés y verificar que pasa**

```bash
npm run verify:constructor
```

Esperado: todas las líneas con `ok`, última línea `TODO OK`, exit 0.

- [ ] **Step 5: Verificar que el typecheck sigue limpio**

```bash
npm run build
```

Esperado: build exitoso, sin errores de TS.

- [ ] **Step 6: Commit**

```bash
git add src/utils/progresionArmonica.ts scripts/verify-progresion-armonica.ts package.json
git commit -m "feat(t4): logica pura del constructor de progresiones (grilla, grados, relleno/corte)"
```

---

## Task 2: Armaduras y resolución grado → acorde sonante

**Files:**
- Create: `src/utils/progresionAcordes.ts`
- Create: `scripts/verify-progresion-acordes.ts`
- Modify: `package.json`

> **Corregido durante la ejecución (commit `6894787`).** El plan original decía que este archivo no se podía verificar desde Node y mandaba mirar un `console.table` en el browser. Falso: la cadena de `noteCalculations` tenía **un solo** import de valores sin extensión (`"../data/notes"`), y todo lo demás era `import type`, que se borra. Con la extensión explícita — y `allowImportingTsExtensions` ya estaba activo en el tsconfig — la cadena entera carga desde Node. La ortografía de acordes es la parte más propensa a errores del feature, así que se verifica con aserciones ejecutables, no a ojo.
>
> El plan original también pedía exportar `chordAudio` de `noteCalculations`. **No hace falta:** `acordeDeGrado` usa `Chord.get` y `spelledSequenceAscending` directamente y nunca llama a `chordAudio`. Era trabajo muerto sobre un archivo compartido. No lo hagas.

- [ ] **Step 2: Escribir `progresionAcordes.ts`**

Crear `src/utils/progresionAcordes.ts`:

```ts
import { Note, Chord } from 'tonal';
// Extensiones .ts explícitas a propósito: son las que permiten que
// `scripts/verify-progresion-acordes.ts` cargue este archivo desde Node con
// --experimental-strip-types. `allowImportingTsExtensions` ya está activo en
// tsconfig.app.json y Vite las resuelve sin problema.
import {
  majorScaleSpelled,
  relativeMinorScaleSpelled,
  spelledSequenceAscending,
} from './noteCalculations.ts';
import type { ChromaticNote, Tonic } from '../types/music';
import {
  calidadesDe,
  gradosDe,
  rolDe,
  type Calidad,
  type GradoDiatonico,
  type GradoId,
  type Modo,
  type RolArmonico,
} from './progresionArmonica.ts';

export interface Armadura {
  id: string;
  alteraciones: number;
  tipo: 'sostenido' | 'bemol';
  /** Tónica mayor, en grafía ASCII (la que consume `tonal`). */
  mayor: Tonic;
  /** Relativa menor, sin la "m" — 'F#' para F♯m. */
  menor: Tonic;
}

// Las 14 armaduras seleccionables. Cb mayor (7♭) queda fuera a propósito: el
// tipo `Tonic` no la cubre (no está entre las 5 enarmonías bemol del método), y
// su enarmónica B mayor ya está disponible en 5♯.
export const ARMADURAS: Armadura[] = [
  { id: 'C',  alteraciones: 0, tipo: 'sostenido', mayor: 'C',  menor: 'A'  },
  { id: 'G',  alteraciones: 1, tipo: 'sostenido', mayor: 'G',  menor: 'E'  },
  { id: 'D',  alteraciones: 2, tipo: 'sostenido', mayor: 'D',  menor: 'B'  },
  { id: 'A',  alteraciones: 3, tipo: 'sostenido', mayor: 'A',  menor: 'F#' },
  { id: 'E',  alteraciones: 4, tipo: 'sostenido', mayor: 'E',  menor: 'C#' },
  { id: 'B',  alteraciones: 5, tipo: 'sostenido', mayor: 'B',  menor: 'G#' },
  { id: 'F#', alteraciones: 6, tipo: 'sostenido', mayor: 'F#', menor: 'D#' },
  { id: 'C#', alteraciones: 7, tipo: 'sostenido', mayor: 'C#', menor: 'A#' },
  { id: 'F',  alteraciones: 1, tipo: 'bemol',     mayor: 'F',  menor: 'D'  },
  { id: 'Bb', alteraciones: 2, tipo: 'bemol',     mayor: 'Bb', menor: 'G'  },
  { id: 'Eb', alteraciones: 3, tipo: 'bemol',     mayor: 'Eb', menor: 'C'  },
  { id: 'Ab', alteraciones: 4, tipo: 'bemol',     mayor: 'Ab', menor: 'F'  },
  { id: 'Db', alteraciones: 5, tipo: 'bemol',     mayor: 'Db', menor: 'Bb' },
  { id: 'Gb', alteraciones: 6, tipo: 'bemol',     mayor: 'Gb', menor: 'Eb' },
];

export function armaduraPorId(id: string): Armadura {
  const a = ARMADURAS.find((x) => x.id === id);
  if (!a) throw new Error(`Armadura desconocida: ${id}`);
  return a;
}

const ASCII = (s: string) => s.replace(/♯/g, '#').replace(/♭/g, 'b');
const GLIFO = (s: string) => s.replace(/#/g, '♯').replace(/b/g, '♭');

/** Etiqueta de la tonalidad tal como se muestra: 'A' o 'F♯m'. */
export function etiquetaTonalidad(armadura: Armadura, modo: Modo): string {
  return modo === 'mayor' ? GLIFO(armadura.mayor) : `${GLIFO(armadura.menor)}m`;
}

export interface AcordeSonante {
  /** Lo que se muestra como cifrado: 'A♭maj7', 'D7'. */
  cifrado: string;
  /** El romano tal como se colocó: 'ii', 'V/vi'. */
  roman: GradoId;
  rol: RolArmonico;
  notas: { chromatic: ChromaticNote; octave: number }[];
}

function sufijo(calidad: Calidad, septimas: boolean): string {
  if (calidad === 'M') return septimas ? 'maj7' : '';
  if (calidad === 'm') return septimas ? 'm7' : 'm';
  return septimas ? 'm7b5' : 'dim';
}

// Las raíces diatónicas del modo activo, en ASCII para `tonal`. En modo menor
// se lee la RELATIVA de la armadura (no la paralela) — misma decisión que §3.9.
function raicesDe(armadura: Armadura, modo: Modo): string[] {
  const escala =
    modo === 'mayor' ? majorScaleSpelled(armadura.mayor) : relativeMinorScaleSpelled(armadura.mayor);
  return escala.map(ASCII);
}

export function acordeDeGrado(
  armadura: Armadura,
  modo: Modo,
  id: GradoId,
  septimas: boolean,
): AcordeSonante {
  const raices = raicesDe(armadura, modo);
  const grados = gradosDe(modo);
  const calidades = calidadesDe(modo);

  let nombre: string;

  if (id.includes('/')) {
    const [funcion, destino] = id.split('/') as ['V' | 'ii', GradoDiatonico];
    const j = grados.indexOf(destino);
    const raizDestino = raices[j];

    if (funcion === 'V') {
      // El V de x: quinta justa sobre la raíz de x. SIEMPRE dominante con
      // séptima, aunque el banco esté en tríadas — así se enseñó en §3.8, y sin
      // la 7ª una dominante secundaria es solo un acorde mayor y pierde el punto.
      nombre = `${ASCII(Note.transpose(raizDestino, '5P'))}7`;
    } else {
      // El ii de x: segunda mayor sobre la raíz de x. Si x es mayor su ii es
      // menor (m7); si x es menor su ii es semidisminuido (m7♭5). Son los dos
      // escenarios de §3.8.
      const raiz = ASCII(Note.transpose(raizDestino, '2M'));
      nombre = raiz + sufijo(calidades[j] === 'm' ? 'dim' : 'm', septimas);
    }
  } else {
    const i = grados.indexOf(id as GradoDiatonico);
    nombre = raices[i] + sufijo(calidades[i], septimas);
  }

  const seq = spelledSequenceAscending(Chord.get(nombre).notes, 4);
  return {
    cifrado: GLIFO(nombre),
    roman: id,
    rol: rolDe(modo, id),
    notas: seq.map((s) => ({ chromatic: s.name, octave: s.octave })),
  };
}
```

- [ ] **Step 3: Escribir el arnés de acordes**

Crear `scripts/verify-progresion-acordes.ts`:

```ts
// Arnés de la resolución grado → acorde sonante. Carga la cadena real
// (progresionAcordes → noteCalculations → data/notes) desde Node.
import { acordeDeGrado, armaduraPorId, etiquetaTonalidad, ARMADURAS } from '../src/utils/progresionAcordes.ts';
import { gradosDe, type GradoId, type Modo } from '../src/utils/progresionArmonica.ts';

let fallos = 0;
function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  if (a === b) console.log(`  ok  ${nombre}`);
  else { fallos++; console.log(`FALLA  ${nombre}\n       esperado ${b}\n       obtenido ${a}`); }
}
const cif = (arm: string, modo: Modo, g: GradoId, sept: boolean) =>
  acordeDeGrado(armaduraPorId(arm), modo, g, sept).cifrado;

console.log('\n— Do mayor, triadas —');
check('I',    cif('C', 'mayor', 'I', false),    'C');
check('ii',   cif('C', 'mayor', 'ii', false),   'Dm');
check('iii',  cif('C', 'mayor', 'iii', false),  'Em');
check('IV',   cif('C', 'mayor', 'IV', false),   'F');
check('V',    cif('C', 'mayor', 'V', false),    'G');
check('vi',   cif('C', 'mayor', 'vi', false),   'Am');
check('vii°', cif('C', 'mayor', 'vii°', false), 'Bdim');

console.log('\n— Do mayor, septimas —');
check('Imaj7',  cif('C', 'mayor', 'I', true),    'Cmaj7');
check('ii7',    cif('C', 'mayor', 'ii', true),   'Dm7');
check('V7',     cif('C', 'mayor', 'V', true),    'G7');
check('vii m7b5', cif('C', 'mayor', 'vii°', true), 'Bm7♭5');

console.log('\n— Tonizaciones en Do mayor —');
// La dominante secundaria SIEMPRE lleva 7ma, aunque el banco este en triadas:
// sin la 7ma es solo un acorde mayor y pierde el punto (decision del spec §2).
check('V/ii en triadas sigue siendo dominante', cif('C', 'mayor', 'V/ii', false), 'A7');
check('V/ii', cif('C', 'mayor', 'V/ii', true), 'A7');
check('V/iii', cif('C', 'mayor', 'V/iii', true), 'B7');
check('V/IV', cif('C', 'mayor', 'V/IV', true), 'C7');
check('V/V', cif('C', 'mayor', 'V/V', true), 'D7');
check('V/vi', cif('C', 'mayor', 'V/vi', true), 'E7');
// El ii de x toma su calidad del destino: destino mayor → m7, destino menor →
// m7b5. Son los dos escenarios de §3.8.
check('ii/ii (destino menor) es semidisminuido', cif('C', 'mayor', 'ii/ii', true), 'Em7♭5');
check('ii/vi (destino menor) es semidisminuido', cif('C', 'mayor', 'ii/vi', true), 'Bm7♭5');
check('ii/IV (destino mayor) es menor', cif('C', 'mayor', 'ii/IV', true), 'Gm7');
check('ii/V (destino mayor) es menor', cif('C', 'mayor', 'ii/V', true), 'Am7');

console.log('\n— Fa# menor (relativa de La mayor) —');
check('i',    cif('A', 'menor', 'i', true),    'F♯m7');
check('ii°',  cif('A', 'menor', 'ii°', true),  'G♯m7♭5');
check('♭III', cif('A', 'menor', '♭III', true), 'Amaj7');
check('iv',   cif('A', 'menor', 'iv', true),   'Bm7');
check('v',    cif('A', 'menor', 'v', true),    'C♯m7');
check('♭VI',  cif('A', 'menor', '♭VI', true),  'Dmaj7');
check('♭VII', cif('A', 'menor', '♭VII', true), 'E7');
check('V/iv', cif('A', 'menor', 'V/iv', true), 'F♯7');

console.log('\n— Armadura con bemoles —');
check('Mib mayor I',  cif('Eb', 'mayor', 'I', true),  'E♭maj7');
check('Mib mayor IV', cif('Eb', 'mayor', 'IV', true), 'A♭maj7');
check('Mib mayor V',  cif('Eb', 'mayor', 'V', true),  'B♭7');

console.log('\n— Etiquetas de tonalidad —');
check('3♯ mayor', etiquetaTonalidad(armaduraPorId('A'), 'mayor'), 'A');
check('3♯ menor', etiquetaTonalidad(armaduraPorId('A'), 'menor'), 'F♯m');
check('0♯ menor', etiquetaTonalidad(armaduraPorId('C'), 'menor'), 'Am');

console.log('\n— Barrido: ningun grado de ninguna armadura produce un acorde vacio —');
const rotos: string[] = [];
for (const arm of ARMADURAS) {
  for (const modo of ['mayor', 'menor'] as Modo[]) {
    const gs = gradosDe(modo);
    for (let i = 0; i < gs.length; i++) {
      const ids: GradoId[] = [gs[i], `V/${gs[i]}`, `ii/${gs[i]}`];
      for (const id of ids) {
        for (const sept of [false, true]) {
          const a = acordeDeGrado(arm, modo, id, sept);
          if (a.notas.length < 3 || a.notas.some((n) => !n.chromatic)) {
            rotos.push(`${arm.id}/${modo}/${id}/${sept ? '7' : '3'}`);
          }
        }
      }
    }
  }
}
check('todas las combinaciones producen un acorde con notas', rotos.slice(0, 12), []);

console.log('\n— Barrido: las notas siempre ascienden desde la raiz —');
const desordenados: string[] = [];
for (const arm of ARMADURAS) {
  for (const modo of ['mayor', 'menor'] as Modo[]) {
    for (const g of gradosDe(modo)) {
      const a = acordeDeGrado(arm, modo, g, true);
      for (let k = 1; k < a.notas.length; k++) {
        const prev = a.notas[k - 1], cur = a.notas[k];
        if (cur.octave < prev.octave) desordenados.push(`${arm.id}/${modo}/${g}`);
      }
    }
  }
}
check('ninguna nota baja de octava respecto de la anterior', desordenados.slice(0, 12), []);

console.log(fallos === 0 ? '\nTODO OK\n' : `\n${fallos} FALLAS\n`);
process.exit(fallos === 0 ? 0 : 1);
```

Añadir a `package.json`, después de `verify:constructor`:

```json
    "verify:acordes": "node --experimental-strip-types scripts/verify-progresion-acordes.ts",
```

**El barrido de las últimas dos secciones es lo importante.** Los checks puntuales confirman lo que ya se espera; el barrido recorre las 14 armaduras × 2 modos × 7 grados × 3 variantes × 2 calidades y es lo que caza las tonalidades extremas (C♯ mayor con sus dobles sostenidos, G♭ mayor) donde el spelling se rompe sin que nadie lo mire.

- [ ] **Step 4: Correr el arnés**

```bash
npm run verify:acordes
```

Esperado: `TODO OK`, exit 0.

Si algún cifrado del barrido falla en una tonalidad extrema, **no cambies el valor esperado del arnés para que pase**. Pará y reportá cuál es: `DESIGN.md §7` ya registra una deuda abierta sobre dobles sostenidos en tonalidades extremas (`D♯`, `G♯`, `A♯` mayores producen F♯♯, B♯, C♯♯) y esto puede ser la misma deuda asomando por otro lado. Es una decisión del dueño, no tuya.

- [ ] **Step 5: Build y lint limpios**

```bash
npm run build
```

Esperado: sin errores de TypeScript. **No hay puerta de ESLint en este plan.** Verificado durante la ejecución: `eslint.config.js` solo declara `files: ['**/*.{js,jsx}']`, y `src/` tiene 110 archivos `.ts`/`.tsx` y cero `.js`/`.jsx`. ESLint no lintea **ni un solo archivo de la aplicación** — `npm run lint` solo alcanza bundles vendorizados de los skills (50 errores preexistentes) y `npx eslint src` falla con exit 2 ("all files matching the glob are ignored"). La verificación estática real es `tsc -b`, que corre en strict con `noUnusedLocals` y `noUnusedParameters`.

- [ ] **Step 6: Commit**

```bash
git add src/utils/progresionAcordes.ts scripts/verify-progresion-acordes.ts package.json
git commit -m "feat(t4): armaduras y resolucion de grado a acorde sonante"
```

---

## Task 3: Extraer `RomanGlyph` a shared

`RomanGlyph` es hoy una función local de `GradosArmonicos.tsx` (línea 331). El constructor la necesita en dos primitivas más. Se extrae **sin cambiar su comportamiento**: T2 §2.6 y T3 §3.5/§3.9 tienen que verse idénticos.

**Files:**
- Create: `src/components/shared/RomanGlyph/RomanGlyph.tsx`
- Create: `src/components/shared/RomanGlyph/RomanGlyph.module.css`
- Modify: `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx`
- Modify: `src/components/primitives/GradosArmonicos/GradosArmonicos.module.css`

- [ ] **Step 1: Crear el CSS compartido**

Crear `src/components/shared/RomanGlyph/RomanGlyph.module.css` con las reglas movidas literalmente desde `GradosArmonicos.module.css:165-187` y `250-258`:

```css
/* Carril tipográfico de calidad (reunión 24/5/26 + §3.9): mayor = bold recto,
   menor = regular, disminuido = itálica y un punto más chico. La discriminación
   es tipográfica ADEMÁS de cromática, para que el color no sea el único
   portador de información. Plex Mono, nunca Bebas (The Chord-Symbol Case Rule:
   Bebas es all-caps y borraría la diferencia mayúscula/minúscula). */
.romanMajor {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  color: var(--paper);
}

.romanMinor {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: var(--text-body);
}

.romanDim {
  font-family: 'IBM Plex Mono', monospace;
  font-style: italic;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: var(--text-body);
}

/* Formato armónico: el color lo pone el propio glifo vía su data-harmonic, no
   un ancestro. Antes estas reglas dependían de un contenedor con el atributo;
   al mudarse a un componente compartido el atributo viaja con el glifo. */
.romanMajor[data-harmonic='stable'],
.romanMinor[data-harmonic='stable'] { color: var(--diatonic-stable); }

.romanMajor[data-harmonic='medium'],
.romanMinor[data-harmonic='medium'] { color: var(--diatonic-medium); }

.romanMajor[data-harmonic='mediumTense'],
.romanMinor[data-harmonic='mediumTense'] { color: var(--diatonic-medium-tense); }

.romanMajor[data-harmonic='tense'],
.romanMinor[data-harmonic='tense'],
.romanDim[data-harmonic='tense'] { color: var(--diatonic-tense); }
```

- [ ] **Step 2: Crear el componente compartido**

Crear `src/components/shared/RomanGlyph/RomanGlyph.tsx`:

```tsx
import type { DiatonicRole } from '../NoteToken/NoteToken';
import styles from './RomanGlyph.module.css';

// Reunión 24/5/26: color por formato armónico (no por mayor/menor visual).
// Generalizado en §3.9 para 'ii°' (menor) además de 'vii°' (mayor): cualquier
// grado disminuido termina en '°', sin importar el modo. Extraído de
// GradosArmonicos en la ola de T4 porque el constructor de progresiones lo
// necesita en el banco y en la grilla.
export default function RomanGlyph({ roman, role }: { roman: string; role: DiatonicRole }) {
  const isDim = roman.endsWith('°');
  const isMajor = !isDim && roman === roman.toUpperCase();
  return (
    <span
      className={isDim ? styles.romanDim : isMajor ? styles.romanMajor : styles.romanMinor}
      data-harmonic={role}
    >
      {roman}
    </span>
  );
}
```

- [ ] **Step 3: Reapuntar `GradosArmonicos`**

En `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx`:

1. Borrar la función local `RomanGlyph` completa (líneas 331-345, desde `function RomanGlyph({ roman, role }` hasta su `}` de cierre, incluyendo el comentario de arriba).
2. Añadir el import junto a los demás del tope del archivo:

```tsx
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
```

En `src/components/primitives/GradosArmonicos/GradosArmonicos.module.css`, borrar:
- las reglas `.romanMajor`, `.romanMinor`, `.romanDim` (líneas 165-188),
- las reglas `[data-harmonic="..."] .romanMajor / .romanMinor / .romanDim` (líneas 250-258).

**No tocar** las reglas de `.gradoCell[data-harmonic]` ni `.chordCellActive[data-harmonic]`: esas visten la celda, no el glifo, y siguen usándose.

- [ ] **Step 4: Verificar que no quedaron referencias muertas**

```bash
npm run build
```

Esperado: sin errores de TypeScript. **No hay puerta de ESLint en este plan.** Verificado durante la ejecución: `eslint.config.js` solo declara `files: ['**/*.{js,jsx}']`, y `src/` tiene 110 archivos `.ts`/`.tsx` y cero `.js`/`.jsx`. ESLint no lintea **ni un solo archivo de la aplicación** — `npm run lint` solo alcanza bundles vendorizados de los skills (50 errores preexistentes) y `npx eslint src` falla con exit 2 ("all files matching the glob are ignored"). La verificación estática real es `tsc -b`, que corre en strict con `noUnusedLocals` y `noUnusedParameters`.

Si aparece `'DiatonicRole' is defined but never used` en `GradosArmonicos.tsx`, quitar `DiatonicRole` del import de `NoteToken` **solo si** ya no lo usan `DEGREE_ROLE`/`HARMONIC_ROLE` — sí lo usan, así que el import debe quedarse.

- [ ] **Step 5: Verificar la no-regresión visual**

**La app usa `HashRouter`**: las rutas son `#/t2`, `#/t3`, `#/t4`. Navegar a `http://localhost:5173/t2` carga T1 y deja la URL en `/t2#/t1`, que se confunde fácil con un bug. Y el `LockScreen` se saltea sin contraseña: `App.tsx` solo lee `localStorage.getItem('site-unlocked') === 'true'`, así que basta `localStorage.setItem('site-unlocked','true')` y recargar.

Arrancar el preview y comparar contra `main`:
- `#/t2` → §2.6 "Grados armónicos" (sección `s-t2-grados`): los romanos `I ii iii IV V vi vii°` conservan tamaño, peso, itálica del `vii°` y color por rol (I verde, IV púrpura, V rojo).
- `#/t3` → §3.5 "Grado 7" (`s-t3-grado-7`): arranca en el paso de séptimas, romanos iguales.
- `#/t3` → §3.9 "Escala menor" (`s-t3-escala-menor`): `i ii° ♭III iv v ♭VI ♭VII`, el `ii°` en itálica.

- [ ] **Step 6: Build limpio y commit**

```bash
npm run build
```

```bash
git add src/components/shared/RomanGlyph src/components/primitives/GradosArmonicos
git commit -m "refactor(ui): RomanGlyph pasa a shared para reuso en el constructor"
```

---

## Task 4: Store del constructor

**Files:**
- Create: `src/stores/useConstructorStore.ts`

Estado puro: sin efectos, sin audio, **sin `persist`** (PRODUCT.md: no hay seguimiento; `useUIStore` solo persiste el tema).

- [ ] **Step 1: Escribir el store**

Crear `src/stores/useConstructorStore.ts`:

```ts
import { create } from 'zustand';
import {
  CASILLAS_POR_COMPAS,
  crearGrid,
  gradosDe,
  type Compas,
  type GradoId,
  type Grid,
  type Modo,
} from '../utils/progresionArmonica';

export const BPM_MIN = 40;
export const BPM_MAX = 200;
export const BPM_DEFAULT = 90;
export const COMPASES_MIN = 1;
export const COMPASES_MAX = 8;
export const COMPASES_DEFAULT = 4;

interface ConstructorState {
  armaduraId: string;
  modo: Modo;
  compas: Compas;
  nCompases: number;
  bpm: number;
  septimas: boolean;
  metronomo: boolean;
  loop: boolean;
  grid: Grid;
  /** El grado tocado en el banco, esperando una casilla. Null = nada armado. */
  gradoArmado: GradoId | null;

  setArmadura: (id: string) => void;
  setModo: (modo: Modo) => void;
  setCompas: (compas: Compas) => void;
  setNCompases: (n: number) => void;
  setBpm: (bpm: number) => void;
  toggleSeptimas: () => void;
  toggleMetronomo: () => void;
  toggleLoop: () => void;
  armarGrado: (id: GradoId | null) => void;
  colocarEn: (slotIndex: number) => void;
  vaciarSlot: (slotIndex: number) => void;
  limpiarGrid: () => void;
}

// Qué grados del grid dejan de existir al cambiar de modo. Los romanos son
// distintos entre mayor y menor ('I' no existe en menor), así que cambiar de
// modo deja casillas huérfanas. Quién avisa al usuario es la sección, no el
// store; el store solo sabe contarlas y limpiarlas.
export function contarHuerfanas(grid: Grid, modoDestino: Modo): number {
  const validos = new Set<string>(gradosDe(modoDestino));
  return grid.filter((s) => {
    if (!s) return false;
    const base = s.degree.includes('/') ? s.degree.split('/')[1] : s.degree;
    return !validos.has(base);
  }).length;
}

function limpiarHuerfanas(grid: Grid, modoDestino: Modo): Grid {
  const validos = new Set<string>(gradosDe(modoDestino));
  return grid.map((s) => {
    if (!s) return null;
    const base = s.degree.includes('/') ? s.degree.split('/')[1] : s.degree;
    return validos.has(base) ? s : null;
  });
}

export const useConstructorStore = create<ConstructorState>()((set) => ({
  armaduraId: 'C',
  modo: 'mayor',
  compas: '4/4',
  nCompases: COMPASES_DEFAULT,
  bpm: BPM_DEFAULT,
  septimas: false,
  metronomo: false,
  loop: false,
  grid: crearGrid('4/4', COMPASES_DEFAULT),
  gradoArmado: null,

  // Cambiar de armadura NO borra la grilla: los grados son independientes de la
  // tonalidad, y ese es medio punto de la lección.
  setArmadura: (armaduraId) => set({ armaduraId }),

  // Cambiar de modo SÍ reescribe los romanos, así que las casillas cuyo grado no
  // existe en el modo destino se vacían. La confirmación la pide la sección
  // ANTES de llamar acá (ver contarHuerfanas).
  setModo: (modo) => set((s) => ({ modo, grid: limpiarHuerfanas(s.grid, modo) })),

  // Cambiar el compás re-arma la grilla: cambia cuántas casillas tiene cada
  // compás, así que los índices viejos no significan lo mismo.
  setCompas: (compas) => set((s) => ({ compas, grid: crearGrid(compas, s.nCompases) })),

  // Cambiar el número de compases conserva lo que cabe: recortar por el final es
  // lo que espera alguien que baja de 4 a 2 compases.
  setNCompases: (n) =>
    set((s) => {
      const nCompases = Math.min(COMPASES_MAX, Math.max(COMPASES_MIN, n));
      const largo = nCompases * CASILLAS_POR_COMPAS[s.compas];
      const grid = crearGrid(s.compas, nCompases);
      for (let i = 0; i < Math.min(largo, s.grid.length); i++) grid[i] = s.grid[i];
      return { nCompases, grid };
    }),

  setBpm: (bpm) => set({ bpm: Math.min(BPM_MAX, Math.max(BPM_MIN, bpm)) }),
  toggleSeptimas: () => set((s) => ({ septimas: !s.septimas })),
  toggleMetronomo: () => set((s) => ({ metronomo: !s.metronomo })),
  toggleLoop: () => set((s) => ({ loop: !s.loop })),

  armarGrado: (gradoArmado) => set({ gradoArmado }),

  // Colocar consume el grado armado: el gesto es tocar-grado → tocar-casilla, y
  // dejarlo armado invitaría a llenar la grilla del mismo acorde sin querer.
  colocarEn: (slotIndex) =>
    set((s) => {
      if (!s.gradoArmado) return {};
      const grid = s.grid.slice();
      grid[slotIndex] = { degree: s.gradoArmado };
      return { grid, gradoArmado: null };
    }),

  vaciarSlot: (slotIndex) =>
    set((s) => {
      const grid = s.grid.slice();
      grid[slotIndex] = null;
      return { grid };
    }),

  limpiarGrid: () => set((s) => ({ grid: crearGrid(s.compas, s.nCompases), gradoArmado: null })),
}));
```

- [ ] **Step 2: Verificar el typecheck**

```bash
npm run build
```

Esperado: exitoso.

- [ ] **Step 3: Commit**

```bash
git add src/stores/useConstructorStore.ts
git commit -m "feat(t4): store del constructor de progresiones"
```

---

## Task 5: Primitiva `ArmaduraSelector`

El escenario 1 del profesor: botones de armadura; al elegir uno se despliega el par mayor / relativa menor y hay que elegir cuál.

**Files:**
- Create: `src/components/primitives/ArmaduraSelector/ArmaduraSelector.tsx`
- Create: `src/components/primitives/ArmaduraSelector/ArmaduraSelector.module.css`

- [ ] **Step 1: Escribir el componente**

Crear `src/components/primitives/ArmaduraSelector/ArmaduraSelector.tsx`:

```tsx
import { useTranslation } from 'react-i18next';
import { ARMADURAS, armaduraPorId, etiquetaTonalidad } from '../../../utils/progresionAcordes';
import type { Modo } from '../../../utils/progresionArmonica';
import styles from './ArmaduraSelector.module.css';

interface Props {
  armaduraId: string;
  modo: Modo;
  onArmadura: (id: string) => void;
  onModo: (modo: Modo) => void;
}

function etiquetaArmadura(alteraciones: number, tipo: 'sostenido' | 'bemol'): string {
  if (alteraciones === 0) return '♮';
  return `${alteraciones}${tipo === 'sostenido' ? '♯' : '♭'}`;
}

// Escenario 1 del profesor: primero la armadura, después cuál de las dos
// tonalidades que la comparten. A y F♯m tienen la misma armadura; elegir una
// determina los grados que se despliegan abajo.
export default function ArmaduraSelector({ armaduraId, modo, onArmadura, onModo }: Props) {
  const { t } = useTranslation();
  const activa = armaduraPorId(armaduraId);
  const sostenidos = ARMADURAS.filter((a) => a.tipo === 'sostenido');
  const bemoles = ARMADURAS.filter((a) => a.tipo === 'bemol');

  return (
    <div className={styles.wrap}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{t('t4.s41.armadura_label')}</legend>

        <div className={styles.fila} role="group" aria-label={t('t4.s41.sostenidos')}>
          {sostenidos.map((a) => (
            <button
              key={a.id}
              type="button"
              className={styles.armadura}
              aria-pressed={a.id === armaduraId}
              onClick={() => onArmadura(a.id)}
            >
              {etiquetaArmadura(a.alteraciones, a.tipo)}
            </button>
          ))}
        </div>

        <div className={styles.fila} role="group" aria-label={t('t4.s41.bemoles')}>
          {bemoles.map((a) => (
            <button
              key={a.id}
              type="button"
              className={styles.armadura}
              aria-pressed={a.id === armaduraId}
              onClick={() => onArmadura(a.id)}
            >
              {etiquetaArmadura(a.alteraciones, a.tipo)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{t('t4.s41.tonalidad_label')}</legend>
        <div className={styles.fila}>
          {(['mayor', 'menor'] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={styles.tonalidad}
              aria-pressed={m === modo}
              onClick={() => onModo(m)}
            >
              {etiquetaTonalidad(activa, m)}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
```

- [ ] **Step 2: Escribir el CSS**

Crear `src/components/primitives/ArmaduraSelector/ArmaduraSelector.module.css`:

```css
.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-start;
}

.fieldset {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.legend {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0 0 8px;
}

.fila {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.armadura,
.tonalidad {
  font-family: 'IBM Plex Mono', monospace;
  background: transparent;
  color: var(--text-body);
  border: 1px solid var(--rule);
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease;
}

.armadura {
  min-width: 40px;
  padding: 6px 8px;
  font-size: 13px;
}

.tonalidad {
  min-width: 64px;
  padding: 6px 14px;
  font-size: 14px;
}

.armadura:hover,
.tonalidad:hover {
  border-color: var(--muted);
  color: var(--paper);
}

.armadura[aria-pressed='true'],
.tonalidad[aria-pressed='true'] {
  border-color: var(--paper);
  color: var(--paper);
  background: var(--surface);
}

.armadura:focus-visible,
.tonalidad:focus-visible {
  outline: 2px solid var(--paper);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .armadura,
  .tonalidad { transition: none; }
}
```

Nota de doctrina: **nada de ámbar acá**. El estado seleccionado se marca con borde y fondo neutro; el ámbar está reservado a "sonando".

- [ ] **Step 3: Verificar el typecheck**

```bash
npm run build
```

Esperado: falla con `Missing "t4.s41..."`? No — i18next no falla en compilación. Esperado: build exitoso. Las claves i18n se añaden en la Task 9; hasta entonces la UI muestra la clave cruda, que es el comportamiento normal de i18next.

- [ ] **Step 4: Commit**

```bash
git add src/components/primitives/ArmaduraSelector
git commit -m "feat(t4): primitiva ArmaduraSelector"
```

---

## Task 6: Primitiva `BancoGrados`

**Files:**
- Create: `src/components/primitives/BancoGrados/BancoGrados.tsx`
- Create: `src/components/primitives/BancoGrados/BancoGrados.module.css`

- [ ] **Step 1: Escribir el componente**

Crear `src/components/primitives/BancoGrados/BancoGrados.tsx`:

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { acordeDeGrado, type Armadura } from '../../../utils/progresionAcordes';
import {
  gradosDe,
  rolDe,
  tonizacionesDe,
  esTonizable,
  type GradoId,
  type Modo,
} from '../../../utils/progresionArmonica';
import styles from './BancoGrados.module.css';

interface Props {
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  gradoArmado: GradoId | null;
  onArmar: (id: GradoId | null) => void;
}

// El banco: los 7 grados del modo activo. Cada grado tonizable expande sus dos
// tonizaciones (V/x y ii/x) — el gesto de la pizarra. Tocar un grado lo deja
// "armado"; la casilla de la grilla lo consume. El drag & drop va encima de
// esto (draggable + dataTransfer), nunca en su lugar: el tap-tap es la vía
// principal y la única que funciona con teclado y lector de pantalla.
export default function BancoGrados({ armadura, modo, septimas, gradoArmado, onArmar }: Props) {
  const { t } = useTranslation();
  const [abierto, setAbierto] = useState<number | null>(null);
  const grados = gradosDe(modo);

  const chip = (id: GradoId, extra?: string) => {
    const acorde = acordeDeGrado(armadura, modo, id, septimas);
    const armado = gradoArmado === id;
    return (
      <button
        key={id}
        type="button"
        className={`${styles.chip} ${extra ?? ''}`}
        data-role={rolDe(modo, id)}
        aria-pressed={armado}
        aria-label={t('t4.s41.armar_grado', { grado: id, acorde: acorde.cifrado })}
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
        onClick={() => onArmar(armado ? null : id)}
      >
        <RomanGlyph roman={id} role={acorde.rol} />
        <span className={styles.cifrado}>{acorde.cifrado}</span>
      </button>
    );
  };

  return (
    <div className={styles.wrap}>
      {grados.map((g, i) => (
        <div key={g} className={styles.columna}>
          {chip(g)}
          {esTonizable(modo, i) && (
            <>
              <button
                type="button"
                className={styles.expandir}
                aria-expanded={abierto === i}
                aria-controls={`toniz-${i}`}
                onClick={() => setAbierto(abierto === i ? null : i)}
              >
                {t('t4.s41.tonizaciones')}
              </button>
              <div id={`toniz-${i}`} className={styles.tonizaciones} hidden={abierto !== i}>
                {tonizacionesDe(modo, i).map((id) => chip(id, styles.chipToniz))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Escribir el CSS**

Crear `src/components/primitives/BancoGrados/BancoGrados.module.css`:

```css
.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.columna {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 88px;
}

/* Formato armónico: tinte de fondo al 12% + el romano en el token pleno (lo
   pone RomanGlyph vía data-harmonic). Misma receta que GradosArmonicos §2.6 y
   ProgresionIIVI §3.7 — ver DESIGN.md §7. */
.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  border: 1px solid var(--rule);
  background: transparent;
  cursor: grab;
  transition: border-color 160ms ease;
}

.chip[data-role='stable']      { background: color-mix(in srgb, var(--diatonic-stable) 12%, transparent); }
.chip[data-role='medium']      { background: color-mix(in srgb, var(--diatonic-medium) 12%, transparent); }
.chip[data-role='mediumTense'] { background: color-mix(in srgb, var(--diatonic-medium-tense) 14%, transparent); }
.chip[data-role='tense']       { background: color-mix(in srgb, var(--diatonic-tense) 12%, transparent); }

.chip:hover { border-color: var(--muted); }

/* "Armado" = esperando casilla. Se marca con el borde de tinta, NO con ámbar:
   el ámbar significa "sonando" (The Amber-Means-Sounding Rule). */
.chip[aria-pressed='true'] {
  border-color: var(--paper);
  box-shadow: inset 0 0 0 1px var(--paper);
}

.chip:focus-visible {
  outline: 2px solid var(--paper);
  outline-offset: 2px;
}

.cifrado {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--muted);
}

.chipToniz { padding: 6px 8px; }

.expandir {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--rule);
  padding: 2px 0;
  cursor: pointer;
}

.expandir:hover { color: var(--paper); }
.expandir:focus-visible { outline: 2px solid var(--paper); outline-offset: 2px; }

.tonizaciones {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .chip { transition: none; }
}
```

- [ ] **Step 3: Build limpio y commit**

```bash
npm run build
```

```bash
git add src/components/primitives/BancoGrados
git commit -m "feat(t4): primitiva BancoGrados con tonizaciones desplegables"
```

---

## Task 7: Primitiva `GrillaProgresion`

**Files:**
- Create: `src/components/primitives/GrillaProgresion/GrillaProgresion.tsx`
- Create: `src/components/primitives/GrillaProgresion/GrillaProgresion.module.css`

- [ ] **Step 1: Escribir el componente**

Crear `src/components/primitives/GrillaProgresion/GrillaProgresion.tsx`:

```tsx
import { useTranslation } from 'react-i18next';
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { acordeDeGrado, type Armadura } from '../../../utils/progresionAcordes';
import {
  ACENTOS,
  CASILLAS_POR_COMPAS,
  rolDe,
  type Compas,
  type GradoId,
  type Grid,
  type Modo,
} from '../../../utils/progresionArmonica';
import styles from './GrillaProgresion.module.css';

interface Props {
  grid: Grid;
  compas: Compas;
  nCompases: number;
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  /** Casilla que suena ahora, o -1. */
  sonando: number;
  onColocar: (slotIndex: number) => void;
  onVaciar: (slotIndex: number) => void;
  onSoltar: (slotIndex: number, id: GradoId) => void;
}

// La grilla. Cada compás es un grupo con su barra; el último lleva doble barra.
// Los pulsos vacíos que CONTINÚAN un acorde llevan una ligadura que se extiende
// desde él: así la regla de relleno se ve antes de oírse.
export default function GrillaProgresion({
  grid, compas, nCompases, armadura, modo, septimas, sonando, onColocar, onVaciar, onSoltar,
}: Props) {
  const { t } = useTranslation();
  const porCompas = CASILLAS_POR_COMPAS[compas];
  const acentos = ACENTOS[compas];

  // Índice del acorde que está sonando en cada casilla (para dibujar la
  // ligadura de relleno). -1 = silencio.
  const dueño: number[] = [];
  let actual = -1;
  grid.forEach((s, i) => {
    if (s) actual = i;
    dueño[i] = actual;
  });

  return (
    <div className={styles.pentagrama}>
      {Array.from({ length: nCompases }, (_, c) => (
        <div key={c} className={styles.compas} data-ultimo={c === nCompases - 1}>
          <span className={styles.numeroCompas} aria-hidden="true">{c + 1}</span>
          <div className={styles.casillas} data-agrupado={porCompas === 6}>
            {Array.from({ length: porCompas }, (_, p) => {
              const i = c * porCompas + p;
              const slot = grid[i];
              const acorde = slot ? acordeDeGrado(armadura, modo, slot.degree, septimas) : null;
              const continua = !slot && dueño[i] >= 0;
              return (
                <button
                  key={p}
                  type="button"
                  className={styles.casilla}
                  data-role={slot ? rolDe(modo, slot.degree) : undefined}
                  data-acento={acentos.includes(p)}
                  data-continua={continua}
                  data-sonando={sonando === i}
                  aria-label={
                    slot
                      ? t('t4.s41.casilla_llena', { compas: c + 1, pulso: p + 1, grado: slot.degree, acorde: acorde?.cifrado })
                      : t('t4.s41.casilla_vacia', { compas: c + 1, pulso: p + 1 })
                  }
                  onClick={() => onColocar(i)}
                  onContextMenu={(e) => { e.preventDefault(); onVaciar(i); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onSoltar(i, e.dataTransfer.getData('text/plain') as GradoId); }}
                >
                  {slot && acorde ? (
                    <>
                      <RomanGlyph roman={slot.degree} role={acorde.rol} />
                      <span className={styles.cifrado}>{acorde.cifrado}</span>
                    </>
                  ) : (
                    <span className={styles.ligadura} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Escribir el CSS**

Crear `src/components/primitives/GrillaProgresion/GrillaProgresion.module.css`:

```css
.pentagrama {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 16px 0;
}

/* La grilla envuelve POR COMPÁS, nunca a mitad de compás. */
.compas {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
  border-left: 2px solid var(--rule);
}

.compas:last-child { border-right: 2px solid var(--rule); }
.compas[data-ultimo='true'] { box-shadow: 3px 0 0 -1px var(--rule); }

.numeroCompas {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
}

.casillas { display: flex; gap: 2px; }

/* 6/8 se agrupa 3+3: el hueco después de la 3ª corchea hace ver el "dos". */
.casillas[data-agrupado='true'] > .casilla:nth-child(3) { margin-right: 12px; }

.casilla {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 68px;
  height: 60px;
  border: 1px solid var(--rule);
  background: transparent;
  cursor: pointer;
}

.casilla[data-acento='true'] { border-top-width: 2px; border-top-color: var(--muted); }

/* Formato armónico — misma receta que el banco y que GradosArmonicos. */
.casilla[data-role='stable']      { background: color-mix(in srgb, var(--diatonic-stable) 12%, transparent); }
.casilla[data-role='medium']      { background: color-mix(in srgb, var(--diatonic-medium) 12%, transparent); }
.casilla[data-role='mediumTense'] { background: color-mix(in srgb, var(--diatonic-medium-tense) 14%, transparent); }
.casilla[data-role='tense']       { background: color-mix(in srgb, var(--diatonic-tense) 12%, transparent); }

/* Sonando. Calificado con [data-role] para ganarle al tinte por especificidad
   (0,3,0 vs 0,2,0) — el mismo patrón que ProgresionIIVI, ver DESIGN.md §7.
   El ámbar aparece SOLO acá. */
.casilla[data-role][data-sonando='true'],
.casilla[data-sonando='true'] {
  box-shadow: inset 0 0 0 2px var(--amber);
}

.casilla:focus-visible { outline: 2px solid var(--paper); outline-offset: 2px; }

.cifrado {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--muted);
}

/* Ligadura de relleno: la línea que dice "acá sigue sonando el anterior". */
.ligadura { display: block; width: 100%; height: 1px; }
.casilla[data-continua='true'] .ligadura { background: var(--muted); }
```

- [ ] **Step 3: Build limpio y commit**

```bash
npm run build
```

```bash
git add src/components/primitives/GrillaProgresion
git commit -m "feat(t4): primitiva GrillaProgresion con ligadura de relleno"
```

---

## Task 8: Primitiva `TransporteProgresion`

**Files:**
- Create: `src/components/primitives/TransporteProgresion/TransporteProgresion.tsx`
- Create: `src/components/primitives/TransporteProgresion/TransporteProgresion.module.css`

- [ ] **Step 1: Escribir el componente**

Crear `src/components/primitives/TransporteProgresion/TransporteProgresion.tsx`:

```tsx
import { useTranslation } from 'react-i18next';
import { COMPASES, MUNDO_POR_COMPAS, type Compas } from '../../../utils/progresionArmonica';
import { BPM_MAX, BPM_MIN, COMPASES_MAX, COMPASES_MIN } from '../../../stores/useConstructorStore';
import styles from './TransporteProgresion.module.css';

interface Props {
  compas: Compas;
  nCompases: number;
  bpm: number;
  septimas: boolean;
  metronomo: boolean;
  loop: boolean;
  reproduciendo: boolean;
  onCompas: (c: Compas) => void;
  onNCompases: (n: number) => void;
  onBpm: (n: number) => void;
  onSeptimas: () => void;
  onMetronomo: () => void;
  onLoop: () => void;
  onPlay: () => void;
  onStop: () => void;
  onLimpiar: () => void;
}

// Tortuga y conejo: los extremos del slider, como pidió el profesor. SVG lineal
// monocromo — no emoji, no color (PRODUCT.md: sin gamificación, paleta austera).
function Tortuga() {
  return (
    <svg viewBox="0 0 24 16" className={styles.bicho} aria-hidden="true" focusable="false">
      <path d="M4 13h16" />
      <path d="M6 13a6 5 0 0 1 12 0" />
      <path d="M18 9l3-1.5M21 7.5l-1 2" />
      <path d="M5 13v2M9 13v2M15 13v2M19 13v2" />
    </svg>
  );
}

function Conejo() {
  return (
    <svg viewBox="0 0 24 16" className={styles.bicho} aria-hidden="true" focusable="false">
      <path d="M7 14a5 4 0 0 1 10 0" />
      <path d="M15 10c0-2 1-3 2-3M17 7c1 0 2 1 2 2" />
      <path d="M11 5c-1-3 0-4 1-4s1 2 0 4M14 5c0-3 1-4 2-4s1 2 0 4" />
      <path d="M6 14c-2 0-3-1-3-2" />
    </svg>
  );
}

export default function TransporteProgresion(p: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{t('t4.s41.compas_label')}</legend>
        <div className={styles.fila}>
          {COMPASES.map((c) => (
            <button
              key={c}
              type="button"
              className={styles.chip}
              aria-pressed={c === p.compas}
              onClick={() => p.onCompas(c)}
            >
              <span className={styles.cifra}>{c}</span>
              <span className={styles.mundo}>{t(`t4.s41.mundo_${MUNDO_POR_COMPAS[c]}`)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{t('t4.s41.compases_label')}</legend>
        <input
          type="number"
          className={styles.numero}
          min={COMPASES_MIN}
          max={COMPASES_MAX}
          value={p.nCompases}
          onChange={(e) => p.onNCompases(Number(e.target.value))}
        />
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{t('t4.s41.velocidad_label')}</legend>
        <div className={styles.slider}>
          <Tortuga />
          <input
            type="range"
            min={BPM_MIN}
            max={BPM_MAX}
            step={1}
            value={p.bpm}
            aria-label={t('t4.s41.bpm_aria')}
            aria-valuetext={t('t4.s41.bpm_valuetext', { bpm: p.bpm })}
            onChange={(e) => p.onBpm(Number(e.target.value))}
          />
          <Conejo />
          <output className={styles.bpm}>{p.bpm}</output>
        </div>
      </fieldset>

      <div className={styles.acciones}>
        <button
          type="button"
          className={styles.principal}
          onClick={p.reproduciendo ? p.onStop : p.onPlay}
        >
          {p.reproduciendo ? t('common.stop') : t('common.play')}
        </button>
        <button type="button" className={styles.chip} aria-pressed={p.septimas} onClick={p.onSeptimas}>
          {t('t4.s41.septimas')}
        </button>
        <button type="button" className={styles.chip} aria-pressed={p.metronomo} onClick={p.onMetronomo}>
          {t('t4.s41.metronomo')}
        </button>
        <button type="button" className={styles.chip} aria-pressed={p.loop} onClick={p.onLoop}>
          {t('t4.s41.loop')}
        </button>
        <button type="button" className={styles.chip} onClick={p.onLimpiar}>
          {t('common.reset')}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Escribir el CSS**

Crear `src/components/primitives/TransporteProgresion/TransporteProgresion.module.css`:

```css
.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-end;
}

.grupo { border: none; margin: 0; padding: 0; min-width: 0; }

.legend {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0 0 8px;
}

.fila, .acciones { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  padding: 6px 10px;
  background: transparent;
  color: var(--text-body);
  border: 1px solid var(--rule);
  cursor: pointer;
}

.chip[aria-pressed='true'] {
  border-color: var(--paper);
  color: var(--paper);
  background: var(--surface);
}

.chip:focus-visible, .principal:focus-visible, .numero:focus-visible {
  outline: 2px solid var(--paper);
  outline-offset: 2px;
}

.cifra { font-size: 13px; }
.mundo { font-size: 9px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--muted); }

.numero {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  width: 56px;
  padding: 6px 8px;
  background: transparent;
  color: var(--paper);
  border: 1px solid var(--rule);
}

.slider { display: flex; align-items: center; gap: 8px; }
.slider input[type='range'] { width: 160px; accent-color: var(--paper); }

.bicho {
  width: 24px;
  height: 16px;
  fill: none;
  stroke: var(--muted);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.bpm {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: var(--paper);
  min-width: 32px;
  text-align: right;
}

.principal {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 18px;
  background: var(--surface);
  color: var(--paper);
  border: 1px solid var(--paper);
  cursor: pointer;
}
```

- [ ] **Step 3: Build limpio y commit**

```bash
npm run build
```

```bash
git add src/components/primitives/TransporteProgresion
git commit -m "feat(t4): primitiva TransporteProgresion con tortuga y conejo"
```

---

## Task 9: El hook de reproducción

**Files:**
- Create: `src/hooks/useProgressionPlayback.ts`

- [ ] **Step 1: Escribir el hook**

Crear `src/hooks/useProgressionPlayback.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioEngine, stopAllNotes } from './useAudioEngine';
import { getAudioContext } from './audioEngineShared';
import { acordeDeGrado, type Armadura } from '../utils/progresionAcordes';
import {
  ACENTOS,
  CASILLAS_POR_COMPAS,
  casillaEn,
  duracionTotalMs,
  gridToEvents,
  msPorCasilla,
  type Compas,
  type Grid,
  type Modo,
} from '../utils/progresionArmonica';

interface Opciones {
  grid: Grid;
  compas: Compas;
  bpm: number;
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  metronomo: boolean;
  loop: boolean;
}

// El único dueño del reloj. La progresión es corta y acotada (máx. 8 compases ×
// 6 casillas = 48 eventos), así que se agenda entera de una vez: no hace falta
// un scheduler con lookahead.
//
// El corte de un acorde por el siguiente sale GRATIS de la duración: cada voz se
// pide con la duración exacta hasta el acorde que la reemplaza, y se extingue
// sola. No hay que apagar nada.
export function useProgressionPlayback(op: Opciones) {
  const { playNote, playClick } = useAudioEngine();
  const [reproduciendo, setReproduciendo] = useState(false);
  const [sonando, setSonando] = useState(-1);

  const timers = useRef<number[]>([]);
  const raf = useRef<number | null>(null);
  const t0 = useRef(0);

  const cancelar = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const stop = useCallback(() => {
    cancelar();
    stopAllNotes();
    setReproduciendo(false);
    setSonando(-1);
  }, [cancelar]);

  const play = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    cancelar();
    const eventos = gridToEvents(op.grid, op.compas, op.bpm);
    if (eventos.length === 0) return;

    const totalMs = duracionTotalMs(op.grid, op.compas, op.bpm);
    t0.current = ctx.currentTime;
    setReproduciendo(true);

    // Acordes: cada voz con su duración exacta.
    eventos.forEach((ev) => {
      const acorde = acordeDeGrado(op.armadura, op.modo, ev.degree, op.septimas);
      const id = window.setTimeout(() => {
        acorde.notas.forEach((n) => playNote(n.chromatic, n.octave, ev.durMs / 1000));
      }, ev.startMs);
      timers.current.push(id);
    });

    // Metrónomo: acento en el 1, y también en el 4 cuando el compás es 6/8,
    // que es donde el agrupamiento 3+3 se vuelve audible.
    if (op.metronomo) {
      const paso = msPorCasilla(op.compas, op.bpm);
      const porCompas = CASILLAS_POR_COMPAS[op.compas];
      const acentos = ACENTOS[op.compas];
      for (let i = 0; i < op.grid.length; i++) {
        const enCompas = i % porCompas;
        const esAcento = acentos.includes(enCompas);
        const id = window.setTimeout(() => {
          const ctxAhora = getAudioContext();
          if (ctxAhora) playClick(esAcento ? 880 : 660, ctxAhora.currentTime);
        }, i * paso);
        timers.current.push(id);
      }
    }

    // Cabezal visual: lee el reloj de audio, no un setTimeout paralelo. Un solo
    // reloj → cero deriva entre lo que se oye y lo que se ve.
    const tick = () => {
      const ctxAhora = getAudioContext();
      if (!ctxAhora) return;
      const ms = (ctxAhora.currentTime - t0.current) * 1000;
      setSonando(casillaEn(ms, op.compas, op.bpm, op.grid.length));
      if (ms < totalMs) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const fin = window.setTimeout(() => {
      if (op.loop) play();
      else stop();
    }, totalMs);
    timers.current.push(fin);
  }, [op, cancelar, stop, playNote, playClick]);

  // El reloj no se re-negocia en vivo: cualquier cambio de la progresión o del
  // tempo durante la reproducción la detiene. Re-agendar en caliente es una
  // fuente de bugs de sincronía que no compra nada pedagógico.
  useEffect(() => {
    if (reproduciendo) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [op.grid, op.compas, op.bpm, op.armadura, op.modo, op.septimas]);

  useEffect(() => stop, [stop]);

  return { reproduciendo, sonando, play, stop };
}
```

- [ ] **Step 2: Verificar el typecheck**

```bash
npm run build
```

Esperado: exitoso. Si `getAudioContext` devuelve un tipo que no admite `null`, ajustar los `if (!ctx) return;` según la firma real de `src/hooks/audioEngineShared.ts:38`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useProgressionPlayback.ts
git commit -m "feat(t4): hook de reproduccion anclado al reloj de audio"
```

---

## Task 10: La sección, el módulo T4 y el ruteo

**Files:**
- Create: `src/components/modules/t4/T4Module.tsx`, `T4Module.module.css`
- Create: `src/components/modules/t4/components/ConstructorProgresionesSection.tsx`, `.module.css`
- Modify: `src/App.tsx`, `src/components/layout/Sidebar.tsx`, `src/config/tocConfig.ts`
- Modify: `src/i18n/locales/es.json`, `src/i18n/locales/de.json`

- [ ] **Step 1: Escribir la sección**

Crear `src/components/modules/t4/components/ConstructorProgresionesSection.tsx`:

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ArmaduraSelector from '../../../primitives/ArmaduraSelector/ArmaduraSelector';
import BancoGrados from '../../../primitives/BancoGrados/BancoGrados';
import GrillaProgresion from '../../../primitives/GrillaProgresion/GrillaProgresion';
import TransporteProgresion from '../../../primitives/TransporteProgresion/TransporteProgresion';
import { useProgressionPlayback } from '../../../../hooks/useProgressionPlayback';
import { contarHuerfanas, useConstructorStore } from '../../../../stores/useConstructorStore';
import { armaduraPorId } from '../../../../utils/progresionAcordes';
import type { GradoId, Modo } from '../../../../utils/progresionArmonica';
import styles from './ConstructorProgresionesSection.module.css';

// 4.1 · Constructor de progresiones. Sandbox puro: se arma y se oye. No evalúa,
// no puntúa, no guarda (PRODUCT.md). Esta sección solo compone: el estado vive
// en useConstructorStore y el reloj en useProgressionPlayback.
export default function ConstructorProgresionesSection() {
  const { t } = useTranslation();
  const s = useConstructorStore();
  const armadura = armaduraPorId(s.armaduraId);
  const [modoPendiente, setModoPendiente] = useState<Modo | null>(null);

  const { reproduciendo, sonando, play, stop } = useProgressionPlayback({
    grid: s.grid,
    compas: s.compas,
    bpm: s.bpm,
    armadura,
    modo: s.modo,
    septimas: s.septimas,
    metronomo: s.metronomo,
    loop: s.loop,
  });

  // Cambiar de modo reescribe los romanos, así que las casillas cuyo grado no
  // existe en el modo destino se vacían. Se avisa ANTES, no se deshace después.
  const pedirModo = (modo: Modo) => {
    if (modo === s.modo) return;
    const huerfanas = contarHuerfanas(s.grid, modo);
    if (huerfanas === 0) s.setModo(modo);
    else setModoPendiente(modo);
  };

  const soltar = (slotIndex: number, id: GradoId) => {
    s.armarGrado(id);
    s.colocarEn(slotIndex);
  };

  return (
    <section id="s-t4-constructor" className={styles.section}>
      <SectionLabel text={t('t4.s41.label')} />
      <h2>{t('t4.s41.title')}</h2>

      <p className={styles.text}>{t('t4.s41.intro')}</p>

      <ArmaduraSelector
        armaduraId={s.armaduraId}
        modo={s.modo}
        onArmadura={s.setArmadura}
        onModo={pedirModo}
      />

      {modoPendiente && (
        <div className={styles.aviso} role="alertdialog" aria-labelledby="aviso-modo">
          <p id="aviso-modo" className={styles.text}>
            {t('t4.s41.aviso_modo', { n: contarHuerfanas(s.grid, modoPendiente) })}
          </p>
          <div className={styles.avisoAcciones}>
            <button
              type="button"
              onClick={() => { s.setModo(modoPendiente); setModoPendiente(null); }}
            >
              {t('t4.s41.aviso_continuar')}
            </button>
            <button type="button" onClick={() => setModoPendiente(null)}>
              {t('t4.s41.aviso_cancelar')}
            </button>
          </div>
        </div>
      )}

      <BancoGrados
        armadura={armadura}
        modo={s.modo}
        septimas={s.septimas}
        gradoArmado={s.gradoArmado}
        onArmar={s.armarGrado}
      />

      <GrillaProgresion
        grid={s.grid}
        compas={s.compas}
        nCompases={s.nCompases}
        armadura={armadura}
        modo={s.modo}
        septimas={s.septimas}
        sonando={sonando}
        onColocar={s.colocarEn}
        onVaciar={s.vaciarSlot}
        onSoltar={soltar}
      />

      <TransporteProgresion
        compas={s.compas}
        nCompases={s.nCompases}
        bpm={s.bpm}
        septimas={s.septimas}
        metronomo={s.metronomo}
        loop={s.loop}
        reproduciendo={reproduciendo}
        onCompas={s.setCompas}
        onNCompases={s.setNCompases}
        onBpm={s.setBpm}
        onSeptimas={s.toggleSeptimas}
        onMetronomo={s.toggleMetronomo}
        onLoop={s.toggleLoop}
        onPlay={play}
        onStop={stop}
        onLimpiar={s.limpiarGrid}
      />

      <p className={styles.text}>{t('t4.s41.explain')}</p>
    </section>
  );
}
```

- [ ] **Step 2: Escribir el CSS de la sección**

Crear `src/components/modules/t4/components/ConstructorProgresionesSection.module.css`:

```css
.section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 64px 0;
  border-bottom: 1px solid var(--rule);
}

.text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-body);
  max-width: 68ch;
}

.aviso {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--rule);
  background: var(--surface);
  max-width: 68ch;
}

.avisoAcciones { display: flex; gap: 8px; }

.avisoAcciones button {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  padding: 6px 14px;
  background: transparent;
  color: var(--paper);
  border: 1px solid var(--rule);
  cursor: pointer;
}

.avisoAcciones button:hover { border-color: var(--paper); }
.avisoAcciones button:focus-visible { outline: 2px solid var(--paper); outline-offset: 2px; }
```

- [ ] **Step 3: Escribir el módulo**

Crear `src/components/modules/t4/T4Module.tsx`:

```tsx
import ConstructorProgresionesSection from './components/ConstructorProgresionesSection';
import styles from './T4Module.module.css';

export default function T4Module() {
  return (
    <main className={styles.main}>
      <ConstructorProgresionesSection />
    </main>
  );
}
```

Crear `src/components/modules/t4/T4Module.module.css` con el mismo layout de módulo que T1/T2/T3 (idéntico a `T3Module.module.css`, no "mejorarlo"):

```css
.main {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}
```

- [ ] **Step 4: Enganchar ruta, nav y TOC**

En `src/App.tsx`, añadir el import junto a los otros módulos:

```tsx
import T4Module from './components/modules/t4/T4Module'
```

y la ruta después de la de `/t3`:

```tsx
        <Route path="/t4/*" element={<T4Module />} />
```

En `src/components/layout/Sidebar.tsx`, después de la línea 17:

```ts
  { id: 't4', path: '/t4', labelKey: 'nav.t4' },
```

En `src/config/tocConfig.ts`, añadir al final del objeto `TOC_SECTIONS`, después del bloque `'/t3'`:

```ts
  '/t4': [
    { id: 's-t4-constructor', labelKey: 't4.s41.label' },
  ],
```

- [ ] **Step 5: Añadir las claves i18n en español**

En `src/i18n/locales/es.json`, dentro de `"nav"`, añadir:

```json
    "t4": "T4 · Constructor de progresiones"
```

y como grupo nuevo al mismo nivel que `"t3"`:

```json
  "t4": {
    "s41": {
      "label": "4.1 · Constructor de progresiones",
      "title": "Armá tu propia progresión",
      "intro": "Elegí una armadura y decidí si trabajás en su tonalidad mayor o en su relativa menor. Después escogé el compás y cuántos compases querés, y colocá grados sobre los pulsos. Un acorde suena hasta que aparece el siguiente: si dejás un pulso vacío, el acorde anterior lo llena.",
      "explain": "Nada de lo que armes está bien o mal. Tocá play y escuchá: si la progresión no cierra, el oído te lo va a decir antes que cualquier regla.",
      "armadura_label": "Armadura",
      "sostenidos": "Armaduras con sostenidos",
      "bemoles": "Armaduras con bemoles",
      "tonalidad_label": "Tonalidad",
      "tonizaciones": "Tonizar",
      "armar_grado": "Grado {{grado}}, acorde {{acorde}}",
      "casilla_vacia": "Compás {{compas}}, pulso {{pulso}}, vacío",
      "casilla_llena": "Compás {{compas}}, pulso {{pulso}}, grado {{grado}}, acorde {{acorde}}",
      "compas_label": "Compás",
      "compases_label": "Compases",
      "mundo_binario": "binario",
      "mundo_ternario": "ternario",
      "velocidad_label": "Velocidad",
      "bpm_aria": "Velocidad en pulsos por minuto",
      "bpm_valuetext": "{{bpm}} pulsos por minuto",
      "septimas": "Séptimas",
      "metronomo": "Metrónomo",
      "loop": "Repetir",
      "aviso_modo": "Cambiar de modo reescribe los grados. {{n}} acorde(s) de tu progresión no existen en la otra tonalidad y se van a vaciar.",
      "aviso_continuar": "Cambiar igual",
      "aviso_cancelar": "Dejarlo así"
    }
  }
```

- [ ] **Step 6: Añadir las claves i18n en alemán**

En `src/i18n/locales/de.json`, dentro de `"nav"`:

```json
    "t4": "T4 · Akkordfolgen-Baukasten"
```

y el grupo `"t4"`:

```json
  "t4": {
    "s41": {
      "label": "4.1 · Akkordfolgen-Baukasten",
      "title": "Bau deine eigene Akkordfolge",
      "intro": "Wähle eine Vorzeichnung und entscheide, ob du in ihrer Dur-Tonart oder in der parallelen Moll-Tonart arbeitest. Wähle dann die Taktart und die Anzahl der Takte und setze Stufen auf die Schläge. Ein Akkord klingt weiter, bis der nächste kommt: Lässt du einen Schlag frei, füllt ihn der vorherige Akkord.",
      "explain": "Nichts, was du baust, ist richtig oder falsch. Drück auf Play und hör hin: Wenn die Folge nicht schließt, sagt es dir dein Ohr vor jeder Regel.",
      "armadura_label": "Vorzeichnung",
      "sostenidos": "Vorzeichnungen mit Kreuzen",
      "bemoles": "Vorzeichnungen mit Bes",
      "tonalidad_label": "Tonart",
      "tonizaciones": "Tonikalisieren",
      "armar_grado": "Stufe {{grado}}, Akkord {{acorde}}",
      "casilla_vacia": "Takt {{compas}}, Schlag {{pulso}}, leer",
      "casilla_llena": "Takt {{compas}}, Schlag {{pulso}}, Stufe {{grado}}, Akkord {{acorde}}",
      "compas_label": "Taktart",
      "compases_label": "Takte",
      "mundo_binario": "binär",
      "mundo_ternario": "ternär",
      "velocidad_label": "Tempo",
      "bpm_aria": "Tempo in Schlägen pro Minute",
      "bpm_valuetext": "{{bpm}} Schläge pro Minute",
      "septimas": "Septakkorde",
      "metronomo": "Metronom",
      "loop": "Wiederholen",
      "aviso_modo": "Ein Moduswechsel schreibt die Stufen um. {{n}} Akkord(e) deiner Folge gibt es in der anderen Tonart nicht und werden geleert.",
      "aviso_continuar": "Trotzdem wechseln",
      "aviso_cancelar": "So lassen"
    }
  }
```

- [ ] **Step 7: Verificar en el browser**

Arrancar el preview (`preview_start` con la config `dev` de `.claude/launch.json`, puerto 5173) y navegar a `http://localhost:5173/#/t4` — **con hash**, la app usa `HashRouter`. Saltear el `LockScreen` con `localStorage.setItem('site-unlocked','true')` y recargar. Verificar:
1. El sidebar muestra la entrada T4 y el TOC muestra "4.1 · Constructor de progresiones".
2. Se ve el selector de armaduras, el par mayor/menor, el banco de 7 grados, la grilla de 4 compases × 4 casillas y el transporte.
3. Ninguna clave i18n aparece cruda (nada de `t4.s41.label` en pantalla).
4. Consola sin errores ni warnings.

- [ ] **Step 8: Probar el flujo completo**

Con el sonido activado (el mute global arranca en `true`; desactivarlo en el header):
1. Tocar `I` en el banco → el chip queda con `aria-pressed="true"` y borde de tinta.
2. Tocar la casilla 1 → aparece `I` con su cifrado, el chip se desarma.
3. Colocar `ii` en la casilla 5, `V` en la 9, `I` en la 13.
4. Play → se oyen los cuatro acordes, uno por compás, y el borde ámbar recorre las casillas en sincronía con el sonido.
5. Las casillas vacías entre acordes muestran la ligadura.

- [ ] **Step 9: Build limpio y commit**

```bash
npm run build
```

```bash
git add src/components/modules/t4 src/App.tsx src/components/layout/Sidebar.tsx src/config/tocConfig.ts src/i18n/locales
git commit -m "feat(t4): seccion del constructor, modulo T4, ruteo e i18n"
```

---

## Task 11: Verificación de comportamiento y pasada de doctrina

**Files:**
- Modify: `DESIGN.md` (§7 Pending Debts y el registro de olas)
- Modify: `.impeccable/lessons-learned.md` (solo si emergió un patrón de error nuevo)

- [ ] **Step 1: Verificar la aritmética audible de los cuatro compases**

Para cada compás, colocar un acorde en la primera casilla de cada compás, con 2 compases y BPM 60, y cronometrar:

| Compás | Duración esperada de la progresión (2 compases @60) |
|---|---|
| 2/4 | 4 s |
| 3/4 | 6 s |
| 4/4 | 8 s |
| 6/8 | 4 s |

En 6/8 el pulso principal es la negra con puntillo: 2 pulsos por compás × 2 compases = 4 pulsos = 4 s a 60 BPM.

- [ ] **Step 2: Verificar los extremos de BPM**

Play a 40 y a 200 con la grilla llena. Esperado: el cabezal ámbar sigue pegado al audio en los dos extremos, sin adelantarse ni atrasarse al final de la progresión.

- [ ] **Step 3: Verificar que el reloj no se re-negocia**

Con la progresión sonando, mover el slider de BPM. Esperado: la reproducción se detiene, el ámbar desaparece, el botón vuelve a decir "Tocar".

- [ ] **Step 4: Verificar el cambio de tonalidad**

1. Armar `ii–V–I` en A mayor (armadura 3♯). Anotar los cifrados: Bm, E, A.
2. Cambiar la armadura a 0♯. Esperado: los romanos `ii V I` **no cambian**; los cifrados pasan a Dm, G, C.
3. Cambiar a modo menor. Esperado: aparece el aviso diciendo que 3 acordes no existen en la otra tonalidad; "Dejarlo así" no cambia nada, "Cambiar igual" vacía esas casillas y el banco muestra `i ii° ♭III iv v ♭VI ♭VII`.

- [ ] **Step 5: Verificar accesibilidad**

1. Con Tab, recorrer armaduras → tonalidad → banco → grilla → transporte. Todo focusable, foco siempre visible.
2. Colocar un acorde usando solo teclado (Tab hasta el grado, Enter, Tab hasta la casilla, Enter).
3. Inspeccionar una casilla ocupada: su `aria-label` dice compás, pulso, grado y cifrado.
4. Activar `prefers-reduced-motion` en el dev tools y verificar que ninguna transición se dispara.
5. Con el audio muteado, la progresión sigue siendo legible completa.

- [ ] **Step 6: Verificar el tema claro**

Cambiar a tema claro. Verificar que los cuatro tintes diatónicos y el borde ámbar de "sonando" siguen legibles sobre el crema `#f5f0e8`. Si algún tinte al 12% desaparece, subirlo **solo en `[data-theme="light"]`** y anotarlo en `DESIGN.md`.

- [ ] **Step 7: Correr la anti-checklist y las verificaciones**

```bash
npm run verify:constructor
```

```bash
npm run verify:acordes
```

```bash
npm run build
```

Los tres en verde. Pasar la anti-checklist de 14 items de `.impeccable/lessons-learned.md`.

- [ ] **Step 8: Actualizar `DESIGN.md`**

En `DESIGN.md §7`:
1. Añadir la entrada de la ola nueva describiendo: el constructor de progresiones, la extracción de `RomanGlyph` a shared, el sub-sistema diatónico aplicado a casillas y chips con la receta del 12%, y el ámbar calificado con `[data-role]` en la grilla.
2. Registrar como **deuda pendiente** la interfaz abierta §4.5 del spec: si el banco en modo menor debe incluir `V7`, `vii°7` y `♭III+` de la menor armónica, y qué rol de color le toca al aumentado (no tiene precedente en el sistema).
3. Actualizar la línea "Última actualización".

- [ ] **Step 9: Commit final**

```bash
git add DESIGN.md .impeccable
git commit -m "docs: DESIGN.md tras la ola del constructor de progresiones"
```

---

## Notas de ejecución

**Orden.** Las tasks 1→2→3 son prerrequisitos duros. Las 5, 6, 7 y 8 (primitivas) son independientes entre sí y pueden repartirse en paralelo si se usa subagent-driven-development; las 9, 10 y 11 son secuenciales al final.

**Servidor de desarrollo.** Usar la herramienta de preview del harness (`preview_start` con `.claude/launch.json`), nunca `npm run dev` en background con Bash.

**Lo que este plan NO construye,** por decisión del spec §11: persistencia, export de audio/MIDI, digitaciones en el mástil, validación o puntaje, inversiones, compases mixtos, y el contenido teórico de escala menor (spec hermano, aún sin escribir).
