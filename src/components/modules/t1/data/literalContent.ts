// Contenido literal del método de Josué Barquero — NO parafrasear, NO corregir erratas.
// Fuente: docs/source_of_truth_T1_T2.md (T1 §1.1, §1.2, §1.3, §1.6).

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
