import type { IntervalNumber, IntervalQuality } from '../../../utils/noteCalculations';

// === Config del árbol-constructor (varias versiones a lo largo del documento) ===
// Cada nodo es una posición interválica con su grafía; cada acorde es un camino
// ordenado de roles (sin la tónica). Las aristas y la alcanzabilidad se derivan
// de los caminos. Doble codificación posicional invariante: vertical = altura
// real (MÁS semitonos, más arriba — la 3M por encima de la 3m, como se apilan
// las voces en ChordStacks), horizontal = NIVEL (tónica → tercera → quinta →
// séptima), una sola x por nivel. El eje vertical se invirtió el 19/8/26 y las
// columnas se alinearon el 19/8/26, ambos a pedido del profesor: antes el eje
// vertical codificaba cercanía a la tónica (leía al revés del oído) y la x
// escalonaba dentro del nivel para codificar calidad, lo que dejaba las
// columnas torcidas. La calidad ya la codifican el peso y la itálica del rol
// (roleMajor / roleMinor), así que no se perdió información.

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

// El `width`/`height` deben dejar al menos ~36px de holgura entre el centro de
// cada nodo y el borde: el anillo de "sonando" (r = R+6, stroke 3) se escala
// 1.12 al reproducirse, y el viewBox recorta por defecto.

// §1.7 · hasta la quinta (tríadas: m, °, M).
export const BUILDER_17: BuilderConfig = {
  width: 460,
  height: 300,
  ariaLabel: 'Árbol constructor de acordes: elige una tercera y luego una quinta',
  tonic: { x: 46, y: 150 },
  nodes: [
    { role: '3m', number: 3, quality: 'm', x: 200, y: 208, level: 1 },
    { role: '3M', number: 3, quality: 'M', x: 200, y: 92, level: 1 },
    { role: '5d', number: 5, quality: 'dim', x: 385, y: 196, level: 2 },
    { role: '5', number: 5, quality: 'P', x: 385, y: 78, level: 2 },
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
  ariaLabel: 'Constructor de acordes con séptimas: elige tercera, quinta y séptima',
  tonic: { x: 40, y: 150 },
  nodes: [
    { role: '3m', number: 3, quality: 'm', x: 172, y: 205, level: 1 },
    { role: '3M', number: 3, quality: 'M', x: 172, y: 95, level: 1 },
    { role: '5', number: 5, quality: 'P', x: 295, y: 150, level: 2 },
    { role: '7m', number: 7, quality: 'm', x: 412, y: 205, level: 3 },
    { role: '7M', number: 7, quality: 'M', x: 412, y: 95, level: 3 },
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
// La 4 (5 s.t.) es más aguda que la 2 (2 s.t.): va más arriba.
export const BUILDER_33: BuilderConfig = {
  width: 460,
  height: 300,
  ariaLabel: 'Constructor de acordes suspendidos: elige la 2ª o la 4ª y luego la quinta',
  tonic: { x: 46, y: 150 },
  nodes: [
    { role: '2', number: 2, quality: 'M', x: 195, y: 208, level: 1 },
    { role: '4', number: 4, quality: 'P', x: 195, y: 92, level: 1 },
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
  ariaLabel: 'Constructor completo de acordes: elige tercera (o 2ª/4ª), quinta y, si quieres, séptima',
  tonic: { x: 46, y: 170 },
  nodes: [
    { role: '2', number: 2, quality: 'M', x: 152, y: 288, level: 1 },
    { role: '3m', number: 3, quality: 'm', x: 152, y: 210, level: 1 },
    { role: '3M', number: 3, quality: 'M', x: 152, y: 132, level: 1 },
    { role: '4', number: 4, quality: 'P', x: 152, y: 55, level: 1 },
    { role: '5d', number: 5, quality: 'dim', x: 334, y: 216, level: 2 },
    { role: '5', number: 5, quality: 'P', x: 334, y: 104, level: 2 },
    { role: '7d', number: 7, quality: 'dim', x: 468, y: 262, level: 3 },
    { role: '7m', number: 7, quality: 'm', x: 468, y: 170, level: 3 },
    { role: '7M', number: 7, quality: 'M', x: 468, y: 80, level: 3 },
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
// La 7m (10 s.t.) es más aguda que la 7d (9 s.t.): va más arriba.
export const BUILDER_32: BuilderConfig = {
  width: 470,
  height: 300,
  ariaLabel: 'Constructor de acordes disminuidos: elige 3m, 5d y la séptima',
  tonic: { x: 40, y: 150 },
  nodes: [
    { role: '3m', number: 3, quality: 'm', x: 160, y: 150, level: 1 },
    { role: '5d', number: 5, quality: 'dim', x: 290, y: 150, level: 2 },
    { role: '7d', number: 7, quality: 'dim', x: 415, y: 205, level: 3 },
    { role: '7m', number: 7, quality: 'm', x: 415, y: 95, level: 3 },
  ],
  chords: [
    { path: ['3m', '5d'], nombre: 'disminuido', cifrado: '°' },
    { path: ['3m', '5d', '7d'], nombre: 'disminuido 7', cifrado: 'dim7' },
    { path: ['3m', '5d', '7m'], nombre: 'semidisminuido', cifrado: 'm7♭5' },
  ],
};
