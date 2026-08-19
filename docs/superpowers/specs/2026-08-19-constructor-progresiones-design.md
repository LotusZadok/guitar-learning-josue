# Diseño — Constructor de progresiones (T4)

> Estado: aprobado en brainstorming del 2026-08-19. Origen: sesión con el Prof. Josué Barquero (pizarra + notas).
> Alcance: **solo el constructor**. La escala menor (natural, armónica, dim7 completo, aumentado) es un spec hermano.

## 1. Qué es

El constructor de progresiones es la herramienta final de la parte teórica: el estudiante elige una tonalidad, un compás y un número de compases, coloca grados (y tonizaciones) sobre los pulsos, y lo escucha. El profesor lo llama "el magnus opus" de la sección — el lugar donde se pone a prueba si realmente se entendió la armonía diatónica.

Vive en el **módulo T4**, junto con la escala menor.

## 2. Decisiones tomadas

| Decisión | Resolución | Por qué |
|---|---|---|
| ¿Evalúa? | **No.** Sandbox puro: se arma y se oye. Sin correcto/incorrecto, sin puntaje, sin retos. | PRODUCT.md: sin gamificación, sin seguimiento de progreso. La "prueba" es que el estudiante oiga que su progresión no cierra. |
| Casillas de 6/8 | **6, agrupadas 3+3**, con acento visual y audible en 1 y 4. | Un solo modelo de grilla (casillas = numerador). El carácter compuesto se comunica visualmente, no con un segundo motor. |
| BPM | Se refiere al **pulso principal**: negra en 2/4, 3/4, 4/4; negra con puntillo en 6/8. | "Tortuga → conejo" significa lo mismo en el mundo binario y en el ternario. |
| Colocación | **Tap-tap**: tocar el grado (queda armado) → tocar la casilla. Drag & drop encima, nunca como única vía. | WCAG AA (PRODUCT.md): teclado, lector de pantalla, táctil, y proyección en clase. |
| Calidad de acorde | **Tríadas por defecto**, toggle global a séptimas. Las tonizaciones suenan siempre como `V7/x`. | Un solo control cubre los dos mundos. `V7/x` es como se enseñaron en §3.8. |
| Tonalidad | **Selector de armadura propio** del constructor (estado local), no la tónica global del header. | Literal al escenario 1 del profe (armadura → par mayor/relativa menor). Evita que tocar el header desde otra sección reescriba una progresión armada. |
| Audio | **Bloque con voces sostenidas**: las notas entran juntas y se sostienen hasta que otro acorde las corta. | Es la regla de relleno/corte del profe hecha audible. Sin patrón rítmico inventado que compita con la lección. |
| Persistencia | **Ninguna.** Ni localStorage ni URL. | PRODUCT.md es explícito: no hay seguimiento. `useUIStore` solo persiste el tema. |

## 3. Arquitectura

Descomposición en cuatro capas, siguiendo el patrón del repo (primitivas tontas + hook de audio):

```
T4Module / ConstructorProgresionesSection   <- solo compone
  |- useConstructorStore    (zustand)       <- estado puro, sin audio
  |- useProgressionPlayback (hook)          <- único dueño del reloj
  \- primitives/
       |- ArmaduraSelector
       |- BancoGrados          (con tonizaciones desplegables)
       |- GrillaProgresion
       \- TransporteProgresion
```

**`useConstructorStore`** — armadura, modo (mayor/menor), compás, nº de compases, BPM, toggles (séptimas, metrónomo, loop), y la grilla. Sin efectos, sin audio. Espejo estructural de `useUIStore`, **sin `persist`**.

**`useProgressionPlayback`** — recibe grilla + compás + BPM, produce los eventos y los agenda. Es el único archivo que toca el tiempo.

**Primitivas** — tontas: reciben datos y callbacks, no leen el store directamente.

Rechazado: (A) sección monolítica de 600+ líneas mezclando estado musical, UI y reloj — contra CLAUDE.md §3. (C) motor de secuenciación genérico reusable — abstracción especulativa para un solo consumidor, YAGNI.

## 4. Modelo de datos

### 4.1 Compases

Se conserva el vocabulario del profesor (**binario / ternario**, no "simple / compuesto"):

| Compás | Mundo | Casillas |
|---|---|---|
| 2/4 | binario | 2 |
| 4/4 | binario | 4 |
| 3/4 | ternario | 3 |
| 6/8 | ternario | 6 (3+3) |

```ts
type Compas = '2/4' | '3/4' | '4/4' | '6/8';
const CASILLAS: Record<Compas, number> = { '2/4': 2, '3/4': 3, '4/4': 4, '6/8': 6 };
const MUNDO:    Record<Compas, 'binario' | 'ternario'> = {
  '2/4': 'binario', '4/4': 'binario', '3/4': 'ternario', '6/8': 'ternario',
};
```

`nCompases`: 1–8, default 4. Todos los compases de una progresión comparten el mismo compás (no hay compases mixtos).

### 4.2 Grilla

Array plano de largo `nCompases × CASILLAS[compas]`:

```ts
type Slot = { degree: DegreeId } | null;
type Grid = Slot[];
```

`DegreeId` = un grado diatónico del modo activo (`'I' | 'ii' | ... | 'vii°'`, o `'i' | 'ii°' | '♭III' | ...`) o una tonización (`'V/ii'`, `'ii/vi'`, …).

### 4.3 Regla de relleno y corte

Literal a lo que dictó el profesor: **un acorde suena desde su casilla hasta la siguiente casilla ocupada, o hasta el final de la grilla.** Una casilla vacía antes del primer acorde es silencio.

Toda la aritmética vive en una función pura:

```ts
gridToEvents(grid, compas, bpm) -> { degree: DegreeId; startMs: number; durMs: number }[]
```

Duración de casilla: `msPorPulso = 60000 / bpm` para 2/4, 3/4 y 4/4 (el pulso es la negra = la casilla). Para 6/8 el pulso principal es la negra con puntillo, que contiene 3 casillas: `msPorCasilla = (60000 / bpm) / 3`.

### 4.4 Banco de grados

Los siete grados diatónicos del modo activo, reusando `ROMANS` / `ROMANS_MINOR` / `QUALITIES` / `SEVENTH_QUALITIES` / `QUALITIES_MINOR` / `SEVENTH_QUALITIES_MINOR` ya definidos en `GradosArmonicos.tsx`.

Cada grado **tonizable** despliega sus dos tonizaciones, `V/x` y `ii/x` — el gesto de la pizarra. Tonizable = grado cuyo acorde es mayor o menor. Quedan fuera:

- el **I** (su `V/I` es el V, ya está en el banco),
- los **disminuidos**: `vii°` en mayor, `ii°` en menor.

Destinos tonizables en mayor: `ii, iii, IV, V, vi`. En menor: `♭III, iv, v, ♭VI, ♭VII`.

### 4.5 Interfaz abierta — escala menor

El constructor consume una **lista de grados**; añadir entradas después no le cambia la arquitectura. Queda **pendiente de resolver en el spec de escala menor**, no aquí:

- ¿El banco en modo menor incluye chips de la **menor armónica** (`V7` prestado, `vii°7` dim7 completo, `♭III+` aumentado)?
- Si sí, ¿qué rol de color les corresponde? (`V7` y `vii°7` son claramente `tense`; el aumentado no tiene precedente en el sistema.)

Marcado 🟡 al estilo de los source-of-truth: pendiente de revisión del profesor.

## 5. Color — el "formato" que hay que guardar

El profesor pidió explícitamente conservar el formato de color de los grados, aquí y **en cualquier ocasión donde se hablen de grados**. Ya está registrado en `DESIGN.md §7` (2026-08-19): *"guardar el formato armónico para no olvidar cuáles son tensos (color)"*.

**No se crean tokens nuevos.** Se reusa la receta exacta de `GradosArmonicos` / `ProgresionIIVI`:

| Elemento | Tratamiento |
|---|---|
| Casilla ocupada / botón del banco | `background: color-mix(in srgb, var(--diatonic-{role}) 12%, transparent)` + romano en el token pleno |
| Rol de los 7 grados | `HARMONIC_ROLE` existente (`stable`, `medium`, `mediumTense` para el IV, `tense`) |
| Tonización `V/x` | rol `tense` — es un dominante |
| Tonización `ii/x` | rol `medium` |
| Casilla **sonando** | ámbar `box-shadow: inset 0 0 0 2px`, selector `.casilla[data-role].sonando` (0,3,0) para ganarle al tinte de rol |

Reglas heredadas que este componente respeta:

- **The Amber-Means-Sounding Rule**: el ámbar aparece **solo** en el estado "sonando". Ningún acento ámbar decorativo.
- **Note-Color Quarantine** en ambas direcciones: los 12 hues `--note-X` no entran a la grilla (habla de grados, no de notas), y los tokens diatónicos no decoran chrome que no sea un grado.
- Señal no cromática redundante: `RomanGlyph` ya discrimina mayor/menor/disminuido tipográficamente.

## 6. Anatomía visual

Cuatro bloques verticales:

1. **Selector de armadura** — banco de armaduras (0♯–7♯, 1♭–7♭). Al elegir una se despliega el par mayor / relativa menor (A / F♯m) y hay que elegir cuál. Escenario 1 del profesor, literal.
2. **Banco de grados** — los 7 grados del modo activo; cada tonizable expande sus `V/x` y `ii/x`. Toggle tríadas/séptimas.
3. **Grilla** — pentagrama horizontal con barras de compás y doble barra final. En pantalla angosta envuelve **por compás**, nunca a mitad de compás. Los pulsos vacíos que continúan un acorde se dibujan como una **ligadura que se extiende desde el acorde**, no como celdas idénticas: así la regla de relleno se ve antes de oírse.
4. **Transporte** — play/stop, slider de BPM 40–200 (default 90) con lectura numérica en Plex Mono, y los toggles de metrónomo y loop.

**Tortuga y conejo.** Los extremos del slider llevan los glifos que pidió el profesor, como **SVG lineales monocromos** — no emoji, no color. Mantienen su gesto (legible para un adolescente, instantáneo proyectado) sin romper la austeridad editorial de la marca.

## 7. Reproducción

`useProgressionPlayback` es el único dueño del tiempo.

**Al darle play:**

1. Ancla `t0 = ctx.currentTime` y computa la lista completa de eventos con `gridToEvents`. La progresión es corta y acotada (máx. 8 compases × 6 casillas), así que se agenda entera de una vez — no hace falta un scheduler con lookahead.
2. Cada evento dispara las notas del acorde en bloque con `playNote(nota, octava, durMs / 1000)`, con la duración exacta hasta el siguiente acorde. **El corte sale gratis de la duración**: no hay que apagar nada, la voz se extingue justo cuando entra la siguiente. Es el traslape deliberado que `useAudioEngine.ts` ya documenta para acordes ("Acordes/arpegios NO usan `playSequence`: ahí el traslape es deliberado").
3. El cabezal visual corre por `requestAnimationFrame` leyendo `ctx.currentTime - t0`. **Un solo reloj**, sin deriva entre lo que se oye y lo que se ve.
4. Stop llama `stopAllNotes()` y cancela los eventos pendientes.

**El reloj no se re-negocia en vivo.** Cambiar BPM, compás, nº de compases o cualquier casilla durante la reproducción **la detiene**. Es una línea de código; re-agendar en caliente es una fuente de bugs de sincronía que no compra nada pedagógico.

**Metrónomo** (toggle, apagado por defecto): reusa `playClick` con acento en el 1 — y en el 4 cuando el compás es 6/8, que es donde el agrupamiento 3+3 se vuelve audible.

**Loop** (toggle, apagado por defecto): una progresión se entiende oyéndola dar la vuelta, pero encenderlo por defecto convierte la sección en ruido de fondo cuando el profe la proyecta.

## 8. Cambiar de tonalidad

**Cambiar de armadura no borra la grilla.** Los grados son independientes de la tonalidad — ese es medio punto de la lección. De A a E, `ii–V–I` queda intacto y solo cambia lo que suena.

**Cambiar de modo (mayor ↔ menor) sí reescribe los romanos** (`I ii iii` → `i ii° ♭III`). Las casillas cuyo grado no existe en el nuevo modo se vacían, **con aviso explícito antes de hacerlo** (confirmación, no deshacer).

## 9. Accesibilidad

- Cada grado del banco es un `<button>` real con `aria-pressed` para el estado "armado".
- Cada casilla es un `<button>` con `aria-label` que dice compás, pulso y contenido: *"compás 2, pulso 3, vacío"* / *"compás 2, pulso 3, V sobre ii"*.
- El drag & drop se implementa **encima** del tap-tap, nunca en lugar de él.
- El cabezal de reproducción no es la única señal de estado: la casilla que suena también lleva el borde ámbar.
- `prefers-reduced-motion`: el cabezal salta de casilla en casilla en vez de deslizarse.
- Audio no obligatorio: la progresión se lee completa sin sonido (romanos, cifrados, ligaduras de relleno).

## 10. Verificación

La lógica pura sale de los componentes a `src/utils/` y se prueba con scripts `.mjs` **antes** de tocar UI — el precedente documentado en `DESIGN.md §7` que ya cazó un bug de octavas.

**Lógica pura:**

- `gridToEvents` — relleno, corte, casilla vacía inicial, último acorde extendido hasta el final, los cuatro compases.
- `degreesFor(mode)` y `tonizacionesFor(degree, mode)` — verificados contra las tablas de `GradosArmonicos` y contra §3.8.
- Aritmética de BPM: un compás de 3/4 a 90 dura 2000 ms; en 6/8 a 90 cada casilla dura 222 ms y el compás 1333 ms.

**En browser:**

- Play a 40 y a 200.
- Cambio de armadura con la grilla llena (los grados sobreviven, el sonido cambia).
- Mayor ↔ menor con casillas huérfanas (aparece el aviso).
- Consola limpia, `npm run build` y typecheck en verde.
- Anti-checklist de 14 items de `.impeccable/lessons-learned.md` antes del commit.

## 11. Fuera de alcance (YAGNI explícito)

No guarda ni comparte progresiones · no exporta audio ni MIDI · no muestra digitaciones en el mástil · no valida ni califica · no tiene inversiones ni bajos alternos · no permite compases mixtos dentro de una progresión · no implementa el contenido de escala menor (spec hermano).

## 12. Dependencias

- **Spec de escala menor** (hermano, aún no escrito): resuelve §4.5. El constructor se puede construir y usar en modo mayor sin él; el modo menor funciona con los 7 grados naturales de la relativa, que `GradosArmonicos` ya computa (`relativeMinor`, `relativeMinorScaleSpelled`).
- **Existente y reusado**: `useAudioEngine` (`playNote`, `playClick`), `stopAllNotes`, `majorScaleSpelled` / `relativeMinorScaleSpelled` / `chordSpelled`, `RomanGlyph`, tokens `--diatonic-*`, `tonal`.
