# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## 5. UI/Frontend Doctrine

Cualquier solicitud que toque frontend — componentes React, CSS, copy de UI, layout, color, tipografía, animación, accesibilidad, theming, módulos, secciones, primitivas visuales — **debe** seguir este protocolo antes de tocar código.

### Protocolo

1. **Invocar el skill `impeccable`** (si está instalado) antes de cualquier acción de código UI. Si la solicitud es ambigua sobre si toca frontend, asumir que sí cuando hay `*.tsx`, `*.module.css`, archivos de `i18n/locales/`, o componentes de `src/components/`, `src/auth/`, `src/layout/` involucrados.
2. **Cargar la doctrina del proyecto** antes de proponer cambios:
   - `PRODUCT.md` — norte estratégico, marca, anti-references.
   - `DESIGN.md` — sistema visual, Named Rules, Don'ts, Pending Debts (§7).
   - `.impeccable/lessons-learned.md` — patrones de error documentados.
   - `.impeccable/design.json` — sidecar de tokens (si existe).
3. **Pasar la anti-checklist de 14 items** de `lessons-learned.md` antes de hacer commit. Si algún item falla, el cambio no está listo.
4. **Al terminar**, actualizar `DESIGN.md §7 Pending Debts` (remover lo resuelto, añadir lo nuevo descubierto) y `.impeccable/lessons-learned.md` (si emergió un patrón de error nuevo).

### Excepciones

- Tareas explícitamente no-UI (backend, scripts de build, CI/CD, edits a `package.json` no-frontend, fixes de tipos sin impacto visual) saltan este paso.
- Renombres triviales de variables, fixes de typos en strings que no son UI copy, y cambios puramente lógicos saltan este paso.
- Si el usuario pide explícitamente "no apliques impeccable", saltar — pero registrar la decisión en el resumen final.

### Multi-agente

Cuando una pasada UI implica >2 tareas independientes con archivos sin solape, particionar en agentes paralelos con scope explícito. La documentación es responsabilidad del orquestador, no de los agentes — cada agente reporta decisiones, el orquestador sintetiza en DESIGN.md y lessons-learned.md.

### Auditorías guiadas

Para auditorías de proyectos completos (multi-página), usar `.impeccable/audit-template.md` como prompt base.

### Comandos del skill `impeccable`

23 comandos en 6 categorías. Llamar por nombre exacto (ej: `/impeccable critique`, `/impeccable polish`).

**Create — construir algo nuevo**
- `/impeccable craft` — Shape + build una feature end-to-end.
- `/impeccable shape` — Brief de diseño antes de tocar código (descubrimiento, no adivinanza).
- `/impeccable impeccable` — La inteligencia de diseño detrás de cada comando.

**Evaluate — revisar lo existente**
- `/impeccable critique` — Design review con scoring, persona tests y detección automatizada.
- `/impeccable audit` — Chequeo técnico de calidad en 5 dimensiones, severidad P0–P3.

**Refine — mejorar una dimensión a la vez**
- `/impeccable typeset` — Arregla tipografía genérica, inconsistente o accidental.
- `/impeccable layout` — Corrige espaciado, ritmo y jerarquía visual.
- `/impeccable colorize` — Color estratégico a UI monocromas sin caer en saturado.
- `/impeccable animate` — Movimiento con propósito (estado, no decoración).
- `/impeccable bolder` — Empuja diseños seguros hacia impacto sin caos.
- `/impeccable quieter` — Bajar volumen de diseños que gritan, sin perder intención.
- `/impeccable delight` — Pequeños momentos de personalidad que vuelven funcional → memorable.
- `/impeccable overdrive` — Empuja una UI más allá de límites convencionales (shaders, físicas, 60fps).

**Simplify — quitar lo que no se gana su lugar**
- `/impeccable distill` — Sustracción ruthless. Reduce diseños a su esencia.
- `/impeccable clarify` — Reescribe UX copy confuso para que la interfaz se explique sola.
- `/impeccable adapt` — Diseños que funcionan en pantallas/dispositivos/contextos sin amputar.

**Harden — listo para producción**
- `/impeccable harden` — Edge cases, i18n, error states, overflow.
- `/impeccable optimize` — Diagnostica y corrige perf de UI (LCP a bundle size).
- `/impeccable polish` — La pasada meticulosa final entre "bueno" y "excelente".
- `/impeccable onboard` — Primeras experiencias, empty states, paths to value.

**System — setup y tooling**
- `/impeccable teach` — Enseña a Impeccable quién es tu producto (una vez por proyecto).
- `/impeccable document` — Genera DESIGN.md spec-compliant capturando el sistema visual.
- `/impeccable extract` — Extrae componentes/tokens/patrones reusables al sistema de diseño.
- `/impeccable live` — Itera en el browser. Pickear elemento, comentar, recibir 3 variantes.
