export type TipoAlteracion = 'sostenido' | 'bemol';

export interface Tonalidad {
  id: string;
  tonica: string;
  tipo: TipoAlteracion;
  numAlteraciones: number;
  armadura: string[];
  escala: string[];
  esExcepcion: boolean;
}

export const TONALIDADES: Tonalidad[] = [
  // SOSTENIDOS
  { id: 'G',  tonica: 'G',  tipo: 'sostenido', numAlteraciones: 1, armadura: ['F#'], escala: ['G','A','B','C','D','E','F#'], esExcepcion: false },
  { id: 'D',  tonica: 'D',  tipo: 'sostenido', numAlteraciones: 2, armadura: ['F#','C#'], escala: ['D','E','F#','G','A','B','C#'], esExcepcion: false },
  { id: 'A',  tonica: 'A',  tipo: 'sostenido', numAlteraciones: 3, armadura: ['F#','C#','G#'], escala: ['A','B','C#','D','E','F#','G#'], esExcepcion: false },
  { id: 'E',  tonica: 'E',  tipo: 'sostenido', numAlteraciones: 4, armadura: ['F#','C#','G#','D#'], escala: ['E','F#','G#','A','B','C#','D#'], esExcepcion: false },
  { id: 'B',  tonica: 'B',  tipo: 'sostenido', numAlteraciones: 5, armadura: ['F#','C#','G#','D#','A#'], escala: ['B','C#','D#','E','F#','G#','A#'], esExcepcion: false },
  { id: 'F#', tonica: 'F#', tipo: 'sostenido', numAlteraciones: 6, armadura: ['F#','C#','G#','D#','A#','E#'], escala: ['F#','G#','A#','B','C#','D#','E#'], esExcepcion: false },
  { id: 'C#', tonica: 'C#', tipo: 'sostenido', numAlteraciones: 7, armadura: ['F#','C#','G#','D#','A#','E#','B#'], escala: ['C#','D#','E#','F#','G#','A#','B#'], esExcepcion: false },

  // BEMOLES
  { id: 'F',  tonica: 'F',  tipo: 'bemol', numAlteraciones: 1, armadura: ['Bb'], escala: ['F','G','A','Bb','C','D','E'], esExcepcion: true },
  { id: 'Bb', tonica: 'Bb', tipo: 'bemol', numAlteraciones: 2, armadura: ['Bb','Eb'], escala: ['Bb','C','D','Eb','F','G','A'], esExcepcion: false },
  { id: 'Eb', tonica: 'Eb', tipo: 'bemol', numAlteraciones: 3, armadura: ['Bb','Eb','Ab'], escala: ['Eb','F','G','Ab','Bb','C','D'], esExcepcion: false },
  { id: 'Ab', tonica: 'Ab', tipo: 'bemol', numAlteraciones: 4, armadura: ['Bb','Eb','Ab','Db'], escala: ['Ab','Bb','C','Db','Eb','F','G'], esExcepcion: false },
  { id: 'Db', tonica: 'Db', tipo: 'bemol', numAlteraciones: 5, armadura: ['Bb','Eb','Ab','Db','Gb'], escala: ['Db','Eb','F','Gb','Ab','Bb','C'], esExcepcion: false },
  { id: 'Gb', tonica: 'Gb', tipo: 'bemol', numAlteraciones: 6, armadura: ['Bb','Eb','Ab','Db','Gb','Cb'], escala: ['Gb','Ab','Bb','Cb','Db','Eb','F'], esExcepcion: false },
  { id: 'Cb', tonica: 'Cb', tipo: 'bemol', numAlteraciones: 7, armadura: ['Bb','Eb','Ab','Db','Gb','Cb','Fb'], escala: ['Cb','Db','Eb','Fb','Gb','Ab','Bb'], esExcepcion: false },
];

export const TONALIDADES_SOSTENIDOS = TONALIDADES.filter(t => t.tipo === 'sostenido');
export const TONALIDADES_BEMOLES = TONALIDADES.filter(t => t.tipo === 'bemol');
