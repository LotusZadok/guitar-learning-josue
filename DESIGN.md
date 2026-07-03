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
- **Body** (IBM Plex Mono 400, 13px, line-height 1.8): párrafos del método, descripciones de intervalos, listas. **El line-height 1.8 es alto a propósito** — el método tiene párrafos densos y necesita aire entre líneas para no parecer compilado. Cap line length 90ch.
- **Label** (IBM Plex Mono 500, 11px, letter-spacing 1px, uppercase): SectionLabel ("03 · Notas"), nav links, captions, role chips, footer copy. El separador estándar es `·` (U+00B7, middle dot), nunca em/en dash.
- **Quote** (Playfair Display 400 italic, 12px, line-height 1.6): la cita del header global. Reservada exclusivamente para citas literales (eslogan, frases de Josué). Nunca decorativa.

### Named Rules

**The Editorial Trio Rule.** Bebas Neue solo en mayúsculas, Plex Mono solo en cuerpo y labels, Playfair solo en italic para citas literales de Josué. Ninguna combinación cruzada (ej: Bebas en lowercase, Playfair como título o subtítulo). Las tres fuentes mantienen su rol o no aparecen. Si una fuente tiene una Named Rule fijando su único caso de uso, **cualquier otro uso es una falla del diseño** — no una "interpretación creativa".

**Excepción sancionada (Playfair como notación musical, 22ª ola).** Los símbolos de **dinámica musical** (`pp p mp mf f ff`) se renderizan en Playfair Display italic, como aparecen en una partitura real. Es una excepción explícita a la Editorial Trio Rule, análoga a los glifos de notación (noteheads/arpegio de los Playback Buttons): un símbolo de notación musical **no es UI copy ni un título editorial**, es un glifo del dominio. El test para futuras auditorías: ¿el texto en Playfair es (a) una cita literal de Josué, o (b) un símbolo de notación musical estándar (dinámica, y eventualmente otros)? Sí → válido. Cualquier otro uso (título, subtítulo, "ambiente editorial") sigue siendo violación. Único consumidor hoy: `DynamicsSelector`.

**The 90ch Rule.** Cualquier párrafo de cuerpo respeta `max-width: 90ch`. La tipografía mono es legible solo cuando la línea no es un viaje horizontal. En el módulo T2 esto significa que las explicaciones del método viven dentro de un container con max-width acotado, no llenando viewport.

Revisado el 19/6/26: el cap original de 70ch (heredado de la convención editorial genérica de 65-75ch) dejaba un gutter vacío de hasta 368px a la derecha de cada párrafo en pantallas anchas con sidebar visible (`.main` cap 1100px, medido en sección 1.1 a 1920px de viewport real) — y frases de cuerpo de 72-80 caracteres (comunes en la redacción del método) quedaban partidas en dos líneas aunque sobraba espacio horizontal de sobra para que entraran completas. El problema no era de un breakpoint puntual: aparece en cualquier ancho donde 70ch deja de ser el límite real (`.main`/`.section` lo es, no la pantalla angosta). Subir el cap a 90ch reduce el gutter a ~176px en ese mismo caso y deja entrar frases más largas sin partirse. Se evaluó centrar la columna en vez de ensancharla (reparte el gutter en partes iguales sin tocar el cap) — descartado por el usuario en favor de aprovechar el ancho liberado directamente.

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

### NoteToken en Tablas

**Regla:** cualquier celda de `<table>` (o grid tabular con `role`/semántica equivalente) cuyo contenido sea **una grafía de nota individual** (no un acorde completo, no un número romano, no un nombre de intervalo) debe envolverse en `<NoteToken>` en vez de renderizarse como texto plano. Auditoría del 25/6/26 sobre las 7+ tablas de T1/T2 confirmó 4 ya conformes (`EscalaMayorSection`, `TriadasSection`, `RelativasMenoresSection`, `GradosArmonicos`) y 2 gaps reales, corregidos: `TablaMaestraSection` (columnas armadura/tonalidad) e `IntervalosSection` (fila "Resultado", incluyendo la celda de tritono con dos grafías enarmónicas separadas por `/`).

**Por qué:** `NoteToken` es la única superficie que conecta una grafía con su hue cromático (Note-Color Quarantine) y con audio al click/hover/focus. Una nota en texto plano dentro de una tabla rompe esa asociación pedagógica sin razón — el usuario pierde la posibilidad de "escuchar" la celda y el refuerzo visual de color.

**Excepciones documentadas (no tokenizar):**
1. **Tablas pedagógicamente deliberadas que ocultan alteraciones.** La primera tabla de `IntervalosSection` muestra solo letras naturales (`n[0]`) porque el método aún no explicó por qué ciertas notas llevan ♯/♭ en ese punto de la lección. Tokenizar reproduciría audio de la nota equivocada.
2. **Grafías no canónicas fuera del set de 17 que `NoteSpelling` soporta** (`Cb`, `Fb`, `E#`/`E♯`, `B#`/`B♯` — tonalidades de 6-7 alteraciones). Caen a `<span>` con texto plano formateado con glifo unicode (`♭`/`♯`), nunca ASCII (`b`/`#`). Patrón: guard `VALID_NOTE_SPELLINGS.has(spelling) ? <NoteToken .../> : <span>{glifo}</span>`, establecido en `EscalaMayorSection.tsx` y replicado en `TablaMaestraSection.tsx`.
3. **Tablas de números romanos / calidad de acorde / nombres de función** (`GradosArmonicosSection`, fila Grado/Acorde de `GradosArmonicos`): usan discriminación tipográfica (bold/lowercase/italic), no color — la celda no representa una nota individual sino un rol armónico. Ver Note-Color Quarantine Corolario (Roles y estados).
4. **Tablas de nombres de intervalo o conteo de semitonos** (`INTERVALOS_13_HEAD`/`INTERVALOS_13_ROW`): el contenido es metadata del intervalo, no una nota.

### Playback Buttons (Bloque / Arpegio)

**Regla (20ª ola; glifos refinados en la 22ª):** todo control de reproducción Bloque/Arpegio en la app usa el componente compartido `shared/PlaybackButton`. Es **icono-only**: se ve sólo el glifo de notación (**bloque** = tres noteheads alineadas verticalmente en columna; **arpegio** = las mismas noteheads desplazadas en diagonal ascendente) y la etiqueta de texto aparece sólo en hover/focus como tooltip absoluto (sin layout shift). Sin líneas auxiliares (se removieron el corchete del bloque y el zigzag/flecha del arpegio): el contraste lo carga la alineación (columna) vs el desplazamiento (diagonal), que es la diferencia notacional real entre sonido simultáneo y sucesivo. El nombre del modo siempre está disponible para AT vía `aria-label`. Etiquetas estándar centralizadas (es: Bloque/Arpegio · de: Block/Arpeggio) — antes divergían entre consumidores (Arpegio/Arpegiado/Arpeggio).

**Dos modos de uso:** prop `pressed` definido → es un **toggle de modo** (`aria-pressed`, estado de selección persistente, tint Active rojo 8%); `pressed` ausente → es un **botón de acción** (dispara la reproducción al click). Consumidores: `AcordesBuilder` (acción), `TriadsSection` y `ProgresionesArmonicas` (toggle). `prop playing` añade el anillo ámbar mientras suena.

**Por qué icono-only:** el glifo de notación musical es autoexplicativo para el dominio (guitarra/teoría) y mantiene los controles compactos junto a la visualización; el texto en hover cubre al usuario que aún no asocia el glifo, sin gastar espacio permanente ni romper el ritmo del cuaderno.

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
- **Do** mantener `max-width: 90ch` en cualquier párrafo de cuerpo. El método tiene texto largo y necesita columnas legibles sin dejar gutter vacío en pantallas anchas (ver §3 Named Rules, The 90ch Rule).
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

**Última actualización:** 2026-07-03 (34ª ola — migración del contenido pedagógico T1/T2 a i18n; `data/literalContent.ts` eliminado).

### Doctrina activa (decisiones pendientes de diseño)

- **`ProcessPanel.titulo` en Playfair italic.** Las preguntas pedagógicas ("¿Cómo saber la armadura partiendo de la tonalidad?") **se tratan como citas del método** de Josué (decisión 2026-05-04). Excepción al Editorial Trio Rule documentada aquí: las preguntas-pregunta del método cuentan como citas literales. NO mover a Plex Mono. Cualquier auditoría futura que la flagee debe consultar esta entrada antes.
- **One Voice Rule en concentración alta** (≥10% combinado de rojo + ámbar en TablaMaestra/ModoClase con SectionLabels rojos + chipActive + ToggleSwitch ON + spans de marca). Decisión 2026-05-04: **aceptable**. La densidad de las dos secciones más interactivas justifica el peso visual del acento. No requiere acción mientras el resto de pantallas se mantenga ≤10%.
- **`--string1..6` y `--caged-*` están definidos solo en `:root`.** Per DESIGN.md §2 doctrina, los hues de nota base son **fijos** (la identidad de la cuerda E al aire es la nota E). Esta entrada existe para documentar la decisión: dejarlos en `:root` es correcto. Si una pasada futura los redefine para light, está rompiendo doctrina. Nota: las **note hues principales** (`--note-c..--note-b`) sí tienen overrides para light desde la 4ª ola — son cosa distinta.
- **`FExceptionBanner` con `border` 1px completo** es el patrón actual tras el fix de side-stripe. Una alternativa más editorial-académica sería el patrón **eyebrow chip "F"** + paragraph (sin border completo, solo leading badge). Requiere edición de JSX (fuera del alcance de la pasada de visual). Pendiente como decisión estilística.
- **Contextos de sonido: tónica-relativos vs identidades absolutas (decisión 2026-06-11).** El principio "tónica = piso" (la tónica activa es la nota más grave; todo orbita ascendiendo desde ella) aplica SOLO a componentes anclados a una tonalidad. Inventario vigente:
  - **Tónica-relativos (piso obligatorio):** `NoteToken` sin prop `octave` (ancla vía `octaveAboveTonic`), `EscalaMayor`, `TensionResolucion`, `GradosArmonicos`, `ProgresionesArmonicas`, `AcordesBuilder`, `TriadaProceso`, `AudioButtons` (escala/tónica), `MasterTriad` (cadena ascendente desde su raíz).
  - **Anclados a su raíz local (cada par/tríada es su propio piso):** `ReglaQuinta` y `CirculoDeQuintas` (12 pares T→5J, la T de cada fila es el piso), `TriadsSection` (la raíz de cada tríada es el piso).
  - **Identidades absolutas (octava fija 4, SIN piso):** `ChromaticCircleSection` (§1.2), `RelativasMenores`, `ChromaticCircleAnimated` (T2, además `playOnClick` nunca se habilita hoy). Presentan las 12 notas como identidades; forzar el piso ahí rompería la presentación neutral del círculo. Si una pasada futura "corrige" estas octavas hacia la tónica, está rompiendo esta decisión.
  - Consecuencia aceptada: dos tokens sueltos en prosa con relación local propia (ej. "D → A" en bullets de §1.8) pueden no ascender entre sí — cada uno se ancla a la tónica global, la ley del piso gana. Si se quiere oír el par ascendente, eso es una secuencia (`playSequence` anclada a su raíz, como hace la primitiva `ReglaQuinta`), no dos tokens.
- **Tokens semánticos sugeridos por agentes pero no creados:**
  - `--text-faded` para `.stepPast` y similares ("este paso ya pasó / atenuado"). Hoy usa `var(--muted)` que es fuente de luminancia distinta. Si la diferencia visual es importante, vale la pena el token nuevo.
- **Doble sostenido / doble bemol en spelling de acordes para tónicas extremas.** Las funciones `majorScaleSpelled`/`chordSpelled` aplican la regla "una letra por grado". Para D♯, G♯, A♯ mayores eso produce F♯♯, B♯, C♯♯ (correcto teóricamente, inusual visualmente). Pedagogía musical estándar resuelve esto eligiendo la enarmonía bemol equivalente (E♭, A♭, B♭). Decisión pendiente: dejar la teoría estricta como está, o auto-redirigir tonics extremas a spelling con bemoles. Hoy la primitiva acepta toda tónica del tipo `ChromaticNote` (con sostenidos) y muestra el resultado como sale. Si emerge fricción de uso (estudiantes pidiendo "Eb mayor"), pasada futura puede añadir un input flat-aware sin romper la actual.
- **Claves i18n huérfanas de versiones previas conviven con las claves vivas.** La 34ª ola confirmó que varias claves de `es.json`/`de.json` no tienen consumidor (`t1.s03.tip`, `t1.s04.procedure`/`result`/`octave_rule`, `t1.s05.resolutions`, `t2.s47.stepper`, `t2.s49.intro_p1`/`intro_p2`/`scale_example_*`, entre otras): son residuo de versiones donde la sección renderizaba esa prosa estática antes de volverse dinámica, o duplicados planos de contenido que hoy vive como `ProseSegment` (ej. `intro_p1` vs `intro_prose`). No se eliminaron en la 34ª ola (fuera de alcance de la migración de forma). Limpieza pendiente: auditar claves sin consumidor y podarlas — con i18n como única fuente de verdad del contenido, cada clave muerta es un candidato a drift.
- **Spellings inválidos en prosa quedan como texto plano (no token).** El método menciona explícitamente `B#`, `E#` y `Fb` como spellings que NO existen o NO se usan ("se omiten B# y E#", "5J de Bb es F (no Fb)", "5J de A# aparece como E# enarmónica"). NoteToken solo cubre los 17 spellings con `--note-X` (12 cromáticos con sostenidos + 5 enarmonías bemol comunes). Decisión: dejar `B#`/`E#`/`Fb` como texto sin tokenizar para preservar el contraste pedagógico "lo válido vs lo descartado". Si futuras secciones del método requieren tokenizarlos (improbable), añadir vars dedicadas o alias enarmónicos al `DATA_NOTE` map.

### Histórico (resueltas, conservar para contexto)

Esta sub-sección lista deudas que **sí** fueron resueltas. Útil para no reabrirlas y para entender el camino de la doctrina.

**34ª ola (2026-07-03): migración del contenido pedagógico T1/T2 a i18n (elimina `literalContent.ts`):**
- ✓ **T3 tenía el patrón correcto; T1/T2 migraron hacia él.** Todo el contenido pedagógico vivo de T1 (§1.1–§1.8) y T2 (§2.1–§2.8) pasó de `data/literalContent.ts` (constantes con sufijo `_DE` bifurcado) a claves `t1.sXX.*`/`t2.sXX.*` en `i18n/locales/{es,de}.json`, contenido exacto preservado — migración de forma de almacenamiento, no reescritura de copy. Ambos `literalContent.ts` eliminados; grep `literalContent` en `src` = 0.
- ✓ **Prosa con notas como `ProseSegment` en JSON:** los segmentos estructurados (`{type:'text'|'note'}`) se guardan tal cual en los locales y se leen con `t(key, { returnObjects: true })` — el pipeline `<Prose>`/`<NoteToken>` no cambió. También arrays de objetos completos (`t1.s08.bullets` con `{regla, desc, ejemplo}`).
- ✓ **Datos musicales ≠ copy:** tablas de notas (círculo cromático, 7 tríadas, herramienta F C G D A E B, solfeo§1.1), números romanos de grados y `PROGRESIONES_DATA` (tipada con `DiatonicDegree`, consumida por la primitiva de audio) NO fueron a i18n — viven como const local del componente/primitiva consumidora. Duplicar datos idénticos en dos locales sería drift esperando a pasar.
- ✓ **Constantes muertas no migradas:** ~70 exports de `literalContent.ts` sin ningún consumidor (prosa que olas previas ya habían migrado a i18n, pasos de proceso reemplazados por render dinámico según tónica) murieron con el archivo; su canon sigue en `docs/source_of_truth_T1_T2.md`.
- ✓ **Nuevo grupo `t2.s44`** (herramienta §2.2, antes sin claves propias) con label/intro/explicaciones/propiedades/tip; `tocConfig` de herramienta pasa de label hardcodeado a `labelKey` — cierra el gap del sidebar alemán que mostraba el label en español. Dos encabezados de tabla (§1.3 'Nombre'/'Semitono', §1.4 'Grado') reutilizan los `table_headers` ya traducidos y validados: en alemán ahora se lee 'Name'/'Halbton'/'Stufe' en vez del texto español que el constante compartido imponía (gap latente, cerrado con traducciones preexistentes, sin copy nueva).
- ✓ **Doctrina actualizada en lessons-learned.md:** la regla de almacenamiento de contenido (antes "va en literalContent.ts, nunca en i18n") se reemplazó por la doctrina real (i18n es la fuente de verdad, sin archivo intermedio); anti-checklist item 6 y la lección de em-dashes mueven la zona sancionada de em/en dashes del método a las claves `tN.sXX` de los locales.
- ✓ Build + typecheck limpios; lint sin errores en `src` (los 50 preexistentes de `scripts/*.js` de terceros siguen documentados). Verificado en browser (ES y DE, T1+T2 completos, tokens de nota y banner de excepción F intactos, consola limpia). Anti-checklist 14/14.

**33ª ola (2026-07-03): §3.9 Escala menor con séptimas + §3.10 Progresiones armónicas en escala menor:**
- ✓ **Reúso sin teoría nueva:** `relativeMinorScaleSpelled(majorTonic)` (nueva, `utils/noteCalculations.ts`) rota el array ya existente de `majorScaleSpelled` al 6to grado — la menor natural relativa ES la mayor relativa leída desde otra tónica, mismas 7 notas. El piso (tónica-menor-más-grave) se recalcula con `spelledSequenceAscending` porque la rotación por sí sola no preserva el ascenso (verificado a mano: sin esto, C4 sonaba más grave que A4 en A menor).
- ✓ **`GradosArmonicos` extendida** (`relativeMinor?: boolean`, default `false`, T2 y 3.1-3.8 sin cambios de comportamiento): nuevos `QUALITIES_MINOR`/`SEVENTH_QUALITIES_MINOR`/`ROMANS_MINOR` (i, ii°, ♭III, iv, v, ♭VI, ♭VII — verificados a mano contra la rotación de los arrays mayores, coinciden dígito a dígito). `DEGREE_ROLE`/`HARMONIC_ROLE` (color de estabilidad/función) se **reutilizan sin rotar**: son un mapeo genérico por índice de grado (tónica=reposo, supertónica=medio, etc.), no atado a mayor/menor — aplicárselo al mismo índice en modo menor es la lectura literal de la doctrina existente, pero es una analogía nueva que nadie validó visualmente con el profesor (el contenido teórico de 3.9/3.10 sí está validado; el mapeo de color a la nueva tabla es inferencia de esta ola). `RomanGlyph` generalizada: el chequeo de disminuido pasa de `roman === 'vii°'` (string literal) a `roman.endsWith('°')`, para cubrir también 'ii°' sin tocar el resultado en mayor.
- ✓ **`ProgresionIIVI` extendida** (`relativeMinor?: boolean`, default `false`): `DEFS_MINOR` arma ii°-V7-i sobre la misma escala rotada; el **V7 es la única pieza que se aparta de la menor natural** (necesita la sensible elevada, la menor armónica) — resuelto reutilizando `spelledIntervalFromTonic(tónicaMenor, 7, 'M')` (ya existía para T1/T3, sin math nueva) en vez de una escala armónica dedicada. El `i` se cifra como tríada (`Am`, no `Am7`) siguiendo la tabla exacta de la fuente (a diferencia del `I`/`ii`/`V7` mayores, que sí llevan séptima).
- ✓ **Cierra T3 completo** (3.1.1…3.10). Contenido de `docs/source_of_truth_T3.md` §3.9/§3.10 usado tal cual (profesor lo validó como suficiente); ya no quedan subsecciones 🟡 pendientes en T3.
- ✓ Build + typecheck limpios; lint sin errores nuevos (los 50 preexistentes son de `scripts/*.js` de terceros, ya documentados en la 10ª ola de lessons-learned.md). Sin cambio de comportamiento en T1/T2/T3 mayor (`relativeMinor` default `false` en ambas primitivas). Anti-checklist 14/14.

**32ª ola (2026-06-29): §3.8 Tonización (dominantes secundarias):**
- ✓ **`DominantesSecundarias`** (primitiva net-new): lista de 5 filas V/x → grado tonizado (V/ii=A7→Dm7 … V/vi=E7→Am7 en C), cada fila reproduce la dominante en arpegio y su resolución al grado. El cifrado de la dominante lleva el acento ámbar (tensión); el destino, neutro.
- ✓ **Palanca Tonal.js explotada:** nuevo helper `secondaryDominants(tonic)` en `noteCalculations` usa `Key.majorKey(t).secondaryDominants` + `.chords` (Tonal ya las computa) — es el uso de módulos de alto nivel que se venía difiriendo. Helper `chordAudio(name)` deriva miembros audibles (`Chord.get().notes` + `spelledSequenceAscending`). **`toGlyphCifrado`** convierte el cifrado ASCII de Tonal (`Bbmaj7`, `C#7`) a glifos `♯/♭` (regla ♭-integral) — verificado en F (B♭maj7) y D♭ (B♭7/E♭m7/G♭maj7).
- ✓ **Cierra las secciones 🟢 confirmadas de T3** (3.1.1 … 3.8). Quedan 3.9 y 3.10 (tonalidad menor) marcadas 🟡 pendientes de revisión del profesor en `docs/source_of_truth_T3.md`. Build + typecheck + consola limpios. Anti-checklist 14/14.

**31ª ola (2026-06-29): §3.7 ii-V-I (mayor):**
- ✓ **`ProgresionIIVI`** (primitiva net-new): fila de 3 tarjetas de acorde (ii → V7 → I) con roman + cifrado + función, derivadas de `majorScaleSpelled` (ii=Dm7, V7=G7, I=Cmaj7 en C). Cada tarjeta reproduce su acorde en arpegio; botón "Escuchar ii-V-I" toca la progresión completa. El **V7 (pico de tensión)** lleva acento de borde ámbar (`color-mix`); ii/I bordes neutros. Cifrados en Plex Mono (caso preservado). Función-labels pasadas por prop desde la sección (i18n es/de); separadores en la copy con `·` y la progresión con guiones (`ii-V-I`), no en-dash.
- ✓ Verificado por DOM/computed-styles (screenshot del preview caído toda la sesión): las 3 tarjetas, el acento ámbar en el V7, arrows `→`, cifrados case-correctos. T3 compone 3.1.1 … 3.7. Build + typecheck + consola limpios. Anti-checklist 14/14.

**30ª ola (2026-06-29): §3.6 Dominante 7 (V7) + diagrama de resolución:**
- ✓ **`DominanteResolucion`** (primitiva net-new): diagrama V7 → I. Deriva ambos acordes de `majorScaleSpelled` (V7 = grados 5·7·2·4, I = 1·3·5), marca el **tritono** (3ª/sensible + 7ª del V7) con anillo ámbar, y dibuja **flechas de resolución** ámbar (marker SVG, patrón de §1.5). Botón "V7 → I" reproduce la resolución (V7 en bloque, luego I). Verificado en C: G7 (G B D F) → C (C E G), tritono Si/Fa.
- ✓ **Dirección visual = dirección musical (voice leading).** Bug cazado por geometría DOM (screenshots caídos esta sesión): apilar el I con la raíz abajo hacía que la flecha de la sensible (Si→Do) apuntara hacia ABAJO, contradiciendo "la sensible sube". Fix: el I se coloca **compacto en el centro** para que el tritono (Si abajo-medio, Fa arriba) **converja** hacia él — Si→Do sube, Fa→Mi baja (movimiento contrario). Regla: en un diagrama de resolución/conducción de voces, la posición vertical DEBE mapear la altura real; si una flecha apunta al revés de lo que dice la prosa, el layout está mal.
- ✓ T3 compone 3.1.1 … 3.6. Build + typecheck + consola limpios. Anti-checklist 14/14.

**29ª ola (2026-06-29): §3.5 Grado 7 (armonía diatónica con séptimas):**
- ✓ **Reúso de `GradosArmonicos`** (T2 §2.6) en T3 §3.5: su paso 4 "Séptimas" ya arma los acordes diatónicos con 7ª (`maj7/m7/m7/maj7/7/m7/m7♭5`). Se le añadió un prop opcional `initialStep` (default 1, T2 intacto) para que §3.5 arranque en el paso de séptimas. `GradoSeptimoSection` lo enmarca en T3: intro + caja del patrón + el primitivo + prosa que conecta el **grado 7 (vii) = m7♭5** con §3.2. Reúso correcto: la lógica diatónica (raíz desde `majorScaleSpelled`, terceras apiladas, tonal-derivado) ya existía; sólo cambió el encuadre y el paso inicial.
- ✓ **`m7b5` → `m7♭5` (♭ integral)** en `SEVENTH_QUALITIES`: el cifrado mostraba la 5ª bemol con `b` ASCII en vez del glifo `♭`, violando la regla ♭-integral (12ª ola) e inconsistente con el resto de T3. Corregido en la primitiva (alinea T2 y T3). Grep `m7b5` = 0.
- ✓ T3 compone 3.1.1 … 3.5. Build + typecheck + consola limpios; T2 sin regresión (`GradosArmonicos` default step 1). Anti-checklist 14/14.

**28ª ola (2026-06-29): §3.4 Constructor de acordes completo (los 10 acordes):**
- ✓ **`ConstructorCompletoSection`:** intro + `AcordesBuilder` con `BUILDER_34` (el árbol completo: 9 nodos + tónica, 13 aristas, los 10 acordes del método) + caption + lista de referencia de los 10 cifrados con su fórmula. Cierra el arco del constructor config-driven: §1.7 (hasta quinta) → 3.1.2 (séptimas) → 3.2 (dim) → 3.3 (sus) → **3.4 (todos)**. La topología `BUILDER_34` valida: 5J → 7m/7M, 5d → 7m/7d, **7m compartida** (m7 vía 3m·5, X7 vía 3M·5, m7♭5 vía 3m·5d). Verificado en browser: dim7 (3m·5d·7d) y C7 (3M·5·7m, séptima compartida).
- ✓ **Bebas-all-caps cazado de nuevo** (3ª vez en el proyecto): la lista de cifrados renderizaba `m` (menor) idéntico a `M` (mayor) y colapsaba `m7`/`maj7`/`m7♭5` en Bebas. Fix: `.code` → Plex Mono (preserva el caso semántico del cifrado). Confirma el corolario de la 20ª ola: **cualquier texto con caso significativo va en Plex Mono, nunca Bebas** — el cifrado de acorde es exactamente eso.
- ✓ T3 compone 3.1.1 + 3.1.2 + 3.2 + 3.3.1 + 3.3 + 3.4. Build + typecheck + consola limpios. Anti-checklist 14/14.

**27ª ola (2026-06-29): §3.3 Acordes suspendidos (sus2, sus4):**
- ✓ **`SuspendidosSection`:** intro + tabla (sus2/sus4) + `ChordStacks` (comparación: comparten T·5J, cambia la nota del medio 2ª/4ª en lugar de la tercera) + prosa de resolución (sus4→3 baja la 4ª, sus2→3 sube la 2ª) + **constructor** `BUILDER_33` (T → {2, 4} → 5J → sus2/sus4). Es la tercera versión progresiva del constructor (regla del profesor: la sección que presenta los acordes lleva su constructor; ver memoria `feedback-constructor-por-seccion`). Verificado: stacks C·D·G / C·F·G; constructor arma Csus2 (2·5) y Csus4 (4·5).
- ✓ T3 compone 3.1.1 + 3.1.2 + 3.2 + 3.3.1 + 3.3. Build + typecheck + consola limpios. Anti-checklist 14/14.
- ⚠ **Nota de tooling (no es deuda de código):** el preview a veces navega a `chrome-error://` durante scroll programático en páginas T3 largas, y entonces los screenshots salen negros. No es un bug de render — el DOM (grafías, nodos, readout) se verifica aparte y, al re-navegar, el screenshot sale correcto. Patrón de verificación: si un screenshot sale negro, comprobar `location.href` antes de asumir un fallo visual.

**26ª ola (2026-06-29): §3.3.1 Segunda y cuarta + `IntervalRuler` reutilizable:**
- ✓ **Primitiva `Septimas` generalizada a `IntervalRuler`** (segundo consumidor del concepto "regla de semitonos" → extracción, como con `ChordStacks`). Acepta `stops: RulerStop[]` + `ariaLabel` + `maxSemis` por prop; cada parada tiene `showSemis` (muestra distancia) y `reference` (nodo atenuado de contexto). La leyenda se movió de la primitiva (antes Spanish-only) a la sección con i18n es/de — cierra el gap de idioma. El folder `Septimas` se eliminó; §3.1.1 ahora consume `IntervalRuler`.
- ✓ **§3.3.1 `SegundaCuartaSection`** (recap de intervalos, sin constructor: los acordes sus llegan en 3.3, igual que 3.1.1 no tenía constructor). Tabla (2M/4J → sus2/sus4) + `IntervalRuler` con T → **2 (2 s.t.)** → 3m/3M *de referencia atenuada* → **4 (5 s.t.)** → 5J: la 2ª y la 4ª flanquean la tercera que van a reemplazar. Verificado en C: 2=Re, 4=Fa, terceras E♭/E atenuadas.
- ✓ T3 compone 3.1.1 + 3.1.2 + 3.2 + 3.3.1. Build + typecheck + consola limpios. Anti-checklist 14/14.

**25ª ola (2026-06-29): constructor de acordes config-driven (versiones progresivas):**
- ✓ **Regla de producto (profesor):** cada sección que introduce acordes nuevos debe incluir una **versión del constructor de acordes** extendida con esos acordes/notas, además de su otra presentación (tablas, `ChordStacks`). El constructor crece de §1.7 (hasta la quinta) hacia §3.4 (completo).
- ✓ **`AcordesBuilder` generalizado a config-driven.** La topología hardcodeada (2 niveles) se reemplazó por un `BuilderConfig` (`configs.ts`): nodos con `role/number/quality/x/y/level` + acordes como **caminos de roles**; aristas, alcanzabilidad y readout se derivan genéricamente, soportando **N niveles** (tercera → quinta → séptima). `<AcordesBuilder>` sin props usa `BUILDER_17` (idéntico al de §1.7, sin regresión verificada).
- ✓ **Tres configs:** `BUILDER_17` (m/°/M), `BUILDER_312` (agrega 5J → 7M/7m: maj7/m7/dominante 7) en §3.1.2, `BUILDER_32` (rama 3m → 5d → 7d/7m: dim7/m7♭5) en §3.2. Se mantiene la doble codificación posicional (vertical = distancia interválica, horizontal = calidad) en todas las versiones. Pará en la quinta = tríada; seguí a la séptima = acorde de 7ª.
- ✓ **Fix de UX en la generalización:** la alcanzabilidad usa `selected.length >= L-1` (no `===`), para poder **re-elegir un nivel ya pasado** (cambiar de tercera con una quinta ya elegida) — al re-elegir, la selección se trunca. Sin esto, los hermanos de un nivel ya elegido quedaban deshabilitados (regresión vs el §1.7 original).
- ✓ Verificado en browser: §1.7 (CM), §3.1.2 (C7 vía 3M·5·7m, Cmaj7 vía 3M·5·7M), §3.2 (Cdim7 vía 3m·5d·7d); 3m y 7M siguen conmutables tras seleccionar. Build + typecheck + consola limpios. Anti-checklist 14/14.

**24ª ola (2026-06-29): §3.2 Acordes disminuidos + `ChordStacks` reutilizable:**
- ✓ **Primitiva `SeptimaAcordes` generalizada a `ChordStacks`** (acepta `chords: ChordDef[]` por prop; exporta los tipos `ChordDef`/`Tone`). El stack-comparison de 3.1.2 (maj7/m7/7) y 3.2 (m7♭5/dim7) es la misma UI con datos distintos → una sola primitiva. El folder `SeptimaAcordes` se eliminó; las defs de acorde viven en cada sección consumidora. Hecho antes de commitear 3.1.2, sin churn de historia.
- ✓ **§3.2 `DisminuidosSection`:** recap de la 5d + tabla (m7♭5/dim7) + `ChordStacks` (comparación: comparten T·3m·5d, solo difiere la 7ª, resaltada) + subsección de **simetría** (terceras menores apiladas, dim7 simétrico) con las **3 familias absolutas de dim7** (`C°=E♭°=G♭°=A°`, …) como lista de cifrados fijos (no dependen de la tónica) + función de paso cromático. Verificado: m7♭5=B♭ G♭ E♭ C, dim7=B♭♭ G♭ E♭ C.
- ✓ T3 compone 3.1.1 + 3.1.2 + 3.2. Build + typecheck limpios; consola limpia tras reinicio del dev server (los errores de HMR eran artefactos del archivo `SeptimaAcordes` borrado, no del código vigente). Anti-checklist 14/14.

**23ª ola (2026-06-29): §3.1.2 Acordes con séptimas:**
- ✓ **Sección `SeptimaAcordesSection`** (label/h2/intro/tabla maj7·m7·7/diferencia/caption) + primitiva net-new `SeptimaAcordes`: comparación lado a lado de los tres acordes con séptima como **stacks** verticales (7ª arriba → tónica abajo, como en partitura). Cada tono es un nodo SVG (grafía + hue en hover/playing, Quarantine + Signature); la 3ª y la 7ª (los tonos que cambian) llevan la etiqueta de rol en `--text-body` y el resto en `--muted`. Reusa `intervalMemberFromTonic` y `PlaybackButton` (bloque/arpegio por columna). Verificado: maj7=B G E C, m7=B♭ G E♭ C, 7=B♭ G E C; hover colorea (`var(--note-b)` en la 7ª de Cmaj7).
- ✓ **Split primitiva/sección correcto:** el caption explicativo y los nombres de acorde (Mayor 7 / Dur 7…) viven en la sección (i18n es/de); la primitiva sólo renderiza símbolos universales (cifrado `Cmaj7`, notas, glifos de playback), sin texto language-specific. Evita el gap de i18n que tienen las leyendas Spanish-only de primitivas previas (`Septimas`, `AcordesBuilder`).
- ✓ T3 ahora compone 3.1.1 + 3.1.2; `tocConfig` y `T3Module` actualizados. Build + typecheck limpios, sin errores de consola. Anti-checklist 14/14.

**22ª ola (2026-06-29): dinámicas musicales en lugar del slider de volumen:**
- ✓ **`DynamicsSelector` reemplaza el slider de volumen** (idea del profesor). Selector de 6 dinámicas `pp · p · mp · mf · f · ff`, cada una mapeada a una ganancia del master gain (0.12 / 0.28 / 0.45 / 0.62 / 0.80 / 1.0). El default histórico (`volume: 0.8`) cae en **f**, así que el arranque no cambia; la dinámica activa se deriva del preset más cercano al volumen actual (tolera valores heredados). Mantiene `setMasterVolume`; `aria-pressed` + `aria-label` con el término italiano completo (pianissimo…fortissimo); `role="group"`.
- ✓ **Dinámicas en Playfair Display italic** (excepción sancionada, ver §3 Named Rules): los símbolos de dinámica son notación musical, no UI copy. Estado activo con tint `color-mix(var(--red) 14%)` + `var(--paper)` (patrón Active canónico, sin side-stripe). Componente propio espejando `OctaveSelector`; CSS huérfano del slider (`.volumeWrap`/`.volumeLabel`/`.volumeSlider`) y `handleVolume`/import `setMasterVolume` eliminados de `Sidebar`.
- ✓ **Glifos de Playback refinados** (pedido del profesor, mismo lote): se removió el corchete del bloque y el zigzag+flecha del arpegio. Ahora **bloque** = noteheads alineadas en columna; **arpegio** = noteheads desplazadas en diagonal. El contraste lo carga alineación vs desplazamiento (la diferencia notacional real). `.glyphStroke` eliminado (huérfano). Verificado en los tres consumidores.
- ✓ Build + typecheck limpios, sin errores de consola. Verificado en browser (desktop, claro+oscuro): las 6 dinámicas en Playfair italic, `mf`/`f` activa con tint, click cambia el preset. Anti-checklist 14/14.

**21ª ola (2026-06-29): módulo T3 (scaffold) + §3.1.1 Las nuevas séptimas:**
- ✓ **Source of truth de T3** (`docs/source_of_truth_T3.md`) reescrito desde el material subido por el profesor (que reunía T3+T4): por decisión suya, todo se trata como **T3** con 12 subsecciones (3.1.1 … 3.10). Lo de "T4" (dominantes secundarias, ii–V–I, menor) se integra como 3.6–3.10. Secciones 3.9/3.10 (menor con séptimas) marcadas 🟡 pendientes de su revisión; el resto 🟢 verificado contra `tonal`. El archivo crudo `material_T3_T4.md` se eliminó (contenido transformado, sin drift).
- ✓ **Decisión de librerías: solo `tonal`.** Evaluadas sharp11 y teoria (pedido del profesor): se descartan — solapan con `tonal`, sin mantenimiento reciente ni tipos TS, fragmentarían la capa unificada en la 19ª ola. `tonal` ya cubre maj7/m7/7/m7♭5/dim7/sus2/sus4 (`Chord`), armonía diatónica con 7mas (`Key.majorKey/minorKey`) y dominantes secundarias / ii–V–I (`RomanNumeral`/`Progression`) — verificado en consola. La palanca para T3 es **usar más a fondo** esos módulos de alto nivel, no agregar dependencias.
- ✓ **Scaffold del módulo T3:** ruta `/t3/*` en `App.tsx`, entrada `nav.t3` en `Sidebar` (es/de), `tocConfig` `/t3`, `T3Module` + `.module.css` (mismo patrón que T1/T2). Sin header de módulo (AppShell + Header global poseen la identidad de página — anti-checklist item 5).
- ✓ **§3.1.1 Las nuevas séptimas:** sección `SeptimasSection` (label/h2/intro/tabla 7M·7m·7d/párrafo de la 7d) + primitiva net-new `Septimas`: **regla de semitonos** (eje 0→12 con ticks) donde las tres séptimas se agrupan junto a la octava, codificando su distancia real (7d=9, 7m=10, 7M=11) y dejando ver que la 7d está un semitono bajo la 7m. Reusa `intervalMemberFromTonic` (mismo helper del árbol-constructor) — `intervalSemitones` admite `7d`=9, grafía `B𝄫` para dim7 de C (enarmonía de 6M, mostrada correctamente). Hover/focus colorea con el hue cromático (A para la 7d de C; Note-Color Quarantine + excepción Signature); click reproduce el intervalo tónica→séptima ascendente. A11y completa (role/tabIndex/aria-label con semitonos/onKeyDown/onFocus), patrón hit-area. Tabla "Enarmonía" sin placeholder de guion (Middle-Dot Rule): celda vacía cuando no aplica, el dato 6M vive también en la prosa.
- ✓ Build + typecheck limpios, sin errores de consola. Verificado en browser (desktop + 375px, claro+oscuro): nav/TOC de T3, ruler con grafías correctas, hover colorea. Anti-checklist 14/14.

**20ª ola (2026-06-29): §1.7 árbol-constructor de acordes (inicio de T3, reunión del plan):**
- ✓ **`AcordesBuilder` reescrito de fila-de-tarjetas a árbol-DAG interactivo.** El toggle Mayor/Menor/Dis. + 3 tarjetas se reemplazó por un árbol SVG izquierda→derecha con **doble codificación posicional** (corrección del profesor): el eje **vertical** = distancia interválica (menos semitonos → más cerca de la línea de la tónica) y el eje **horizontal** = calidad (menor/disminuida a la izquierda, mayor/justa a la derecha). T (raíz) ramifica a 3m (arriba-izquierda) y 3M (abajo-derecha); 3m llega a 5J y 5d, 3M sólo a 5J; 5d queda izquierda-arriba, 5 derecha-abajo. Las **aristas codifican validez de acorde** — los caminos posibles dan exactamente m (T·3m·5), dim (T·3m·5d) y M (T·3M·5). **sus2/sus4 (los nodos 2 y 4) NO aparecen todavía**: se introducen en T3 (§3.3). Recorte hasta la quinta (el árbol completo con séptimas va en 3.4). Interacción "construir por camino": clic en tercera → quintas alcanzables se habilitan, clic en quinta → acorde nombrado + audio.
- ✓ **Glifos de notación reemplazan los botones de texto "Bloque"/"Arpegiado".** Bloque = noteheads apiladas con corchete; Arpegio = noteheads con línea ondulada vertical y flecha ascendente (notación estándar).
- ✓ **`PlaybackButton` compartido (corrección de consistencia del profesor):** los controles Bloque/Arpegio de TODA la app pasaron a un solo componente `shared/PlaybackButton` icono-only, con la etiqueta revelada en hover/focus (tooltip absoluto, sin layout shift) y `aria-label` siempre presente. Consolidó tres consumidores con etiquetas y estilos divergentes (`AcordesBuilder` como acción; `TriadsSection` §1.6 y `ProgresionesArmonicas` §2.7 como toggle `aria-pressed`). Glifos extraídos al componente compartido; CSS huérfano (`.playToggle*`, `.modeBtn*`, `.audioBtn`, `.glyph*`) eliminado de los tres módulos. Ver Named Rule en §5 "Playback Buttons". `ChromaticCircleSection` ya no tiene toggle (removido en 14ª ola), no aplica.
- ✓ **Doble bug/feedback de legibilidad de calidad resuelto:** (a) Bebas Neue es all-caps, así que `3m`/`3M` y `5d`/`5` renderizaban idénticos → las etiquetas de **rol** pasaron a Plex Mono (preserva caso, precedente de `GradosArmonicos`); Bebas se conserva sólo para el **glifo de la nota** activa. (b) Aun en Plex Mono, `m` vs `M` en monoespaciado es demasiado sutil de un vistazo (proyección en clase) → se añadió un **carril tipográfico de calidad**: mayor/justa = bold recto (`.roleMajor`), menor/disminuida = regular itálica (`.roleMinor`). Sumado al eje horizontal izquierda/derecha, la calidad queda redundante e inequívoca. Nodo en reposo: rol (con carril) + nombre ES; nodo activo: nota en Bebas blanca sobre círculo saturado (excepción Signature).
- ✓ **Nuevo helper matemático centralizado** `intervalMemberFromTonic(tonic, number, quality)` en `noteCalculations.ts` (grafía + cromática + octava ascendente). Los nodos 2/4/5d no son tríadas y no salían de `chordSpelled`; el helper reutiliza `spelledIntervalFromTonic` + `intervalSemitones`. Audio respeta el piso-tónica (octava ascendente desde la tónica). `AcordesBuilder` sigue en el inventario tónica-relativo (§7 Doctrina activa, sin cambio).
- ✓ Estados verificados en browser (desktop + 375px, tema claro y oscuro): idle, tercera seleccionada con quintas no-alcanzables atenuadas (opacity 0.3) y fuera del tab order (`role=img`, `tabindex=-1`), camino completo, sin errores de consola. A11y: nodos `role=button` + `tabIndex` + `aria-label` + `aria-pressed` + `onKeyDown(Enter|Space)` + `onFocus` (audio). Patrón hit-area `.node > * { pointer-events: none } / .hit { pointer-events: all }` para un solo receptor de eventos por nodo. Build + typecheck limpios. Anti-checklist 14/14.

**19ª ola (2026-06-25): regla 90ch universal + auditoría NoteToken-en-tablas:**
- ✓ **The 90ch Rule reemplaza el cap de 70ch** (heredado de la convención editorial 65-75ch). Medido a 1920px real (laptop del usuario, sidebar visible): el cap viejo dejaba 368px de gutter vacío y partía frases de 72-80 caracteres en dos líneas con sobra de espacio horizontal. Se evaluó centrar la columna (`margin-inline: auto`) en vez de ensancharla — implementado, luego revertido por decisión del usuario en favor de aprovechar el ancho liberado. Regla aplicada como base global en `p, li` (`global.css`), sin scoping a breakpoint (un intento inicial de scopear a `≤900px` fue descartado tras confirmar `window.innerWidth=1920` en la laptop real del usuario — el gutter aparece en cualquier ancho donde el container, no la pantalla, es el límite real).
- ✓ **Migración de la capa matemática a Tonal.js** (`utils/noteCalculations.ts`, `hooks/useAudioEngine.ts`, `data/notes.ts`): pitch class, intervalos, enarmonías y frecuencia (`Note.freq`, 12-TET estándar) ahora delegan a la librería; la lógica pedagógica específica del método (letter-spelling, piso de octava, naming alemán) se conserva intacta. Verificado por paridad exhaustiva (script de baseline antes/después, 17 tónicas × tipos de acorde × intervalos) — output byte-idéntico. `NOTE_FREQS` (tabla hand-rolled de 12×9 frecuencias) eliminada, sin consumidores restantes.
- ✓ **Auditoría completa de NoteToken-en-tablas** (nueva regla documentada arriba, §5): 4/7 tablas de T1/T2 ya conformes; 2 gaps reales corregidos (`TablaMaestraSection` columnas armadura/tonalidad, `IntervalosSection` fila Resultado con celda de tritono de doble grafía). Bug encontrado y corregido en el mismo pase: el fallback a texto plano para grafías no-canónicas (`E#`, `B#`) renderizaba el `#` ASCII en vez del glifo `♯` unicode — inconsistente con el resto de la fila tokenizada. `toFlat()` renombrado a `toGlyph()`, ahora convierte ambos acentos.
- ✓ Build + typecheck limpios. Verificado en browser: tabla maestra renderiza NoteToken con audio/color para las 12 grafías canónicas y fallback de texto con glifo correcto para `Cb`/`Fb`/`E♯`/`B♯` en las tonalidades de 6-7 alteraciones.

**18ª ola — Reunión 9/6 (2026-06-11): piso-tónica de raíz + correcciones puntuales:**
- ✓ **Piso-tónica resuelto de raíz, no por parche.** El bug reportado ("con tónica A, C suena más grave que A") venía de `playNote(note, 4)` con octava fija en notas sueltas ancladas a tonalidad. Nuevo helper puro `octaveAboveTonic(tonic, note, base)` en `noteCalculations.ts`; `NoteToken` (el call-site masivo: toda la prosa y tablas de T1/T2) ancla su octava default a la tónica global. El prop `octave` explícito sigue ganando (filas apiladas de §2.6).
- ✓ **Bug de wrap en `TensionResolucion` (§1.5):** `octaveAdj` solo subía en la 8va de cierre; en toda tonalidad que cruza C los grados sonaban bajo la tónica (en Sol mayor, C4 < G4). Fix: `floor((tonicIdx + pos) / 12)`, mismo patrón que EscalaMayor. Misma clase de bug que cazó la 17ª ola — probado en A, C, F, G y D♭ con script `.mjs` de lógica pura antes de subir.
- ✓ **Inventario completo de consumidores de audio** clasificado (ver Doctrina activa): el resto ya cumplía el principio (ascendencias por `spelledSequenceAscending`/`chordSpelled`/`toAscending`) o es contexto de identidad absoluta documentado.
- ✓ **§1.3:** la primera tabla muestra solo letras naturales (a esa altura del método no se explicaron las alteraciones); eliminado el párrafo "Resultado para X" redundante — la tabla comparativa intervalo→nota es el único resultado. `buildResultado` y `.resultado` removidos (huérfanos del cambio).
- ✓ **§1.4:** fila de números de grado (1–8) bajo la tira de `EscalaMayor`, coloreados por estabilidad con los tokens diatónicos (uso sancionado: grados dentro de la tonalidad activa). Se conserva la fila de calidades (decisión 24/5); los números van debajo. Confirmado: el audio dispara solo al ENTRAR al círculo (fix previo, verificado).
- ✓ **Ejemplos en línea propia:** §1.8 bullets (`.ejemplo` → bloque) y §2.2 cards (split de render en "Ejemplo:/Beispiel:"; el texto literal del método queda intacto en `literalContent`).
- ✓ **`IntervalMiniFretboard` eliminado** (muerto, sin montar desde la migración) junto con `INTERVAL_FB_POINTS` y las clases CSS del mini-mástil — cierra de paso las deudas `--fret-num` y el comentario pendiente de `Intervals.module.css .dot`.
- ✓ Typecheck + lint (src) limpios. Verificado en browser (desktop + 375px) rotando tónicas A, C, F, G, D♭; sin errores de consola. Anti-checklist 14/14.

**16ª ola — Reunión Josué (2026-07-06): §1.6 ejemplo de tríada como proceso animado:**
- ✓ **Cierra la deuda "§1.6 caja de ejemplos como proceso ordenado"** abierta en la 15ª ola. Nueva primitiva `TriadaProceso` (`primitives/TriadaProceso/`) reemplaza el párrafo estático `Ejemplo: C → omito D → E → omito F → G…`. Presenta la construcción de la tríada como un **proceso paso-a-paso** (6 pasos: tomar tónica → saltar 2ª → tomar 3ra → saltar 4ta → tomar 5ta → resultado), con la misma "onda" que §2.3/§2.4: tira lineal SVG de 5 nodos (lenguaje visual de §1.4/§1.5), panel de pasos con estado activo/pasado, controles `◀ ▶/⏸ ▶▶` + velocidad. **Reutiliza `useProcessAnimation`** (hook de t2, lógica pura, ya respeta `prefers-reduced-motion`).
- ✓ **Discriminación tomada/saltada sin hue falso:** los nodos *son* notas → usan `--note-*` (uso canónico). "Tomada" = hue + relleno + anillo (`var(--paper)` en la raíz); "saltada" = mismo hue al 22% + tachado + `×`; "pendiente" = `--surface-2` + `--rule`. El rol vive en opacity/tamaño/anillo/tachado, no en un color inventado (mismo precedente que EscalaMayor §6ª ola).
- ✓ **Audio respeta el principio de la 15ª ola:** pasos 1/3/5 suenan la nota tomada en orden ascendente (tónica más grave, vía `spelledSequenceAscending`); el paso 6 suena la tríada en bloque (traslape deliberado, es acorde). El audio siempre tiene paralelo visual (estado del nodo + paso activo).
- ✓ Dinámico según tónica global y locale (es/de, B→H en alemán). `TriadasSection` perdió `buildEjemplo`/`exampleRoot` (huérfanos del cambio) y la clase CSS `.ejemplo`.
- ✓ Build + typecheck + lint (src) limpios. Verificado en browser a 375/768/1280: estados idle/tomada/saltada/resultado, sin errores de consola. Anti-checklist 14/14 (inline `style` solo en valores computados en render: opacity/fill del reveal por paso).

**15ª ola — Reunión Josué (2026-07-06): principio de sonido + octava global:**
- ✓ **Principio "tónica = nota más grave, ascendente":** las secuencias melódicas suenan con la tónica abajo y cada nota más aguda. `utils/noteCalculations.ts` gana `pitchClass()` + `spelledSequenceAscending()` (resuelve grafías libres Cb/Fb/E♯/B♯ a clase de altura y reparte octavas ascendentes). Corregidos: "Escuchar escala" de §2.3/§2.4 (antes todo en oct. 4 → C/D/E sonaban por debajo de la tónica) y la cadena de la Tríada Maestra (§1.6, antes plana en oct. 4 → ahora asciende ~2 octavas).
- ✓ **Selector de octava global** (`OctaveSelector` junto a la TÓNICA en el Sidebar). Registro base de TODO el sonido; default **C3**, rango **C1–C5** (4 octavas). El desplazamiento se aplica una sola vez en el dispatcher (`useAudioEngine.playNote`), no en cada consumidor — `store.octave − REFERENCE_OCTAVE(4)`. Nuevo estado `octave` en `useUIStore` (no persistido, igual que `tonic`).
- ✓ **Anti-traslape en secuencias** (decisión Josué: "que se corten antes o un traslape mínimo, apenas se toquen"). Nuevo helper `playSequence(notes, gapMs, tailMs)` en el dispatcher: cada nota dura ~gap+cola corta → no se acumulan voces. Aplicado a escala (§2.3/§2.4), resolución de tensión (§1.5, además separada/alargada), regla de la 5ª (§1.8: tanto la lista `ReglaQuinta` como la rueda `CirculoDeQuintas`). Scrub de notas sueltas (§1.4 escala, §1.6 cadena) corta la anterior vía `stopAllNotes()`. **Acordes/arpegios conservan el traslape a propósito** (Tríadas §1.6, Constructor §1.7, Grados §2.6) — ahí se busca oír el acorde.
- ✓ **§1.4 escala suena al entrar y al salir** del círculo de cada nota (antes solo al entrar).
- ✓ **§1.3 tabla comparativa de intervalos**: bajo "Resultado para X" se añadió una tabla (nombre de intervalo → nota resultante), espejo de la tabla de semitonos de arriba.
- ✓ **§1.6 marco de foco** removido al clickear el círculo de tríadas con mouse en PC; se conserva el anillo `:focus-visible` para teclado (a11y).
- ✓ **§1.8 consejo**: añadido "y al revés B E A D G C F" (orden de bemoles). **§2.6 grado iii**: carácter "Medio" → "Reposo - Medio" en la tabla comparativa (es/de).
- ✓ Build + typecheck + lint (src) limpios. Verificado en browser: octava clampa C1–C5 / default C3, tabla §1.3 renderiza, §1.8 y §2.6 con el texto nuevo, rutas de audio sin errores de consola.

**14ª ola — Reunión Josué (2026-05-24):**
- ✓ **Validador de enarmonía generalizado** en `utils/noteCalculations.ts`: `spelledIntervalFromTonic(tonic, number, quality)` + `spelledChromaticCircle(tonic)`. Regla "el número del intervalo determina la letra; la calidad la alteración". El IntervalsSection primitive ahora computa las 3ras menores correctas para cualquier tónica (antes producía A♯ donde debía ser B♭).
- ✓ **Selectores locales removidos en T1**: `IntervalosSection`, `IntervalsSection` (primitive), `TriadasSection`, `MasterTriad` consumen `useUIStore.tonic` (`AcordesSection` y `ReglaQuintaSection` ya lo hacían). Excepción documentada: T2 `ProcesoBemolesSection`/`ProcesoSostenidosSection` mantienen selector local porque escogen *tonalidad pedagógica* dentro de un set acotado (Eb, Ab, Bb… para bemoles), no la tónica global.
- ✓ **Numerales: arábigos en intervalos, romanos en acordes**. Tablas de §1.3 y §1.4 con `T 2 3 4 5 6 7` y `T 2M 3M 4J 5J 6M 7M 8J` respectivamente; visualizador de escala mayor con calidades; grados de acordes mantienen `I ii iii IV V vi vii°`.
- ✓ **Colores cromáticos solo en hover/focus**: `NoteToken.module.css` y `ChromaticNode.tsx` monocromos en reposo; el color de nota aparece solo al hover/focus. Implementación: gating CSS `:hover, :focus-visible` + ramas condicionales `hovered ? color : neutral` en SVG.
- ✓ **Acordes ejemplo dinámico (§1.7)**: `ACORDES_EJEMPLO_PASOS` hardcodeado en A reemplazado por `buildPasoLetras`/`buildPasoSemitonos` que construyen prose dinámicamente con la tónica activa. El caveat "Por la regla del paso 1, la letra es X, entonces es Y (no Z)" solo aparece cuando hay ambigüedad enarmónica real.
- ✓ **Tensión/Resolución (§1.5)**:
  - Reglas dinámicas según tónica activa (antes hardcoded "En C mayor").
  - Strip usa `majorScaleSpelled` para display (4ta de F = B♭, no A♯).
  - Flechas del 4to grado pasaron de rectas a arcos cortos — antes parecían una recta III↔V atravesando IV; ahora visiblemente emergen del IV.
  - Legend depurado: removidas las entradas duplicadas "4ª · 7ª (tensos)" / "2ª · 6ª (intermedios)" (la forma del arco ya es informativa).
- ✓ **Escala mayor visualizador (§1.4)**: removido patrón "TTSTTTS", removidas flechas de dirección, calidades de intervalo reemplazan romanos. Las notas fuera de escala (cromáticas tenues) ya no responden a hover/focus ni reproducen audio.
- ✓ **Notas naturales (§1.1)**: tabla 7 notas → círculo SVG de 7 notas. Refuerza la circularidad de la escala.
- ✓ **Círculo cromático (§1.2)**: removido toggle Arpegio/Bloque; los nodos reproducen solo la nota individual al hover/click (la construcción de acorde vive en §1.7).
- ✓ **Salto de línea en pasos de Intervalos (§1.3)**: pasos 1 y 2 del procedimiento separan prefijo de texto y lista de notas en líneas distintas (`StepWithBreak` + render con `<br/>`).
- ✓ **Sidebar label**: TONALIDAD → TÓNICA (commit anterior `e1f1048`, mantenido).
- ✓ Build limpio (typecheck verde). Verificado en browser rotando tónicas F, A, B, C#. Sin deuda nueva introducida.

**13ª ola — Limpieza de superficie (2026-05-22):**
- ✓ **ModoClaseSection eliminada** (`ModoClaseSection.tsx` + `.module.css` + import en `T2Module.tsx` + claves `s46` en `es.json`/`de.json`). Sin rastro en codebase.
- ✓ **Footer eliminado** (`Footer.tsx` + `.module.css` + import/JSX en `AppShell.tsx`). Sin rastro en codebase.
- ✓ Sin deuda nueva introducida.

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
