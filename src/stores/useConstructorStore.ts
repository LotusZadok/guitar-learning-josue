import { create } from 'zustand';
import {
  CASILLAS_POR_COMPAS,
  aplicarModificador,
  fijarSeptimas,
  colocarSlot,
  crearGrid,
  type Compas,
  type GradoId,
  type Grid,
  type Modo,
  type Modificador,
} from '../utils/progresionArmonica';

export const BPM_MIN = 40;
export const BPM_MAX = 200;
const BPM_DEFAULT = 90;
export const COMPASES_MIN = 1;
// Reunión 19/10/26: "un blues necesita mínimo 12 compases… mínimo 30".
export const COMPASES_MAX = 30;
const COMPASES_DEFAULT = 4;

interface ConstructorState {
  armaduraId: string;
  modo: Modo;
  compas: Compas;
  nCompases: number;
  bpm: number;
  septimas: boolean;
  metronomo: boolean;
  loop: boolean;
  grid: Grid;
  /** El grado tocado en el banco, esperando una casilla. Null = nada armado. */
  gradoArmado: GradoId | null;
  /** La ficha (sus2, sus4 o 7) tocada en el banco, esperando un acorde
   *  colocado. Excluye a gradoArmado: armar uno desarma el otro. */
  modificadorArmado: Modificador | null;

  setArmadura: (id: string) => void;
  setModo: (modo: Modo) => void;
  setCompas: (compas: Compas) => void;
  setNCompases: (n: number) => void;
  setBpm: (bpm: number) => void;
  toggleSeptimas: () => void;
  toggleMetronomo: () => void;
  toggleLoop: () => void;
  armarGrado: (id: GradoId | null) => void;
  armarModificador: (modificador: Modificador | null) => void;
  modificarEn: (slotIndex: number) => void;
  colocarEn: (slotIndex: number) => void;
  vaciarSlot: (slotIndex: number) => void;
  limpiarGrid: () => void;
}

export const useConstructorStore = create<ConstructorState>()((set) => ({
  armaduraId: 'C',
  modo: 'mayor',
  compas: '4/4',
  nCompases: COMPASES_DEFAULT,
  bpm: BPM_DEFAULT,
  septimas: false,
  metronomo: false,
  loop: false,
  grid: crearGrid('4/4', COMPASES_DEFAULT),
  gradoArmado: null,
  modificadorArmado: null,

  // Armadura y modo son la tonalidad ACTIVA: la que recibe el próximo acorde.
  // Lo ya colocado conserva su tonalidad (modulación, reunión 19/10/26); la
  // pregunta "¿seguro que quieres modular?" la hace la sección antes.
  setArmadura: (armaduraId) => set({ armaduraId }),
  setModo: (modo) => set({ modo }),

  // Cambiar el compás re-arma la grilla: cambia cuántas casillas tiene cada
  // compás, así que los índices viejos no significan lo mismo.
  setCompas: (compas) => set((s) => ({ compas, grid: crearGrid(compas, s.nCompases) })),

  // Cambiar el número de compases conserva lo que cabe: recortar por el final es
  // lo que espera alguien que baja de 4 a 2 compases.
  setNCompases: (n) =>
    set((s) => {
      const nCompases = Math.min(COMPASES_MAX, Math.max(COMPASES_MIN, n));
      const largo = nCompases * CASILLAS_POR_COMPAS[s.compas];
      const grid = crearGrid(s.compas, nCompases);
      for (let i = 0; i < Math.min(largo, s.grid.length); i++) grid[i] = s.grid[i];
      return { nCompases, grid };
    }),

  setBpm: (bpm) => set({ bpm: Math.min(BPM_MAX, Math.max(BPM_MIN, bpm)) }),
  // El general decide cómo entran los próximos acordes y pisa a todos los
  // colocados, incluidas las séptimas puestas una por una con la ficha 7.
  toggleSeptimas: () => set((s) => ({ septimas: !s.septimas, grid: fijarSeptimas(s.grid, !s.septimas) })),
  toggleMetronomo: () => set((s) => ({ metronomo: !s.metronomo })),
  toggleLoop: () => set((s) => ({ loop: !s.loop })),

  armarGrado: (gradoArmado) => set({ gradoArmado, modificadorArmado: null }),
  armarModificador: (modificadorArmado) => set({ modificadorArmado, gradoArmado: null }),

  // Igual que colocar: la ficha se consume al aplicarla.
  modificarEn: (slotIndex) =>
    set((s) =>
      s.modificadorArmado
        ? { grid: aplicarModificador(s.grid, slotIndex, s.modificadorArmado), modificadorArmado: null }
        : {},
    ),

  // Colocar consume el grado armado: el gesto es tocar-grado → tocar-casilla, y
  // dejarlo armado invitaría a llenar la grilla del mismo acorde sin querer.
  colocarEn: (slotIndex) =>
    set((s) => {
      if (!s.gradoArmado) return {};
      const tonalidad = { armaduraId: s.armaduraId, modo: s.modo };
      return {
        grid: colocarSlot(s.grid, slotIndex, { degree: s.gradoArmado, tonalidad, septima: s.septimas }),
        gradoArmado: null,
      };
    }),

  vaciarSlot: (slotIndex) =>
    set((s) => {
      const grid = s.grid.slice();
      grid[slotIndex] = null;
      return { grid };
    }),

  limpiarGrid: () => set((s) => ({ grid: crearGrid(s.compas, s.nCompases), gradoArmado: null, modificadorArmado: null })),
}));
