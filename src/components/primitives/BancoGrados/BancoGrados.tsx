import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { acordeDeGrado, type Armadura } from '../../../utils/progresionAcordes';
import {
  gradosArmonicosDe,
  gradosDe,
  rolDe,
  tonizacionesDe,
  tonizacionesDeGrado,
  esTonizable,
  type GradoId,
  type Modo,
  type Sus,
} from '../../../utils/progresionArmonica';
import styles from './BancoGrados.module.css';

interface Props {
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  gradoArmado: GradoId | null;
  onArmar: (id: GradoId | null) => void;
  /** Rótulos; vienen de la sección (i18n). */
  tonizacionesLabel: string;
  menorArmonicaLabel: string;
  /** Fichas sus2 / sus4: se tocan y después el acorde colocado. */
  sus: {
    armado: Sus | null;
    onArmar: (sus: Sus | null) => void;
    rotulo: string;
    etiqueta: (sus: Sus) => string;
  };
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
  menorArmonicaLabel,
  sus,
}: Props) {
  const { t } = useTranslation();
  const [abierto, setAbierto] = useState<number | null>(null);
  const grados = gradosDe(modo);
  const armonicos = gradosArmonicosDe(modo);

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
      {armonicos.length > 0 && (
        <div className={styles.armonica} role="group" aria-label={menorArmonicaLabel}>
          <div className={styles.armonicaGrados}>
            {armonicos.map((g, k) => {
              const clave = grados.length + k;
              const tonizaciones = tonizacionesDeGrado(g);
              return (
                <div key={g} className={styles.columna}>
                  {chip(g)}
                  {tonizaciones.length > 0 && (
                    <>
                      <button
                        type="button"
                        className={styles.expandir}
                        aria-expanded={abierto === clave}
                        aria-controls={`toniz-${clave}`}
                        onClick={() => setAbierto(abierto === clave ? null : clave)}
                      >
                        {t('t4.s41.tonizaciones')}
                      </button>
                      <div id={`toniz-${clave}`} className={styles.tonizaciones} hidden={abierto !== clave}>
                        {tonizaciones.map((id) => chip(id, styles.chipToniz))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <span className={styles.rotulo} aria-hidden="true">{menorArmonicaLabel}</span>
        </div>
      )}
      <div className={styles.modificadores} role="group" aria-label={sus.rotulo}>
        <div className={styles.armonicaGrados}>
          {(['sus2', 'sus4'] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`${styles.chip} ${styles.chipSus}`}
              aria-pressed={sus.armado === m}
              aria-label={sus.etiqueta(m)}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', `sus:${m}`)}
              onClick={() => sus.onArmar(sus.armado === m ? null : m)}
            >
              {m}
            </button>
          ))}
        </div>
        <span className={styles.rotulo} aria-hidden="true">{sus.rotulo}</span>
      </div>
    </div>
  );
}
