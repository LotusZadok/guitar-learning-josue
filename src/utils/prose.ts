import type { ProseSegment } from '../types/prose.ts';

export function notasDe(segment: ProseSegment): string[] {
  return segment.flatMap((f) => (f.type === 'note' ? [f.value] : []));
}

export function conOctavas(segment: ProseSegment, octavas: number[]): ProseSegment {
  let i = 0;
  return segment.map((f) => (f.type === 'note' ? { ...f, octave: octavas[i++] } : f));
}
