// Contenido literal del método de Josué Barquero — NO parafrasear, NO corregir erratas

import type { DiatonicDegree } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';

export const INTRO_LENGUAS = "Para comprender este tema utilizaremos una analogía con las diferentes lenguas del mundo, existen numerosos y vastos lenguajes, unos similares entre sí, por ejemplo: Español, Portugués, Italiano estos tres si bien es cierto no son el mismo comparten entre sí fonética, vocabulario, incluso gramática, esto gracias a compartir la misma raíz romance. Este mismo ejemplo pasa con el Alemán, Holandés, Inglés al compartir la raíz germánica, etc.";

export const INTRO_VARIEDAD = "Todo esto nos hace entender que hay mucha variedad de lenguas algunas muy distintas entre sí otras muy similares donde cambian solo los detalles, esta misma idea la aplicamos a las TONALIDADES.";

export const DEF_TONALIDADES = "Las tonalidades/lenguajes son familias de notas, en donde algunas tonalidades guardan similitud con otras, pero a su vez encontramos tonalidades muy diferentes entre sí.";

export const DEF_ARMADURA = "Cada familia/tonalidad contiene 7 notas (escala), a estas notas y sus variantes (ejemplo Db-D-D#) les conocemos como ARMADURA, en otras palabras la armadura es la cantidad de # o b que una tonalidad puede tener, a veces solo encontramos un # o puede que encontremos 5 #, de igual manera los bemoles.";

export const REGLA_NO_MEZCLA = "Cabe aclarar que los # no se combinan con los b, por lo que si la tonalidad cuenta con b no encontraremos # y viceversa.";

export const CONCLUSION_COHABITAN = "Podemos concluir que la armadura describe a la tonalidad, y la tonalidad cuenta con una armadura específica, o sea estos dos términos cohabitan y se referencian uno a otro.";

export const HERRAMIENTA_INTRO = "En esta caja podemos encontrar el orden específico, acumulativo y multitonal en el que podemos construir todas las armaduras.";

export const HERRAMIENTA_NOTAS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const;
export const HERRAMIENTA_SOSTENIDOS = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] as const;
export const HERRAMIENTA_BEMOLES = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] as const;

export const HERRAMIENTA_SOSTENIDOS_EXPLICACION = "Si vamos de izquierda a derecha, a cada nota le añadimos el #. Podríamos decir también que todas las tonalidades con # utilizan la herramienta.";

export const HERRAMIENTA_BEMOLES_EXPLICACION = "Si vamos de derecha a izquierda, a cada nota le añadimos el b. Podríamos decir también que todas las tonalidades con b utilizan la herramienta.";

export const PROPIEDAD_ESPECIFICO = "Específico porque siempre seguiremos el mismo orden. Ejemplo: F# C# G# — Ejemplo: Bb Eb Ab Db";

export const PROPIEDAD_ACUMULATIVO = "Acumulativo porque sumamos una alteración más, manteniendo la anterior. Ejemplo: una armadura con 4# siempre tendrá F# C# G# D#, dado que son los primeros 4# de la herramienta, y así mismo las tonalidades con b.";

export const PROPIEDAD_MULTITONAL = "Multitonal porque esta herramienta se aplica para todas las tonalidades existentes.";

export const CONSEJO_MEMORIZAR = "Consejo: memorizar en ambos sentidos, dado que utilizamos siempre esta herramienta.";

export const TITULO_SOSTENIDOS = "Tonalidades MAYORES con # (F# C# G# D# A# E# B#)";

export const SOSTENIDOS_IZQ_TITULO = "¿Cómo saber la armadura partiendo de la tonalidad?";
export const SOSTENIDOS_IZQ_PASOS = [
  "1. Partiendo de E mayor, bajamos una 2m (1s.t.) de la tónica E = D#",
  "2. Acumulamos los # hasta llegar a la nota que encontramos (D#) = F# C# G# D#",
  "3. Escribimos las 7 notas naturales comenzando en la tónica E = E F G A B C D",
  "4. Actualizamos dicha escala con las notas del punto 2 → E F# G# A B C# D#",
] as const;

export const SOSTENIDOS_DER_TITULO = "¿Cómo saber la tonalidad partiendo de la armadura?";
export const SOSTENIDOS_DER_PASOS = [
  "1. Tenemos la armadura F# C# G# D#, vamos al último # de la armadura en cuestión = D#",
  "2. Subimos una 2m (1s.t.) a D# = E",
  "3. Así sabremos quién es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica E",
  "4. Actualizamos dicha escala con la armadura del punto 1 → E F# G# A B C# D#",
] as const;

export const SOSTENIDOS_CIERRE = "Concluimos que la armadura de E mayor es F# C# G# D#. La escala o tonalidad (7 notas) de E mayor es E F# G# A B C# D#";

export const TITULO_BEMOLES = "Tonalidades MAYORES con b (Bb Eb Ab Db Gb Cb Fb)";

export const BEMOLES_IZQ_TITULO = "¿Cómo saber la armadura partiendo de la tonalidad?";
export const BEMOLES_IZQ_PASOS = [
  "1. Partiendo de Eb mayor, buscamos la tónica Eb en la herramienta Bb Eb Ab Db Gb Cb Fb",
  "2. Nos movemos un b más (Ab) y escribimos los b encontrados = Bb Eb Ab",
  "3. Escribimos las 7 notas naturales comenzando en la tónica E = E F G A B C D",
  "4. Actualizamos dicha escala con las notas del punto 2 → Eb F G Ab Bb C D",
] as const;

export const BEMOLES_DER_TITULO = "¿Cómo saber la tonalidad partiendo de la armadura?";
export const BEMOLES_DER_PASOS = [
  "1. Tenemos la armadura Bb Eb Ab, buscamos el penúltimo b de la armadura en cuestión.",
  "2. Esa es nuestra tónica = Eb mayor",
  "3. Sabiendo quién es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica E",
  "4. Actualizamos dicha escala con la armadura del punto 1 → Eb F G Ab Bb C D",
] as const;

export const BEMOLES_CIERRE = "Concluimos que la armadura de Eb mayor es Bb Eb Ab. La escala o tonalidad (7 notas) de Eb mayor es Eb F G Ab Bb C D";

export const EXCEPCION_F_COMPLETA = "Existe una excepción a este proceso en donde no aplican los pasos anteriormente vistos, por lo que procederemos a memorizar dicha excepción. Para la tonalidad de F mayor, al no existir un \"penúltimo bemol\", no aplican los pasos anteriores, esta tonalidad solo cuenta con el primer b de la herramienta, o sea Bb. En un contexto de música popular/rock, lo más común es trabajar únicamente con la columna izquierda (partiendo de la tonalidad) ya que es la información que tenemos más a la mano, dado que la columna de la derecha se emplea mayormente en la música académica (partitura), donde encontramos en el pentagrama al inicio de la obra, la armadura en cuestión, por lo que nosotros debemos descifrar la tonalidad en la que estamos tocando. Consejo: probar estos pasos con las 12 tónicas existentes. Podríamos concluir que la armadura de F mayor es solo Bb, y la escala es F G A Bb C D E";

export const OBSERVACION_TONICAS_NATURALES = "Un dato curioso, es que en la mayoría de tonalidades mayores con #, encontramos solo la nota natural como tónica, ejemplo: G, D, A, E, y B mayor.";

export const OBSERVACION_TONICAS_BEMOL = "Al contrario, en las tonalidades con b encontramos que casi todas las tónicas contienen el b en su nombre, ejemplo: Bb, Eb, Ab, Db, Gb, y Cb mayor, con la excepción de F que es solo la nota natural.";

export const OBSERVACION_UTILIDAD = "Esto nos ayuda a saber con qué alteración y proceso trabajamos en dicha tonalidad.";

export const TABLA_MAESTRA_INTRO = "Para ayudar a comprobar si el proceso es correcto, acá una tabla con todas las tonalidades mayores existentes.";

// === §4.7 Grados armónicos según la escala mayor ===

export const GRADOS_INTRO_SIMETRIA = "La música funciona con fórmulas: 12 semitonos, 12 intervalos, escalas de 7 notas, tríadas de 3 notas. Estos procesos son simétricos en todas las tonalidades; por eso conviene memorizar el procedimiento, no el resultado.";

export const GRADOS_INTRO_FRACTAL = "También funciona en fractal: lo que sirve en lo micro sirve en lo macro. Si la escala tiene 7 notas, la armonía tiene 7 acordes (uno por cada nota). Cada nota se convierte en un acorde construyendo la tríada sobre ella.";

export const GRADOS_PROCEDIMIENTO_TITULO = "Procedimiento para encontrar los grados armónicos";

export const GRADOS_PROCEDIMIENTO_PASOS = [
  "Pensar cada nota de la escala como tríada. Por ahora solo escribimos las letras (sin armadura).",
  "Actualizar las tríadas con la armadura de la tonalidad.",
  "Tocar cada acorde y oír su carácter: brillante (mayor) u oscuro (menor).",
] as const;

export const GRADOS_PRIMITIVA_INSTRUCCION = "Cambia de paso para ver cómo se transforma la tabla. En el último paso, haz clic sobre cada acorde para escucharlo.";

export const GRADOS_PATRON = "El resultado es siempre el mismo patrón de calidades: M m m M M m dim. Tres mayores (I, IV, V), tres menores (ii, iii, vi), uno disminuido (vii°). Este patrón se memoriza porque se repite idéntico en todas las tonalidades mayores.";

export const GRADOS_NOMBRE_CARACTER_TITULO = "Nombre y carácter de cada grado";

export const GRADOS_NOMBRE_CARACTER = [
  { roman: 'I',    nombre: 'Tónica',         caracter: 'Estable' },
  { roman: 'ii',   nombre: 'Supertónica',    caracter: 'Medio' },
  { roman: 'iii',  nombre: 'Mediante',       caracter: 'Estable-Medio' },
  { roman: 'IV',   nombre: 'Subdominante',   caracter: 'Medio-tenso' },
  { roman: 'V',    nombre: 'Dominante',      caracter: 'Tenso' },
  { roman: 'vi',   nombre: 'Superdominante', caracter: 'Estable' },
  { roman: 'vii°', nombre: 'Sensible',       caracter: 'Tenso' },
] as const;

export const GRADOS_ANALISIS_ESTABLES = "Los grados estables (I, vi) tienen la T y la 3ra de la tonalidad como notas constituyentes. El iii también tiene dos estables, pero al contener la sensible tonal queda con color medio.";

export const GRADOS_ANALISIS_TENSOS = "Los tensos (V, vii°) contienen la 7ma y la 4ta de la escala (sensible tonal y modal).";

export const GRADOS_ANALISIS_MEDIOS = "Los medios (ii, IV) no tienen la sensible tonal pero sí la 4ta (sensible modal).";

export const GRADOS_ANALISIS_IV = "Sobre el IV grado: es ambivalente. Tiene la T (la nota más estable) y la 4ta (sensible modal). Como la 4ta tiende hacia la 3ra por estar a 1 s.t., el IV grado tiene carácter medio y tenso al mismo tiempo, y puede resolver directamente a un acorde estable.";

export const GRADOS_CONSEJO = "Memorizar el patrón M m m M M m dim. Se repite idéntico en cualquier tonalidad mayor: la simetría que justifica aprenderlo una sola vez.";

// === §4.8 Progresiones armónicas ===

export const PROGRESIONES_INTRO = "La armonía diatónica no solo ofrece acordes individuales: también permite combinarlos en secuencias. A estas secuencias se les llama progresiones armónicas. Cada acorde cumple una función dentro de la tonalidad y contribuye a crear tensión o reposo.";

export const PROGRESIONES_PROCEDIMIENTO_TITULO = "Práctica progresiva";

export const PROGRESIONES_PROCEDIMIENTO_PASOS: readonly string[] = [
  "Tocamos el I: ahí es donde el oído quiere reposar y resolver. Repetirlo hasta acostumbrarse.",
  "Tocamos el V (segundo en importancia): su tensión crea movimiento. Conectarlo con el I.",
  "Tocamos el IV, resolvemos al I, o lo seguimos de un V-I.",
] as const;

export const PROGRESIONES_PRIMITIVA_INSTRUCCION = "Toca cada progresión sobre la tónica activa.";

export const PROGRESIONES_DATA: ReadonlyArray<{
  id: string;
  label: string;
  grados: ReadonlyArray<DiatonicDegree>;
}> = [
  { id: 'p1',  label: '1',  grados: ['I', 'V', 'I'] },
  { id: 'p2a', label: '2a', grados: ['IV', 'I'] },
  { id: 'p2b', label: '2b', grados: ['IV', 'V', 'I'] },
  { id: 'p3',  label: '3',  grados: ['ii', 'V', 'I'] },
  { id: 'p4',  label: '4',  grados: ['I', 'V', 'vi', 'IV'] },
  { id: 'p5',  label: '5',  grados: ['I', 'iii', 'vi', 'IV'] },
];

export const PROGRESIONES_CONSEJO = "Consejo: intente experimentar y crear progresiones más largas, siempre teniendo en cuenta la resolución hacia un acorde estable.";

// === §4.9 Relativas menores ===

export const RELATIVAS_INTRO: readonly ProseSegment[] = [
  [
    { type: 'text', value: 'Toda tonalidad mayor tiene una tonalidad menor relativa que comparte exactamente la misma armadura. La relativa menor se construye sobre el vi grado de la mayor.' },
  ],
  [
    { type: 'text', value: 'La escala menor natural usa las mismas 7 notas, pero comienza en la 6ta. Los acordes son los mismos en ambos casos, solo cambia el orden: en ' },
    { type: 'note', value: 'C' },
    { type: 'text', value: ' mayor → C Dm Em F G Am B°; en ' },
    { type: 'note', value: 'A' },
    { type: 'text', value: ' menor → Am B° C Dm Em F G.' },
  ],
] as const;

export const RELATIVAS_PROCESO: readonly string[] = [
  'Mayor → menor: bajamos 3 semitonos desde la tónica mayor.',
  'Menor → mayor: subimos 3 semitonos desde la tónica menor.',
] as const;

export const RELATIVAS_RULE_NOTE = 'Regla de los 3 semitonos: toda relativa menor está exactamente 3 semitonos por debajo de la tónica mayor. A la inversa, la mayor está 3 semitonos por encima de la menor.';

export const RELATIVAS_TABLA_HEADERS: readonly [string, string, string] = [
  'Tonalidad mayor',
  'Relativa menor',
  'Armadura compartida',
] as const;

// ============================================================
// Variantes _DE — contenido en alemán para bifurcación i18n
// ============================================================

export const RELATIVAS_INTRO_DE: readonly ProseSegment[] = [
  [
    { type: 'text', value: 'Jede Durtonart hat eine Moll-Paralleltonart, die genau dieselben Vorzeichen teilt. Die Paralleltonart wird auf der 6. Stufe der Durtonart aufgebaut.' },
  ],
  [
    { type: 'text', value: 'Die natürliche Molltonleiter wird mit denselben 7 Tönen der Durtonleiter gebildet, beginnt aber auf dem 6. Ton. Die sieben Akkorde sind in beiden Fällen dieselben — nur die Reihenfolge ändert sich: in ' },
    { type: 'note', value: 'C' },
    { type: 'text', value: ' Dur → C Dm Em F G Am B°; in ' },
    { type: 'note', value: 'A' },
    { type: 'text', value: ' Moll → Am B° C Dm Em F G.' },
  ],
] as const;
