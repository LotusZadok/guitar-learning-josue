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

// Reunión 22/11/26 (#4): la tabla de términos que mandó el profesor el 24/11.
// El límite inferior es inclusivo. Su tabla solapaba Allegro y Vivace; él
// aclaró que Allegro llega hasta 140.
const TERMINOS: { termino: string; desde: number; hasta: number }[] = [
  { termino: 'Largo', desde: 40, hasta: 60 },
  { termino: 'Adagio', desde: 60, hasta: 76 },
  { termino: 'Andante', desde: 76, hasta: 108 },
  { termino: 'Moderato', desde: 108, hasta: 120 },
  { termino: 'Allegro', desde: 120, hasta: 140 },
  { termino: 'Vivace', desde: 140, hasta: Infinity },
];

export function terminoTempo(bpm: number): string[] {
  return TERMINOS.filter((t) => bpm >= t.desde && bpm < t.hasta).map((t) => t.termino);
}
