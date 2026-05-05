// Contenido literal del método de Josué Barquero — NO parafrasear, NO corregir erratas.
// Fuente: docs/source_of_truth_T1_T2.md (T1 §1.1, §1.2, §1.3, §1.4, §1.6, §1.7, §1.8).

// === 01 · Notas naturales y cifrado anglosajón (§1.1) ===

export const NATURALES_INTRO =
  "Las 7 notas en español tienen una letra asociada en el cifrado anglosajón.";

export const NATURALES_TABLA_ES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'] as const;
export const NATURALES_TABLA_EN = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export const NATURALES_JERARQUIA =
  "Todas las notas se manejan como iguales en jerarquía desde el inicio. Esto es deliberado: agiliza el aprendizaje porque permite empezar cualquier ejercicio desde cualquier nota, sin un \"Do central\" privilegiado.";

export const NATURALES_BASE =
  "Las 7 notas naturales conforman la base de todo lo que viene.";

export const CONSEJO_NATURALES =
  "Consejo del método: decir las notas en voz alta, en orden horario y antihorario, comenzando en una nota al azar.";

// === 02 · Notas alteradas y círculo cromático (§1.2) ===

export const ALTERADAS_INTRO =
  "Además de las 7 notas naturales existen 5 notas más, llamadas alteradas. Cada una tiene 2 nombres.";

export const ALTERADAS_DEFS = [
  { simbolo: '#', nombre: 'Sostenido', desc: 'cuando una nota natural sube un semitono (un traste).' },
  { simbolo: 'b', nombre: 'Bemol', desc: 'cuando una nota natural baja un semitono (un traste).' },
] as const;

export const CC_INTRO =
  "Sumando las 7 naturales y las 5 alteradas resultan las 12 notas del círculo cromático (CC).";

export const CC_TABLA = [
  'A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab',
] as const;

export const CC_NO_ALTERADA =
  "Importante: entre B–C y entre E–F no hay nota alterada (por el momento, se omiten B# y E# como alteraciones del círculo cromático; en este contexto son la misma nota que C y F respectivamente).";

// === 03 · Los 13 intervalos posibles dentro de una octava (§1.3) ===

export const INTERVALOS_DEF =
  "Un intervalo es la distancia entre dos notas. Se nombra primero por número (segunda, tercera, …, octava), donde la tónica es 0 y no se cuenta.";

export const INTERVALOS_GRADOS_HEAD = ['Nombre', 'T', '2', '3', '4', '5', '6', '7', '8'] as const;
export const INTERVALOS_GRADOS_ROW = ['Ejemplo', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export const INTERVALOS_CALIDAD =
  "Los intervalos tienen además calidad: menores (m), mayores (M), justos (J), aumentados (a), disminuidos (d). Combinando número y calidad se obtienen 13 intervalos dentro de una octava.";

export const INTERVALOS_13_HEAD = [
  'Nombre', 'T', '2m', '2M', '3m', '3M', '4J', '4a/5d', '5J', '6m', '6M', '7m', '7M', '8J',
] as const;
export const INTERVALOS_13_ROW = [
  'Semitono', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
] as const;

export const INTERVALOS_PROCEDIMIENTO_TITULO =
  "Procedimiento para encontrar los intervalos partiendo de una tónica G";

export const INTERVALOS_PROCEDIMIENTO_PASOS = [
  "Escribir las letras según el número del intervalo (ignorando alteraciones): G A A B B C C-D D E E F F G.",
  "Escribir el círculo cromático desde la tónica: G G#/Ab A A#/Bb B C C#/Db D D#/Eb E F F#/Gb G.",
  "Cuando hay dos notas alteradas, elegir según la letra del paso 1. Si en el paso 1 está \"B\", entonces se elige A# antes que Bb.",
  "Actualizar la escala con los intervalos correctos.",
] as const;

export const INTERVALOS_RESULTADO_G =
  "Resultado para G: G Ab A Bb B C C#/Db D Eb E F F# G.";

export const INTERVALOS_OCTAVA =
  "La 8J (octava justa) es la misma nota más aguda o más grave. La 8J de G es G.";

// === 06 · Construcción de las 7 tríadas y la tríada maestra (§1.6) ===

export const TRIADAS_DEF =
  "Una tríada son 3 notas específicas. También se le llama \"acorde\". Las tres notas tienen tres nombres.";

export const TRIADAS_NOTAS = [
  { nombre: 'Tónica', desc: 'la nota más importante del acorde.' },
  { nombre: 'Tercera', desc: 'la nota que define si la tríada es mayor (3M) o menor (3m).' },
  { nombre: 'Quinta', desc: 'funge de soporte al acorde (5J).' },
] as const;

export const TRIADAS_PROCEDIMIENTO_TITULO =
  "Procedimiento para construir una tríada partiendo de una nota";

export const TRIADAS_PROCEDIMIENTO_PASOS = [
  "Escogemos una nota natural.",
  "Saltamos (omitimos) la siguiente nota natural.",
  "Escribimos la siguiente.",
  "Omitimos otra vez.",
  "Escribimos la siguiente.",
] as const;

export const TRIADAS_EJEMPLO =
  "Ejemplo: F → omito G → A → omito B → C. La tríada de F es F A C.";

export const TRIADAS_INTRO_TABLA =
  "Aplicando esto a las 7 notas naturales se obtienen las 7 tríadas.";

export const TRIADAS_TABLA_HEAD = ['F', 'G', 'A', 'B', 'C', 'D', 'E'] as const;
export const TRIADAS_TABLA_ROW = ['F A C', 'G B D', 'A C E', 'B D F', 'C E G', 'D F A', 'E G B'] as const;

export const TRIADAS_MAESTRA =
  "Si seguimos el patrón sin pausa, hasta llegar a la misma nota, conseguimos la tríada maestra: F A C E G B D F.";

export const CONSEJO_TRIADAS =
  "Consejo del método: memorizar las 7 tríadas. Son la estructura de todo acorde y el fundamento de la armonía. También son herramienta para leer partitura.";

// === 04 · Escala mayor: notas estables y tensas (§1.4) ===

export const ESCALA_DEF =
  "La escala mayor tiene 7 notas. Cada nota tiene un carácter individual que se mantiene independiente de la tonalidad. Por eso se les da el nombre genérico de \"grados\" (1 al 7).";

export const ESCALA_EJEMPLO_INTRO =
  "Ejemplo en C mayor (única tonalidad sin alteraciones):";

export const ESCALA_TABLA_HEAD = ['Grado', 'T', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'T'] as const;
export const ESCALA_TABLA_NOTAS = ['Nota', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] as const;
export const ESCALA_TABLA_DIST = ['Distancia (s.t.)', '2', '2', '1', '2', '2', '2', '1', ''] as const;

export const ESCALA_DIVISION_INTRO = "La escala se divide en:";
export const ESCALA_ESTABLES = "Notas estables: 1, 3, 5.";
export const ESCALA_TENSAS = "Notas tensas: 2, 4, 6, 7.";

export const ESCALA_PRIMITIVA_TITULO = "Visualizador de la escala mayor";
export const ESCALA_PRIMITIVA_INSTRUCCION =
  "Elegí una tónica para ver su escala mayor sobre los 12 semitonos del círculo cromático. Las 7 notas de la escala se muestran encendidas; las 5 cromáticas restantes quedan atenuadas. Pasá el cursor o el foco sobre cada nota para escucharla.";

// === 07 · Acordes mayores y menores (§1.7) ===

export const ACORDES_INTRO =
  "Recapitulando lo de tríadas e intervalos.";

export const ACORDES_DEFINICIONES = [
  { tipo: 'Acorde mayor', formula: 'T + 3M + 5J', desc: 'tónica + tercera mayor + quinta justa.' },
  { tipo: 'Acorde menor', formula: 'T + 3m + 5J', desc: 'tónica + tercera menor + quinta justa.' },
] as const;

export const ACORDES_DIFF =
  "Solo cambia la tercera. Dos de tres notas son iguales son casi el mismo acorde.";

export const ACORDES_NOMENCLATURA_INTRO = "Nomenclatura:";
export const ACORDES_NOMENCLATURA = [
  { regla: 'Acorde mayor', desc: 'solo la letra. F = Fa mayor.' },
  { regla: 'Acorde menor', desc: 'letra + "m" minúscula. Fm = Fa menor.' },
] as const;

export const ACORDES_PROCEDIMIENTO_TITULO =
  "Procedimiento para encontrar la tríada mayor o menor de cualquier nota";

export const ACORDES_PROCEDIMIENTO_PASOS = [
  "Escribir la tríada partiendo de la tónica (solo notas naturales).",
  "Contar cromáticamente a partir de la tónica, los semitonos hasta tercera (3M = 4 s.t. o 3m = 3 s.t.).",
  "Contar cromáticamente a partir de la tónica, los semitonos hasta la quinta justa (5J = 7 s.t.).",
] as const;

export const ACORDES_EJEMPLO_TITULO = "Ejemplo A mayor";
export const ACORDES_EJEMPLO_PASOS = [
  "Letras de la tríada: A C E.",
  "Semitonos hasta la 3M: A → A#/Bb (1) → B (2) → C (3) → C#/Db (4). Por la regla del paso 1, la letra es C, entonces es C# (no Db).",
  "Semitonos hasta la 5J: A → A#/Bb (1) → B (2) → C (3) → C#/Db (4) → D (5) → D#/Eb (6) → E (7).",
] as const;

export const ACORDES_RESULTADO_MAYOR = "A mayor = A C# E.";
export const ACORDES_RESULTADO_MENOR =
  "Para A menor, la única diferencia es bajar la tercera un semitono: A menor = A C E.";

export const ACORDES_PRIMITIVA_TITULO = "Constructor de acordes";
export const ACORDES_PRIMITIVA_INSTRUCCION =
  "Elegí una tónica y una calidad (mayor o menor) para construir el acorde. Escuchalo bloque (tres notas a la vez) o arpegiado (T → 3 → 5).";

// === 08 · Regla de la quinta justa con sus excepciones (§1.8) ===

export const REGLA_INTRO =
  "La quinta justa siempre copia la alteración de la tónica.";

export const REGLA_BULLETS = [
  { regla: 'T natural', desc: 'la 5J también es natural.', ejemplo: 'D → A.' },
  { regla: 'T con #', desc: 'la 5J también lleva #.', ejemplo: 'F# → C#.' },
  { regla: 'T con b', desc: 'la 5J también lleva b.', ejemplo: 'Eb → Bb.' },
] as const;

export const REGLA_EXCEPCIONES_TITULO = "Excepciones";
export const REGLA_EXCEPCION_B =
  "Cuando B es la tónica, su 5J es F# (no F).";
export const REGLA_EXCEPCION_BB =
  "Cuando Bb es la tónica, su 5J es F (no Fb).";

export const CONSEJO_REGLA_5J =
  "Consejo del método: poner a prueba esta regla con las 12 notas, encontrando la tríada mayor y menor de cada una.";

export const REGLA_PRIMITIVA_TITULO = "Las 12 quintas justas";
export const REGLA_PRIMITIVA_INSTRUCCION =
  "Cada fila reproduce su tónica y su 5J en secuencia. La excepción de B → F# queda enmarcada para destacarla del patrón.";

export const REGLA_NOTA_BEMOLES =
  "Si nombrás las notas alteradas con bemoles, surge una segunda excepción: Bb → F (no Fb). En el sistema con sostenidos, esa misma 5J aparece como A# → E# (enarmónica de F).";
