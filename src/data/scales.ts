import type { ScalePattern } from '../types/music';

export const SCALE_PATTERNS: ScalePattern[] = [
  { id: 'major', name: 'Mayor', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'minor', name: 'Menor Natural', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'pentatonic_major', name: 'Pentatónica Mayor', intervals: [0, 2, 4, 7, 9] },
  { id: 'pentatonic_minor', name: 'Pentatónica Menor', intervals: [0, 3, 5, 7, 10] },
  { id: 'blues', name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  { id: 'dorian', name: 'Dórica', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'mixolydian', name: 'Mixolidia', intervals: [0, 2, 4, 5, 7, 9, 10] },
];
