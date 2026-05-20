# PLAN_BLOQUE_E — Shape doctrinal del rework del profesor

**Fecha:** 2026-05-12
**Basado en:** reunión 2026-05-10 con Prof. Josué Barquero (~30 pedidos sobre T1 y T2)
**Estado:** borrador listo para revisión pre-11ª ola
**Autoría:** shape doctrinal — no contiene código de producción

---

> **Este documento no implementa nada.** Es el plano que hace que cada ola del Bloque E sea
> ejecutable por un agente sin preguntar aclaraciones. Cada sub-bloque puede convertirse
> en un prompt autónomo copiando su sección directamente.

---

## Archivos leídos

Cumplimiento de la sección "Lo que DEBÉS hacer ANTES de proponer nada":

| Archivo | Estado |
|---|---|
| `PRODUCT.md` | ✓ leído via `load-context.mjs` |
| `DESIGN.md` | ✓ leído via `load-context.mjs` (completo, §1–§7) |
| `.impeccable/lessons-learned.md` | ✓ leído (anti-checklist 14 items, todos los patrones) |
| `D:\Guitar Learning\apuntes_reunion_10_5_26.txt` | ✓ leído completo — 30 pedidos originales del profesor, secciones T1 y T2 |
| `src/components/modules/t1/data/literalContent.ts` | ✓ leído completo (§1.1–§1.8) |
| `src/components/modules/t2/data/literalContent.ts` | ✓ leído completo (§4.7 inclusive) |
| `src/components/primitives/EscalaMayor/EscalaMayor.tsx` | ✓ leído completo |
| `src/components/primitives/TensionResolucion/TensionResolucion.tsx` | ✓ leído completo |
| `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx` | ✓ leído completo |
| `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx` | ✓ leído completo |
| `src/data/notes.ts` | ✓ leído (NOTE_COLORS, ALL, NOTE_FREQS) |
| `src/global.css` | ✓ leído (`:root` vars, `[data-theme="light"]` overrides, los 12 `--note-X`) |
| `src/components/shared/NoteSelector.tsx` | ✓ leído (API: `notes`, `selected`, `onSelect`) |
| `docs/source_of_truth_T1_T2.md` | ✓ leído completo (§1.1–§2.10) |

---

## 1. Inventario de pedidos

Los pedidos siguen el orden de aparición en `apuntes_reunion_10_5_26.txt`. Los números son asignados por este shape (el txt no los numera explícitamente). Sección T1 = pedidos 1–20; sección T2 = pedidos 21–30.

| # | Descripción (breve) | Categoría | Sub-bloque |
|---|---|---|---|
| 1 | Errata §1.3: la regla del paso 3 debe decir "Si en el paso 1 está B, se elige B♭ antes que A♯" | pedagogía | E.4 |
| 2 | Agregar mezclador de volumen (bajar/subir volumen global) | feature | E.5 |
| 3 | Corregir "Los 13 intervalos posibles" → son doce; la tónica no cuenta como intervalo | pedagogía | E.5 |
| 4 | Reemplazar tabla T/2/3/4/5/6/7/8 de §1.3 por selector por nota (consume el store global) | UX | E.2 |
| 5 | Tipografía case-sensitive en tabla de intervalos: m/M pierden sentido con mayúsculas forzadas | visual | E.4 |
| 6 | Procedimiento de intervalos: configurable por nota de tónica; remover diapasón; revisar terceras menores y mayores | pedagogía | E.4 |
| 7 | EscalaMayor: "usar ejemplos en diferentes tónicas" (covered by store global) | arquitectura | E.2 |
| 8 | Eliminar fila "Distancia (s.t.)" del visualizador de escala mayor | visual | E.3 |
| 9 | Notas intermedias (2, 6): modelo de tres categorías en vez de dos | pedagogía | E.3 |
| 10 | Visualizador EscalaMayor: quitar voseo extraño en la instrucción | copy | E.3 |
| 11 | EscalaMayor: reemplazar labels de distancia por flechas de resolución (lightweight, ver §6 E.3) | visual | E.3 |
| 12 | Usar bemoles (en lugar de sostenidos) a nivel inicial: preferencia enarmónica de spellings | doctrina | E.4 |
| 13 | §1.5 intro: "Las notas tensas E INTERMEDIAS buscan resolver hacia las estables..." | copy | E.3 |
| 14 | Selector tónica global: al lado de los toggles, cambia todos los ejemplos de la página | arquitectura | E.2 |
| 15 | TensionResolucion — forma de flecha: 1 s.t. = línea recta, 2 s.t. = curva pequeña (uniform stroke-width); renombres "destino"→"reposo", "origen"→"tensión" | visual | E.4 |
| 16 | Tríada: selector por nota (covered by store global) | arquitectura | E.2 |
| 17 | Círculo cromático de tríadas: opción arpegiado y bloque (toggle) | feature | E.5 |
| 18 | Tríada maestra: filtro "una sí una no" hasta toparse a sí misma — solo una octava | pedagogía | E.5 |
| 19 | Ejemplo de tríadas A mayor: configurable (selector) + incluir menores; C♯ como sostenido en contexto tríada A mayor | pedagogía | E.5 |
| 20 | Constructor de acordes: texto reactivo que refleja la nota; agregar bemoles; doble sostenido = x minúscula | pedagogía | E.5 |
| 21 | Las 12 quintas justas: formato círculo ("círculo de quintas") con hover por nota; mostrar excepción; reemplaza ReglaQuinta | feature | E.5 |
| 22 | Indentar textos grandes en T2 | copy | E.5 |
| 23 | Bemoles visibles como minúsculas en títulos de tonalidades (ej. "Bb Eb Ab Db Gb Cb Fb") | visual | E.4 |
| 24 | Herramienta de armaduras en T2: remover fila blanca del medio | visual | E.5 |
| 25 | No apelotar el texto de propiedades (Específico / Acumulativo / Multitonal) — dar formato y espaciado | copy | E.5 |
| 26 | Unificar los tres cuadrados rojos (después de resúmenes de tonalidades) en uno solo | visual | E.5 |
| 27 | GradosArmonicos: resumir tabla — una fila por tríada (3 notas en una sola celda) en lugar de filas Tónica/Tercera/Quinta separadas; añadir tonalidades con bemoles | UX | E.5 |
| 28 | GradosArmonicos: tomar en cuenta séptimas en la extensión | pedagogía | E.5 |
| 29 | Sub-sistema diatónico: verde/naranja/rojo para roles de grado (estable/intermedia/tensa) en componentes tonales; seleccionador maestro de tónica | doctrina | E.1 + E.2 |
| 30 | Audio ascendente: SIEMPRE tocar las notas en orden ascendente de frecuencia | arquitectura | E.4 |

---

## 2. Sub-sistema diatónico (decisión doctrinal de #29)

### 2.1 Tres tokens nuevos en `global.css`

Ubicación exacta: en `:root` después de las `--note-*` vars existentes (línea ~42), con la sección `[data-theme="light"]` correspondiente.

```
/* Sub-sistema diatónico — roles de grado en componentes de tonalidad activa.
   Complementario a --note-X; los dos subsistemas no se mezclan (ver DESIGN.md §2). */
--diatonic-stable: #28c692;   /* verde esmeralda */
--diatonic-medium: #f5900a;   /* naranja ámbar    */
--diatonic-tense:  var(--red); /* alias del acento de marca (rojo cardenal) */
```

```
[data-theme="light"] {
  /* ... vars existentes ... */
  --diatonic-stable: #167040;  /* verde oscuro bosque    */
  --diatonic-medium: #8c4800;  /* naranja quemado oscuro */
  /* --diatonic-tense no necesita override: var(--red) = #c0392b pasa 4.79:1 sobre cream */
}
```

**Verificación de contraste (WCAG AA 4.5:1 — valores aproximados, implementador verifica con WebAIM):**

| Token | Valor dark | vs `--bg` (#0e0e0e) | vs cream (#f5f0e8) light | Pasa dark | Pasa light |
|---|---|---|---|---|---|
| `--diatonic-stable` | `#28c692` | ~9.2:1 | 1.9:1 (falla) → usar override | ✓ | con override `#167040` (~5:1) ✓ |
| `--diatonic-medium` | `#f5900a` | ~8.3:1 | 2.1:1 (falla) → usar override | ✓ | con override `#8c4800` (~5:1) ✓ |
| `--diatonic-tense` | `#c0392b` | 7.4:1 | 4.79:1 | ✓ | ✓ sin override |

**Verificación de no-colisión con notas cromáticas (`--note-X`) y acentos de marca:**

| Token diatónico | Nota más cercana por hue | Delta perceptual | Riesgo |
|---|---|---|---|
| `--diatonic-stable` `#28c692` | `--note-f` `#27ae60` / `--note-b` `#1abc9c` | Esmeralda más claro y más saturado que note-f; más verde (menos azul) que note-b | Bajo en dark; en light los overrides divergen más |
| `--diatonic-medium` `#f5900a` | `--note-d` `#e67e22` / `--amber` `#d4a017` | Más luminoso y amarillo que note-d; más naranja (menos dorado) que amber | Medio — el contexto (siempre dentro de componente diatónico) distingue semánticamente |
| `--diatonic-tense` `var(--red)` | `--red` `#c0392b` (acento de marca) | Idéntico — es el mismo token | Intencional: ver abajo |

**Decisión sobre `--diatonic-tense`:** usar `var(--red)` directamente. "Tensión musical" y "énfasis de marca" son el mismo concepto rojo en este sistema visual. Introducir un segundo rojo casi idéntico crea confusión mayor que usar el alias. El contexto (dentro de componente diatónico) distingue la semántica. Documentado en DESIGN.md §2.

### 2.2 Reglas de aplicación — componentes que consumen tokens diatónicos

| Componente | Qué reemplaza | Token aplicado | Condición |
|---|---|---|---|
| `EscalaMayor` | `fill={NOTE_COLORS[chromatic]}` de los nodos de escala (role !== 'chromatic') | `var(--diatonic-stable)` para tonic/stable, `var(--diatonic-medium)` para intermediate, `var(--diatonic-tense)` para tense | Solo nodos de escala; nodos cromáticos (role='chromatic') mantienen `NOTE_COLORS[X]` con opacity 0.2 |
| `TensionResolucion` | `fill={NOTE_COLORS[note]}` de todos los nodos | ídem por rol del grado según la tónica activa | Las flechas (arrows) siguen usando `var(--muted)` — la cuarentena prohíbe hues en flechas |

**`GradosArmonicos` no recibe fills diatónicos.** La primitiva usa discriminación tipográfica (bold → mayor, regular → menor, tachado → disminuido), no de color. Añadir color al `RomanGlyph` violaría la separación pedagógica: el estudiante aprende a reconocer la calidad por la forma del símbolo, no por color. La primitiva queda fuera del sub-sistema diatónico.

**Mapeo de grados a tokens (nuevo modelo tres categorías #9):**

| Grado | Categoría | Token | Razón |
|---|---|---|---|
| I (T) | Estable | `--diatonic-stable` | Tónica — nodo de reposo |
| II | Intermedia | `--diatonic-medium` | 2 s.t. de T y III; tensión moderada |
| III | Estable | `--diatonic-stable` | Tercera de la tonalidad |
| IV | Tensa | `--diatonic-tense` | 1 s.t. de III (sensible modal) — máxima urgencia |
| V | Estable | `--diatonic-stable` | Quinta de la tonalidad |
| VI | Intermedia | `--diatonic-medium` | 2 s.t. de V; tensión moderada |
| VII | Tensa | `--diatonic-tense` | 1 s.t. de T (sensible tonal) — máxima urgencia |

Este mapeo guía el encoding de la **forma de flecha** en `TensionResolucion` (pedido #15): los grados tensos (IV→III, VII→T) resuelven por 1 s.t. → **flecha recta**; los intermedios (II→T/III, VI→V) resuelven por 2 s.t. → **curva pequeña**. El fill del nodo (categoría) y la forma de la flecha (urgencia) codifican la misma información por dos canales simultáneos — refuerzo de accesibilidad.

### 2.3 Reglas de NO-aplicación — componentes que preservan hues cromáticos absolutos

| Componente | Razón |
|---|---|
| `ChromaticCircle` / `ChromaticCircleSection` | Vive en contexto cromático absoluto (las 12 notas sin tonalidad) |
| `ChromaticCircleAnimated` (T2 POC) | Idem |
| Nuevo `CirculoDeQuintas` (E.5) | Muestra relaciones cromáticas entre notas, no roles diatónicos |
| `NoteToken` en prosa | Cromático por definición (ver decisión §2.5) |
| `IntervalsSection` (mástil de intervalos) | Cromático absoluto |
| `ReglaQuinta` / nuevo `CirculoDeQuintas` | Las 12 quintas son cromáticas |
| `TriadsSection` / `MasterTriad` | Las 7 tríadas naturales se ven antes de una tonalidad asignada |
| `GradosArmonicos` | Discriminación tipográfica, no de color; ver §2.2 |

### 2.4 Extensión a `DESIGN.md` §2 Named Rules

Texto exacto a añadir al final de la sub-sección "Named Rules" de §2, después del "Corolario (Tokens vinculados a notas)":

---

**Sub-sistema diatónico (complementario, no sustituto).** Tres tokens `--diatonic-stable`, `--diatonic-medium`, `--diatonic-tense` codifican el rol de un grado dentro de una tonalidad activa. Solo se aplican en componentes que viven explícitamente dentro de una tonalidad: `EscalaMayor`, `TensionResolucion`, y futuros componentes tonales. Los componentes cromáticos (ChromaticCircle, círculo de quintas, NoteToken en prosa, mástil) preservan los 12 hues absolutos sin excepción. `GradosArmonicos` usa discriminación tipográfica y queda fuera de ambos subsistemas de color.

Los dos sub-sistemas son **mutuamente excluyentes por componente**: un componente usa uno o el otro, nunca los dos en el mismo elemento visual. `--diatonic-tense` es un alias de `var(--red)` — intencional y documentado aquí para que un agente futuro no lo "corrija". La identidad rojo-marca y la función tensa son el mismo concepto semántico en este sistema.

La **Note-Color Quarantine Rule se extiende** en ambas direcciones: (a) los 12 hues de nota no decoran UI que no represente una nota — regla preexistente; (b) los 3 tokens diatónicos no decoran UI que no sea un grado dentro de una tonalidad activa — extensión del Bloque E.

---

### 2.5 Decisión sobre `<NoteToken>`: cromático puro, sin contextualidad

**Decisión: mantener `<NoteToken>` puro-cromático. No crear `<DiatonicNoteToken>`.**

Justificación anti-invasividad:
- Hay 18+ `ProseSegment` en `literalContent.ts` T1 y varios en T2, todos migrados en la 7ª ola. Hacerlos "diatónico-aware" requeriría un nuevo tipo de fragmento (`{type: 'diatonic-note', role: 'intermediate'}`) y modificar los 7 wrappers de T1 más los de T2. Costo de migración alto, beneficio pedagógico bajo (la prosa ya tiene contexto verbal).
- Cuando la prosa dice "el segundo grado D tiende a resolver", el `<NoteToken note="D">` muestra el hue cromático de D — correcto, porque estamos identificando la nota, no su rol.
- El ROL se comunica por las primitivas interactivas (fills diatónicos), no por la prosa. Las dos capas de información no necesitan sincronizarse.

---

## 3. Store global de tónica (decisión arquitectónica de #14/#29)

### 3.1 Nombre del store

**Extensión de `useUIStore`** — no un store nuevo.

Justificación: la tónica es estado de UI (no datos de contenido), al igual que `audioMuted`. Introducir `useTonicStore` separado es prematuro: la única razón válida sería si el store de UI creciera hasta necesitar partición por dominio, lo cual no ocurre con este cambio (pasa de 2 a 4 keys).

### 3.2 Shape exacto del estado y acciones

```typescript
// Extensión a añadir en useUIStore:
interface UIStore {
  // — existente —
  audioMuted: boolean;
  toggleMuted: () => void;

  // — nuevo —
  tonic: ChromaticNote;         // tónica activa globalmente
  setTonic: (t: ChromaticNote) => void;
}

// Implementación Zustand (solo las nuevas keys):
{
  tonic: 'C',
  setTonic: (t) => set({ tonic: t }),
}
```

**No incluir `availableTonics`** como parte del store. Las 12 tónicas (`ALL` de `data/notes.ts`) están disponibles globalmente. El `TonicSelector` importa `ALL` directamente.

### 3.3 Default inicial y persistencia

Default: `'C'`. No persistir en `localStorage`.

C mayor es el punto de entrada pedagógico más limpio (única tonalidad sin alteraciones). Si el profesor pide persistencia en una sesión futura, el cambio es mínimo: añadir `persist` middleware de Zustand con un key dedicado.

### 3.4 Lista de componentes a migrar

| Componente | Acción | Razón |
|---|---|---|
| `EscalaMayor.tsx` | Eliminar `useState<ChromaticNote>('C')` local + `NoteSelector` interno. Leer `useUIStore().tonic`. | El `NoteSelector` local pasa a ser responsabilidad del sidebar. |
| `AcordesBuilder.tsx` | Eliminar `useState<ChromaticNote>('A')` local + `NoteSelector` interno. Leer `useUIStore().tonic`. | Idem. |
| `GradosArmonicosSection.tsx` (wrapper) | Eliminar el `NoteSelector` local que hoy pasa `tonalidad` como prop. Leer `useUIStore().tonic` directamente. | El wrapper lee del store; la primitiva sigue recibiendo `tonalidad: ChromaticNote` como prop. |
| `TensionResolucion.tsx` | Cambiar de NODES hardcodeados en C a NODES computados via `useMemo` desde `useUIStore().tonic`. Ver §3.4.1. | La primitiva pasa de "fija en C" a "configurable por tónica". |
| `IntervalsSection` (wrapper de §1.3) | Reemplazar tabla T/2/3 por `NoteSelector` consumiendo `useUIStore().tonic` / `setTonic`. Ver §3.4.2. | Pedido #4: el procedimiento de intervalos debe ser configurable por nota seleccionada. |

**Componentes que NO se tocan en E.2:** `ChromaticCircle`, `ReglaQuinta`, `TriadsSection`, `MasterTriad`. La centralización aplica solo a los componentes tonales.

#### 3.4.1 Migración de `TensionResolucion` — detalle técnico

`NODES` hoy es `as const` con notas hardcodeadas de C mayor. Para hacerlo configurable:

```
// Antes (constante): 
const NODES = [
  { pos: 0, note: 'C', octaveAdj: 0, grade: 'T', role: 'tonic' },
  ...
] as const;

// Después (useMemo sobre tonic del store):
const tonic = useUIStore((s) => s.tonic);
const nodes = useMemo(() => buildNodes(tonic), [tonic]);
```

`buildNodes(tonic)` usa `majorScaleSpelled(tonic)` para obtener el spelling de los 7 grados. **Las posiciones del grid SVG son invariantes** — solo cambia qué nota aparece en cada posición. `ARROWS` (qué índice de nodo conecta con qué) también es invariante.

#### 3.4.2 Migración de `IntervalsSection` — pedido #4

La tabla `Nombre | T | 2 | 3 | ... | 8 / Ejemplo | G | A | B | ...` se reemplaza por un `NoteSelector` que lee/escribe `useUIStore().tonic`. Al cambiar la nota, la fila "Ejemplo" se recalcula dinámicamente. No es un selector local — es el mismo store global, de modo que cambiar la tónica en §1.3 actualiza toda la página.

### 3.5 Ubicación del control UI

**Placement confirmado:** dentro de `Sidebar.tsx`, orden ThemeToggle → MuteToggle → TonicSelector.

**Estructura del componente `TonicSelector`:**
- Label: `"TONALIDAD"` en Plex Mono 500 uppercase, estilo idéntico al de `MuteToggle`.
- Control: `<select>` nativo con las 12 opciones. Cada `<option>` muestra `noteShort(note)`.
- No usar chips (`NoteSelector`): demasiado anchos para el sidebar de 220px.
- Hereda el estilo base: fondo `--surface-2`, texto `--paper`, border 1px `--rule`, sin radius, Plex Mono.

**Mobile (< 900px):** el sidebar ya colapsa en drawer hamburguesa. El `TonicSelector` entra en el drawer en la misma posición relativa — no requiere cambios de responsive extra.

---

## 4. Modelo pedagógico de tres categorías (decisión de contenido de #9)

### 4.1 Diff exacto contra `source_of_truth_T1_T2.md` §1.4

```diff
  La escala se divide en:

- - **Notas estables:** 1, 3, 5.
- - **Notas tensas:** 2, 4, 6, 7.
+ - **Notas estables:** 1, 3, 5.
+ - **Notas intermedias:** 2, 6.
+ - **Notas tensas:** 4, 7.
```

**Racionalización pedagógica:** el 4to grado (IV) está a 1 s.t. de III (sensible modal) y el 7mo (VII) está a 1 s.t. de T (sensible tonal) — resolución más urgente, categoría tensa. El 2do (II) y el 6to (VI) están a 2 s.t. de sus estables más cercanos — menor urgencia, categoría intermedia.

### 4.2 Diff exacto contra `literalContent.ts` de T1

```typescript
// Antes:
export const ESCALA_TENSAS = "Notas tensas: 2, 4, 6, 7.";

// Después:
export const ESCALA_TENSAS = "Notas tensas: 4, 7.";

// Añadir (después de ESCALA_ESTABLES):
export const ESCALA_INTERMEDIAS = "Notas intermedias: 2, 6.";
```

Los consumidores de `ESCALA_ESTABLES` y `ESCALA_TENSAS` en `EscalaMayorSection.tsx` deben añadir el render de `ESCALA_INTERMEDIAS` entre ellos.

### 4.3 Tabla de grados

| Grado | Nota (C mayor) | Categoría | Token diatónico | Distancia a nodo estable más cercano |
|---|---|---|---|---|
| I (T) | C | Estable | `--diatonic-stable` | — (es estable) |
| II | D | Intermedia | `--diatonic-medium` | 2 s.t. de C o E |
| III | E | Estable | `--diatonic-stable` | — |
| IV | F | Tensa | `--diatonic-tense` | 1 s.t. de E (sensible modal) |
| V | G | Estable | `--diatonic-stable` | — |
| VI | A | Intermedia | `--diatonic-medium` | 2 s.t. de G o C (octava) |
| VII | B | Tensa | `--diatonic-tense` | 1 s.t. de C (octava) — sensible tonal |

### 4.4 Errata §1.3 — diff exacto (confirmada por el usuario)

En `source_of_truth_T1_T2.md` §1.3, paso 3:

```diff
- 3. Cuando hay dos notas alteradas, elegir según la **letra** del paso 1. Si en el paso 1 está "B", entonces se elige A# antes que Bb.
+ 3. Cuando hay dos notas alteradas, elegir según la **letra** del paso 1. Si en el paso 1 está "B", entonces se elige B♭ antes que A♯.
```

En `literalContent.ts` T1, `INTERVALOS_PROCEDIMIENTO_PASOS[2]`:

```diff
  [
    { type: 'text', value: 'Cuando hay dos notas alteradas, elegir según la letra del paso 1. Si en el paso 1 está "' },
    { type: 'note', value: 'B' },
-   { type: 'text', value: '", entonces se elige ' },
-   { type: 'note', value: 'A#' },
-   { type: 'text', value: ' antes que ' },
-   { type: 'note', value: 'Bb' },
+   { type: 'text', value: '", entonces se elige ' },
+   { type: 'note', value: 'Bb' },
+   { type: 'text', value: ' antes que ' },
+   { type: 'note', value: 'A#' },
    { type: 'text', value: '.' },
  ],
```

---

## 5. Cierre de deudas pendientes

### 5.1 Spelling enarmónico (#12)

**Comportamiento actual:**
`majorScaleSpelled('D#')` devuelve notas con E♯, F♯♯, B♯.
`majorScaleSpelled('G#')` devuelve notas con B♯ y F♯♯.
`majorScaleSpelled('A#')` devuelve notas con Fx, G♯♯, C♯♯.

**Comportamiento nuevo:**

Mapa de redirección aplicado **al inicio** de `majorScaleSpelled` y `chordSpelled`:

```typescript
const ENHARMONIC_REDIRECT: Partial<Record<ChromaticNote, ChromaticNote>> = {
  'D#': 'Eb',
  'G#': 'Ab',
  'A#': 'Bb',
};
```

Si `tonic` tiene entrada en el mapa, la función opera sobre la enarmonía bemol.

**Tónicas que NO se redirigen:** `'C#'` (aceptado pedagógicamente), `'F#'` (razonable, sin dobles), naturales y bemoles existentes.

**El doble sostenido Fx** desaparece con la redirección A#→Bb. No se necesita manejo especial.

**Impacto en `NoteSelector`:** ninguno. La redirección es interna. El estudiante elige D# y ve la escala de Eb — exactamente la intención pedagógica del profesor.

**Archivos a modificar en E.4:** solo `src/utils/noteCalculations.ts` (las dos funciones).

### 5.2 AudioButtons highlight progresivo

**Fuera del alcance del Bloque E.** La deuda sigue diferida. DESIGN.md §7 se actualiza para reflejar que el Bloque E mantiene **cuatro sitios paralelos** con el mismo patrón (GradosArmonicos no se añade al scope de E.3, por lo que no suma sitio nuevo): `AcordesBuilder`, `ReglaQuinta` (→ `CirculoDeQuintas` en E.5), `TensionResolucion`, y el futuro `CirculoDeQuintas`.

### 5.3 Audio ascendente (#30)

**Implementación en `utils/noteCalculations.ts`:**

```typescript
function ensureAscending(
  notes: Array<{ chromatic: ChromaticNote; octave: number }>
): Array<{ chromatic: ChromaticNote; octave: number }>;
```

Algoritmo: iteración lineal. Para cada nota desde índice 1, si su frecuencia es ≤ a la anterior, incrementar `octave` hasta que sea mayor o `octave` llegue a 8.

**Callers:**

| Componente | Dónde aplicar |
|---|---|
| `AcordesBuilder.tsx` | En `handlePlayArpeggio`, sobre el array `chord` antes del loop de `setTimeout` |

**`GradosArmonicos.tsx`:** la función `chordMemberOctave` ya garantiza ascendencia. No se toca.

**`TensionResolucion.tsx`:** excluida — las flechas reproducen resoluciones preservando la dirección pedagógica (VII puede resolver hacia abajo al T de la octava inferior, y ese es el mensaje correcto).

---

## 6. Plan de sub-bloques E.1 a E.5

### E.1 — Tokens CSS + Doctrina diatónica

**Scope (pedidos cubiertos):** #29 (tokens CSS y DESIGN.md).

**Archivos afectados:**
- `src/global.css` — añadir `--diatonic-stable`, `--diatonic-medium`, `--diatonic-tense` en `:root`; añadir overrides en `[data-theme="light"]`.
- `DESIGN.md` — añadir texto de §2.4 al final de Named Rules de §2; actualizar §7 Pending Debts.

**Dependencias:** ninguna. E.1 es el prerequisito de E.3.

**Anti-checklist anticipada:**
- **Item 1 (cuarentena):** grep `--diatonic-` en `src/` — verificar que los tokens no aparecen fuera de los 2 componentes diatónicos.
- **Item 8 (theme-flip):** `--diatonic-stable` y `--diatonic-medium` tienen overrides en `[data-theme="light"]`.
- **Item 13 (hex repetido):** dark y light deben divergir; nunca el mismo hex en ambos bloques.

**Riesgos:**
- Implementador introduce los tokens en `global.css` pero omite la extensión a DESIGN.md §2 — pasada futura viola la cuarentena sin saberlo.
- Colisión visual entre `--diatonic-stable` y `--note-b`/`--note-f` en pantallas con ambos sistemas en scroll corto. Mitigación: documentar en DESIGN.md que la convivencia es aceptada y el contexto distingue.

---

### E.2 — Store global de tónica + TonicSelector

**Scope (pedidos cubiertos):** #4 (selector §1.3), #7 (EscalaMayor configurable), #14 (TonicSelector global), #16 (tríada selector), #29 (seleccionador maestro).

**Archivos afectados:**
- `src/stores/useUIStore.ts` — añadir `tonic` y `setTonic`.
- Nuevo `src/components/layout/TonicSelector.tsx` + `TonicSelector.module.css`.
- `src/components/layout/Sidebar.tsx` — añadir `<TonicSelector />` tras MuteToggle.
- `src/components/primitives/EscalaMayor/EscalaMayor.tsx` — eliminar `useState` local y `NoteSelector`; leer de store.
- `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx` — idem.
- `src/components/primitives/TensionResolucion/TensionResolucion.tsx` — convertir NODES a useMemo (ver §3.4.1).
- Wrapper de `GradosArmonicos` en T2 — eliminar NoteSelector local, leer tonic del store.
- `IntervalsSection` (wrapper de §1.3) — reemplazar tabla T/2/3 por NoteSelector reactivo (ver §3.4.2).

**Dependencias:** ninguna (puede ir en paralelo con E.1; E.3 depende de que E.2 cierre primero).

**Anti-checklist anticipada:**
- **Item 8 (theme-flip):** `TonicSelector.module.css` usa solo vars tokenizadas.
- **Item 11 (keyboard reach):** el `<select>` nativo es accesible. Verificar `htmlFor` / `aria-labelledby`.
- **Item 14 (inline style):** `TonicSelector.tsx` usa CSS module, no inline style.

**Riesgos:**
- Al centralizar `EscalaMayor`, el componente deja de ser stand-alone. Si emergen dos instancias con tónicas distintas, añadir prop `tonicOverride?: ChromaticNote`.
- Si E.4 no cerró antes que E.2, las tónicas D#/G#/A# mostrarán dobles sostenidos en TensionResolucion — aceptable durante desarrollo.

---

### E.3 — Rewrite pedagógico + tokens diatónicos en primitivas

**Scope (pedidos cubiertos):** #8 (distancia row), #9 (tres categorías), #10 (voseo), #11 (flechas EscalaMayor), #13 (texto §1.5).

**Archivos afectados:**
- `docs/source_of_truth_T1_T2.md` — §1.4 (tres categorías).
- `src/components/modules/t1/data/literalContent.ts` — `ESCALA_TENSAS` modificada, `ESCALA_INTERMEDIAS` nueva, `TENSION_INTRO` actualizada (#13), instrucción EscalaMayor sin voseo (#10).
- `src/components/primitives/EscalaMayor/EscalaMayor.tsx` — `NodeData.role` añade `'intermediate'`; lógica de asignación actualizada; fills cambian a tokens diatónicos; fila "Distancia (s.t.)" eliminada; flechas SVG lightweight añadidas (#11).
- `src/components/primitives/TensionResolucion/TensionResolucion.tsx` — `ScaleNode` usa tokens diatónicos para fills; leyenda actualizada con tres colores.
- Wrappers de sección — añaden render de `ESCALA_INTERMEDIAS`.

**Dependencias:** E.1 (tokens CSS deben existir), E.2 (primitivas deben estar migradas al store).

#### Decisión sobre flechas en `EscalaMayor` (pedido #11)

**Decisión: flechas inline SVG `<line>` estáticas — NO reutilizar el sistema de `TensionResolucion`.**

| Opción | Descripción | Costo |
|---|---|---|
| A — Inline lightweight | `<line>` SVG estáticos, color `var(--muted)`, sin audio, sin bezier | ~30 líneas nuevas en EscalaMayor.tsx |
| B — Consolidar con TensionResolucion | Reutilizar los arcos bezier de TensionResolucion como componente compartido | ~200 líneas de refactor; acoplamiento entre §1.4 y §1.5 |

**Se elige Opción A.** La progresión pedagógica intencional: §1.4 presenta la *categoría* de cada nota con una indicación visual leve de hacia dónde tiende; §1.5 presenta los *mecanismos* de resolución completos con forma de flecha, audio y leyenda. Fusionar los dos sistemas nivela la curva pedagógica y le quita peso a §1.5. Las flechas de §1.4 son indicadores de dirección (↑ / ↓), no mapas de resolución.

**Especificación técnica de las flechas inline:**
- Solo para grados tensos e intermedios (los estables son el destino, no tienen flecha).
- IV→III: flecha hacia abajo (1 s.t. hacia el estable III).
- VII→T: flecha hacia arriba + hacia abajo (resolución ambigua, doble dirección).
- II y VI: dos flechas pequeñas indicando dirección posible (2 s.t. hacia arriba/abajo).
- Implementación: `<path>` con `marker-end` para punta; sin animación; sin audio. Color `var(--muted)`.

**Pedido #10 — quitar voseo en `ESCALA_PRIMITIVA_INSTRUCCION`:**

```diff
- "Chequeá las notas en verde..."
+ "Las notas en verde son estables. Las notas en naranja son intermedias. Las notas en rojo son tensas."
```

**Pedido #13 — diff exacto en `TENSION_INTRO`:**

```diff
- "Las notas tensas buscan resolver hacia las estables, hacia abajo o hacia arriba."
+ "Las notas tensas E INTERMEDIAS buscan resolver hacia las estables, hacia abajo o hacia arriba."
```

**Anti-checklist anticipada:**
- **Item 1 (cuarentena):** nodos cromáticos (role='chromatic') siguen usando `NOTE_COLORS[chromatic]` con opacity 0.2. Grep para verificar que `--diatonic-*` no aparece en nodos cromáticos.
- **Item 9 (prefers-reduced-motion):** si los fills cambian con transición CSS, verificar el override global.
- **Item 11 (keyboard reach):** `TensionResolucion` conserva el acceso de teclado de las flechas.

**Riesgos:**
- **Pérdida de identidad cromática en EscalaMayor:** dos notas estables (C, E, G) se ven del mismo verde. Mitigación: mantener la **letra interior** de la nota en el SVG — fill indica rol, letra indica qué nota es.
- **Leyenda de TensionResolucion:** el implementador de E.3 no debe actualizar la leyenda de TensionResolucion aún — eso cierra en E.4 (forma de flecha + renombres).

---

### E.4 — Errata + Spelling + Audio + Correcciones UI

**Scope (pedidos cubiertos):** #1 (errata §1.3), #5 (tipografía m/M), #6 (procedimiento intervalos configurable + diapasón + terceras), #12 (spelling bemoles), #15 (TensionResolucion flechas + renombres), #23 (bemoles en títulos T2), #30 (audio ascendente).

**Archivos afectados:**
- `docs/source_of_truth_T1_T2.md` — §1.3 paso 3 (errata #1).
- `src/components/modules/t1/data/literalContent.ts` — `INTERVALOS_PROCEDIMIENTO_PASOS[2]` (errata #1); tabla de intervalos tipografía m/M (#5).
- `src/utils/noteCalculations.ts` — `majorScaleSpelled` y `chordSpelled` con redirección enarmónica (#12); nueva función `ensureAscending` (#30).
- `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx` — `handlePlayArpeggio` usa `ensureAscending` (#30).
- `src/components/primitives/TensionResolucion/TensionResolucion.tsx` — migración `kind: 'straight' | 'curve'`; stroke-width uniforme; renombres en leyenda (#15).
- `src/components/primitives/IntervalsSection/` — procedimiento configurable por tónica del store; remover diapasón; revisar terceras (#6).
- `src/components/modules/t2/data/literalContent.ts` — títulos de tonalidades con bemoles: asegurar render con `b` minúsculas visibles (#23).

**Detalle técnico de pedido #15 — forma de flecha en `TensionResolucion`:**

El array `ARROWS` hoy tiene `{ from, to, width, tier: 'long'|'short' }`. `tier: 'short'` = 1 s.t. (más urgente), `tier: 'long'` = 2 s.t. La migración:

```typescript
// Antes:
{ from: 6, to: 0, width: 3,   tier: 'short' } // VII→T: 1 s.t.
{ from: 1, to: 0, width: 2,   tier: 'long'  } // II→T:  2 s.t.

// Después:
{ from: 6, to: 0, width: 1.5, kind: 'straight' } // VII→T: 1 s.t. → línea recta
{ from: 1, to: 0, width: 1.5, kind: 'curve'    } // II→T:  2 s.t. → curva pequeña
```

La función `arrowPath()` se bifurca por `kind`:
- `kind: 'straight'` → `M x1 y1 L x2 y2` (línea recta con marker de flecha).
- `kind: 'curve'` → cubic bezier con brinco pequeño (~20px de pico — mucho menor que el ARC_PEAK_SHORT actual de 78px).

`stroke-width` pasa a **uniforme (1.5)** para todas las flechas. La dimensión de urgencia queda exclusivamente en la forma: línea recta = 1 s.t. = máxima urgencia; curva = 2 s.t. = tensión moderada.

**Renombres en leyenda:**
```diff
- "Origen"  → "Tensión"
- "Destino" → "Reposo"
```

**Dependencias:** ninguna. E.4 puede ejecutarse en paralelo con E.1/E.2/E.3. Recomendación: ejecutar antes que E.2 para que la redirección enarmónica esté activa cuando `buildNodes(tonic)` se implemente.

**Anti-checklist anticipada:**
- **Item 12 (audio replicado):** `ensureAscending` es lógica pura de octavas, no toca `useAudioEngine`.
- Ningún otro item del anti-checklist se activa para la porción de `noteCalculations`.

**Riesgos:**
- **Redirección enarmónica rompe consumidores:** grep de consumidores de `majorScaleSpelled` antes de implementar. Si algún caller hace `.includes('#')` sobre el resultado, puede romperse.
- **Diapasón en §1.3 (#6):** confirmar qué componente visual es (¿`FretboardDisplay`?) antes de eliminarlo. Si es compartido con otro módulo, solo ocultarlo en §1.3.
- **Terceras en tabla de intervalos (#6):** es un bug en datos — localizar qué celdas tienen el valor incorrecto antes de modificar.
- **Bemoles en títulos T2 (#23):** si los títulos tienen `text-transform: uppercase` en CSS, las `b` de bemol se convierten en `B`. Solución: `font-variant: small-caps` o `<span class={styles.bemol}>b</span>` con `text-transform: none`.

---

### E.5 — Visuales discretos + Pedagógicos + Features nuevas

**Scope (pedidos cubiertos):** #2 (mezclador volumen), #3 (12 intervalos), #17 (toggle arpegio/bloque), #18 (tríada maestra una octava), #19 (ejemplos configurables + menores), #20 (constructor acordes), #21 (círculo de quintas), #22 (indentar T2), #24 (fila blanca herramienta), #25 (no apelotar texto), #26 (unificar cuadrados rojos), #27 (GradosArmonicos tabla comprimida), #28 (GradosArmonicos séptimas).

Esta ola se divide en tres grupos por naturaleza del cambio:

#### Grupo A — Visuales discretos (copy/layout sin nueva lógica)

**#22 — Indentar textos grandes T2:**
Bloques de prosa largos (`INTRO_LENGUAS`, `DEF_ARMADURA`, `EXCEPCION_F_COMPLETA`, etc.) deben tener `max-width: 65ch` y `line-height` adecuado. Implementar en el módulo CSS de T2 o en el wrapper de sección. No modificar `literalContent.ts`.

**#24 — Remover fila blanca del medio en herramienta de armaduras:**
La tabla de herramienta tiene una `<tr>` separadora vacía entre la fila de notas naturales y las filas de alteraciones. Eliminar esa fila. Verificar que el quitado no rompe el layout de la tabla.

**#25 — No apelotar texto (Específico/Acumulativo/Multitonal):**
Las tres propiedades hoy están seguidas sin espacio visual. Cada propiedad en su propio bloque con la etiqueta en negrita y el texto indentado debajo, o con `margin-bottom` entre bloques.

**#26 — Unificar tres cuadrados rojos en uno:**
Los tres callouts rojos tras los resúmenes de tonalidades se consolidan en un único bloque. El contenido se fusiona o presenta como lista. La decisión de qué texto preservar queda para el implementador.

#### Grupo B — Pedagógicos (cambios a primitivas existentes)

**#3 — Corregir "13 intervalos posibles" → 12:**
Localizar la cadena en `literalContent.ts` T1 y corregir. Verificar que la corrección no rompe la tabla de 12 intervalos que sigue.

**#18 — Tríada maestra: una octava:**
La primitiva `MasterTriad` aplica el filtro "una sí una no" más allá de una octava. Limitar la validación al rango de 12 semitonos desde la tónica. Añadir guard `semitones <= 12` o `position <= 12` en la lógica de filtro.

**#19 — Ejemplos de tríadas: configurables + menores:**
Los ejemplos "A mayor" en §1.6 (tríadas) deben poder seleccionarse. La tónica viene del store (E.2 ya lo cubre para `AcordesBuilder`). Para el ejemplo en prosa que hardcodea "A mayor", reemplazar por un componente reactivo que muestra la tónica activa. Incluir también el ejemplo menor. Nota: C♯ en la tríada de A mayor es correcto (A mayor tiene F♯ C♯ G♯ en su armadura) — el mapa de redirección de E.4 no aplica aquí porque C♯ no está en `ENHARMONIC_REDIRECT`.

**#27 + #28 — GradosArmonicos: tabla comprimida + tonalidades bemoles + séptimas:**

*Tabla comprimida:* las filas Tónica / Tercera / Quinta se reemplazan por una sola fila "Tríada" donde cada celda muestra las 3 notas juntas (ej: `C E G` para el grado I en C mayor). El `Row` component actual se modifica o se añade una nueva fila comprimida que concatena las tres notas por columna.

*Tonalidades con bemoles:* con la redirección enarmónica de E.4 activa, `buildDiatonic(tonalidad)` ya devuelve el spelling correcto para Bb, Eb, Ab, etc. Verificar que `NoteToken` renderiza estos spellings correctamente (ya en `VALID_SPELLINGS`, confirmado).

*Séptimas (#28):* añadir un cuarto miembro de acorde (7ª diatónica) a la celda comprimida, visible en un paso 4 adicional del stepper. El paso 4 requiere calcular `SEVENTH_QUALITIES` para los 7 grados (la calidad varía: mayor, menor, disminuida según el grado). **Este sub-pedido requiere una pasada de `/impeccable shape` dedicada dentro de E.5** — marcar como bloqueante B6. No implementar hasta que B6 tenga shape aprobada.

#### Grupo C — Features nuevas

**#20 — Constructor de acordes (`AcordesBuilder`):**
El texto de instrucción debe ser reactivo (refleja la nota activa del store). Añadir soporte para bemoles en la lista de opciones. El doble sostenido se representa como `x` minúscula (no `##`). Actualizar `literalContent.ts` T1 y la lógica de display de `AcordesBuilder`.

**#2 — Mezclador de volumen:**
Añadir un slider `<input type="range">` al sidebar o al componente `MuteToggle`. El volumen controla `AudioContext.destination.gain` o el `gainNode` de `useAudioEngine`. El slider convive con el toggle de mute: mute desactiva el audio independientemente del nivel de volumen; volumen en 0 no equivale a mute (semántica distinta). Definir un mínimo > 0 (ej: 0.05) para evitar ambigüedad cuando el slider llega a 0 con mute en OFF.

**#17 — Toggle arpegio/bloque en círculo de tríadas:**
La primitiva `TriadsSection` añade un toggle "Arpegio / Bloque". En modo bloque, llamar `playNote` para las 3 notas sin `setTimeout`; en modo arpegio, mantener el `ARPEGGIO_GAP_MS` actual. El estado del toggle es local al componente (no necesita el store global).

**#21 — Círculo de quintas (reemplaza `ReglaQuinta` en T1 §1.8):**
El formato vertical de "Las 12 quintas justas" se reemplaza por un SVG circular con los 12 nodos en disposición de reloj. Cada nodo: `<circle>` con `fill={NOTE_COLORS[note]}` (cromático — ver §2.3) + `<text>` con la letra. Hover: resaltar el nodo y su quinta justa. Click: reproducir la nota (raíz) y su quinta justa en arpegio ascendente. La excepción (G♯/Ab → D♯/Eb) se documenta con tooltip. Este componente es `CirculoDeQuintas` instanciado en la sección §1.8 de T1.

**Dependencias de E.5:** E.1 (tokens para fills tonales); E.2 (store para ejemplos reactivos de #19 y #20); E.4 (redirección enarmónica para GradosArmonicos con bemoles de #27). Los cambios del Grupo A no tienen dependencias.

**Riesgos:**
- **GradosArmonicos séptimas (B6):** pending shape antes de implementar el paso 4.
- **Círculo de quintas + hover en mobile:** hover no existe en touch. Fallback: tap cumple la misma función. Diseñar ambos estados desde el inicio.
- **Volumen + mute:** definir comportamiento cuando el slider está en 0 y el toggle en ON antes de implementar.

---

## 7. Pendientes de decisión humana

**Todos los bloqueantes de la primera versión del plan han sido resueltos:**

- **B1 (inconsistencia vi §1.4 vs §2.8):** CERRADO. `GradosArmonicos` mantiene discriminación tipográfica, sin color diatónico. La inconsistencia "vi es intermedio como nota / vi es estable como acorde" es pedagógicamente válida — los dos niveles de análisis describen fenómenos distintos. `GRADOS_NOMBRE_CARACTER` no se modifica en el Bloque E.

- **B2 (placement exacto de TonicSelector):** CERRADO. Orden confirmado: ThemeToggle → MuteToggle → TonicSelector. Ver §3.5.

- **B3 (AcordesBuilder en contexto de grado diatónico):** CERRADO. `AcordesBuilder` permanece independiente en §1.7 — siempre cromático. Un hipotético §2.9 de progresiones (fuera del Bloque E) usaría un componente nuevo.

- **B4 (alcance de §2.9 Progresiones):** ELIMINADO. §2.9 queda fuera del Bloque E.

- **B5 (círculo de quintas standalone vs. integrado):** ELIMINADO. Es el pedido #21, vive en T1 §1.8 reemplazando `ReglaQuinta`.

**Bloqueante nuevo:**

- **B6 — GradosArmonicos séptimas: shape antes de implementar.** El paso 4 del stepper (séptimas) requiere definir `SEVENTH_QUALITIES` para los 7 grados, la presentación visual dentro de la celda comprimida, y si es parte del stepper principal o un toggle independiente. Debe haber una pasada de `/impeccable shape` dedicada antes de codificarlo.

---

## 8. Diff propuesto contra `DESIGN.md §7 Pending Debts` y `lessons-learned.md`

### 8.1 Deudas históricas que se CIERRAN con el Bloque E

| Deuda | Cierra en | Ola |
|---|---|---|
| "Doble sostenido / doble bemol en spelling de acordes para tónicas extremas" | E.4 — redirección D#→Eb, G#→Ab, A#→Bb | 14ª ola |
| "AudioButtons sin feedback visual durante reproducción" | No cierra en Bloque E — mantener | — |

### 8.2 Deudas nuevas introducidas por el Bloque E

```
- **Sub-sistema diatónico: colisión visual potencial en vistas mixtas.** En pantallas donde
  el ChromaticCircle y EscalaMayor coexisten en scroll corto, el verde de --diatonic-stable
  (#28c692) es perceptualmente similar al verde de note-f (#27ae60) y note-b (#1abc9c). El
  contexto distingue semánticamente. Aceptado. Monitorear si el profesor reporta confusión.

- **TensionResolucion configurable: leyenda necesita permanecer abstracta.** Los textos de
  leyenda son abstractos (hablan de semitonos, no de notas concretas), así que son válidos
  para todas las tonalidades. Verificar que el implementador de E.2/E.3 no hardcodea notas
  concretas en la leyenda.

- **GradosArmonicos séptimas: pending shape (B6).** El paso 4 del stepper requiere shape
  dedicada antes de implementar. Deuda activa hasta que E.5 produzca ese shape.

- **AudioButtons highlight progresivo: 4 sitios paralelos.** Sitios actuales:
  AcordesBuilder, ReglaQuinta (→ CirculoDeQuintas en E.5), TensionResolucion, CirculoDeQuintas.
  Cuando se aborde la deuda original, estos 4 sitios se actualizan en la misma pasada.
```

### 8.3 Entradas de `lessons-learned.md` a actualizar

**Entrada a REESCRIBIR** — la entrada sobre "stroke-width como discriminador de tensión" (9ª ola):

```
- **Forma de flecha como discriminador de urgencia en TensionResolucion (Bloque E, E.4).**
  La 9ª ola introdujo stroke-width variable (1.5–3px) para codificar jerarquía de tensión
  en las flechas — técnica válida bajo la cuarentena de color. La 14ª ola (E.4) la supersede:
  stroke-width vuelve a ser UNIFORME; la urgencia pasa a codificarse en la FORMA de la flecha.

  Regla permanente: 1 semitono de resolución → flecha recta (SVG path M...L...);
  2 semitonos de resolución → curva con brinco pequeño (cubic bezier, pico ~20px).

  La metáfora visual es directa: una línea "tensa" es más urgente que una curva "suave".
  No usar stroke-width como proxy de urgencia en futuros componentes de TensionResolucion
  — la dimensión queda reservada para contraste uniforme accesible. Si se necesita una
  tercera dimensión de encoding, explorar dash-array o marker shape antes de volver a
  stroke-width variable.

  Encoding resultante del Bloque E: FILL DEL NODO (color diatónico) → categoría del grado
  (qué tipo de grado es); FORMA DE FLECHA → urgencia de resolución (cuántos semitonos
  recorre). Dos dimensiones ortogonales del mismo fenómeno pedagógico.
```

**Entrada a AÑADIR** (nueva al finalizar E.1):

```
- **Sub-sistema diatónico como segundo anillo de cuarentena.** El Bloque E introduce
  --diatonic-stable/medium/tense como tokens de rol diatónico. La tentación para un agente
  futuro será usarlos decorativamente (ej: "este botón debería verse verde porque es
  estable"). Regla: los tokens diatónicos son tan semánticos como los --note-X — solo
  pueden usarse en componentes que representen explícitamente un grado dentro de una
  tonalidad activa (EscalaMayor, TensionResolucion, y futuros componentes tonales
  declarados). Test: ¿este elemento es un nodo de EscalaMayor o TensionResolucion?
  Sí → token válido. No → usar neutros + --red/--amber.

  GradosArmonicos usa discriminación tipográfica, no tokens diatónicos — ese es el
  precedente correcto para componentes donde el color añade ruido, no señal.
```

---

## Resumen ejecutivo

**30 pedidos distribuidos en 5 sub-bloques:**
- E.1 (tokens + doctrina): 1 pedido (#29). Prerequisito total. Sin dependencias.
- E.2 (store + UI): 5 pedidos (#4, #7, #14, #16, #29 parcial). Paralelo con E.1.
- E.3 (rewrite pedagógico + tokens en primitivas): 5 pedidos (#8, #9, #10, #11, #13). Depende de E.1 y E.2.
- E.4 (errata + spelling + audio + UI): 7 pedidos (#1, #5, #6, #12, #15, #23, #30). Independiente — paralelo con cualquier ola.
- E.5 (visuales discretos + pedagógicos + features): 13 pedidos (#2, #3, #17, #18, #19, #20, #21, #22, #24, #25, #26, #27, #28). Depende de E.1 y E.2 para features tonales; Grupo A sin dependencias.

**Camino crítico:** E.1 → E.2 → E.3 → E.5 (features tonales). E.4 en paralelo con cualquier ola. E.5 Grupo A en paralelo con cualquier ola.

**Decisiones doctrinales de mayor impacto:**
1. Sub-sistema diatónico complementario (verde/naranja/rojo) solo en `EscalaMayor` y `TensionResolucion` — `GradosArmonicos` excluido.
2. Store global de tónica via extensión de `useUIStore` — no store separado.
3. `<NoteToken>` se mantiene puro-cromático — el sistema diatónico vive en primitivas SVG, no en prosa.
4. `--diatonic-tense = var(--red)` — alias intencional del acento de marca, documentado.
5. D#/G#/A# redirigen a Eb/Ab/Bb en spelling — transparente para el NoteSelector.
6. Flechas en EscalaMayor: inline lightweight (`<line>` estáticos) — NO sistema TensionResolucion; progresión pedagógica intacta.
7. Flechas en TensionResolucion: forma (straight/curve) reemplaza stroke-width variable — uniform width, forma encodes urgencia.

**Bloqueante activo:** B6 — shape de séptimas en GradosArmonicos antes de implementar E.5 paso 4.

---

El Bloque E NO implementa código en esta pasada; contiene exclusivamente el plano doctrinal y la especificación de cada ola.
