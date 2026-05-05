import styles from './ProcessControls.module.css';

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
  currentStep, maxSteps, mode, speed,
  onPlay, onPause, onNext, onPrev, onSpeedChange,
}: Props) {
  const atStart = currentStep <= 0;
  const atEnd = currentStep >= maxSteps;

  return (
    <div className={styles.bar}>
      <div className={styles.buttons}>
        <button
          className={styles.btn}
          onClick={onPrev}
          disabled={atStart}
          title="Anterior"
          aria-label="Anterior"
        >
          ◀
        </button>
        <button
          className={styles.btn}
          onClick={mode === 'playing' ? onPause : onPlay}
          title={mode === 'playing' ? 'Pausar' : 'Reproducir'}
          aria-label={mode === 'playing' ? 'Pausar' : 'Reproducir'}
        >
          {mode === 'playing' ? '⏸' : '▶'}
        </button>
        <button
          className={styles.btn}
          onClick={onNext}
          disabled={atEnd}
          title="Siguiente"
          aria-label="Siguiente"
        >
          ▶▶
        </button>
      </div>

      <div className={styles.speed}>
        <span className={styles.speedLabel} id="process-speed-label">velocidad:</span>
        <select
          className={styles.select}
          value={speed}
          onChange={e => onSpeedChange(e.target.value as 'normal' | 'slow')}
          aria-label="Velocidad"
          aria-labelledby="process-speed-label"
        >
          <option value="normal">normal</option>
          <option value="slow">lento</option>
        </select>
      </div>
    </div>
  );
}
