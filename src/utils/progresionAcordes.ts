import { Note, Chord } from 'tonal';
// Extensiones .ts explícitas a propósito: son las que permiten que
// `scripts/verify-progresion-acordes.ts` cargue este archivo desde Node con
// --experimental-strip-types. `allowImportingTsExtensions` ya está activo en
// tsconfig.app.json y Vite las resuelve sin problema.
import {
  majorScaleSpelled,
  relativeMinorScaleSpelled,
  spelledSequenceAscending,
} from './noteCalculations.ts';
import type { ChromaticNote, Tonic } from '../types/music';
import {
  calidadesDe,
  gradosDe,
  rolDe,
  type Calidad,
  type GradoDiatonico,
  type GradoId,
  type Modo,
  type RolArmonico,
} from './progresionArmonica.ts';

export interface Armadura {
  id: string;
  alteraciones: number;
  tipo: 'sostenido' | 'bemol';
  /** Tónica mayor, en grafía ASCII (la que consume `tonal`). */
  mayor: Tonic;
  /** Relativa menor, sin la "m" — 'F#' para F♯m. */
  menor: Tonic;
}

// Las 14 armaduras seleccionables. Cb mayor (7♭) queda fuera a propósito: el
// tipo `Tonic` no la cubre (no está entre las 5 enarmonías bemol del método), y
// su enarmónica B mayor ya está disponible en 5♯.
export const ARMADURAS: Armadura[] = [
  { id: 'C',  alteraciones: 0, tipo: 'sostenido', mayor: 'C',  menor: 'A'  },
  { id: 'G',  alteraciones: 1, tipo: 'sostenido', mayor: 'G',  menor: 'E'  },
  { id: 'D',  alteraciones: 2, tipo: 'sostenido', mayor: 'D',  menor: 'B'  },
  { id: 'A',  alteraciones: 3, tipo: 'sostenido', mayor: 'A',  menor: 'F#' },
  { id: 'E',  alteraciones: 4, tipo: 'sostenido', mayor: 'E',  menor: 'C#' },
  { id: 'B',  alteraciones: 5, tipo: 'sostenido', mayor: 'B',  menor: 'G#' },
  { id: 'F#', alteraciones: 6, tipo: 'sostenido', mayor: 'F#', menor: 'D#' },
  { id: 'C#', alteraciones: 7, tipo: 'sostenido', mayor: 'C#', menor: 'A#' },
  { id: 'F',  alteraciones: 1, tipo: 'bemol',     mayor: 'F',  menor: 'D'  },
  { id: 'Bb', alteraciones: 2, tipo: 'bemol',     mayor: 'Bb', menor: 'G'  },
  { id: 'Eb', alteraciones: 3, tipo: 'bemol',     mayor: 'Eb', menor: 'C'  },
  { id: 'Ab', alteraciones: 4, tipo: 'bemol',     mayor: 'Ab', menor: 'F'  },
  { id: 'Db', alteraciones: 5, tipo: 'bemol',     mayor: 'Db', menor: 'Bb' },
  { id: 'Gb', alteraciones: 6, tipo: 'bemol',     mayor: 'Gb', menor: 'Eb' },
];

export function armaduraPorId(id: string): Armadura {
  const a = ARMADURAS.find((x) => x.id === id);
  if (!a) throw new Error(`Armadura desconocida: ${id}`);
  return a;
}

const ASCII = (s: string) => s.replace(/x/g, '##').replace(/♯/g, '#').replace(/♭/g, 'b');
// El doble sostenido se escribe 'x', no '♯♯': es la convención que ya fija
// noteCalculations (`diff === 2 → "x"`, documentada en ChordMember como
// "Cx"). Sin este caso, el reemplazo global de '#' produciría 'F♯♯dim' donde
// el resto de la app muestra 'Fxdim'. Alcanzable en Do♯ mayor (7♯): las
// tonizaciones ii/iii y ii/v caen ahí.
const GLIFO = (s: string) => s.replace(/##/g, 'x').replace(/#/g, '♯').replace(/b/g, '♭');

/** Etiqueta de la tonalidad tal como se muestra: 'A' o 'F♯m'. */
export function etiquetaTonalidad(armadura: Armadura, modo: Modo): string {
  return modo === 'mayor' ? GLIFO(armadura.mayor) : `${GLIFO(armadura.menor)}m`;
}

export interface AcordeSonante {
  /** Lo que se muestra como cifrado: 'A♭maj7', 'D7'. */
  cifrado: string;
  /** El romano tal como se colocó: 'ii', 'V/vi'. */
  roman: GradoId;
  rol: RolArmonico;
  notas: { chromatic: ChromaticNote; octave: number }[];
}

// `dominante` distingue, entre los triadas mayores (calidad 'M'), cuáles
// funcionan como dominante diatónica (V en mayor, ♭VII en menor natural: 7ma
// menor sobre la raíz) de las que son tónica/subdominante (I, IV, ♭III, ♭VI:
// 7ma mayor). La calidad de la tríada sola no alcanza para distinguirlas.
function sufijo(calidad: Calidad, septimas: boolean, dominante = false): string {
  if (calidad === 'M') {
    if (!septimas) return '';
    return dominante ? '7' : 'maj7';
  }
  if (calidad === 'm') return septimas ? 'm7' : 'm';
  return septimas ? 'm7b5' : 'dim';
}

// Las raíces diatónicas del modo activo, en ASCII para `tonal`. En modo menor
// se lee la RELATIVA de la armadura (no la paralela) — misma decisión que §3.9.
function raicesDe(armadura: Armadura, modo: Modo): string[] {
  const escala =
    modo === 'mayor' ? majorScaleSpelled(armadura.mayor) : relativeMinorScaleSpelled(armadura.mayor);
  return escala.map(ASCII);
}

export function acordeDeGrado(
  armadura: Armadura,
  modo: Modo,
  id: GradoId,
  septimas: boolean,
): AcordeSonante {
  const raices = raicesDe(armadura, modo);
  const grados = gradosDe(modo);
  const calidades = calidadesDe(modo);

  let nombre: string;

  if (id.includes('/')) {
    const [funcion, destino] = id.split('/') as ['V' | 'ii', GradoDiatonico];
    const j = grados.indexOf(destino);
    const raizDestino = raices[j];

    if (funcion === 'V') {
      // El V de x: quinta justa sobre la raíz de x. SIEMPRE dominante con
      // séptima, aunque el banco esté en tríadas — así se enseñó en §3.8, y sin
      // la 7ª una dominante secundaria es solo un acorde mayor y pierde el punto.
      nombre = `${ASCII(Note.transpose(raizDestino, '5P'))}7`;
    } else {
      // El ii de x: segunda mayor sobre la raíz de x. Si x es mayor su ii es
      // menor (m7); si x es menor su ii es semidisminuido (m7♭5). Son los dos
      // escenarios de §3.8.
      const raiz = ASCII(Note.transpose(raizDestino, '2M'));
      nombre = raiz + sufijo(calidades[j] === 'm' ? 'dim' : 'm', septimas);
    }
  } else {
    const i = grados.indexOf(id as GradoDiatonico);
    const raiz = raices[i];
    // La 7ma diatónica: la raíz del grado que queda una tercera abajo,
    // leída en la misma escala (i.e. una séptima arriba de la raíz).
    const septimoDiatonico = raices[(i + 6) % 7];
    const distSeptima =
      ((Note.chroma(septimoDiatonico) ?? 0) - (Note.chroma(raiz) ?? 0) + 12) % 12;
    nombre = raiz + sufijo(calidades[i], septimas, distSeptima === 10);
  }

  const seq = spelledSequenceAscending(Chord.get(nombre).notes, 4);
  return {
    cifrado: GLIFO(nombre),
    roman: id,
    rol: rolDe(modo, id),
    notas: seq.map((s) => ({ chromatic: s.name, octave: s.octave })),
  };
}
