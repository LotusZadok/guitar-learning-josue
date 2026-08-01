# Cambios del profesor — T1 §1.6/§1.7/§1.8 + T2 §2.6

**Origen:** feedback del Prof. Josué (2026-07-31), con captura de pantalla de §1.7 en tónica D.
**Fecha:** 2026-07-31
**Scope:** T1 §1.6, §1.7, §1.8; T2 §2.6; primitiva compartida `AcordesBuilder` (afecta también T3 §3.1.2, §3.2, §3.3, §3.4).

## Mapeo del feedback al código

| Pedido del profesor | Sección | Archivo principal |
|---|---|---|
| La tabla de tríadas podría comenzar en la tónica global | §1.6 | `modules/t1/components/TriadasSection.tsx` |
| Podrían estar los 3 tipos de acorde | §1.7 | `modules/t1/components/AcordesSection.tsx` |
| Mezclar los pasos con el árbol, explicado por pasos como 2.3–2.4 | §1.7 | `AcordesSection.tsx` + `primitives/AcordesBuilder/` |
| La nomenclatura debería alinearse a la tónica global | §1.7 | `i18n/locales/{es,de}.json` |
| Llamarlo "Círculo de 5tas" | §1.8 | `i18n/locales/{es,de}.json` |
| En los árboles, saber qué nota es la que oímos en el arpegio | §1.7 + T3 | `primitives/AcordesBuilder/AcordesBuilder.tsx` |
| Eliminar el botón de las 7mas | §2.6 | `primitives/GradosArmonicos/GradosArmonicos.tsx` |
| Que también se escuche la fila de los grados (I ii iii …) | §2.6 | `primitives/GradosArmonicos/GradosArmonicos.tsx` |

## Decisiones fijadas (respuestas del profesor)

1. **"Los 3 tipos de acorde en esta tabla"** = el bloque de resultado de la captura (hoy dos líneas: `D mayor = D F♯ A` / `D menor = D F A`). Se agrega la tercera. **No** es una tabla nueva ni un cambio a la tabla de §1.6.
2. **El stepper de §1.7 construye siempre la tríada mayor.** Menor y disminuido aparecen solo en el bloque de resultado, sin animación propia.
3. **El paso "04 Séptimas" se retira solo en T2.** T3 §3.5 y §3.9 existen para enseñar séptimas y arrancan justo en ese paso: conservan los 4 pasos.
4. **En §1.6 se re-ancla solo la tabla.** El párrafo de la tríada maestra y el ejemplo del procedimiento quedan en F. Consecuencia aceptada, documentada abajo como deuda.
5. **El `<h2>` de §1.8 también pasa a "Círculo de 5tas"**, no solo el label del sidebar.

---

## A · §1.6 — La tabla de tríadas arranca en la tónica global

**Estado actual:** `TriadasSection.tsx:14-15` define las 7 columnas como constantes hardcodeadas desde F:

```ts
const TRIADAS_TABLA_HEAD = ['F', 'G', 'A', 'B', 'C', 'D', 'E'];
const TRIADAS_TABLA_ROW  = ['F A C', 'G B D', ...];
```

**Cambio:** derivar ambas filas rotando `NATURALS` (de `data/notes.ts`) desde la letra de la tónica activa. Cada tríada es `letra[i]`, `letra[i+2]`, `letra[i+4]` sobre el ciclo de 7 naturales.

**Solo la letra, sin alteraciones.** §1.6 es la etapa pedagógica de notas naturales; las alteraciones llegan en §1.7/§2.6. Con tónica `F♯` la tabla arranca en `F`. Este es exactamente el precedente que ya sigue `TriadaProceso.tsx:53` (`const root = tonic[0] as NaturalNote`), con su comentario explicando por qué.

**Verificación:** con tónica C la tabla debe leer `C D E F G A B` / `C E G`, `D F A`, …; con tónica F debe quedar idéntica a la actual (regresión cero sobre el estado por defecto si la tónica es F).

### Deuda que este cambio abre

El párrafo de la tríada maestra (`t1.s02.master_triad` en los locales) enumera `F A C E G B D F` como `ProseSegment` fijo, y el ejemplo del procedimiento (`t1.s02.example`, hoy sin consumidor) también está en F. Con la tabla rotada, el párrafo queda anclado en otra nota que la tabla que lo precede.

Es una decisión explícita del profesor, no un descuido. Se registra en `DESIGN.md §7` para que una auditoría futura no la "corrija" sin consultarlo.

---

## B · §1.7 — Tercera línea de resultado (los 3 tipos de acorde)

**Estado actual:** `AcordesSection.tsx:175-182` renderiza dos párrafos, mayor y menor, derivados de `chordSpelled(tonic, 'M')` y `chordSpelled(tonic, 'm')`.

**Cambio:** agregar `chordSpelled(tonic, 'dim')` como tercera línea. La función ya soporta `'dim'` (`noteCalculations.ts:146,151`: quinta a 6 semitonos, rol `5dim`) — no hace falta matemática nueva.

En D: `D disminuido = D F A♭`.

**Jerarquía visual:** el mayor conserva el tratamiento destacado actual (`styles.resultado`, el recuadro de la captura) porque es el acorde que construye el stepper. Menor y disminuido comparten el tratamiento secundario que hoy tiene el menor.

---

## C · §1.7 — Nomenclatura anclada a la tónica global

**Estado actual (`es.json`):**

```json
"notation_major": "Acorde mayor: solo la letra. F = Fa mayor.",
"notation_minor": "Acorde menor: letra + \"m\" minúscula. Fm = Fa menor.",
"notation_diminished": "Acorde disminuido: letra + \"dim\". Fdim = Fa disminuido."
```

La F está congelada aunque la tónica global sea otra.

**Cambio:** interpolación i18n con dos variables — `{{sym}}` (grafía de la tónica: `D`, `B♭`) y `{{name}}` (nombre en el idioma activo: `Re` en ES, `D` en DE). El componente las alimenta desde `chordSpelled(tonic, …)[0].spelled` y el mapa de solfeo que ya usa `AcordesBuilder` (`spelledES`).

```json
"notation_major": "Acorde mayor: solo la letra. {{sym}} = {{name}} mayor."
```

Toca `es.json` y `de.json`. El alemán no usa solfeo (`NOTE_DE` mapea a letras, con `B → H`), así que `{{name}}` resuelve a la letra alemana.

**Caso borde:** el sufijo `dim` va pegado a la grafía (`B♭dim`). Con grafías de dos caracteres se lee correcto; no requiere tratamiento especial.

---

## D · §1.7 — Stepper animado sobre el árbol

Es el cambio más grande. El profesor pidió que el ejemplo por pasos deje de ser una lista muerta y se explique como §2.3/§2.4.

### Estado actual

`AcordesSection.tsx:118-132` construye tres `ProseSegment` (`buildPasoLetras`, dos `buildPasoSemitonos`) y los vuelca en un `<ol>` estático. Debajo, separado por un `<h3>`, vive el `AcordesBuilder` interactivo. El estudiante no tiene forma de ver que los pasos y el árbol son lo mismo.

### Diseño

Una primitiva nueva, `AcordeProceso`, que reemplaza el `<ol>` y **maneja el árbol existente** — no dibuja uno propio.

**Máquina de pasos:** `useProcessAnimation(4)`, el hook que ya usan `ProcesoView` (§2.3/§2.4) y `TriadaProceso` (§1.6). Ya resuelve `prefers-reduced-motion` en JS (salta al estado final) y expone `play/pause/next/prev/reset/setSpeed`.

**Los 4 pasos** (siempre tríada mayor):

| Paso | Contenido | Nodo del árbol | Audio |
|---|---|---|---|
| 1 | Letras de la tríada (`buildPasoLetras`) | `T` | tónica |
| 2 | Semitonos hasta la 3M (`buildPasoSemitonos(…, 4, …)`) | `3M` | tercera mayor |
| 3 | Semitonos hasta la 5J (`buildPasoSemitonos(…, 7, …)`) | `5` | quinta justa |
| 4 | Resultado: el acorde mayor completo | los tres | acorde en bloque |

El texto de cada paso sale de las funciones que ya existen en `AcordesSection.tsx`. **No se reescribe contenido pedagógico**; solo cambia de contenedor. Las funciones se mueven a la primitiva junto con su lógica.

**Acoplamiento audio ↔ visual:** el audio se dispara desde un `useEffect` atado a `anim.currentStep`, con guarda `lastAudioStep` contra re-disparos — el patrón exacto de `TriadaProceso.tsx:120-130`, incluida la técnica de refs (`takenAscRef`, `playNoteRef`) que evita que un cambio de tónica re-dispare el efecto con un step viejo. Nunca hay audio sin estado visual paralelo (anti-checklist item 12).

**Reset al cambiar la tónica:** `anim.reset()` + `stopAllNotes()`, como `TriadaProceso.tsx:111-115`.

**Controles:** `◀ ▶ ▶▶` + selector de velocidad normal/lento, reutilizando el patrón visual de §1.6.

### Un solo árbol, controlado

`AcordesBuilder` gana dos props opcionales:

```ts
interface Props {
  config?: BuilderConfig;
  /** Camino forzado desde afuera (walkthrough). Si está presente, el árbol es controlado. */
  path?: string[];
  /** Rol del nodo que suena ahora mismo; null = ninguno. */
  playingRole?: string | null;
}
```

Cuando `path` está presente, el árbol pinta ese camino en lugar del estado interno `selected`. Al hacer clic en cualquier nodo, la sección suelta el control (`path` vuelve a `undefined`) y el árbol retoma la construcción libre — el estudiante puede intervenir en cualquier momento sin pelear con la animación.

**Por qué un árbol y no dos:** duplicar la figura en la misma pantalla (una para el walkthrough, otra para explorar) contradice el registro sereno de `PRODUCT.md` y obliga al estudiante a mapear dos diagramas idénticos. El costo es que `AcordesBuilder` deja de ser 100% self-contained; se acota con props opcionales y default `undefined`, de modo que los 4 consumidores de T3 no cambian de comportamiento.

**Layout:** panel de pasos y árbol lado a lado (patrón `TriadaProceso.styles.layout`), colapsando a columna en pantallas angostas. Los `<h3>` intermedios que hoy separan "ejemplo" de "constructor" desaparecen: es una sola explicación.

---

## E · §1.8 — "Círculo de 5tas"

**Estado actual:**
- `t1.s08.label`: `1.8 · La regla de la 5J el "intervalo espejo"`
- `t1.s08.title` (el `<h2>`): `Regla de la quinta justa con sus excepciones`

**Cambio:** ambas claves pasan a `Círculo de 5tas` (label conservando el prefijo `1.8 · `). En DE, `Quintenzirkel`.

El label alimenta a la vez el `SectionLabel` de la sección y la entrada del sidebar vía `tocConfig.ts:14` (`labelKey: 't1.s08.label'`), así que un solo cambio cubre ambas superficies.

**Se cambia también el `<h2>`** (decisión del profesor): si el sidebar dice una cosa y el encabezado otra, la navegación se lee rota. El contenido sobre la regla de la 5J no se toca — sobrevive como los bullets + excepciones que ya están dentro de la sección, ahora encuadrados bajo el nombre por el que el profesor la llama en clase.

**Separador:** `·` (U+00B7), no em dash — anti-checklist item 6, y el grep de `.json` es donde estos se esconden.

---

## F · Árboles — cuál nota estoy oyendo

### El problema real

`AcordesBuilder.tsx:312` marca como `colored` cualquier nodo que esté en hover, seleccionado, o sonando. Durante el arpegio **todos los nodos de la cadena ya están seleccionados**, o sea todos saturados. La única diferencia del nodo que suena es un anillo ámbar de 2px (líneas 340-342). En proyección de clase eso no se ve.

Además, `nodePlaying` (línea 148-149) devuelve `true` para **todos** los nodos cuando `playIdx === -1` (modo bloque), lo cual es correcto ahí — un acorde en bloque suena entero — pero significa que la señal debe distinguir "todos suenan" de "este suena".

### Diseño

Bajo la Note-Color Quarantine no puedo introducir un color nuevo para "está sonando". La doctrina (`lessons-learned.md`, lección de los tres ejes no-color) sanciona tres dimensiones; uso las tres a la vez, que es lo que la misma lección exige cuando una sola no alcanza:

1. **Opacity** — durante el arpegio, los nodos de la cadena que *no* suenan bajan de opacidad. El contraste es contra sus propios hermanos, que es donde la lectura ocurre.
2. **Anillo + escala** — el nodo que suena engorda el anillo ámbar y crece levemente (`transform: scale`, propiedad de compositor: cumple anti-checklist item 10, nada de animar `r` ni layout).
3. **Texto** — el `readout`, que ya es `role="status" aria-live="polite"` (línea 235), nombra la nota que está sonando durante el arpegio. Cierra el item 12 de la anti-checklist (audio nunca es el único portador) y de paso sirve a lectores de pantalla.

En modo **bloque** (`playIdx === -1`) no se atenúa nada: suenan todos, se ven todos.

Con `prefers-reduced-motion` cae la escala; opacity y anillo se mantienen (el override global de `global.css` neutraliza la duración de la transición, y no hay máquina de estado JS nueva que necesite `matchMedia` — el arpegio ya existe y es audio, no motion).

**Alcance:** un solo cambio en la primitiva cubre §1.7, §3.1.2, §3.2, §3.3 y §3.4.

---

## G · §2.6 — Sin séptimas, con grados audibles

### G1 · Retirar el paso 04

`GradosArmonicos` gana `maxStep?: 3 | 4` con default `4`. El stepper (líneas 210-223) renderiza `[1..maxStep]` en lugar de `[1,2,3,4]` fijo.

`GradosArmonicosSection` (T2) pasa `maxStep={3}`: quedan `01 Letras solas · 02 Con armadura · 03 Calidades`. §3.5 (`initialStep={4}`) y §3.9 (`initialStep={4} relativeMinor`) no pasan la prop y conservan los 4 pasos.

**Guarda:** `initialStep` no puede exceder `maxStep`. Las combinaciones vivas hoy no lo violan (T2 usa `initialStep` default 1 con `maxStep` 3; T3 usa `initialStep` 4 con `maxStep` default 4), pero el clamp evita que un consumidor futuro renderice un estado sin pestaña que lo represente.

**Consecuencia:** con `maxStep={3}` la fila de séptimas y la columna de acordes con 7ª nunca se muestran en T2. La lógica de `SEVENTH_QUALITIES` sigue en la primitiva intacta para T3.

### G2 · La fila de grados suena

**Estado actual:** la fila `Grado` (líneas 243-250) renderiza `<td className={styles.gradoCell}>` estáticos. La fila `Acorde` de abajo sí es interactiva vía `ChordCell` (líneas 383-414), con `onClick` + `onFocus` + `onKeyDown`, debounce compartido de 150ms, y estados `isPlaying` / `isDimmed`.

**Cambio:** la celda de grado dispara el mismo `playTriad(i)` con el mismo comportamiento. Ambas filas comparten el chrome de interacción en lugar de duplicar `ChordCell`: se extrae el envoltorio (`role="button"`, `tabIndex`, `aria-label`, `onKeyDown`, estados playing/dimmed) y cada fila provee su propio contenido — `RomanGlyph` arriba, `chordSymbol` abajo.

**Por qué el debounce importa acá:** `lastFireRef` (líneas 121, 134-136) ya es compartido a nivel del componente, así que un usuario tabulando de la celda de grado a la celda de acorde de la misma columna no dispara el acorde dos veces con solapamiento. Es el patrón "debounce compartido por shared ref para multi-trigger" que la doctrina ya documenta.

**Highlight cruzado:** al sonar la columna *i*, tanto el grado como el acorde de esa columna se marcan como activos, y las demás columnas se atenúan. Esto refuerza visualmente que `V` y `G` son la misma cosa nombrada de dos maneras — que es el punto pedagógico de la sección.

**A11y:** `aria-label` propio para la celda de grado (`Reproducir acorde del grado V` / `Akkord der Stufe V spielen`), no el mismo del cifrado.

---

## Archivos tocados

**Código:**
- `src/components/modules/t1/components/TriadasSection.tsx` — A
- `src/components/modules/t1/components/AcordesSection.tsx` + `.module.css` — B, C, D
- `src/components/primitives/AcordeProceso/` (nuevo: `.tsx` + `.module.css`) — D
- `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx` + `.module.css` — D, F
- `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx` + `.module.css` — G
- `src/components/modules/t2/components/GradosArmonicosSection.tsx` — G

**Contenido:**
- `src/i18n/locales/es.json` — C, D, E
- `src/i18n/locales/de.json` — C, D, E

**Doctrina (responsabilidad del cierre, no de la implementación):**
- `DESIGN.md §7` — deuda de §1.6 (tríada maestra en F); modo controlado de `AcordesBuilder`; inventario de contextos de sonido si `AcordeProceso` lo altera (no debería: es tónica-relativo como el resto de §1.7).
- `.impeccable/lessons-learned.md` — si emerge un patrón nuevo.

## Criterios de verificación

1. **§1.6** — cambiar la tónica global a C, D y B♭; la primera columna de la tabla sigue la letra de la tónica en los tres casos, las tríadas rotan con ella, ninguna celda muestra alteraciones.
2. **§1.7 resultado** — en D se leen tres líneas: `D mayor = D F♯ A`, `D menor = D F A`, `D disminuido = D F A♭`.
3. **§1.7 nomenclatura** — en D dice `D = Re mayor` / `Dm` / `Ddim`; en DE con tónica B♭ dice `B` (letra alemana), no `Si`.
4. **§1.7 stepper** — `▶` recorre 4 pasos; en cada uno el nodo correspondiente del árbol se ilumina y suena la nota correcta; el paso 4 suena el acorde en bloque; `◀`/`▶▶` navegan sin desincronizar audio y visual; cambiar la tónica resetea a paso 0 y corta el audio; hacer clic en un nodo devuelve el árbol a modo libre.
5. **§1.8** — sidebar y `<h2>` dicen ambos "Círculo de 5tas"; en DE, "Quintenzirkel"; el contenido de la regla de la 5J sigue accesible dentro de la sección.
6. **Árboles** — durante el arpegio, en cada momento hay exactamente un nodo destacado, legible a distancia de proyección; el `readout` nombra esa nota; en modo bloque no se atenúa ninguno; con `prefers-reduced-motion` activo no hay escala pero sí anillo y opacity.
7. **§2.6** — la tabla muestra 3 pasos, no 4; hacer clic o tabular a una celda de grado suena el acorde de esa columna y marca grado + cifrado juntos; §3.5 y §3.9 siguen mostrando 4 pasos y arrancando en séptimas.
8. **Sin regresión** — `npm run build` y typecheck limpios; consola del browser sin errores en T1, T2 y T3, en ES y DE.
9. **Anti-checklist de 14 items** de `lessons-learned.md` pasada antes del commit, con atención especial a: item 1 (cuarentena — el destacado del arpegio no introduce color), item 6 (em dashes en los `.json` tocados), item 10 (`transform`, no propiedades de layout), items 11 y 12 (alcance de teclado y paralelo visual del audio en la fila de grados).
