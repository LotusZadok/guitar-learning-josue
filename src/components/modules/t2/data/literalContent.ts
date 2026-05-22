// Contenido literal del método de Josué Barquero — NO parafrasear, NO corregir erratas

import type { DiatonicDegree } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';

export const INTRO_LENGUAS = "Para comprender este tema utilizaremos una analogía con las diferentes lenguas del mundo, existen numerosos y vastos lenguajes, unos similares entre sí, por ejemplo: Español, Portugués, Italiano estos tres si bien es cierto no son el mismo comparten entre sí fonética, vocabulario, incluso gramática, esto gracias a compartir la misma raíz romance. Este mismo ejemplo pasa con el Alemán, Holandés, Inglés al compartir la raíz germánica, etc.";

export const INTRO_VARIEDAD = "Todo esto nos hace entender que hay mucha variedad de lenguas algunas muy distintas entre sí otras muy similares donde cambian solo los detalles, esta misma idea la aplicamos a las TONALIDADES.";

export const DEF_TONALIDADES = "Las tonalidades/lenguajes son familias de notas, en donde algunas tonalidades guardan similitud con otras, pero a su vez encontramos tonalidades muy diferentes entre sí.";

export const DEF_ARMADURA = "Cada familia/tonalidad contiene 7 notas (escala), a estas notas y sus variantes (ejemplo D♭-D-D#) les conocemos como ARMADURA, en otras palabras la armadura es la cantidad de # o ♭ que una tonalidad puede tener, a veces solo encontramos un # o puede que encontremos 5 #, de igual manera los bemoles.";

export const REGLA_NO_MEZCLA = "Cabe aclarar que los # no se combinan con los ♭, por lo que si la tonalidad cuenta con ♭ no encontraremos # y viceversa.";

export const CONCLUSION_COHABITAN = "Podemos concluir que la armadura describe a la tonalidad, y la tonalidad cuenta con una armadura específica, o sea estos dos términos cohabitan y se referencian uno a otro.";

export const HERRAMIENTA_INTRO = "En esta caja podemos encontrar el orden específico, acumulativo y multitonal en el que podemos construir todas las armaduras.";

export const HERRAMIENTA_NOTAS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const;
export const HERRAMIENTA_SOSTENIDOS = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] as const;
export const HERRAMIENTA_BEMOLES = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] as const;

export const HERRAMIENTA_SOSTENIDOS_EXPLICACION = "Si vamos de izquierda a derecha, a cada nota le añadimos el #. Podríamos decir también que todas las tonalidades con # utilizan la herramienta.";

export const HERRAMIENTA_BEMOLES_EXPLICACION = "Si vamos de derecha a izquierda, a cada nota le añadimos el ♭. Podríamos decir también que todas las tonalidades con ♭ utilizan la herramienta.";

export const PROPIEDAD_ESPECIFICO = "Específico porque siempre seguiremos el mismo orden. Ejemplo: F# C# G# — Ejemplo: B♭ E♭ A♭ D♭";

export const PROPIEDAD_ACUMULATIVO = "Acumulativo porque sumamos una alteración más, manteniendo la anterior. Ejemplo: una armadura con 4# siempre tendrá F# C# G# D#, dado que son los primeros 4# de la herramienta, y así mismo las tonalidades con ♭.";

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

export const TITULO_BEMOLES = "Tonalidades MAYORES con ♭ (B♭ E♭ A♭ D♭ G♭ C♭ F♭)";

export const BEMOLES_IZQ_TITULO = "¿Cómo saber la armadura partiendo de la tonalidad?";
export const BEMOLES_IZQ_PASOS = [
  "1. Partiendo de Eb mayor, buscamos la tónica E♭ en la herramienta B♭ E♭ A♭ D♭ G♭ C♭ F♭",
  "2. Nos movemos un ♭ más (A♭) y escribimos los ♭ encontrados = B♭ E♭ A♭",
  "3. Escribimos las 7 notas naturales comenzando en la tónica E = E F G A B C D",
  "4. Actualizamos dicha escala con las notas del punto 2 → E♭ F G A♭ B♭ C D",
] as const;

export const BEMOLES_DER_TITULO = "¿Cómo saber la tonalidad partiendo de la armadura?";
export const BEMOLES_DER_PASOS = [
  "1. Tenemos la armadura B♭ E♭ A♭, buscamos el penúltimo ♭ de la armadura en cuestión.",
  "2. Esa es nuestra tónica = E♭ mayor",
  "3. Sabiendo quién es la tónica de nuestra tonalidad, ordenamos las 7 notas naturales partiendo de la tónica E",
  "4. Actualizamos dicha escala con la armadura del punto 1 → E♭ F G A♭ B♭ C D",
] as const;

export const BEMOLES_CIERRE = "Concluimos que la armadura de E♭ mayor es B♭ E♭ A♭. La escala o tonalidad (7 notas) de E♭ mayor es E♭ F G A♭ B♭ C D";

export const EXCEPCION_F_COMPLETA = "Existe una excepción a este proceso en donde no aplican los pasos anteriormente vistos, por lo que procederemos a memorizar dicha excepción. Para la tonalidad de F mayor, al no existir un \"penúltimo bemol\", no aplican los pasos anteriores, esta tonalidad solo cuenta con el primer ♭ de la herramienta, o sea B♭. En un contexto de música popular/rock, lo más común es trabajar únicamente con la columna izquierda (partiendo de la tonalidad) ya que es la información que tenemos más a la mano, dado que la columna de la derecha se emplea mayormente en la música académica (partitura), donde encontramos en el pentagrama al inicio de la obra, la armadura en cuestión, por lo que nosotros debemos descifrar la tonalidad en la que estamos tocando. Consejo: probar estos pasos con las 12 tónicas existentes. Podríamos concluir que la armadura de F mayor es solo B♭, y la escala es F G A B♭ C D E";

export const OBSERVACION_TONICAS_NATURALES = "Un dato curioso, es que en la mayoría de tonalidades mayores con #, encontramos solo la nota natural como tónica, ejemplo: G, D, A, E, y B mayor.";

export const OBSERVACION_TONICAS_BEMOL = "Al contrario, en las tonalidades con ♭ encontramos que casi todas las tónicas contienen el ♭ en su nombre, ejemplo: B♭, E♭, A♭, D♭, G♭, y C♭ mayor, con la excepción de F que es solo la nota natural.";

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

// — Tonarten & Vorzeichen (Einführung) —

export const INTRO_LENGUAS_DE = "Um dieses Thema zu verstehen, verwenden wir eine Analogie zu den verschiedenen Sprachen der Welt. Es gibt zahlreiche und vielfältige Sprachen, einige einander ähnlich, zum Beispiel: Spanisch, Portugiesisch, Italienisch — diese drei sind zwar nicht dieselbe Sprache, teilen aber Phonetik, Wortschatz und sogar Grammatik, dank derselben romanischen Wurzel. Dasselbe Beispiel gilt für Deutsch, Niederländisch und Englisch, die die germanische Wurzel teilen, usw.";

export const INTRO_VARIEDAD_DE = "All das lässt uns verstehen, dass es eine große Vielfalt an Sprachen gibt — einige sehr unterschiedlich, andere sehr ähnlich, bei denen sich nur die Details unterscheiden. Dieselbe Idee wenden wir auf die TONARTEN an.";

export const DEF_TONALIDADES_DE = "Die Tonarten/Sprachen sind Tonfamilien, wobei einige Tonarten anderen ähnlich sind, andere wiederum sich stark voneinander unterscheiden.";

export const DEF_ARMADURA_DE = "Jede Familie/Tonart enthält 7 Töne (Tonleiter); diese Töne und ihre Varianten (Beispiel D♭-D-D#) nennen wir VORZEICHEN — anders gesagt, die Vorzeichen sind die Anzahl der # oder ♭, die eine Tonart haben kann; manchmal finden wir nur ein #, oder bis zu 5 #, ebenso bei den B-Vorzeichen.";

export const REGLA_NO_MEZCLA_DE = "Es ist anzumerken, dass # und ♭ nicht kombiniert werden: hat die Tonart ♭, finden wir keine #, und umgekehrt.";

export const CONCLUSION_COHABITAN_DE = "Wir können schlussfolgern: die Vorzeichen beschreiben die Tonart, und die Tonart hat spezifische Vorzeichen — diese zwei Begriffe bedingen einander und verweisen aufeinander.";

// — Werkzeug (Reihenfolge der Vorzeichen) —

export const HERRAMIENTA_INTRO_DE = "In diesem Kasten finden wir die spezifische, kumulative und multitonale Reihenfolge, mit der wir alle Vorzeichen aufbauen können.";

export const HERRAMIENTA_SOSTENIDOS_EXPLICACION_DE = "Gehen wir von links nach rechts, fügen wir jedem Ton ein # hinzu. Anders gesagt: alle Tonarten mit # nutzen dieses Werkzeug.";

export const HERRAMIENTA_BEMOLES_EXPLICACION_DE = "Gehen wir von rechts nach links, fügen wir jedem Ton ein ♭ hinzu. Anders gesagt: alle Tonarten mit ♭ nutzen dieses Werkzeug.";

export const PROPIEDAD_ESPECIFICO_DE = "Spezifisch, weil wir immer derselben Reihenfolge folgen. Beispiel: F# C# G# — Beispiel: B♭ E♭ A♭ D♭";

export const PROPIEDAD_ACUMULATIVO_DE = "Kumulativ, weil wir eine weitere Alterierung hinzufügen und die vorherige beibehalten. Beispiel: ein Vorzeichensatz mit 4# wird immer F# C# G# D# enthalten, da das die ersten 4# des Werkzeugs sind — und ebenso für Tonarten mit ♭.";

export const PROPIEDAD_MULTITONAL_DE = "Multitonal, weil dieses Werkzeug auf alle existierenden Tonarten anwendbar ist.";

export const CONSEJO_MEMORIZAR_DE = "Methodentipp: in beide Richtungen auswendig lernen, da wir dieses Werkzeug ständig verwenden.";

// — Titel der Verfahren-Sektionen —

export const TITULO_SOSTENIDOS_DE = "DUR-Tonarten mit # (F# C# G# D# A# E# B#)";
export const TITULO_BEMOLES_DE = "DUR-Tonarten mit ♭ (B♭ E♭ A♭ D♭ G♭ C♭ F♭)";

// — Verfahren # —

export const SOSTENIDOS_IZQ_TITULO_DE = "Wie ermittelt man die Vorzeichen ausgehend von der Tonart?";
export const SOSTENIDOS_IZQ_PASOS_DE = [
  "1. Ausgehend von E-Dur gehen wir eine kleine Sekunde (1 Ht.) von der Tonika E abwärts = D#",
  "2. Wir akkumulieren die # bis zum ermittelten Ton (D#) = F# C# G# D#",
  "3. Wir schreiben die 7 Stammtöne beginnend mit der Tonika E = E F G A B C D",
  "4. Wir aktualisieren diese Tonleiter mit den Tönen aus Punkt 2 → E F# G# A B C# D#",
] as const;

export const SOSTENIDOS_DER_TITULO_DE = "Wie ermittelt man die Tonart ausgehend von den Vorzeichen?";
export const SOSTENIDOS_DER_PASOS_DE = [
  "1. Wir haben die Vorzeichen F# C# G# D#; wir nehmen das letzte # der jeweiligen Vorzeichen = D#",
  "2. Wir gehen eine kleine Sekunde (1 Ht.) von D# aufwärts = E",
  "3. So kennen wir die Tonika unserer Tonart; wir ordnen die 7 Stammtöne beginnend mit der Tonika E",
  "4. Wir aktualisieren diese Tonleiter mit den Vorzeichen aus Punkt 1 → E F# G# A B C# D#",
] as const;

export const SOSTENIDOS_CIERRE_DE = "Wir schließen daraus: die Vorzeichen von E-Dur sind F# C# G# D#. Die Tonleiter (7 Töne) von E-Dur ist E F# G# A B C# D#";

// — Verfahren ♭ —

export const BEMOLES_IZQ_TITULO_DE = "Wie ermittelt man die Vorzeichen ausgehend von der Tonart?";
export const BEMOLES_IZQ_PASOS_DE = [
  "1. Ausgehend von Eb-Dur suchen wir die Tonika E♭ im Werkzeug B♭ E♭ A♭ D♭ G♭ C♭ F♭",
  "2. Wir gehen ein ♭ weiter (A♭) und schreiben die gefundenen ♭ auf = B♭ E♭ A♭",
  "3. Wir schreiben die 7 Stammtöne beginnend mit der Tonika E = E F G A B C D",
  "4. Wir aktualisieren diese Tonleiter mit den Tönen aus Punkt 2 → E♭ F G A♭ B♭ C D",
] as const;

export const BEMOLES_DER_TITULO_DE = "Wie ermittelt man die Tonart ausgehend von den Vorzeichen?";
export const BEMOLES_DER_PASOS_DE = [
  "1. Wir haben die Vorzeichen B♭ E♭ A♭ und suchen das vorletzte ♭ der jeweiligen Vorzeichen.",
  "2. Das ist unsere Tonika = E♭-Dur",
  "3. Da wir die Tonika unserer Tonart kennen, ordnen wir die 7 Stammtöne beginnend mit der Tonika E",
  "4. Wir aktualisieren diese Tonleiter mit den Vorzeichen aus Punkt 1 → E♭ F G A♭ B♭ C D",
] as const;

export const BEMOLES_CIERRE_DE = "Wir schließen daraus: die Vorzeichen von E♭-Dur sind B♭ E♭ A♭. Die Tonleiter (7 Töne) von E♭-Dur ist E♭ F G A♭ B♭ C D";

// — F-Ausnahme & Beobachtungen —

export const EXCEPCION_F_COMPLETA_DE = "Es gibt eine Ausnahme zu diesem Verfahren, bei der die zuvor gesehenen Schritte nicht gelten — daher werden wir diese Ausnahme auswendig lernen. Für die Tonart F-Dur gibt es kein „vorletztes B-Vorzeichen", daher gelten die vorherigen Schritte nicht; diese Tonart hat nur das erste ♭ des Werkzeugs, nämlich B♭. Im Kontext der Popularmusik/des Rock arbeitet man üblicherweise nur mit der linken Spalte (ausgehend von der Tonart), da das die Information ist, die uns am ehesten zur Verfügung steht; die rechte Spalte wird vor allem in der akademischen Musik (Notenschrift) verwendet, wo wir am Anfang des Stücks im Notensystem die jeweiligen Vorzeichen finden — wir müssen dann die Tonart entschlüsseln, in der wir spielen. Methodentipp: diese Schritte mit allen 12 existierenden Tonika ausprobieren. Wir könnten schlussfolgern, dass die Vorzeichen von F-Dur nur B♭ sind und die Tonleiter F G A B♭ C D E ist.";

export const OBSERVACION_TONICAS_NATURALES_DE = "Eine interessante Beobachtung: in den meisten Dur-Tonarten mit # finden wir nur den Stammton als Tonika, Beispiel: G-, D-, A-, E- und B-Dur.";

export const OBSERVACION_TONICAS_BEMOL_DE = "Im Gegensatz dazu enthält in den Tonarten mit ♭ fast jede Tonika das ♭ im Namen, Beispiel: B♭-, E♭-, A♭-, D♭-, G♭- und C♭-Dur, mit Ausnahme von F, das nur der Stammton ist.";

export const OBSERVACION_UTILIDAD_DE = "Das hilft uns zu wissen, mit welcher Alterierung und welchem Verfahren wir in der jeweiligen Tonart arbeiten.";

export const TABLA_MAESTRA_INTRO_DE = "Zur Überprüfung des Verfahrens hier eine Tabelle mit allen existierenden Dur-Tonarten.";

// — §4.7 Harmonische Stufen —

export const GRADOS_INTRO_SIMETRIA_DE = "Die Musik funktioniert mit Formeln: 12 Halbtöne, 12 Intervalle, 7-tönige Tonleitern, dreitönige Dreiklänge. Diese Vorgänge sind in allen Tonarten symmetrisch; deshalb lohnt es sich, das Verfahren auswendig zu lernen, nicht das Ergebnis.";

export const GRADOS_INTRO_FRACTAL_DE = "Es funktioniert auch fraktal: was im Kleinen gilt, gilt auch im Großen. Wenn die Tonleiter 7 Töne hat, hat die Harmonik 7 Akkorde (einen pro Ton). Jeder Ton wird zu einem Akkord, indem darauf ein Dreiklang aufgebaut wird.";

export const GRADOS_PROCEDIMIENTO_TITULO_DE = "Verfahren zum Auffinden der harmonischen Stufen";

export const GRADOS_PROCEDIMIENTO_PASOS_DE = [
  "Jeden Ton der Tonleiter als Dreiklang denken. Vorerst schreiben wir nur die Buchstaben (ohne Vorzeichen).",
  "Die Dreiklänge mit den Vorzeichen der Tonart aktualisieren.",
  "Jeden Akkord spielen und seinen Charakter hören: hell (Dur) oder dunkel (Moll).",
] as const;

export const GRADOS_PRIMITIVA_INSTRUCCION_DE = "Wechsle den Schritt, um zu sehen, wie sich die Tabelle wandelt. Im letzten Schritt klicke auf jeden Akkord, um ihn zu hören.";

export const GRADOS_PATRON_DE = "Das Ergebnis ist immer dasselbe Qualitätsmuster: M m m M M m dim. Drei Dur (I, IV, V), drei Moll (ii, iii, vi), einer vermindert (vii°). Dieses Muster lernt man auswendig, weil es sich identisch in allen Dur-Tonarten wiederholt.";

export const GRADOS_NOMBRE_CARACTER_TITULO_DE = "Name und Charakter jeder Stufe";

export const GRADOS_NOMBRE_CARACTER_DE = [
  { roman: 'I',    nombre: 'Tonika',        caracter: 'Stabil' },
  { roman: 'ii',   nombre: 'Supertonika',   caracter: 'Mittel' },
  { roman: 'iii',  nombre: 'Mediante',      caracter: 'Stabil-Mittel' },
  { roman: 'IV',   nombre: 'Subdominante',  caracter: 'Mittel-spannend' },
  { roman: 'V',    nombre: 'Dominante',     caracter: 'Spannend' },
  { roman: 'vi',   nombre: 'Superdominante',caracter: 'Stabil' },
  { roman: 'vii°', nombre: 'Leitton',       caracter: 'Spannend' },
] as const;

export const GRADOS_ANALISIS_ESTABLES_DE = "Die stabilen Stufen (I, vi) haben die Tonika und die Terz der Tonart als konstituierende Töne. Die iii hat auch zwei stabile Töne, aber da sie den tonalen Leitton enthält, hat sie einen mittleren Charakter.";

export const GRADOS_ANALISIS_TENSOS_DE = "Die spannenden Stufen (V, vii°) enthalten die 7. und die 4. Stufe der Tonleiter (tonaler und modaler Leitton).";

export const GRADOS_ANALISIS_MEDIOS_DE = "Die mittleren Stufen (ii, IV) haben den tonalen Leitton nicht, wohl aber die 4. (modaler Leitton).";

export const GRADOS_ANALISIS_IV_DE = "Zur IV. Stufe: sie ist ambivalent. Sie hat die Tonika (den stabilsten Ton) und die 4. (modaler Leitton). Da die 4. nach der 3. strebt, weil sie 1 Ht. entfernt ist, hat die IV. Stufe gleichzeitig mittleren und spannenden Charakter und kann direkt zu einem stabilen Akkord auflösen.";

export const GRADOS_CONSEJO_DE = "Das Muster M m m M M m dim auswendig lernen. Es wiederholt sich identisch in jeder Dur-Tonart: die Symmetrie rechtfertigt es, einmalig zu lernen.";

// — §4.8 Harmonische Progressionen —

export const PROGRESIONES_INTRO_DE = "Die diatonische Harmonik bietet nicht nur einzelne Akkorde: sie ermöglicht auch, diese in Sequenzen zu kombinieren. Solche Sequenzen nennt man harmonische Progressionen. Jeder Akkord erfüllt eine Funktion innerhalb der Tonart und trägt zur Erzeugung von Spannung oder Ruhe bei.";

export const PROGRESIONES_PROCEDIMIENTO_TITULO_DE = "Progressive Übung";

export const PROGRESIONES_PROCEDIMIENTO_PASOS_DE: readonly string[] = [
  "Wir spielen die I: dort möchte das Ohr ruhen und auflösen. Wiederholen, bis es sich vertraut anfühlt.",
  "Wir spielen die V (zweitwichtigste): ihre Spannung erzeugt Bewegung. Mit der I verbinden.",
  "Wir spielen die IV, lösen zur I auf oder lassen V-I folgen.",
] as const;

export const PROGRESIONES_PRIMITIVA_INSTRUCCION_DE = "Spiele jede Progression über der aktiven Tonika.";

export const PROGRESIONES_CONSEJO_DE = "Methodentipp: experimentieren und längere Progressionen entwerfen, immer mit Blick auf die Auflösung in einen stabilen Akkord.";

// — §4.9 Moll-Paralleltonarten —

export const RELATIVAS_PROCESO_DE: readonly string[] = [
  'Dur → Moll: 3 Halbtöne von der Dur-Tonika abwärts.',
  'Moll → Dur: 3 Halbtöne von der Moll-Tonika aufwärts.',
] as const;

export const RELATIVAS_RULE_NOTE_DE = 'Die 3-Halbton-Regel: jede Moll-Paralleltonart liegt genau 3 Halbtöne unter der Dur-Tonika. Umgekehrt liegt die Dur-Tonart 3 Halbtöne über der Moll-Tonart.';

export const RELATIVAS_TABLA_HEADERS_DE: readonly [string, string, string] = [
  'Dur-Tonart',
  'Moll-Paralleltonart',
  'Geteilte Vorzeichen',
] as const;
