---
name: Apuntes de Guitarra — Prof. Josué Barquero
description: Referencia interactiva del método didáctico de Josué Barquero para guitarra
colors:
  ink-deep: "#0e0e0e"
  paper-cream: "#f5f0e8"
  ink-paper: "#1a1a1a"
  surface-near: "#0a0a0a"
  surface-hi: "#222222"
  surface-translucent-dark: "#0e0e0eE6"
  rule-graphite: "#2a2a2a"
  muted-stone: "#6b6560"
  light-bg: "#f5f0e8"
  light-surface: "#ede6da"
  light-surface-hi: "#c8bfae"
  light-rule: "#d0c8c0"
  light-muted: "#8a8580"
  rojo-cardenal: "#c0392b"
  ambar-pergamino: "#d4a017"
  note-c: "#c0392b"
  note-c-sharp: "#a93226"
  note-d: "#e67e22"
  note-d-sharp: "#d35400"
  note-e: "#f1c40f"
  note-f: "#27ae60"
  note-f-sharp: "#1e8449"
  note-g: "#2980b9"
  note-g-sharp: "#2471a3"
  note-a: "#8e44ad"
  note-a-sharp: "#7d3c98"
  note-b: "#1abc9c"
typography:
  display:
    fontFamily: "'Bebas Neue', sans-serif"
    fontSize: "clamp(48px, 8vw, 96px)"
    fontWeight: 400
    lineHeight: "0.9"
    letterSpacing: "2px"
  headline:
    fontFamily: "'Bebas Neue', sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "1.1"
    letterSpacing: "1px"
  title:
    fontFamily: "'Bebas Neue', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: "1.2"
    letterSpacing: "1px"
  body:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "1.8"
    letterSpacing: "0"
  label:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "1px"
  quote:
    fontFamily: "'Playfair Display', serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.6"
    letterSpacing: "0"
rounded:
  none: "0"
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "14px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  hero: "60px"
components:
  button-primary:
    backgroundColor: "{colors.ambar-pergamino}"
    textColor: "{colors.ink-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.rojo-cardenal}"
    textColor: "{colors.paper-cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-stone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  button-ghost-hover:
    textColor: "{colors.paper-cream}"
    backgroundColor: "rgba(255,255,255,0.03)"
  button-ghost-active:
    textColor: "{colors.rojo-cardenal}"
    backgroundColor: "rgba(192,57,43,0.08)"
  button-pill:
    backgroundColor: "{colors.surface-near}"
    textColor: "{colors.paper-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-chip:
    backgroundColor: "transparent"
    textColor: "{colors.paper-cream}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  button-chip-active:
    backgroundColor: "{colors.rojo-cardenal}"
    textColor: "{colors.paper-cream}"
  input-text:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.paper-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  card-surface:
    backgroundColor: "{colors.surface-near}"
    textColor: "{colors.paper-cream}"
    rounded: "{rounded.none}"
    padding: "20px"
  nav-sidebar:
    backgroundColor: "{colors.surface-near}"
    textColor: "{colors.paper-cream}"
    width: "220px"
    padding: "24px 0"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted-stone}"
    typography: "{typography.label}"
    padding: "8px 20px"
---

# Design System: Apuntes de Guitarra

## 1. Overview

**Creative North Star: "El Cuaderno de Estudio del Profesor"**

El sistema visual replica la sensación de un cuaderno de estudio cuidado: la tipografía hace el trabajo de jerarquizar, los neutros tintados sostienen el aire, los colores aparecen solo donde tienen un significado pedagógico. La pantalla se siente como un texto que respeta al lector. No grita. No celebra cada interacción. No interrumpe.

La densidad es académica, no flashcard. Hay párrafos del método de Josué Barquero, citas en cursiva tipográfica, secciones con etiquetas numeradas, círculos cromáticos donde cada nota tiene una identidad de color fija. El usuario no está jugando, está estudiando — y la interfaz lo respeta como tal. La doctrina visual viene del modernismo Suizo / Internacional (Müller-Brockmann, Vignelli) aplicado a contenido didáctico: grilla rigurosa, oposición fuerte entre Bebas Neue display y IBM Plex Mono cuerpo, ausencia casi total de sombras, color como decisión semántica.

Lo que este sistema explícitamente rechaza: la mascot-driven gamification de Duolingo / Yousician / Simply Piano; el SaaS-cream / SaaS-noir de Linear / Notion / Vercel con sus cards apiladas idénticas y heros de gradiente; la trampa de categoría que convierte cualquier app de música en púrpura/neón/glassmorphism o cualquier app de aprendizaje en verde/checkmarks/progress bars. El primer instinto del dataset queda fuera por principio.

**Key Characteristics:**
- Tipografía editorial (Bebas Neue + IBM Plex Mono + Playfair Display) hace toda la jerarquía.
- Neutros tintados con flip explícito entre tema oscuro (default) y claro.
- 12 colores cromáticos (uno por nota) con identidad fija; la paleta semántica nunca decora UI no-nota.
- Casi cero sombras: depth por borders + tonal layering, nunca por elevación.
- Radios pequeños (0–6px) por defecto; pills (14px) para acciones flotantes; círculos (50%) solo para nodos de nota.
- Motion mínimo (0.15–0.3s, ease default), respetando `prefers-reduced-motion` por contrato.

## 2. Colors

Una paleta de tres anillos: neutros tintados que sostienen el aire, dos acentos de marca para énfasis (rojo cardenal + ámbar pergamino), y doce hues semánticos amarrados a las notas cromáticas que **nunca se usan decorativamente**. Cada anillo tiene su trabajo y no se cruzan.

### Primary

- **Rojo Cardenal** (`#c0392b`): el acento de marca principal. Aparece en hovers, estados activos, links visitados, el énfasis de "Guitarra" en el header. Nunca como fondo de panel. Nunca en bloques de texto largos. Se gana cada uso.
- **Ámbar Pergamino** (`#d4a017`): el acento secundario, reservado para CTA primarios (botón Entrar de la pantalla de bloqueo, focus rings, indicador de idioma activo). Lleva la idea de "tinta dorada" sobre cuaderno.

### Neutral

- **Ink Deep** (`#0e0e0e`): el negro tintado del fondo en tema oscuro. No es `#000`. La punta del lápiz, no la oscuridad absoluta.
- **Paper Cream** (`#f5f0e8`): el texto sobre oscuro, también el fondo del tema claro. Recorre todo el sistema como "tinta" o "papel" según el modo.
- **Surface Near** (`#0a0a0a` / light `#ede6da`): superficie de cards, sidebar, paneles informativos. Una capa más profunda que el bg, sin sombra que la levante.
- **Surface High** (`#222222` / light `#c8bfae`): tracks de toggles, controles secundarios. La capa "más palpable" cuando hace falta separar un control de un bg.
- **Rule Graphite** (`#2a2a2a` / light `#d0c8c0`): el divisor. Aparece en bordes 1px de cards, headers, sidebar, y como stroke de los anillos exteriores en SVGs.
- **Muted Stone** (`#6b6560` / light `#8a8580`): el texto secundario, labels, captions, navegación inactiva. Lo que comunica "esto es soporte, no contenido principal".

### Tertiary: Note Identity

Doce hues, uno por nota cromática. **No es paleta decorativa: es un sistema semántico.** El usuario aprende a asociar `#c0392b` con C, `#e67e22` con D, etc. Esa asociación es contenido pedagógico, no estética.

- **C** `#c0392b` · **C♯** `#a93226` · **D** `#e67e22` · **D♯** `#d35400`
- **E** `#f1c40f` · **F** `#27ae60` · **F♯** `#1e8449` · **G** `#2980b9`
- **G♯** `#2471a3` · **A** `#8e44ad` · **A♯** `#7d3c98` · **B** `#1abc9c`

### Named Rules

**The One Voice Rule.** Rojo Cardenal y Ámbar Pergamino combinados ocupan ≤10% de cualquier pantalla. Su escasez es el punto.

**The Note-Color Quarantine Rule.** Los 12 hues de nota están **prohibidos** en cualquier elemento que no represente una nota o un acorde. Si un botón, un divisor, un fondo o un icono usa Rojo Cardenal `#c0392b`, está usando el color del acento de marca — no el de la nota C. La línea es invisible para el dataset, pero crítica para la pedagogía.

**The No Pure Black/White Rule.** `#000` y `#fff` están prohibidos como fondos o textos. Todos los neutros están tintados hacia el cálido del cuaderno (`#0e0e0e`, `#f5f0e8`).

## 3. Typography

**Display Font:** Bebas Neue (con `sans-serif` fallback)
**Body Font:** IBM Plex Mono (con `monospace` fallback)
**Quote Font:** Playfair Display (con `serif` fallback)

**Character:** Bebas Neue da la voz cartelera, condensada, con pares "estudio · guitarra" y "Tonalidades y Armaduras" en uppercase espaciado. IBM Plex Mono lleva el cuerpo del método y los labels — las letras en mono comunican "ejercicio musical, no marketing copy". Playfair Display aparece **una sola** clase de vez: la cita italic del header *"Las notas no suben — la mano baja"*. El triplete crea una pareja Editorial-Académica reconocible sin caer en cualquier reflejo de "música = serif romántico" o "técnico = mono solo".

### Hierarchy

- **Display** (Bebas Neue 400, `clamp(48px, 8vw, 96px)`, line-height 0.9, letter-spacing 2px): título del header global. Una vez por pantalla, jamás dos.
- **Headline** (Bebas Neue 400, 32px, line-height 1.1, letter-spacing 1px): títulos de sección dentro de un módulo (`<h2>`). Ej: "Tríadas", "Círculo Cromático".
- **Title** (Bebas Neue 400, 24px, line-height 1.2, letter-spacing 1px): subsections, panel headers, MasterTriad title.
- **Body** (IBM Plex Mono 400, 13px, line-height 1.8): párrafos del método, descripciones de intervalos, listas. **El line-height 1.8 es alto a propósito** — el método tiene párrafos densos y necesita aire entre líneas para no parecer compilado. Cap line length 65–75ch.
- **Label** (IBM Plex Mono 500, 11px, letter-spacing 1px, uppercase): SectionLabel ("03 — Notas"), nav links, captions, role chips, footer copy.
- **Quote** (Playfair Display 400 italic, 12px, line-height 1.6): la cita del header global. Reservada exclusivamente para citas literales (eslogan, frases de Josué). Nunca decorativa.

### Named Rules

**The Editorial Trio Rule.** Bebas Neue solo en mayúsculas, Plex Mono solo en cuerpo y labels, Playfair solo en italic para citas. Ninguna combinación cruzada (ej: Bebas en lowercase, Playfair como título). Las tres fuentes mantienen su rol o no aparecen.

**The 65ch Rule.** Cualquier párrafo de cuerpo respeta `max-width: 65–75ch`. La tipografía mono es legible solo cuando la línea no es un viaje horizontal. En el módulo T2 esto significa que las explicaciones del método viven dentro de un container con max-width acotado, no llenando viewport.

## 4. Elevation

Este sistema es **flat por defecto**. La profundidad se construye con borders 1px (`rule-graphite` / `light-rule`) y tonal layering (`surface-near` un escalón más oscuro que `bg`), no con sombras. Hay solo dos box-shadow en toda la base de código y ambos están justificados por dominio: el dot del mástil de intervalos (sombra interior simulando el cuerpo de la cuerda) y el círculo de cadena de tríadas en hover (glow blanco sutil para indicar estado interactivo).

### Shadow Vocabulary

- **Fretboard Dot** (`box-shadow: 0 0 8px rgba(0, 0, 0, 0.6)`): el dot que marca un intervalo en el mástil mini. Sombra inward-feeling, comunica que el dot está "metido" en la madera.
- **Triad Hover Glow** (`box-shadow: 0 0 16px rgba(255, 255, 255, 0.2)`): aparece solo en `:hover` sobre el círculo de la cadena maestra de tríadas. Es la única sombra hover de todo el sistema.

### Named Rules

**The Flat-By-Default Rule.** Ningún card, panel, sidebar o botón tiene sombra en estado de reposo. La depth se gana con tonal layering. Si un componente nuevo "se siente plano sin volumen", no es un problema — es la doctrina.

**The Shadow Justifies Itself Rule.** Las dos sombras existentes representan algo físico (cuerda, hover glow). Cualquier sombra nueva debe poder justificarse en una frase con un sustantivo concreto, no "para dar profundidad".

## 5. Components

### Buttons

- **Shape:** Por defecto sin radio (`rounded.none = 0`). Botones de control en el POC usan `rounded.sm` (4px). Acciones flotantes tipo "Limpiar" usan pill (`rounded.pill = 14px`). Nunca `rounded.lg` ni mayores en botones.
- **Primary** (Lock screen submit, futuros CTA del método): fondo Ámbar Pergamino, texto Ink Deep, label typography (Plex Mono 500 uppercase 11px), padding 8×16px, radius 0. **Hover:** fondo cambia a Rojo Cardenal, texto a Paper Cream — el shift Ámbar→Rojo confirma la acción.
- **Ghost** (sidebar nav, controles secundarios): sin fondo, texto Muted Stone, padding 8×20px. **Hover:** texto a Paper Cream + fondo `rgba(255,255,255,0.03)` (apenas un velo). **Active:** texto a Rojo Cardenal + fondo `rgba(192,57,43,0.08)`.
- **Pill** (acciones flotantes "Limpiar selección" en POC, sticky bottom-right): fondo `--surface-translucent` con `backdrop-filter: blur(6px)`, padding 8×16px, radius 14px. La única instancia donde glassmorphism está permitido — y solo porque está sobre un SVG que necesita verse parcialmente.
- **Chip** (NoteSelector — `[C][D][E][F][G][A][B]`): typography Title (Bebas 24px), padding 4×10px, radius 0, border 1px Rule Graphite. **Hover:** border-color Ámbar Pergamino. **Active:** fondo Rojo Cardenal, border Rojo Cardenal, texto Paper Cream.

### Inputs

- **Style** (Lock screen password input): fondo Ink Deep, texto Paper Cream, border 1px Rule Graphite, padding 8×16px, radius 0, body typography. La caja literal del cuaderno: una línea, sin esquinas redondeadas, sin sombra.
- **Focus:** border-color cambia a Ámbar Pergamino. Sin glow exterior. La señal de foco vive en el border, no fuera.
- **Disabled (button):** opacity 0.5, cursor not-allowed. No se invierten colores.

### Cards / Surfaces

- **Corner Style:** sin radio (radius 0). Las superficies cuadradas refuerzan la disciplina Suizo-Internacional.
- **Background:** `surface-near` (un escalón más oscuro que `bg` en oscuro, un escalón más cálido que `bg` en claro). Para superficies que necesitan sentirse más palpables (info-panels de tríadas, master wrap), `surface-near` con border 1px `rule-graphite`.
- **Shadow Strategy:** ninguna por defecto (ver The Flat-By-Default Rule).
- **Border:** 1px `rule-graphite` para cards informativos. La excepción legacy es **RuleNote** (componente migrado del repo personal), que usa border-left 3px Rojo Cardenal — esto es un anti-patrón Impeccable que está pendiente de reescritura (ver Don'ts).
- **Internal Padding:** 20px estándar. 16×20px para callouts/notes. 32px para tarjetas hero (LockScreen card).

### Navigation

- **Sidebar** (`width: 220px`, sticky desktop, drawer mobile <900px): fondo `surface-near`, border-right 1px `rule-graphite`, padding-top 24px. Logo tipográfico arriba ("Apuntes de **Guitarra**" con span en Rojo Cardenal). Los nav-links son ghost-buttons con la regla de active descrita arriba.
- **Mobile drawer:** desliza desde la izquierda con `transition: left 0.25s ease`, overlay 60% negro, hamburger 18px Bebas Neue en top-left fijo.
- **Header (Hero):** padding 80×60×60px (top×side×bottom) en desktop. Watermark "GUITARRA" en Bebas Neue gigante (clamp 120-260px) con opacidad 0.03 — está ahí pero no compite. El selector de idioma `[ES][DE]` vive absolute top-right del header como pareja de chips ghost con borde y estado activo Ámbar.

### Toggles

- **Track** 40×20px, `surface-hi` background, border 1px `rule-graphite`, radius 10px (las únicas esquinas redondeadas grandes del sistema, justificadas porque visualmente representan un switch físico).
- **Thumb** 14×14px circle (`rounded.full`), Paper Cream, animación `transform 0.25s` a la derecha cuando está ON.
- **Active state:** track a Rojo Cardenal, border Rojo Cardenal. Reservado para theme toggle y switches de modo en el POC.

### Signature: Chromatic Note Node (SVG)

El componente firma. Cada nota cromática se renderiza como un círculo SVG con:
- Fill = `note-{X}` correspondiente.
- Texto blanco (`#fff`) con la letra de nota en el centro, Bebas Neue, weight 700, 15px (naturales) / 11px (alteradas).
- Etiqueta exterior con el nombre español ("Do", "Re♯") en Muted Stone, 9px.
- Anillo conector desde el centro hasta el nodo, stroke = `note-{X}`, opacity 0.15 default / 0.5 hover.
- Hover: scale 1.15, ring brightness up, audio playback (`useAudioEngine`).

Este componente es el que identifica la marca. Aparece en T1 (primitiva ChromaticCircle), en el POC de T2 (ChromaticCircleAnimated), y vivirá en cualquier futura visualización armónica. Es la unidad visual del sistema.

## 6. Do's and Don'ts

### Do:

- **Do** usar Bebas Neue solo en uppercase, IBM Plex Mono solo en cuerpo/labels, Playfair Display solo italic para citas literales.
- **Do** mantener acentos de marca (Rojo Cardenal + Ámbar Pergamino combinados) en ≤10% de cualquier pantalla.
- **Do** construir profundidad con borders 1px y tonal layering (`surface-near` sobre `bg`), nunca con sombras.
- **Do** usar `radius 0` por defecto. Las únicas excepciones son: tracks de toggle (10px), pills de acción flotante (14px), círculos puros (50%), y radios sutiles 4-6px solo dentro del POC para controles.
- **Do** respetar `prefers-reduced-motion`: todas las animaciones de armadura deben saltar a estado final cuando el usuario lo tiene activado.
- **Do** mantener `max-width: 65-75ch` en cualquier párrafo de cuerpo. El método tiene texto largo y necesita columnas legibles.
- **Do** tintar `#000` y `#fff` siempre hacia los neutros del sistema (Ink Deep / Paper Cream). Los neutros puros están prohibidos.

### Don't:

- **Don't** usar los 12 hues de nota cromática para decorar nada que no represente una nota o un acorde. Si un botón es Rojo `#c0392b`, está usando el acento de marca, no el color de C — y debe poder defenderse así. (The Note-Color Quarantine Rule.)
- **Don't** parecerse a Duolingo / Yousician / Simply Piano / Flowkey. Sin mascots, sin racha diaria, sin "siguiente lección desbloqueable", sin recompensa positiva por click, sin paleta saturada. Lo dijo PRODUCT.md, lo repite DESIGN.md.
- **Don't** caer en SaaS-cream / SaaS-noir genérico. Nada de sidebar acrílico con cards apiladas idénticas, hero con gradiente sutil, "metric big number small label", layouts tipo Linear/Notion/Vercel.
- **Don't** usar reflejos de categoría: ni púrpura/neón/glassy "música", ni verde/checkmark/progress-bar "aprendizaje", ni mástil de madera literal "guitarra" como textura de fondo.
- **Don't** poner `border-left` o `border-right` >1px como acento de color en cards o callouts. Es un anti-patrón Impeccable. **Excepción legacy conocida:** el componente `RuleNote` actualmente usa `border-left: 3px solid var(--red)` heredado del repo personal. Está marcado como deuda; cualquier nueva creación de notas/callouts debe usar full borders, leading numbers, o un fondo tinteado en su lugar.
- **Don't** usar gradient text (`background-clip: text`). Énfasis se hace por peso, tamaño, o color sólido — nunca degradado.
- **Don't** introducir glassmorphism como default. La única instancia justificada es el botón pill flotante "Limpiar selección" sobre SVG en el POC, donde el blur sirve para dejar ver parcialmente lo que hay debajo. En cualquier otro contexto, está prohibido.
- **Don't** usar `#000` o `#fff` puros. Todo neutro está tintado hacia el cálido del cuaderno.
- **Don't** animar propiedades de layout (width, height, top, left). Solo opacity, transform, color, background, border-color, stroke, fill.
- **Don't** usar em dashes (`—`) en UI copy generada por agente. Coma, dos puntos, paréntesis o punto. *(Las erratas intencionales del método de Josué quedan literales — esa es excepción de contenido, no de UI.)*
- **Don't** documentar nada con la voz "consider", "might", "prefer". Cualquier regla aquí es "prohibido", "siempre", "nunca" — la voz de un director de diseño, no de una sugerencia.
