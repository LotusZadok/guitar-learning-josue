import { useTranslation } from 'react-i18next';
import styles from './ProcessControls.module.css';

// Barra de controles de un proceso paso a paso (anterior / reproducir /
// siguiente + velocidad). Única copia: la consumen §1.6, §1.7 y los procesos de
// T2. Es sólo la barra de controles · no toma decisiones de chrome editorial.

// Reunión 22/11/26 (#14, D8): el ▶ de reproducir se confundía con "siguiente
// paso" (▶▶), y en iOS U+25B6 sale como emoji. Pasan a iconos lineales de
// Lucide v0.460.0 (`skip-back`, `play`, `pause`, `skip-forward`) copiados en
// línea, como en TransporteProgresion. Licencia ISC: ver
// primitives/TransporteProgresion/LUCIDE-LICENSE.txt.
function PasoAnterior() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icono} aria-hidden="true" focusable="false">
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" x2="5" y1="19" y2="5" />
    </svg>
  );
}

// También lo usan las celdas tocables de GradosArmonicos (§2.6, 27/11/26).
export function Reproducir({ className = styles.icono }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function Pausa() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icono} aria-hidden="true" focusable="false">
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PasoSiguiente() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icono} aria-hidden="true" focusable="false">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" x2="19" y1="5" y2="19" />
    </svg>
  );
}

interface Props {
  currentStep: number;
  maxSteps: number;
  mode: 'idle' | 'playing' | 'paused';
  speed: 'normal' | 'slow';
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSpeedChange: (s: 'normal' | 'slow') => void;
}

export default function ProcessControls({
  currentStep,
  maxSteps,
  mode,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSpeedChange,
}: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const playing = mode === 'playing';
  const playLabel = playing
    ? isDe
      ? 'Pausieren'
      : 'Pausar'
    : isDe
      ? 'Abspielen'
      : 'Reproducir';

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.ctrl}
        onClick={onPrev}
        disabled={currentStep <= 0}
        aria-label={isDe ? 'Vorheriger Schritt' : 'Paso anterior'}
      >
        <PasoAnterior />
      </button>
      <button
        type="button"
        className={styles.ctrl}
        onClick={playing ? onPause : onPlay}
        aria-label={playLabel}
      >
        {playing ? <Pausa /> : <Reproducir />}
      </button>
      <button
        type="button"
        className={styles.ctrl}
        onClick={onNext}
        disabled={currentStep >= maxSteps}
        aria-label={isDe ? 'Nächster Schritt' : 'Paso siguiente'}
      >
        <PasoSiguiente />
      </button>
      <span className={styles.spacer} />
      <label className={styles.speedWrap}>
        <span className={styles.speedLabel}>{isDe ? 'Tempo' : 'Velocidad'}</span>
        <select
          className={styles.speedSelect}
          value={speed}
          onChange={(e) => onSpeedChange(e.target.value as 'normal' | 'slow')}
        >
          <option value="normal">normal</option>
          <option value="slow">{isDe ? 'langsam' : 'lento'}</option>
        </select>
      </label>
    </div>
  );
}
