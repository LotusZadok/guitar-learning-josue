import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { acordeDeGrado, type Armadura } from '../../../utils/progresionAcordes';
import {
  gradosDe,
  rolDe,
  tonizacionesDe,
  esTonizable,
  type GradoId,
  type Modo,
} from '../../../utils/progresionArmonica';
import styles from './BancoGrados.module.css';

interface Props {
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  gradoArmado: GradoId | null;
  onArmar: (id: GradoId | null) => void;
  /** Rótulo de la fila de tonizaciones; viene de la sección (i18n). */
  tonizacionesLabel: string;
}

// El banco: los 7 grados del modo activo. Cada grado tonizable expande sus dos
// tonizaciones (V/x y ii/x) — el gesto de la pizarra. Tocar un grado lo deja
// "armado"; la casilla de la grilla lo consume. El drag & drop va encima de
// esto (draggable + dataTransfer), nunca en su lugar: el tap-tap es la vía
// principal y la única que funciona con teclado y lector de pantalla.
export default function BancoGrados({
  armadura,
  modo,
  septimas,
  gradoArmado,
  onArmar,
  tonizacionesLabel,
}: Props) {
  const { t } = useTranslation();
  const [abierto, setAbierto] = useState<number | null>(null);
  const grados = gradosDe(modo);

  const chip = (id: GradoId, extra?: string) => {
    const acorde = acordeDeGrado({ armadura, modo, id, septimas });
    const armado = gradoArmado === id;
    return (
      <button
        key={id}
        type="button"
        className={`${styles.chip} ${extra ?? ''}`}
        data-role={rolDe(modo, id)}
        aria-pressed={armado}
        aria-label={t('t4.s41.armar_grado', { grado: id, acorde: acorde.cifrado })}
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
        onClick={() => onArmar(armado ? null : id)}
      >
        <RomanGlyph roman={id} role={acorde.rol} />
        <span className={styles.cifrado}>{acorde.cifrado}</span>
      </button>
    );
  };

  return (
    <div className={styles.wrap}>
      {/* Reunión 19/10/26: "una etiquetita chiquitita aquí al lado izquierdo,
          como tonizaciones". La ficha fantasma copia la altura de una ficha
          real para que el rótulo quede a la altura de los botones de tonizar. */}
      <div className={styles.columna} aria-hidden="true">
        <span className={`${styles.chip} ${styles.fantasma}`}>
          <RomanGlyph roman="I" role="stable" />
          <span className={styles.cifrado}>&nbsp;</span>
        </span>
        <span className={styles.rotulo}>{tonizacionesLabel}</span>
      </div>
      {grados.map((g, i) => (
        <div key={g} className={styles.columna}>
          {chip(g)}
          {esTonizable(modo, i) && (
            <>
              <button
                type="button"
                className={styles.expandir}
                aria-expanded={abierto === i}
                aria-controls={`toniz-${i}`}
                onClick={() => setAbierto(abierto === i ? null : i)}
              >
                {t('t4.s41.tonizaciones')}
              </button>
              <div id={`toniz-${i}`} className={styles.tonizaciones} hidden={abierto !== i}>
                {tonizacionesDe(modo, i).map((id) => chip(id, styles.chipToniz))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
