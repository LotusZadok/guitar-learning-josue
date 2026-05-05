# Lessons Learned — Apuntes de Guitarra

> Doctrina derivada de las auditorías y pasadas de resolución del proyecto. Captura los **patrones de error** que produjeron las violaciones encontradas, para no repetirlos. DESIGN.md codifica las reglas; este documento explica los modos en que las reglas se pierden y cómo cazarlos antes de que entren al codebase.

## Cómo nació esta deuda

El frontend fue migrado por partes desde un repo personal (`apuntes-guitarra`) que nunca pasó por una auditoría de diseño. PRODUCT.md y DESIGN.md se escribieron **después** del código, lo que significa que muchos patrones del repo original quedaron como hechos consumados — algunos compatibles con la doctrina ("Cuaderno de Estudio del Profesor"), otros directamente reflejos del dataset (SaaS-cream, Notion-callout, rainbow tags). Esta tensión es la fuente de las violaciones.

## Pasadas ejecutadas

### 1ª ola (2026-05-04) — Rule 2 / Craft / Polish
- **Note-Color Quarantine fix:** `ROLE_COLORS` eliminado; `STATE_COLORS.userPicked` ya no usa note-G; `IntervalsSection.color` field eliminado; `MasterTriad` border `#fff` → `var(--paper)`.
- **Craft T2 + T1:** `<header>` y `<footer>` de T2Module **eliminados completamente** (no rediseñados); T1Module reescrito como noticia editorial in-progress.
- **Polish em-dashes:** 9 SectionLabel sites `01 — X` → `01 · X`.

### 2ª ola (2026-05-04) — Motion / A11y / Visual / Tokens
- **Motion:** `prefers-reduced-motion` implementado en JS (`useProcessAnimation`) y CSS (`global.css` global override); Sidebar drawer migrado de `transition: left` a `transform: translateX`.
- **A11y:** keyboard reach (tabIndex/role/aria-label/onKeyDown/onFocus) en 5 componentes interactivos SVG/DOM; ProcessControls aria-labels; LockScreen error con `role="alert"`.
- **Visual:** 3 side-stripes nuevos eliminados; `#b8b0a5` migrado a token `--text-body`; mástil migrado a vars existentes; LockScreen `#e25555` → `var(--red)` + `:hover`; CSS muerto removido.
- **Tokens + i18n:** nuevo token `--text-body`, `max-width: 70ch` global en `p, li`, em dashes en JSON locales → `·`.

Build limpio en cada paso. Ver `Pending Debts` en DESIGN.md §7 para lo que queda.

## Patrones de error documentados

### Migración drift

Estos son los modos concretos en que el código original se desvió de la doctrina, observados durante las auditorías. Si encontrás cualquiera de estos en código nuevo, paralo antes de hacer commit.

- **Arrays decorativos de "colores bonitos" indexados por algo no-nota.** `ROLE_COLORS = ['#c0392b', '#27ae60', '#d4a017', '#2980b9', '#8e44ad', '#1abc9c', '#e67e22']` en `data/triads.ts` y `STATE_COLORS = { tonica, highlighted, neutral, natural, userPicked: '#2980b9' }` en `ChromaticCircleAnimated` son la misma especie. Nacen del impulso "necesito N variantes visuales, acá hay N colores saturados" sin preguntarse si la variable que se discrimina (rol intervalico, estado de selección, categoría) **es** una nota. Regla de detección: si escribís un array de colores y el index name no es un nombre de nota o de acorde, es olor.
- **`var(--stringN)` se siente como design system, pero es una nota disfrazada.** Cada cuerda al aire ES una nota (E A D G B E). Cada forma CAGED ES una raíz. Importar `var(--string6)` para colorear un intervalo en `IntervalsSection` viola la cuarentena tan literalmente como escribir `#8e44ad`. Auditar: cualquier consumidor de `--stringN` o `--caged-*` que **no** sea una visualización de cuerda/CAGED es violación.
- **`#fff` puro casi nunca es la excepción del Signature Component.** La excepción es estrecha: glifo de letra blanco dentro de un círculo de nota saturado. Bordes decorativos, anillos de "selección", indicadores de "raíz", separadores y stroke de hover NO califican — usan `var(--paper)`. Test: ¿el `#fff` está en un `<text>` SVG inmediatamente sobre un `fill={NOTE_COLORS[X]}`? Sí → exento. No → reemplazar. **Cuando el código sí cae en la excepción legítima, dejar comentario inline** (`/* Signature: letra blanca sobre nota saturada, no tokenizar */`) para que un agente futuro no "corrija" el patrón.
- **Hex literals que se repiten ≥3 veces son tokens faltantes.** Cinco instancias de `#b8b0a5` en `*.module.css` con la misma semántica (texto de cuerpo) y mismo `font-size`/`line-height` son una señal: necesitás un token. Eso fue exactamente `--text-body`. Antes de añadir el sexto literal repetido, pará y creá la var. Patrón: `:root { color: X }` + `[data-theme="light"] { color: Y }` paralelos en cualquier archivo es una pista directa.
- **Hex hardcoded que funciona en oscuro silenciosamente rompe en claro.** El commit `fe723cd` cazó la mayoría, pero la 2ª ola limpió el residuo: `#b8b0a5` (6 archivos), `STATE_COLORS.neutral.fill = '#1a1a1a'`, mástil de intervalos completo, `LockScreen` error color `#e25555`. Test continuo: `grep -E "#[0-9a-fA-F]{3,8}"` en cualquier `.module.css` o `.tsx` debe revelar solo (a) tokens del front-matter de DESIGN.md, (b) hues de nota en `data/notes.ts`, o (c) el frame buffer Signature Component.
- **Playfair Display para "tono editorial".** El reflejo entrenado dice "italic serif = premium content vibe". DESIGN.md prohíbe Playfair en cualquier UI copy que no sea una cita literal de Josué. El subtítulo eliminado de T2 (*"Un recorrido por el método de Josué Barquero"*) y la pregunta de ProcessPanel (*"¿Cómo saber la armadura..."*) son ambos casos donde Playfair se coló como "ambiente". Si una fuente tiene una Named Rule fijando su único caso de uso, **cualquier otro uso es una falla del diseño**, no una interpretación creativa.
- **Headers de módulo replicando el header global.** El `<h1>Tonalidades y Armaduras` de `T2Module` heredaba el modelo mental "module landing page" de templates React genéricos. Estructura: centered title + tagline + 60-80px hero padding. Esa estructura es legible para el dataset como "section opening" y empuja todas las decisiones hacia el centered-hero default. Pregunta a hacerse antes de añadir cualquier shell de módulo: **¿esta superficie necesita un header, o estoy heredando uno porque todo producto tiene uno?** En esta app, la respuesta por defecto es no — AppShell + Header global poseen la identidad de página.
- **Em dashes (`—`) como separador "tasteful".** El reflejo del LLM es usar em dash en numbered list/section labels (`"01 — Title"` lee como editorial pattern del dataset). El estándar del proyecto es `·` (U+00B7), que el modelo "autocorrige" a em dash si no se le pinta explícitamente. Codificado en DESIGN.md §3 como Middle-Dot Separator Rule. **Auditorías de em-dash deben extender el scope a `.json`** (locales i18n) y `.md` además de `.tsx`/`.module.css` — es ahí donde se esconden.
- **`React.CSSProperties` inline en componentes nuevos.** `Footer.tsx`, `MasterTriad.tsx h2 style`, `ChromaticCircleAnimated STATE_COLORS`. Los estilos inline no son violación per se, pero (a) inhiben theme-flipping cuando hay hex literales, (b) escapan el linting de CSS modules, (c) hacen que las violaciones sean invisibles a buscadores tipo `grep "border-left"`. Default a CSS module; reservá inline para valores genuinamente dinámicos (computados en render).
- **Side-stripe borders (border-left: 3px) entrando como código nuevo, no solo legacy.** `RuleNote` está documentado como deuda legacy. Pero `ProcessPanel.stepActive`, `TablaMaestra.rowActive`, y `FExceptionBanner` los reintrodujeron en código del POC T2. Fueron resueltos en la 2ª ola (bg tint + font-weight + chevron, o full border 1px). Cualquier `border-left` o `border-right` >1px coloreado en componente NUEVO es violación inmediata. **Cuando elimines un side-stripe, revisá el `border-radius` y el `padding` adyacente** — ambos suelen ser artefactos del stripe (ej: `border-radius: 0 4px 4px 0` solo existe porque hay un side-stripe izquierdo). Layout shift hidden inside the stripe.
- **`rgba(0, 0, 0, X)` y `rgba(255, 255, 255, X)` sobreviven múltiples olas de auditoría.** El sidebar overlay `rgba(0,0,0,0.6)` y el watermark del Header `rgba(255,255,255,0.03)` pasaron las olas 1 y 2 sin ser tocados — solo cayeron en la 3ª. Sospechosos: rgba con valores 0,0,0 o 255,255,255 son menos visibles a grep que hex puros, y muchas auditorías de tema solo buscan `#000`/`#fff` literales. **Lint regex propuesto para CI:** `/rgba\(\s*(0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)/` en `*.module.css`. Las excepciones sancionadas (sombra del fretboard dot, hover glow de Triads) opt-in vía comentario marker.
- **`React.CSSProperties` inline es el último refugio del estilo no-tokenizado.** El `Footer.tsx` sobrevivió 2 olas porque no aparece en greps de CSS modules ni de hex literals. Patrón: cualquier `style={{...}}` o `const x: React.CSSProperties = {...}` en componente nuevo bypasa simultáneamente la convención de CSS modules Y el sistema de tokens. **Audit grep:** `style={{|React\.CSSProperties` en `src/components/**/*.tsx`. Default a CSS module siempre; reservá inline solo para valores computados en render (no decisiones estilísticas).
- **CSS-var indirection a través de un mapa TypeScript es el patrón limpio para paletas theme-aware.** `NOTE_COLORS` pasó de hex literals a `'var(--note-c)'` strings en `data/notes.ts` sin tocar un solo consumidor — los 4 componentes que la consumen (`ChromaticNode`, `TriadNode`, `MasterTriad`, `TriadsSection`) usan los valores via SVG `fill`/`stroke` o inline `style.color/background/borderColor`, todos los cuales aceptan `var()` strings nativamente. Cuando un mapa de tokens previamente fijo necesita variantes por tema, esta es la migración mínima — antes de considerar refactorings mayores como theme context o derived state, intentá el truco del `var()` string.
- **Yellow-on-cream es la trampa universal de paleta.** El amarillo `#f1c40f` (luminance ≈ 0.59) es físicamente imposible de pasar AA sobre cream warm `#f5f0e8` sin colapsar a ochre/mostaza. Cualquier sistema con tema cream + slot semántico "yellow" debe aceptar un **cambio de familia de hue**, no solo un darkening. Documentar el trade-off explícitamente en lugar de "hacer como que sigue siendo amarillo".
- **Centralized side-effect kill switches escalan mejor que opt-outs por componente.** Tres `if (audioMuted) return` lines en `useAudioEngine` neutralizaron audio en 9+ archivos consumidores. La alternativa (pasar un flag a cada componente) habría sido un diff mayor y se reaplicaría para cada nuevo componente que dispare audio. Patrón: cuando un side-effect se dispara desde N lugares, el kill switch va en el dispatcher, no en los call-sites.
- **`store.getState()` dentro de callbacks memoizados es más seguro que suscribirse via hook.** Evita stale-closure bugs con `useCallback([], ...)` deps y evita re-crear callbacks en cada cambio de estado (que re-dispararía `useEffect` cleanups en consumidores). Suscribirse en el árbol React solo cuando necesitás re-renders; leer imperativamente cuando solo necesitás el valor actual al momento de la llamada.
- **Excepciones doctrinales pertenecen al documento de doctrina, no como overrides silenciosos.** Cuando una regla rígida ("note hues fijas a través de temas") choca con una restricción dura (WCAG AA), la respuesta correcta es documentar la excepción con su trade-off (la "Light-theme overrides" subsection en DESIGN.md §2), no romper la doctrina y mover los hues a otro archivo. **Test:** un agente futuro leyendo DESIGN.md debería entender por qué la doctrina parece contradictoria. Si solo ve los CSS vars sin contexto, asumirá que la doctrina está rota.
- **Cuando una doctrina marca "excepción legacy", el fix es mecánico: alinear con el patrón sibling canónico.** RuleNote era el último callout con side-stripe; FExceptionBanner ya había migrado al patrón "full border 1px + tinted bg 6%" en la 2ª ola. La 4ª ola simplemente replicó esa receta exacta — incluyendo el magic number `0.06` del tint. **Reusar valores entre callouts paralelos es más valioso que optimización per-component**.

### Patrones de a11y observados en la 2ª ola

- **Audio-on-hover sin focus equivalente es la trampa de teclado canónica.** `ChromaticNode`, `TriadNode`, `MasterTriad.chainNote` reproducían audio en `onMouseEnter` solamente. Usuarios de teclado tab-eando recibían cero feedback auditivo. Patrón: cada `onMouseEnter` que dispara un side-effect sensorial (audio, video preview, expanded info) **necesita un `onFocus` paralelo**. Checklist item para cualquier nueva primitive interactiva.
- **SVG `<g>` interactivo es invisible para AT sin role explícito.** Los grupos SVG no tienen role implícito. El patrón `<g onClick={...}>` es un "screen-reader dead zone". Siempre añadir `role="button"` + `tabIndex={0}` + `aria-label` + `onKeyDown` juntos — son un set de cuatro piezas, sacar una rompe el resto.
- **Animar layout properties (`left`, `top`, `width`) es perf tax Y se ignora con `prefers-reduced-motion`** cuando el override CSS global es `* { transition-duration: 0.01ms !important; }`. Switching a `transform` lo hace más rápido (compositor-only) Y mantiene la animación barata de neutralizar. Auditar cualquier `transition: <layout-prop>` mientras se hace una pasada de a11y.
- **`prefers-reduced-motion` requiere counterpart en JS para cualquier animación state-driven.** Las animaciones CSS-only quedan capturadas por el override global del media query, pero las máquinas de estado driven por `setTimeout` / `requestAnimationFrame` / `IntersectionObserver` necesitan checar `matchMedia('(prefers-reduced-motion: reduce)')` ellas mismas y cortocircuitar al estado final. Mismo aplica a manipulación imperativa del DOM.
- **`role="alert"` es el patrón WCAG-AA-compliant para errores transient en formularios** — implica `aria-live="assertive"` y `aria-atomic="true"`, no hay que escribirlos. Para errores de login, submit, otros feedback crítico inmediato. **No usar para status no-crítico** (usar `role="status"` / `aria-live="polite"`).

### Anti-checklist antes de commit

Pasar cada surface por estas preguntas antes de aprobar el cambio:

1. **Cuarentena.** ¿Algún `var(--note-*)`, `var(--string*)`, `var(--caged-*)`, o hex de la paleta cromática está en un componente que **no** representa una nota o acorde? Si sí, violación.
2. **Pure black/white.** `grep` por `#000`, `#fff`, `rgba(0,0,0`, `rgba(255,255,255` en el diff. Cada hit que no sea (a) la letra blanca del Signature Component, (b) la sombra física sancionada del fretboard dot (`rgba(0,0,0,0.6)`), o (c) el hover glow sancionado de Triads (`rgba(255,255,255,0.2)`) — es violación o requiere migración a `var(--paper)`.
3. **Editorial Trio.** ¿Bebas en lowercase? ¿Plex Mono en heading display? ¿Playfair en algo que no sea cita literal de Josué? Cualquier sí → violación.
4. **One H1.** ¿El módulo o vista nueva tiene `<h1>`? Si sí, ¿AppShell ya tiene uno en la misma página? Solo el global tiene `<h1>`.
5. **Module shell.** ¿Renderizás un `<header>` con título dentro de un módulo? Justificá por qué AppShell + Header global no bastan. Default = no.
6. **Em dash / en dash.** `grep "— "` y `grep "– "` en el diff, **incluyendo `.json` y `.md`**. Solo permitido en `Header.tsx` (cita Josué) y archivos `data/literalContent.ts` (contenido del método).
7. **Side-stripe.** `grep "border-left.*[2-9]px\|border-right.*[2-9]px"` en el diff. Cualquier hit fuera de `RuleNote` (legacy reconocido) es violación inmediata. Al eliminar un stripe, revisá `border-radius` y `padding` adyacentes.
8. **Theme-flip.** ¿El componente nuevo lee colores via `var()` para todo lo no-paleta-cromática? ¿Vars referenciadas existen en `:root` Y en `[data-theme="light"]`?
9. **`prefers-reduced-motion`.** ¿El componente nuevo tiene `transition`/`animation`/`@keyframes`? El override CSS global ya neutraliza la duración. Si tu componente tiene una máquina de estado JS (`setTimeout`, `requestAnimationFrame`), añadí check explícito vía `matchMedia('(prefers-reduced-motion: reduce)')`.
10. **Layout property animation.** ¿Animás `width`/`height`/`top`/`left`? Reescribir como `transform`. Sidebar drawer ya lo arregló; no añadir más.
11. **Keyboard reach.** Todo `onClick`/`onMouseEnter` en SVG `<g>`/`<div>` necesita `tabIndex`/`role="button"`/`aria-label`/`onKeyDown` (Enter|Space) **y** `onFocus` si dispara audio/sensory side-effect.
12. **Audio replicado.** ¿Hay feedback solo sonoro en alguna interacción? PRODUCT.md exige paralelo visual: highlight de la nota que suena, posición, color. Audio nunca es el único portador.
13. **Hex repetido.** ¿Estás escribiendo el mismo hex literal por 3ª vez? Pará. Creá un token. Patrón: `:root { X }` + `[data-theme="light"] { Y }` en cualquier archivo de componente es señal directa de que un token global pertenece a `global.css`.
14. **Inline `style` o `React.CSSProperties`.** ¿Estás añadiendo estilos inline? Default a CSS module. Solo reservá inline para valores computados en render que no se pueden expresar como clase + modifier.

### Decisiones doctrinales tomadas (referencia para futuras decisiones similares)

- **N variantes visuales no-nota** se discriminan por: `var(--paper)` para foreground, `var(--muted)` para soporte, `var(--surface-2)` para fondo, `var(--rule)` para divisores, `var(--red)` solo para "tonic role" cuando aplica conceptualmente, `var(--amber)` para CTA primario / activo. Tipografía (Bebas vs Plex), peso (400 vs 500 vs 600), uppercase vs lowercase, letter-spacing — todos válidos como discriminadores antes que el color.
- **`userPicked` state** = `var(--surface-2)` fill + `var(--paper)` stroke. Se distingue de `tonica` (rojo), `highlighted` (ámbar) y `natural` (paper-tint) por contraste tonal, no por hue.
- **Active state pattern** (resuelto en 2ª ola): bg tint del color de marca correspondiente (ej: `rgba(192, 57, 43, 0.08)` para red) + `color: var(--paper)` + `font-weight: 500-600`. Reforzado con chevron (`▾`/`▸`) cuando aplica. **Sin border-left**.
- **Callout banner pattern** (FExceptionBanner): full `border: 1px solid var(--amber)` + `background: rgba(212, 160, 23, 0.06)`. Padding 16-20px. Lee como nota auto-contenida, no como side-stripe alert.
- **`<text>` SVG con `fill="var(--paper)"` o `fill="var(--red)"` funciona** en Vite + browsers evergreen. La lore de "SVG attributes solo aceptan literal colors" está desactualizada.
- **`color-mix(in srgb, var(--token) X%, transparent)`** es el patrón correcto para tints translúcidos basados en CSS vars. Soporte: Baseline 2024 — todos los browsers evergreen modernos. Resuelve el problema de `rgba(var(--paper), X)` que NO funciona (CSS vars no componen dentro de `rgba()` sin un companion `--paper-rgb` token).
- **`prefers-reduced-motion`** se implementa en dos lugares: (a) global CSS en `global.css` con un media query `*` reset que neutraliza duraciones, (b) JS-side en hooks/componentes con `setTimeout`/`requestAnimationFrame` que deben checkar `matchMedia` y saltar a estado final. La pareja CSS+JS es necesaria.
- **Token de texto de cuerpo** (`--text-body`): es un par de luminancia distinto de `--muted`. Texto de párrafo es más legible que labels secundarios; ambos tienen su propio token. Si una pasada futura colapsa `--text-body` en `--muted`, está degradando legibilidad.
- **Em dash → `·` separator** está codificado en DESIGN.md §3 como Middle-Dot Separator Rule. Las JSON i18n (`es.json`/`de.json`) son zona de leak — auditarlas explícitamente.

## Procedimiento operativo

Cuando llegue una nueva pasada de craft/polish/distill/harden:

1. Cargar PRODUCT.md y DESIGN.md (el sidecar `.impeccable/design.json` también).
2. Cargar este `lessons-learned.md` antes de empezar.
3. Si la pasada toca color decorativo → ejecutar la **anti-checklist 1, 2, 13**.
4. Si la pasada toca tipografía/copy → **3, 4, 6**.
5. Si la pasada toca layout/animación → **9, 10**.
6. Si la pasada toca interactividad → **11, 12**.
7. Si la pasada introduce estilos → **14**.
8. Al finalizar: actualizar **DESIGN.md §7 Pending Debts** removiendo lo resuelto y añadiendo lo nuevo descubierto. Actualizar este archivo si el patrón de error es nuevo.
9. Build limpio antes de reportar.

## Historial

- **2026-05-04 — 1ª ola:** Auditoría inicial post-migración (40 problemas catalogados). Tres pasadas paralelas (Rule 2 fix, Craft T2/T1, Polish em-dashes) resolvieron 12 problemas críticos.
- **2026-05-04 — 2ª ola:** Pasadas paralelas (Motion+A11y, Visual, Tokens+I18N) resolvieron 18 problemas adicionales (incluyendo TODOS los CRÍTICO restantes excepto los doctrinales que requieren decisión de palette/UX).
- **2026-05-04 — 3ª ola:** Polish trivial (5 items en un solo agente): `:focus-visible` en LockScreen, sidebar overlay tinted, HerramientaSection radius 6→0, Header watermark tinted, Footer inline → CSS module.
- **2026-05-04 — 4ª ola:** Doctrinales aprobadas (3 agentes paralelos): note-palette light overrides (12 hues con AA en cream, `data/notes.ts` migrado a `var()` strings, excepción documentada en DESIGN.md §2); mute toggle global en sidebar (Zustand store + hook guard + nuevo MuteToggle component, default mute); RuleNote rediseñada al patrón canónico de callout (full border 1px + tinted bg 6%). Más decisiones doc-only: ProcessPanel.titulo Playfair como excepción (preguntas-pregunta = citas), One Voice Rule densidad >10% aceptable en TablaMaestra/ModoClase, AudioButtons highlight progresivo deferido a pasada futura.
- **Doctrina añadida en CLAUDE.md §5:** UI/Frontend Doctrine — protocolo obligatorio que requiere cargar PRODUCT.md/DESIGN.md/lessons-learned.md antes de cualquier cambio UI, y pasar la anti-checklist de 14 items antes de commit.
- **Plantilla de auditoría guiada:** `.impeccable/audit-template.md` — prompt reutilizable para auditar otros proyectos multi-página.
- **Pendiente:** solo AudioButtons highlight progresivo (UX work) + tokens semánticos opcionales (`--text-faded`, `--fret-num`) si ameritan. La auditoría está cerrada en sus puntos críticos.
