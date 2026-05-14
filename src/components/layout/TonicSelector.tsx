import { useUIStore } from '../../stores/useUIStore';
import { ALL } from '../../data/notes';
import { noteShort } from '../../utils/noteCalculations';
import type { ChromaticNote } from '../../types/music';
import styles from './TonicSelector.module.css';

// D#/G#/A# are spelled as flats by the method (ENHARMONIC_REDIRECT).
// Show the flat label so the selector matches the output of chordSpelled / majorScaleSpelled.
const FLAT_LABELS: Partial<Record<ChromaticNote, string>> = {
  'D#': 'E♭', 'G#': 'A♭', 'A#': 'B♭',
};
const noteLabel = (n: ChromaticNote) => FLAT_LABELS[n] ?? noteShort(n);

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
            {noteLabel(note)}
          </option>
        ))}
      </select>
    </div>
  );
}
