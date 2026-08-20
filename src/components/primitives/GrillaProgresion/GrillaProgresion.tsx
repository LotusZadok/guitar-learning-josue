import { useTranslation } from 'react-i18next';
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { acordeDeGrado, type Armadura } from '../../../utils/progresionAcordes';
import {
  ACENTOS,
  CASILLAS_POR_COMPAS,
  rolDe,
  type Compas,
  type GradoId,
  type Grid,
  type Modo,
} from '../../../utils/progresionArmonica';
import styles from './GrillaProgresion.module.css';

interface Props {
  grid: Grid;
  compas: Compas;
  nCompases: number;
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  /** Casilla que suena ahora, o -1. */
  sonando: number;
  onColocar: (slotIndex: number) => void;
  onVaciar: (slotIndex: number) => void;
  onSoltar: (slotIndex: number, id: GradoId) => void;
}

// La grilla. Cada compás es un grupo con su barra; el último cierra con la
// doble barra de fin. Los pulsos vacíos que CONTINÚAN un acorde llevan una
// ligadura que se extiende desde él: así la regla de relleno se ve antes de
// oírse.
export default function GrillaProgresion({
  grid, compas, nCompases, armadura, modo, septimas, sonando, onColocar, onVaciar, onSoltar,
}: Props) {
  const { t } = useTranslation();
  const porCompas = CASILLAS_POR_COMPAS[compas];
  const acentos = ACENTOS[compas];

  // Índice del acorde que está sonando en cada casilla (para dibujar la
  // ligadura de relleno). -1 = silencio.
  const dueno: number[] = [];
  let actual = -1;
  grid.forEach((s, i) => {
    if (s) actual = i;
    dueno[i] = actual;
  });

  return (
    <div className={styles.pentagrama}>
      {Array.from({ length: nCompases }, (_, c) => (
        <div key={c} className={styles.compas}>
          <span className={styles.numeroCompas} aria-hidden="true">{c + 1}</span>
          <div className={styles.casillas} data-agrupado={porCompas === 6}>
            {Array.from({ length: porCompas }, (_, p) => {
              const i = c * porCompas + p;
              const slot = grid[i];
              const acorde = slot ? acordeDeGrado(armadura, modo, slot.degree, septimas) : null;
              const continua = !slot && dueno[i] >= 0;
              return (
                <button
                  key={p}
                  type="button"
                  className={styles.casilla}
                  data-role={slot ? rolDe(modo, slot.degree) : undefined}
                  data-acento={acentos.includes(p)}
                  data-continua={continua}
                  data-sonando={sonando === i}
                  aria-label={
                    slot
                      ? t('t4.s41.casilla_llena', { compas: c + 1, pulso: p + 1, grado: slot.degree, acorde: acorde?.cifrado })
                      : t('t4.s41.casilla_vacia', { compas: c + 1, pulso: p + 1 })
                  }
                  onClick={() => onColocar(i)}
                  onContextMenu={(e) => { e.preventDefault(); onVaciar(i); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onSoltar(i, e.dataTransfer.getData('text/plain') as GradoId); }}
                >
                  {slot && acorde ? (
                    <>
                      <RomanGlyph roman={slot.degree} role={acorde.rol} />
                      <span className={styles.cifrado}>{acorde.cifrado}</span>
                    </>
                  ) : (
                    <span className={styles.ligadura} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
