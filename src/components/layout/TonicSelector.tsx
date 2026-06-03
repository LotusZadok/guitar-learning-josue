import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import { noteShort } from '../../utils/noteCalculations';
import type { Tonic } from '../../types/music';
import styles from './TonicSelector.module.css';

// Cada altura negra aparece con sus dos grafías como opciones independientes:
// elegir C♯ y elegir D♭ dan la misma altura pero distinta ortografía de escala.
const TONIC_OPTIONS: Tonic[] = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F',
  'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
];

export default function TonicSelector() {
  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  return (
    <div className={styles.wrap}>
      <label htmlFor="tonic-select" className={styles.label}>
        {isDe ? 'TONART' : 'TÓNICA'}
      </label>
      <select
        id="tonic-select"
        className={styles.select}
        value={tonic}
        onChange={(e) => setTonic(e.target.value as Tonic)}
      >
        {TONIC_OPTIONS.map((note) => (
          <option key={note} value={note}>
            {noteShort(note)}
          </option>
        ))}
      </select>
      <span className={styles.hint}>
        {isDe ? 'Transponiert Tonleitern, Akkorde und Stufen' : 'Transpone escalas, acordes y grados'}
      </span>
    </div>
  );
}
