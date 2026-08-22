import { useTranslation } from 'react-i18next';
import { COMPASES, MUNDO_POR_COMPAS, type Compas } from '../../../utils/progresionArmonica';
import { BPM_MAX, BPM_MIN, COMPASES_MAX, COMPASES_MIN } from '../../../stores/useConstructorStore';
import styles from './TransporteProgresion.module.css';

interface Props {
  compas: Compas;
  nCompases: number;
  bpm: number;
  septimas: boolean;
  metronomo: boolean;
  loop: boolean;
  reproduciendo: boolean;
  onCompas: (c: Compas) => void;
  onNCompases: (n: number) => void;
  onBpm: (n: number) => void;
  onSeptimas: () => void;
  onMetronomo: () => void;
  onLoop: () => void;
  onPlay: () => void;
  onStop: () => void;
  onLimpiar: () => void;
}

// Tortuga y conejo: los extremos del slider, como pidió el profesor. SVG lineal
// monocromo — no emoji, no color (PRODUCT.md: sin gamificación, paleta austera).
//
// Redibujados a mano tras verlos renderizados (el primer intento era
// irreconocible a 24x16: la tortuga parecía un puente y el conejo un garabato
// con dos lazos). El contraste de silueta es lo que los distingue de un
// vistazo, no el detalle: la tortuga es un domo ancho y bajo con patas
// colgando; el conejo es un cuerpo compacto y alto con orejas verticales.
function Tortuga() {
  return (
    <svg viewBox="0 0 24 16" className={styles.bicho} aria-hidden="true" focusable="false">
      <path d="M4 11 Q10.5 4 17 11" />
      <path d="M6 11.5V14M9.3 11.5V14.3M13.3 11.5V14.3M16 11.5V14" />
      <path d="M17 10 L22 9" />
      <circle cx="22.6" cy="8.7" r="1.3" />
      <path d="M4 11 L2 12.3" />
    </svg>
  );
}

function Conejo() {
  return (
    <svg viewBox="0 0 24 16" className={styles.bicho} aria-hidden="true" focusable="false">
      <path d="M3 14 Q3 9 8 9 Q13 9 13 14" />
      <circle cx="13.5" cy="7" r="1.6" />
      <path d="M12.3 6 Q11.6 2 11 1" />
      <path d="M14.3 6 Q15.2 2 16 1" />
      <path d="M3 13 Q2 12.3 2.7 11.4" />
      <path d="M4 14 Q3.3 15.2 4.6 15.3" />
    </svg>
  );
}

export default function TransporteProgresion(p: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{t('t4.s41.compas_label')}</legend>
        <div className={styles.fila}>
          {COMPASES.map((c) => (
            <button
              key={c}
              type="button"
              className={styles.chip}
              aria-pressed={c === p.compas}
              onClick={() => p.onCompas(c)}
            >
              <span className={styles.cifra}>{c}</span>
              <span className={styles.mundo}>{t(`t4.s41.mundo_${MUNDO_POR_COMPAS[c]}`)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{t('t4.s41.compases_label')}</legend>
        <input
          type="number"
          className={styles.numero}
          min={COMPASES_MIN}
          max={COMPASES_MAX}
          value={p.nCompases}
          onChange={(e) => p.onNCompases(Number(e.target.value))}
        />
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{t('t4.s41.velocidad_label')}</legend>
        <div className={styles.slider}>
          <Tortuga />
          <input
            type="range"
            min={BPM_MIN}
            max={BPM_MAX}
            step={1}
            value={p.bpm}
            aria-label={t('t4.s41.bpm_aria')}
            aria-valuetext={t('t4.s41.bpm_valuetext', { bpm: p.bpm })}
            onChange={(e) => p.onBpm(Number(e.target.value))}
          />
          <Conejo />
          {/* aria-hidden: es un eco visual del mismo valor que ya anuncia
              aria-valuetext del slider. Sin esto, <output> (role="status"
              implícito) narraría el BPM una segunda vez en cada cambio. */}
          <output className={styles.bpm} aria-hidden="true">
            {p.bpm}
          </output>
        </div>
      </fieldset>

      <div className={styles.acciones}>
        <button
          type="button"
          className={styles.principal}
          onClick={p.reproduciendo ? p.onStop : p.onPlay}
        >
          {p.reproduciendo ? t('common.stop') : t('common.play')}
        </button>
        <button type="button" className={styles.chip} aria-pressed={p.septimas} onClick={p.onSeptimas}>
          {t('t4.s41.septimas')}
        </button>
        <button type="button" className={styles.chip} aria-pressed={p.metronomo} onClick={p.onMetronomo}>
          {t('t4.s41.metronomo')}
        </button>
        <button type="button" className={styles.chip} aria-pressed={p.loop} onClick={p.onLoop}>
          {t('t4.s41.loop')}
        </button>
        <button type="button" className={styles.chip} onClick={p.onLimpiar}>
          {t('common.reset')}
        </button>
      </div>
    </div>
  );
}
