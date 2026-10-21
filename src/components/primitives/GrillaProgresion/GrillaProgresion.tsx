import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { acordeDeSlot, armaduraPorId, etiquetaTonalidad } from '../../../utils/progresionAcordes';
import {
  ACENTOS,
  CASILLAS_POR_COMPAS,
  admiteModificador,
  puntosDeModulacion,
  rolDe,
  type Compas,
  type GradoId,
  type Grid,
  type Modificador,
} from '../../../utils/progresionArmonica';
import styles from './GrillaProgresion.module.css';

interface Props {
  grid: Grid;
  compas: Compas;
  nCompases: number;
  /** Casilla que suena ahora, o -1. */
  sonando: number;
  /** Si el banco tiene un grado armado. Decide qué hace tocar una casilla:
   *  con grado armado coloca, sin grado armado vacía la casilla ocupada. */
  hayGradoArmado: boolean;
  /** Con una ficha armada (sus2, sus4 o 7), tocar un acorde que la admite la aplica. */
  modificadorArmado: Modificador | null;
  onModificar: (slotIndex: number) => void;
  /** aria-label de una casilla modificable; viene de la sección (i18n). */
  etiquetaModificar: (datos: { compas: number; pulso: number; acorde: string; modificador: Modificador }) => string;
  onColocar: (slotIndex: number) => void;
  onVaciar: (slotIndex: number) => void;
  onSoltar: (slotIndex: number, id: GradoId) => void;
  /** Texto accesible de una casilla donde cambia la tonalidad ("en Sol");
   *  viene de la sección (i18n). */
  etiquetaModulacion: (tonalidad: string) => string;
  /** aria-label de una casilla según lo que hará tocarla; viene de la sección (i18n). */
  etiquetaCasilla: (
    accion: 'colocar' | 'reemplazar' | 'vaciar' | 'ninguna',
    datos: { compas: number; pulso: number; acorde?: string },
  ) => string;
}

// La grilla. Cada compás es un grupo con su barra; el último cierra con la
// doble barra de fin. Los pulsos vacíos que CONTINÚAN un acorde llevan una
// ligadura que se extiende desde él: así la regla de relleno se ve antes de
// oírse.
export default function GrillaProgresion({
  grid, compas, nCompases, sonando, hayGradoArmado, modificadorArmado, onModificar, etiquetaModificar,
  onColocar, onVaciar, onSoltar, etiquetaModulacion, etiquetaCasilla,
}: Props) {
  const porCompas = CASILLAS_POR_COMPAS[compas];
  const acentos = ACENTOS[compas];

  // Índice del acorde que está sonando en cada casilla (para dibujar la
  // ligadura de relleno). -1 = silencio.
  // Reunión 19/10/26: si la progresión modula, cada tramo se rotula con su
  // tonalidad ("esto está en Sol... ahora voy a empezar en La") y el cambio
  // se marca con doble barra, como en la partitura. Sin modulación, nada.
  const tramos = puntosDeModulacion(grid);
  const rotulos = new Map(
    tramos.length > 1
      ? tramos.map((p) => [p.indice, etiquetaTonalidad(armaduraPorId(p.tonalidad.armaduraId), p.tonalidad.modo)])
      : [],
  );

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
              const acorde = slot ? acordeDeSlot(slot) : null;
              const rotulo = rotulos.get(i);
              const modula = rotulo !== undefined && i !== tramos[0].indice;
              const continua = !slot && dueno[i] >= 0;
              // Qué hace tocar esta casilla: con grado armado siempre coloca
              // (reemplaza si ya había algo); sin grado armado, una casilla
              // ocupada se vacía y una vacía no hace nada. El estudiante
              // necesita anticipar esto — por eso alimenta tanto el aria-label
              // como el cursor (`data-accion`), no solo el handler.
              const modificable =
                slot !== null && modificadorArmado !== null && admiteModificador(slot.tonalidad.modo, slot.degree, modificadorArmado);
              const accion = modificadorArmado
                ? (modificable ? 'modificar' : 'ninguna')
                : hayGradoArmado ? (slot ? 'reemplazar' : 'colocar') : (slot ? 'vaciar' : 'ninguna');
              const ariaAccion =
                accion === 'modificar'
                  ? etiquetaModificar({ compas: c + 1, pulso: p + 1, acorde: acorde?.cifrado ?? '', modificador: modificadorArmado! })
                  : etiquetaCasilla(accion, { compas: c + 1, pulso: p + 1, acorde: acorde?.cifrado });
              const ariaLabel = rotulo ? `${ariaAccion}. ${etiquetaModulacion(rotulo)}` : ariaAccion;
              return (
                <button
                  key={p}
                  type="button"
                  className={styles.casilla}
                  data-role={slot ? rolDe(slot.tonalidad.modo, slot.degree) : undefined}
                  data-modula={modula}
                  data-acento={acentos.includes(p)}
                  data-continua={continua}
                  data-sonando={sonando === i}
                  data-accion={accion}
                  aria-label={ariaLabel}
                  onClick={() => {
                    if (modificadorArmado) {
                      if (modificable) onModificar(i);
                    } else if (hayGradoArmado) onColocar(i);
                    else if (slot) onVaciar(i);
                  }}
                  onContextMenu={(e) => { e.preventDefault(); onVaciar(i); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onSoltar(i, e.dataTransfer.getData('text/plain') as GradoId); }}
                >
                  {rotulo && (
                    <span className={styles.tonalidad} aria-hidden="true">
                      {rotulo}
                    </span>
                  )}
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
