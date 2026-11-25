import { ALL } from '../data/notes.ts';
import type { ChromaticNote } from '../types/music';

// Conducción de voces en las progresiones (reunión 22/11/26, #26; mensaje del
// profesor del 24/11/26): bajo en la fundamental una octava por debajo de las
// voces superiores; arriba, la tríada o tétrada en la inversión que menos se
// mueve respecto del acorde anterior. Mantener notas comunes y evitar saltos
// grandes salen de esa misma medida. Las quintas y octavas paralelas no se
// filtran, por pedido explícito del profesor.

export interface NotaSonante {
  chromatic: ChromaticNote;
  octave: number;
}

export interface Disposicion {
  bajo: NotaSonante;
  /** Voces superiores de grave a agudo. */
  voces: NotaSonante[];
}

/** Recorre la progresión. Cada acorde llega con la fundamental primero. */
export function conducirVoces(acordes: ChromaticNote[][], octava: number): Disposicion[] {
  let anterior: number[] | null = null;
  return acordes.map((notas) => {
    const bajo = midiDe(notas[0], octava - 1);
    const voces: number[] = elegirDisposicion(anterior, candidatos(notas, octava));
    anterior = voces;
    return { bajo: notaDe(bajo), voces: voces.map(notaDe) };
  });
}

/**
 * Las voces superiores en posición fundamental y en cada inversión, empezando
 * en la octava global o en la de abajo; solo las que quedan por encima del bajo.
 * La primera es la posición fundamental en la octava global.
 */
export function candidatos(notas: ChromaticNote[], octava: number): number[][] {
  const bajo = midiDe(notas[0], octava - 1);
  const todos: number[][] = [];
  for (const inicio of [octava, octava - 1]) {
    notas.forEach((_, inversion) => {
      const orden = [...notas.slice(inversion), ...notas.slice(0, inversion)];
      todos.push(ascendenteDesde(orden, inicio));
    });
  }
  return todos.filter((voces) => voces[0] > bajo);
}

/**
 * La disposición con menor movimiento total contra el acorde anterior. Sin
 * anterior, la primera (posición fundamental). A igual movimiento, la más
 * grave: así la progresión no se va subiendo de registro.
 */
export function elegirDisposicion(anterior: number[] | null, opciones: number[][]): number[] {
  if (!anterior) return opciones[0];
  const costo = (voces: number[]) => movimiento(anterior, voces) * 1000 + suma(voces);
  return opciones.reduce((mejor, voces) => (costo(voces) < costo(mejor) ? voces : mejor));
}

// Con distinta cantidad de voces (tríada → tétrada), cada voz nueva se mide
// contra la voz anterior más cercana.
function movimiento(anterior: number[], voces: number[]): number {
  return voces.reduce((total, v, i) => {
    const previa = anterior[i] ?? anterior[anterior.length - 1];
    return total + Math.abs(v - previa);
  }, 0);
}

function suma(voces: number[]): number {
  return voces.reduce((a, b) => a + b, 0);
}

function ascendenteDesde(orden: ChromaticNote[], octava: number): number[] {
  const voces: number[] = [];
  orden.forEach((nota) => {
    let m = midiDe(nota, octava);
    while (voces.length > 0 && m <= voces[voces.length - 1]) m += 12;
    voces.push(m);
  });
  return voces;
}

function midiDe(nota: ChromaticNote, octava: number): number {
  return (octava + 1) * 12 + ALL.indexOf(nota);
}

function notaDe(midi: number): NotaSonante {
  return { chromatic: ALL[midi % 12], octave: Math.floor(midi / 12) - 1 };
}
