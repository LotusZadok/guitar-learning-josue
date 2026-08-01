# Cambios del profesor T1 §1.6/§1.7/§1.8 + T2 §2.6 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar los 7 cambios que pidió el Prof. Josué sobre §1.6, §1.7, §1.8 y §2.6, incluyendo un stepper animado que explica la construcción del acorde mayor sobre el árbol existente.

**Architecture:** Cambios quirúrgicos sobre componentes existentes más una primitiva nueva (`AcordeProceso`) que compone el árbol ya existente en lugar de dibujar uno segundo. Las dos primitivas compartidas (`AcordesBuilder`, `GradosArmonicos`) ganan props opcionales con defaults que preservan el comportamiento actual de T3.

**Tech Stack:** React 19 + TypeScript + Vite, CSS Modules, i18next (es/de), Zustand (`useUIStore`), Tonal.js bajo `utils/noteCalculations.ts`.

**Spec:** `docs/superpowers/specs/2026-07-31-cambios-josue-t1-t2-design.md`

---

## Nota sobre verificación — LEER ANTES DE EMPEZAR

**Este proyecto no tiene framework de tests.** `package.json` expone únicamente `dev`, `build`, `lint`, `preview`. No hay vitest, jest ni testing-library instalados.

**No instales un framework de tests.** Está fuera del alcance de esta pasada. El loop de verificación del proyecto — el mismo que documentan las 34 olas previas en `DESIGN.md §7` — es:

1. `npm run build` (corre `tsc -b` y luego el build de Vite: typecheck + compilación)
2. `npm run lint`
3. Verificación en browser con las preview tools contra el dev server

**Sobre `npm run lint`:** hay ~50 errores preexistentes en `scripts/*.js` (código de terceros, documentados desde la 10ª ola). El criterio es **cero errores nuevos en `src/`**, no cero errores totales.

**Sobre la verificación en browser:** el dev server se levanta con `preview_start` usando la config `dev` que ya existe en `.claude/launch.json` (puerto 5173). La app está protegida por contraseña (`LockScreen`); si el agente no puede pasar el login, debe decirlo explícitamente y no reportar la verificación visual como hecha.

**Sobre verificar hover/focus de React vía automación** (aplica a las tareas 5, 6 y 9): `dispatchEvent(new MouseEvent('mouseenter'))` y `element.focus()` **no** disparan los handlers de React. React deriva `mouseenter` de `mouseover`/`mouseout` y delega `onFocus` desde `focusin`. Usá `dispatchEvent(new MouseEvent('mouseover', {bubbles:true}))` y `new FocusEvent('focusin', {bubbles:true})`. `onClick` sí mapea directo desde `click`. Esto está documentado en `.impeccable/lessons-learned.md`.

**Anti-checklist:** antes de cada commit, pasá el diff por los 14 items de `.impeccable/lessons-learned.md` §"Anti-checklist antes de commit". Los items críticos de esta pasada están marcados en cada tarea.

---

## Estructura de archivos

**Se crean:**
- `src/components/primitives/AcordeProceso/AcordeProceso.tsx` — stepper de 4 pasos que explica la construcción del acorde mayor y maneja el árbol. Dueño de la máquina de animación y del audio por paso.
- `src/components/primitives/AcordeProceso/AcordeProceso.module.css` — estilos del panel de pasos y los controles.

**Se modifican:**
- `src/data/notes.ts` — sube `spelledToES` (hoy privado en `AcordesBuilder`) para que lo compartan la primitiva y §1.7.
- `src/components/modules/t1/components/TriadasSection.tsx` — tabla §1.6 derivada de la tónica.
- `src/components/modules/t1/components/AcordesSection.tsx` — tercera línea de resultado, nomenclatura interpolada, y el `<ol>` estático reemplazado por `AcordeProceso`.
- `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx` + `.module.css` — modo controlado y destacado del arpegio.
- `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx` + `.module.css` — `maxStep` y fila de grados reproducible.
- `src/components/modules/t2/components/GradosArmonicosSection.tsx` — pasa `maxStep={3}`.
- `src/i18n/locales/es.json` + `de.json` — §1.7 nomenclatura, §1.8 nombre, copy de los pasos.
- `DESIGN.md` + `.impeccable/lessons-learned.md` — cierre de doctrina.

**Orden de tareas:** 1→2→3→4 son independientes entre sí. 5 debe ir antes de 7 (7 depende del modo controlado). 6 toca el mismo archivo que 5, así que va después para evitar conflictos. 8→9 tocan el mismo archivo, en ese orden. 10 cierra.

---

### Task 1: §1.8 — Renombrar a "Círculo de 5tas"

**Files:**
- Modify: `src/i18n/locales/es.json` (claves `t1.s08.label`, `t1.s08.title`)
- Modify: `src/i18n/locales/de.json` (claves `t1.s08.label`, `t1.s08.title`)

Ambas superficies (el `SectionLabel` de la sección y la entrada del sidebar vía `tocConfig.ts:14`) leen `t1.s08.label`, así que un solo cambio las cubre. El `<h2>` lee `t1.s08.title`.

- [ ] **Step 1: Ver los valores actuales**

Run:
```bash
node -e "const es=require('./src/i18n/locales/es.json'),de=require('./src/i18n/locales/de.json');console.log('ES label:',es.t1.s08.label);console.log('ES title:',es.t1.s08.title);console.log('DE label:',de.t1.s08.label);console.log('DE title:',de.t1.s08.title)"
```

Expected:
```
ES label: 1.8 · La regla de la 5J el "intervalo espejo"
ES title: Regla de la quinta justa con sus excepciones
DE label: 1.8 · Die Quintenzirkel-Regel – das "Spiegelintervall"
DE title: Die Quintenzirkel-Regel
```

- [ ] **Step 2: Editar `es.json`**

En el objeto `t1.s08`, reemplazar las dos claves:

```json
"label": "1.8 · Círculo de 5tas",
"title": "Círculo de 5tas",
```

- [ ] **Step 3: Editar `de.json`**

En el objeto `t1.s08`, reemplazar las dos claves:

```json
"label": "1.8 · Quintenzirkel",
"title": "Quintenzirkel",
```

Nota: el valor DE viejo contenía un en dash (`–`), que viola el item 6 de la anti-checklist. Desaparece con este cambio; no hay que hacer nada extra.

- [ ] **Step 4: Verificar que no quedó ningún em/en dash en las claves tocadas**

Run:
```bash
node -e "const es=require('./src/i18n/locales/es.json'),de=require('./src/i18n/locales/de.json');const v=[es.t1.s08.label,es.t1.s08.title,de.t1.s08.label,de.t1.s08.title];console.log(v.join('\n'));console.log('dashes:',v.filter(s=>/[—–]/.test(s)).length)"
```

Expected:
```
1.8 · Círculo de 5tas
Círculo de 5tas
1.8 · Quintenzirkel
Quintenzirkel
dashes: 0
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: termina sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/locales/es.json src/i18n/locales/de.json
git commit -m "feat(1.8): renombra la seccion a 'Circulo de 5tas' (label + h2)"
```

---

### Task 2: §1.6 — La tabla de tríadas arranca en la tónica global

**Files:**
- Modify: `src/components/modules/t1/components/TriadasSection.tsx`

Hoy las líneas 14-15 son constantes fijas desde F. Se derivan de la letra de la tónica activa. **Solo la letra** (`tonic[0]`), sin alteraciones: §1.6 es la etapa pedagógica de notas naturales. Es el mismo criterio que ya aplica `TriadaProceso.tsx:53`.

- [ ] **Step 1: Reemplazar las constantes por un derivador**

Borrar estas dos líneas (13-15 del archivo actual):

```tsx
// Datos musicales (§1.6): las 7 tríadas de las notas naturales, no UI copy.
const TRIADAS_TABLA_HEAD = ['F', 'G', 'A', 'B', 'C', 'D', 'E'] as const;
const TRIADAS_TABLA_ROW = ['F A C', 'G B D', 'A C E', 'B D F', 'C E G', 'D F A', 'E G B'] as const;
```

y poner en su lugar:

```tsx
// Datos musicales (§1.6): las 7 tríadas de las notas naturales, rotadas desde la
// letra de la tónica global. La etapa pedagógica es sin alteraciones, así que se
// toma sólo la letra (igual que TriadaProceso).
function buildTriadTable(root: NaturalNote): { head: NaturalNote[]; row: string[] } {
  const start = NATURALS.indexOf(root);
  const head = Array.from({ length: 7 }, (_, i) => NATURALS[(start + i) % 7]);
  const row = head.map((letter) => {
    const li = NATURALS.indexOf(letter);
    return [0, 2, 4].map((o) => NATURALS[(li + o) % 7]).join(' ');
  });
  return { head, row };
}
```

- [ ] **Step 2: Añadir los imports que faltan**

En el bloque de imports del archivo, añadir:

```tsx
import { useMemo } from 'react';
import { useUIStore } from '../../../../stores/useUIStore';
import { NATURALS } from '../../../../data/notes';
import type { NaturalNote } from '../../../../types/music';
```

`Fragment` ya se importa desde `react` en la línea 1 — dejar ese import y añadirle `useMemo`:

```tsx
import { Fragment, useMemo } from 'react';
```

`NoteSpelling` ya está importado desde `types/music`; añadir `NaturalNote` al mismo import en lugar de crear uno nuevo:

```tsx
import type { NaturalNote, NoteSpelling } from '../../../../types/music';
```

- [ ] **Step 3: Consumir la tónica dentro del componente**

Dentro de `TriadasSection`, después de `const maestra = ...`, añadir:

```tsx
  const tonic = useUIStore((s) => s.tonic);
  const { head, row } = useMemo(() => buildTriadTable(tonic[0] as NaturalNote), [tonic]);
```

- [ ] **Step 4: Apuntar la tabla a los datos derivados**

Reemplazar `TRIADAS_TABLA_HEAD.map(...)` por `head.map(...)` y `TRIADAS_TABLA_ROW.map(...)` por `row.map(...)`. El bloque de la tabla queda:

```tsx
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col"><NoteToken note={h} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {row.map((c, i) => (
                <td key={i}>{renderTriadCell(c)}</td>
              ))}
            </tr>
          </tbody>
```

`renderTriadCell` no cambia.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: termina sin errores. Si `tsc` se queja de que `TRIADAS_TABLA_HEAD` no se usa, es que quedó una constante sin borrar — borrala.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: cero errores nuevos en `src/`.

- [ ] **Step 7: Verificar en browser**

Levantar el preview (`preview_start` con `{name: "dev"}`), navegar a `/t1`, ir a la sección "1.6 · Las 7 tríadas" y cambiar la tónica global con el selector del header.

Verificar:
- Tónica **C** → encabezados `C D E F G A B`, primera celda `C E G`, segunda `D F A`.
- Tónica **F** → encabezados `F G A B C D E`, primera celda `F A C` (idéntica a la tabla anterior al cambio).
- Tónica **F♯** → encabezados `F G A B C D E` (la alteración no aparece: es lo esperado en esta etapa).
- Ninguna celda muestra `♯` ni `♭`.

- [ ] **Step 8: Commit**

```bash
git add src/components/modules/t1/components/TriadasSection.tsx
git commit -m "feat(1.6): la tabla de triadas arranca en la tonica global"
```

---

### Task 3: §1.7 — Tercera línea de resultado (acorde disminuido)

**Files:**
- Modify: `src/components/modules/t1/components/AcordesSection.tsx:113-182`

`chordSpelled` ya soporta `'dim'` (`noteCalculations.ts:146,151`: quinta a 6 semitonos). La clave `common.diminished` ya existe en ambos locales (`"dim."` / `"verm."`).

- [ ] **Step 1: Derivar el acorde disminuido**

Después de la línea `const chordm = useMemo(() => chordSpelled(tonic, "m"), [tonic]);` añadir:

```tsx
  const chordDim = useMemo(() => chordSpelled(tonic, "dim"), [tonic]);
```

- [ ] **Step 2: Añadir la tercera línea al bloque de resultado**

Después del `<p className={styles.text}>` que renderiza el menor (líneas 179-182), añadir:

```tsx
      <p className={styles.text}>
        {chordDim[0].spelled} {t("common.diminished")} ={" "}
        {chordDim.map((m) => m.spelled).join("  ")}
      </p>
```

El mayor conserva `styles.resultado` (el recuadro): es el acorde que construye el stepper. Menor y disminuido comparten `styles.text`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: termina sin errores.

- [ ] **Step 4: Verificar en browser**

Con tónica **D**, la sección 1.7 debe mostrar tres líneas seguidas:

```
D mayor = D  F♯  A     (en el recuadro)
D menor = D  F  A
D dim. = D  F  A♭
```

Con tónica **C**: `C dim. = C  E♭  G♭`.

- [ ] **Step 5: Commit**

```bash
git add src/components/modules/t1/components/AcordesSection.tsx
git commit -m "feat(1.7): agrega el acorde disminuido al bloque de resultado"
```

---

### Task 4: §1.7 — Nomenclatura anclada a la tónica global

**Files:**
- Modify: `src/data/notes.ts` (sube el helper de solfeo)
- Modify: `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx:14-20` (consume el helper compartido)
- Modify: `src/components/modules/t1/components/AcordesSection.tsx`
- Modify: `src/i18n/locales/es.json` (`t1.s07.notation_*`)
- Modify: `src/i18n/locales/de.json` (`t1.s07.notation_*`)

Hoy las tres líneas de nomenclatura tienen la F congelada. Pasan a interpolación i18n con `{{sym}}` (grafía) y `{{name}}` (nombre en solfeo).

**Nota sobre el alemán:** la copy DE actual dice `F = Fa Dur` — usa solfeo español dentro del texto alemán. Es una rareza preexistente. **No la arregles en esta pasada**: preservá la forma (`{{name}}` sigue siendo el solfeo) para que el diff sea quirúrgico. Se anota como deuda en la Task 10.

- [ ] **Step 1: Subir `spelledToES` a `data/notes.ts`**

Al final de `src/data/notes.ts`, añadir:

```ts
// Nombre en solfeo derivado de la grafía (no de la cromática), para que coincida
// con el glifo que se muestra. Mapea la letra y conserva ♭/♯.
const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};

export function spelledToES(spelled: string): string {
  return (LETTER_ES[spelled[0]] ?? spelled[0]) + spelled.slice(1);
}
```

- [ ] **Step 2: Hacer que `AcordesBuilder` consuma el helper compartido**

En `AcordesBuilder.tsx`, borrar el bloque local (líneas 13-20):

```tsx
// El "Nombre en latino" deriva del spelled (no del chromatic) para coincidir con
// el glifo del nodo. Mapea letra → solfeo, conservando ♭/♯.
const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};
function spelledES(spelled: string): string {
  return (LETTER_ES[spelled[0]] ?? spelled[0]) + spelled.slice(1);
}
```

y cambiar el import de `data/notes` para traer el helper:

```tsx
import { NOTE_COLORS, spelledToES } from '../../../data/notes';
```

Luego reemplazar los dos usos de `spelledES(` por `spelledToES(` en el archivo (líneas 239 y 316 del original: `spelledES(tonicMember.spelled)` y `const nameES = spelledES(member.spelled)`).

- [ ] **Step 3: Verificar que no quedó ningún `spelledES` suelto**

Run:
```bash
grep -rn "spelledES" src/ || echo "sin residuos"
```
Expected: `sin residuos`

- [ ] **Step 4: Editar `es.json`**

En `t1.s07`, reemplazar las tres claves:

```json
"notation_major": "Acorde mayor: solo la letra. {{sym}} = {{name}} mayor.",
"notation_minor": "Acorde menor: letra + \"m\" minúscula. {{sym}}m = {{name}} menor.",
"notation_diminished": "Acorde disminuido: letra + \"dim\". {{sym}}dim = {{name}} disminuido.",
```

- [ ] **Step 5: Editar `de.json`**

En `t1.s07`, reemplazar las tres claves:

```json
"notation_major": "Durakkord → nur der Buchstabe. {{sym}} = {{name}} Dur.",
"notation_minor": "Mollakkord → Buchstabe + kleines „m\". {{sym}}m = {{name}} Moll.",
"notation_diminished": "Verminderter Akkord → Buchstabe + „dim\". {{sym}}dim = {{name}} vermindert.",
```

- [ ] **Step 6: Alimentar las variables desde `AcordesSection`**

En `AcordesSection.tsx`, añadir el import del helper:

```tsx
import { spelledToES } from "../../../../data/notes";
```

Dentro del componente, después de `const chordDim = ...`, añadir:

```tsx
  // §1.7: la nomenclatura se ancla a la tónica global, no a una nota fija.
  const notation = useMemo(
    () => ({ sym: chordM[0].spelled, name: spelledToES(chordM[0].spelled) }),
    [chordM],
  );
```

y pasar las variables a las tres traducciones (hoy líneas 151-155):

```tsx
      <ul className={styles.nomList}>
        <li>{t("t1.s07.notation_major", notation)}</li>
        <li>{t("t1.s07.notation_minor", notation)}</li>
        <li>{t("t1.s07.notation_diminished", notation)}</li>
      </ul>
```

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: termina sin errores.

- [ ] **Step 8: Verificar en browser**

Con tónica **D** en ES, la lista de nomenclatura debe leer:
```
· Acorde mayor: solo la letra. D = Re mayor.
· Acorde menor: letra + "m" minúscula. Dm = Re menor.
· Acorde disminuido: letra + "dim". Ddim = Re disminuido.
```

Con tónica **B♭** en ES: `B♭ = Si♭ mayor`, `B♭m`, `B♭dim`.

Cambiar el idioma a DE con tónica **D**: `D = Re Dur.` (el solfeo en alemán es la rareza preexistente que NO se arregla acá).

Confirmar que el glifo `♯`/`♭` se renderiza correcto y no aparece escapado como entidad HTML.

- [ ] **Step 9: Verificar que el árbol de §1.7 no se rompió**

En la misma página, hacer hover sobre los nodos del árbol constructor: el nombre en solfeo bajo cada nodo (`Do`, `Mi♭`, …) debe seguir apareciendo igual que antes del refactor. Ese es el consumidor que movimos en el Step 2.

- [ ] **Step 10: Commit**

```bash
git add src/data/notes.ts src/components/primitives/AcordesBuilder/AcordesBuilder.tsx src/components/modules/t1/components/AcordesSection.tsx src/i18n/locales/es.json src/i18n/locales/de.json
git commit -m "feat(1.7): la nomenclatura de acordes se ancla a la tonica global"
```

---

### Task 5: `AcordesBuilder` — modo controlado

**Files:**
- Modify: `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx`

Prepara el árbol para que la Task 7 lo maneje desde afuera. **Props opcionales con default `undefined`**: los 4 consumidores de T3 (`ConstructorCompletoSection`, `DisminuidosSection`, `SeptimaAcordesSection`, `SuspendidosSection`) no cambian de comportamiento.

- [ ] **Step 1: Exportar el centinela de "suenan todos" y ampliar `Props`**

Cerca de las constantes del tope del archivo (después de `const R = 24;`), añadir:

```tsx
/** Centinela para `playingRole`: el acorde suena en bloque, no hay una sola nota. */
export const PLAYING_ALL = '*';
```

Reemplazar la interfaz `Props` (líneas 27-29):

```tsx
interface Props {
  config?: BuilderConfig;
  /** Camino forzado desde afuera (walkthrough). Si está presente, el árbol es
   *  controlado y `selected` interno queda en pausa. `undefined` = modo libre. */
  path?: string[];
  /** Rol del nodo que suena ahora; `PLAYING_ALL` si suena el acorde entero. */
  playingRole?: string | null;
  /** El estudiante tocó un nodo: el dueño del walkthrough debe soltar el control. */
  onUserPick?: () => void;
}
```

- [ ] **Step 2: Derivar `selected` del modo**

Reemplazar la línea `const [selected, setSelected] = useState<string[]>([]);` por:

```tsx
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const controlled = path !== undefined;
  const selected = controlled ? path : internalSelected;
```

y actualizar la firma del componente:

```tsx
export default function AcordesBuilder({ config = BUILDER_17, path, playingRole, onUserPick }: Props) {
```

- [ ] **Step 3: Reescribir `pickNode` para que suelte el control**

Reemplazar `pickNode` (líneas 105-114) por:

```tsx
  const pickNode = useCallback(
    (node: BuilderNode) => {
      const L = node.level;
      // Parte del camino visible (controlado o interno) para que soltar el control
      // se sienta continuo: el clic edita lo que el estudiante está viendo.
      const base = controlled ? path! : internalSelected;
      const next =
        base[L - 1] === node.role
          ? base.slice(0, L - 1) // re-clic deselecciona
          : [...base.slice(0, L - 1), node.role];
      setInternalSelected(next);
      onUserPick?.();
    },
    [controlled, path, internalSelected, onUserPick],
  );
```

- [ ] **Step 4: Hacer que el highlight respete el modo**

Reemplazar `nodePlaying` (líneas 147-149) por:

```tsx
  // Cadena activa (incluye la tónica) para el highlight arpegiado y las aristas.
  const chain = useMemo(() => ['T', ...selected], [selected]);
  // La reproducción interna (los botones del readout) tiene prioridad: el
  // estudiante puede pulsar arpegio aunque el walkthrough esté manejando el
  // camino, y el destaque debe seguir a lo que realmente suena.
  const nodePlaying = (role: string) => {
    if (playIdx != null) return playIdx === -1 || chain[playIdx] === role;
    if (controlled) return playingRole === role || playingRole === PLAYING_ALL;
    return false;
  };
```

- [ ] **Step 5: Suprimir el hint cuando el árbol está controlado**

Durante el walkthrough las instrucciones ("Elegí una tercera para empezar…") son engañosas: el estudiante no está eligiendo. El panel de pasos ya explica.

Reemplazar el bloque `) : (` del readout (líneas 261-267) por:

```tsx
        ) : controlled ? null : (
          <p className={styles.hint}>
            {selected.length === 0
              ? 'Elegí una tercera para empezar a construir.'
              : 'Seguí eligiendo notas para completar un acorde.'}
          </p>
        )}
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: termina sin errores.

- [ ] **Step 7: Verificar que T3 no tuvo regresión**

En el browser, recorrer las cuatro secciones de T3 que usan el árbol: §3.1.2 (acordes con séptimas), §3.2 (disminuidos), §3.3 (suspendidos), §3.4 (constructor completo).

En cada una: elegir un camino completo por clic, confirmar que el readout muestra el nombre y el cifrado del acorde, y que los botones de bloque y arpegio suenan. Ninguna pasa `path`, así que las cuatro siguen en modo libre.

Recordá que para verificar hover vía automación hay que dispatchear `mouseover`, no `mouseenter` (ver la nota del tope del plan).

- [ ] **Step 8: Commit**

```bash
git add src/components/primitives/AcordesBuilder/AcordesBuilder.tsx
git commit -m "feat(arbol): modo controlado opcional en AcordesBuilder"
```

---

### Task 6: Árboles — destacar qué nota suena en el arpegio

**Files:**
- Modify: `src/components/primitives/AcordesBuilder/AcordesBuilder.tsx`
- Modify: `src/components/primitives/AcordesBuilder/AcordesBuilder.module.css`

**El problema:** la línea 312 marca como `colored` cualquier nodo en hover, seleccionado o sonando. Durante el arpegio **todos los nodos de la cadena ya están seleccionados**, o sea todos saturados. La única diferencia del que suena es un anillo ámbar de 2px — invisible en proyección de clase.

**La restricción:** bajo la Note-Color Quarantine no se puede meter un color nuevo para "está sonando". La doctrina exige combinar los ejes no-color. Se usan los tres: opacity (atenuar hermanos), geometría (anillo más grueso + escala), y texto (nombrar la nota en el readout).

**Cuidado con el `transform`:** los nodos son `<g transform="translate(x,y)">` (atributo de presentación). Una regla CSS `transform` sobre ese mismo `<g>` **reemplaza** el translate y manda el nodo al origen. Por eso la escala va en un `<g>` interno, cuyo origen local ya es el centro del nodo.

- [ ] **Step 1: Calcular si hay una nota individual sonando**

En el cuerpo de `AcordesBuilder`, justo después de la definición de `nodePlaying`, añadir:

```tsx
  // ¿Suena UNA nota concreta? (en bloque suenan todas: no se atenúa nada)
  // Mismo orden de prioridad que nodePlaying: lo interno manda si está activo.
  const soloPlaying =
    playIdx != null
      ? playIdx >= 0
      : controlled && playingRole != null && playingRole !== PLAYING_ALL;

  // Nota que suena ahora, para nombrarla en el readout (anti-checklist item 12:
  // el audio nunca es el único portador de la información).
  const playingSpelled = useMemo(() => {
    if (!soloPlaying) return '';
    const role = playIdx != null ? chain[playIdx] : playingRole!;
    return members.get(role)?.spelled ?? '';
  }, [soloPlaying, playingRole, chain, playIdx, members]);
```

- [ ] **Step 2: Pasar `dimmed` a la tónica y a los nodos**

En el `<Node>` de la tónica (líneas 201-210), añadir la prop:

```tsx
          playing={nodePlaying('T')}
          dimmed={soloPlaying && !nodePlaying('T')}
```

En el `<Node>` del `map` de nodos (líneas 219-231), reemplazar la línea `playing={selectedNode && nodePlaying(node.role)}` por:

```tsx
              playing={selectedNode && nodePlaying(node.role)}
              dimmed={soloPlaying && selectedNode && !nodePlaying(node.role)}
```

- [ ] **Step 3: Nombrar la nota que suena en el readout**

Dentro del bloque `{currentChord && chordMembers ? (`, después del `<p className={styles.chordNotes}>`, añadir:

```tsx
            <p className={styles.nowPlaying}>{playingSpelled}</p>
```

El `<p>` se renderiza siempre (vacío cuando no suena nada) para que no haya salto de layout al aparecer. El contenedor `.readout` ya es `role="status" aria-live="polite"`, así que un lector de pantalla también anuncia la nota.

- [ ] **Step 4: Aceptar `dimmed` en `NodeProps` y aplicarlo**

En `interface NodeProps` añadir:

```tsx
  dimmed?: boolean;
```

En la firma de `Node`, añadir `dimmed` a la desestructuración:

```tsx
function Node({ role, x, y, quality, member, state, playing, dimmed, onSelect, onScrub }: NodeProps) {
```

En el `<g>`, añadir la clase de atenuado a la lista existente:

```tsx
      className={`${styles.node} ${state === 'disabled' ? styles.nodeDisabled : ''} ${dimmed ? styles.nodeDimmed : ''}`}
```

- [ ] **Step 5: Envolver los círculos y el glifo en un `<g>` escalable**

Reemplazar el bloque que va desde el `{playing && (` hasta el cierre del primer `<text>` (líneas 340-355) por:

```tsx
      {/* La escala va en un <g> interno: una regla CSS `transform` sobre el <g>
          externo reemplazaría su atributo translate y movería el nodo al origen. */}
      <g className={playing ? styles.nodePulse : undefined}>
        {playing && (
          <circle cx={0} cy={0} r={R + 6} fill="none" stroke="var(--amber)" strokeWidth={3} />
        )}
        <circle cx={0} cy={0} r={R} fill={fill} stroke={stroke} strokeWidth={1.5} />
        {/* Reposo: rol (función) en Plex Mono, que preserva mayús/minús (así 3m≠3M
            y 5d≠5). Activo: glifo de la nota en Bebas, blanco sobre el círculo
            saturado (excepción Signature). */}
        <text
          className={colored ? styles.nodeGlyph : roleClass}
          x={0}
          y={1}
          fill={colored ? '#fff' : 'var(--text-body)'}
          style={colored && member.spelled.length > 2 ? { fontSize: '13px' } : undefined}
        >
          {colored ? member.spelled : role}
        </text>
      </g>
```

El `<circle className={styles.hit}>` queda **fuera** de este `<g>`, como hijo directo, para que la regla `.node > * { pointer-events: none }` + `.hit { pointer-events: all !important }` siga funcionando. El `<text>` del nombre (`nodeName`) también queda fuera: no se escala.

- [ ] **Step 6: Añadir las clases al CSS module**

Al final de `AcordesBuilder.module.css`, antes del `@media (max-width: 600px)`, añadir:

```css
/* === destacado del arpegio ===
   Bajo la Note-Color Quarantine el "está sonando" no puede ser un color nuevo:
   se codifica con opacity (hermanos atenuados) + geometría (anillo y escala) +
   el nombre de la nota en el readout. */
.nodeDimmed {
  opacity: 0.35;
  transition: opacity 0.2s ease;
}

.nodePulse {
  transform: scale(1.12);
  transition: transform 0.18s ease;
}

.nowPlaying {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--amber);
  min-height: 19px;
  margin: 0 0 8px;
}

@media (prefers-reduced-motion: reduce) {
  .nodePulse {
    transform: none;
  }
}
```

Nota: el override global de `global.css` neutraliza la *duración* de la transición pero no el `transform` en sí, por eso hace falta el media query explícito.

- [ ] **Step 7: Build y lint**

Run: `npm run build`
Expected: termina sin errores.

Run: `npm run lint`
Expected: cero errores nuevos en `src/`.

- [ ] **Step 8: Verificar en browser**

En §1.7 (o §3.4, que tiene el árbol más grande): elegir un camino completo y pulsar **arpegio**.

Verificar:
- En cada momento hay **exactamente un** nodo destacado: más grande, con anillo ámbar grueso, mientras los otros nodos del camino bajan a opacidad.
- El destaque avanza tónica → tercera → quinta al ritmo del audio.
- El readout muestra el nombre de la nota que suena y cambia con ella.
- Pulsando **bloque**: no se atenúa ningún nodo (suenan todos) y el readout no nombra ninguna nota individual.
- El layout no salta cuando aparece o desaparece la línea del readout.

Verificar también el hit-testing, que es donde este componente ya tuvo un bug: con `document.elementFromPoint(x, y)` en el centro geométrico de un nodo, el elemento resuelto debe ser el `circle.hit`, no el círculo visible ni el `<g>` nuevo.

- [ ] **Step 9: Verificar `prefers-reduced-motion`**

Con `resize_window` o emulación de la preferencia, activar `prefers-reduced-motion: reduce` y repetir el arpegio: el nodo que suena **no** debe crecer, pero el anillo ámbar y la atenuación de los hermanos deben seguir presentes.

- [ ] **Step 10: Commit**

```bash
git add src/components/primitives/AcordesBuilder/AcordesBuilder.tsx src/components/primitives/AcordesBuilder/AcordesBuilder.module.css
git commit -m "feat(arbol): destaca la nota que suena durante el arpegio"
```

---

### Task 7: §1.7 — Stepper animado sobre el árbol

**Files:**
- Create: `src/components/primitives/AcordeProceso/AcordeProceso.tsx`
- Create: `src/components/primitives/AcordeProceso/AcordeProceso.module.css`
- Modify: `src/components/modules/t1/components/AcordesSection.tsx`
- Modify: `src/i18n/locales/es.json` (nueva clave `t1.s07.process_eyebrow`)
- Modify: `src/i18n/locales/de.json` (nueva clave `t1.s07.process_eyebrow`)

La primitiva nueva es dueña de la máquina de pasos, del audio por paso, y **compone el árbol** — no dibuja uno propio. Las funciones que arman el texto de los pasos (`buildPasoLetras`, `buildPasoSemitonos`) se **mueven** desde `AcordesSection.tsx` sin reescribir su lógica: es contenido pedagógico ya validado.

- [ ] **Step 1: Añadir la clave del eyebrow a `es.json`**

En el objeto `t1.s07`, añadir:

```json
"process_eyebrow": "Cómo se construye, paso a paso",
```

- [ ] **Step 2: Añadir la clave del eyebrow a `de.json`**

En el objeto `t1.s07`, añadir:

```json
"process_eyebrow": "Wie er aufgebaut wird, Schritt für Schritt",
```

- [ ] **Step 3: Crear `AcordeProceso.tsx`**

Contenido completo del archivo:

```tsx
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import {
  chordSpelled,
  spelledChromaticCircle,
  spelledIntervalFromTonic,
} from '../../../utils/noteCalculations';
import { useProcessAnimation } from '../../modules/t2/hooks/useProcessAnimation';
import Prose from '../../shared/Prose/Prose';
import AcordesBuilder, { PLAYING_ALL } from '../AcordesBuilder/AcordesBuilder';
import type { NoteSpelling, Tonic } from '../../../types/music';
import type { ProseSegment, ProseFragment } from '../../../types/prose';
import styles from './AcordeProceso.module.css';

// §1.7 · El ejemplo por pasos deja de ser una lista muerta: recorre el árbol
// iluminando y sonando cada nota. Reutiliza la máquina de pasos de §2.3/§2.4
// (respeta prefers-reduced-motion) y el árbol de AcordesBuilder en modo
// controlado — un solo diagrama, no dos.
//
// Construye SIEMPRE la tríada mayor (decisión del profesor, 31/7/26). Menor y
// disminuido viven en el bloque de resultado de la sección, sin animación.

const TOTAL_STEPS = 4;

// Camino del acorde mayor en BUILDER_17: T → 3M → 5J.
const PATH_BY_STEP: string[][] = [
  [],           // paso 1 · sólo la tónica
  ['3M'],       // paso 2 · tercera mayor
  ['3M', '5'],  // paso 3 · quinta justa
  ['3M', '5'],  // paso 4 · resultado (suena en bloque)
];

const PLAYING_BY_STEP: (string | null)[] = ['T', '3M', '5', PLAYING_ALL];

const ASCII = (s: string) => s.replace('♯', '#').replace('♭', 'b');

function buildPasoLetras(tonic: Tonic, locale: string): ProseSegment {
  const [t1, t3, t5] = chordSpelled(tonic, 'M').map(
    (m) => ASCII(m.spelled) as NoteSpelling,
  );
  const prefix =
    locale === 'de' ? 'Buchstaben der Trias: ' : 'Letras de la tríada: ';
  return [
    { type: 'text', value: prefix },
    { type: 'note', value: t1 },
    { type: 'text', value: ' ' },
    { type: 'note', value: t3 },
    { type: 'text', value: ' ' },
    { type: 'note', value: t5 },
    { type: 'text', value: '.' },
  ];
}

function buildPasoSemitonos(
  tonic: Tonic,
  targetSemis: number,
  targetSpelled: string,
  letterRuleNote: string,
  locale: string,
): ProseSegment {
  const circle = spelledChromaticCircle(tonic);
  const tonicAscii = ASCII(circle[0].sharp) as NoteSpelling;
  const isTercera = targetSemis === 4;
  const prefix =
    locale === 'de'
      ? isTercera
        ? 'Halbtöne bis zur gr. Terz: '
        : 'Halbtöne bis zur r. Quinte: '
      : isTercera
        ? 'Semitonos hasta la 3M: '
        : 'Semitonos hasta la 5J: ';

  const seg: ProseFragment[] = [
    { type: 'text', value: prefix },
    { type: 'note', value: tonicAscii },
  ];
  for (let i = 1; i <= targetSemis; i++) {
    const step = circle[i];
    seg.push({ type: 'text', value: ' → ' });
    const sharpAscii = ASCII(step.sharp) as NoteSpelling;
    if (step.flat) {
      const flatAscii = ASCII(step.flat) as NoteSpelling;
      seg.push(
        { type: 'note', value: sharpAscii },
        { type: 'text', value: '/' },
        { type: 'note', value: flatAscii },
      );
    } else {
      seg.push({ type: 'note', value: sharpAscii });
    }
    seg.push({ type: 'text', value: ` (${i})` });
  }

  // Solo añadimos la caveat de la "regla del paso 1" en la 3M cuando hay ambigüedad enarmónica.
  const finalStep = circle[targetSemis];
  if (isTercera && finalStep.flat) {
    const correctAscii = ASCII(targetSpelled) as NoteSpelling;
    const altAscii = ASCII(
      correctAscii.length === 2 && correctAscii[1] === '#'
        ? (finalStep.flat as string)
        : (finalStep.sharp as string),
    ) as NoteSpelling;
    seg.push({
      type: 'text',
      value:
        locale === 'de'
          ? '. Nach der Regel aus Schritt 1 ist der Buchstabe '
          : '. Por la regla del paso 1, la letra es ',
    });
    seg.push({ type: 'note', value: ASCII(letterRuleNote) as NoteSpelling });
    seg.push({
      type: 'text',
      value: locale === 'de' ? ', also ist es ' : ', entonces es ',
    });
    seg.push({ type: 'note', value: correctAscii });
    seg.push({ type: 'text', value: locale === 'de' ? ' (nicht ' : ' (no ' });
    seg.push({ type: 'note', value: altAscii });
    seg.push({ type: 'text', value: ').' });
  } else {
    seg.push({ type: 'text', value: '.' });
  }
  return seg;
}

function buildPasoResultado(tonic: Tonic, locale: string): ProseSegment {
  const members = chordSpelled(tonic, 'M');
  const prefix = locale === 'de' ? 'Ergebnis: ' : 'Resultado: ';
  const suffix =
    locale === 'de' ? ' · der Durakkord.' : ' · el acorde mayor.';
  const seg: ProseFragment[] = [{ type: 'text', value: prefix }];
  members.forEach((m, i) => {
    if (i > 0) seg.push({ type: 'text', value: ' ' });
    seg.push({ type: 'note', value: ASCII(m.spelled) as NoteSpelling });
  });
  seg.push({ type: 'text', value: suffix });
  return seg;
}

export default function AcordeProceso() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isDe = locale === 'de';
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const anim = useProcessAnimation(TOTAL_STEPS);
  const lastAudioStep = useRef(0);

  const chordM = useMemo(() => chordSpelled(tonic, 'M'), [tonic]);

  const steps = useMemo<ProseSegment[]>(() => {
    const tercera = spelledIntervalFromTonic(tonic, 3, 'M');
    return [
      buildPasoLetras(tonic, locale),
      buildPasoSemitonos(tonic, 4, tercera, tercera[0], locale),
      buildPasoSemitonos(
        tonic,
        7,
        spelledIntervalFromTonic(tonic, 5, 'P'),
        '',
        locale,
      ),
      buildPasoResultado(tonic, locale),
    ];
  }, [tonic, locale]);

  // Refs para leer los valores más recientes sin que su cambio de referencia
  // re-dispare el efecto de audio: ese efecto sólo debe sonar cuando cambia el
  // número de paso (mismo patrón que TriadaProceso).
  const chordRef = useRef(chordM);
  const playNoteRef = useRef(playNote);
  chordRef.current = chordM;
  playNoteRef.current = playNote;

  // Reinicia al cambiar la tónica.
  useEffect(() => {
    anim.reset();
    lastAudioStep.current = 0;
    stopAllNotes();
  }, [tonic]); // eslint-disable-line react-hooks/exhaustive-deps

  // Audio atado al paso visible (nunca audio sin estado visual paralelo).
  // Pasos 1/2/3 suenan la nota que se acaba de añadir; el paso 4 suena el
  // acorde en bloque (traslape deliberado: es un acorde).
  useEffect(() => {
    const s = anim.currentStep;
    if (s === 0 || s === lastAudioStep.current) return;
    lastAudioStep.current = s;
    const ms = chordRef.current;
    const pn = playNoteRef.current;
    if (s >= 1 && s <= 3) pn(ms[s - 1].chromatic, ms[s - 1].octave, 1.6);
    else if (s === 4) ms.forEach((m) => pn(m.chromatic, m.octave, 2.2));
  }, [anim.currentStep]);

  const current = anim.currentStep;
  const running = current > 0;
  const playLabel =
    anim.mode === 'playing'
      ? isDe ? 'Pausieren' : 'Pausar'
      : isDe ? 'Abspielen' : 'Reproducir';

  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>{t('t1.s07.process_eyebrow')}</span>

      <div className={styles.layout}>
        <AcordesBuilder
          path={running ? PATH_BY_STEP[current - 1] : undefined}
          playingRole={running ? PLAYING_BY_STEP[current - 1] : null}
          onUserPick={anim.reset}
        />

        <ol className={styles.steps}>
          {steps.map((seg, i) => {
            const stepNum = i + 1;
            const active = stepNum === current;
            const past = stepNum < current;
            const isResult = stepNum === TOTAL_STEPS;
            return (
              <li
                key={i}
                className={`${styles.step} ${active ? styles.stepActive : ''} ${past ? styles.stepPast : ''} ${isResult ? styles.stepResult : ''}`}
                aria-current={active ? 'step' : undefined}
              >
                <span className={styles.stepNum}>{stepNum}</span>
                <Prose segment={seg} />
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.ctrl}
          onClick={anim.prev}
          disabled={current <= 0}
          aria-label={isDe ? 'Vorheriger Schritt' : 'Paso anterior'}
        >
          ◀
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={anim.mode === 'playing' ? anim.pause : anim.play}
          aria-label={playLabel}
        >
          {anim.mode === 'playing' ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={anim.next}
          disabled={current >= TOTAL_STEPS}
          aria-label={isDe ? 'Nächster Schritt' : 'Paso siguiente'}
        >
          ▶▶
        </button>
        <span className={styles.spacer} />
        <label className={styles.speedWrap}>
          <span className={styles.speedLabel}>{isDe ? 'Tempo' : 'Velocidad'}</span>
          <select
            className={styles.speedSelect}
            value={anim.speed}
            onChange={(e) => anim.setSpeed(e.target.value as 'normal' | 'slow')}
          >
            <option value="normal">normal</option>
            <option value="slow">{isDe ? 'langsam' : 'lento'}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Crear `AcordeProceso.module.css`**

Contenido completo del archivo. Los estilos del panel de pasos y de los controles replican deliberadamente los de `TriadaProceso.module.css`: §1.6 y §1.7 son dos explicaciones hermanas y deben leerse igual.

```css
.wrap {
  margin: 20px 0 8px;
}

.eyebrow {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 16px;
}

.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
}

.layout > :first-child {
  flex: 1 1 340px;
  min-width: 0;
}

/* ── Panel de pasos ────────────────────────────────────────── */
.steps {
  flex: 1 1 300px;
  min-width: 260px;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  padding: 8px 12px;
  transition: background 0.3s ease, color 0.3s ease;
}

.stepNum {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  min-width: 14px;
}

.stepActive {
  background: color-mix(in srgb, var(--red) 8%, transparent);
  color: var(--paper);
  font-weight: 500;
}

.stepActive .stepNum {
  color: var(--red);
}

.stepPast {
  color: var(--text-body);
}

.stepResult {
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.3px;
}

/* ── Controles ─────────────────────────────────────────────── */
.controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.ctrl {
  font-size: 13px;
  padding: 6px 14px;
  border: 1px solid var(--rule);
  background: none;
  color: var(--paper);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease;
}

.ctrl:hover:not(:disabled) {
  border-color: var(--amber);
}

.ctrl:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}

.ctrl:disabled {
  opacity: 0.3;
  cursor: default;
}

.spacer {
  flex: 1;
}

.speedWrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.speedLabel {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  text-transform: lowercase;
}

.speedSelect {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  padding: 4px 8px;
  border: 1px solid var(--rule);
  background: var(--surface);
  color: var(--paper);
  cursor: pointer;
}

@media (max-width: 720px) {
  .layout {
    gap: 16px;
  }
}
```

- [ ] **Step 5: Limpiar `AcordesSection.tsx` — borrar lo que se movió**

Borrar de `AcordesSection.tsx`:

1. El comentario y las funciones `ASCII`, `buildPasoLetras`, `buildPasoSemitonos` completas (desde `// Reunión 24/5/26 — el ejemplo se reconstruye...` hasta el cierre de `buildPasoSemitonos`).
2. El `useMemo` de `ejemploPasos` completo.
3. El `<h3>` del ejemplo y su `<ol className={styles.steps}>`:

```tsx
      <h3 className={styles.subheading}>
        {chordM[0].spelled} {t("common.major")}
      </h3>
      <ol className={styles.steps}>
        {ejemploPasos.map((p, i) => (
          <li key={i}>
            <Prose segment={p} />
          </li>
        ))}
      </ol>
```

4. El `<h3>` del constructor y su párrafo de instrucciones bilingüe completo (desde `<h3 className={styles.subheading}>{locale === "de" ? "Akkord-Konstruktor" ...` hasta el `</p>` que cierra las instrucciones del árbol), más el `<AcordesBuilder />` suelto. Todo eso lo absorbe `AcordeProceso`.

- [ ] **Step 6: Montar `AcordeProceso` en su lugar**

En `AcordesSection.tsx`, cambiar los imports: quitar `Prose`, `AcordesBuilder` y las utilidades que ya no se usan; dejar los que siguen vivos. Los imports quedan:

```tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "../../../shared/SectionLabel";
import AcordeProceso from "../../../primitives/AcordeProceso/AcordeProceso";
import { useUIStore } from "../../../../stores/useUIStore";
import { spelledToES } from "../../../../data/notes";
import { chordSpelled } from "../../../../utils/noteCalculations";
import styles from "./AcordesSection.module.css";
```

Nota: `locale` deja de usarse si no queda ningún texto bilingüe inline; si `tsc` avisa que `i18n` o `locale` quedaron sin uso, quitalos de la desestructuración de `useTranslation()`.

En el JSX, después del `<ol className={styles.steps}>` del procedimiento (el que lista `t1.s07.procedure`, que **se queda**), montar la primitiva.

**Ojo:** el bloque de resultado de tres líneas ya existe — lo dejó la Task 3 y el Step 5 no lo borró. Sólo hay que insertar `<AcordeProceso />` justo antes. El resultado final de esa zona del JSX debe quedar exactamente así:

```tsx
      <AcordeProceso />

      <p className={styles.resultado}>
        {chordM[0].spelled} {t("common.major")} ={" "}
        {chordM.map((m) => m.spelled).join("  ")}
      </p>
      <p className={styles.text}>
        {chordm[0].spelled} {t("common.minor")} ={" "}
        {chordm.map((m) => m.spelled).join("  ")}
      </p>
      <p className={styles.text}>
        {chordDim[0].spelled} {t("common.diminished")} ={" "}
        {chordDim.map((m) => m.spelled).join("  ")}
      </p>
```

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: termina sin errores. Los errores más probables son imports huérfanos en `AcordesSection.tsx` (`Prose`, `spelledChromaticCircle`, `spelledIntervalFromTonic`, `ProseSegment`, `ProseFragment`, `NoteSpelling`, `Tonic`, `AcordesBuilder`): quitá los que `tsc` reporte sin uso.

- [ ] **Step 8: Lint**

Run: `npm run lint`
Expected: cero errores nuevos en `src/`.

- [ ] **Step 9: Verificar el recorrido en browser**

En §1.7 con tónica **D**:

- Estado inicial (paso 0): el árbol está en modo libre; se puede construir por clic como antes.
- `▶` arranca el recorrido. Paso a paso:
  - **1** — texto `Letras de la tríada: D F♯ A.`; en el árbol se destaca la tónica; suena `D`.
  - **2** — texto de los semitonos hasta la 3M; se destaca el nodo `3M`; suena `F♯`.
  - **3** — texto de los semitonos hasta la 5J; se destaca el nodo `5`; suena `A`.
  - **4** — texto `Resultado: D F♯ A · el acorde mayor.`; suena el acorde en bloque; ningún nodo se atenúa.
- El readout del árbol muestra `Re mayor` con su cifrado a partir del paso 3 (cuando el camino ya forma un acorde válido).
- `◀` y `▶▶` navegan sin desincronizar audio y estado visual.
- Hacer clic en cualquier nodo durante el recorrido devuelve el árbol a modo libre (`anim.reset()`) y el panel vuelve al paso 0.
- Cambiar la tónica global resetea a paso 0 y corta el audio.
- Durante el recorrido **no** aparece el hint "Elegí una tercera para empezar…".

- [ ] **Step 10: Verificar en alemán**

Cambiar el idioma a DE y repetir el recorrido: el eyebrow y los textos de los pasos deben salir en alemán, y el paso 4 debe leer `Ergebnis: D F♯ A · der Durakkord.`

- [ ] **Step 11: Verificar `prefers-reduced-motion`**

Con la preferencia activa, `▶` debe saltar directo al paso 4 (comportamiento de `useProcessAnimation`), no recorrer los 4 pasos.

- [ ] **Step 12: Commit**

```bash
git add src/components/primitives/AcordeProceso/ src/components/modules/t1/components/AcordesSection.tsx src/i18n/locales/es.json src/i18n/locales/de.json
git commit -m "feat(1.7): stepper animado que construye el acorde mayor sobre el arbol"
```

---

### Task 8: §2.6 — Retirar el paso "04 Séptimas" solo en T2

**Files:**
- Modify: `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx`
- Modify: `src/components/modules/t2/components/GradosArmonicosSection.tsx`

La primitiva la comparten T2 §2.6, T3 §3.5 (`initialStep={4}`) y T3 §3.9 (`initialStep={4} relativeMinor`). El default `maxStep = 4` deja T3 intacto.

- [ ] **Step 1: Añadir la prop `maxStep`**

En `interface Props` (líneas 12-19), añadir:

```tsx
  /** Último paso disponible en el stepper. T2 §2.6 usa 3 (sin séptimas);
   *  T3 §3.5/§3.9 usan el default 4, que es donde se enseñan. */
  maxStep?: 3 | 4;
```

- [ ] **Step 2: Aceptar la prop y hacer el clamp del paso inicial**

Cambiar la firma del componente:

```tsx
export default function GradosArmonicos({ tonalidad, initialStep = 1, relativeMinor = false, maxStep = 4 }: Props) {
```

y reemplazar la línea `const [step, setStep] = useState<Step>(initialStep);` por:

```tsx
  // Clamp: un initialStep por encima de maxStep dejaría la tabla en un estado sin
  // pestaña que lo represente.
  const [step, setStep] = useState<Step>(Math.min(initialStep, maxStep) as Step);
```

- [ ] **Step 3: Renderizar sólo los pasos disponibles**

Reemplazar la línea `{([1, 2, 3, 4] as Step[]).map((s) => (` por:

```tsx
        {(Array.from({ length: maxStep }, (_, i) => (i + 1) as Step)).map((s) => (
```

- [ ] **Step 4: Pasar `maxStep={3}` desde T2**

En `GradosArmonicosSection.tsx`, reemplazar la línea 35:

```tsx
      <GradosArmonicos tonalidad={tonalidad} maxStep={3} />
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: termina sin errores.

- [ ] **Step 6: Verificar en browser**

- **T2 §2.6** — el stepper muestra tres botones: `01 Letras solas`, `02 Con armadura`, `03 Calidades`. No hay `04 Séptimas`. La fila de séptimas nunca aparece y la fila Acorde nunca muestra cifrados con 7ª.
- **T3 §3.5** — sigue mostrando los cuatro botones y arranca en `04 Séptimas`.
- **T3 §3.9** — igual que §3.5, en modo relativa menor.

- [ ] **Step 7: Commit**

```bash
git add src/components/primitives/GradosArmonicos/GradosArmonicos.tsx src/components/modules/t2/components/GradosArmonicosSection.tsx
git commit -m "feat(2.6): retira el paso de septimas solo en T2 via maxStep"
```

---

### Task 9: §2.6 — La fila de grados suena

**Files:**
- Modify: `src/components/primitives/GradosArmonicos/GradosArmonicos.tsx`
- Modify: `src/components/primitives/GradosArmonicos/GradosArmonicos.module.css`

Hoy la fila `Grado` son `<td>` estáticos y sólo la fila `Acorde` es interactiva (`ChordCell`, líneas 383-414). Se extrae el chrome de interacción para que ambas filas lo compartan en lugar de duplicar el componente.

El `lastFireRef` (líneas 121, 134-136) ya es compartido a nivel del componente, así que tabular de la celda de grado a la del acorde de la misma columna no dispara el acorde dos veces con solapamiento.

- [ ] **Step 1: Reemplazar `ChordCell` por un `PlayableCell` genérico**

Borrar la interfaz `ChordCellProps` y la función `ChordCell` completas (líneas 373-414) y poner en su lugar:

```tsx
interface PlayableCellProps {
  role: DiatonicRole;
  active: boolean;
  onPlay: () => void;
  isPlaying: boolean;
  isDimmed: boolean;
  ariaLabel: string;
  className: string;
  activeClassName: string;
  children: ReactNode;
}

// Chrome de interacción compartido por la fila Grado y la fila Acorde: ambas
// reproducen el mismo acorde de la columna (§2.6), así que el estudiante ve que
// "V" y "G" son la misma cosa nombrada de dos maneras.
function PlayableCell({
  role, active, onPlay, isPlaying, isDimmed, ariaLabel, className, activeClassName, children,
}: PlayableCellProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLTableCellElement>) => {
      if (!active) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay();
      }
    },
    [active, onPlay],
  );

  let cls = active ? activeClassName : className;
  if (active && isPlaying) cls = `${activeClassName} ${styles.cellPlaying}`;
  else if (active && isDimmed) cls = `${activeClassName} ${styles.cellDimmed}`;

  return (
    <td
      className={cls}
      data-harmonic={role}
      role={active ? 'button' : undefined}
      tabIndex={active ? 0 : -1}
      aria-hidden={!active}
      aria-label={active ? ariaLabel : undefined}
      onClick={active ? onPlay : undefined}
      onFocus={active ? onPlay : undefined}
      onKeyDown={handleKey}
    >
      {children}
    </td>
  );
}
```

- [ ] **Step 2: Importar `ReactNode`**

En la primera línea del archivo, añadir el tipo al import de React:

```tsx
import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
```

- [ ] **Step 3: Hacer reproducible la fila Grado**

Reemplazar la fila de grados (líneas 243-250) por:

```tsx
            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`}>
              <th scope="row" className={styles.rowLabel}>{isDe ? 'Stufe' : 'Grado'}</th>
              {ROMANS_ACTIVE.map((roman, i) => (
                <PlayableCell
                  key={i}
                  role={HARMONIC_ROLE[i]}
                  active={step >= 3}
                  onPlay={() => playTriad(i)}
                  isPlaying={playingCell === i}
                  isDimmed={playingCell !== null && playingCell !== i}
                  ariaLabel={isDe ? `Akkord der Stufe ${roman} spielen` : `Reproducir acorde del grado ${roman}`}
                  className={styles.gradoCell}
                  activeClassName={styles.gradoCellActive}
                >
                  <RomanGlyph roman={roman} role={HARMONIC_ROLE[i]} />
                </PlayableCell>
              ))}
            </tr>
```

- [ ] **Step 4: Apuntar la fila Acorde al mismo componente**

Reemplazar la fila de acordes (líneas 252-266) por:

```tsx
            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`}>
              <th scope="row" className={styles.rowLabel}>{isDe ? 'Akkord' : 'Acorde'}</th>
              {displayChords.map((sym, i) => (
                <PlayableCell
                  key={i}
                  role={HARMONIC_ROLE[i]}
                  active={step >= 3}
                  onPlay={() => playTriad(i)}
                  isPlaying={playingCell === i}
                  isDimmed={playingCell !== null && playingCell !== i}
                  ariaLabel={isDe ? `Akkord ${sym} spielen` : `Reproducir acorde ${sym}`}
                  className={styles.chordCell}
                  activeClassName={styles.chordCellActive}
                >
                  <span className={styles.chordSymbol}>{sym}</span>
                </PlayableCell>
              ))}
            </tr>
```

- [ ] **Step 5: Renombrar las clases de estado y añadir la variante activa del grado**

En `GradosArmonicos.module.css`:

1. Renombrar `.chordCellPlaying` → `.cellPlaying` y `.chordCellDimmed` → `.cellDimmed` (líneas 248-257). El contenido de las reglas no cambia:

```css
.cellPlaying {
  box-shadow: inset 0 0 0 1.5px var(--amber);
  background: rgba(212, 160, 23, 0.12);
  transition: box-shadow 0.15s, background 0.15s;
}

.cellDimmed {
  opacity: 0.35;
  transition: opacity 0.2s;
}
```

2. Después de la regla `.gradoCell` (líneas 115-118), añadir su variante interactiva, espejo de `.chordCellActive`:

```css
.gradoCellActive {
  composes: gradoCell;
  cursor: pointer;
  outline: none;
  transition: background 0.15s, color 0.15s;
}

.gradoCellActive:hover {
  background: rgba(245, 240, 232, 0.04);
}

.gradoCellActive:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: -2px;
}
```

- [ ] **Step 6: Verificar que no quedaron referencias a los nombres viejos**

Run:
```bash
grep -rn "chordCellPlaying\|chordCellDimmed" src/ || echo "sin residuos"
```
Expected: `sin residuos`

- [ ] **Step 7: Build y lint**

Run: `npm run build`
Expected: termina sin errores.

Run: `npm run lint`
Expected: cero errores nuevos en `src/`.

- [ ] **Step 8: Verificar en browser**

En T2 §2.6, con la tabla en el paso `03 Calidades`:

- Hacer clic sobre `V` en la fila Grado → suena el acorde de esa columna en arpegio.
- Al sonar, **tanto** la celda `V` como la celda `G` de la misma columna quedan marcadas (recuadro ámbar), y las otras seis columnas se atenúan.
- Hacer clic sobre `G` en la fila Acorde produce exactamente el mismo resultado.
- Tabular con el teclado alcanza las celdas de grado; `Enter` y `Espacio` las reproducen.
- Tabular de la celda `V` a la celda `G` de la misma columna **no** dispara el audio dos veces con solapamiento (lo bloquea el debounce compartido de 150ms).
- En el paso `01` y `02` las celdas no son interactivas (la fila está en `opacity: 0`).

Para verificar el focus vía automación hay que dispatchear `focusin` con `bubbles:true`, no llamar `.focus()` (ver la nota del tope del plan).

- [ ] **Step 9: Verificar que T3 no tuvo regresión**

En T3 §3.5 y §3.9, la fila Acorde debe seguir sonando igual que antes, y la fila Grado ahora también suena — es el mismo componente compartido. Confirmar que el highlight cruzado funciona ahí también.

- [ ] **Step 10: Commit**

```bash
git add src/components/primitives/GradosArmonicos/GradosArmonicos.tsx src/components/primitives/GradosArmonicos/GradosArmonicos.module.css
git commit -m "feat(2.6): la fila de grados reproduce el acorde de su columna"
```

---

### Task 10: Cierre de doctrina y verificación final

**Files:**
- Modify: `DESIGN.md` (§7 Pending Debts)
- Modify: `.impeccable/lessons-learned.md`

Per `CLAUDE.md`, la documentación es responsabilidad del orquestador y se actualiza al terminar la pasada.

- [ ] **Step 1: Anti-checklist de 14 items sobre el diff completo**

Run:
```bash
git diff main --stat
```

Pasar el diff completo por los 14 items de `.impeccable/lessons-learned.md` §"Anti-checklist antes de commit". Los greps mecánicos:

```bash
git diff main -- src/ | grep -E '^\+' | grep -E '#000|#fff|rgba\(0, ?0, ?0|rgba\(255, ?255, ?255'
git diff main -- src/ | grep -E '^\+' | grep -E '—|–'
git diff main -- src/ | grep -E '^\+' | grep -E 'border-left: *[2-9]px|border-right: *[2-9]px'
git diff main -- src/ | grep -E '^\+' | grep -E 'style=\{\{|React\.CSSProperties'
```

Expected por item crítico de esta pasada:
- **Item 1 (cuarentena)** — el destacado del arpegio no introduce ningún `var(--note-*)` fuera de un nodo que representa una nota. Las clases nuevas (`.nodeDimmed`, `.nodePulse`, `.nowPlaying`, `.cellPlaying`, `.gradoCellActive`) usan `--amber` y opacity, no hues de nota.
- **Item 2 (blanco/negro puro)** — el único `#fff` nuevo es el que se movió sin cambios dentro del `<g>` en la Task 6: es la excepción Signature (letra blanca sobre círculo saturado) y ya tiene su comentario. `rgba(245, 240, 232, 0.04)` y `rgba(212, 160, 23, 0.12)` son valores preexistentes reusados.
- **Item 6 (em/en dash)** — cero hits nuevos, incluyendo los `.json`.
- **Item 10 (animar layout)** — el destacado usa `transform: scale`, no `r` ni `width`.
- **Items 11 y 12** — las celdas de grado tienen `role`, `tabIndex`, `aria-label`, `onKeyDown` y `onFocus`; el arpegio del árbol nombra la nota en el readout.
- **Item 14 (inline style)** — el único `style={{ fontSize }}` es el preexistente que se movió sin cambios en la Task 6.

Si algún item falla, arreglalo antes de seguir.

- [ ] **Step 2: Actualizar `DESIGN.md §7`**

En la subsección "Doctrina activa (decisiones pendientes de diseño)", añadir estas entradas:

```markdown
- **§1.6: la tabla de tríadas está anclada a la tónica global, la tríada maestra no (decisión 2026-07-31).** La tabla de las 7 tríadas rota desde la letra de la tónica activa, pero el párrafo de la tríada maestra (`t1.s02.master_triad`) sigue enumerando `F A C E G B D F` y el ejemplo del procedimiento (`t1.s02.example`, hoy sin consumidor) sigue en F. El profesor pidió explícitamente re-anclar **sólo la tabla**. Una auditoría futura que vea la inconsistencia debe consultar esta entrada antes de "arreglarla": el alcance fue una decisión, no un descuido.
- **DE usa solfeo español en la nomenclatura de §1.7.** La copy alemana dice `{{sym}} = {{name}} Dur` con `{{name}}` resolviendo a solfeo (`Fa`, `Re`), no a la letra alemana. Es una rareza heredada de la traducción original, preservada intacta en la 35ª ola para que el diff de la interpolación fuera quirúrgico. Si se decide corregirla, el cambio correcto es de copy (`{{sym}}-Dur`), no de la interpolación.
- **`AcordesBuilder` tiene modo controlado.** Las props `path`/`playingRole`/`onUserPick` (default `undefined`) permiten que un walkthrough maneje el árbol sin duplicar el diagrama. Los 4 consumidores de T3 no las pasan y siguen en modo libre. Si una pasada futura añade un consumidor controlado, el sentinela `PLAYING_ALL` (`'*'`) significa "suena el acorde entero, no atenuar nada".
```

En el inventario de "Contextos de sonido", añadir `AcordeProceso` a la lista de **tónica-relativos**: deriva sus notas de `chordSpelled(tonic, 'M')`, que ya calcula octavas ascendentes desde la tónica.

Actualizar la línea `**Última actualización:**` con la fecha y una descripción de esta ola.

- [ ] **Step 3: Actualizar `.impeccable/lessons-learned.md`**

En "Patrones de error documentados", añadir la lección que emergió de la Task 6:

```markdown
- **Una regla CSS `transform` sobre un `<g>` SVG posicionado por atributo `transform` lo manda al origen.** Los nodos de `AcordesBuilder` se posicionan con `transform="translate(x,y)"` como atributo de presentación. Añadir `.nodePulse { transform: scale(1.12) }` a ese mismo `<g>` **reemplaza** el translate (no se compone con él) y el nodo salta a la esquina superior izquierda del viewBox. La fix es envolver el contenido que debe escalar en un `<g>` interno, cuyo origen local ya es el centro del nodo: `scale()` ahí escala alrededor del centro sin tocar el posicionamiento. **Corolario de hit-testing:** el `<g>` interno nuevo no puede tragarse el `circle.hit`, porque `.node > * { pointer-events: none }` sólo alcanza hijos directos — el hit-circle debe quedar como hijo directo del `<g>` externo. Test: `document.elementFromPoint()` en el centro del nodo debe resolver al hit-circle.
- **Cuando todos los elementos de un conjunto ya están en el estado "activo", el destaque del elemento actual necesita atenuar a los hermanos, no reforzarse a sí mismo.** El arpegio del árbol marcaba la nota sonando con un anillo ámbar de 2px sobre un nodo que ya estaba saturado como el resto de la cadena — señal invisible en proyección. Añadir más peso al elemento activo (anillo más grueso, glow) tiene rendimiento decreciente cuando el fondo contra el que compite son sus propios hermanos igualmente saturados. La señal que sí funciona es **bajar a los otros**: el contraste se crea donde ocurre la lectura. Generaliza el lesson de la 8ª ola ("cuando una decoración se acumula, cuestionar si debe existir") al eje opuesto: cuando un estado se acumula, cuestionar qué se le quita al resto.
```

- [ ] **Step 4: Verificación integral final**

Run: `npm run build`
Expected: termina sin errores.

Run: `npm run lint`
Expected: cero errores nuevos en `src/` (los ~50 de `scripts/*.js` son preexistentes).

En el browser, con la consola abierta, recorrer **T1, T2 y T3 completos en ES y en DE**. La consola debe quedar limpia: sin errores, sin warnings de React (keys, hooks), sin claves i18n faltantes (que i18next reporta como el nombre de la clave renderizado en crudo).

Repasar los 9 criterios de verificación de la sección "Criterios de verificación" del spec (`docs/superpowers/specs/2026-07-31-cambios-josue-t1-t2-design.md`) y confirmar cada uno.

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md .impeccable/lessons-learned.md
git commit -m "docs: cierra la 35a ola (cambios del profesor T1 1.6/1.7/1.8 + T2 2.6)"
```

---

## Cobertura del spec

| Sección del spec | Tarea |
|---|---|
| A · §1.6 tabla desde la tónica | 2 |
| A · deuda de la tríada maestra | 10 (Step 2) |
| B · §1.7 tercera línea (disminuido) | 3 |
| C · §1.7 nomenclatura interpolada | 4 |
| D · §1.7 stepper animado | 5 (modo controlado) + 7 (primitiva) |
| E · §1.8 "Círculo de 5tas" | 1 |
| F · destaque del arpegio | 6 |
| G1 · §2.6 sin séptimas | 8 |
| G2 · §2.6 grados audibles | 9 |
| Doctrina + anti-checklist | 10 |
