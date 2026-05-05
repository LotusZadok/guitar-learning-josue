# Product

## Register

product

## Users

Estudiantes de guitarra del Prof. Josué Barquero. Audiencia amplia por diseño: adolescentes, adultos, principiantes y avanzados — cualquiera que tome sus clases. La herramienta vive en dos contextos:

- **En clase**: Josué la proyecta y la usa como material de apoyo mientras enseña. La interfaz acompaña su explicación, no la reemplaza.
- **Fuera de clase**: el estudiante regresa solo, en cualquier momento, a revisar lo que vio. No hay un "siguiente nivel" que desbloquear, no hay seguimiento de progreso. Es una referencia permanente.

El job-to-be-done es **aprender y reforzar teoría musical aplicada a la guitarra** — notas, intervalos, tríadas, tonalidades, armaduras, armonía diatónica — con feedback auditivo y visual inmediato.

Detalle pedagógico crítico: el contenido está anclado al método específico de Josué Barquero, incluyendo su redacción idiomática y erratas intencionales. No es un compendio genérico de teoría musical; es **su** método didáctico hecho navegable.

## Product Purpose

Dar a los estudiantes de Josué una referencia interactiva permanente que:

1. **Reemplaza apuntes de papel dispersos** con una sola fuente coherente y siempre disponible.
2. **Sostiene la clase en vivo** sin distraer del concepto que se está enseñando.
3. **Permite repaso autónomo** entre clases sin necesidad del profesor.

El éxito se mide cualitativamente: un estudiante abre la app entre dos clases, entiende lo que revisa sin sentirse perdido, y siente que es **continuidad de la clase**, no un producto separado. Si el estudiante percibe la app como "una herramienta entre tantas" en lugar de "el espacio del Profe Josué online", fallamos.

Actualmente cubre dos módulos:
- **T1 — Fundamentos musicales** (en desarrollo)
- **T2 — Tonalidades y armonía diatónica** (POC funcional con animación de armaduras, círculos cromáticos, tabla maestra, modo clase)

Está protegida por contraseña: no es público, es para los estudiantes de Josué.

## Brand Personality

Tres palabras: **editorial, sereno, riguroso**.

- **Editorial**: la tipografía hace el trabajo pesado. Bebas Neue como display, IBM Plex Mono como sistema, Playfair Display para citas. El chrome (botones, sidebars, contenedores) es funcional e invisible.
- **Sereno**: el ritmo es calmo. Sin recompensas por cada acción, sin animaciones histéricas, sin contenido que parpadee para reclamar atención. La app supone que el estudiante quiere estar ahí.
- **Riguroso**: precisión sobre aproximación. Los nombres de notas, los intervalos, las armaduras se escriben como las escribiría Josué en una pizarra. No se simplifica el vocabulario para parecer accesible.

Voz: la de un profesor experto que confía en quien lo lee. Explica con detalle pero sin condescender. No usa emojis, no usa exclamaciones, no celebra al usuario por hacer click.

Meta emocional: el estudiante debe sentir que está estudiando algo que merece atención — abrir la app debe parecerse más a abrir un libro de música que a entrar a un juego.

## Anti-references

Lo que esta app explícitamente NO debe parecer:

- **Duolingo, Yousician, Simply Piano, Flowkey** — gamificación con mascots, racha diaria, "siguiente lección desbloqueable", recompensa positiva cada 3 segundos, paleta saturada. Convierten el aprendizaje en compulsión por puntos. Aquí el motor es la curiosidad del estudiante, no un sistema de refuerzo intermitente.
- **SaaS-cream / SaaS-noir genérico** — clones de Linear / Notion / Vercel: sidebar acrílico, cards apiladas idénticas, hero con gradiente sutil, "metric big number small label". Este reflejo de categoría queda fuera.
- **PDF de partitura escaneada** — interfaz estática, sin audio, sin interacción, donde la "interactividad" es Ctrl+F. La app debe sentirse viva sin caer en lo gimmick.
- **Reflejos de dataset por dominio**:
  - "música" → púrpura, neón, glassmorphism, vinilo girando
  - "aprendizaje" → verde, checkmarks, progress bars, badges
  - "guitarra" → mástil de fondo, textura de madera literal en todos lados
  
  Si la primera asociación visual viene gratis del entrenamiento de un modelo, no la tomamos.

## Design Principles

Cinco principios estratégicos que guían cualquier decisión visual o de interacción. Aplican en todo el proyecto, no solo en pantallas individuales.

1. **Editorial-académica, no decorativa.** La jerarquía vive en la tipografía, el espaciado y el color semántico. Cualquier elemento que no enseñe algo o no oriente al lector sobra. Ningún ornamento existe "porque queda lindo".

2. **Disciplina Swiss / Internacional, densidad académica.** Grilla rigurosa, aire generoso, alineamientos exactos — pero el contenido tolera párrafos largos del método de Josué sin disolverse en flashcards o tooltips. La app respeta que la teoría musical requiere texto explicativo, no solo iconos.

3. **Audio y visual son pares.** Esta app enseña por oído tanto como por vista. Cada interacción significativa con una nota, un intervalo o una tónica produce sonido. Quitar el audio no rompe la app, pero la empobrece a la mitad de su intención.

4. **Color con función semántica, nunca cosmética.** Las 12 notas cromáticas tienen una identidad de color fija (rojo = C, naranja = D, etc.). Esa paleta **no decora** UI que no sea una nota. El resto del sistema vive en neutros tintados hacia la marca, no en colores aleatorios.

5. **Rechazo activo de reflejos de categoría.** Antes de tomar una decisión visual, hay que preguntarse: "¿esto saldría gratis si pidiera a un modelo 'app de música didáctica'?" Si la respuesta es sí, se descarta y se vuelve a empezar. La estética se gana, no se hereda.

## Accessibility & Inclusion

Objetivo: **WCAG 2.1 AA**.

- **Audio nunca es obligatorio para entender.** Todo lo que se transmite por sonido tiene representación visual paralela (texto, color, posición). Un usuario sordo o con audio desactivado puede usar la app completa, perdiendo solo el refuerzo auditivo.
- **`prefers-reduced-motion` respetado.** Animaciones (especialmente las de armaduras paso a paso en T2) saltan a estado final cuando el usuario lo tiene activado. La animación es decorativa-pedagógica, nunca el único portador de información.
- **Color no es el único discriminador.** Las 12 notas se distinguen por color + letra (`A`, `B♭`, etc.) + posición fija en el círculo cromático. Daltónicos pueden navegar sin problemas.
- **Volumen razonable** y, como principio para iteraciones futuras, **mute global** disponible siempre que la app emita sonido.
- **Tipografía mínima cómoda**: el cuerpo actual está en 13px; en una pasada futura de polish, considerar subir a 16px para mejorar legibilidad en usuarios mayores y pantallas pequeñas. Los tamaños de display (Bebas Neue) ya son suficientemente grandes.
