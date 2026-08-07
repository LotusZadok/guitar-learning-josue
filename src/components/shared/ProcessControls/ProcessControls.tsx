import { useTranslation } from 'react-i18next';
import styles from './ProcessControls.module.css';

// Barra de controles de un proceso paso a paso (◀ / ▶ / ▶▶ + velocidad).
// Única copia: la consumen §1.6, §1.7 y los procesos de T2. Es sólo la barra
// de controles · no toma decisiones de chrome editorial.

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
        ◀
      </button>
      <button
        type="button"
        className={styles.ctrl}
        onClick={playing ? onPause : onPlay}
        aria-label={playLabel}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <button
        type="button"
        className={styles.ctrl}
        onClick={onNext}
        disabled={currentStep >= maxSteps}
        aria-label={isDe ? 'Nächster Schritt' : 'Paso siguiente'}
      >
        ▶▶
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
