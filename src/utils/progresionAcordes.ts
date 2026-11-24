import { Note, Chord } from 'tonal';
// Extensiones .ts explícitas a propósito: son las que permiten que
// `scripts/verify-progresion-acordes.ts` cargue este archivo desde Node con
// --experimental-strip-types. `allowImportingTsExtensions` ya está activo en
// tsconfig.app.json y Vite las resuelve sin problema.
import {
  formatChordSymbol,
  harmonicMinorScaleSpelled,
  majorScaleSpelled,
  relativeMinorScaleSpelled,
  spelledSequenceAscending,
} from './noteCalculations.ts';
import type { ChromaticNote, Tonic } from '../types/music';
import {
  calidadesDe,
  esGradoArmonico,
  gradosDe,
  rolDe,
  type Calidad,
  type GradoDiatonico,
  type GradoId,
  type Modo,
  type RolArmonico,
  type Slot,
  type Sus,
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
// Los cifrados se guardan con glifos en español (`formatChordSymbol`, que
// escribe el doble sostenido 'x': 'Fxdim', alcanzable en Do♯ mayor); el alemán
// se aplica al mostrarlos.

/** Etiqueta de la tonalidad tal como se muestra: 'A' o 'F♯m'. */
export function etiquetaTonalidad(armadura: Armadura, modo: Modo): string {
  return formatChordSymbol(modo === 'mayor' ? armadura.mayor : `${armadura.menor}m`, 'es');
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

// Raíz (ASCII) y calidad de un grado del banco. En menor, V y vii° salen de
// la menor armónica: la sensible subida los vuelve mayor y disminuido.
function raizDeGrado(armadura: Armadura, modo: Modo, grado: GradoDiatonico): { raiz: string; calidad: Calidad } {
  if (esGradoArmonico(modo, grado)) {
    const escala = harmonicMinorScaleSpelled(armadura.mayor).map(ASCII);
    return grado === 'V' ? { raiz: escala[4], calidad: 'M' } : { raiz: escala[6], calidad: 'dim' };
  }
  const i = gradosDe(modo).indexOf(grado);
  return { raiz: raicesDe(armadura, modo)[i], calidad: calidadesDe(modo)[i] };
}

export function acordeDeGrado({
  armadura,
  modo,
  id,
  septimas,
  sus,
}: {
  armadura: Armadura;
  modo: Modo;
  id: GradoId;
  septimas: boolean;
  sus?: Sus;
}): AcordeSonante {
  const raices = raicesDe(armadura, modo);
  const grados = gradosDe(modo);
  const calidades = calidadesDe(modo);

  let nombre: string;

  if (id.includes('/')) {
    const [funcion, destino] = id.split('/') as ['V' | 'ii', GradoDiatonico];
    const { raiz: raizDestino, calidad: calidadDestino } = raizDeGrado(armadura, modo, destino);

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
      nombre = raiz + sufijo(calidadDestino === 'm' ? 'dim' : 'm', septimas);
    }
  } else if (esGradoArmonico(modo, id)) {
    // V y vii° de la menor armónica: con séptimas son el dominante 7 y el
    // disminuido completo (dim7), no el semidisminuido.
    const { raiz, calidad } = raizDeGrado(armadura, modo, id as GradoDiatonico);
    nombre = calidad === 'M' ? raiz + (septimas ? '7' : '') : raiz + (septimas ? 'dim7' : 'dim');
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

  const base = Chord.get(nombre).notes;
  const { notas, cifrado } = sus ? suspender(base, sus) : { notas: base, cifrado: nombre };
  const seq = spelledSequenceAscending(notas, 4);
  return {
    cifrado: formatChordSymbol(cifrado, 'es'),
    roman: id,
    rol: rolDe(modo, id),
    notas: seq.map((s) => ({ chromatic: s.name, octave: s.octave })),
  };
}

// sus2 / sus4 por intervalos sobre el acorde ya resuelto: la 3ª se cambia por
// la 2M o la 4J de la fundamental y la 7ª se conserva. No se le pide el nombre
// a `tonal` porque no conoce G7sus2 ni Dm7sus4 (los devuelve vacíos). Sin 3ª
// no hay calidad: Dm7 + sus4 se escribe D7sus4; la 7M se nombra maj7.
function suspender(notas: string[], sus: Sus): { notas: string[]; cifrado: string } {
  const [raiz, , quinta, septima] = notas;
  const nueva = Note.transpose(raiz, sus === 'sus2' ? '2M' : '4P');
  if (!septima) return { notas: [raiz, nueva, quinta], cifrado: raiz + sus };
  const septimaMayor = ((Note.chroma(septima) ?? 0) - (Note.chroma(raiz) ?? 0) + 12) % 12 === 11;
  return {
    notas: [raiz, nueva, quinta, septima],
    cifrado: raiz + (septimaMayor ? 'maj7' : '7') + sus,
  };
}

// El acorde de una casilla colocada: se resuelve en la tonalidad en la que se
// colocó, no en la activa (modulación, reunión 19/10/26).
export function acordeDeSlot(slot: NonNullable<Slot>): AcordeSonante {
  return acordeDeGrado({
    armadura: armaduraPorId(slot.tonalidad.armaduraId),
    modo: slot.tonalidad.modo,
    id: slot.degree,
    septimas: slot.septima ?? false,
    sus: slot.sus,
  });
}
