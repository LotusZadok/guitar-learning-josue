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

### Light-theme overrides (decisión 2026-05-04)

Aunque la doctrina inicial declaraba "note hues fijas a través de temas", auditoría de contraste reveló que 8 de las 12 hues fallan WCAG AA texto-pequeño sobre cream `#f5f0e8`. Decisión aprobada: definir variantes oscuras para `[data-theme="light"]` que preservan identidad de hue (C sigue siendo rojo, G sigue siendo azul, etc.) pero alcanzan contraste ≥ 4.5:1.

Implementación: las hues son CSS vars (`--note-c`, `--note-c-sharp`, ..., `--note-b`) en `global.css` con overrides para `[data-theme="light"]`. `data/notes.ts NOTE_COLORS` lee los vars vía `var(--note-X)` strings.

Hues light-theme (ratios sobre cream entre paréntesis):
- **C** `#c0392b` (4.79:1) · **C♯** `#a93226` (5.84:1) · **D** `#a04600` (5.49:1) · **D♯** `#923c00` (6.45:1)
- **E** `#7d6500` (4.96:1) · **F** `#1a7340` (5.19:1) · **F♯** `#16623a` (6.51:1) · **G** `#1f5f8a` (6.05:1)
- **G♯** `#1c5577` (7.08:1) · **A** `#8e44ad` (5.17:1) · **A♯** `#7d3c98` (6.23:1) · **B** `#0e7560` (4.96:1)

**Trade-off de E (yellow-on-cream).** El amarillo `#f1c40f` es físicamente imposible de pasar AA sobre cream sin volverse ochre/ámbar oscuro. La variante elegida (`#7d6500`) lee como "amarillo-cálido tirando a mostaza" — la familia *yellow-warm* se conserva, pero un usuario que asocie E con "amarillo brillante" en tema oscuro verá un tono notoriamente más oscuro en tema claro. Se acepta como costo del salto AA.

**Excepción doctrinal:** El usuario aprende la asociación "rojo = C" en cualquier tema, pero el rojo *exacto* puede variar entre dark y light. La identidad pedagógica se mantiene; el matiz se ajusta para legibilidad.

### Named Rules

**The One Voice Rule.** Rojo Cardenal y Ámbar Pergamino combinados ocupan ≤10% de cualquier pantalla. Su escasez es el punto.

**The Note-Color Quarantine Rule.** Los 12 hues de nota están **prohibidos** en cualquier elemento que no represente una nota o un acorde. Si un botón, un divisor, un fondo o un icono usa Rojo Cardenal `#c0392b`, está usando el color del acento de marca — no el de la nota C. La línea es invisible para el dataset, pero crítica para la pedagogía.

**Corolario (Roles y estados).** Cuando un componente necesita discriminar N elementos que **no** son notas (roles tipo T/3ra/5ta, estados tipo userPicked/highlighted/neutral, categorías tipo sostenido/bemol), los colores se eligen de los **neutros de marca** (`--paper`, `--muted`, `--surface-2`, `--rule`, `--surface`) o de los **dos acentos de marca** (`--red`, `--amber`), nunca de los 12 hues cromáticos. Cualquier array de colores indexado por algo que no sea nombre-de-nota es un olor a violación. Tipografía, peso, posición, número o forma son discriminadores válidos antes que el color.

**Corolario (Tokens vinculados a notas).** Los CSS vars `--string1..6` y `--caged-C/A/G/E/D` **son** hues cromáticos disfrazados (cada cuerda al aire ES una nota; cada forma CAGED ES una nota raíz). No pueden reusarse como acentos genéricos. Si un componente no-nota usa `var(--string6)`, viola la cuarentena igual que si usara `#8e44ad` directo.

**Sub-sistema diatónico (complementario, no sustituto).** Tres tokens `--diatonic-stable`, `--diatonic-medium`, `--diatonic-tense` codifican el rol de un grado dentro de una tonalidad activa. Solo se aplican en componentes que viven explícitamente dentro de una tonalidad: `EscalaMayor`, `TensionResolucion`, y futuros componentes tonales. Los componentes cromáticos (ChromaticCircle, círculo de quintas, NoteToken en prosa, mástil) preservan los 12 hues absolutos sin excepción. `GradosArmonicos` usa discriminación tipográfica y queda fuera de ambos subsistemas de color.

Los dos sub-sistemas son **mutuamente excluyentes por componente**: un componente usa uno o el otro, nunca los dos en el mismo elemento visual. `--diatonic-tense` es un alias de `var(--red)` — intencional y documentado aquí para que un agente futuro no lo "corrija". La identidad rojo-marca y la función tensa son el mismo concepto semántico en este sistema.

La **Note-Color Quarantine Rule se extiende** en ambas direcciones: (a) los 12 hues de nota no decoran UI que no represente una nota — regla preexistente; (b) los 3 tokens diatónicos no decoran UI que no sea un grado dentro de una tonalidad activa — extensión del Bloque E.

**The No Pure Black/White Rule.** `#000` y `#fff` están prohibidos como fondos o textos. Todos los neutros están tintados hacia el cálido del cuaderno (`#0e0e0e`, `#f5f0e8`). **Excepción única, narrowly defined:** la letra de nota dentro del Signature Component (texto Bebas blanco sobre el fill saturado del nodo cromático en `ChromaticNode`, `TriadNode`, `chainCircle`, `dot` del fretboard). Bordes decorativos, anillos de selección, indicadores de raíz, separadores y stroke de hover **no** califican — usan `var(--paper)`.

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
- **Label** (IBM Plex Mono 500, 11px, letter-spacing 1px, uppercase): SectionLabel ("03 · Notas"), nav links, captions, role chips, footer copy. El separador estándar es `·` (U+00B7, middle dot), nunca em/en dash.
- **Quote** (Playfair Display 400 italic, 12px, line-height 1.6): la cita del header global. Reservada exclusivamente para citas literales (eslogan, frases de Josué). Nunca decorativa.

### Named Rules

**The Editorial Trio Rule.** Bebas Neue solo en mayúsculas, Plex Mono solo en cuerpo y labels, Playfair solo en italic para citas literales de Josué. Ninguna combinación cruzada (ej: Bebas en lowercase, Playfair como título o subtítulo). Las tres fuentes mantienen su rol o no aparecen. Si una fuente tiene una Named Rule fijando su único caso de uso, **cualquier otro uso es una falla del diseño** — no una "interpretación creativa".

**The 65ch Rule.** Cualquier párrafo de cuerpo respeta `max-width: 65–75ch`. La tipografía mono es legible solo cuando la línea no es un viaje horizontal. En el módulo T2 esto significa que las explicaciones del método viven dentro de un container con max-width acotado, no llenando viewport.

**The Middle-Dot Separator Rule.** El separador estándar para SectionLabel, nav labels, metadatos en línea ("EADGBE · 12 Notas · Sistema CAGED") y cualquier label con prefijo numerado ("01 · Introducción") es `·` (U+00B7, middle dot). Em dashes (`—`) están prohibidos en UI generada por agente; quedan reservados exclusivamente para citas literales del método de Josué (contenido). En/En dashes (`–`) no aparecen.

**The One H1 Rule.** Una sola etiqueta `<h1>` por página: la del header global de AppShell. Las pantallas de módulo (T1, T2, futuras) **no** crean su propia `<h1>`. Su título de módulo, si lo necesitan, vive como `<h2>` editorial dentro del flujo de contenido — nunca como hero centrado replicando la voz del header global.

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
- **Border:** 1px `rule-graphite` para cards informativos. **Callouts** (RuleNote rojo, FExceptionBanner ámbar): full border 1px del acento de marca correspondiente + fondo tinteado al 6% (`rgba(192,57,43,0.06)` o `rgba(212,160,23,0.06)`) + padding 16×20px. Patrón único para callouts; sin side-stripes.
- **Internal Padding:** 20px estándar. 16×20px para callouts/notes. 32px para tarjetas hero (LockScreen card).

### Navigation

- **Sidebar** (`width: 220px`, sticky desktop, drawer mobile <900px): fondo `surface-near`, border-right 1px `rule-graphite`, padding-top 24px. Logo tipográfico arriba ("Apuntes de **Guitarra**" con span en Rojo Cardenal). Los nav-links son ghost-buttons con la regla de active descrita arriba.
- **Mobile drawer:** desliza desde la izquierda con `transition: left 0.25s ease`, overlay 60% negro, hamburger 18px Bebas Neue en top-left fijo.
- **Header (Hero):** padding 80×60×60px (top×side×bottom) en desktop. Watermark "GUITARRA" en Bebas Neue gigante (clamp 120-260px) con opacidad 0.03 — está ahí pero no compite. El selector de idioma `[ES][DE]` vive absolute top-right del header como pareja de chips ghost con borde y estado activo Ámbar.

### Toggles

- **Track** 40×20px, `surface-hi` background, border 1px `rule-graphite`, radius 10px (las únicas esquinas redondeadas grandes del sistema, justificadas porque visualmente representan un switch físico).
- **Thumb** 14×14px circle (`rounded.full`), Paper Cream, animación `transform 0.25s` a la derecha cuando está ON.
- **Active state:** track a Rojo Cardenal, border Rojo Cardenal. Reservado para theme toggle y switches de modo en el POC.

### Module Shells

Las pantallas de módulo (T1, T2, futuros) **no** renderizan su propio `<header>` con título y subtítulo. AppShell ya provee el header global (con la `<h1>` de marca, eyebrow Ámbar, watermark, lang switcher y cita Playfair de Josué) y el footer global. El módulo aporta **solo contenido**: su `<main>` con las secciones, donde la primera sección actúa como entrada (eyebrow numerado + `<h2>` + cuerpo).

Anti-patrones cubiertos por esta regla:
- Hero centrado tipo "module landing" (centered title + Playfair italic tagline + 60-80px padding) — patrón SaaS-cream del dataset.
- Doble `<h1>` por página (AppShell global + module local).
- Footer secundario con copyright/branding repetido del global.
- Subtítulos decorativos en Playfair italic que no son citas literales de Josué.

La pregunta antes de añadir cualquier shell de módulo: **¿esta superficie necesita un header, o estoy heredando uno porque todo producto tiene uno?** En esta app, la respuesta por defecto es no.

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
- **Don't** usar `#000` o `#fff` puros. Todo neutro está tintado hacia el cálido del cuaderno. **Única excepción:** la letra Bebas blanca dentro del Signature Component note circle. Bordes, anillos de selección e indicadores decorativos usan `var(--paper)`.
- **Don't** reusar `var(--string1..6)` ni `var(--caged-*)` como acentos decorativos en componentes no-nota. Esos tokens son hues cromáticos disfrazados; violan la cuarentena tan literalmente como `#8e44ad` directo.
- **Don't** crear arrays de colores indexados por rol/estado/categoría (ROLE_COLORS, STATE_COLORS estilo `[7 hex saturados]`). Si necesitás N variantes visuales no-nota, discriminá por tipografía, peso, posición, número, forma o un único acento de marca — no por una paleta pintoresca.
- **Don't** animar propiedades de layout (width, height, top, left). Solo opacity, transform, color, background, border-color, stroke, fill.
- **Don't** usar em dashes (`—`) ni en dashes (`–`) en UI copy generada por agente. El separador estándar es `·` (U+00B7, middle dot) para labels y metadatos. Coma, dos puntos, punto o paréntesis para prosa. *(Las erratas y guiones intencionales del método de Josué quedan literales — esa es excepción de contenido, no de UI.)*
- **Don't** renderizar headers locales en módulos (T1, T2, futuros). AppShell + Header global poseen la identidad de página. Ver "Module Shells" en §5.
- **Don't** crear un segundo `<h1>` debajo del global. Un solo h1 por página, módulos contribuyen `<h2>` o menor.
- **Don't** aplicar Playfair Display a copy de UI generada (subtítulos, preguntas-de-panel, captions). Playfair es exclusivo para citas literales del método de Josué.
- **Don't** documentar nada con la voz "consider", "might", "prefer". Cualquier regla aquí es "prohibido", "siempre", "nunca" — la voz de un director de diseño, no de una sugerencia.

## 7. Pending Debts (Conocidas, no resueltas)

Esta sección lista deudas que las auditorías y pasadas de resolución identificaron pero **no** han sido resueltas. Son trabajo futuro explícito, no aprobaciones tácitas. Cada vez que una pasada resuelve una deuda, se remueve de esta lista; cada nueva deuda descubierta se añade.

**Última actualización:** 2026-05-22 (12ª ola — identidad de marca, corrección TOC, numeración T2, ♭ integral).

### Doctrina activa (decisiones pendientes de diseño)

- **`ProcessPanel.titulo` en Playfair italic.** Las preguntas pedagógicas ("¿Cómo saber la armadura partiendo de la tonalidad?") **se tratan como citas del método** de Josué (decisión 2026-05-04). Excepción al Editorial Trio Rule documentada aquí: las preguntas-pregunta del método cuentan como citas literales. NO mover a Plex Mono. Cualquier auditoría futura que la flagee debe consultar esta entrada antes.
- **One Voice Rule en concentración alta** (≥10% combinado de rojo + ámbar en TablaMaestra/ModoClase con SectionLabels rojos + chipActive + ToggleSwitch ON + spans de marca). Decisión 2026-05-04: **aceptable**. La densidad de las dos secciones más interactivas justifica el peso visual del acento. No requiere acción mientras el resto de pantallas se mantenga ≤10%.
- **`--string1..6` y `--caged-*` están definidos solo en `:root`.** Per DESIGN.md §2 doctrina, los hues de nota base son **fijos** (la identidad de la cuerda E al aire es la nota E). Esta entrada existe para documentar la decisión: dejarlos en `:root` es correcto. Si una pasada futura los redefine para light, está rompiendo doctrina. Nota: las **note hues principales** (`--note-c..--note-b`) sí tienen overrides para light desde la 4ª ola — son cosa distinta.
- **`FExceptionBanner` con `border` 1px completo** es el patrón actual tras el fix de side-stripe. Una alternativa más editorial-académica sería el patrón **eyebrow chip "F"** + paragraph (sin border completo, solo leading badge). Requiere edición de JSX (fuera del alcance de la pasada de visual). Pendiente como decisión estilística.
- **Tokens semánticos sugeridos por agentes pero no creados:**
  - `--text-faded` para `.stepPast` y similares ("este paso ya pasó / atenuado"). Hoy usa `var(--muted)` que es fuente de luminancia distinta. Si la diferencia visual es importante, vale la pena el token nuevo.
  - `--fret-num` para `.fretNum` en mástil. Hoy usa `var(--muted)` que puede competir con los dots en oscuro. Si el fretNum se siente prominente, token dedicado.
  - Comentario inline en `Intervals.module.css .dot { color: #fff }` señalando "Signature: letra blanca sobre nota saturada, no tokenizar" para que un agente futuro no lo "corrija".
- **Doble sostenido / doble bemol en spelling de acordes para tónicas extremas.** Las funciones `majorScaleSpelled`/`chordSpelled` aplican la regla "una letra por grado". Para D♯, G♯, A♯ mayores eso produce F♯♯, B♯, C♯♯ (correcto teóricamente, inusual visualmente). Pedagogía musical estándar resuelve esto eligiendo la enarmonía bemol equivalente (E♭, A♭, B♭). Decisión pendiente: dejar la teoría estricta como está, o auto-redirigir tonics extremas a spelling con bemoles. Hoy la primitiva acepta toda tónica del tipo `ChromaticNote` (con sostenidos) y muestra el resultado como sale. Si emerge fricción de uso (estudiantes pidiendo "Eb mayor"), pasada futura puede añadir un input flat-aware sin romper la actual.
- **Spellings inválidos en prosa quedan como texto plano (no token).** El método menciona explícitamente `B#`, `E#` y `Fb` como spellings que NO existen o NO se usan ("se omiten B# y E#", "5J de Bb es F (no Fb)", "5J de A# aparece como E# enarmónica"). NoteToken solo cubre los 17 spellings con `--note-X` (12 cromáticos con sostenidos + 5 enarmonías bemol comunes). Decisión: dejar `B#`/`E#`/`Fb` como texto sin tokenizar para preservar el contraste pedagógico "lo válido vs lo descartado". Si futuras secciones del método requieren tokenizarlos (improbable), añadir vars dedicadas o alias enarmónicos al `DATA_NOTE` map.

### Histórico (resueltas, conservar para contexto)

Esta sub-sección lista deudas que **sí** fueron resueltas. Útil para no reabrirlas y para entender el camino de la doctrina.

**12ª ola — Identidad de marca, TOC, numeración T2, ♭ integral (2026-05-22):**
- ✓ **Header** rediseñado: eliminado "APUNTES DE", eliminada cita tagline, eyebrow neutral "GUITARRA ELÉCTRICA / ACÚSTICA". Fuente Bebas Neue, rojo en "Guitarra". Eliminado `::before` ghost watermark (violación rgba documentada en lessons-learned).
- ✓ **LockScreen** identity block: eyebrow "Teoría de" / título "Guitarra" — eliminado "Prof. Josué Barquero" (logo de app, no crédito personal). Actualiza la entrada de la 11ª ola.
- ✓ **Sidebar TOC bug**: `tocList` movido dentro de `SECTIONS.map()` loop — los subíndices ahora aparecen inline bajo la sección activa, no al pie de todos los navegadores.
- ✓ **TOC config**: eliminado `s-t2-modo-clase`; numeración T2 corregida de "4.X" a "2.X" según source of truth; herramienta renombrada a "2.2 · Orden de las alteraciones".
- ✓ **♭ integral**: auditados y corregidos todos los textos renderizados — `literalContent.ts` (T1 + T2), `processSteps.ts` (template literals con `noteShort()`), `es.json`, `de.json`. Solo las arrays de datos internos (`HERRAMIENTA_BEMOLES`, `tonalidades.ts`) conservan "Bb/Eb/…" ya que pasan por `toFlat()` / `noteShort()` en el componente.
- ✓ Build limpio. Sin deuda nueva introducida.

**11ª ola — Interactividad global + tipos armónicos (2026-05-21):**
- ✓ **NoteToken como setter de tónica global** (item 21): click en cualquier `<NoteToken>` llama `setTonic(chromatic)` via Zustand; `isTonic` deriva de `SPELLING_TO_CHROMATIC[note] === tonic`; clase `tokenTonic` añade underline bold 700. Hover ≠ select: `onMouseEnter` reproduce audio solo, `onClick`/`onKeyDown`(Enter|Space) cambia tónica + reproduce. `aria-pressed={isTonic}`.
- ✓ **Sistema diatónico de colores en NoteToken** (item 32): prop `diatonicRole?: 'stable' | 'medium' | 'tense'` + atributo `data-diatonic` en span. Reglas CSS `[data-diatonic]` colocadas DESPUÉS de `[data-note]` (misma especificidad, el orden gana) para que el contexto diatónico override el color cromático. `DEGREE_ROLE[]` en `GradosArmonicos` mapea grado → rol; fórmula `(i + j*2) % 7` computa el grado correcto para cada miembro de tríada.
- ✓ **Tipos aumentado/disminuido en `AcordesBuilder`** (item 22): `ChordType` extendido a `'M' | 'm' | 'aug' | 'dim'`; `chordSpelled` actualizado con offsets (aug 5ta = 8st, dim 5ta = 6st) y roles `'5aug' | '5dim'`. Font-size reduction (15px) en SVG para spelling ≥3 chars (Cx, Fx, B♭♭). Confirma dobles accidentales en tónicas extremas (B aug → `[B, D♯, Fx]`).
- ✓ **Arpegio ascendente en `TriadsSection`** (item 34): helper `toAscending(notes, startOctave=4)` — incrementa octava cuando `semitone(next) ≤ semitone(prev)`. Corrige inversión de voz: F-A-C todos en oct. 4 producía C4 < F4.
- ✓ **Tríada mayor en `ChromaticCircleSection`** (item 23): cada nodo reproduce tríada mayor vía `makePlayFn(note)` con `chordSpelled(note, 'M')` + `ensureAscending()`. Toggle arpegio/bloque. `ChromaticNode` extrae prop `onPlay: () => void`, delega audio al parent.
- ✓ **Ejemplo dinámico en `TriadasSection`** (item 18): `NoteSelector` con 7 notas naturales; `buildEjemplo(root)` genera `ProseSegment` dinámicamente con los 4 vecinos consecutivos de la escala natural. Reemplaza el ejemplo hardcodeado en C.
- ✓ **Formato T2** (items 27-31): `text-indent: 1.5em` en `.text` de `IntroSection`; glifos ♭ nativos via `toFlat()` en `TablaMaestraSection` y `HerramientaSection`; fila en blanco eliminada de herramienta; `PROPIEDAD_ESPECIFICO` dividido con `<br/>` en el guión; 3 `<RuleNote>` → 1 con 3 `<p>` hijos en `IntroSection`.
- ✓ Build limpio. Lint limpio. Anti-checklist 14/14 OK. Sin deuda nueva introducida.

**Pasada de auditoría completa (2026-05-21) — critique + 7 correcciones:**
- ✓ ES/DE switcher duplicado en `Header.tsx` eliminado (selector único vive en Sidebar themeArea).
- ✓ `LockScreen` sin identidad de marca: añadido bloque `.identity` con eyebrow + título "Guitarra" rojo Bebas 52px + subtítulo "Prof. Josué Barquero".
- ✓ TOC interno en sidebar: `tocConfig.ts` + `useActiveSection` hook (IntersectionObserver) + `tocItems`/`tocItemActive` styles. 17 secciones con `id` explícito.
- ✓ Botón back-to-top flotante (`BackToTop.tsx`) — aparece tras 300px scroll, smooth-scroll al top.
- ✓ TONALIDAD selector sin alcance visible: hint text "Transpone escalas, acordes y grados" bajo el `<select>`.
- ✓ Touch affordances: `onTouchStart`/`onTouchEnd` en CirculoDeQuintas y RelativasMenores; "hover · clic" → "toca · clic"; scroll shadow (CSS background attachment local) en 5 wrappers de tabla T1.
- ✓ Body text IBM Plex Mono 13px → 16px: `global.css p, li` + 14 `.text` rules en CSS modules de sección.
- ✓ `transition: all` → propiedades explícitas en 5 archivos CSS (NoteSelector, AudioButtons, ModoClaseSection, ProcessControls, ProcessPanel).
- ✓ TOC label duplicado (`s-escala` y `s-tension` apuntaban a `t1.s05.label`): `tocConfig.ts` corregido para usar `t1.s06.label` en `s-escala` — la key correcta ya existía.
- ✓ Highlight progresivo durante reproducción de audio: `playingAction` en `AudioButtons`, `playingIdx` en `AcordesBuilder`, `playingCell` en `GradosArmonicos`, `PlayingState {tonic,step}` en `ReglaQuinta`, `playingArrow` en `TensionResolucion`, `playingNote` + `isPlayingRef` en `ModoClaseSection` → `playingNote` prop en `ChromaticCircleAnimated`. Amber ring SVG + dimming opacity 0.25–0.4 en los 6 sitios. Verificado por inspección DOM.

**1ª ola — Rule 2 / Craft / Polish (2026-05-04):**
- ✓ Rule 2 (Note-Color Quarantine): `ROLE_COLORS` eliminado, `userPicked` migrado, `IntervalsSection.color` eliminado, `MasterTriad` `#fff` border → `var(--paper)`.
- ✓ T2Module header eliminado completamente; T1Module reescrito con voz editorial.
- ✓ Em dashes en 9 SectionLabel sites + IntervalsSection desc → `·`.
- ✓ MasterTriad `<h2>` anidado → `<h3>`.

**2ª ola — Motion / A11y / Visual / Tokens (2026-05-04):**
- ✓ `prefers-reduced-motion`: `useProcessAnimation` salta a estado final; `global.css` añade `@media (prefers-reduced-motion: reduce)` global override; Sidebar drawer migrado a `transform: translateX`.
- ✓ Side-stripe borders nuevos: ProcessPanel.stepActive, TablaMaestra.rowActive (eliminados, reemplazados por bg tint + bold weight); FExceptionBanner (full border 1px).
- ✓ SVG/DOM nodes con `tabIndex`/`role="button"`/`aria-label`/`onKeyDown`/`onFocus` (audio en focus para paridad keyboard).
- ✓ ProcessControls aria-labels en ◀ ⏸ ▶ y `<select>` velocidad.
- ✓ LockScreen error con `role="alert"`.
- ✓ Em dashes en `es.json`/`de.json` → `·`.
- ✓ `#b8b0a5` y `#5a5550` migrados a nuevo token `--text-body` en `:root` y `[data-theme="light"]`. 6 `.module.css` consumidores actualizados.
- ✓ `STATE_COLORS.natural.fill` → `color-mix(in srgb, var(--paper) 12%, transparent)`.
- ✓ Mástil de intervalos (`Intervals.module.css`) migrado a `--fret-bg`/`--fret-nut`/`--fret-wire`/`--string-dark`/`--muted`. `border-right: 2px brown` reducido a 1px paper.
- ✓ `LockScreen` error color `#e25555` → `var(--red)`. Botón `:hover` ámbar→rojo añadido.
- ✓ `AppShell.main` 65ch: añadido `max-width: 70ch` en `p, li` global.
- ✓ ModoClase `.intro` CSS muerto eliminado; `.actionBtn` pill 14px → 0.
- ✓ ProcessPanel `.stepPast` `#8a8580` → `var(--muted)`.
- ✓ rgba(255,255,255,*) evitable en HerramientaSection toolBox, TablaMaestra hover/expanded, ModoClase controls → tinted paper-cream.

**3ª ola — Polish trivial (2026-05-04):**
- ✓ LockScreen `.button:focus-visible` espejo de `:hover` (ámbar→rojo, paridad keyboard).
- ✓ Sidebar mobile overlay `rgba(0, 0, 0, 0.6)` → `rgba(14, 14, 14, 0.7)` (ink-deep tinted).
- ✓ HerramientaSection `.toolBox` y `.card` `border-radius: 6px` → `0` (no eran controles del POC).
- ✓ Header watermark `rgba(255, 255, 255, 0.03)` → `rgba(245, 240, 232, 0.04)` (paper-cream tinted).
- ✓ `Footer.tsx` migrado de `React.CSSProperties` inline a `Footer.module.css`.

**4ª ola — Doctrinales aprobadas (2026-05-04):**
- ✓ Contraste WCAG AA de las 12 nota-hues sobre cream `#f5f0e8` resuelto vía opción (a): overrides oscuros para `[data-theme="light"]` que preservan identidad de hue. Las 12 hues son ahora CSS vars (`--note-c..--note-b`) en `:root` (valores originales) y `[data-theme="light"]` (variantes 4.79–7.08:1 contra cream). `data/notes.ts NOTE_COLORS` migrado a `var(--note-X)` strings (transparente para consumidores SVG/inline). Excepción doctrinal documentada en §2 "Light-theme overrides". Trade-off explícito: E pasa a deep ochre `#7d6500` — yellow-on-cream-AA es físicamente imposible sin desaturar a ámbar/mostaza.
- ✓ **RuleNote rediseño:** `border-left: 3px solid var(--red)` → `border: 1px solid var(--red)` + `background: rgba(192, 57, 43, 0.06)`. Padding-left ajustado de 20px a 18px para compensar shift de 2px (3px stripe → 1px border). Patrón ahora paralelo a FExceptionBanner (full border 1px + tinted bg al 6%). Resuelve la última deuda legacy del repo personal documentada en DESIGN.md.
- ✓ **Mute toggle global de audio:** nuevo state `audioMuted` en `useUIStore` (Zustand) con default `true` (audio off al cargar). `useAudioEngine` (`playNote`/`playClick`/`playRhythm`) respeta el mute via `getState()` para evitar stale closures. Nuevo componente `MuteToggle.tsx`/`MuteToggle.module.css` en sidebar (espejo estructural de `ThemeToggle`, label "AUDIO · OFF / ON" Plex Mono uppercase, track rojo cuando ON). `aria-label`/`aria-pressed` correctos. Sidebar themeArea ahora flex column con gap. Implementa el principio de PRODUCT.md "audio nunca obligatorio" como switch real en lugar de promesa.
- ✓ **ProcessPanel.titulo en Playfair italic** marcado como excepción doctrinal (las preguntas pedagógicas del método cuentan como citas literales).
- ✓ **One Voice Rule** revisada — densidad >10% en TablaMaestra/ModoClase aceptada como cost de las 2 secciones más interactivas; mantener resto de pantallas ≤10%.

**5ª ola — Bloque A de T1 (2026-05-05):**
- ✓ Construcción de T1 secciones 01, 02, 03, 06 (`NotasNaturalesSection`, `CirculoCromaticoSection`, `IntervalosSection`, `TriadasSection`). 4 wrappers + 4 CSS modules + `T1Module.tsx` reescrito + `data/literalContent.ts` con contenido verbatim del source. Refactor de las 3 primitivas migradas (`ChromaticCircleSection`, `IntervalsSection`, `TriadsSection`) para extraer `<SectionLabel>` + `<h2>` + section wrapper al consumer. Las primitivas pasan a renderizar solo la visualización interactiva.

**6ª ola — Bloque B de T1 (2026-05-05):**
- ✓ Tres secciones nuevas implementadas: 04 (Escala mayor + estables/tensas, §1.4), 07 (Acordes mayores y menores, §1.7), 08 (Regla de la 5J + excepciones, §1.8). T1 ahora muestra 01-02-03-04-06-07-08 en orden; 05 (Tensión y resolución) queda ausente para bloque posterior, sin renumeración.
- ✓ Tres primitivas net-new en `src/components/primitives/`: `EscalaMayor` (strip lineal de 13 nodos con T-T-S-T-T-T-S explícito, discriminación de roles por opacity/size/ring sin segundo color de palette), `AcordesBuilder` (3 nodos Signature horizontales, toggle local Mayor/Menor, audio Bloque + Arpegiado), `ReglaQuinta` (12 filas tónica → 5J, fila B → F# con tratamiento de banner ámbar full-border 1px + bg 6%).
- ✓ Utilidades de spelling musical en `utils/noteCalculations.ts`: `majorScaleSpelled`, `chordSpelled`, `perfectFifth`. Implementan la regla "una letra por grado, accidental ajustado". Disponibles para futuro consumo de T2 si lo requiere.
- ✓ Polish colateral en `NoteSelector`: ahora aplica `noteShort()` internamente y emite `aria-pressed` por chip. Side-effect en T2: las chips de `ProcesoSostenidosSection` muestran F♯/C♯ en lugar de F#/C# (cambio universalmente positivo, mejor tipografía).
- ✓ Build limpio. Lint limpio. Anti-checklist 14/14 pasada (énfasis verificado en Note-Color Quarantine para sección 04).

**7ª ola — `<NoteToken>` + prosa estructurada (2026-05-06):**
- ✓ Nuevo componente `<NoteToken>` (`src/components/shared/NoteToken/`): `<span>` inline con color = `var(--note-X)` correspondiente y bg tint al 12% via `color-mix()`, padding 0 4px, radius 0, font hereda del párrafo (sin Bebas/Bold forzados), focus ring ámbar visible, audio on hover/focus respetando `MuteToggle` global. Selectores por `data-note` cubren los 12 cromáticos sostenidos más sus enarmonías bemol (`Bb→a-sharp`, `Eb→d-sharp`, `Db→c-sharp`, `Ab→g-sharp`, `Gb→f-sharp`).
- ✓ Nuevos tipos `NoteSpelling` (en `types/music.ts`, superset de `ChromaticNote` con flats Db/Eb/Gb/Ab/Bb) y `ProseFragment`/`ProseSegment` (en `types/prose.ts`). `noteShort()` extendido para convertir `Xb` → `X♭` además de `#` → `♯` (cambio aditivo, no rompe callers existentes).
- ✓ Nuevo componente `<Prose>` (`src/components/shared/Prose/`): renderiza un `ProseSegment` iterando texto plano + `<NoteToken>` por fragmento.
- ✓ Migración de `data/literalContent.ts`: 18 strings de prosa que contenían referencias concretas a notas se convierten a `ProseSegment`; los strings sin notas quedan como `string`. Tablas y step-lists mantienen su forma de array; los consumidores tokenizan las celdas que tengan nombres de nota.
- ✓ Las 7 secciones de T1 (`NotasNaturales`, `CirculoCromatico`, `Intervalos`, `EscalaMayor`, `Triadas`, `Acordes`, `ReglaQuinta`) actualizadas: tablas de notas y prosa con tokens; visualizaciones SVG (primitivas) sin cambios.
- ✓ Build limpio. Lint limpio. Anti-checklist 14/14 pasada. Densidad alta de note hues en prosa de secciones 03/06/07 documentada como deuda doctrinal aceptada (ver §7).

**8ª ola — `quieter` sobre `<NoteToken>` (2026-05-06):**
- ✓ Cierre de la deuda "Densidad de note hues en prosa de T1" introducida por la 7ª ola. Mitigación aplicada: **B (eliminar bg tint, identidad solo por color del texto)**. La A (12%→8%) probada y descartada porque atenúa el peso individual del chip pero no resuelve la causa raíz del ruido en pasos densos: el *número* de chips simultáneos. Eliminar el background colapsa el chip layer dejando la identidad cromática donde canónicamente vive (color del glifo, mismo canal que `ChromaticNode` SVG).
- ✓ Cambio quirúrgico en `NoteToken.module.css`: removidas las 12 declaraciones `background: color-mix(...)`; `transition-property` reducido a sólo `color` (sin `background-color` huérfano). Padding, focus ring, audio, ARIA, keyboard reach: intactos.
- ✓ Sparse case (1-3 tokens en `TRIADAS_EJEMPLO`, `REGLA_BULLETS.ejemplo`, `ACORDES_RESULTADO_*`): identidad preservada por color saturado del glifo (las 12 hues pasan AA contra `--bg` en ambos temas desde la 4ª ola). Dense case (`INTERVALOS_PROCEDIMIENTO_PASOS[1]` con ~25 tokens): el "rainbow chip salad" desaparece, queda secuencia de letras coloreadas espaciadas como syntax highlighting editorial.
- ✓ Build limpio. Lint limpio. Anti-checklist 14/14 (énfasis verificado en items 1, 2, 8, 9, 10, 13). CSS bundle bajó 0.78 kB (39.46 → 38.68) confirmando la sustracción.

**9ª ola — Bloque C de T1: sección 05 (2026-05-06):**
- ✓ Construcción de la sección 05 (Tensión y resolución, §1.5) — última sección pendiente del WBS Fase 3. **T1 cierra completo** con orden 01-02-03-04-05-06-07-08.
- ✓ Primitiva net-new `TensionResolucion` (`src/components/primitives/TensionResolucion/`): strip de 8 nodos en C mayor fija (la configurabilidad de tonalidad ya vive en §1.4), 6 flechas SVG curvas conectando cada nota tensa con su(s) destino(s) estable(s). Discriminación de jerarquía de tensión por **stroke-width** (1.5 / 2 / 2.5 / 3) — sin segundo color de palette. La cuarentena de note hues respetada: nodos usan `NOTE_COLORS[X]` (ese ES su rol), flechas usan `var(--muted)` y `var(--paper)`.
- ✓ Cada flecha es focusable y reproduce su secuencia origen → destino con gap de 260ms vía `useAudioEngine` (respeta `MuteToggle`). Tabindex/role/aria-label/onKeyDown(Enter|Space)/onClick/onFocus completos. Debounce de 150ms en el callback compartido para evitar el doble-trigger natural de mouse-click + focus-event.
- ✓ Wrapper `TensionResolucionSection`: SectionLabel + h2 + intro + lista numerada (counter CSS + `<Prose>` por entrada) + primitiva + RuleNote con consejo. Orden de prosa fiel al método; las 4 reglas mencionan los grados como notas concretas en C mayor (D, F, A, B → C/E/G) y usan `<NoteToken>` para esas referencias.
- ✓ Extensión a `data/literalContent.ts`: bloque §1.5 (`TENSION_INTRO`, `TENSION_REGLAS`, `CONSEJO_TENSION`, `TENSION_PRIMITIVA_TITULO`, `TENSION_PRIMITIVA_INSTRUCCION`).
- ✓ `T1Module.tsx` actualizado para insertar la sección entre `EscalaMayorSection` y `TriadasSection`.
- ✓ Build limpio. Lint limpio. Anti-checklist 14/14 OK. **Sin deuda nueva introducida** — la sección hereda la deuda existente de "highlight progresivo durante reproducción" (extendida en §7 para incluirla explícitamente). NO se creó helper genérico en `utils/noteCalculations.ts` — la primitiva hardcodea C mayor; cualquier generalización futura debería emerger de un segundo consumidor real, no de anticipación.

**10ª ola — Bloque D de T2: sección 4.7 Grados armónicos (2026-05-08):**
- ✓ Construcción de la sección 4.7 (Grados armónicos según la escala mayor, §2.7–§2.8 del source). Primera sección net-new de T2 después del POC migrado (4.1–4.6 ya cubiertos por TablaMaestra/etc). 4.8 (5 progresiones) y 4.9 (relativas menores) quedan para bloques posteriores.
- ✓ Primitiva net-new `GradosArmonicos` (`src/components/primitives/GradosArmonicos/`): tabla pedagógica que se transforma a través de un stepper de 3 estados (Letras solas / Con armadura / Calidades) sobre **una sola tabla**, no tres apiladas. La transformación ES la pedagogía. Filas 1-4 (Escala / Tónica / Tercera / Quinta) presentes desde el estado 1; filas 5-6 (Grado / Acorde) renderizadas siempre con `opacity: 0` y reveladas con transición de opacity al estado 3 — espacio vertical reservado desde el inicio para evitar animar layout properties (cumple Don't 10).
- ✓ **Discriminación de calidad por tipografía** (cuarentena de note hues respetada): I/IV/V Plex Mono bold uppercase 16px; ii/iii/vi Plex Mono regular lowercase 14px; vii° Plex Mono italic 12px con símbolo °. Sin paleta secundaria — la tipografía discrimina sola, igual que stroke-width discriminó tensión en la 9ª ola. **Carácter** (estable/medio/tenso) NO codificado en la primitiva; vive en tabla adyacente del wrapper, fiel al método original que separa "calidad" de "carácter" en dos tablas.
- ✓ **Acorde clickable como columna de la primitiva**: cada celda de la fila Acorde (en estado 3) es role="button" + tabIndex=0 + onClick/onFocus/onKeyDown(Enter|Space) + aria-label. Reproduce la tríada en arpegio ascendente (220ms gap) vía `useAudioEngine` (respeta MuteToggle). Debounce de 150ms en `lastFireRef` evita el doble-trigger mouse-click + focus (mismo patrón que TensionResolucion). En estados 1-2 las celdas tienen tabIndex=-1 + aria-hidden + sin handlers — invisible y no-tabable hasta que el estudiante alcanza el estado 3.
- ✓ **Octava ascendente computada por wrap del modular-7**: el chord para grado vii° en A mayor (G♯-B-D) requiere subir B y D una octava sobre G♯5; helper `chordMemberOctave(diatonic, gradeIdx, offset)` añade +1 cuando `gradeIdx + offset >= 7`. Implementación inline en la primitiva — NO se extrajo a `noteCalculations.ts` siguiendo la regla "generalizar al segundo consumidor real, no por anticipación".
- ✓ **NoteToken canónico en celdas de notas**: cada celda de Escala/Tónica/Tercera/Quinta es UNA nota individual → uso canónico (cumple cuarentena). Spelling no tokenizable (E♯/B♯/dobles accidentales para tónicas extremas como A♯ mayor) cae a texto plano con `.rawNote` — preserva el contraste pedagógico documentado en §7.
- ✓ Wrapper `GradosArmonicosSection` (`src/components/modules/t2/components/`): SectionLabel `4.7 · Grados armónicos` + h2 + intro (simetría/fractalidad sin tokens — son conceptos, no notas) + procedimiento como `<ol counter-reset>` (mismo patrón de TensionResolucionSection) + selectorRow con NoteSelector reutilizado + GradosArmonicos primitiva + paragraph del patrón M-m-m-M-M-m-dim sobre `--surface` + tabla "Nombre y carácter" (datos del wrapper, no de la primitiva) + análisis de carácter en 4 párrafos + RuleNote con el consejo de memorizar el patrón.
- ✓ Extensión a `data/literalContent.ts` con bloque §4.7: `GRADOS_INTRO_SIMETRIA`, `GRADOS_INTRO_FRACTAL`, `GRADOS_PROCEDIMIENTO_TITULO`, `GRADOS_PROCEDIMIENTO_PASOS`, `GRADOS_PRIMITIVA_INSTRUCCION`, `GRADOS_PATRON`, `GRADOS_NOMBRE_CARACTER_TITULO`, `GRADOS_NOMBRE_CARACTER`, `GRADOS_ANALISIS_*` (4 párrafos), `GRADOS_CONSEJO`. Sin ProseSegment porque §4.7 es prosa de roles/conceptos (T, 3ra, sensible tonal, etc.) — la cuarentena prohíbe tokenizar conceptos. Em dashes que el agente introdujo durante el draft fueron migrados a `:` / `;` / `(...)` per Middle-Dot Separator Rule.
- ✓ `T2Module.tsx` actualizado para insertar la sección entre `TablaMaestraSection` y `ModoClaseSection`. SectionLabel usa numeración WBS decimal (`4.7 · ...`) en lugar de `01–06` — coexistencia consciente: las secciones del POC migrado mantienen su numeración 01–06 hasta que ese bloque se reescriba; las nuevas secciones de T2 usan WBS.
- ✓ Build limpio. Lint limpio (mis archivos `.tsx` no entran al lint config — sólo `*.{js,jsx}` están bajo ESLint; los 50 errores de `npm run lint` son pre-existentes en `.claude/skills/impeccable/scripts/*.js`, third-party, sin relación con esta ola). Anti-checklist 14/14 OK con greps verificadores en items 2, 7, 14. **Sin deuda nueva introducida** — la primitiva hereda la deuda de highlight progresivo (5to sitio paralelo, registrado en §7).
