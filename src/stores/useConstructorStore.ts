import { create } from 'zustand';
import {
  CASILLAS_POR_COMPAS,
  crearGrid,
  gradosDe,
  type Compas,
  type GradoId,
  type Grid,
  type Modo,
} from '../utils/progresionArmonica';

export const BPM_MIN = 40;
export const BPM_MAX = 200;
export const BPM_DEFAULT = 90;
export const COMPASES_MIN = 1;
export const COMPASES_MAX = 8;
export const COMPASES_DEFAULT = 4;

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

  setArmadura: (id: string) => void;
  setModo: (modo: Modo) => void;
  setCompas: (compas: Compas) => void;
  setNCompases: (n: number) => void;
  setBpm: (bpm: number) => void;
  toggleSeptimas: () => void;
  toggleMetronomo: () => void;
  toggleLoop: () => void;
  armarGrado: (id: GradoId | null) => void;
  colocarEn: (slotIndex: number) => void;
  vaciarSlot: (slotIndex: number) => void;
  limpiarGrid: () => void;
}

// Qué grados del grid dejan de existir al cambiar de modo. Los romanos son
// distintos entre mayor y menor ('I' no existe en menor), así que cambiar de
// modo deja casillas huérfanas. Quién avisa al usuario es la sección, no el
// store; el store solo sabe contarlas y limpiarlas.
export function contarHuerfanas(grid: Grid, modoDestino: Modo): number {
  const validos = new Set<string>(gradosDe(modoDestino));
  return grid.filter((s) => {
    if (!s) return false;
    const base = s.degree.includes('/') ? s.degree.split('/')[1] : s.degree;
    return !validos.has(base);
  }).length;
}

function limpiarHuerfanas(grid: Grid, modoDestino: Modo): Grid {
  const validos = new Set<string>(gradosDe(modoDestino));
  return grid.map((s) => {
    if (!s) return null;
    const base = s.degree.includes('/') ? s.degree.split('/')[1] : s.degree;
    return validos.has(base) ? s : null;
  });
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

  // Cambiar de armadura NO borra la grilla: los grados son independientes de la
  // tonalidad, y ese es medio punto de la lección.
  setArmadura: (armaduraId) => set({ armaduraId }),

  // Cambiar de modo SÍ reescribe los romanos, así que las casillas cuyo grado no
  // existe en el modo destino se vacían. La confirmación la pide la sección
  // ANTES de llamar acá (ver contarHuerfanas).
  setModo: (modo) => set((s) => ({ modo, grid: limpiarHuerfanas(s.grid, modo) })),

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
  toggleSeptimas: () => set((s) => ({ septimas: !s.septimas })),
  toggleMetronomo: () => set((s) => ({ metronomo: !s.metronomo })),
  toggleLoop: () => set((s) => ({ loop: !s.loop })),

  armarGrado: (gradoArmado) => set({ gradoArmado }),

  // Colocar consume el grado armado: el gesto es tocar-grado → tocar-casilla, y
  // dejarlo armado invitaría a llenar la grilla del mismo acorde sin querer.
  colocarEn: (slotIndex) =>
    set((s) => {
      if (!s.gradoArmado) return {};
      const grid = s.grid.slice();
      grid[slotIndex] = { degree: s.gradoArmado };
      return { grid, gradoArmado: null };
    }),

  vaciarSlot: (slotIndex) =>
    set((s) => {
      const grid = s.grid.slice();
      grid[slotIndex] = null;
      return { grid };
    }),

  limpiarGrid: () => set((s) => ({ grid: crearGrid(s.compas, s.nCompases), gradoArmado: null })),
}));
