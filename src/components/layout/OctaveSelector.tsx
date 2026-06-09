import { useTranslation } from 'react-i18next';
import { useUIStore, OCTAVE_MIN, OCTAVE_MAX } from '../../stores/useUIStore';
import styles from './OctaveSelector.module.css';

// Registro base global: la octava elegida es la altura de la nota más grave
// (la tónica) y todo ejemplo asciende desde ahí. Default C3, rango C1–C5.
export default function OctaveSelector() {
  const octave = useUIStore((s) => s.octave);
  const setOctave = useUIStore((s) => s.setOctave);
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{isDe ? 'OKTAVE' : 'OCTAVA'}</span>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.step}
          onClick={() => setOctave(octave - 1)}
          disabled={octave <= OCTAVE_MIN}
          aria-label={isDe ? 'Oktave tiefer' : 'Octava más grave'}
        >
          −
        </button>
        <span className={styles.value} aria-live="polite">C{octave}</span>
        <button
          type="button"
          className={styles.step}
          onClick={() => setOctave(octave + 1)}
          disabled={octave >= OCTAVE_MAX}
          aria-label={isDe ? 'Oktave höher' : 'Octava más aguda'}
        >
          +
        </button>
      </div>
    </div>
  );
}
