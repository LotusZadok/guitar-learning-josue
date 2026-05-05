import type { IntervalDefinition } from '../types/music';

export const INTERVAL_DEFINITIONS: IntervalDefinition[] = [
  { name: 'Tónica', semitones: 0, description: 'Nota base. Punto de partida', color: 'var(--red)' },
  { name: '3ra Menor', semitones: 3, description: 'Define acorde menor', color: '#2980b9' },
  { name: '3ra Mayor', semitones: 4, description: 'Define acorde mayor', color: '#27ae60' },
  { name: 'Quinta', semitones: 7, description: 'Quinta justa', color: 'var(--amber)' },
  { name: 'Octava', semitones: 12, description: 'Repetición de la tónica, una octava arriba', color: 'var(--string6)' },
];

export const INTERVAL_FB_POINTS = [
  { offset: 0, label: 'T', color: 'var(--red)' },
  { offset: 3, label: '3m', color: '#2980b9' },
  { offset: 4, label: '3M', color: '#27ae60' },
  { offset: 7, label: '5ta', color: 'var(--amber)' },
  { offset: 12, label: '8va', color: 'var(--string6)' },
];
