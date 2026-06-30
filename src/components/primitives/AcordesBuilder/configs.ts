import type { IntervalNumber, IntervalQuality } from '../../../utils/noteCalculations';

// === Config del árbol-constructor (varias versiones a lo largo del documento) ===
// Cada nodo es una posición interválica con su grafía; cada acorde es un camino
// ordenado de roles (sin la tónica). Las aristas y la alcanzabilidad se derivan
// de los caminos. Doble codificación posicional invariante: vertical = distancia
// interválica (menos semitonos, más arriba), horizontal = calidad (menor/dis. a
// la izquierda, mayor/justa a la derecha).

export interface BuilderNode {
  role: string; // único dentro de la config: 'T','3m','3M','5','5d','7m','7M','7d'
  number: IntervalNumber;
  quality: IntervalQuality;
  x: number;
  y: number;
  level: number; // 1 = tercera, 2 = quinta, 3 = séptima
}

export interface BuilderChord {
  path: string[]; // roles en orden de nivel, sin 'T'
  nombre: string;
  cifrado: string;
}

export interface BuilderConfig {
  width: number;
  height: number;
  ariaLabel: string;
  tonic: { x: number; y: number };
  nodes: BuilderNode[];
  chords: BuilderChord[];
}

// §1.7 · hasta la quinta (tríadas: m, °, M).
export const BUILDER_17: BuilderConfig = {
  width: 440,
  height: 300,
  ariaLabel: 'Árbol constructor de acordes: elegí una tercera y luego una quinta',
  tonic: { x: 46, y: 150 },
  nodes: [
    { role: '3m', number: 3, quality: 'm', x: 175, y: 92, level: 1 },
    { role: '3M', number: 3, quality: 'M', x: 225, y: 208, level: 1 },
    { role: '5d', number: 5, quality: 'dim', x: 360, y: 78, level: 2 },
    { role: '5', number: 5, quality: 'P', x: 410, y: 196, level: 2 },
  ],
  chords: [
    { path: ['3m', '5'], nombre: 'menor', cifrado: 'm' },
    { path: ['3m', '5d'], nombre: 'disminuido', cifrado: '°' },
    { path: ['3M', '5'], nombre: 'mayor', cifrado: 'M' },
  ],
};

// §3.1.2 · agrega el nivel de séptimas (maj7, m7, dominante 7) sobre la 5J.
export const BUILDER_312: BuilderConfig = {
  width: 470,
  height: 300,
  ariaLabel: 'Constructor de acordes con séptimas: elegí tercera, quinta y séptima',
  tonic: { x: 40, y: 150 },
  nodes: [
    { role: '3m', number: 3, quality: 'm', x: 150, y: 95, level: 1 },
    { role: '3M', number: 3, quality: 'M', x: 195, y: 205, level: 1 },
    { role: '5', number: 5, quality: 'P', x: 295, y: 150, level: 2 },
    { role: '7m', number: 7, quality: 'm', x: 405, y: 95, level: 3 },
    { role: '7M', number: 7, quality: 'M', x: 420, y: 205, level: 3 },
  ],
  chords: [
    { path: ['3m', '5'], nombre: 'menor', cifrado: 'm' },
    { path: ['3M', '5'], nombre: 'mayor', cifrado: 'M' },
    { path: ['3m', '5', '7m'], nombre: 'menor 7', cifrado: 'm7' },
    { path: ['3M', '5', '7M'], nombre: 'mayor 7', cifrado: 'maj7' },
    { path: ['3M', '5', '7m'], nombre: 'dominante 7', cifrado: '7' },
  ],
};

// §3.3 · suspendidos: la tercera se reemplaza por la 2M o la 4J. T → {2, 4} → 5J.
// La 2 (2 s.t.) está más cerca de la tónica que la 4 (5 s.t.): va más arriba.
export const BUILDER_33: BuilderConfig = {
  width: 440,
  height: 300,
  ariaLabel: 'Constructor de acordes suspendidos: elegí la 2ª o la 4ª y luego la quinta',
  tonic: { x: 46, y: 150 },
  nodes: [
    { role: '2', number: 2, quality: 'M', x: 175, y: 92, level: 1 },
    { role: '4', number: 4, quality: 'P', x: 215, y: 208, level: 1 },
    { role: '5', number: 5, quality: 'P', x: 405, y: 150, level: 2 },
  ],
  chords: [
    { path: ['2', '5'], nombre: 'suspendido 2', cifrado: 'sus2' },
    { path: ['4', '5'], nombre: 'suspendido 4', cifrado: 'sus4' },
  ],
};

// §3.4 · el árbol completo: los 10 acordes del método en un solo constructor.
// Niveles: tercera-región {2, 3m, 3M, 4} → quinta {5, 5d} → séptima {7d, 7m, 7M}.
// La 5J ramifica a 7m/7M; la 5d a 7m/7d; la 7m es compartida (m7, X7, m7♭5).
export const BUILDER_34: BuilderConfig = {
  width: 520,
  height: 340,
  ariaLabel: 'Constructor completo de acordes: elegí tercera (o 2ª/4ª), quinta y, si querés, séptima',
  tonic: { x: 46, y: 170 },
  nodes: [
    { role: '2', number: 2, quality: 'M', x: 140, y: 55, level: 1 },
    { role: '3m', number: 3, quality: 'm', x: 125, y: 132, level: 1 },
    { role: '3M', number: 3, quality: 'M', x: 182, y: 210, level: 1 },
    { role: '4', number: 4, quality: 'P', x: 160, y: 288, level: 1 },
    { role: '5d', number: 5, quality: 'dim', x: 322, y: 104, level: 2 },
    { role: '5', number: 5, quality: 'P', x: 346, y: 216, level: 2 },
    { role: '7d', number: 7, quality: 'dim', x: 456, y: 80, level: 3 },
    { role: '7m', number: 7, quality: 'm', x: 470, y: 170, level: 3 },
    { role: '7M', number: 7, quality: 'M', x: 478, y: 262, level: 3 },
  ],
  chords: [
    { path: ['2', '5'], nombre: 'suspendido 2', cifrado: 'sus2' },
    { path: ['3m', '5'], nombre: 'menor', cifrado: 'm' },
    { path: ['3m', '5d'], nombre: 'disminuido', cifrado: '°' },
    { path: ['3M', '5'], nombre: 'mayor', cifrado: 'M' },
    { path: ['4', '5'], nombre: 'suspendido 4', cifrado: 'sus4' },
    { path: ['3m', '5', '7m'], nombre: 'menor 7', cifrado: 'm7' },
    { path: ['3M', '5', '7M'], nombre: 'mayor 7', cifrado: 'maj7' },
    { path: ['3M', '5', '7m'], nombre: 'dominante 7', cifrado: '7' },
    { path: ['3m', '5d', '7m'], nombre: 'semidisminuido', cifrado: 'm7♭5' },
    { path: ['3m', '5d', '7d'], nombre: 'disminuido 7', cifrado: 'dim7' },
  ],
};

// §3.2 · la rama disminuida: 3m → 5d → {7d, 7m} (dim7, m7♭5) + la tríada dim.
// La 7d (9 s.t.) está más cerca de la tónica que la 7m (10 s.t.): va más arriba.
export const BUILDER_32: BuilderConfig = {
  width: 470,
  height: 300,
  ariaLabel: 'Constructor de acordes disminuidos: elegí 3m, 5d y la séptima',
  tonic: { x: 40, y: 150 },
  nodes: [
    { role: '3m', number: 3, quality: 'm', x: 160, y: 150, level: 1 },
    { role: '5d', number: 5, quality: 'dim', x: 290, y: 150, level: 2 },
    { role: '7d', number: 7, quality: 'dim', x: 410, y: 95, level: 3 },
    { role: '7m', number: 7, quality: 'm', x: 420, y: 205, level: 3 },
  ],
  chords: [
    { path: ['3m', '5d'], nombre: 'disminuido', cifrado: '°' },
    { path: ['3m', '5d', '7d'], nombre: 'disminuido 7', cifrado: 'dim7' },
    { path: ['3m', '5d', '7m'], nombre: 'semidisminuido', cifrado: 'm7♭5' },
  ],
};
