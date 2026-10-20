import { armaduraPorId, etiquetaTonalidad } from '../../../utils/progresionAcordes';
import { puntoEnCirculo } from '../../../utils/circuloQuintas';
import type { Modo, Tonalidad } from '../../../utils/progresionArmonica';
import styles from './CirculoTonalidades.module.css';

// Reunión 19/10/26: en vez de contar alteraciones ("no vamos a buscar o
// componer algo contando los sostenidos"), la tonalidad se elige en el círculo
// de quintas: afuera las mayores, adentro su relativa menor. Un solo gesto
// fija armadura y modo. Las tres posiciones enarmónicas usan F♯ (6♯), D♭ (5♭)
// y B (5♯), las grafías habituales en guitarra.
const ORDEN_ARMADURAS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

// Radios en % del lado del cuadrado que contiene el círculo.
const RADIO_MAYOR = 41;
const RADIO_MENOR = 25;
const CENTRO = { x: 50, y: 50 };

interface Props {
  armaduraId: string;
  modo: Modo;
  onTonalidad: (tonalidad: Tonalidad) => void;
  /** Textos; vienen de la sección (i18n). */
  labels: {
    grupo: string;
    tonalidad: (tonica: string, modo: Modo) => string;
  };
  septimas: { activas: boolean; etiqueta: string; onToggle: () => void };
}

export default function CirculoTonalidades({ armaduraId, modo, onTonalidad, labels, septimas }: Props) {
  const activa = armaduraPorId(armaduraId);

  const nodo = (id: string, i: number, modoNodo: Modo) => {
    const armadura = armaduraPorId(id);
    const { x, y } = puntoEnCirculo(i, modoNodo === 'mayor' ? RADIO_MAYOR : RADIO_MENOR, CENTRO);
    const etiqueta = etiquetaTonalidad(armadura, modoNodo);
    const tonica = modoNodo === 'mayor' ? etiqueta : etiqueta.slice(0, -1);
    return (
      <button
        key={`${modoNodo}-${id}`}
        type="button"
        className={modoNodo === 'mayor' ? styles.mayor : styles.menor}
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-pressed={id === armaduraId && modoNodo === modo}
        aria-label={labels.tonalidad(tonica, modoNodo)}
        onClick={() => onTonalidad({ armaduraId: id, modo: modoNodo })}
      >
        {etiqueta}
      </button>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.circulo} role="group" aria-label={labels.grupo}>
        <span className={styles.anillo} aria-hidden="true" />
        {ORDEN_ARMADURAS.map((id, i) => nodo(id, i, 'mayor'))}
        {ORDEN_ARMADURAS.map((id, i) => nodo(id, i, 'menor'))}
        <span className={styles.centro} aria-hidden="true">
          {etiquetaTonalidad(activa, modo)}
          <span className={styles.armadura}>
            {activa.alteraciones === 0 ? '♮' : `${activa.alteraciones}${activa.tipo === 'sostenido' ? '♯' : '♭'}`}
          </span>
        </span>
      </div>
      <button
        type="button"
        className={styles.septimas}
        aria-pressed={septimas.activas}
        onClick={septimas.onToggle}
      >
        {septimas.etiqueta}
      </button>
    </div>
  );
}
