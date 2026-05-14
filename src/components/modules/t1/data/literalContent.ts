// Contenido literal del método de Josué Barquero — NO parafrasear, NO corregir erratas.
// Fuente: docs/source_of_truth_T1_T2.md (T1 §1.1, §1.2, §1.3, §1.4, §1.5, §1.6, §1.7, §1.8).

import type { ProseSegment } from '../../../../types/prose';

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

// "B#" y "E#" se mantienen como texto plano: no son spellings válidos en el sistema
// (el método los menciona negativamente — "se omiten" — para indicar que NO existen
// en este círculo cromático).
export const CC_NO_ALTERADA: ProseSegment = [
  { type: 'text', value: 'Importante: entre ' },
  { type: 'note', value: 'B' },
  { type: 'text', value: '–' },
  { type: 'note', value: 'C' },
  { type: 'text', value: ' y entre ' },
  { type: 'note', value: 'E' },
  { type: 'text', value: '–' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ' no hay nota alterada (por el momento, se omiten B# y E# como alteraciones del círculo cromático; en este contexto son la misma nota que ' },
  { type: 'note', value: 'C' },
  { type: 'text', value: ' y ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ' respectivamente).' },
];

// === 03 · Los 13 intervalos posibles dentro de una octava (§1.3) ===

export const INTERVALOS_DEF =
  "Un intervalo es la distancia entre dos notas. Se nombra primero por número (segunda, tercera, …, octava), donde la tónica es 0 y no se cuenta.";

export const INTERVALOS_GRADOS_HEAD = ['Nombre', 'T', '2', '3', '4', '5', '6', '7', '8'] as const;
export const INTERVALOS_GRADOS_ROW = ['Ejemplo', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export const INTERVALOS_CALIDAD =
  "Los intervalos tienen además calidad: menores (m), mayores (M), justos (J), aumentados (a), disminuidos (d). Combinando número y calidad se obtienen 12 intervalos dentro de una octava.";

export const INTERVALOS_13_HEAD = [
  'Nombre', 'T', '2m', '2M', '3m', '3M', '4J', '4a/5d', '5J', '6m', '6M', '7m', '7M', '8J',
] as const;
export const INTERVALOS_13_ROW = [
  'Semitono', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
] as const;

export const INTERVALOS_PROCEDIMIENTO_TITULO: ProseSegment = [
  { type: 'text', value: 'Procedimiento para encontrar los intervalos partiendo de una tónica ' },
  { type: 'note', value: 'G' },
];

export const INTERVALOS_PROCEDIMIENTO_PASOS: readonly (string | ProseSegment)[] = [
  [
    { type: 'text', value: 'Escribir las letras según el número del intervalo (ignorando alteraciones): ' },
    { type: 'note', value: 'G' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'B' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'B' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'C' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'C' }, { type: 'text', value: '-' },
    { type: 'note', value: 'D' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'D' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'E' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'E' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'F' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'F' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'G' }, { type: 'text', value: '.' },
  ],
  [
    { type: 'text', value: 'Escribir el círculo cromático desde la tónica: ' },
    { type: 'note', value: 'G' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'G#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Ab' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'A#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Bb' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'B' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'C' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'C#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Db' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'D' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'D#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Eb' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'E' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'F' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'F#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Gb' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'G' }, { type: 'text', value: '.' },
  ],
  [
    { type: 'text', value: 'Cuando hay dos notas alteradas, elegir según la letra del paso 1. Si en el paso 1 está "' },
    { type: 'note', value: 'B' },
    { type: 'text', value: '", entonces se elige ' },
    { type: 'note', value: 'Bb' },
    { type: 'text', value: ' antes que ' },
    { type: 'note', value: 'A#' },
    { type: 'text', value: '.' },
  ],
  "Actualizar la escala con los intervalos correctos.",
];

export const INTERVALOS_RESULTADO_G: ProseSegment = [
  { type: 'text', value: 'Resultado para ' },
  { type: 'note', value: 'G' },
  { type: 'text', value: ': ' },
  { type: 'note', value: 'G' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'Ab' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'Bb' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'B' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'C' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'C#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Db' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'D' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'Eb' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'E' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'F' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'F#' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'G' }, { type: 'text', value: '.' },
];

export const INTERVALOS_OCTAVA: ProseSegment = [
  { type: 'text', value: 'La 8J (octava justa) es la misma nota más aguda o más grave. La 8J de ' },
  { type: 'note', value: 'G' },
  { type: 'text', value: ' es ' },
  { type: 'note', value: 'G' },
  { type: 'text', value: '.' },
];

// === 05 · Tensión y resolución (§1.5) ===

export const TENSION_INTRO =
  "Las notas tensas e intermedias buscan resolver hacia las estables, hacia abajo o hacia arriba.";

// Cuatro reglas del método. Tipo unión (string | ProseSegment) por entrada:
// los strings sin nombres concretos de nota quedan como string puro;
// las que mencionan grados como notas usan ProseSegment con NoteToken.
export const TENSION_REGLAS: readonly { titulo: string; cuerpo: ProseSegment }[] = [
  {
    titulo: '2do grado',
    cuerpo: [
      { type: 'text', value: 'resuelve a la tónica o al 3er grado. En ' },
      { type: 'note', value: 'C' },
      { type: 'text', value: ' mayor: ' },
      { type: 'note', value: 'D' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'C' },
      { type: 'text', value: ' o ' },
      { type: 'note', value: 'D' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'E' },
      { type: 'text', value: '.' },
    ],
  },
  {
    titulo: '4to grado',
    cuerpo: [
      { type: 'text', value: 'resuelve al 3er o al 5to grado. Tiene más tensión hacia el 3er grado porque está a 1 s.t. (mayor tensión que 2 s.t.). El 4to también se llama "sensible modal". En ' },
      { type: 'note', value: 'C' },
      { type: 'text', value: ' mayor: ' },
      { type: 'note', value: 'F' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'E' },
      { type: 'text', value: ' o ' },
      { type: 'note', value: 'F' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'G' },
      { type: 'text', value: '.' },
    ],
  },
  {
    titulo: '6to grado',
    cuerpo: [
      { type: 'text', value: 'resuelve al 5to grado. En ' },
      { type: 'note', value: 'C' },
      { type: 'text', value: ' mayor: ' },
      { type: 'note', value: 'A' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'G' },
      { type: 'text', value: '.' },
    ],
  },
  {
    titulo: '7mo grado',
    cuerpo: [
      { type: 'text', value: 'resuelve a la tónica. Es la resolución más importante de la música tonal está a 1 s.t. de la tónica, por eso es la más tensa. El 7mo se llama "sensible tonal". En ' },
      { type: 'note', value: 'C' },
      { type: 'text', value: ' mayor: ' },
      { type: 'note', value: 'B' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'C' },
      { type: 'text', value: '.' },
    ],
  },
];

export const CONSEJO_TENSION =
  "Consejo del método: tocar las notas tensas un poco más fuertes que las estables. A esto se le llama resolver.";

export const TENSION_PRIMITIVA_TITULO = "Mapa de resoluciones en C mayor";
export const TENSION_PRIMITIVA_INSTRUCCION =
  "El strip muestra los 7 grados más la octava. Las flechas conectan cada nota tensa con su(s) reposo(s). Pasá el foco o hacé clic sobre una flecha para escuchar la resolución (tensión → reposo). La forma de la flecha indica la distancia: línea recta = 1 s.t., arco = 2 s.t.";

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

export const TRIADAS_EJEMPLO: ProseSegment = [
  { type: 'text', value: 'Ejemplo: ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ' → omito ' },
  { type: 'note', value: 'G' },
  { type: 'text', value: ' → ' },
  { type: 'note', value: 'A' },
  { type: 'text', value: ' → omito ' },
  { type: 'note', value: 'B' },
  { type: 'text', value: ' → ' },
  { type: 'note', value: 'C' },
  { type: 'text', value: '. La tríada de ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ' es ' },
  { type: 'note', value: 'F' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'C' }, { type: 'text', value: '.' },
];

export const TRIADAS_INTRO_TABLA =
  "Aplicando esto a las 7 notas naturales se obtienen las 7 tríadas.";

export const TRIADAS_TABLA_HEAD = ['F', 'G', 'A', 'B', 'C', 'D', 'E'] as const;
export const TRIADAS_TABLA_ROW = ['F A C', 'G B D', 'A C E', 'B D F', 'C E G', 'D F A', 'E G B'] as const;

export const TRIADAS_MAESTRA: ProseSegment = [
  { type: 'text', value: 'Si seguimos el patrón sin pausa, hasta llegar a la misma nota, conseguimos la tríada maestra: ' },
  { type: 'note', value: 'F' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'C' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'E' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'G' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'B' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'D' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'F' }, { type: 'text', value: '.' },
];

export const CONSEJO_TRIADAS =
  "Consejo del método: memorizar las 7 tríadas. Son la estructura de todo acorde y el fundamento de la armonía. También son herramienta para leer partitura.";

// === 04 · Escala mayor: notas estables y tensas (§1.4) ===

export const ESCALA_DEF =
  "La escala mayor tiene 7 notas. Cada nota tiene un carácter individual que se mantiene independiente de la tonalidad. Por eso se les da el nombre genérico de \"grados\" (1 al 7).";

export const ESCALA_EJEMPLO_INTRO: ProseSegment = [
  { type: 'text', value: 'Ejemplo en ' },
  { type: 'note', value: 'C' },
  { type: 'text', value: ' mayor (única tonalidad sin alteraciones):' },
];

export const ESCALA_TABLA_HEAD = ['Grado', 'T', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'T'] as const;
export const ESCALA_TABLA_NOTAS = ['Nota', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] as const;
export const ESCALA_TABLA_DIST = ['Distancia (s.t.)', '2', '2', '1', '2', '2', '2', '1', ''] as const;

export const ESCALA_DIVISION_INTRO = "La escala se divide en:";
export const ESCALA_ESTABLES = "Notas estables: 1, 3, 5.";
export const ESCALA_INTERMEDIAS = "Notas intermedias: 2, 6.";
export const ESCALA_TENSAS = "Notas tensas: 4, 7.";

export const ESCALA_PRIMITIVA_TITULO = "Visualizador de la escala mayor";
export const ESCALA_PRIMITIVA_INSTRUCCION =
  "Las notas en verde son estables. Las notas en naranja son intermedias. Las notas en rojo son tensas.";

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

// La regla "Acorde menor: Fm = Fa menor" no aisla un nombre de nota
// (Fm/Fa son nombres de acorde compuestos), así que su `desc` queda como string.
export const ACORDES_NOMENCLATURA: readonly { regla: string; desc: string | ProseSegment }[] = [
  {
    regla: 'Acorde mayor',
    desc: [
      { type: 'text', value: 'solo la letra. ' },
      { type: 'note', value: 'F' },
      { type: 'text', value: ' = Fa mayor.' },
    ],
  },
  {
    regla: 'Acorde menor',
    desc: 'letra + "m" minúscula. Fm = Fa menor.',
  },
];

export const ACORDES_PROCEDIMIENTO_TITULO =
  "Procedimiento para encontrar la tríada mayor o menor de cualquier nota";

export const ACORDES_PROCEDIMIENTO_PASOS = [
  "Escribir la tríada partiendo de la tónica (solo notas naturales).",
  "Contar cromáticamente a partir de la tónica, los semitonos hasta tercera (3M = 4 s.t. o 3m = 3 s.t.).",
  "Contar cromáticamente a partir de la tónica, los semitonos hasta la quinta justa (5J = 7 s.t.).",
] as const;

export const ACORDES_EJEMPLO_TITULO: ProseSegment = [
  { type: 'text', value: 'Ejemplo ' },
  { type: 'note', value: 'A' },
  { type: 'text', value: ' mayor' },
];

export const ACORDES_EJEMPLO_PASOS: readonly ProseSegment[] = [
  [
    { type: 'text', value: 'Letras de la tríada: ' },
    { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'C' }, { type: 'text', value: ' ' },
    { type: 'note', value: 'E' }, { type: 'text', value: '.' },
  ],
  [
    { type: 'text', value: 'Semitonos hasta la 3M: ' },
    { type: 'note', value: 'A' },
    { type: 'text', value: ' → ' },
    { type: 'note', value: 'A#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Bb' },
    { type: 'text', value: ' (1) → ' },
    { type: 'note', value: 'B' },
    { type: 'text', value: ' (2) → ' },
    { type: 'note', value: 'C' },
    { type: 'text', value: ' (3) → ' },
    { type: 'note', value: 'C#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Db' },
    { type: 'text', value: ' (4). Por la regla del paso 1, la letra es ' },
    { type: 'note', value: 'C' },
    { type: 'text', value: ', entonces es ' },
    { type: 'note', value: 'C#' },
    { type: 'text', value: ' (no ' },
    { type: 'note', value: 'Db' },
    { type: 'text', value: ').' },
  ],
  [
    { type: 'text', value: 'Semitonos hasta la 5J: ' },
    { type: 'note', value: 'A' },
    { type: 'text', value: ' → ' },
    { type: 'note', value: 'A#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Bb' },
    { type: 'text', value: ' (1) → ' },
    { type: 'note', value: 'B' },
    { type: 'text', value: ' (2) → ' },
    { type: 'note', value: 'C' },
    { type: 'text', value: ' (3) → ' },
    { type: 'note', value: 'C#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Db' },
    { type: 'text', value: ' (4) → ' },
    { type: 'note', value: 'D' },
    { type: 'text', value: ' (5) → ' },
    { type: 'note', value: 'D#' }, { type: 'text', value: '/' }, { type: 'note', value: 'Eb' },
    { type: 'text', value: ' (6) → ' },
    { type: 'note', value: 'E' },
    { type: 'text', value: ' (7).' },
  ],
];

export const ACORDES_RESULTADO_MAYOR: ProseSegment = [
  { type: 'note', value: 'A' },
  { type: 'text', value: ' mayor = ' },
  { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'C#' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'E' }, { type: 'text', value: '.' },
];

export const ACORDES_RESULTADO_MENOR: ProseSegment = [
  { type: 'text', value: 'Para ' },
  { type: 'note', value: 'A' },
  { type: 'text', value: ' menor, la única diferencia es bajar la tercera un semitono: ' },
  { type: 'note', value: 'A' },
  { type: 'text', value: ' menor = ' },
  { type: 'note', value: 'A' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'C' }, { type: 'text', value: ' ' },
  { type: 'note', value: 'E' }, { type: 'text', value: '.' },
];

export const ACORDES_PRIMITIVA_TITULO = "Constructor de acordes";
export const ACORDES_PRIMITIVA_INSTRUCCION =
  "Elegí una tónica y una calidad (mayor o menor) para construir el acorde. Escuchalo bloque (tres notas a la vez) o arpegiado (T → 3 → 5).";

// === 08 · Regla de la quinta justa con sus excepciones (§1.8) ===

export const REGLA_INTRO =
  "La quinta justa siempre copia la alteración de la tónica.";

export const REGLA_BULLETS: readonly { regla: string; desc: string; ejemplo: ProseSegment }[] = [
  {
    regla: 'T natural',
    desc: 'la 5J también es natural.',
    ejemplo: [
      { type: 'note', value: 'D' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'A' },
      { type: 'text', value: '.' },
    ],
  },
  {
    regla: 'T con #',
    desc: 'la 5J también lleva #.',
    ejemplo: [
      { type: 'note', value: 'F#' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'C#' },
      { type: 'text', value: '.' },
    ],
  },
  {
    regla: 'T con b',
    desc: 'la 5J también lleva b.',
    ejemplo: [
      { type: 'note', value: 'Eb' },
      { type: 'text', value: ' → ' },
      { type: 'note', value: 'Bb' },
      { type: 'text', value: '.' },
    ],
  },
];

export const REGLA_EXCEPCIONES_TITULO = "Excepciones";

export const REGLA_EXCEPCION_B: ProseSegment = [
  { type: 'text', value: 'Cuando ' },
  { type: 'note', value: 'B' },
  { type: 'text', value: ' es la tónica, su 5J es ' },
  { type: 'note', value: 'F#' },
  { type: 'text', value: ' (no ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ').' },
];

// "Fb" no tiene `--note-X` propio (Fb = E enarmónicamente, pero el método lo
// nombra explícitamente como spelling incorrecto). Queda como texto plano.
export const REGLA_EXCEPCION_BB: ProseSegment = [
  { type: 'text', value: 'Cuando ' },
  { type: 'note', value: 'Bb' },
  { type: 'text', value: ' es la tónica, su 5J es ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ' (no Fb).' },
];

export const CONSEJO_REGLA_5J =
  "Consejo del método: poner a prueba esta regla con las 12 notas, encontrando la tríada mayor y menor de cada una.";

export const REGLA_PRIMITIVA_TITULO = "Las 12 quintas justas";
export const REGLA_PRIMITIVA_INSTRUCCION: ProseSegment = [
  { type: 'text', value: 'Cada fila reproduce su tónica y su 5J en secuencia. La excepción de ' },
  { type: 'note', value: 'B' },
  { type: 'text', value: ' → ' },
  { type: 'note', value: 'F#' },
  { type: 'text', value: ' queda enmarcada para destacarla del patrón.' },
];

// "Fb" y "E#" son spellings inválidos en el sistema (mencionados negativamente
// en el método). Quedan como texto plano para preservar el contraste pedagógico
// "lo correcto vs. lo incorrecto" sin disfrazarlo de token.
export const REGLA_NOTA_BEMOLES: ProseSegment = [
  { type: 'text', value: 'Si nombrás las notas alteradas con bemoles, surge una segunda excepción: ' },
  { type: 'note', value: 'Bb' },
  { type: 'text', value: ' → ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ' (no Fb). En el sistema con sostenidos, esa misma 5J aparece como ' },
  { type: 'note', value: 'A#' },
  { type: 'text', value: ' → E# (enarmónica de ' },
  { type: 'note', value: 'F' },
  { type: 'text', value: ').' },
];
