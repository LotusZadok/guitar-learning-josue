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
// Trazos de Lucide v0.460.0 (`turtle`, `rabbit`), copiados en línea para no
// sumar una dependencia por dos iconos. Licencia ISC: ver LUCIDE-LICENSE.txt
// en esta carpeta. Decisión del dueño (20/10/26), aunque el profesor elogió
// los dibujados a mano.
function Tortuga() {
  return (
    <svg viewBox="0 0 24 24" className={styles.bicho} aria-hidden="true" focusable="false">
      <path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z" />
      <path d="M4.82 7.9 8 10" />
      <path d="M15.18 7.9 12 10" />
      <path d="M16.93 10H20a2 2 0 0 1 0 4H2" />
    </svg>
  );
}

function Conejo() {
  return (
    <svg viewBox="0 0 24 24" className={styles.bicho} aria-hidden="true" focusable="false">
      <path d="M13 16a3 3 0 0 1 2.24 5" />
      <path d="M18 12h.01" />
      <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3" />
      <path d="M20 8.54V4a2 2 0 1 0-4 0v3" />
      <path d="M7.612 12.524a3 3 0 1 0-1.6 4.3" />
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
