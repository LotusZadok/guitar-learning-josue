import { useUIStore } from '../../stores/useUIStore';
import { ALL } from '../../data/notes';
import { noteShort } from '../../utils/noteCalculations';
import type { ChromaticNote } from '../../types/music';
import styles from './TonicSelector.module.css';

export default function TonicSelector() {
  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);

  return (
    <div className={styles.wrap}>
      <label htmlFor="tonic-select" className={styles.label}>
        TONALIDAD
      </label>
      <select
        id="tonic-select"
        className={styles.select}
        value={tonic}
        onChange={(e) => setTonic(e.target.value as ChromaticNote)}
      >
        {ALL.map((note) => (
          <option key={note} value={note}>
            {noteShort(note)}
          </option>
        ))}
      </select>
    </div>
  );
}
