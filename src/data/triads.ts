import type { NaturalNote, Triad } from '../types/music';

export const TRIADS: Record<NaturalNote, Triad> = {
  'C': { root: 'C', notes: ['C', 'E', 'G'], type: 'Mayor' },
  'D': { root: 'D', notes: ['D', 'F', 'A'], type: 'Menor' },
  'E': { root: 'E', notes: ['E', 'G', 'B'], type: 'Menor' },
  'F': { root: 'F', notes: ['F', 'A', 'C'], type: 'Mayor' },
  'G': { root: 'G', notes: ['G', 'B', 'D'], type: 'Mayor' },
  'A': { root: 'A', notes: ['A', 'C', 'E'], type: 'Menor' },
  'B': { root: 'B', notes: ['B', 'D', 'F'], type: 'Disminuida' },
};

export const ROLE_LABELS = ['T', '3ra', '5ta', '7ma', '9na', '11na', '13na'];
export const ROLE_COLORS = ['#c0392b', '#27ae60', '#d4a017', '#2980b9', '#8e44ad', '#1abc9c', '#e67e22'];
