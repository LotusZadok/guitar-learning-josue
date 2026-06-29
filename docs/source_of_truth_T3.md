# Source of Truth — T3: Enriqueciendo la armonía

> Contenido teórico base del módulo **T3**. Reestructurado a partir de `material_T3_T4.md` (que reunía T3 + T4): por decisión del profesor, **todo se trata como T3**, con el orden de subsecciones definido abajo. Las secciones que el material original ubicaba en "T4" (dominantes secundarias, ii–V–I, menor) se integran como 3.6–3.10.
>
> Marcadores: 🟢 contenido directo del material subido · 🟡 derivado de teoría estándar consistente con el método (tonal lo computa), **pendiente de revisión del profesor** porque el material no lo detalló.

Hasta T2 los acordes son tríadas (3 notas) en dos calidades: mayor y menor. La música real (pop, rock, jazz, bossa, bolero, folclore latinoamericano) usa acordes con séptima, suspendidos, semidisminuidos y disminuidos completos. T3 introduce todo ese vocabulario y la armonía funcional que lo usa (dominantes, ii–V–I, tonalidad menor).

**Orden de subsecciones (definitivo):**

| #     | Título                                              | Fuente material |
| ----- | --------------------------------------------------- | --------------- |
| 3.1.1 | Las nuevas séptimas (7M, 7m, 7d)                    | §3.1 🟢         |
| 3.1.2 | Acordes con séptimas (maj7, m7, 7)                  | §3.3 🟢         |
| 3.2   | Acordes disminuidos (m7♭5 y dim7)                   | §3.4 + §3.6 🟢  |
| 3.3.1 | Segunda mayor y cuarta justa (recap)                | §3.2 🟢         |
| 3.3   | Acordes suspendidos (sus2, sus4)                    | §3.5 🟢         |
| 3.4   | Constructor de acordes completo                     | derivado 🟢     |
| 3.5   | Grado 7 y armonía diatónica con séptimas            | §3.3 🟢         |
| 3.6   | Dominante X7 (V7)                                   | §3.3 + §4.1 🟢  |
| 3.7   | ii–V–I (mayor)                                      | §4.2 🟢         |
| 3.8   | Tonización (dominantes secundarias)                 | §4.1 + §4.2 🟢  |
| 3.9   | Escala menor con séptimas (relativa)                | derivado 🟡     |
| 3.10  | Progresiones armónicas en escala menor (V7, ii°)    | §4.2 + deriv 🟡 |

---

## 3.1.1 Las nuevas séptimas — 7M, 7m, 7d 🟢

Recordando la tabla de intervalos de T1, hay tres calidades de séptima a la hora de armar acordes:

| Intervalo | Cifrado de acorde típico | Semitonos | Equivalencia enarmónica |
| --------- | ------------------------ | --------- | ----------------------- |
| 7M        | maj7                     | 11        |                         |
| 7m        | 7                        | 10        |                         |
| 7d        | dim7                     | 9         | 6M                      |

La **séptima mayor (7M)** y la **séptima menor (7m)** ya estaban en la tabla de T1. La novedad es la **séptima disminuida (7d)**: es **un semitono menor que la 7m**, lo que la hace enarmónicamente equivalente a una 6M, pero pedagógicamente se trata como séptima porque ese es el rol que cumple en el acorde dim7.

> Coherencia con el árbol del constructor (§3.4): la 5J ramifica a 7M y 7m; la 5d ramifica a 7d. Mantener el sentido de cercanía/lejanía del árbol de §1.7 (vertical = distancia interválica, horizontal = calidad menor-izquierda / mayor-derecha).

---

## 3.1.2 Acordes con séptimas — maj7, m7, 7 🟢

Construir un acorde con séptima es agregar una cuarta nota a la tríada, a un intervalo de séptima de la tónica. Combinando las dos calidades de tercera (3m, 3M) con las dos séptimas útiles aquí (7m, 7M), salen los tres acordes con séptima más comunes:

| Acorde      | Fórmula          | Ejemplo en C | Cifrado |
| ----------- | ---------------- | ------------ | ------- |
| Mayor 7     | T + 3M + 5J + 7M | C E G B      | Cmaj7   |
| Menor 7     | T + 3m + 5J + 7m | C E♭ G B♭    | Cm7     |
| Dominante 7 | T + 3M + 5J + 7m | C E G B♭     | C7      |

La diferencia entre Cmaj7 y C7 es solo la séptima (B vs B♭). La diferencia entre Cm7 y C7 es solo la tercera (E♭ vs E). El **dominante 7** combina la 3M (carácter mayor) con la 7m (tensión), y esa combinación es lo que le da su rol funcional como dominante (se desarrolla en §3.6).

`tonal`: `Chord.get("Cmaj7").notes`, `Chord.get("Cm7").notes`, `Chord.get("C7").notes`.

---

## 3.2 Acordes disminuidos — m7♭5 y dim7 🟢

### Recap: quinta disminuida (5d)

Intervalo ya presente en T1 (registrado como **4a/5d = 6 semitonos**). Ahora pasa a primer plano porque es el que altera la quinta del acorde para producir las dos familias disminuidas. La 5d es el intervalo más característico de la música tonal con tensión: es la única distancia de la escala mayor que aparece **una sola vez**, entre el 4to y el 7mo grado.

### Semidisminuido (m7♭5)

| Acorde         | Fórmula          | Ejemplo en C | Cifrado |
| -------------- | ---------------- | ------------ | ------- |
| Semidisminuido | T + 3m + 5d + 7m | C E♭ G♭ B♭   | Cm7♭5   |

Aparece de forma natural como **vii** en tonalidad mayor y como **ii°** en tonalidad menor (base del ii–V–i menor, §3.10). Alias en `tonal`: `m7b5`, `ø`.

### Disminuido completo (dim7 / °)

| Acorde | Fórmula          | Ejemplo en C | Notas         |
| ------ | ---------------- | ------------ | ------------- |
| dim7   | T + 3m + 5d + 7d | Cdim7 / C°   | C E♭ G♭ B𝄫    |

**Apilamiento perfecto de terceras menores:** todas las distancias internas son de 3 semitonos (3m). El acorde dim7 es **simétrico**: cualquier inversión suena igual. Por eso solo existen **3 acordes disminuidos completos** distintos en toda la música tonal:

- C° = E♭° = G♭° = A°
- C♯° = E° = G° = B♭°
- D° = F° = A♭° = B°

**Función:** acorde de paso cromático entre dos acordes diatónicos (ej.: C, C♯°, Dm en C mayor).

---

## 3.3.1 Segunda mayor y cuarta justa (recap) 🟢

Dos intervalos ya presentes en T1, que ahora se usan para **construir acordes** (no solo como notas tensas dentro de una escala):

- **Segunda mayor (2M):** 2 semitonos. Distancia natural entre el grado 1 y el grado 2 de la escala mayor.
- **Cuarta justa (4J):** 5 semitonos. Distancia natural entre el grado 1 y el grado 4 de la escala mayor.

Estos dos intervalos van a **reemplazar la tercera** del acorde para producir los suspendidos (§3.3).

---

## 3.3 Acordes suspendidos — sus2 y sus4 🟢

Los suspendidos **reemplazan la tercera** del acorde por otro intervalo:

| Acorde | Fórmula     | Ejemplo en C | Notas |
| ------ | ----------- | ------------ | ----- |
| Sus2   | T + 2M + 5J | Csus2        | C D G |
| Sus4   | T + 4J + 5J | Csus4        | C F G |

Sin la 3ra, el acorde **no es ni mayor ni menor**: un acorde sin género tonal. Esa ambigüedad es su carácter: queda flotando, esperando ser "resuelto" o no.

**Función típica:**

- **Sus4** suele resolver al mayor/menor descendiendo la cuarta a la tercera (Csus4 → C, F → E).
- **Sus2** puede resolver subiendo la segunda a la tercera (Csus2 → C, D → E), o quedarse sin resolver.

---

## 3.4 Constructor de acordes completo 🟢

Versión completa del árbol-constructor de §1.7, ahora con **todas** las ramas hasta la séptima. Topología (XML drawio en el plan original):

```
T ──┬── 2  ─────────── 5
    ├── 3m ──┬── 5d ── 7d
    │        └── 5  ──┬── 7M
    ├── 3M ───── 5    └── 7m
    └── 4  ───── 5
```

Acordes alcanzables (los 10 del método), con sus caminos:

| Acorde | Fórmula            | Camino en el árbol     |
| ------ | ------------------ | ---------------------- |
| sus2   | T · 2M · 5J        | 2 → 5                  |
| m      | T · 3m · 5J        | 3m → 5                 |
| dim    | T · 3m · 5d        | 3m → 5d                |
| M      | T · 3M · 5J        | 3M → 5                 |
| sus4   | T · 4J · 5J        | 4 → 5                  |
| m7♭5   | T · 3m · 5d · 7m   | 3m → 5d → (7m)         |
| dim7   | T · 3m · 5d · 7d   | 3m → 5d → 7d           |
| maj7   | T · 3M · 5J · 7M   | 3M → 5 → 7M            |
| X7     | T · 3M · 5J · 7m   | 3M → 5 → 7m            |
| m7     | T · 3m · 5J · 7m   | 3m → 5 → 7m            |

> Reutiliza `AcordesBuilder` con la misma doctrina visual (Named Rule "Playback Buttons"; árbol con doble codificación posicional). Esta es la "versión completa" anunciada en §1.7. Mantener **sentido de cercanía/lejanía** en todas las versiones del constructor (invariante acordado).

---

## 3.5 Grado 7 y armonía diatónica con séptimas 🟢

Al armonizar cada grado de la escala mayor con su séptima diatónica, se obtiene el patrón:

| Grado   | I    | ii  | iii | IV   | V   | vi  | vii   |
| ------- | ---- | --- | --- | ---- | --- | --- | ----- |
| Calidad | maj7 | m7  | m7  | maj7 | 7   | m7  | m7♭5  |

Patrón: **maj7 / m7 / m7 / maj7 / 7 / m7 / m7♭5**.

Ejemplo en C mayor: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, **Bm7♭5**.

El **grado 7** (vii) es el semidisminuido (§3.2): la nota sensible (7mo grado) como tónica de un m7♭5. `tonal`: `Key.majorKey("C").chords` devuelve exactamente esta serie.

---

## 3.6 Dominante X7 (V7) 🟢

El **dominante 7** (V7) es el acorde sobre el 5to grado: 3M + 5J + 7m. Combina el carácter mayor (3M) con la tensión de la 7m. Internamente contiene un **tritono** (5d entre el 3M y la 7m del acorde, p.ej. en G7: B–F), que es la fuente de su tensión y de su empuje a resolver al I.

Ejemplo en C mayor: **G7 → C**. La sensible (B) sube a la tónica (C) y la 7ma (F) baja a la 3ra (E).

`tonal`: el V7 de una tonalidad sale de `Key.majorKey("C").chords[4]`.

---

## 3.7 ii–V–I (mayor) 🟢

Movimiento armónico más característico de la música tonal (jazz/bossa). Estructura básica:

| En C mayor | Acorde | Función                      |
| ---------- | ------ | ---------------------------- |
| ii         | Dm7    | Subdominante (tensión media) |
| V7         | G7     | Dominante (tensión alta)     |
| I          | Cmaj7  | Tónica (resolución)          |

---

## 3.8 Tonización — dominantes secundarias 🟢

Cualquier acorde de la tonalidad puede **"tonizarse"** temporalmente, tratándolo como tónica nueva. El acorde que cumple esa función es la **dominante secundaria** del grado tonizado.

**Notación V/x** (x = grado tonizado). En C mayor:

| Notación | Acorde | Resuelve a |
| -------- | ------ | ---------- |
| V/ii     | A7     | Dm (ii)    |
| V/iii    | B7     | Em (iii)   |
| V/IV     | C7     | F (IV)     |
| V/V      | D7     | G (V)      |
| V/vi     | E7     | Am (vi)    |

**Construcción:** tomar el grado a tonizar, encontrar su dominante (el mayor con 7m una 5J arriba) e insertarlo antes. Ej.: en vez de I, ii, V, I (Cmaj7, Dm7, G7, Cmaj7) → I, **V/ii**, ii, V, I (Cmaj7, **A7**, Dm7, G7, Cmaj7).

**Generalización:** se puede insertar el **par completo ii–V** antes de cualquier grado, no solo el V suelto. Ej. hacia el IV en C mayor: Gm7, C7, Fmaj7 (ii–V–I "local" a F). `tonal`: `Progression.fromRomanNumerals("C", ["Imaj7","VI7","iim7","V7","Imaj7"])` → `Cmaj7 A7 Dm7 G7 Cmaj7`.

---

## 3.9 Escala menor con séptimas (relativa) 🟡

> **Pendiente de revisión del profesor.** El material subido no detalla la armonización menor con séptimas; lo siguiente es teoría estándar consistente con el método (y computable con `tonal`: `Key.minorKey("A")`).

La relativa menor de C mayor es **A menor** (mismas notas, distinta tónica). Armonizando la escala menor natural con séptimas:

| Grado   | i   | ii    | ♭III | iv  | v   | ♭VI  | ♭VII |
| ------- | --- | ----- | ---- | --- | --- | ---- | ---- |
| Calidad | m7  | m7♭5  | maj7 | m7  | m7  | maj7 | 7    |

Ejemplo en A menor: Am7, **Bm7♭5**, Cmaj7, Dm7, Em7, Fmaj7, G7.

Para la armonía funcional menor se usa la **menor armónica** (7mo grado elevado, G♯ en A menor), que convierte el v en **V7** (E7, con la sensible G♯). Eso da las dos piezas clave de §3.10: **V7** y **ii°** (Bm7♭5).

---

## 3.10 Progresiones armónicas en escala menor (V7 y ii°) 🟡

> **Pendiente de revisión del profesor.** Material base: §4.2 (ii°–V7–i menor). El resto es derivado.

La tonalidad menor real mezcla menor natural y armónica para tener dominante funcional. Las dos piezas:

- **ii°** = m7♭5 sobre el 2do grado (Bm7♭5 en A menor).
- **V7** = dominante con la sensible elevada (E7 en A menor, con G♯).

**ii°–V7–i (menor):**

| En A menor | Acorde | Función                        |
| ---------- | ------ | ------------------------------ |
| ii°        | Bm7♭5  | Subdominante alterada          |
| V7         | E7     | Dominante (con la sensible G♯) |
| i          | Am     | Tónica menor                   |

Progresiones menores típicas a documentar con el profesor (i–♭VI–♭VII–i, i–iv–V7–i, etc.) usando V7 y ii° como motores de tensión.

---

## Notas de implementación (capa matemática)

Decisión (29/6/26): **solo `tonal`**, sin sharp11/teoria (cubren lo mismo, sin mantenimiento ni tipos TS; fragmentarían la capa unificada en la 19ª ola). Para T3 se aprovechan módulos de alto nivel aún no usados:

- `Chord.get(name)` / `Chord.getChord(type, tonic)` — notas y grafía de maj7/m7/7/m7♭5/dim7/sus2/sus4.
- `Key.majorKey(t)` / `Key.minorKey(t)` — acordes diatónicos con séptima (`.chords`, `.grades`, alteraciones).
- `RomanNumeral` + `Progression.fromRomanNumerals` — análisis de grados, dominantes secundarias, ii–V–I.
- La grafía/enarmonía del método sigue gobernada por los helpers propios (`spelledIntervalFromTonic`, piso-tónica de octava); `tonal` provee la teoría, los helpers preservan la grafía pedagógica.
