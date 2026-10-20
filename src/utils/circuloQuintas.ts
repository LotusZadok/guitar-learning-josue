// Geometría compartida del círculo de quintas: §1.8 (CirculoDeQuintas) y el
// selector de tonalidad de §4.1 (CirculoTonalidades). La posición 0 está
// arriba y las quintas ascendentes avanzan en sentido horario, 30° por paso.
export function anguloEnCirculo(i: number): number {
  return i * 30 - 90;
}

export function puntoEnCirculo(i: number, radio: number, centro: { x: number; y: number }) {
  const rad = (anguloEnCirculo(i) * Math.PI) / 180;
  return { x: centro.x + radio * Math.cos(rad), y: centro.y + radio * Math.sin(rad) };
}
