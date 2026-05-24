# Reunión 24/5/26 — Fixes T1 + Validador de enarmonía

**Origen:** `D:\Guitar Learning\apuntes_reunion_24_5_26.txt`
**Fecha:** 2026-05-24
**Scope:** Módulo T1 secciones 1.1–1.8, más utilidad de enarmonía compartida.

## Decisiones fijadas

1. **Validador primero, fixes después.** Una sola fuente de verdad para ortografía de intervalos.
2. **Numerales:** arábigos con calidad para intervalos (2M 3M 4J 5J 6M 7M 8J); romanos para grados de acordes (I ii iii IV V vi vii°).
3. **Un único selector global de tónica.** Todos los selectores locales en T1 desaparecen y consumen `useUIStore.tonic`. Excepción: secciones de T2 `ProcesoBemolesSection` / `ProcesoSostenidosSection` — el selector ahí escoge *tonalidad pedagógica* dentro de un set acotado, no la tónica global; se documenta como excepción intencional.
4. **Colores cromáticos:** solo en hover. Estado base es monocromo.

## Regla central de enarmonía

> El número del intervalo determina la **letra**. La calidad determina la **alteración**.
> Una tercera de G es siempre B (o B♭), nunca A#. Una cuarta de F es siempre B (o B♭), nunca A#.

### API del validador (`src/utils/enharmonic.ts`)

```ts
type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type IntervalQuality = 'P' | 'M' | 'm' | 'aug' | 'dim'; // P=Justa

spelledIntervalFromTonic(
  tonic: ChromaticNote,
  number: IntervalNumber,
  quality: IntervalQuality
): string  // ej. "B♭", "C♯", "Bx"

spelledChromaticCircle(tonic: ChromaticNote): Array<{
  sharp: string;  // ej. "A♯"
  flat: string;   // ej. "B♭"
  expectedLetter?: NaturalLetter; // si está, escoger la enarmónica que coincide
}>  // 13 entradas (octava incluida)

// Re-export consolidando lo que ya existe:
majorScaleSpelled, chordSpelled, perfectFifth (ya en noteCalculations.ts)
```

Tests unitarios para tónicas problemáticas: F, B, B♭, F♯, D#, G#, A#.

## Punch list por sección

| # | Sección | Cambios |
|---|---------|---------|
| 1.1 | NotasNaturales | Tabla 7 notas → círculo 7 notas |
| 1.2 | CírculoCromático | Mostrar ambas alteraciones (A♯/B♭). Quitar modo reproducción; solo sonar al click |
| 1.3 | Intervalos | Quitar selector local. Romanos → arábigos. Notas en línea aparte del texto. Usar validador para corregir 3ras menores incorrectas en el primitive |
| 1.4 | EscalaMayor | Tabla: 2M 3M 4J 5J 6M 7M 8J (mantener formato tensión/reposo). Visualizador: quitar "TTSTTTS", quitar flechas, calidades en vez de romanos, notas fuera de escala no suenan |
| 1.5 | TensiónResolución | Aplicar validador al mapa. Arreglar flecha 4ta (sale de IV → V y III, no recta atravesando III–V). Remover duplicado "4ª · 7ª (tensos) / 2ª · 6ª (intermedios)" |
| 1.6 | Tríadas | Quitar selector local en MasterTriad |
| 1.7 | Acordes | Bloque "A# mayor = B♭ D F…" debe regenerarse en cada cambio de tónica (no solo resaltar) |
| 1.8 | Regla 5J | Ya consume global; auditar que no quede ninguno local |

## Fuera de scope (explícito)

- Audio engine
- T2 más allá de auditoría de selectores
- Auth, sidebar (salvo label TÓNICA ya hecho)
- i18n alemán salvo strings que el cambio toque

## Verificación

- `preview_*` rotando tónicas F, B, B♭, F♯, D#
- Anti-checklist `.impeccable/lessons-learned.md`
- Actualizar `DESIGN.md §7 Pending Debts` (remover lo resuelto, añadir lo nuevo)
