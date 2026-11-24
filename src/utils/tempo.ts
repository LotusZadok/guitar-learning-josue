// Tempo del laboratorio. Vive fuera del store para que `scripts/` pueda
// probarlo: el store importa zustand y no corre bajo node --experimental-strip-types.
export const BPM_MIN = 40;
export const BPM_MAX = 200;

export function acotarBpm(bpm: number): number {
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(bpm)));
}

// Reunión 22/11/26 (#2): el tempo se escribe. Lo que no es un número deja el
// valor anterior; lo que sale del rango se acota.
export function parsearBpm(texto: string, anterior: number): number {
  const n = Number(texto);
  return texto.trim() === '' || Number.isNaN(n) ? anterior : acotarBpm(n);
}
