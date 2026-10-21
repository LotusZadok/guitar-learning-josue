import { COMPASES, MUNDO_POR_COMPAS, type Compas, type Mundo } from '../../../utils/progresionArmonica';
import { BPM_MAX, BPM_MIN, COMPASES_MAX, COMPASES_MIN } from '../../../stores/useConstructorStore';
import IconButton from '../../shared/IconButton/IconButton';
import styles from './TransporteProgresion.module.css';

interface Props {
  bpm: number;
  metronomo: boolean;
  loop: boolean;
  reproduciendo: boolean;
  onBpm: (n: number) => void;
  onMetronomo: () => void;
  onLoop: () => void;
  onPlay: () => void;
  onPausa: () => void;
  onLimpiar: () => void;
  /** Etiquetas de los botones con glifo; vienen de la sección (i18n). */
  labels: {
    reproducir: string;
    pausar: string;
    limpiar: string;
    metronomo: string;
    loop: string;
    velocidad: string;
    bpm: string;
    bpmValor: (bpm: number) => string;
  };
}

interface MedidaProps {
  compas: Compas;
  nCompases: number;
  onCompas: (c: Compas) => void;
  onNCompases: (n: number) => void;
  /** Rótulos; vienen de la sección (i18n). */
  labels: { compas: string; compases: string; mundo: (mundo: Mundo) => string };
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

// Signo de repetición de la partitura (‖: :‖): barra gruesa, barra fina y
// los dos puntos, a cada lado.
function SignoRepeticion() {
  return (
    <svg viewBox="0 0 28 20" className={styles.glifo} aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="3" height="16" />
      <rect x="6" y="2" width="1" height="16" />
      <circle cx="10" cy="7.5" r="1.4" />
      <circle cx="10" cy="12.5" r="1.4" />
      <circle cx="18" cy="7.5" r="1.4" />
      <circle cx="18" cy="12.5" r="1.4" />
      <rect x="21" y="2" width="1" height="16" />
      <rect x="24" y="2" width="3" height="16" />
    </svg>
  );
}

// Play y pausa, los de cualquier reproductor: el profesor pidió "el símbolo de
// play, y cuando le pongo play que cambie a símbolo de pausa".
function Play() {
  return (
    <svg viewBox="0 0 20 20" className={styles.glifo} aria-hidden="true" focusable="false">
      <path d="M5 3 L17 10 L5 17 Z" />
    </svg>
  );
}

function Pausa() {
  return (
    <svg viewBox="0 0 20 20" className={styles.glifo} aria-hidden="true" focusable="false">
      <rect x="4" y="3" width="4" height="14" />
      <rect x="12" y="3" width="4" height="14" />
    </svg>
  );
}

// Borrador: cuerpo inclinado con su punta, y la línea que deja al borrar.
function Borrador() {
  return (
    <svg viewBox="0 0 24 20" className={styles.glifoLinea} aria-hidden="true" focusable="false">
      <path d="M9 17 L3 11 L12 2 L20 10 L13 17 Z" />
      <path d="M7.5 6.5 L15.5 14.5" />
      <path d="M13 17 H22" />
    </svg>
  );
}

// Reunión 19/10/26: "antes de yo pensar acordes y todo eso, tengo que saber
// qué compás estoy". El compás y la cantidad de compases van al principio de
// la sección, separados del transporte.
export function MedidaProgresion(p: MedidaProps) {
  return (
    <div className={styles.wrap}>
      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{p.labels.compas}</legend>
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
              <span className={styles.mundo}>{p.labels.mundo(MUNDO_POR_COMPAS[c])}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{p.labels.compases}</legend>
        <input
          type="number"
          className={styles.numero}
          min={COMPASES_MIN}
          max={COMPASES_MAX}
          value={p.nCompases}
          onChange={(e) => p.onNCompases(Number(e.target.value))}
        />
      </fieldset>
    </div>
  );
}

export default function TransporteProgresion(p: Props) {
  return (
    <div className={styles.wrap}>
      <fieldset className={styles.grupo}>
        <legend className={styles.legend}>{p.labels.velocidad}</legend>
        <div className={styles.slider}>
          <Tortuga />
          <input
            type="range"
            min={BPM_MIN}
            max={BPM_MAX}
            step={1}
            value={p.bpm}
            aria-label={p.labels.bpm}
            aria-valuetext={p.labels.bpmValor(p.bpm)}
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
        <IconButton
          label={p.reproduciendo ? p.labels.pausar : p.labels.reproducir}
          playing={p.reproduciendo}
          onClick={p.reproduciendo ? p.onPausa : p.onPlay}
        >
          {p.reproduciendo ? <Pausa /> : <Play />}
        </IconButton>
        <button type="button" className={styles.chip} aria-pressed={p.metronomo} onClick={p.onMetronomo}>
          {p.labels.metronomo}
        </button>
        <IconButton label={p.labels.loop} pressed={p.loop} onClick={p.onLoop}>
          <SignoRepeticion />
        </IconButton>
        <IconButton label={p.labels.limpiar} onClick={p.onLimpiar}>
          <Borrador />
        </IconButton>
      </div>
    </div>
  );
}
